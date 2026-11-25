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
test('CSV rejects invalid rows, impossible dates, malformed quotes and missing headers', () => {
  const prefix = 'customer_id,name,purchase_date,amount,transaction_id\n';
  for (const row of ['a,b,2026-01-01,no,t1','a,b,2026-02-30,1,t1','a,b,2026-01-01,-1,t1','a,"b,2026-01-01,1,t1','a,b,2026-01-01,1','a,b,2026-01-01,,t1']) {
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

