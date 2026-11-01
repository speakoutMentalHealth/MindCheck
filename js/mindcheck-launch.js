/* MindCheck branded arrival experience.
   Intentionally not remembered in local/session storage: replay on refresh.
   Decorative only; age routing, assessment and support controls stay unchanged. */
(function(){
  'use strict';
  const intro=document.getElementById('mcLaunchIntro');
  if(!intro)return;
  // A completed DOB selection is a navigation, not a fresh arrival; avoid a second intro.
  // A real refresh always plays the intro, including after returning from age entry.
  try{
    const ref=document.referrer?new URL(document.referrer):null;
    const navigation=window.performance&&window.performance.getEntriesByType('navigation')[0];
    if(ref&&ref.origin===window.location.origin&&/\/age-entry\.html$/.test(ref.pathname)&&navigation?.type!=='reload'){
      intro.hidden=true;
      return;
    }
  }catch(_){}
  const skip=intro.querySelector('[data-mc-launch-skip]');
  const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const elements=Array.from(document.body.children).filter(el=>el!==intro&&el.tagName!=='SCRIPT'&&el.tagName!=='STYLE');
  const originalInert=elements.map(el=>[el,!!el.inert]);
  let closed=false;
  let timer;
  document.documentElement.classList.add('mc-launch-open');
  originalInert.forEach(([el])=>{el.inert=true;});
  function finish(initiatedByUser){
    if(closed)return;
    closed=true;
    clearTimeout(timer);
    intro.classList.add('is-exiting');
    document.documentElement.classList.remove('mc-launch-open');
    originalInert.forEach(([el,wasInert])=>{el.inert=wasInert;});
    const main=document.getElementById('main-content')||document.querySelector('main');
    if(initiatedByUser&&main){
      if(!main.hasAttribute('tabindex'))main.setAttribute('tabindex','-1');
      try{main.focus({preventScroll:true});}catch(_){main.focus();}
    }
    window.setTimeout(()=>{intro.hidden=true;},reduced?0:600);
  }
  if(skip){
    skip.addEventListener('click',()=>finish(true));
    intro.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();finish(true);}
      if(event.key==='Tab'){event.preventDefault();skip.focus();}
    });
  }
  timer=window.setTimeout(()=>finish(false),reduced?150:4500);
  if(skip&&!reduced){try{skip.focus({preventScroll:true});}catch(_){skip.focus();}}
})();
