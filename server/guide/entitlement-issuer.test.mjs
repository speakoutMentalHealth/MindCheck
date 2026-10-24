import test from 'node:test';
import assert from 'node:assert/strict';
import {issueForVerifiedAdult} from './entitlement-issuer.mjs';
import {verifyAdultToken} from './age-entitlement.mjs';
const secret='development-only-secret-that-is-long-enough';
const principal={authenticated:true,ageVerified:true,ageBand:'adult',consentStatus:'approved',subject:'account-123'};
test('trusted verified adult receives five-minute entitlement',async()=>{
 const token=await issueForVerifiedAdult(secret,principal,1000);
 assert.equal(await verifyAdultToken(secret,token,1000),true);
 assert.equal(await verifyAdultToken(secret,token,1300),false);
});
test('denies minors, unverified age, unapproved consent and missing login',async()=>{
 for(const patch of [{ageBand:'teen'},{ageBand:'child'},{ageVerified:false},{consentStatus:'pending'},{authenticated:false},{subject:''}]){
  await assert.rejects(()=>issueForVerifiedAdult(secret,{...principal,...patch},1000));
 }
 await assert.rejects(()=>issueForVerifiedAdult(secret,null,1000));
});
