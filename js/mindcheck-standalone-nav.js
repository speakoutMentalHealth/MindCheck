/* Fixed six-tab MindCheck navigation on standalone pages. No health data storage. */
(function(){
'use strict';
if(document.getElementById('mc-premium-tabs'))return;
const tabs=[
['Home','homeSection','<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>'],
['My Buddy','moodSection','<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M8.5 9h.01M15.5 9h.01"/>'],
['Assessments','formContainer','<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'],
['Wellness','tipsSection','<path d="M9 18h6M10 21h4M8 14a7 7 0 1 1 8 0c-.7.6-1 1.2-1 2H9c0-.8-.3-1.4-1-2z"/>'],
['Support','helpSection','<path d="M20 12v5a3 3 0 0 1-3 3h-2l-3 2-3-2H7a3 3 0 0 1-3-3v-5"/><path d="M12 15S5 11 5 7a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-7 8-7 8z"/>'],
['Awards','badgesSection','<path d="m12 2 3 6 7 .9-5 5 .9 7.1-5.9-3.2L6.1 21l.9-7.1-5-5L9 8z"/>']
];
const page=location.pathname.split('/').pop();
const active=page==='assessment-centre.html'||/^(adhd|audit-screening|pcl5-screening|trauma-awareness|sleep-awareness|professional-assessments|clinical-assessment-guide|clinician-referral-preparation)\.html$/.test(page)?'formContainer':page==='suicide-support.html'?'helpSection':page==='daily-life.html'?'moodSection':'homeSection';
function mount(){
 if(document.getElementById('mc-premium-tabs'))return;
 document.body.classList.add('mc-standalone-page');
 const nav=document.createElement('nav');nav.id='mc-premium-tabs';nav.className='mc-premium-tabs';nav.setAttribute('aria-label','MindCheck sections');
 tabs.forEach(function(t){
  const a=document.createElement('a');a.className='mc-standalone-tab';a.href=t[1]==='formContainer'?'assessment-centre.html':t[1]==='moodSection'?'daily-life.html':'index.html?section='+encodeURIComponent(t[1]);
  if(t[1]===active)a.setAttribute('aria-current','page');
  a.innerHTML='<span class="mc-tab-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+t[2]+'</svg></span><span class="mc-tab-label">'+t[0]+'</span>';
  nav.appendChild(a);
 });
 document.body.appendChild(nav);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
