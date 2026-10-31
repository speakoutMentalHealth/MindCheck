import test from 'node:test';
import assert from 'node:assert/strict';
import {createPilotTokenService} from '../server/guide/pilot-token-service.mjs';
import {verifyAdultToken} from '../server/guide/age-entitlement.mjs';
const secret='synthetic-test-secret-more-than-32-characters';
const grant={subject:'adult-123',status:'active',ageBand:'adult',consentStatus:'approved',reviewerId:'reviewer-1',verificationMethod:'documented-pilot-review',verifiedAt:900,expiresAt:2000};
function service(overrides={}){return createPilotTokenService({authenticate:async()=>({authenticated:true,subject:'adult-123'}),loadGrant:async()=>grant,allowIssue:async()=>true,secret,now:()=>1000,...overrides})}
test('issues short-lived token only from trusted server grant',async()=>{const result=await service()({body:{ageVerified:true}});assert.equal(result.expiresAt,1300);assert(await verifyAdultToken(secret,result.token,1000));assert.equal(await verifyAdultToken(secret,result.token,1301),false)});
test('denies missing, revoked, expired, underage, unconsented or unreviewed grants',async()=>{for(const patch of [{status:'revoked'},{expiresAt:1000},{ageBand:'youth'},{consentStatus:'pending'},{reviewerId:''},{verificationMethod:''},{subject:'other'},{verifiedAt:1001}])await assert.rejects(service({loadGrant:async()=>({...grant,...patch})})({}));await assert.rejects(service({loadGrant:async()=>null})({body:grant}))});
test('denies unauthenticated callers and throttled issuance',async()=>{await assert.rejects(service({authenticate:async()=>null})({}));await assert.rejects(service({allowIssue:async()=>false})({}))});
test('renewal reads approval again and stops after revocation',async()=>{let active=grant;const issue=service({loadGrant:async()=>active});await issue({});active={...grant,status:'revoked'};await assert.rejects(issue({}))});
