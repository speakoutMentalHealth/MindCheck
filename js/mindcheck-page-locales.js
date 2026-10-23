/* Translate presentation text only, preserving links, filters and form state. */
(function(){
'use strict';
const originals=new WeakMap();
const normalize=text=>text.replace(/\s+/g,' ').trim();
function refresh(){
 const locale=window.MindCheckLocale;if(!locale)return;
 let code=typeof locale.current==='function'?locale.current():document.documentElement.lang;
 try{if(typeof locale.current!=='function')code=localStorage.getItem('mc_lang')||code;}catch(_){}
 const root=document.getElementById('assessmentMain');
 const dictionary=window.MindCheckAssessmentTranslations?.[code];
 if(root&&dictionary){
  // Text-node replacement keeps link destinations and nested emphasis intact.
  const scope=document.body,walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   if(node.parentElement.closest('script,style,#mcLanguageBar,#mc-premium-tabs'))continue;
   if(!originals.has(node))originals.set(node,node.textContent);
   const original=originals.get(node),key=normalize(original);
   if(dictionary[key])node.textContent=original.replace(/\S[\s\S]*\S|\S/,dictionary[key]);
  }
  document.documentElement.lang=code;
  document.body.dataset.mcTranslated='true';
  document.title=locale.t('assessmentTitle')+' | SpeakOut MindCheck';
  document.querySelector('.ac-jump')?.setAttribute('aria-label',locale.t('assessmentShortcuts'));
  document.querySelector('.ac-filters')?.setAttribute('aria-label',locale.t('assessmentFilter'));
 }
 document.querySelectorAll('[data-mcw]').forEach(el=>{el.textContent=locale.t(el.dataset.mcw);});
 const names=['navHome','navMood','navAssessments','navWellness','navSupport','navAwards'];
 document.querySelectorAll('#mc-premium-tabs .mc-tab-label').forEach((el,i)=>{if(names[i]){el.textContent=locale.t(names[i]);el.lang=code;}});
 document.getElementById('tipShareBtn')?.replaceChildren(document.createTextNode(locale.t('shareTip')));
 document.querySelector('#tipsSection [aria-label="Filter tips"],#tipsSection [data-localized-filter]')?.setAttribute('data-localized-filter','true');
 document.querySelector('#tipsSection [data-localized-filter]')?.setAttribute('aria-label',locale.t('filterTips'));
 document.getElementById('tipActions')?.setAttribute('aria-label',locale.t('wellnessActions'));
}
window.addEventListener('mindcheck:languagechange',refresh);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
})();
