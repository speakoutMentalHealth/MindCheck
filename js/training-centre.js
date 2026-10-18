/* Device-only reading reminders. Assessment results are handled by the official service. */
(function(){
'use strict';
const $=id=>document.getElementById(id),KEY='mc_training_reader_v2',LEGACY='mc_training_lessons_done';
let canSave=true;
function read(key){try{return localStorage.getItem(key)}catch{canSave=false;return null}}
function write(key,value){try{localStorage.setItem(key,value)}catch{canSave=false}}
let state={reviewed:[],current:1};
const saved=read(KEY);
if(saved){try{const p=JSON.parse(saved);state.reviewed=Array.isArray(p?.reviewed)?[...new Set(p.reviewed.filter(n=>Number.isInteger(n)&&n>=1&&n<=5))]:[];state.current=Number.isInteger(p?.current)&&p.current>=1&&p.current<=5?p.current:1}catch{/* Corrupt reminders never prevent learning. */}}
else{const n=Number(read(LEGACY));const count=Number.isFinite(n)?Math.max(0,Math.min(5,Math.floor(n))):0;state.reviewed=Array.from({length:count},(_,i)=>i+1);state.current=Math.min(count+1,5)}
const lessons=[...document.querySelectorAll('.th-lesson')],buttons=[...document.querySelectorAll('[data-open-lesson]')];
function notice(){$('storageStatus').textContent=canSave?'Progress stays on this device. It is not an assessment result.':'Progress works for this visit, but this browser cannot save it.'}
function persist(){write(KEY,JSON.stringify(state));let prefix=0;while(state.reviewed.includes(prefix+1))prefix++;write(LEGACY,String(prefix));notice()}
function render(){
 const count=state.reviewed.length,complete=count===5;
 lessons.forEach((lesson,i)=>{lesson.hidden=i+1!==state.current});
 buttons.forEach(button=>{const n=Number(button.dataset.openLesson),done=state.reviewed.includes(n);button.classList.toggle('is-reviewed',done);button.querySelector('.th-number').textContent=done?'✓':`0${n}`;button.querySelector('.th-lesson-status').textContent=done?'Reviewed':'Not yet reviewed';if(n===state.current)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
 $('progressCount').replaceChildren(document.createTextNode(String(count)),Object.assign(document.createElement('span'),{textContent:'/ 5'}));
 $('progressRing').style.setProperty('--th-progress',`${count*72}deg`);$('trainingProgress').value=count;$('progressText').textContent=`${count} of 5 lessons reviewed`;
 $('resumeLearning').textContent=complete?'Review your learning':count?'Continue learning':'Start learning';
 $('prevLesson').disabled=state.current===1;
 $('nextLesson').textContent=state.reviewed.includes(state.current)?(state.current===5?'View next step':'Next lesson'):(state.current===5?'Mark reviewed & finish':'Mark reviewed & continue');
 $('assessmentActions').hidden=!complete;
 $('assessmentTitle').textContent=complete?'Ready for your knowledge check.':'Put your learning into practice.';
 $('assessmentStatus').textContent=complete?'You’ve reviewed all five lessons. The official assessment service checks your answers and issues a certificate if you pass.':'Review all five lessons to open the assessment. You can revisit any topic before you continue.';
 notice();
}
function focusLesson(){const title=$(`lessonTitle${state.current}`);title.focus({preventScroll:true});title.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
function openLesson(n,focus=true){state.current=n;persist();render();if(focus)focusLesson()}
buttons.forEach(button=>button.addEventListener('click',()=>openLesson(Number(button.dataset.openLesson))));
$('resumeLearning').addEventListener('click',event=>{event.preventDefault();focusLesson()});
$('prevLesson').addEventListener('click',()=>{if(state.current>1)openLesson(state.current-1)});
$('nextLesson').addEventListener('click',()=>{
 if(!state.reviewed.includes(state.current))state.reviewed.push(state.current);
 $('learningAnnouncement').textContent=`Lesson ${state.current} reviewed. ${state.reviewed.length} of 5 lessons reviewed.`;
 if(state.current<5){openLesson(state.current+1)}else{persist();render();$('assessmentTitle').tabIndex=-1;$('assessmentTitle').focus({preventScroll:true});$('assessmentCard').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
});
const dialog=$('resetDialog');$('resetProgress').addEventListener('click',()=>dialog.showModal());$('cancelReset').addEventListener('click',()=>dialog.close());$('confirmReset').addEventListener('click',()=>{state={reviewed:[],current:1};persist();render();dialog.close();$('learningAnnouncement').textContent='Lesson progress reset on this device.';focusLesson()});
function network(){$('networkStatus').textContent=navigator.onLine?'The assessment opens an external service and needs internet access.':'You’re offline. Keep learning here and reconnect before opening the assessment.'}
window.addEventListener('online',network);window.addEventListener('offline',network);$('assessmentLink').addEventListener('click',e=>{if(!navigator.onLine){e.preventDefault();network();$('networkStatus').tabIndex=-1;$('networkStatus').focus()}});
let night=read('mc_night_mode')==='1';function theme(){document.body.classList.toggle('night',night);$('nightToggle').setAttribute('aria-pressed',String(night));$('themeIcon').setAttribute('href',night?'#cp-sun':'#cp-moon')}
$('nightToggle').addEventListener('click',()=>{night=!night;write('mc_night_mode',night?'1':'0');theme();notice()});
document.body.classList.add('is-enhanced');$('readerControls').hidden=false;theme();render();network();
})();
