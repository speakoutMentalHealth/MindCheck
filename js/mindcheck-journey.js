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
  /* Seven daily variations rotate each week. Existing four completion IDs remain stable. */
  var weeklyThemes=[
    [['Notice one good thing about today.','Take three gentle 4-in, 6-out breaths.','Send someone a friendly hello.','Drink a glass of water.']],
    [['Write down something you handled well.','Relax your shoulders as you breathe slowly.','Thank someone who helped you.','Stretch gently for a minute.']],
    [['Remember a moment that made you smile.','Take a short breathing pause away from your screen.','Ask a trusted person how they are doing.','Rest your eyes for a few minutes.']],
    [['Appreciate something about yourself.','Breathe gently while sitting comfortably.','Share a kind word with someone.','Step outside for fresh air if comfortable.']],
    [['Notice a small act of kindness.','Practice three unhurried breaths.','Reconnect with someone you miss.','Make time for a nourishing snack.']],
    [['Celebrate one small effort you made.','Pause and follow your natural breath.','Tell someone you appreciate them.','Take a comfortable short walk or stretch.']],
    [['Think of one hopeful moment this week.','Complete a calm breathing cycle at your pace.','Offer encouragement to someone.','Choose one restful activity you enjoy.']]
  ];
  var weeklyLocalized={
ha:[
['Ka tuna abu daya mai kyau yau.','Yi numfashi a hankali: shaka hudu, fitar shida, sau uku.','Gaishe da wani cikin kirki.','Sha gilashin ruwa.'],
['Rubuta abu daya da ka yi da kyau.','Sassauta kafadunka yayin numfashi.','Gode wa wanda ya taimake ka.','Mikewa a hankali na minti daya.'],
['Tuna wani abu da ya sa ka yi murmushi.','Dakatar da kallon allo don numfashi.','Tambayi amintacce yadda yake.','Huta da idanunka na dan lokaci.'],
['Yaba wa kanka kan wani abu.','Yi numfashi a hankali kana zaune.','Fada wa wani kalma mai dadi.','Fita shan iska idan ya dace.'],
['Ka tuna alherin da aka yi.','Yi numfashi uku ba tare da gaggawa ba.','Tuntubi wanda ka dade ba ka ji labarinsa ba.','Ci abinci mai gina jiki.'],
['Yi murnar karamin kokarinka.','Dakata ka bi yadda numfashinka ke tafiya.','Fada wa wani kana yaba masa.','Yi dan yawo ko mikewa.'],
['Tuna wani abin fata na wannan mako.','Yi zagayen numfashi cikin natsuwa.','Karfafa gwiwar wani.','Zabi aikin hutawa da kake so.']],
ig:[
['Cheta otu ihe ọma taa.','Kuo ume nwayọ: banye anọ, pụta isii, ugboro atọ.','Kelee mmadụ n’obi ọma.','Ṅụọ otu iko mmiri.'],
['Dee otu ihe i mere nke ọma.','Mee ka ubu gị zuru ike ka ị na-eku ume.','Kelee onye nyeere gị aka.','Gbatịa ahụ otu nkeji.'],
['Cheta ihe mere ka ị mụmụ ọnụ ọchị.','Kwụsị ile ihuenyo ka i kuo ume.','Jụọ onye ị tụkwasịrị obi ka ọ dị.','Mee ka anya gị zuru ike.'],
['Nwee ekele maka onwe gị.','Nọdụ ala kuo ume nwayọ.','Gwa mmadụ okwu ọma.','Pụọ nweta ikuku ọhụrụ ma ọ dị mma.'],
['Cheta obere obiọma.','Kuo ume ugboro atọ nwayọ.','Kpọtụrụ onye ị na-atụ uche.','Rie obere nri na-enye ahụ ike.'],
['Mee emume obere mbọ gị.','Kwụsị soro iku ume gị.','Gwa mmadụ na ị na-enwe ekele maka ya.','Jee obere ije ma ọ bụ gbatịa ahụ.'],
['Cheta otu ihe nyere gị olileanya n’izu a.','Mee otu usoro iku ume nwayọ.','Gbaa mmadụ ume.','Họrọ ihe na-enye gị ezumike.']],
yo:[
['Ronú nípa ohun rere kan lónìí.','Fa ẹ̀mí wọlé fún mẹ́rin, tú u jáde fún mẹ́fà, lẹ́ẹ̀mẹ́ta.','Kí ẹnìkan pẹ̀lú inú rere.','Mu gilasi omi kan.'],
['Kọ ohun kan tí o ṣe dáadáa.','Jẹ́ kí èjìká rẹ sinmi nígbà mímí.','Dúpẹ́ lọ́wọ́ ẹni tó ràn ọ́ lọ́wọ́.','Na ara rẹ fún ìṣẹ́jú kan.'],
['Rántí ohun tó mú ọ rẹ́rìn-ín.','Sinmi kúrò ní ojú iboju kí o mí.','Béèrè bí ẹni tí o gbẹ́kẹ̀ lé ṣe wà.','Jẹ́ kí ojú rẹ sinmi díẹ̀.'],
['Mọrírì ohun kan nípa ara rẹ.','Jókòó kí o mí lọ́ra.','Sọ ọ̀rọ̀ rere fún ẹnìkan.','Jáde gba afẹ́fẹ́ bí ó bá rọrùn.'],
['Rántí ìṣe inú rere kékeré kan.','Mí lọ́ra lẹ́ẹ̀mẹ́ta.','Bá ẹni tí o ń ṣàárò rẹ sọ̀rọ̀.','Gba oúnjẹ tó dára díẹ̀.'],
['Ṣe ayẹyẹ ìsapá kékeré rẹ.','Dúró kí o kíyè sí mímí rẹ.','Sọ fún ẹnìkan pé o mọrírì rẹ.','Rìn díẹ̀ tàbí na ara.'],
['Ronú nípa ìrètí kan ní ọ̀sẹ̀ yìí.','Ṣe ìyípo mímí pẹ̀lẹ́pẹ̀lẹ́.','Fún ẹnìkan ní ìwúrí.','Yan ìṣe ìsinmi tí o fẹ́.']],
pcm:[
['Notice one good thing today.','Breathe in for four, out for six, three times.','Greet person with kindness.','Drink one glass of water.'],
['Write one thing wey you do well.','Relax your shoulder as you breathe.','Thank person wey help you.','Stretch small for one minute.'],
['Remember wetin make you smile.','Rest from screen and breathe small.','Ask person wey you trust how dem dey.','Rest your eyes for some minutes.'],
['Appreciate one thing about yourself.','Sit well and breathe gently.','Tell person one kind word.','Go outside for fresh air if you fit.'],
['Remember one small kind thing.','Take three gentle breaths.','Reach person wey you miss.','Eat something nourishing.'],
['Celebrate your small effort.','Pause and notice your breathing.','Tell person say you appreciate dem.','Waka small or stretch if comfortable.'],
['Remember one hopeful thing this week.','Do one calm breathing cycle.','Encourage somebody.','Choose something wey go help you rest.']],
fr:[
['Remarquez une bonne chose aujourd’hui.','Inspirez sur quatre temps et expirez sur six, trois fois.','Envoyez un bonjour chaleureux.','Buvez un verre d’eau.'],
['Notez une chose que vous avez bien faite.','Détendez les épaules en respirant.','Remerciez une personne qui vous a aidé.','Étirez-vous doucement une minute.'],
['Rappelez-vous un moment souriant.','Faites une pause d’écran pour respirer.','Prenez des nouvelles d’une personne de confiance.','Reposez vos yeux quelques minutes.'],
['Appréciez une qualité chez vous.','Respirez doucement en position assise.','Dites un mot gentil à quelqu’un.','Prenez l’air si cela vous convient.'],
['Pensez à un petit geste de gentillesse.','Prenez trois respirations sans vous presser.','Recontactez une personne qui vous manque.','Prenez une collation nourrissante.'],
['Célébrez un petit effort accompli.','Faites une pause pour observer votre respiration.','Dites à quelqu’un que vous l’appréciez.','Marchez ou étirez-vous doucement.'],
['Pensez à un moment d’espoir cette semaine.','Faites un cycle de respiration calme.','Encouragez une personne.','Choisissez une activité reposante.']]
  };
  var weeklyLabels={en:['Week','Day','New challenges each day. The seven-day plan repeats weekly.'],ha:['Mako','Rana','Ayyuka na canzawa kowace rana. Ana maimaitawa kowane mako.'],ig:['Izu','Ụbọchị','Ihe omume na-agbanwe kwa ụbọchị, na-amalitekwa ọzọ kwa izu.'],yo:['Ọ̀sẹ̀','Ọjọ́','Iṣẹ́ tuntun lójoojúmọ́. Ètò náà tún bẹ̀rẹ̀ lọ́sẹ̀ kọ̀ọ̀kan.'],pcm:['Week','Day','New small tasks every day. E go repeat every week.'],fr:['Semaine','Jour','De nouveaux défis chaque jour. Le programme reprend chaque semaine.']};
  function weekDay(){var d=new Date();return (d.getDay()+6)%7;}
  var moodHistoryLabels={
    en:{previous:'Previous check-in',moods:['Very low','Low','Okay','Good','Very good'],date:'en-GB'},
    ha:{previous:'Duba yanayi na baya',moods:['Ƙwarai ƙasa','Ƙasa','Matsakaici','Mai kyau','Mai kyau sosai'],date:'ha-NG'},
    ig:{previous:'Nyocha gara aga',moods:['Dị nnọọ ala','Ala','Ọ dị mma','Ọ dị mma nke ọma','Ọ dị ezigbo mma'],date:'ig-NG'},
    yo:{previous:'Àyẹ̀wò tẹ́lẹ̀',moods:['Ó rẹlẹ̀ gan-an','Ó rẹlẹ̀','Ó dára','Ó dára púpọ̀','Ó dára gan-an'],date:'yo-NG'},
    pcm:{previous:'Mood check wey you do before',moods:['E bad well well','E low','E dey okay','E good','E good well well'],date:'en-NG'},
    fr:{previous:'Bilan précédent',moods:['Très bas','Bas','Moyen','Bien','Très bien'],date:'fr-FR'}
  };
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
  function locale(){if(typeof window.MindCheckLocale?.current==='function')return window.MindCheckLocale.current();var selected='en';try{selected=localStorage.getItem('mc_lang')||'en';}catch(e){}var s=selected.toLowerCase().split('-')[0];return words[s]?s:'en';}
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
    document.getElementById('mcJourneyStreak').textContent=String(Math.max(0,Number(json('mc_streak',0))||0));
    document.getElementById('mcJourneyTips').textContent=tips.length;
    document.getElementById('mcJourneyChallenges').textContent=done;
    var mood=document.getElementById('mcJourneyMood');mood.replaceChildren();
    var recent=history.filter(function(item){return item&&Number.isInteger(Number(item.mood_value))&&Number(item.mood_value)>=0&&Number(item.mood_value)<=4;}).slice(-7).reverse();
    if(!recent.length){var empty=document.createElement('p');empty.textContent=w('empty');mood.appendChild(empty);}
    else recent.forEach(function(item){
      var row=document.createElement('div');row.className='mc-journey-mood-row';row.setAttribute('role','listitem');
      var emoji=document.createElement('span');emoji.textContent=['😢','😞','😐','😊','😄'][Number(item.mood_value)];emoji.setAttribute('aria-hidden','true');
      var label=document.createElement('span');var date=new Date(item.ts);var translatedMood=moodHistoryLabels[locale()]||moodHistoryLabels.en;var dateLabel=Number.isNaN(date.getTime())?translatedMood.previous:date.toLocaleDateString(translatedMood.date);label.textContent=dateLabel+' · '+translatedMood.moods[Number(item.mood_value)];
      row.append(emoji,label);mood.appendChild(row);
    });
    var list=document.getElementById('mcJourneyChallengeList');list.replaceChildren();
    var weeklyDay=weekDay(),label=weeklyLabels[locale()]||weeklyLabels.en;
    var weekNote=document.createElement('p');weekNote.className='mc-journey-weekly-note';weekNote.textContent=label[1]+' '+(weeklyDay+1)+' / 7 · '+label[2];list.appendChild(weekNote);
    challenges.forEach(function(ch){
      var complete=todayDone.includes(ch.id),card=document.createElement('article');card.className='mc-journey-task'+(complete?' is-done':'');
      var icon=document.createElement('span');icon.className='mc-journey-task-icon';icon.textContent=ch.icon;icon.setAttribute('aria-hidden','true');
      var body=document.createElement('div');var translated=challengeTranslations[locale()]&&challengeTranslations[locale()][challenges.indexOf(ch)];var displayTitle=translated?translated[0]:ch.title;var heading=document.createElement('h5');heading.textContent=displayTitle;var description=document.createElement('p');description.textContent=(weeklyLocalized[locale()]?weeklyLocalized[locale()][weeklyDay][challenges.indexOf(ch)]:weeklyThemes[weeklyDay][0][challenges.indexOf(ch)]);body.append(heading,description);
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
window.addEventListener('mindcheck:languagechange',render);
  window.MindCheckJourney={refresh:render};
})();
