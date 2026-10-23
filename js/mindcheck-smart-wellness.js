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
function language(){if(typeof window.MindCheckLocale?.current==='function')return window.MindCheckLocale.current();try{var l=(localStorage.getItem('mc_lang')||'en').split('-')[0].toLowerCase();return i18n[l]?l:'en';}catch(e){return'en';}}
function tr(key){return window.MindCheckBreathingCopy?.[language()]?.[key]||(i18n[language()]||i18n.en)[key]||i18n.en[key]||key;}
function renderBreathingLabels(){
  renderAccordionLabels();
  var breath=document.getElementById('mcBreathing');
  if(!breath)return;
  breath.querySelectorAll('[data-mcs]').forEach(function(el){el.textContent=tr(el.dataset.mcs);});
  breath.querySelectorAll('[data-bx]').forEach(function(el){el.textContent=tr(el.dataset.bx);});
  breath.querySelector('.mc-breathing-stage').setAttribute('aria-label',tr('breathingTimer'));
  renderGrounding();
  if(!running&&!paused&&!completed)cue.textContent=tr('ready');
  start.textContent=running?tr('pause'):paused?tr('resume'):tr('start');
  if(completed)cue.textContent=tr('complete');
  if(running||paused){phaseLabel.textContent=tr(phaseInfo().inhale?'inhale':'exhale');cue.textContent=phaseLabel.textContent;}
  reset.textContent=tr('reset');
  if(!running&&!completed)phaseLabel.textContent=tr(phaseInfo().inhale?'inhale':'exhale');
}
var start=document.getElementById('mcBreathingStart'),reset=document.getElementById('mcBreathingReset'),cue=document.getElementById('mcBreathingCue'),progress=document.getElementById('mcBreathingProgress'),circle=document.getElementById('mcBreathingCircle'),ring=document.getElementById('mcBreathingRingProgress'),seconds=document.getElementById('mcBreathingSeconds'),phaseLabel=document.getElementById('mcBreathingPhase');
var scene=document.getElementById('mcBreathing');
var heartVisual=circle.querySelector('.mc-breathing-heart-svg');
var dots=scene.querySelector('.mc-breath-cycle-dots'),cycleDots=dots.querySelectorAll('i');
var rhythm=document.getElementById('mcBreathingRhythm'),duration=document.getElementById('mcBreathingDuration'),remaining=document.getElementById('mcBreathingRemaining'),changeHint=document.getElementById('mcBreathingChangeHint');
var patterns={gentle:[4000,6000],steady:[5000,5000],easy:[3000,3000]},timing=patterns.gentle,totalCycles=3;
var grounding=document.getElementById('mcGrounding'),groundPrompt=document.getElementById('mcGroundingPrompt'),groundProgress=document.getElementById('mcGroundingProgress'),groundNext=document.getElementById('mcGroundingNext'),groundBack=document.getElementById('mcGroundingBack'),groundIndex=0,groundKeys=['see','feel','hear','smell','taste'];
function phaseInfo(){var cycle=timing[0]+timing[1],phase=elapsed%cycle,inhale=phase<timing[0];return {cycle:cycle,phase:phase,inhale:inhale,phaseElapsed:inhale?phase:phase-timing[0],phaseDuration:inhale?timing[0]:timing[1]};}
function lockOptions(locked){rhythm.disabled=locked;duration.disabled=locked;changeHint.hidden=!locked;}
function updateRemaining(){var value=Math.max(0,Math.ceil((DURATION-elapsed)/1000));remaining.textContent=Math.floor(value/60)+':'+String(value%60).padStart(2,'0');}
function configure(){
  timing=patterns[rhythm.value]||patterns.gentle;DURATION=[30000,60000,120000].includes(Number(duration.value))?Number(duration.value):30000;
  totalCycles=DURATION/(timing[0]+timing[1]);dots.replaceChildren();
  for(var n=0;n<Math.min(6,totalCycles);n++)dots.appendChild(document.createElement('i'));
  cycleDots=dots.querySelectorAll('i');
}
function renderGrounding(){
 if(!groundPrompt)return;
 groundPrompt.textContent=tr(groundIndex<5?groundKeys[groundIndex]:'groundingDone');
 groundProgress.textContent=Math.min(5,groundIndex+1)+' / 5';groundBack.disabled=groundIndex===0;
 groundNext.textContent=tr(groundIndex<5?'next':'again');
}

