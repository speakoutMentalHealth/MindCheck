/* MindCheck multilingual foundation. Non-clinical interface preview only.
   Clinical screenings, results, certificates and referrals remain in their approved source language. */
(function(){
  'use strict';
  const labels={
    en:{choose:"Choose your language:",welcome:"Welcome to MindCheck",notice:"Language preview: clinical screenings, certificates and some resources remain in English until reviewed."},
    ha:{choose:"Zaɓi harshenka:",welcome:"Barka da zuwa MindCheck",notice:"Gwajin lafiyar kwakwalwa da takardun shaida suna nan a Turanci har sai an tantance fassarar."},
    ig:{choose:"Họrọ asụsụ gị:",welcome:"Nnọọ na MindCheck",notice:"Nnwale ahụike uche na asambodo ka dị n'asụsụ Bekee ruo mgbe a nyochachara ntụgharị ha."},
    yo:{choose:"Yan èdè rẹ:",welcome:"Ẹ káàbọ̀ sí MindCheck",notice:"Àwọn ìdánwò ìlera ọpọlọ àti ìwé-ẹ̀rí ṣì wà ní Gẹ̀ẹ́sì títí a ó fi ṣàyẹ̀wò ìtumọ̀ wọn."},
    pcm:{choose:"Choose di language wey you want:",welcome:"Welcome to MindCheck",notice:"Mental health screening and certificate still dey English until dem check di translation."},
    fr:{choose:"Choisissez votre langue :",welcome:"Bienvenue sur MindCheck",notice:"Les questionnaires de santé mentale et les certificats restent en anglais jusqu’à validation des traductions."}
  };
  const supported=Object.keys(labels);
  function apply(lang){
    const code=supported.includes(lang)?lang:'en';
    const words=labels[code];
    document.documentElement.lang=code;
    const title=document.getElementById('langTitle');
    if(title)title.textContent=words.choose;
    const home=document.getElementById('homeTitle');
    if(home)home.textContent=words.welcome+' 🌿';
    const notice=document.getElementById('mcLocaleNotice');
    if(notice){notice.textContent=words.notice;notice.hidden=code==='en';}
    document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===code)));
    try{localStorage.setItem('mc_lang',code);}catch(_){}
    return code;
  }
  window.MindCheckLocale={apply,supported};
  document.addEventListener('DOMContentLoaded',function(){
    let saved='en';try{saved=localStorage.getItem('mc_lang')||'en';}catch(_){}
    apply(saved);
  });
})();