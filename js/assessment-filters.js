/* Assessment Centre: explicitly declared tool-type filtering, no clinical data processing. */
(()=>{
  'use strict';
  function init(){
    const group=document.querySelector('.ac-filters');
    const grid=document.querySelector('.ac-grid');
    const status=document.getElementById('acFilterStatus');
    if(!group||!grid||!status)return;
    const cards=Array.from(grid.querySelectorAll('.ac-card[data-tool-type]'));
    const buttons=Array.from(group.querySelectorAll('button[data-ac-filter]'));
    if(!cards.length||!buttons.length)return;
    const accepted=new Set(['all','questionnaire','guidance']);
    function apply(filter){
      if(!accepted.has(filter))return;
      let shown=0;
      cards.forEach(card=>{
        const visible=filter==='all'||card.dataset.toolType===filter;
        card.hidden=!visible;
        if(visible)shown++;
      });
      buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.acFilter===filter)));
      // Count remains meaningful when card titles are translated.
      status.textContent='Showing '+shown+' of '+cards.length+' resources';
    }
    buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.acFilter)));
    apply('all');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
