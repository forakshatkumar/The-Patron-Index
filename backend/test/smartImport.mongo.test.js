// Opt-in integration test: uses a fresh randomly named database on a TEST replica set only.
const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const mongoose=require('mongoose');
const {REQUIRED}=require('../src/utils/importIndexes');
const {runImport}=require('../src/utils/smartImport');
const Customer=require('../src/models/Customer');
const Transaction=require('../src/models/Transaction');
const Feature=require('../src/models/CustomerFeature');
const uri=process.env.SMART_IMPORT_TEST_URI;
test('real MongoDB integration: concurrent replay, correction, owner isolation and ledger repair', {skip:!uri,timeout:120000},async()=>{
  const dbName=`patron_import_test_${crypto.randomBytes(8).toString('hex')}`;
  await mongoose.connect(uri,{dbName,autoIndex:false,autoCreate:false,serverSelectionTimeoutMS:8000});
  try{
    for(const r of REQUIRED)await mongoose.connection.db.collection(r.collection).createIndex(r.key,{name:r.name,unique:true});
    const owner=new mongoose.Types.ObjectId(),other=new mongoose.Types.ObjectId();
    const csv=(...rows)=>Buffer.from('customer_id,name,purchase_date,amount,transaction_id\n'+rows.join('\n'));
    const initial=csv('001,Ada,2026-11-20,1000,T1','001,Ada,2026-11-21,200,T2');
    const results=await Promise.all([runImport(initial,owner),runImport(initial,owner)]);
    assert.equal(results.reduce((sum,r)=>sum+r.purchasesAdded,0),2);
    assert.equal(results.reduce((sum,r)=>sum+r.rowsSkipped,0),2);
    const before=await Customer.findOne({user:owner,customerId:'001'}).lean();
    assert.equal(before.totalSpent,1200);assert.equal(before.totalOrders,2);
    const replay=await runImport(initial,owner);assert.equal(replay.rowsSkipped,2);
    assert.equal(String((await Customer.findById(before._id).lean()).updatedAt),String(before.updatedAt));
    await runImport(csv('001,Ada,2026-11-20,800,T1'),owner);
    assert.equal((await Customer.findById(before._id).lean()).totalSpent,1000);
    assert.equal(await Transaction.countDocuments({user:owner}),2);
    await runImport(csv('001,Other,2026-11-20,50,T1'),other);
    assert.equal((await Customer.findOne({user:other,customerId:'001'}).lean()).totalSpent,50);
    // Model a legacy partial import with a durable purchase but stale customer totals.
    await Transaction.create({user:owner,customerId:'001',customerName:'Ada',transactionId:'T3',amount:100,date:'2026-11-23'});
    const repair=await runImport(csv('001,Ada,2026-11-23,100,T3'),owner);
    assert.equal(repair.purchasesAdded,0);assert.equal(repair.customersReconciled,1);
    assert.equal((await Customer.findById(before._id).lean()).totalSpent,1100);
    assert.equal((await Feature.findOne({customer:before._id}).lean()).frequency,3);
  }finally{
    // Never drop the database named in the URI; only the unique fixture DB created here.
    if(mongoose.connection.db?.databaseName===dbName)await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  }
});
