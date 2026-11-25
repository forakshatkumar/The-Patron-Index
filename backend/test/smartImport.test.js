const test=require('node:test');
const assert=require('node:assert/strict');
const {parseImport,planImport}=require('../src/utils/importPlan');
const {summary,scoring}=require('../src/utils/smartImport');
const {inspectIndexes,REQUIRED}=require('../src/utils/importIndexes');
const header='customer_id,name,purchase_date,amount,transaction_id,email,product\n';
const buffer=(...rows)=>Buffer.from(header+rows.join('\n'));
const row=(id='001',name='Ada',date='2026-11-20',amount=1000,tx='T1',email='',product='')=>[id,name,date,amount,tx,email,product].join(',');
const fixture=()=>({customers:[],transactions:[],manualIds:new Set()});
function apply(text,db){
  const plan=planImport(parseImport(text),db);
  for(const op of plan.transactionChanges){if(op.kind==='added')db.transactions.push({...op.record});else Object.assign(db.transactions.find(t=>t.transactionId===op.old.transactionId),op.patch);}
  for(const [id,p] of plan.profiles){if(p.old)Object.assign(p.old,p.patch);else db.customers.push({customerId:id,...p.patch});}
  return plan;
}
const revenue=db=>db.transactions.reduce((s,t)=>s+t.amount,0);
test('new rows, replay, repeat customers, purchase corrections and profile-only updates',()=>{
  const db=fixture(), original=buffer(row(),row('001','Ada','2026-11-21',200,'T2'));
  const first=apply(original,db);assert.equal(first.transactionChanges.length,2);assert.equal(db.customers.length,1);assert.equal(revenue(db),1200);
  const before=structuredClone(db);const replay=apply(original,db);assert.equal(replay.transactionChanges.length,0);assert.equal(summary(replay.outcomes).rowsSkipped,2);assert.deepEqual(db,before);
  const correction=apply(buffer(row('001','Ada','2026-11-20',800,'T1')),db);assert.equal(correction.transactionChanges[0].kind,'corrected');assert.equal(revenue(db),1000);assert.equal(db.transactions.length,2);
  const name=apply(buffer(row('001','Ada Updated','2026-11-20',800,'T1','ada@example.com')),db);assert.equal(name.transactionChanges.length,0);assert.equal(summary(name.outcomes).rowsApplied,1);assert.equal(db.customers[0].name,'Ada Updated');
  apply(buffer(row('001','','2026-11-20',800,'T1')),db);assert.equal(db.customers[0].name,'Ada Updated');assert.equal(db.customers[0].email,'ada@example.com');
});
test('identical IDs within a file skip; conflicting IDs reject all conflicting rows; IDs preserve leading zeros',()=>{
  const db=fixture();const result=apply(buffer(row(),row(),row('002','Ben','2026-11-20',100,'T9'),row('002','Ben','2026-11-20',200,'T9')),db);
  assert.equal(db.customers[0].customerId,'001');assert.equal(result.transactionChanges.length,1);const s=summary(result.outcomes);assert.deepEqual([s.rowsApplied,s.rowsSkipped,s.rowsFailed],[1,1,2]);assert.equal(s.completion,'partial');
  assert.equal(apply(buffer(row('009','Eve','2026-11-20',1000,'T1')),db).outcomes[0].status,'failed');
});
test('separate workspaces can reuse customer and transaction IDs; distinct explicit IDs can share date and amount',()=>{
  const a=fixture(),b=fixture();apply(buffer(row(),row('001','Ada','2026-11-20',1000,'T2')),a);apply(buffer(row('001','Different','2026-11-20',500,'T1')),b);
  assert.equal(revenue(a),2000);assert.equal(revenue(b),500);assert.equal(a.customers[0].name,'Ada');assert.equal(b.customers[0].name,'Different');
});
test('anonymous exact-file replay, changed-file ambiguity and identical anonymous rows',()=>{
  const db=fixture(),anonymous=buffer(row('001','Ada','2026-11-20',1000,''));
  assert.equal(apply(anonymous,db).transactionChanges.length,1);assert.equal(apply(anonymous,db).outcomes[0].status,'skipped');
  assert.equal(apply(buffer(row('001','Changed','2026-11-20',1000,'')),db).outcomes[0].status,'failed');
  assert.equal(apply(buffer(row()),db).outcomes[0].status,'failed');
  const other=fixture();const ambiguous=apply(buffer(row('001','Ada','2026-11-20',1000,''),row('001','Ada','2026-11-20',1000,'')),other);assert.equal(summary(ambiguous.outcomes).rowsFailed,2);assert.equal(other.transactions.length,0);
});
test('row-level validation, manual summaries, blank new name, and malformed CSV',()=>{
  const db=fixture();db.manualIds.add('manual');
  const p=apply(buffer(row(),row('002','Ben','2026-02-30',10,'T2'),row('manual','Manual','2026-11-20',10,'T3'),row('003','','2026-11-20',10,'T4'),row('004','D','2026-11-20',1.234,'T5')),db);
  assert.equal(summary(p.outcomes).rowsFailed,4);assert.equal(db.transactions.length,1);assert.throws(()=>parseImport(Buffer.from('customer_id,name,purchase_date,amount\n1,"broken')));
});
test('legacy partial write can reconstruct profile without inserting the purchase again; RFM totals remain correct',()=>{
  const db=fixture();const data=buffer(row());db.transactions.push({...planImport(parseImport(data),db).transactionChanges[0].record});
  const result=apply(data,db);assert.equal(result.transactionChanges.length,0);assert.equal(result.profiles.size,1);assert.equal(db.customers.length,1);
  apply(buffer(row('001','Ada','2026-11-22',800,'T1')),db);
  const calculated=scoring({totalOrders:1,totalSpent:revenue(db),latestPurchase:'2026-11-22'},new Date('2026-11-25'));
  assert.deepEqual(calculated.features,{recency:3,frequency:1,monetary:800,averageOrderValue:800});assert.equal(calculated.prediction.segment,'New');
});
test('index audit flags missing scoped unique indexes and reports legacy unique names',async()=>{
  const indexMap=new Map(REQUIRED.map(s=>[s.collection,[{name:'_id_',key:{_id:1},unique:true},{name:s.name,key:s.key,unique:true}]]));
  indexMap.get('transactions')[1]={name:'transactionId_1',key:{transactionId:1},unique:true};
  const db={collection:name=>({listIndexes:()=>({toArray:async()=>indexMap.get(name)})})};
  const result=await inspectIndexes(db);assert.equal(result.find(r=>r.collection==='transactions').present,false);assert.equal(result.find(r=>r.collection==='transactions').otherUniqueIndexes[0].name,'transactionId_1');
});

