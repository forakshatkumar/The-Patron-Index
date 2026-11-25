// Default is read-only. --apply creates only missing non-destructive unique indexes.
const path=require('node:path');
require('dotenv').config({path:path.join(__dirname,'../.env'),quiet:true});
const mongoose=require('mongoose');
const {inspectIndexes}=require('../src/utils/importIndexes');
async function main(){
  if(!process.env.MONGO_URI)throw Error('MONGO_URI is not configured. Use your intended database, not a placeholder.');
  await mongoose.connect(process.env.MONGO_URI,{autoIndex:false,autoCreate:false,serverSelectionTimeoutMS:8000});
  const db=mongoose.connection.db;
  const report=await inspectIndexes(db,{checkData:true});
  console.log(JSON.stringify(report,null,2));
  const unsafe=report.some(r=>r.duplicateGroups||r.invalidIdentityRows);
  if(unsafe){console.error('Existing identity data needs manual reconciliation; no indexes changed.');process.exitCode=2;return;}
  if(!process.argv.includes('--apply')){console.log('Read-only audit. Back up and review otherUniqueIndexes before using --apply.');return;}
  for(const r of report){
    if(r.present)continue;
    await db.collection(r.collection).createIndex(r.key,{unique:true,name:r.name,collation:{locale:'simple'}});
    console.log(`Created ${r.collection}.${r.name}`);
  }
  console.log('Index creation finished. Existing indexes and records were not removed.');
}
main().catch(e=>{console.error('Index audit/apply failed:',e.name,e.code||'', 'Check database access and index permissions. No index was dropped.');process.exitCode=1;}).finally(()=>mongoose.disconnect());
