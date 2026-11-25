const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { parseCsv } = require('../src/utils/parseCsv');
const { calculatePatronIndex, classifyCustomer } = require('../src/utils/customerScoring');

test('CSV accepts the supplied sample, BOM, escaped quotes, commas and multiline fields', () => {
  const sample = fs.readFileSync(path.join(__dirname, '../../sample-data/patron_index_transactions_data.csv'), 'utf8');
  assert.equal(parseCsv(sample).length, 30);
  const rows = parseCsv('\uFEFFcustomer_id,name,purchase_date,amount\r\nA1,"A, ""B""\nC",2026-01-01,15\r\n');
  assert.equal(rows[0].name, 'A, "B"\nC');
});
test('CSV rejects invalid rows, impossible dates, duplicate IDs, malformed quotes and missing headers', () => {
  const prefix = 'customer_id,name,purchase_date,amount,transaction_id\n';
  for (const row of ['a,b,2026-01-01,no,t1','a,b,2026-02-30,1,t1','a,b,2026-01-01,-1,t1','a,b,2026-01-01,1,t1\na,b,2026-01-02,2,t1','a,"b,2026-01-01,1,t1','a,b,2026-01-01,1','a,b,2026-01-01,,t1']) {
    assert.throws(() => parseCsv(prefix+row), e => e.status === 400);
  }
  assert.throws(() => parseCsv('name\nAda'), e => e.status === 400);
});
test('all seven RFM segments and score bounds remain intact', () => {
  const cases = [[0,1,10,'New'],[0,20,100000,'VIP'],[5,12,2000,'Loyal'],[20,6,2000,'Regular'],[35,3,2000,'Occasional'],[60,3,2000,'At-Risk'],[120,3,2000,'Inactive']];
  for (const [recency,frequency,monetary,segment] of cases) assert.equal(classifyCustomer({recency,frequency,monetary}),segment);
  assert.equal(calculatePatronIndex({recency:0,frequency:100,monetary:1000000}),100);
  assert.equal(calculatePatronIndex({recency:200,frequency:0,monetary:0}),0);
});

test('HTTP API security, readiness and cookie session lifecycle (in-memory model doubles)', async t => {
  process.env.NODE_ENV = 'test';
  process.env.FRONTEND_URL = 'http://localhost:5173';
  const User = require('../src/models/User');
  const Session = require('../src/models/Session');
  const AuditLog = require('../src/models/AuditLog');
  const bcrypt = require('bcryptjs');
  const user = {_id:'507f1f77bcf86cd799439011',name:'Test account',email:'test@example.com',role:'analyst',password:await bcrypt.hash('test-password',4)};
  const sessions = new Map();
  const query = value => ({ select: () => query(value), lean: async () => value, then: (ok,fail) => Promise.resolve(value).then(ok,fail) });
  t.mock.method(User,'findOne',async filter => filter.email===user.email?user:null);
  t.mock.method(User,'findById',id => query(String(id)===user._id?user:null));
  t.mock.method(Session,'create',async value => {sessions.set(value.digest,value);return value;});
  t.mock.method(Session,'findOne',filter => query(sessions.get(filter.digest)||null));
  t.mock.method(Session,'deleteOne',async filter => {sessions.delete(filter.digest);});
  t.mock.method(AuditLog,'create',async () => ({}));
  const {app} = require('../src/server');
  const server=app.listen(0,'127.0.0.1');
  t.after(() => new Promise(resolve => server.close(resolve)));
  await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  const get=(route,headers={})=>fetch(base+route,{headers});
  const post=(route,body,headers={})=>fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json','X-Patron-Request':'1',...headers},body:JSON.stringify(body)});
  assert.equal((await get('/api/health')).status,503);
  assert.equal((await get('/api/no-such-route')).status,404);
  assert.equal((await get('/api/health',{Origin:'https://untrusted.example'})).status,403);
  assert.equal((await get('/api/auth/me')).status,401);
  assert.equal((await fetch(base+'/api/auth/logout',{method:'POST'})).status,403);
  assert.equal((await post('/api/auth/login',{email:user.email,password:'wrong'})).status,401);
  const response=await post('/api/auth/login',{email:user.email,password:'test-password'});
  assert.equal(response.status,200);
  assert.equal((await response.json()).user.email,user.email);
  const cookie=response.headers.get('set-cookie');
  assert.match(cookie,/HttpOnly/i);assert.match(cookie,/SameSite=Lax/i);
  const Cookie=cookie.split(';')[0];
  assert.equal(sessions.size,1);
  assert.equal((await get('/api/auth/me',{Cookie})).status,200);
  assert.equal((await post('/api/auth/logout',{}, {Cookie})).status,200);
  assert.equal((await get('/api/auth/me',{Cookie})).status,401);
});

test('CSV replay uses stable transaction keys and aggregates saved purchases (model doubles)', async t => {
  const Customer = require('../src/models/Customer');
  const CustomerFeature = require('../src/models/CustomerFeature');
  const CustomerPrediction = require('../src/models/CustomerPrediction');
  const Transaction = require('../src/models/Transaction');
  const AuditLog = require('../src/models/AuditLog');
  const { importCustomers } = require('../src/controllers/customerController');
  const stored = new Map(); let latest;
  t.mock.method(Transaction,'find',()=>({lean:async()=>[...stored.values()]}));
  t.mock.method(Transaction,'bulkWrite',async operations=>{ for(const {updateOne:{filter,update}} of operations) if(!stored.has(filter.transactionId)) stored.set(filter.transactionId,update.$setOnInsert); });
  t.mock.method(Transaction,'aggregate',async()=>[{_id:'C1',totalSpent:[...stored.values()].reduce((a,b)=>a+b.amount,0),totalOrders:stored.size,latestPurchase:'2026-01-03'}]);
  t.mock.method(Customer,'findOneAndUpdate',async (_filter,update)=>{latest=update.$set;return {_id:'507f1f77bcf86cd799439012'};});
  t.mock.method(CustomerFeature,'findOneAndUpdate',async()=>({}));
  t.mock.method(CustomerPrediction,'findOneAndUpdate',async()=>({}));
  t.mock.method(AuditLog,'create',async()=>({}));
  const request = text => ({user:{userId:'507f1f77bcf86cd799439011'},file:{buffer:Buffer.from(text),originalname:'test.csv'}});
  const response = () => ({statusCode:200,status(n){this.statusCode=n;return this},json(body){this.body=body;return this}});
  const text='customer_id,name,purchase_date,amount\nC1,Customer,2026-01-02,100\nC1,Customer,2026-01-03,200';
  for(let i=0;i<2;i++){const res=response();await importCustomers(request(text),res,e=>{throw e});assert.equal(res.statusCode,201);assert.equal(stored.size,2);assert.equal(latest.totalSpent,300);assert.equal(latest.totalOrders,2);}
  let error;await importCustomers(request(text+'\nC1,Customer,invalid,400'),response(),e=>{error=e});assert.equal(error.status,400);assert.equal(stored.size,2);
});
