/* Aggregate public-page traffic only. No health events, identifiers or form reads. */
(function(){
'use strict';
if(window.__mindcheckAnalyticsLoaded)return;
window.__mindcheckAnalyticsLoaded=true;
if(location.hostname!=='mindcheck.speakoutmentalhealth.org'||location.protocol!=='https:'||navigator.onLine===false)return;
if(navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
const pages={
 '/':'Home','/index.html':'Home','/landing.html':'Welcome',
 '/resources.html':'Resources','/volunteers.html':'Volunteer zone',
 '/training-hub.html':'Volunteer training','/become-a-counsellor.html':'Counsellor pathway',
 '/ambassador.html':'Ambassador programme','/privacy.html':'Privacy','/terms.html':'Terms',
 '/speakhub.html':'SpeakHub','/e-library.html':'Library','/community-awareness.html':'Community awareness',
 '/famsas-mental-health-club.html':'Mental health club','/jobs-internships.html':'Jobs and internships',
 '/kiddies.html':'Kiddies','/research-academic.html':'Research resources',
 '/scholarships-grants.html':'Scholarships and grants','/youth-empowerment.html':'Youth empowerment'
};
// Unknown routes, reports, screenings, chats, monitoring and certificates are excluded.
if(!Object.prototype.hasOwnProperty.call(pages,location.pathname))return;
const endpoint=window.MindCheckAnalyticsConfig?.endpoint;
if(typeof endpoint!=='string'||!/^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.goatcounter\.com\/count$/.test(endpoint))return;
const path=location.pathname==='/'?'/index.html':location.pathname;
let referrer='';
try{const ref=new URL(document.referrer);if((ref.protocol==='https:'||ref.protocol==='http:')&&ref.hostname!==location.hostname)referrer=ref.origin}catch{/* Direct visit or malformed referrer. */}
window.goatcounter={no_onload:true,no_events:true,endpoint};
const script=document.createElement('script');script.src='https://gc.zgo.at/count.js';script.async=true;script.referrerPolicy='no-referrer';
script.onload=function(){try{window.goatcounter.count({path,title:pages[location.pathname],referrer})}catch{/* Analytics must never interrupt the app. */}};
script.onerror=function(){};document.head.appendChild(script);
})();
