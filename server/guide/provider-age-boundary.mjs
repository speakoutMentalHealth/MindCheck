// Server-only age assurance boundary. Accept only an authenticated provider result
// already fetched by a trusted backend; never accept browser-supplied evidence.
import {issueForVerifiedAdult} from './entitlement-issuer.mjs';
export async function issueFromVerifiedAgeResult(secret,account,result,now=Math.floor(Date.now()/1000)){
 if(!account||account.authenticated!==true||typeof account.subject!=='string')throw Error('Unauthenticated');
 if(!result||typeof result!=='object'||Array.isArray(result))throw Error('Missing provider result');
 // Adapter input must be produced from a server-to-server, authenticated provider
 // session result with a matching, single-use session/account association.
 if(result.provider!=='yoti'||result.serverAuthenticated!==true||result.sessionBoundToSubject!==account.subject||result.sessionConsumed!==false||result.completed!==true||result.over18!==true||result.threshold!==18||result.consentApproved!==true)throw Error('Age assurance failed');
 if(!Number.isSafeInteger(result.verifiedAt)||result.verifiedAt>now||now-result.verifiedAt>600)throw Error('Stale verification');
 // The caller must atomically mark the provider session consumed BEFORE exposing
 // any issued token. This pure boundary does not perform persistence or replay defense.
 return issueForVerifiedAdult(secret,{authenticated:true,subject:account.subject,ageVerified:true,ageBand:'adult',consentStatus:'approved'},now);
}
