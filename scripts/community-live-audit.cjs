/* Safe read-only public deployment smoke. Does not sign in, send wellness data or activate the forum. */
const assert = require("node:assert/strict");
const targets = [
 {label:"MindCheck Community page",url:"https://mindcheck.speakoutmentalhealth.org/community.html",markers:["mc-c-hero","Community spaces","mcCommunityNotOpen"],mustPass:true},
 {label:"MindCheck community filters",url:"https://mindcheck.speakoutmentalhealth.org/js/mc-community-directory.js?v=20261028-pilot",markers:["data-c-filter","aria-pressed"],mustPass:true},
 {label:"MindCheck community styles",url:"https://mindcheck.speakoutmentalhealth.org/css/mindcheck-community.css?v=20261027-premium",markers:["white-space:nowrap","mc-home-community-tool"],mustPass:true},
 {label:"MindCheck premium home assets",url:"https://mindcheck.speakoutmentalhealth.org/js/compact-home.js?v=20261027-premium",markers:["mcHomeCommunityLink","Adults 18+"],mustPass:true},
 {label:"MindCheck PWA service worker",url:"https://mindcheck.speakoutmentalhealth.org/sw.js",markers:["mc-v65-adult-pilot-access-20261031"],mustPass:true},
 {label:"MindCheck volunteer gateway (private rooms still gated)",url:"https://mindcheck.speakoutmentalhealth.org/js/community-config.js?v=20261028-gateway",markers:["enabled: false","gatewayEnabled: true"],mustPass:true},
 {label:"SpeakOut forum gateway",url:"https://speakoutmentalhealth.org/auth.html?next=forum",markers:["id=\"loginPanel\"","id=\"joinPanel\""],mustPass:true},
 {label:"SpeakOut forum interior",url:"https://speakoutmentalhealth.org/forum.html",markers:["Community discussions","id=\"topicSearch\"","Restricted pilot community."],mustPass:true}
];
async function check({label,url,markers,mustPass}){
 const started=Date.now(),controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),18000);
 try{
  const response=await fetch(url,{signal:controller.signal,redirect:"follow",headers:{"accept":"text/html, text/javascript, text/css, */*","cache-control":"no-cache","user-agent":"SpeakOutReleaseAudit/1.0"}});
  const content=(await response.text()).slice(0,2000000);
  const missing=markers.filter(m=>!content.includes(m));
  const htmlFallback=/<html[\\s>]/i.test(content)&&(!url.includes(".html"));
  const ok=response.ok&&missing.length===0&&!htmlFallback;
  console.log(JSON.stringify({label,ok,status:response.status,finalUrl:response.url,elapsedMs:Date.now()-started,bytes:content.length,missing,htmlFallback,etag:response.headers.get("etag"),cache:response.headers.get("x-cache")||response.headers.get("cf-cache-status")}));
  return {ok,mustPass,label,missing};
 }catch(e){console.log(JSON.stringify({label,ok:false,reason:String(e?.message||e).slice(0,220),elapsedMs:Date.now()-started}));return{ok:false,mustPass,label};}
 finally{clearTimeout(timeout);}
}
(async()=>{
 // GitHub Pages and intermediary caches can lag after an otherwise successful deploy.
 // Retry only stale targets for a bounded period; never turn a persistent mismatch into a pass.
 let results=await Promise.all(targets.map(check));
 for(let attempt=2;attempt<=5;attempt++){
   const stale=results.filter(r=>r.mustPass&&!r.ok);
   if(!stale.length) break;
   console.log("Production release propagation check "+attempt+"/5: retrying "+stale.map(r=>r.label).join(", "));
   await new Promise(resolve=>setTimeout(resolve,10000));
   const retried=await Promise.all(stale.map(r=>check(targets.find(t=>t.label===r.label))));
   results=results.map(r=>retried.find(next=>next.label===r.label)||r);
 }
 const failed=results.filter(r=>r.mustPass&&!r.ok);
 console.log("\nPUBLIC DEPLOYMENT SUMMARY: "+(failed.length?"INCOMPLETE / STALE / INACCESSIBLE":"ALL EXPECTED ASSETS LIVE"));
 if(failed.length){console.error("Failing targets: "+failed.map(x=>x.label).join(", "));process.exitCode=1;}
 else assert.equal(results.length,8);
})().catch(e=>{console.error(e);process.exitCode=1;});
