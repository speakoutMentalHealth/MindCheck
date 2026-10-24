/* Non-clinical adult learning headings; other content remains English until reviewed. */
(()=>{'use strict';const words={
 en:{title:'Everyday wellbeing for adults',intro:'Small, practical activities you can try at your own pace. These suggestions are educational, not treatment or diagnosis.',busyTitle:'Managing a busy day',sleepTitle:'Rest and sleep habits',relationsTitle:'Relationships and boundaries',stressTitle:'When stress persists'},
 fr:{title:'Bien-être au quotidien pour les adultes',intro:'De petites activités pratiques à essayer à votre rythme. Ces suggestions sont éducatives et ne remplacent ni un traitement ni un diagnostic.',busyTitle:'Gérer une journée chargée',sleepTitle:'Repos et habitudes de sommeil',relationsTitle:'Relations et limites personnelles',stressTitle:'Quand le stress persiste'}
};const host=document.querySelector('[aria-labelledby="mcAdultWellnessTitle"]');if(!host)return;
function update(){let lang='en';try{lang=localStorage.getItem('mc_lang')||'en'}catch(_){}if(!Object.prototype.hasOwnProperty.call(words,lang))lang='en';for(const el of host.querySelectorAll('[data-adult-i18n]')){const value=words[lang][el.dataset.adultI18n];if(value)el.textContent=value;}host.setAttribute('lang',lang);}
window.addEventListener('mindcheck:languagechange',update);window.addEventListener('storage',e=>{if(e.key==='mc_lang')update()});update();
})();
