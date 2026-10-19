/* Shared language control. Uses the existing non-clinical locale engine. */
(function(){
  'use strict';
  const languages=[['en','English'],['ha','Hausa'],['ig','Igbo'],['yo','Yorùbá'],['pcm','Pidgin'],['fr','Français']];
  const labels={en:'Language',ha:'Harshe',ig:'Asụsụ',yo:'Èdè',pcm:'Language',fr:'Langue'};
  let selected='en';
  function mount(){
    if(window.self!==window.top || document.getElementById('mcLanguageBar'))return;
    const locale=window.MindCheckLocale;if(!locale)return;
    try{selected=localStorage.getItem('mc_lang')||'en';}catch(_){}
    if(!locale.supported.includes(selected))selected='en';
    const bar=document.createElement('div');bar.id='mcLanguageBar';bar.setAttribute('role','region');bar.setAttribute('aria-label','Language settings');
    bar.innerHTML='<div class="mc-language-inner"><label for="mcLanguageSelect"><span aria-hidden="true">🌐</span> <span id="mcLanguageLabel">Language</span></label><select id="mcLanguageSelect" aria-describedby="mcLanguageNote"></select></div><p id="mcLanguageNote" lang="en" hidden></p>';
    const select=bar.querySelector('select'),label=bar.querySelector('#mcLanguageLabel'),note=bar.querySelector('p');
    for(const [code,name] of languages){const option=document.createElement('option');option.value=code;option.lang=code;option.textContent=name;select.appendChild(option);}
    document.body.style.setProperty('--mc-content-padding-top',getComputedStyle(document.body).paddingTop);
    document.body.prepend(bar);document.body.classList.add('mc-has-language-bar');
    const resize=()=>document.documentElement.style.setProperty('--mc-language-height',bar.getBoundingClientRect().height+'px');
    function update(code){
      selected=locale.supported.includes(code)?code:'en';select.value=selected;label.textContent=labels[selected];label.lang=selected;
      note.hidden=selected==='en';
      note.textContent=document.getElementById('homeSection')?'Some content, including screening tools, remains in English.':'Language preference saved. This page’s content is currently in English.';
      resize();
    }
    select.addEventListener('change',()=>update(locale.apply(select.value)));
    window.addEventListener('mindcheck:languagechange',event=>update(event.detail.language));
    window.addEventListener('storage',event=>{if(event.key==='mc_lang')update(locale.apply(event.newValue||'en'));});
    if(window.ResizeObserver)new ResizeObserver(resize).observe(bar);
    window.addEventListener('resize',resize);
    update(selected);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
