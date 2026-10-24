// Identity-provider-neutral entitlement issuance boundary.
// The caller must supply a trusted, authenticated account and an independently
// verified adult status. This function must never be exposed as a public API.
import {issueAdultToken} from './age-entitlement.mjs';
export async function issueForVerifiedAdult(secret,principal,now=Math.floor(Date.now()/1000)){
 if(!principal||typeof principal!=='object'||Array.isArray(principal))throw Error('Unauthenticated');
 if(principal.authenticated!==true||principal.ageVerified!==true||principal.ageBand!=='adult'||principal.consentStatus!=='approved')throw Error('Not eligible');
 if(typeof principal.subject!=='string'||!/^[A-Za-z0-9:_-]{3,128}$/.test(principal.subject))throw Error('Invalid subject');
 if(!Number.isSafeInteger(now)||now<=0)throw Error('Invalid time');
 return issueAdultToken(secret,{subject:principal.subject,expiresAt:now+300});
}