test('database adapter writes scoped totals atomically; replay, simulated concurrency and rollback',async t=>{
  const mongoose=require('mongoose');
  const {runImport}=require('../src/utils/smartImport');
  const models=['Customer','Transaction','CustomerFeature','CustomerPrediction'].map(n=>require('../src/models/'+n));
  const [Customer,Transaction,Feature,Prediction]=models;
  let data=new Map(models.map(m=>[m,[]]));
  const copies=()=>new Map([...data].map(([m,docs])=>[m,docs.map(d=>({...d}))]));
  const same=(a,b)=>a instanceof mongoose.Types.ObjectId||b instanceof mongoose.Types.ObjectId?String(a)===String(b):a===b;
  const match=(doc,filter)=>Object.entries(filter).every(([k,v])=>k==='$or'?v.some(f=>match(doc,f)):v&&typeof v==='object'&&'$in'in v?v.$in.some(a=>same(doc[k],a)):v&&typeof v==='object'&&'$ne'in v?!same(doc[k],v.$ne):same(doc[k],v));
  const query=(m,filter)=>({session(){return this},lean:async()=>data.get(m).filter(d=>match(d,filter)).map(d=>({...d}))});
  let fail=false;
  for(const m of models){
    t.mock.method(m,'find',filter=>query(m,filter));
    t.mock.method(m,'bulkWrite',async ops=>{
      if(m===Feature&&fail)throw Error('simulated mid-import failure');
      let upsertedCount=0,matchedCount=0;
      for(const {updateOne:o} of ops){
        let d=data.get(m).find(d=>match(d,o.filter));
        if(d){matchedCount++;Object.assign(d,o.update.$set);}
        else if(o.upsert){upsertedCount++;d={...o.filter,_id:new mongoose.Types.ObjectId(),...o.update.$setOnInsert,...o.update.$set};data.get(m).push(d);}
      }
      return {upsertedCount,matchedCount};
    });
  }
  t.mock.method(Transaction,'aggregate',pipeline=>({session:async()=>{
    const result=new Map();for(const tx of data.get(Transaction).filter(d=>match(d,pipeline[0].$match))){const v=result.get(tx.customerId)||{_id:tx.customerId,totalSpent:0,totalOrders:0,latestPurchase:''};v.totalSpent+=tx.amount;v.totalOrders++;if(tx.date>v.latestPurchase)v.latestPurchase=tx.date;result.set(tx.customerId,v);}return [...result.values()];
  }}));
  const originalDb=mongoose.connection.db;
  mongoose.connection.db={collection:name=>name==='patron_import_locks'?{updateOne:async()=>({matchedCount:1})}:{listIndexes:()=>({toArray:async()=>REQUIRED.filter(s=>s.collection===name).map(s=>({name:s.name,key:s.key,unique:true}))})}};
  t.after(()=>{mongoose.connection.db=originalDb});
  // This fake serializes transactions to model the database's lock, not to claim a live DB concurrency test.
  let queue=Promise.resolve();
  t.mock.method(mongoose,'startSession',async()=>({endSession:async()=>{},withTransaction:fn=>{const next=queue.then(async()=>{const old=copies();try{return await fn();}catch(e){data=old;throw e;}});queue=next.catch(()=>{});return next;}}));
  const owner=new mongoose.Types.ObjectId(),other=new mongoose.Types.ObjectId();
  const csv=buffer(row(),row('001','Ada','2026-11-21',200,'T2'));
  const results=await Promise.all([runImport(csv,owner),runImport(csv,owner)]);
  assert.deepEqual(results.map(r=>r.purchasesAdded),[2,0]);assert.equal(results[1].rowsSkipped,2);
  assert.equal(data.get(Customer)[0].totalSpent,1200);assert.equal(data.get(Customer)[0].totalOrders,2);assert.equal(data.get(Feature)[0].frequency,2);
  await runImport(buffer(row('001','Different','2026-11-20',50,'T1')),other);assert.equal(data.get(Customer).length,2);
  const corrected=await runImport(buffer(row('001','Ada','2026-11-20',800,'T1')),owner);assert.equal(corrected.purchasesCorrected,1);assert.equal(data.get(Customer).find(d=>same(d.user,owner)).totalSpent,1000);
  const oldCount=data.get(Transaction).length;fail=true;const newRow=buffer(row('003','New','2026-11-20',60,'T3'));
  await assert.rejects(()=>runImport(newRow,owner),/simulated mid-import failure/);assert.equal(data.get(Transaction).length,oldCount);assert.equal(data.get(Customer).length,2);
  fail=false;const retry=await runImport(newRow,owner);assert.equal(retry.purchasesAdded,1);assert.equal(data.get(Customer).length,3);
});
