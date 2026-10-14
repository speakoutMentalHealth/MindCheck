/* MindCheck Phase 2: client-side, non-diagnostic suggestions and optional breathing. */
(function(){
'use strict';
var i18n={
en:{eyebrow:'PERSONALIZED SUPPORT',title:'A gentle suggestion for you',disclaimer:'Suggestions are based on your last recorded mood, not a diagnosis. You can always choose what feels helpful.',breathingEyebrow:'RELAXATION TOOL',breathingTitle:'Breathe at your own pace',breathingIntro:'Follow the circle or the words. Breathe comfortably and stop if you feel dizzy.',breathingNote:'This exercise is optional and not a substitute for professional care.',start:'Start breathing',pause:'Pause',resume:'Resume',reset:'Reset',ready:'Ready when you are',inhale:'Breathe in gently',exhale:'Breathe out slowly',complete:'Well done. Take a moment before continuing.',neutral:'There is no perfect way to feel. Choose a small, caring action today.',low:'A difficult day deserves gentleness. You might try one small act of self-care.',anxious:'If things feel overwhelming, a short pause or a grounding activity may help.',positive:'Enjoy the positive moment and carry one kind habit into your day.',calm:'Protect your calm with a gentle pause or a moment of gratitude.',noMood:'Choose an activity below, or record a mood check-in to receive a suggestion.',breathe:'Try breathing',gratitude:'Practice gratitude',connect:'Connect with someone',selfcare:'Try self-care',tips:'Explore wellness tips'},
ha:{eyebrow:'TAIMAKO NA MUSAMMAN',title:'Shawara mai sauki gare ka',disclaimer:'Wadannan shawarwari sun dogara da yanayinka na baya, ba ganewar cuta ba.',breathingEyebrow:'HUTAWA',breathingTitle:'Yi numfashi a hankali',breathingIntro:'Bi da’irar ko kalmomin. Dakata idan ka ji jiri.',breathingNote:'Wannan aikin na zabi ne, ba madadin kulawar kwararru ba.',start:'Fara numfashi',pause:'Dakata',resume:'Ci gaba',reset:'Sake farawa',ready:'A shirye idan kai ma kana shirye',inhale:'Shaka numfashi a hankali',exhale:'Fitar da numfashi a hankali',complete:'Madalla. Ka dan huta.',neutral:'Ka zabi karamin abin kirki yau.',low:'Ka tausaya wa kanka yau.',anxious:'Dan hutu zai iya taimaka maka.',positive:'Ka ji dadin wannan lokacin.',calm:'Ka kiyaye natsuwarka.',noMood:'Zabi wani aiki ko ka rubuta yanayinka.',breathe:'Gwada numfashi',gratitude:'Yi godiya',connect:'Tuntubi wani',selfcare:'Kula da kanka',tips:'Duba shawarwari'},
ig:{eyebrow:'NKWADO NKE ONWE',title:'Obere ndụmọdụ maka',disclaimer:'Ndụmọdụ a dabere na ọnọdụ uche ikpeazụ gị, ọ bụghị nchọpụta ọrịa.',breathingEyebrow:'IZU IKE',breathingTitle:'Kuo ume nwayọ',breathingIntro:'Soro okirikiri ma ọ bụ okwu. Kwụsị ma ọ bụrụ na isi na-atụ gị.',breathingNote:'Ọ bụ nhọrọ, ọ bụghị nnọchi nlekọta ọkachamara.',start:'Malite iku ume',pause:'Kwụsị',resume:'Gaa n’ihu',reset:'Malite ọzọ',ready:'Mgbe ị dị njikere',inhale:'Kuo ume nwayọ',exhale:'Hapụ ume nwayọ',complete:'Ọ dị mma. Zuru ike.',neutral:'Họrọ otu obere ihe ọma taa.',low:'Mee onwe gị ebere taa.',anxious:'Obere ezumike nwere ike inyere gị aka.',positive:'Nwee obi ụtọ n’oge a.',calm:'Chekwaa udo gị.',noMood:'Họrọ ihe omume ma ọ bụ dekọọ ọnọdụ uche.',breathe:'Gbalịa iku ume',gratitude:'Nwee ekele',connect:'Kpọtụrụ mmadụ',selfcare:'Lekọta onwe gị',tips:'Lee ndụmọdụ'},
yo:{eyebrow:'ÌRÀNLỌ́WỌ́ FÚN Ọ',title:'Ìmọ̀ràn onírẹ̀lẹ̀ fún ọ',disclaimer:'Ìmọ̀ràn yìí dá lórí ìmọ̀lára rẹ tó kẹ́yìn, kì í ṣe àyẹ̀wò àrùn.',breathingEyebrow:'ÌSINMI',breathingTitle:'Mí lọ́ra',breathingIntro:'Tẹ̀lé àyíká tàbí ọ̀rọ̀. Dúró tí orí bá ń yí ọ.',breathingNote:'Èyí jẹ́ àṣàyàn, kì í ṣe àropò ìtọ́jú amọ̀ja.',start:'Bẹ̀rẹ̀ mímí',pause:'Dúró',resume:'Tẹ̀síwájú',reset:'Tún bẹ̀rẹ̀',ready:'Nígbà tí o bá ṣetán',inhale:'Fa ẹ̀mí wọlé lọ́ra',exhale:'Tú ẹ̀mí jáde lọ́ra',complete:'O ṣe dáadáa. Sinmi díẹ̀.',neutral:'Yan ohun rere kékeré kan lónìí.',low:'Ṣe ìtọ́jú ara rẹ lónìí.',anxious:'Ìsinmi díẹ̀ lè ràn ọ́ lọ́wọ́.',positive:'Gbadùn àkókò rere yìí.',calm:'Pa ìfọkànbalẹ̀ rẹ mọ́.',noMood:'Yan iṣẹ́ kan tàbí kọ ìmọ̀lára rẹ.',breathe:'Gbìyànjú mímí',gratitude:'Ṣe ìmoore',connect:'Bá ẹnìkan sọ̀rọ̀',selfcare:'Tọ́jú ara rẹ',tips:'Wo ìmọ̀ràn'},
pcm:{eyebrow:'SUPPORT FOR YOU',title:'Small suggestion for you',disclaimer:'Na your last mood we use suggest this, e no be diagnosis.',breathingEyebrow:'RELAX SMALL',breathingTitle:'Breathe at your pace',breathingIntro:'Follow the circle or words. Stop if your head dey turn.',breathingNote:'Na choice, e no replace professional help.',start:'Start breathing',pause:'Pause',resume:'Continue',reset:'Start again',ready:'When you ready',inhale:'Breathe in small',exhale:'Breathe out slow',complete:'Well done. Rest small.',neutral:'Pick one small good thing today.',low:'Try show yourself small kindness.',anxious:'Small pause fit help.',positive:'Enjoy this good moment.',calm:'Keep your calm with small break.',noMood:'Pick activity or check your mood.',breathe:'Try breathing',gratitude:'Give thanks',connect:'Reach person',selfcare:'Care for yourself',tips:'See wellness tips'},
fr:{eyebrow:'SOUTIEN PERSONNALISÉ',title:'Une suggestion douce pour vous',disclaimer:'Ces suggestions reposent sur votre dernière humeur, sans diagnostic.',breathingEyebrow:'RELAXATION',breathingTitle:'Respirez à votre rythme',breathingIntro:'Suivez le cercle ou les mots. Arrêtez si vous avez des vertiges.',breathingNote:'Cet exercice facultatif ne remplace pas des soins professionnels.',start:'Commencer',pause:'Pause',resume:'Reprendre',reset:'Réinitialiser',ready:'Quand vous êtes prêt',inhale:'Inspirez doucement',exhale:'Expirez lentement',complete:'Bravo. Prenez un instant.',neutral:'Choisissez un petit geste bienveillant.',low:'Accordez-vous de la douceur aujourd’hui.',anxious:'Une courte pause peut aider.',positive:'Profitez de ce moment positif.',calm:'Préservez votre calme.',noMood:'Choisissez une activité ou notez votre humeur.',breathe:'Respirer',gratitude:'Gratitude',connect:'Contacter un proche',selfcare:'Prendre soin de soi',tips:'Voir les conseils'}
};
var accordionLabels={
en:['Mood history','Wellness suggestions','Daily wellness challenges'],
ha:['Tarihin yanayi','Shawarwarin lafiya','Ayyukan yau'],
ig:['Akụkọ ọnọdụ uche','Ndụmọdụ ahụike','Ihe omume taa'],
yo:['Ìtàn ìmọ̀lára','Ìmọ̀ràn ìlera','Àwọn iṣẹ́ òní'],
pcm:['Your mood history','Wellness suggestions','Small challenges for today'],
fr:['Historique des humeurs','Suggestions bien-être','Défis du jour']
};
function renderAccordionLabels(){var lang=language();var labels=accordionLabels[lang]||accordionLabels.en;document.querySelectorAll('#mcJourney [data-mc-accordion]').forEach(function(el){var i=['moodHistory','suggestions','challenges'].indexOf(el.dataset.mcAccordion);if(i>=0)el.textContent=labels[i];});document.querySelectorAll('#mcJourney [data-mc-accordion-sub]').forEach(function(el){var i=['moodHistory','suggestions','challenges'].indexOf(el.dataset.mcAccordionSub);if(i>=0)el.textContent=(accordionSubtitles[lang]||accordionSubtitles.en)[i];});}
var accordionSubtitles={
en:['Your recent check-ins','Gentle support, just for you','Small steps for today'],
ha:['Yanayinka na baya','Taimako mai sauki gare ka','Kananan matakai na yau'],
ig:['Nyocha gị ndị gara aga','Nkwado dị nro maka gị','Obere nzọụkwụ taa'],
yo:['Àwọn àyẹ̀wò rẹ tẹ́lẹ̀','Ìrànlọ́wọ́ onírẹ̀lẹ̀ fún ọ','Ìgbésẹ̀ kékeré lónìí'],
pcm:['Your last mood checks','Small support for you','Small steps for today'],
fr:['Vos derniers bilans','Un soutien doux pour vous','De petits pas aujourd’hui']
};
function language(){try{var l=(localStorage.getItem('mc_lang')||'en').split('-')[0].toLowerCase();return i18n[l]?l:'en';}catch(e){return'en';}}
function tr(key){return(i18n[language()]||i18n.en)[key]||i18n.en[key];}
function renderBreathingLabels(){
  renderAccordionLabels();
  var breath=document.getElementById('mcBreathing');
  if(!breath)return;
  breath.querySelectorAll('[data-mcs]').forEach(function(el){el.textContent=tr(el.dataset.mcs);});
  if(!running&&!paused&&!completed)cue.textContent=tr('ready');
  if(!running)start.textContent=paused?tr('resume'):tr('start');
  reset.textContent=tr('reset');
  if(!running&&!completed)phaseLabel.textContent=tr(elapsed%10000<4000?'inhale':'exhale');
}
var start=document.getElementById('mcBreathingStart'),reset=document.getElementById('mcBreathingReset'),cue=document.getElementById('mcBreathingCue'),progress=document.getElementById('mcBreathingProgress'),circle=document.getElementById('mcBreathingCircle'),ring=document.getElementById('mcBreathingRingProgress'),seconds=document.getElementById('mcBreathingSeconds'),phaseLabel=document.getElementById('mcBreathingPhase');
var running=false,paused=false,elapsed=0,last=0,frame=0,completed=false,previousPhase='';var DURATION=30000,CIRCUMFERENCE=2*Math.PI*114;
ring.style.strokeDasharray=String(CIRCUMFERENCE);ring.style.strokeDashoffset=String(CIRCUMFERENCE);
function reducedMotion(){return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function draw(){
  var phase=elapsed%10000,inhale=phase<4000,phaseElapsed=inhale?phase:phase-4000,phaseDuration=inhale?4000:6000;
  var phaseKey=inhale?'inhale':'exhale',fraction=Math.min(1,phaseElapsed/phaseDuration);
  // Smoothstep removes the mechanical snap at the change between inhale and exhale.
  var eased=fraction*fraction*(3-2*fraction);
  var scale=inhale?(.72+.42*eased):(1.14-.42*eased);
  var glow=inhale?(.25+.55*eased):(.8-.55*eased);
  circle.style.setProperty('--mc-heart-glow',glow.toFixed(3));
  circle.classList.toggle('is-inhaling',inhale);circle.classList.toggle('is-exhaling',!inhale);
  if(reducedMotion())circle.style.transform='scale(.88)';
  else circle.style.transform='scale('+scale.toFixed(3)+')';
  ring.style.strokeDashoffset=String(CIRCUMFERENCE*(1-fraction));
  seconds.textContent=String(Math.max(1,Math.ceil((phaseDuration-phaseElapsed)/1000)));
  phaseLabel.textContent=tr(phaseKey);
  if(phaseKey!==previousPhase){cue.textContent=tr(phaseKey);previousPhase=phaseKey;}
  progress.textContent=(Math.min(3,Math.floor(elapsed/10000)+1))+' / 3';
}
function finish(){
  running=false;paused=false;completed=true;cancelAnimationFrame(frame);
  circle.classList.remove('is-breathing','is-inhaling','is-exhaling');
  circle.style.transform='scale(.72)';
  ring.style.strokeDashoffset='0';seconds.textContent='✓';phaseLabel.textContent='';
  cue.textContent=tr('complete');progress.textContent='3 / 3';start.textContent=tr('start');
}
function tick(ts){
  if(!running)return;
  if(!last)last=ts;
  elapsed+=Math.min(100,Math.max(0,ts-last));last=ts;
  if(elapsed>=DURATION){elapsed=DURATION;finish();return;}
  draw();frame=requestAnimationFrame(tick);
}
function pause(){running=false;paused=true;circle.classList.remove('is-breathing');cancelAnimationFrame(frame);last=0;start.textContent=tr('resume');}
start.addEventListener('click',function(){
  if(running){pause();return;}
  if(completed){elapsed=0;completed=false;previousPhase='';}
  running=true;paused=false;last=0;circle.classList.add('is-breathing');start.textContent=tr('pause');
  draw();frame=requestAnimationFrame(tick);
});
reset.addEventListener('click',function(){
  running=false;paused=false;completed=false;previousPhase='';cancelAnimationFrame(frame);elapsed=0;last=0;
  circle.classList.remove('is-breathing','is-inhaling','is-exhaling');
  circle.style.transform='scale(.72)';
  ring.style.strokeDashoffset=String(CIRCUMFERENCE);seconds.textContent='4';phaseLabel.textContent=tr('inhale');
  cue.textContent=tr('ready');progress.textContent='0 / 3';start.textContent=tr('start');
});
document.addEventListener('visibilitychange',function(){if(document.hidden&&running)pause();});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.mood,#mcChangeLanguage,[data-lang]'))setTimeout(renderBreathingLabels,100);});
window.addEventListener('storage',renderBreathingLabels);
renderBreathingLabels();
})();
