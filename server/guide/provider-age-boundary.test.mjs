import test from 'node:test';
import assert from 'node:assert/strict';
import {issueFromVerifiedAgeResult} from './provider-age-boundary.mjs';
import {verifyAdultToken} from './age-entitlement.mjs';
const secret='development-only-secret-that-is-long-enough';
const account={authenticated:true,subject:'adult-account-123'};
const now=10000;
const verified={provider:'yoti',serverAuthenticated:true,sessionBoundToSubject:account.subject,sessionConsumed:false,completed:true,over18:true,threshold:18,consentApproved:true,verifiedAt:now};
test('server-authenticated, account-bound over-18 result issues short-lived token',async()=>{
 const token=await issueFromVerifiedAgeResult(secret,account,verified,now);
 assert.equal(await verifyAdultToken(secret,token,now),true);
 assert.equal(await verifyAdultToken(secret,token,now+301),false);
});
test('rejects untrusted, replayed, underage, stale or mismatched result',async()=>{
 const changes=[{serverAuthenticated:false},{sessionBoundToSubject:'someone-else'},{sessionConsumed:true},{completed:false},{over18:false},{threshold:17},{consentApproved:false},{verifiedAt:now-601},{verifiedAt:now+1},{provider:'untrusted'}];
 for(const patch of changes)await assert.rejects(()=>issueFromVerifiedAgeResult(secret,account,{...verified,...patch},now));
 await assert.rejects(()=>issueFromVerifiedAgeResult(secret,{...account,authenticated:false},verified,now));
 await assert.rejects(()=>issueFromVerifiedAgeResult(secret,account,null,now));
});
