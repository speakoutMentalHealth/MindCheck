/* Progressive interaction polish. Existing save, sharing and scoring own their data. */
(function(){
'use strict';
function animate(el,frames){
  if(!el || !el.animate || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  el.animate(frames,{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
}
var card=document.getElementById('tipCard'),text=document.getElementById('tipText');
if(card&&text){
  new MutationObserver(function(){animate(card,[{opacity:.35,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}]);}).observe(text,{childList:true,characterData:true,subtree:true});
  var origin=null;
  card.addEventListener('pointerdown',function(e){if(e.isPrimary && e.pointerType!=='mouse')origin={x:e.clientX,y:e.clientY,id:e.pointerId};});
  card.addEventListener('pointerup',function(e){
    if(!origin||origin.id!==e.pointerId)return;
    var dx=e.clientX-origin.x,dy=e.clientY-origin.y;origin=null;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.6)document.getElementById('nextTip').click();
  });
  card.addEventListener('pointercancel',function(){origin=null;});
  var status=document.getElementById('tipStatus');
  new MutationObserver(function(){if(status.style.display!=='none')animate(status,[{opacity:.25,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}]);}).observe(status,{childList:true,characterData:true,subtree:true});
}
var meter=document.getElementById('mcBadgeProgress'),badges=document.getElementById('badgesGrid');
function updateMilestone(){
  var streak=0;try{var now=new Date(), y=new Date(now);y.setDate(y.getDate()-1);var day=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};var last=localStorage.getItem('mc_lastCheckin');if(last===day(now)||last===day(y))streak=Number(localStorage.getItem('mc_streak'))||0;}catch(_){}
  meter.value=Math.min(20,Math.max(0,streak));
}
if(meter&&badges){
  updateMilestone();new MutationObserver(updateMilestone).observe(badges,{childList:true});
}
var filters=document.querySelectorAll('[data-ac-filter]');
if(filters.length){
  var cards=Array.from(document.querySelectorAll('.ac-card[data-category]'));
  var questionnaires=['emotional','focus','substance'];
  function apply(filter){
    if(!['all','questionnaire','guidance'].includes(filter))return;
    var shown=0;
    cards.forEach(function(el){
      // Prefer explicit card classification; keep a fallback for any older page.
      var questionnaire=el.dataset.toolType
        ?el.dataset.toolType==='questionnaire'
        :questionnaires.includes(el.dataset.category)||!!el.querySelector('a[href="pcl5-screening.html"]');
      var visible=filter==='all'||(filter==='questionnaire'?questionnaire:!questionnaire);
      el.hidden=!visible;
      if(visible)shown++;
    });
    filters.forEach(function(btn){btn.setAttribute('aria-pressed',String(btn.dataset.acFilter===filter));});
    var count=document.getElementById('acFilterStatus');
    if(count)count.textContent='Showing '+shown+' of '+cards.length+' resources';
  }
  filters.forEach(function(btn){btn.addEventListener('click',function(){apply(btn.dataset.acFilter);});});apply('all');
}
})();
