import test from 'node:test';
import assert from 'node:assert/strict';
import {issueAdultToken,verifyAdultToken} from './age-entitlement.mjs';
const secret='development-only-secret-that-is-long-enough';
test('signed token expires',async()=>{
 const token=await issueAdultToken(secret,{subject:'user-1',expiresAt:2000});
 assert.equal(await verifyAdultToken(secret,token,1000),true);
 assert.equal(await verifyAdultToken(secret,token,2000),false);
});
test('rejects forgery and wrong secret',async()=>{
 const token=await issueAdultToken(secret,{subject:'user-1',expiresAt:2000});
 assert.equal(await verifyAdultToken(secret,token+'x',1000),false);
 assert.equal(await verifyAdultToken('different-secret-that-is-long-enough',token,1000),false);
 assert.equal(await verifyAdultToken('',token,1000),false);
});
test('rejects missing token and excessive lifetime',async()=>{
 assert.equal(await verifyAdultToken(secret,'',1000),false);
 const token=await issueAdultToken(secret,{subject:'user-1',expiresAt:1000000});
 assert.equal(await verifyAdultToken(secret,token,1000),false);
});
