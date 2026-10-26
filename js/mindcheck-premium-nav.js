/* Progressive MindCheck navigation: keeps the existing screen handlers intact.
   Adds browser Back/Forward, an accessible mobile section bar, and focus handling. */
(function () {
  'use strict';
  const ids=['homeSection','moodSection','formContainer','tipsSection','helpSection','badgesSection'];
  const labels={homeSection:'Home',moodSection:'My Buddy',formContainer:'Assessments',tipsSection:'Wellness',helpSection:'Support',badgesSection:'Awards'};
  const icons={"homeSection":"<path d=\"m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z\"/>","moodSection":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2M8.5 9h.01M15.5 9h.01\"/>","formContainer":"<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M9 8h6M9 12h6M9 16h4\"/>","tipsSection":"<path d=\"M9 18h6M10 21h4M8 14a7 7 0 1 1 8 0c-.7.6-1 1.2-1 2H9c0-.8-.3-1.4-1-2z\"/>","helpSection":"<path d=\"M20 12v5a3 3 0 0 1-3 3h-2l-3 2-3-2H7a3 3 0 0 1-3-3v-5\"/><path d=\"M12 15S5 11 5 7a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-7 8-7 8z\"/>","badgesSection":"<path d=\"m12 2 3 6 7 .9-5 5 .9 7.1-5.9-3.2L6.1 21l.9-7.1-5-5L9 8z\"/>"};
  let current='',suppressHistory=false;
  function ready(){return document.body.classList.contains('mc-stage-dashboard');}
  function activeId(){return ids.find(id=>document.getElementById(id)?.classList.contains('active'))||'';}
  function findTrigger(id){return {homeSection:null,moodSection:'goMood',formContainer:'goScreenings',tipsSection:'goTips',helpSection:'goHelp',badgesSection:'goBadges'}[id];}
  function navigate(id,fromHistory){
    if(id==='moodSection'){window.location.assign('daily-life.html');return;}
    if(id==='formContainer'){window.location.assign('assessment-centre.html');return;}
    if(!ids.includes(id))return;
    if(!ready())return;
    if(id==='homeSection') {
      const back={moodSection:'moodBackHome',formContainer:'formBackHome',tipsSection:'tipsBackHome',helpSection:'helpBackHome',badgesSection:'badgesBackHome'}[activeId()];
      if(back)document.getElementById(back)?.click();
      else if(document.getElementById('homeSection')){document.getElementById('homeSection').classList.add('active');}
    }else{
      const trigger=document.getElementById(findTrigger(id));
      trigger?.click();
    }
    if(fromHistory)suppressHistory=true;
    window.requestAnimationFrame(()=>{sync();if(fromHistory)suppressHistory=false;});
  }
  function sync(){
    if(!ready())return;
    const id=activeId();
    if(!id)return;
    const changed=id!==current;
    current=id;
    document.querySelectorAll('[data-mc-nav-target]').forEach(el=>{
      const active=el.dataset.mcNavTarget===id;
      if(active)el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    if(changed&&!suppressHistory){
      const next='#'+id;
      if(location.hash!==next)history.pushState({mcScreen:id},'',next);
    }
    if(changed&&id!=='homeSection'){
      const section=document.getElementById(id);
      const title=section?.querySelector('h1,h2,[role=heading]');
      if(title){if(!title.hasAttribute('tabindex'))title.setAttribute('tabindex','-1');title.focus({preventScroll:true});}
    }
  }
  function mount(){
    if(document.getElementById('mc-premium-tabs'))return;
    const nav=document.createElement('nav');
    nav.id='mc-premium-tabs';
    nav.className='mc-premium-tabs';
    nav.setAttribute('aria-label','MindCheck sections');
    ids.forEach(id=>{
      const button=document.createElement('button');
      button.type='button';button.dataset.mcNavTarget=id;
      button.innerHTML='<span class="mc-tab-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[id]+'</svg></span><span class="mc-tab-label">'+labels[id]+'</span>';
      button.addEventListener('click',()=>{button.classList.remove('mc-tapped');void button.offsetWidth;button.classList.add('mc-tapped');navigate(id,false);});
      button.addEventListener('animationend',()=>button.classList.remove('mc-tapped'));
      nav.appendChild(button);
    });
    document.body.appendChild(nav);
    let pendingDeepLink=ids.includes(location.hash.slice(1))?location.hash.slice(1):'';
    // Standalone tabs link into specific dashboard sections. Complete the existing
    // welcome/language flow using its real handlers before navigating the section.
    // Without this, the hash points at a section hidden by onboarding.
    if(pendingDeepLink && !ready()){
      const start=document.getElementById('startBtn');
      const language=document.querySelector('.tbtn.live[data-lang="en"]');
      if(start && language){
        start.click();
        language.click();
      }
    }
    const observer=new MutationObserver(()=>{
      if(ready()&&pendingDeepLink){
        const target=pendingDeepLink;pendingDeepLink='';
        if(target!=='homeSection'&&target!=='formContainer')navigate(target,true);
        else if(target==='formContainer')navigate(target,true);
      }
      sync();
    });
    observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{attributes:true,attributeFilter:['class']});});
    window.addEventListener('popstate',()=>{
      const id=location.hash.replace('#','');
      if(ids.includes(id))navigate(id,true);
      else navigate('homeSection',true);
    });
    window.addEventListener('hashchange',()=>{
      const id=location.hash.replace('#','');
      if(ids.includes(id)&&id!==activeId())navigate(id,true);
    });
    const start=document.getElementById('startBtn');
    if(start)start.addEventListener('click',()=>{current='';});
    document.querySelectorAll('.tbtn.live').forEach(b=>b.addEventListener('click',()=>{setTimeout(sync,0);}));
    if(pendingDeepLink && ready()){
      const target=pendingDeepLink;
      pendingDeepLink='';
      if(target!=='homeSection')navigate(target,true);
    }
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
  else mount();
})();
