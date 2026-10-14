/* Progressive MindCheck navigation: keeps the existing screen handlers intact.
   Adds browser Back/Forward, an accessible mobile section bar, and focus handling. */
(function () {
  'use strict';
  const ids=['homeSection','moodSection','formContainer','tipsSection','helpSection','badgesSection'];
  const labels={homeSection:'Home',moodSection:'Mood',formContainer:'Assessments',tipsSection:'Wellness',helpSection:'Support',badgesSection:'Awards'};
  const icons={homeSection:'⌂',moodSection:'◉',formContainer:'▤',tipsSection:'✦',helpSection:'♡',badgesSection:'☆'};
  let current='',suppressHistory=false;
  function ready(){return document.body.classList.contains('mc-stage-dashboard');}
  function activeId(){return ids.find(id=>document.getElementById(id)?.classList.contains('active'))||'';}
  function findTrigger(id){return {homeSection:null,moodSection:'goMood',formContainer:'goScreenings',tipsSection:'goTips',helpSection:'goHelp',badgesSection:'goBadges'}[id];}
  function navigate(id,fromHistory){
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
      button.innerHTML='<span class="mc-tab-icon" aria-hidden="true">'+icons[id]+'</span><span>'+labels[id]+'</span>';
      button.addEventListener('click',()=>navigate(id,false));
      nav.appendChild(button);
    });
    document.body.appendChild(nav);
    const observer=new MutationObserver(()=>sync());
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
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
  else mount();
})();
