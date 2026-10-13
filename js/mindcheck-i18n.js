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

  // Non-clinical navigation only; screening instruments and clinical content are not translated.
  const navigation={
    en:{change:"Change language",mood:"Check Your Mood",screen:"Mental Health Screenings",tips:"Wellness Tips",help:"Get Help",badges:"Badges & Awards"},
    ha:{change:"Canja harshe",mood:"Duba yanayin zuciyarka",screen:"Gwaje-gwajen lafiyar kwakwalwa",tips:"Shawarwarin jin daɗi",help:"Nemi taimako",badges:"Lambobin yabo"},
    ig:{change:"Gbanwee asụsụ",mood:"Lelee ọnọdụ obi gị",screen:"Nnwale ahụike uche",tips:"Ndụmọdụ maka ọdịmma",help:"Nweta enyemaka",badges:"Baajị na onyinye"},
    yo:{change:"Yí èdè padà",mood:"Ṣàyẹ̀wò bí ọkàn rẹ ṣe rí",screen:"Àwọn ìdánwò ìlera ọpọlọ",tips:"Àwọn ìmọ̀ràn ìlera",help:"Gba ìrànlọ́wọ́",badges:"Àwọn àmì ẹ̀yẹ"},
    pcm:{change:"Change language",mood:"Check how you dey feel",screen:"Mental health screening",tips:"Tips to feel better",help:"Get help",badges:"Badges and awards"},
    fr:{change:"Changer de langue",mood:"Vérifier votre humeur",screen:"Questionnaires de santé mentale",tips:"Conseils de bien-être",help:"Obtenir de l’aide",badges:"Badges et récompenses"}
  };
  function updateNavigation(code){
    const words=navigation[code];
    const change=document.getElementById('mcChangeLanguage');
    if(change)change.textContent='🌍 '+words.change;
    for(const [id,key] of [['goMood','mood'],['goScreenings','screen'],['goTips','tips'],['goHelp','help'],['goBadges','badges']]){
      const card=document.getElementById(id);
      const heading=card&&card.querySelector('h3');
      if(heading)heading.textContent=words[key];
      // Accessible name must match the translated navigation label.
      if(card)card.setAttribute('aria-label',words[key]);
    }
  }
  const supported=Object.keys(labels);
  function apply(lang){
    const code=supported.includes(lang)?lang:'en';
    const words=labels[code];
    document.documentElement.lang=code;
    updateNavigation(code);
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