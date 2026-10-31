// No persistence and no timers: request a fresh token on demand, before expiry.
export function createPilotTokenClient({requestToken,now=()=>Math.floor(Date.now()/1000)}) {
 if(typeof requestToken!=='function')throw Error('Missing authenticated issuer adapter');
 let generation=0;
 return Object.freeze({
  async getToken({signal}={}) {
   if(signal?.aborted)return null;
   const version=generation;
   // Deliberately recheck the issuer on every AI request so revocations are observed.
   try {
    const result=await requestToken({signal});
    if(signal?.aborted||version!==generation)return null;
    if(!result||typeof result.token!=='string'||result.token.length>2048||!/^[-_A-Za-z0-9]+\.[-_A-Za-z0-9]+$/.test(result.token)||!Number.isSafeInteger(result.expiresAt)||result.expiresAt<=now()+30||result.expiresAt>now()+300)return null;
    return result.token;
   }catch{return null;}
  },
  clear(){generation++;}
 });
}
