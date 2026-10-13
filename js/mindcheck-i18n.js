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
  const dashboard={
  "en": {
    "nextStep": "Choose Your Next Step",
    "nextStepHelp": "Every step helps you understand and care for your mental health.",
    "mood": "Check Your Mood",
    "tips": "Wellness Tips",
    "help": "Get Help",
    "badges": "Badges & Awards",
    "volunteer": "Volunteer Zone",
    "resources": "Clinics & Resources"
  },
  "ha": {
    "nextStep": "Zaɓi matakinka na gaba",
    "nextStepHelp": "Kowane mataki yana taimaka maka ka fahimci kuma ka kula da lafiyar kwakwalwarka.",
    "mood": "Duba yanayinka",
    "tips": "Shawarwarin jin daɗi",
    "help": "Nemi taimako",
    "badges": "Lambobin yabo",
    "volunteer": "Sashen masu sa kai",
    "resources": "Asibitoci da albarkatu"
  },
  "ig": {
    "nextStep": "Họrọ ihe ị ga-eme ọzọ",
    "nextStepHelp": "Nzọụkwụ ọ bụla na-enyere gị aka ịghọta ma lekọta ahụike uche gị.",
    "mood": "Lelee ọnọdụ obi gị",
    "tips": "Ndụmọdụ maka ọdịmma",
    "help": "Nweta enyemaka",
    "badges": "Baajị na onyinye",
    "volunteer": "Ngalaba ndị ọrụ afọ ofufo",
    "resources": "Ụlọ ọgwụ na akụrụngwa"
  },
  "yo": {
    "nextStep": "Yan ìgbésẹ̀ tó kàn",
    "nextStepHelp": "Gbogbo ìgbésẹ̀ ń ràn ọ́ lọ́wọ́ láti lóye àti láti tọ́jú ìlera ọpọlọ rẹ.",
    "mood": "Ṣàyẹ̀wò bí ọ ṣe ń rí lára",
    "tips": "Àwọn ìmọ̀ràn ìlera",
    "help": "Gba ìrànlọ́wọ́",
    "badges": "Àwọn àmì ẹ̀yẹ àti ẹ̀bùn",
    "volunteer": "Ẹ̀ka àwọn olùyọ̀ǹda",
    "resources": "Ilé ìwòsàn àti àwọn ohun èlò"
  },
  "pcm": {
    "nextStep": "Choose wetin you wan do next",
    "nextStepHelp": "Every small step dey help you understand and take care of your mental health.",
    "mood": "Check how you dey feel",
    "tips": "Tips to feel better",
    "help": "Find help",
    "badges": "Badges and awards",
    "volunteer": "Volunteer area",
    "resources": "Clinics and resources"
  },
  "fr": {
    "nextStep": "Choisissez la prochaine étape",
    "nextStepHelp": "Chaque étape vous aide à comprendre et à prendre soin de votre santé mentale.",
    "mood": "Vérifier votre humeur",
    "tips": "Conseils bien-être",
    "help": "Obtenir de l’aide",
    "badges": "Badges et récompenses",
    "volunteer": "Espace bénévoles",
    "resources": "Cliniques et ressources"
  }
};
  // Non-clinical dashboard navigation; draft translations require native-speaker review.
  const nav={
    en:{mood:"Check Your Mood",tips:"Wellness Tips",help:"Get Help",volunteer:"Volunteer Zone",resources:"Clinics & Resources",change:"Change language",back:"Back to Home",screen:"Mental Health Screenings (English)"},
    ha:{mood:"Duba yanayin zuciyarka",tips:"Shawarwarin jin daɗi",help:"Nemi taimako",volunteer:"Sashen masu sa kai",resources:"Asibitoci da albarkatu",change:"Canja harshe",back:"Koma shafin farko",screen:"Mental Health Screenings (English)"},
    ig:{mood:"Lelee ọnọdụ obi gị",tips:"Ndụmọdụ maka ọdịmma",help:"Nweta enyemaka",volunteer:"Ndị ọrụ afọ ofufo",resources:"Ụlọọgwụ na akụrụngwa",change:"Gbanwee asụsụ",back:"Laghachi na mbido",screen:"Mental Health Screenings (English)"},
    yo:{mood:"Ṣàyẹ̀wò bí ọkàn rẹ ṣe rí",tips:"Àwọn ìmọ̀ràn ìlera",help:"Gba ìrànlọ́wọ́",volunteer:"Àwọn olùyọ̀ǹda ara ẹni",resources:"Ilé ìwòsàn àti ohun èlò",change:"Yí èdè padà",back:"Padà sí ojúlé",screen:"Mental Health Screenings (English)"},
    pcm:{mood:"Check how you dey feel",tips:"Tips to feel better",help:"Find help",volunteer:"Volunteer people",resources:"Hospitals and help",change:"Change language",back:"Go back home",screen:"Mental Health Screenings (English)"},
    fr:{mood:"Évaluez votre humeur",tips:"Conseils de bien-être",help:"Obtenir de l’aide",volunteer:"Espace bénévoles",resources:"Cliniques et ressources",change:"Changer de langue",back:"Retour à l’accueil",screen:"Mental Health Screenings (English)"}
  };
  function applyNavigation(code){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const key=el.getAttribute('data-i18n');
      if(nav[code][key])el.textContent=nav[code][key];
    });
    const change=document.getElementById('mcChangeLanguage');
    if(change)change.textContent='🌍 '+nav[code].change;
    ['moodBackHome','formBackHome','tipsBackHome','helpBackHome','badgesBackHome'].forEach(function(id){
      const el=document.getElementById(id);if(el)el.textContent=nav[code].back;
    });
  }
  const supported=Object.keys(labels);
  function apply(lang){
    const code=supported.includes(lang)?lang:'en';
    const words=labels[code];
    document.documentElement.lang=code;
    applyNavigation(code);
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.getAttribute('data-i18n');if(dashboard[code] && dashboard[code][key])el.textContent=dashboard[code][key];});
    updateNavigation(code);
    const title=document.getElementById('langTitle');
    if(title)title.textContent=words.choose;
    const home=document.getElementById('homeTitle');
    if(home)home.textContent=words.welcome+' 🌿';
    const notice=document.getElementById('mcLocaleNotice');
    if(notice){notice.textContent=words.notice;notice.hidden=code==='en';}
    const common={
      en:{nextStep:"Choose Your Next Step",nextStepHelp:"Every step helps you understand and care for your mental health.",mood:"Check Your Mood",change:"Change language"},
      ha:{nextStep:"Zaɓi mataki na gaba",nextStepHelp:"Kowane mataki yana taimaka maka ka fahimci lafiyar kwakwalwarka.",mood:"Duba yanayin zuciyarka",change:"Canja harshe"},
      ig:{nextStep:"Họrọ ihe ị ga-eme ọzọ",nextStepHelp:"Nzọụkwụ ọ bụla na-enyere gị aka ilekọta ahụike uche gị.",mood:"Lelee ọnọdụ obi gị",change:"Gbanwee asụsụ"},
      yo:{nextStep:"Yan ìgbésẹ̀ rẹ tó kàn",nextStepHelp:"Ìgbésẹ̀ kọ̀ọ̀kan ń ràn ọ́ lọ́wọ́ láti tọ́jú ìlera ọpọlọ rẹ.",mood:"Ṣàyẹ̀wò bí ọkàn rẹ ṣe rí",change:"Yí èdè padà"},
      pcm:{nextStep:"Choose wetin you wan do next",nextStepHelp:"Every small step dey help you care for your mind.",mood:"Check how you dey feel",change:"Change language"},
      fr:{nextStep:"Choisissez votre prochaine étape",nextStepHelp:"Chaque étape vous aide à prendre soin de votre santé mentale.",mood:"Vérifiez votre humeur",change:"Changer de langue"}
    };
    document.querySelectorAll('[data-i18n]').forEach(node=>{const key=node.dataset.i18n;if(common[code][key])node.textContent=common[code][key];});
    const change=document.getElementById('mcChangeLanguage');if(change)change.textContent='🌍 '+common[code].change;
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