var running=false,paused=false,elapsed=0,last=0,frame=0,completed=false,previousPhase='';var DURATION=30000,CIRCUMFERENCE=2*Math.PI*114;
ring.style.strokeDasharray=String(CIRCUMFERENCE);ring.style.strokeDashoffset=String(CIRCUMFERENCE);
function reducedMotion(){return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function draw(){
  var info=phaseInfo(),inhale=info.inhale,phaseElapsed=info.phaseElapsed,phaseDuration=info.phaseDuration;
  var phaseKey=inhale?'inhale':'exhale',fraction=Math.min(1,phaseElapsed/phaseDuration);
  // Smoothstep removes the mechanical snap at the change between inhale and exhale.
  var eased=fraction*fraction*(3-2*fraction);
  var scale=inhale?(.72+.42*eased):(1.14-.42*eased);
  var glow=inhale?(.25+.55*eased):(.8-.55*eased);
  // Two soft beats sit inside the slow breathing envelope; never use a separate clock.
  var beat=(elapsed%1600)/1600;
  function bump(center,width){var distance=Math.abs(beat-center);return Math.max(0,1-distance/width);}
  var pulse=1+.09*bump(.14,.10)+.055*bump(.34,.12);
  heartVisual.style.setProperty('--mc-heart-beat',reducedMotion()?'1':pulse.toFixed(4));
  scene.dataset.breathState='running';
  cycleDots.forEach(function(dot,index){var segment=Math.floor(elapsed/DURATION*cycleDots.length);dot.dataset.state=index<segment?'done':index===segment?'current':'next';});
  circle.style.setProperty('--mc-heart-glow',glow.toFixed(3));
  circle.classList.toggle('is-inhaling',inhale);circle.classList.toggle('is-exhaling',!inhale);
  circle.style.setProperty('--mc-breath-scale',reducedMotion()?'0.88':scale.toFixed(3));
  circle.style.setProperty('--mc-breath-glow-size', (inhale ? (0.8 + .34*eased) : (1.14-.34*eased)).toFixed(3));
  circle.setAttribute('data-breath-phase',phaseKey);
  circle.closest('.mc-breathing-stage').style.setProperty('--mc-stage-glow', (0.8+.34*(inhale?eased:1-eased)).toFixed(3));
  ring.style.strokeDashoffset=String(CIRCUMFERENCE*(1-fraction));
  seconds.textContent=String(Math.max(1,Math.ceil((phaseDuration-phaseElapsed)/1000)));
  phaseLabel.textContent=tr(phaseKey);
  if(phaseKey!==previousPhase){cue.textContent=tr(phaseKey);previousPhase=phaseKey;}
  progress.textContent=Math.min(totalCycles,Math.floor(elapsed/info.cycle)+1)+' / '+totalCycles;updateRemaining();
}
function finish(){
  running=false;paused=false;completed=true;cancelAnimationFrame(frame);
  scene.dataset.breathState='complete';heartVisual.style.setProperty('--mc-heart-beat','1');
  cycleDots.forEach(function(dot){dot.dataset.state='done';});
  circle.classList.remove('is-breathing','is-inhaling','is-exhaling');
  circle.style.setProperty('--mc-breath-scale','0.72');
  circle.style.setProperty('--mc-breath-glow-size','0.8');
  circle.removeAttribute('data-breath-phase');
  circle.closest('.mc-breathing-stage').style.setProperty('--mc-stage-glow','0.8');
  ring.style.strokeDashoffset='0';seconds.textContent='✓';phaseLabel.textContent='';
  cue.textContent=tr('complete');progress.textContent=totalCycles+' / '+totalCycles;start.textContent=tr('start');updateRemaining();lockOptions(false);
}
function tick(ts){
  if(!running)return;
  if(!last)last=ts;
  elapsed+=Math.max(0,ts-last);last=ts;
  if(elapsed>=DURATION){elapsed=DURATION;finish();return;}
  draw();frame=requestAnimationFrame(tick);
}
function pause(){scene.dataset.breathState='paused';running=false;paused=true;circle.classList.remove('is-breathing');cancelAnimationFrame(frame);last=0;start.textContent=tr('resume');}
start.addEventListener('click',function(){
  if(running){pause();return;}
  if(completed){elapsed=0;completed=false;previousPhase='';}
  grounding.open=false;lockOptions(true);
  running=true;paused=false;last=0;circle.classList.add('is-breathing');start.textContent=tr('pause');
  draw();frame=requestAnimationFrame(tick);
});
function resetBreathing(){
  running=false;paused=false;completed=false;previousPhase='';cancelAnimationFrame(frame);elapsed=0;last=0;
  scene.dataset.breathState='ready';heartVisual.style.setProperty('--mc-heart-beat','1');
  cycleDots.forEach(function(dot){dot.dataset.state='next';});
  circle.classList.remove('is-breathing','is-inhaling','is-exhaling');
  circle.style.setProperty('--mc-breath-scale','0.72');
  circle.style.setProperty('--mc-breath-glow-size','0.8');
  circle.style.setProperty('--mc-heart-glow','.25');
  circle.removeAttribute('data-breath-phase');
  circle.closest('.mc-breathing-stage').style.setProperty('--mc-stage-glow','0.8');
  ring.style.strokeDashoffset=String(CIRCUMFERENCE);seconds.textContent=String(timing[0]/1000);phaseLabel.textContent=tr('inhale');
  cue.textContent=tr('ready');progress.textContent='0 / '+totalCycles;start.textContent=tr('start');updateRemaining();lockOptions(false);
}
reset.addEventListener('click',resetBreathing);
[rhythm,duration].forEach(function(control){control.addEventListener('change',function(){if(running||paused)return;configure();resetBreathing();});});
groundNext.addEventListener('click',function(){groundIndex=groundIndex<5?groundIndex+1:0;renderGrounding();});
groundBack.addEventListener('click',function(){groundIndex=Math.max(0,groundIndex-1);renderGrounding();});
grounding.addEventListener('toggle',function(){if(grounding.open&&running)pause();});
configure();resetBreathing();
new MutationObserver(function(){if(running&&!document.getElementById('homeSection').classList.contains('active'))pause();}).observe(document.getElementById('homeSection'),{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',function(){if(document.hidden&&running)pause();});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.mood,#mcChangeLanguage,[data-lang]'))setTimeout(renderBreathingLabels,100);});
window.addEventListener('storage',renderBreathingLabels);
window.addEventListener('mindcheck:languagechange',renderBreathingLabels);
renderBreathingLabels();
})();
