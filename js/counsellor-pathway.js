/* Personal reminders only. No uploads, credential checks or profile activation. */
(function(){
  'use strict';
  const KEY='mc_counsellor_pathway_v2';
  const status=document.getElementById('storageStatus');
  let storageAvailable=true;
  function read(key){try{return localStorage.getItem(key);}catch{storageAvailable=false;return null;}}
  function write(key,value){try{localStorage.setItem(key,value);return true;}catch{storageAvailable=false;return false;}}
  let state={courseComplete:false,certificateReady:false,route:'beginner'};
  const saved=read(KEY);
  if(saved){
    try{
      const parsed=JSON.parse(saved);
      state.courseComplete=parsed?.courseComplete===true;
      state.certificateReady=state.courseComplete&&parsed?.certificateReady===true;
      state.route=parsed?.route==='qualified'?'qualified':'beginner';
    }catch{/* Ignore damaged local data; the course remains accessible. */}
  }else{
    // Preserve the old self-reported course checkmark. A filename or local quiz
    // result is never evidence of certificate delivery or verified credentials.
    state.courseComplete=read('mc_counsellor_course_done')==='1';
  }
  function storageNotice(){status.textContent=storageAvailable?'':'Your checklist works for this visit, but this browser cannot save it.';}
  function persist(){write(KEY,JSON.stringify(state));storageNotice();}
  const course=document.getElementById('courseComplete');
  const certificate=document.getElementById('certificateReady');
  const progress=document.getElementById('learningProgress');
  const progressLabel=document.getElementById('progressLabel');
  const title=document.getElementById('progressTitle');
  const beginner=document.getElementById('beginnerPath');
  const qualified=document.getElementById('qualifiedPath');
  const choices=document.querySelectorAll('input[name="pathway"]');
  const toast=document.getElementById('pathwayToast');
  let toastTimer;
  function announce(message){toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),3200);}
  function render(){
    course.checked=state.courseComplete;
    certificate.checked=state.certificateReady;
    certificate.disabled=!state.courseComplete;
    const count=Number(state.courseComplete)+Number(state.certificateReady);
    progress.value=count;
    progressLabel.textContent=`${count} of 2 learning steps`;
    title.textContent=count===2?'Foundation checklist complete.':'A small step forward.';
    document.querySelector('.cp-progress-card').classList.toggle('is-complete',count===2);
    beginner.hidden=state.route!=='beginner';
    qualified.hidden=state.route!=='qualified';
    choices.forEach(choice=>{choice.checked=choice.value===state.route;});
    storageNotice();
  }
  choices.forEach(choice=>choice.addEventListener('change',()=>{
    if(!choice.checked)return;
    state.route=choice.value;persist();render();
  }));
  course.addEventListener('change',()=>{
    state.courseComplete=course.checked;
    if(!state.courseComplete)state.certificateReady=false;
    persist();render();
    if(state.courseComplete)announce('Course marked complete on your checklist. Download your certificate from the provider when it is available.');
  });
  certificate.addEventListener('change',()=>{
    state.certificateReady=course.checked&&certificate.checked;
    persist();render();
    if(state.certificateReady)announce('Checklist complete. You can ask SpeakOut about your next step.');
  });
  const dialog=document.getElementById('resetDialog');
  const reset=document.getElementById('resetProgress');
  reset.addEventListener('click',()=>dialog.showModal());
  document.getElementById('cancelReset').addEventListener('click',()=>dialog.close());
  document.getElementById('confirmReset').addEventListener('click',()=>{
    state.courseComplete=false;state.certificateReady=false;
    persist();render();dialog.close();announce('Your learning checklist has been reset.');
  });
  dialog.addEventListener('close',()=>reset.focus());
  const theme=document.getElementById('nightToggle');
  function setNight(on){
    document.body.classList.toggle('night',on);
    theme.setAttribute('aria-pressed',String(on));
    document.getElementById('themeIcon').setAttribute('href',on?'#cp-sun':'#cp-moon');
    document.querySelector('meta[name="theme-color"]').content=on?'#101a2a':'#f6f8fc';
  }
  setNight(read('mc_night_mode')==='1');
  theme.addEventListener('click',()=>{
    const on=!document.body.classList.contains('night');setNight(on);write('mc_night_mode',on?'1':'0');storageNotice();
  });
  window.addEventListener('pageshow',render);
  render();
})();
