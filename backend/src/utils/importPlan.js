// Pure import planning: input identities remain strings (including leading zeros).
const crypto = require('node:crypto');
const { parseCsv } = require('./parseCsv');
const GENERATED_ID = /^CSV-[a-f0-9]{32}-\d+$/i;
const OPTIONAL = { product: 'product', category: 'category', payment_method: 'paymentMethod' };
const keyOf = ({customerId, date, amount}) => JSON.stringify([customerId, date, amount]);
const equalFields = (a,b) => Object.keys(b).every(k => a[k] === b[k]);
const missing = value => typeof value !== 'string' || !value.trim();
function parseImport(buffer) {
  const fingerprint = crypto.createHash('sha256').update(buffer).digest('hex').slice(0,32);
  const parsed = parseCsv(buffer.toString('utf8'), { collectErrors:true, allowBlankName:true });
  const rows = parsed.map(({row,data,error}) => {
    if (error) return { row, error };
    const customerId = data.customer_id.trim();
    const explicit = Boolean(data.transaction_id);
    const transactionId = explicit ? data.transaction_id : `CSV-${fingerprint}-${row-1}`;
    const amount = Number(data.amount);
    const date = new Date(data.purchase_date).toISOString().slice(0,10);
    const profile = {};
    if (data.name) profile.name = data.name;
    if (data.email) profile.email = data.email.toLowerCase();
    const fields = { amount, date };
    for (const [col,field] of Object.entries(OPTIONAL)) if (data[col]) fields[field] = data[col];
    if (customerId.length > 200 || transactionId.length > 250 || Object.values(profile).some(v=>v.length>320) || Object.values(fields).some(v=>typeof v==='string'&&v.length>500)) return {row,error:'A field exceeds its supported length'};
    if (explicit && GENERATED_ID.test(transactionId)) return {row,error:'This transaction ID uses a reserved internal CSV prefix'};
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) return {row,error:'Invalid email address'};
    if (!Number.isSafeInteger(Math.round(amount*100)) || Math.abs(amount-Math.round(amount*100)/100)>1e-7) return {row,error:'Amount must be a non-negative currency value with at most two decimal places'};
    if (fields.product === 'Direct Order') return {row,error:'Direct Order is a reserved manual summary product'};
    fields.amount = Math.round(amount*100)/100;
    return {row, customerId, transactionId, explicit, profile, fields, tuple:keyOf({customerId,...fields})};
  });
  const explicitGroups = new Map(), tuples = new Map();
  for (const r of rows) {
    if (r.error) continue;
    if (r.explicit) {
      const group = explicitGroups.get(r.transactionId) || [];
      group.push(r); explicitGroups.set(r.transactionId,group);
    }
    tuples.set(r.tuple,(tuples.get(r.tuple)||0)+1);
  }
  for (const group of explicitGroups.values()) {
    const signature = r=>JSON.stringify([r.customerId,r.profile,r.fields]);
    if (group.some(r=>signature(r)!==signature(group[0]))) {
      for (const r of group) r.error='Conflicting rows share the same transaction ID in this file';
    } else {
      for (const r of group.slice(1)) r.duplicateOf=group[0].row;
    }
  }
  for (const r of rows) if (!r.error && !r.explicit && tuples.get(r.tuple)>1) r.ambiguous=true;
  return rows;
}

