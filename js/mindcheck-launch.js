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
  // Fifteen-second storyboard:
  // 0–2.7s: MindCheck wordmark; 2.7–6.1s: SpeakOut logo unveils;
  // 6–9.5s: message emerges; 9.5–15s: final message remains readable.
  const duration=15000;
  intro.classList.add('mc-cinematic','mc-unveiling');
  intro.dataset.motion=reduced?'gentle':'full';
  const play=(selector,frames)=>{
    const target=intro.querySelector(selector);
    if(!target||typeof target.animate!=='function')return;
    try {target.animate(frames,{duration,fill:'both',easing:'linear'});}catch(_){}
  };
  if(reduced){
    // Fade-only version: still reveals the logo but never spins, zooms or sweeps.
    play('.mc-launch-prelude',[
      {opacity:0,offset:0},{opacity:1,offset:.05},{opacity:1,offset:.145},
      {opacity:0,offset:.20},{opacity:0,offset:1}
    ]);
    play('.mc-launch-inner',[
      {opacity:0,offset:0},{opacity:0,offset:.16},
      {opacity:1,offset:.27},{opacity:1,offset:1}
    ]);
    play('.mc-launch-logo',[
      {opacity:0,offset:0},{opacity:0,offset:.18},
      {opacity:1,offset:.36},{opacity:1,offset:1}
    ]);
  }else{
    play('.mc-launch-prelude',[
      {opacity:0,transform:'translate(-50%,-30%) scale(.76)',offset:0},
      {opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.07},
      {opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.155},
      {opacity:0,transform:'translate(-50%,-100%) scale(.60)',offset:.21},
      {opacity:0,offset:1}
    ]);
    play('.mc-launch-inner',[
      {opacity:0,transform:'translateY(24px) scale(.90)',offset:0},
      {opacity:0,transform:'translateY(24px) scale(.90)',offset:.17},
      {opacity:1,transform:'translateY(0) scale(1)',offset:.30},
      {opacity:1,transform:'translateY(0) scale(1)',offset:1}
    ]);
    play('.mc-launch-mark',[
      {opacity:0,transform:'scale(.42) rotate(-20deg)',offset:0},
      {opacity:0,transform:'scale(.42) rotate(-20deg)',offset:.17},
      {opacity:1,transform:'scale(1.08) rotate(4deg)',offset:.32},
      {opacity:1,transform:'scale(1) rotate(0)',offset:.44},
      {opacity:1,transform:'scale(1) rotate(0)',offset:1}
    ]);
    // The real SpeakOut logo is uncovered progressively instead of simply appearing.
    play('.mc-launch-logo',[
      {clipPath:'circle(0% at 50% 50%)',opacity:.2,offset:0},
      {clipPath:'circle(0% at 50% 50%)',opacity:.2,offset:.20},
      {clipPath:'circle(36% at 50% 50%)',opacity:1,offset:.29},
      {clipPath:'circle(75% at 50% 50%)',opacity:1,offset:.405},
      {clipPath:'circle(75% at 50% 50%)',opacity:1,offset:1}
    ]);
    play('.mc-launch-beam',[
      {opacity:0,transform:'translateX(-14%) rotate(-6deg)',offset:0},
      {opacity:0,transform:'translateX(-14%) rotate(-6deg)',offset:.14},
      {opacity:.95,transform:'translateX(5%) rotate(3deg)',offset:.33},
      {opacity:.28,transform:'translateX(12%) rotate(5deg)',offset:.48},
      {opacity:.28,offset:1}
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
