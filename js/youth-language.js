/* Youth educational headings: non-clinical language preview. No external calls. */
(()=>{'use strict';
const words={
 en:{eyebrow:'EVERYDAY WELLBEING',heading:'Little skills for everyday life',schoolTitle:'When school feels stressful',friendTitle:'Friendship and boundaries',feelingsTitle:'Big feelings',onlineTitle:'Online wellbeing'},
 fr:{eyebrow:'BIEN-ÊTRE AU QUOTIDIEN',heading:'De petites habitudes utiles au quotidien',schoolTitle:'Quand l’école devient stressante',friendTitle:'Amitié et limites personnelles',feelingsTitle:'Les émotions intenses',onlineTitle:'Bien-être en ligne'}
};
const select=document.createElement('select');select.id='mcYouthLanguage';select.setAttribute('aria-label','Youth page language');
for(const [code,name] of [['en','English'],['fr','Français']]){const option=document.createElement('option');option.value=code;option.textContent=name;select.append(option);}
const label=document.createElement('label');label.htmlFor=select.id;label.textContent='Page language / Langue de la page';label.style.cssText='display:block;font-weight:700;margin:8px 0';
const note=document.createElement('p');note.className='quiet';note.textContent='Only the everyday learning headings are translated in this preview. Other content remains in English until reviewed.';
const host=document.getElementById('everyday');if(!host)return;host.prepend(note);host.prepend(select);host.prepend(label);
function apply(code){const language=Object.hasOwn(words,code)?code:'en';select.value=language;for(const node of host.querySelectorAll('[data-youth-i18n]')){const value=words[language][node.dataset.youthI18n];if(value)node.textContent=value;}note.textContent=language==='fr'?'Seuls les titres des activités quotidiennes sont traduits pour le moment. Le reste du contenu reste en anglais en attendant une révision.':'Only the everyday learning headings are translated in this preview. Other content remains in English until reviewed.';host.lang=language;}
select.addEventListener('change',()=>apply(select.value));apply('en');
})();
