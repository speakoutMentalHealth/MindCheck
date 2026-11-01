/* MindCheck branded arrival experience.
   Intentionally not remembered in local/session storage: replay on refresh.
   Decorative only; age routing, assessment and support controls stay unchanged. */
(function(){
  'use strict';
  const intro=document.getElementById('mcLaunchIntro');
  if(!intro)return;
  // The DOB form sets a one-navigation marker. The landing page consumes it
  // in the <head> to hide the intro before first paint (no one-frame flash).
  if(document.documentElement.classList.contains('mc-launch-handoff')){
    intro.hidden=true;
    return;
  }
  const skip=intro.querySelector('[data-mc-launch-skip]');
  const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const duration=8500;
  intro.classList.add('mc-cinematic');
  intro.dataset.motion=reduced?'gentle':'full';
  // Web Animations API provides a real JS-timed sequence on iOS Safari.
  // CSS keyframes underneath remain a fallback if WAAPI is unavailable.
  const play=(selector,frames)=>{
    const target=intro.querySelector(selector);
    if(!target||typeof target.animate!=='function')return;
    try{target.animate(frames,{duration,fill:'both',easing:'ease-in-out'});}catch(_){}
  };
  if(reduced){
    // Respect system Reduce Motion: a perceptible crossfade without zoom or orbit.
    play('.mc-launch-prelude',[
      {opacity:0,offset:0},{opacity:1,offset:.053},
      {opacity:1,offset:.159},{opacity:0,offset:.244},{opacity:0,offset:1}
    ]);
    play('.mc-launch-inner',[
      {opacity:0,offset:0},{opacity:0,offset:.159},
      {opacity:1,offset:.148},{opacity:1,offset:1}
    ]);
  }else{
    play('.mc-launch-prelude',[
      {opacity:0,transform:'translate(-50%,-35%) scale(.76)',offset:0},
      {opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.064},
      {opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.148},
      {opacity:0,transform:'translate(-50%,-95%) scale(.56)',offset:.259},
      {opacity:0,transform:'translate(-50%,-95%) scale(.56)',offset:1}
    ]);
    play('.mc-launch-inner',[
      {opacity:0,transform:'translateY(25px) scale(.91)',offset:0},
      {opacity:0,transform:'translateY(25px) scale(.91)',offset:.154},
      {opacity:1,transform:'translateY(0) scale(1)',offset:.286},
      {opacity:1,transform:'translateY(0) scale(1)',offset:1}
    ]);
    play('.mc-launch-mark',[
      {opacity:.2,transform:'scale(.52) rotate(-15deg)',offset:0},
      {opacity:.2,transform:'scale(.52) rotate(-15deg)',offset:.159},
      {opacity:1,transform:'scale(1.11) rotate(3deg)',offset:.291},
      {opacity:1,transform:'scale(1) rotate(0)',offset:.402},
      {opacity:1,transform:'scale(1) rotate(0)',offset:1}
    ]);
    play('.mc-launch-beam',[
      {opacity:.12,transform:'translateX(-8%) rotate(-3deg)',offset:0},
      {opacity:.72,transform:'translateX(8%) rotate(2deg)',offset:.291},
      {opacity:.24,transform:'translateX(0) rotate(0)',offset:1}
    ]);
  }
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
    const productLink=intro.querySelector('.mc-launch-footnote a');
    skip.addEventListener('click',()=>finish(true));
    intro.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();finish(true);}
      if(event.key==='Tab'&&productLink){
        const backward=event.shiftKey===true;
        if((!backward&&document.activeElement===skip)||(backward&&document.activeElement===productLink)){
          event.preventDefault();productLink.focus();
        }
      }
    });
  }
  timer=window.setTimeout(()=>finish(false),duration);
  if(skip&&!reduced){try{skip.focus({preventScroll:true});}catch(_){skip.focus();}}
})();
