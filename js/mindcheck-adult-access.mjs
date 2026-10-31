import {createPilotTokenClient} from './pilot-token-client.mjs';
const portal='https://speakoutmentalhealth.org';
export function requestPilotToken({signal}={}){
 return new Promise(resolve=>{
  const rid=crypto.randomUUID();let popup,timer,done=false;
  function finish(value){if(done)return;done=true;clearTimeout(timer);window.removeEventListener('message',receive);signal?.removeEventListener('abort',abort);try{popup?.close()}catch{}resolve(value)}
  function abort(){finish(null)}
  function receive(event){if(event.origin!==portal||event.source!==popup||event.data?.type!=='mindcheck-adult-token'||event.data.rid!==rid)return;finish({token:event.data.token,expiresAt:event.data.expiresAt})}
  if(signal?.aborted)return finish(null);
  window.addEventListener('message',receive);signal?.addEventListener('abort',abort,{once:true});
  popup=window.open(portal+'/mindcheck-access.html?rid='+encodeURIComponent(rid),'mindcheckAdultAccess','popup,width=480,height=720');
  if(!popup)return finish(null);
  timer=setTimeout(()=>finish(null),120000);
 });
}
// Tests may install a synthetic adapter before page scripts run.
if(!window.MindCheckVerifiedAdultAccess){const client=createPilotTokenClient({requestToken:requestPilotToken});window.MindCheckVerifiedAdultAccess=client;window.addEventListener('pagehide',()=>client.clear());}
