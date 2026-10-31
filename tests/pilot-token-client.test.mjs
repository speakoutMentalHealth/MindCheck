import test from 'node:test';
import assert from 'node:assert/strict';
import {createPilotTokenClient} from '../server/guide/pilot-token-client.mjs';
const good={token:'payload.signature',expiresAt:1300};
test('requests tokens automatically and never reuses stale eligibility',async()=>{let calls=0;const client=createPilotTokenClient({now:()=>1000,requestToken:async()=>{calls++;return good}});assert.equal(await client.getToken(),good.token);assert.equal(await client.getToken(),good.token);assert.equal(calls,2)});
test('denial, malformed expiry, issuer failure and abort return no token',async()=>{for(const result of [null,{...good,expiresAt:1000},{...good,expiresAt:1500},{...good,token:'invalid'}])assert.equal(await createPilotTokenClient({now:()=>1000,requestToken:async()=>result}).getToken(),null);assert.equal(await createPilotTokenClient({requestToken:async()=>{throw Error('offline')}}).getToken(),null);const signal=AbortSignal.abort();assert.equal(await createPilotTokenClient({requestToken:async()=>good}).getToken({signal}),null)});
test('logout invalidates an in-flight response',async()=>{let release;const client=createPilotTokenClient({now:()=>1000,requestToken:()=>new Promise(r=>release=r)});const pending=client.getToken();client.clear();release(good);assert.equal(await pending,null)});
