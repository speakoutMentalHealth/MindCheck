/* Local-only wellness journey. Does not modify legacy mood, awards or saved-tip state. */
(function(){
  'use strict';
  var KEY='mc_journey_challenges_v1';
  var challenges=[
    {id:'gratitude',icon:'💛',title:'A moment of gratitude',desc:'Pause and think of one small thing you appreciate today.'},
    {id:'breathing',icon:'🌬️',title:'A calming breath',desc:'Breathe in gently for four counts, then out for six. Repeat three times at your own pace.'},
    {id:'connection',icon:'💬',title:'Reach out',desc:'Send a kind message or check in with someone you trust.'},
    {id:'selfcare',icon:'🌿',title:'One caring action',desc:'Drink water, stretch, rest, or take a short walk if it feels comfortable.'}
  ];
  var words={
    en:{eyebrow:'YOUR WELLNESS JOURNEY',title:'A little progress, every day',intro:'Your private progress on this device. No scores or diagnoses.',checkins:'Mood check-ins',streak:'Day streak',saved:'Saved tips',completed:'Challenges completed',moodHistory:'Recent mood check-ins',daily:"Today's gentle challenges",dailyIntro:'Choose what feels helpful. Completing a challenge is optional.',privacy:'Stored only in this browser. Clearing site data removes this progress.',finish:'Mark complete',undo:'Undo',done:'Completed',empty:'Your mood check-ins will appear here after you record them.',savedFeedback:'Challenge updated on this device.',error:'Could not save. Please check browser storage.'},
    ha:{eyebrow:'TAFIYAR LAFIYAR ZUCIYARKA',title:'Ci gaba kadan a kowace rana',intro:'Ci gabanka na sirri a wannan na’urar. Ba ganewar cuta ba ne.',checkins:'Duba yanayi',streak:'Kwanakin jere',saved:'Shawarwarin da aka ajiye',completed:'Ayyukan da aka kammala',moodHistory:'Yanayin baya-bayan nan',daily:'Ayyukan yau',dailyIntro:'Zabi abin da zai taimaka maka. Ba dole ba ne.',privacy:'Ana adanawa a wannan burauzar kawai.',finish:'Na kammala',undo:'Soke',done:'An kammala',empty:'Bayanan yanayinka za su bayyana a nan.',savedFeedback:'An sabunta aikin.',error:'Ba a iya adanawa ba.'},
    ig:{eyebrow:'NJE AHỤIKE UCHE GỊ',title:'Obere ọganihu kwa ụbọchị',intro:'Ọganihu nzuzo gị na ngwaọrụ a. Ọ bụghị nchọpụta ọrịa.',checkins:'Nyocha ọnọdụ uche',streak:'Ụbọchị n’usoro',saved:'Ndụmọdụ echekwara',completed:'Ihe omume emechara',moodHistory:'Ọnọdụ uche gara aga',daily:'Ihe omume taa',dailyIntro:'Họrọ ihe ga-enyere gị aka. Ọ bụghị iwu.',privacy:'A na-echekwa ya naanị na ihe nchọgharị a.',finish:'Emechara',undo:'Wepụ',done:'Emechara',empty:'Nyocha ọnọdụ uche gị ga-apụta ebe a.',savedFeedback:'Emelitere ihe omume.',error:'Enweghị ike ichekwa.'},
    yo:{eyebrow:'ÌRÌNÀJÒ ÌLERA ỌKÀN RẸ',title:'Ìlọsíwájú díẹ̀ lójoojúmọ́',intro:'Ìlọsíwájú rẹ lórí ẹ̀rọ yìí nìkan. Kì í ṣe àyẹ̀wò àrùn.',checkins:'Àyẹ̀wò ìmọ̀lára',streak:'Ọjọ́ tẹ̀lé ara',saved:'Ìmọ̀ràn tí a fi pamọ́',completed:'Àwọn iṣẹ́ tí a parí',moodHistory:'Ìmọ̀lára tó ṣẹ̀ṣẹ̀ kọjá',daily:'Àwọn iṣẹ́ òní',dailyIntro:'Yan ohun tó ràn ọ́ lọ́wọ́. Kì í ṣe dandan.',privacy:'A fi pamọ́ sínú aṣàwákiri yìí nìkan.',finish:'Mo parí',undo:'Fagilé',done:'A parí',empty:'Ìmọ̀lára rẹ yóò hàn níbí.',savedFeedback:'A ti ṣe àtúnṣe.',error:'A kò lè fi pamọ́.'},
    pcm:{eyebrow:'YOUR WELLNESS JOURNEY',title:'Small progress every day',intro:'Na only this phone dey keep your progress. E no be diagnosis.',checkins:'Mood check-ins',streak:'Days wey follow',saved:'Tips wey you save',completed:'Challenges wey you finish',moodHistory:'Your recent mood',daily:'Small challenges for today',dailyIntro:'Pick wetin go help you. No be by force.',privacy:'Na this browser dey keep am.',finish:'I don do am',undo:'Undo',done:'Done',empty:'Your mood check-ins go show here.',savedFeedback:'We don update am.',error:'E no save. Check your browser.'},
    fr:{eyebrow:'VOTRE PARCOURS BIEN-ÊTRE',title:'Un petit progrès chaque jour',intro:'Votre suivi privé sur cet appareil. Aucun diagnostic.',checkins:"Bilans d’humeur",streak:'Jours consécutifs',saved:'Conseils enregistrés',completed:'Défis accomplis',moodHistory:'Humeurs récentes',daily:'Défis doux du jour',dailyIntro:'Choisissez ce qui vous aide. Rien n’est obligatoire.',privacy:'Stocké uniquement dans ce navigateur.',finish:'Terminer',undo:'Annuler',done:'Terminé',empty:'Vos bilans apparaîtront ici.',savedFeedback:'Défi mis à jour.',error:'Enregistrement impossible.'}
  };
  var challengeTranslations={
    ha:[['Lokacin godiya','Ka tuna wani karamin abu da kake godiya da shi yau.'],['Numfashi cikin natsuwa','Shaka numfashi a hankali na kirga hudu, fitar na kirga shida. Maimaita sau uku.'],['Tuntubi wani','Aika sakon kirki ko ka tambayi wanda ka yarda da shi halinsa.'],['Kula da kanka','Sha ruwa, mikewa, hutawa, ko dan tafiya idan ya dace.']],
    ig:[['Obere oge ekele','Cheta otu obere ihe ị nwere ekele maka ya taa.'],['Iku ume nwayọ','Kuo ume nwayọ ugboro anọ, hapụ ya ugboro isii. Mee ya ugboro atọ.'],['Kpọtụrụ mmadụ','Zigara onye ị tụkwasịrị obi ozi ọma.'],['Lekọta onwe gị','Ṅụọ mmiri, gbatịa ahụ, zuru ike ma ọ bụ jee obere ije.']],
    yo:[['Ìṣẹ́jú ìmoore','Ronú nípa ohun kékeré kan tí o dúpẹ́ fún lónìí.'],['Mímí lọ́ra','Fa ẹ̀mí wọlé ní ìṣírò mẹ́rin, tú u jáde ní mẹ́fà. Ṣe é lẹ́ẹ̀mẹ́ta.'],['Bá ẹnìkan sọ̀rọ̀','Fi ìfiranṣẹ́ rere ránṣẹ́ sí ẹni tí o gbẹ́kẹ̀ lé.'],['Ṣe ìtọ́jú ara rẹ','Mu omi, na ara, sinmi tàbí rìn díẹ̀ bí ó bá rọrùn.']],
    pcm:[['Small thank-you moment','Think of one small thing wey you appreciate today.'],['Calm breathing','Breathe in small for four counts, breathe out for six. Do am three times.'],['Check on person','Send kind message to person wey you trust.'],['Care for yourself','Drink water, stretch, rest or waka small if e comfortable.']],
    fr:[['Un instant de gratitude','Pensez à une petite chose que vous appréciez aujourd’hui.'],['Respiration apaisante','Inspirez doucement sur quatre temps, expirez sur six. Répétez trois fois.'],['Garder le lien','Envoyez un message bienveillant à une personne de confiance.'],['Prendre soin de soi','Buvez de l’eau, étirez-vous, reposez-vous ou marchez un peu.']]
  };
  function locale(){var active=document.querySelector('[data-lang][aria-pressed="true"],[data-lang].active');var selected=active&&active.dataset.lang;var s=(selected||document.documentElement.lang||'en').toLowerCase().split('-')[0];return words[s]?s:'en';}
  function w(key){return (words[locale()]||words.en)[key]||words.en[key];}
  function json(key,fallback){try{var v=JSON.parse(localStorage.getItem(key)||'null');return v===null?fallback:v;}catch(e){return fallback;}}
  function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function render(){
    var root=document.getElementById('mcJourney');if(!root)return;
    root.querySelectorAll('[data-mcj]').forEach(function(el){el.textContent=w(el.dataset.mcj);});
    var history=json('mc_mood_history',[]);if(!Array.isArray(history))history=[];
    var tips=json('mc_tips_saved',[]);if(!Array.isArray(tips))tips=[];
    var entries=json(KEY,{});if(!entries||typeof entries!=='object'||Array.isArray(entries))entries={};
    var done=Object.keys(entries).filter(function(key){return Array.isArray(entries[key]);}).reduce(function(n,key){return n+entries[key].length;},0);
    var todayDone=Array.isArray(entries[today()])?entries[today()]:[];
    document.getElementById('mcJourneyCheckins').textContent=history.length;
    document.getElementById('mcJourneyStreak').textContent=String(Math.max(0,Number(localStorage.getItem('mc_streak'))||0));
    document.getElementById('mcJourneyTips').textContent=tips.length;
    document.getElementById('mcJourneyChallenges').textContent=done;
    var mood=document.getElementById('mcJourneyMood');mood.replaceChildren();
    var recent=history.filter(function(item){return item&&Number.isInteger(Number(item.mood_value))&&Number(item.mood_value)>=0&&Number(item.mood_value)<=4;}).slice(-7).reverse();
    if(!recent.length){var empty=document.createElement('p');empty.textContent=w('empty');mood.appendChild(empty);}
    else recent.forEach(function(item){
      var row=document.createElement('div');row.className='mc-journey-mood-row';row.setAttribute('role','listitem');
      var emoji=document.createElement('span');emoji.textContent=['😢','😞','😐','😊','😄'][Number(item.mood_value)];emoji.setAttribute('aria-hidden','true');
      var label=document.createElement('span');var date=new Date(item.ts);label.textContent=(Number.isNaN(date.getTime())?'Previous check-in':date.toLocaleDateString())+' · '+['Very low','Low','Okay','Good','Very good'][Number(item.mood_value)];
      row.append(emoji,label);mood.appendChild(row);
    });
    var list=document.getElementById('mcJourneyChallengeList');list.replaceChildren();
    challenges.forEach(function(ch){
      var complete=todayDone.includes(ch.id),card=document.createElement('article');card.className='mc-journey-task'+(complete?' is-done':'');
      var icon=document.createElement('span');icon.className='mc-journey-task-icon';icon.textContent=ch.icon;icon.setAttribute('aria-hidden','true');
      var body=document.createElement('div');var translated=challengeTranslations[locale()]&&challengeTranslations[locale()][challenges.indexOf(ch)];var displayTitle=translated?translated[0]:ch.title;var heading=document.createElement('h5');heading.textContent=displayTitle;var description=document.createElement('p');description.textContent=translated?translated[1]:ch.desc;body.append(heading,description);
      var button=document.createElement('button');button.type='button';button.className='mc-journey-task-button';button.textContent=complete?w('undo'):w('finish');button.setAttribute('aria-pressed',String(complete));button.setAttribute('aria-label',displayTitle+': '+(complete?w('done'):w('finish')));
      button.addEventListener('click',function(){
        var saved=json(KEY,{});if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
        var values=Array.isArray(saved[today()])?saved[today()].slice():[];saved[today()]=values.includes(ch.id)?values.filter(function(x){return x!==ch.id;}):values.concat(ch.id);
        try{localStorage.setItem(KEY,JSON.stringify(saved));if(localStorage.getItem(KEY)!==JSON.stringify(saved))throw Error('Storage mismatch');document.getElementById('mcJourneyFeedback').textContent=w('savedFeedback');render();}
        catch(e){document.getElementById('mcJourneyFeedback').textContent=w('error');}
      });
      card.append(icon,body,button);list.appendChild(card);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#goMood,#goTips,.mood,#tipSaveBtn,#tipDoneBtn,#mcChangeLanguage,[data-lang]'))setTimeout(render,80);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)render();});
  window.addEventListener('storage',render);
  window.MindCheckJourney={refresh:render};
})();
