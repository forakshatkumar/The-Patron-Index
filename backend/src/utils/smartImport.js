const mongoose=require('mongoose');
const crypto=require('node:crypto');
const {parseImport,planImport,equalFields}=require('./importPlan');
const {inspectIndexes}=require('./importIndexes');
const {calculatePatronIndex,classifyCustomer,recommendationFor}=require('./customerScoring');
const Customer=require('../models/Customer');
const Transaction=require('../models/Transaction');
const CustomerFeature=require('../models/CustomerFeature');
const CustomerPrediction=require('../models/CustomerPrediction');
const round=n=>Number(Number(n).toFixed(2));
const purchases={source:{$ne:'summary'},product:{$ne:'Direct Order'}};
const fieldDiff=(old,fields)=>Object.fromEntries(Object.entries(fields).filter(([k,v])=>!old||old[k]!==v));
function scoring(total, now){
  const frequency=total?.totalOrders||0, monetary=round(total?.totalSpent||0);
  const recency=total?.latestPurchase?Math.max(0,Math.floor((now-new Date(total.latestPurchase))/86400000)):0;
  const features={recency,frequency,monetary,averageOrderValue:frequency?round(monetary/frequency):0};
  const patronIndex=calculatePatronIndex(features),segment=classifyCustomer({...features,patronIndex});
  return {features,prediction:{segment,patronIndex,atRiskProbability:null,recommendation:recommendationFor(segment),modelVersion:'rfm-v1'}};
}
const placeholder=(owner,id)=>`import-${crypto.createHash('sha256').update(`${owner}:${id}`).digest('hex')}@patron.local`;
function summary(outcomes, counts={}){
  const errors=outcomes.filter(r=>r.status==='failed');
  return {processedRows:outcomes.length,rowsApplied:outcomes.filter(r=>r.status==='applied').length,rowsSkipped:outcomes.filter(r=>r.status==='skipped').length,rowsFailed:errors.length,purchasesAdded:0,purchasesCorrected:0,customersCreated:0,customersUpdated:0,customersReconciled:0, ...counts, completion:errors.length?(errors.length===outcomes.length?'rejected':'partial'):'complete',errors:errors.slice(0,100).map(({row,reason})=>({row,reason})),errorDetailsOmitted:Math.max(0,errors.length-100)};
}
async function totalsFor(owner,ids,session){
  const totals=await Transaction.aggregate([{$match:{user:owner,customerId:{$in:ids},...purchases}},{$group:{_id:'$customerId',totalSpent:{$sum:'$amount'},totalOrders:{$sum:1},latestPurchase:{$max:'$date'}}}]).session(session);
  return new Map(totals.map(t=>[t._id,t]));
}
async function runImport(buffer,ownerValue){
  if(!mongoose.isValidObjectId(ownerValue))throw Object.assign(Error('Authentication required'),{status:401});
  const owner=new mongoose.Types.ObjectId(ownerValue), rows=parseImport(buffer);
  const valid=rows.filter(r=>!r.error&&!r.duplicateOf);
  if(!valid.length)return summary(rows.map(r=>({row:r.row,status:'failed',reason:r.error||'Duplicate of rejected row'})));
  const db=mongoose.connection.db;
  const indexes=await inspectIndexes(db);
  if(indexes.some(r=>!r.present))throw Object.assign(Error('Smart import requires the database index setup. Ask the administrator to run the import index audit.'),{status:503,importIndexSetup:true});
  // A durable workspace mutex: the first write of the transaction locks this document.
  // MongoDB automatically retries write conflicts; no process-local mutex is required.
  const locks=db.collection('patron_import_locks');
  try{await locks.updateOne({_id:owner},{$setOnInsert:{revision:0}},{upsert:true});}
  catch(e){if(e.code!==11000||!await locks.findOne({_id:owner}))throw e;}
  const session=await mongoose.startSession();
  try{
    const work=async()=>{
      const lock=await locks.updateOne({_id:owner},{$inc:{revision:1}},{session});
      if(lock.matchedCount!==1)throw Error('Import workspace lock missing');
      const customerIds=[...new Set(valid.map(r=>r.customerId))];
      const txnIds=[...new Set(valid.map(r=>r.transactionId))];
      const dates=[...new Set(valid.map(r=>r.fields.date))];
      const customers=await Customer.find({user:owner,customerId:{$in:customerIds}}).session(session).lean();
      const transactions=await Transaction.find({user:owner,$or:[{transactionId:{$in:txnIds}},{customerId:{$in:customerIds},date:{$in:dates}},{customerId:{$in:customerIds},$or:[{source:'summary'},{product:'Direct Order'}]}]}).session(session).lean();
      const before=await totalsFor(owner,customerIds,session);
      const manualIds=new Set(transactions.filter(t=>t.source==='summary'||t.product==='Direct Order').map(t=>t.customerId));
      for(const c of customers)if(!before.has(c.customerId)&&(c.totalOrders>0||c.totalSpent>0))manualIds.add(c.customerId);
      const plan=planImport(rows,{customers,transactions,manualIds});
      const now=new Date();
      const txnOps=plan.transactionChanges.map(t=>t.kind==='added'?{updateOne:{filter:{user:owner,transactionId:t.record.transactionId},update:{$setOnInsert:{...t.record,user:owner,createdAt:now,updatedAt:now}},upsert:true,timestamps:false}}:{updateOne:{filter:{_id:t.old._id,user:owner,customerId:t.old.customerId},update:{$set:{...t.patch,updatedAt:now}},timestamps:false}});
      if(txnOps.length){
        const result=await Transaction.bulkWrite(txnOps,{session,ordered:true});
        const adds=plan.transactionChanges.filter(t=>t.kind==='added').length;
        if(result.upsertedCount!==adds||result.matchedCount!==txnOps.length-adds)throw Error('Purchase write did not match the import plan; retry the file');
      }
      const affected=[...plan.profiles.keys()];
      if(!affected.length)return summary(plan.outcomes);
      const totals=await totalsFor(owner,affected,session);
      const knownIds=[...plan.profiles.values()].filter(p=>p.old).map(p=>p.old._id);
      const featureDocs=await CustomerFeature.find({customer:{$in:knownIds}}).session(session).lean();
      const predictionDocs=await CustomerPrediction.find({customer:{$in:knownIds}}).session(session).lean();
      const featureMap=new Map(featureDocs.map(d=>[String(d.customer),d]));
      const predictionMap=new Map(predictionDocs.map(d=>[String(d.customer),d]));
      const changedPurchases=new Set(plan.transactionChanges.map(t=>t.kind==='added'?t.record.customerId:t.old.customerId));
      const outcomeByRow=new Map(plan.outcomes.map(o=>[o.row,o]));
      const customerOps=[],featureOps=[],predictionOps=[];
      let customersCreated=0,customersUpdated=0,customersReconciled=0;
      for(const [id,p] of plan.profiles){
        const old=p.old, customerKey=old?._id||new mongoose.Types.ObjectId(), total=totals.get(id);
        const calculated=scoring(total,now);
        const newTotals={totalSpent:calculated.features.monetary,totalOrders:calculated.features.frequency};
        const oldFeature=featureMap.get(String(customerKey)),oldPrediction=predictionMap.get(String(customerKey));
        const totalsChanged=!old||!equalFields(old,newTotals);
        const historyChanged=changedPurchases.has(id);
        const oldFrequency=oldFeature?.frequency, oldMonetary=oldFeature?.monetary;
        const repair=!!old&&(totalsChanged||!oldFeature||!oldPrediction||oldFrequency!==newTotals.totalOrders||oldMonetary!==newTotals.totalSpent);
        const refresh=!old||historyChanged||repair;
        const profileChanged=Object.keys(p.patch).length>0;
        if(!old){
          customersCreated++;
          customerOps.push({updateOne:{filter:{user:owner,customerId:id},update:{$setOnInsert:{_id:customerKey,user:owner,customerId:id,name:p.patch.name,email:p.patch.email||placeholder(owner,id),...newTotals,createdAt:now,updatedAt:now}},upsert:true,timestamps:false}});
        }else{
          if(profileChanged||historyChanged)customersUpdated++;
          if(repair&&!historyChanged){customersReconciled++;const o=outcomeByRow.get(p.rows[0]);if(o?.status==='skipped'){o.status='applied';o.reason='Reconciled stored customer totals';}}
          const patch={...p.patch,...fieldDiff(old,newTotals)};
          if(Object.keys(patch).length)customerOps.push({updateOne:{filter:{_id:customerKey,user:owner},update:{$set:{...patch,updatedAt:now}},timestamps:false}});
        }
        if(refresh){
          for(const [doc,fields,ops] of [[oldFeature,calculated.features,featureOps],[oldPrediction,calculated.prediction,predictionOps]]){
            const diff=fieldDiff(doc,fields);
            if(Object.keys(diff).length)ops.push({updateOne:{filter:{customer:customerKey},update:{$set:{...diff,updatedAt:now},$setOnInsert:{createdAt:now}},upsert:true,timestamps:false}});
          }
        }
      }
      if(customerOps.length){
        const result=await Customer.bulkWrite(customerOps,{session,ordered:true});
        if(result.upsertedCount!==customersCreated||result.matchedCount!==customerOps.length-customersCreated)throw Error('Customer write did not match the import plan; retry the file');
      }
      if(featureOps.length)await CustomerFeature.bulkWrite(featureOps,{session,ordered:true});
      if(predictionOps.length)await CustomerPrediction.bulkWrite(predictionOps,{session,ordered:true});
      return summary(plan.outcomes,{customersCreated,customersUpdated,customersReconciled,purchasesAdded:plan.transactionChanges.filter(t=>t.kind==='added').length,purchasesCorrected:plan.transactionChanges.filter(t=>t.kind==='corrected').length});
    };
    // An outside customer-creation request may race with the first insert. Only
    // retry confirmed identity-index conflicts, never a generic duplicate error.
    for(let attempt=0;;attempt++){
      try{return await session.withTransaction(work,{readConcern:{level:'snapshot'},writeConcern:{w:'majority'},readPreference:'primary',maxCommitTimeMS:10000});}
      catch(e){
        const pattern=e.keyPattern||e.errorResponse?.keyPattern||e.writeErrors?.[0]?.err?.keyPattern;
        const expected=e.code===11000&&(JSON.stringify(pattern)==='{"user":1,"customerId":1}'||JSON.stringify(pattern)==='{"user":1,"transactionId":1}'||/index: patron_unique_workspace_(customer|transaction)\s+dup key/i.test(e.message||''));
        if(attempt>=1||!expected||e.hasErrorLabel?.('UnknownTransactionCommitResult'))throw e;
      }
    }
  }finally{await session.endSession();}
}
module.exports={runImport,summary,scoring};
