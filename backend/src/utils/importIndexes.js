// The live database is authoritative. Never drop an index from an application request.
const REQUIRED = [
  {collection:'customers', key:{user:1,customerId:1}, name:'patron_unique_workspace_customer'},
  {collection:'transactions', key:{user:1,transactionId:1}, name:'patron_unique_workspace_transaction'},
  {collection:'customerfeatures', key:{customer:1}, name:'patron_unique_customer_feature'},
  {collection:'customerpredictions', key:{customer:1}, name:'patron_unique_customer_prediction'}
];
const sameKey=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const matches=(index,spec)=>index.unique===true && !index.sparse && !index.partialFilterExpression && (!index.collation || index.collation.locale==='simple') && sameKey(index.key,spec.key);
async function listIndexes(collection) {
  try{return await collection.listIndexes().toArray();}
  catch(e){if(e.code===26)return [];throw e;}
}
async function inspectIndexes(db,{checkData=false}={}) {
  const report=[];
  for(const spec of REQUIRED){
    const c=db.collection(spec.collection), indexes=await listIndexes(c);
    const item={...spec, present:indexes.some(i=>matches(i,spec)), indexes:indexes.map(i=>({name:i.name,key:i.key,unique:!!i.unique,sparse:!!i.sparse,partial:!!i.partialFilterExpression,collation:i.collation?.locale})), otherUniqueIndexes:indexes.filter(i=>i.unique && i.name!=='_id_' && !matches(i,spec)).map(i=>({name:i.name,key:i.key}))};
    if(checkData){
      const fields=Object.keys(spec.key);
      const grouped=await c.aggregate([{$group:{_id:Object.fromEntries(fields.map(f=>[f,`$${f}`])),n:{$sum:1}}},{$match:{n:{$gt:1}}},{$count:'groups'}],{allowDiskUse:true}).toArray();
      item.duplicateGroups=grouped[0]?.groups||0;
      item.invalidIdentityRows=await c.countDocuments({$or:fields.map(f=>({$expr:{$or:[{$ne:[{$type:`$${f}`},f==='user'||f==='customer'?'objectId':'string']},{$eq:[`$${f}`,'']}]}}))});
    }
    report.push(item);
  }
  return report;
}
module.exports={REQUIRED,inspectIndexes,matches};
