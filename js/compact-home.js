/* Compact home, with long tools opened in an accessible native dialog. */
(function(){
'use strict';
function mount(){
 const home=document.getElementById('homeSection'),journey=document.getElementById('mcJourney');
 if(!home||!journey||!window.HTMLDialogElement?.prototype?.showModal||!window.MindCheckHomeCopy?.en)return;
 const body=document.body;
 const copy=key=>(window.MindCheckHomeCopy?.[window.MindCheckLocale?.current()||'en']||window.MindCheckHomeCopy.en)[key];
 const footer=()=>'<div class="mc-home-footer"><a href="privacy.html" data-hc="privacy">Privacy</a><a href="terms.html" data-hc="terms">Terms</a><a href="https://speakoutmentalhealth.org/">SpeakOut ↗</a></div>';
 const launch=document.createElement('div');launch.className='mc-home-launch';
 launch.innerHTML='<div class="mc-home-tools"><button id="mcOpenBreathing" class="mc-home-tool mc-home-breathe" type="button" aria-haspopup="dialog"><span class="mc-home-tool-icon" aria-hidden="true">◌</span><strong data-hc="breathe">Breathe</strong><small data-hc="breatheHint">Find your rhythm</small></button><button id="mcOpenJourney" class="mc-home-tool" type="button" aria-haspopup="dialog"><span class="mc-home-tool-icon" aria-hidden="true">↗</span><strong data-hc="journey">My journey</strong><small data-hc="journeyHint">Progress & challenges</small></button></div><div class="mc-home-momentum"><span><strong id="mcCompactCheckins">0</strong> <span data-hc="checkins">Check-ins</span></span><span><strong id="mcCompactStreak">0</strong> <span data-hc="streak">Day streak</span></span></div>'+footer();
 home.querySelector('.mc-dashboard-hero').after(launch);
 const scene=document.querySelector('#mcBreathing .mc-breathing-visual');
 let fitFrame=0;
 function fitScene(){
  if(!scene||!sheet.open||sheet.dataset.panel!=='breathing')return;
  const breath=document.getElementById('mcBreathing');
  if(!breath.querySelector('details[open]')){
   const content=sheet.querySelector('.mc-home-sheet-content'),rect=breath.getBoundingClientRect();
   const available=sheet.clientHeight-(rect.top-sheet.getBoundingClientRect().top)-parseFloat(getComputedStyle(content).paddingBottom)-parseFloat(getComputedStyle(sheet).paddingBottom);
   const fixed=rect.height-scene.getBoundingClientRect().height;
   const height=Math.max(96,Math.min(260,Math.floor(available-fixed-3)));
   if(scene.style.height!==height+'px')scene.style.setProperty('height',height+'px','important');
  }
  const height=scene.getBoundingClientRect().height;if(height>0)scene.style.setProperty('--mc-fit-scene-scale',String(Math.min(.94,height/260)));
 }
 function requestFit(){cancelAnimationFrame(fitFrame);fitFrame=requestAnimationFrame(fitScene);}

 const sheet=document.createElement('dialog');sheet.id='mcHomeSheet';sheet.setAttribute('aria-labelledby','mcHomeSheetTitle');
 sheet.innerHTML='<div class="mc-home-sheet-head"><h2 id="mcHomeSheetTitle">Breathe</h2><button id="mcHomeSheetClose" type="button"><span aria-hidden="true">×</span></button></div><div class="mc-home-sheet-content"></div>';
 body.appendChild(sheet);sheet.querySelector('.mc-home-sheet-content').appendChild(journey);
 if(window.ResizeObserver&&scene){const observer=new ResizeObserver(requestFit);[scene,document.getElementById('mcBreathing'),sheet.querySelector('.mc-home-sheet-head')].forEach(el=>observer.observe(el));}
 window.addEventListener('resize',requestFit);window.visualViewport?.addEventListener('resize',requestFit);

 journey.querySelectorAll('h4').forEach(el=>{el.setAttribute('role','heading');el.setAttribute('aria-level','3');});
 const important=home.lastElementChild;if(important?.textContent.includes('not an emergency service')){important.classList.add('mc-home-service-note');journey.appendChild(important);}
 const welcome=document.querySelector('.mc-front-door');welcome.insertAdjacentHTML('beforeend',footer());
 function stats(){for(const [to,from] of [['mcCompactCheckins','mcJourneyCheckins'],['mcCompactStreak','mcJourneyStreak']]){const target=document.getElementById(to),value=document.getElementById(from)?.textContent||'0';if(target.textContent!==value)target.textContent=value;}}
 function refresh(){
  document.querySelectorAll('[data-hc]').forEach(el=>el.textContent=copy(el.dataset.hc));
  document.querySelectorAll('[data-hc-nav]').forEach(el=>el.textContent=window.MindCheckLocale.t(el.dataset.hcNav));
  document.querySelector('.mc-front-door h1').textContent=copy('title');
  document.querySelector('.mc-front-door [data-i18n="heroDescription"]').textContent=copy('intro');
  document.querySelector('.mc-front-door .mc-primary-action').textContent=copy('start');
  document.querySelector('.mc-front-door .mc-eyebrow').lastChild.textContent=' '+copy('eyebrow');
  document.getElementById('homeTitle').textContent=copy('question');
  document.querySelector('.mc-dashboard-lead').textContent=copy('private');
  document.querySelector('.mc-dashboard-kicker').textContent=copy('eyebrow');
  document.querySelector('.mc-dashboard-main-action').textContent=copy('start');
  document.getElementById('mcHomeSheetClose').setAttribute('aria-label',copy('close'));
  document.getElementById('mcHomeSheetTitle').textContent=copy(sheet.dataset.panel==='journey'?'journey':'breathe');
  document.querySelector('.mc-brand strong').textContent='MindCheck';document.querySelector('.mc-brand small').textContent='SpeakOut Mental Health';
  stats();requestFit();
 }
 function sync(){body.classList.toggle('mc-on-home',body.classList.contains('mc-stage-welcome')||body.classList.contains('mc-stage-dashboard')&&home.classList.contains('active'));}
 function open(panel){
  sheet.dataset.panel=panel;refresh();const bar=document.getElementById('mcLanguageBar');if(bar)sheet.prepend(bar);
  sheet.showModal();sheet.scrollTop=0;body.classList.add('mc-home-sheet-open');requestFit();
 }
 document.getElementById('mcOpenBreathing').addEventListener('click',()=>open('breathing'));
 document.getElementById('mcOpenJourney').addEventListener('click',()=>open('journey'));
 function pauseBreathing(){if(document.getElementById('mcBreathing').dataset.breathState==='running')document.getElementById('mcBreathingStart').click();}
 document.getElementById('mcHomeSheetClose').addEventListener('click',()=>{pauseBreathing();sheet.close();restoreHeader();});
 sheet.addEventListener('cancel',pauseBreathing);
 function restoreHeader(){
  pauseBreathing();
  const bar=document.getElementById('mcLanguageBar');if(bar)body.prepend(bar);body.classList.remove('mc-home-sheet-open');
 }
 sheet.addEventListener('close',restoreHeader);
 new MutationObserver(stats).observe(journey,{childList:true,subtree:true,characterData:true});
 new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['class']});
 new MutationObserver(sync).observe(home,{attributes:true,attributeFilter:['class']});
 // The visible language control makes a second language-selection screen unnecessary.
 function enter(target){
  if(!body.classList.contains('mc-stage-dashboard')){document.getElementById('startBtn').click();document.querySelector('.tbtn.live[data-lang="'+(window.MindCheckLocale?.current()||'en')+'"]').click();}
  document.getElementById(target).click();window.scrollTo({top:0,behavior:'auto'});
 }
 document.querySelector('.mc-primary-action').addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();enter('goMood');},true);
 const cards=Array.from(document.querySelectorAll('.mc-front-discover-card'));
 for(const [index,target] of ['goMood','goTips','goHelp'].entries()){
  const card=cards[index],link=document.createElement('a');link.className=card.className;link.innerHTML=card.innerHTML;link.querySelector('strong').dataset.hcNav=['navMood','navWellness','navSupport'][index];link.href='index.html?section='+['moodSection','tipsSection','helpSection'][index];
  link.addEventListener('click',event=>{event.preventDefault();enter(target);});card.replaceWith(link);
 }
 document.querySelector('.mc-front-discover-title').hidden=true;
 const install=document.getElementById('mcInstallBanner');
 const installButton=document.createElement('button');installButton.type='button';installButton.className='mc-home-install';installButton.dataset.hc='install';installButton.setAttribute('aria-haspopup','dialog');installButton.addEventListener('click',()=>document.getElementById('mcInstallOpen').click());welcome.appendChild(installButton);
 const updateInstall=()=>installButton.hidden=install.dataset.installed==='true';new MutationObserver(updateInstall).observe(install,{attributes:true,attributeFilter:['data-installed']});updateInstall();
 body.classList.add('mc-home-compact');refresh();sync();window.addEventListener('mindcheck:languagechange',refresh);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