function planImport(rows, { customers=[], transactions=[], manualIds=new Set() }={}) {
  const customerMap=new Map(customers.map(c=>[c.customerId,c]));
  const ids=new Map(transactions.map(t=>[t.transactionId,t]));
  const tuples=new Map();
  const addTuple=t=>{ const k=keyOf(t); if(!tuples.has(k))tuples.set(k,new Map()); tuples.get(k).set(t.transactionId,t); };
  const removeTuple=t=>tuples.get(keyOf(t))?.delete(t.transactionId);
  transactions.filter(t=>t.source!=='summary'&&t.product!=='Direct Order').forEach(addTuple);
  const profiles=new Map(), transactionChanges=[], outcomes=new Map();
  const fail=(r,reason)=>outcomes.set(r.row,{row:r.row,status:'failed',reason});
  const skip=(r,reason)=>outcomes.set(r.row,{row:r.row,status:'skipped',reason});
  for(const r of rows) {
    if(r.error){fail(r,r.error);continue;}
    if(r.duplicateOf){
      const first=outcomes.get(r.duplicateOf);
      if(first?.status==='failed')fail(r,'Duplicate of a rejected row in this file'); else skip(r,'Identical transaction repeated in this file');
      continue;
    }
    const old=ids.get(r.transactionId);
    const existingCustomer=customerMap.get(r.customerId);
    if(manualIds.has(r.customerId)){fail(r,'Existing manual summary needs reconciliation before importing purchase history');continue;}
    if(old && (old.customerId!==r.customerId || old.source==='summary'||old.product==='Direct Order')){fail(r,'Transaction ID belongs to another customer or a manual summary');continue;}
    const profile=profiles.get(r.customerId);
    if(!existingCustomer&&!profile&&missing(r.profile.name)){fail(r,'Name is required for a new customer');continue;}
    if(!old){
      const matches=[...(tuples.get(r.tuple)?.values()||[])];
      if(!r.explicit && (r.ambiguous || matches.length)) {fail(r,'Ambiguous purchase without transaction ID; provide a stable transaction ID after reviewing existing purchases');continue;}
      if(r.explicit && matches.some(t=>GENERATED_ID.test(t.transactionId))){fail(r,'An older purchase without a transaction ID matches this row; review and reconcile it before assigning a new ID');continue;}
    }
    // A known synthetic ID is a byte-identical file replay; it cannot correct a different purchase.
    if(old&&!r.explicit&&!equalFields(old,r.fields)){fail(r,'A purchase without a stable ID cannot be corrected safely');continue;}
    if(!profile) profiles.set(r.customerId,{old:existingCustomer,patch:{},last:{},rows:[]});
    const current=profiles.get(r.customerId);
    for(const [k,v] of Object.entries(r.profile)){current.patch[k]=v;current.last[k]=r.row;}
    current.rows.push(r.row);
    const displayName=current.patch.name || existingCustomer?.name || r.profile.name;
    if(!old){
      const record={transactionId:r.transactionId,customerId:r.customerId,customerName:displayName,source:'transaction',status:'Completed',product:'Not specified',category:'Not specified',paymentMethod:'Not specified',...r.fields};
      transactionChanges.push({kind:'added',row:r.row,record}); ids.set(r.transactionId,record);addTuple(record);
      outcomes.set(r.row,{row:r.row,status:'applied',purchase:'added'});
    } else if(!equalFields(old,r.fields)) {
      const patch=Object.fromEntries(Object.entries(r.fields).filter(([k,v])=>old[k]!==v));
      transactionChanges.push({kind:'corrected',row:r.row,old,patch});
      removeTuple(old);const updated={...old,...patch};ids.set(r.transactionId,updated);addTuple(updated);
      outcomes.set(r.row,{row:r.row,status:'applied',purchase:'corrected'});
    } else skip(r,'Purchase unchanged');
  }
  // Apply only the final supplied nonblank profile values for each customer.
  for(const p of profiles.values()){
    for(const k of Object.keys(p.patch)){
      if(p.old && p.old[k]===p.patch[k]){delete p.patch[k];continue;}
      const row=p.last[k];const outcome=outcomes.get(row);
      if(outcome?.status==='skipped') outcomes.set(row,{row,status:'applied',profile:true});
    }
  }
  return {profiles,transactionChanges,outcomes:[...outcomes.values()].sort((a,b)=>a.row-b.row)};
}
module.exports={parseImport,planImport,GENERATED_ID,keyOf,equalFields};
