const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.NODE_ENV = 'production';
process.env.VERCEL = '1';
delete process.env.MONGO_URI;
delete process.env.FRONTEND_URL;

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const handler = require('../../api/patron');
const User = require('../src/models/User');
const Session = require('../src/models/Session');
const AuditLog = require('../src/models/AuditLog');
const ScanRecord = require('../src/models/ScanRecord');

test('Vercel adapter handles missing DB, rewritten URLs, same-origin and uploads', async t => {
  const server = http.createServer(handler);
  server.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const host = `127.0.0.1:${server.address().port}`;
  const base = `http://${host}`;
  const origin = `https://${host}`;
  const get = (path, headers = {}) => fetch(base + path, { headers });
  const post = (path, body, headers = {}) => fetch(base + path, {
    method: 'POST', headers: { Origin: origin, 'X-Patron-Request': '1', ...headers }, body
  });
  const unavailable = await get('/api/patron?__patron_path=health');
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).status, 'unavailable');
  assert.equal((await get('/api/health', { Origin: 'https://other.example' })).status, 403);

  // No live DB is contacted. Model methods and the connection state are replaced for testing.
  mongoose.connection.readyState = 1;
  t.after(() => { mongoose.connection.readyState = 0; });
  const healthy = await get('/api/health', { Origin: origin });
  assert.equal(healthy.status, 200);
  assert.equal(healthy.headers.get('access-control-allow-origin'), origin);
  assert.equal((await get('/api/patron?__patron_path=no-such-route')).status, 404);
  assert.equal((await get('/api/auth/me')).status, 401);
  assert.equal((await fetch(base+'/api/auth/login', {method:'POST'})).status,403);
  const bcrypt = require('bcryptjs');
  const user = { _id: '507f1f77bcf86cd799439011', email:'test@example.com', name:'Test',role:'analyst',password:await bcrypt.hash('test-pass',4) };
  let session;
  t.mock.method(User,'findOne',async ()=>user);
  t.mock.method(User,'findById',()=>({select(){return this},lean:async()=>user,then(ok,fail){return Promise.resolve(user).then(ok,fail)}}));
  t.mock.method(Session,'create',async value=>{session=value; return value;});
  t.mock.method(Session,'findOne',()=>({lean:async()=>session}));
  t.mock.method(Session,'deleteOne',async()=>{session=null;});
  t.mock.method(AuditLog,'create',async()=>({}));
  t.mock.method(ScanRecord,'create',async v=>({...v,_id:'507f1f77bcf86cd799439012'}));
  const response = await post('/api/patron?__patron_path=auth/login', JSON.stringify({email:user.email,password:'test-pass'}), {'Content-Type':'application/json'});
  assert.equal(response.status, 200);
  const raw = response.headers.get('set-cookie');
  assert.match(raw,/Secure/i);
  assert.match(raw,/HttpOnly/i);
  const Cookie = raw.split(';')[0];
  const file = new FormData();
  file.append('file',new Blob(['customer_id,name,purchase_date,amount\\nC1,Test,2026-01-01,10'],{type:'text/csv'}),'test.csv');
  const scan=await post('/api/scan/upload',file,{Cookie});
  assert.equal(scan.status,201);
  assert.equal((await scan.json()).decision,'allow');
});

test('MongoDB connection promises are shared and retry after failures', async t => {
  process.env.MONGO_URI = 'mongodb://example.invalid/test';
  t.after(()=>{delete process.env.MONGO_URI; mongoose.connection.readyState=0;});
  let calls=0;
  t.mock.method(mongoose,'connect',async ()=>{
    calls++;
    await new Promise(resolve=>setTimeout(resolve,10));
    if(calls===1) throw new Error('simulated failure');
    mongoose.connection.readyState=1;
    return mongoose;
  });
  const first=await Promise.allSettled([connectDB(),connectDB()]);
  assert.equal(calls,1);
  assert.ok(first.every(r=>r.status==='rejected'));
  const next=await Promise.all([connectDB(),connectDB()]);
  assert.equal(calls,2);
  assert.equal(next[0],next[1]);
});
