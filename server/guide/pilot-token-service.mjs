// Internal service: adapters must authenticate sessions and read server-owned grants.
import {issueForVerifiedAdult} from './entitlement-issuer.mjs';
export function createPilotTokenService({authenticate,loadGrant,allowIssue,secret,now=()=>Math.floor(Date.now()/1000)}) {
 if(![authenticate,loadGrant,allowIssue].every(f=>typeof f==='function'))throw Error('Missing trusted adapter');
 return async function issue(request){
  const time=now(),account=await authenticate(request);
  if(!account||account.authenticated!==true||typeof account.subject!=='string')throw Error('Unauthenticated');
  if(!await allowIssue(account.subject))throw Error('Rate limited');
  // Never use request body, browser DOB or ordinary volunteer approval as eligibility.
  const grant=await loadGrant(account.subject);
  if(!grant||grant.subject!==account.subject||grant.status!=='active'||grant.ageBand!=='adult'||grant.consentStatus!=='approved'||!grant.reviewerId||!grant.verificationMethod||!Number.isSafeInteger(grant.verifiedAt)||grant.verifiedAt>time||!Number.isSafeInteger(grant.expiresAt)||grant.expiresAt<=time)throw Error('Not eligible');
  const token=await issueForVerifiedAdult(secret,{authenticated:true,subject:account.subject,ageVerified:true,ageBand:'adult',consentStatus:'approved'},time);
  return {token,expiresAt:time+300};
 };
}
