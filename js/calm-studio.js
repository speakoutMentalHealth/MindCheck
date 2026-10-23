/* A local-only calm space. Activities never submit or store personal answers. */
(function(){
'use strict';
function mount(){
 const root=document.getElementById('mcBreathing'),sheet=document.getElementById('mcHomeSheet');
 if(!root||!sheet||!window.MindCheckCalmCopy)return;
 const $=id=>document.getElementById(id),completed=new Set();let active='breathe',choice='',focusDone=false,groundStep=0,sound=false,audio=null,soundEpoch=0;
 const notes=new Set();
 function lang(){let code=typeof window.MindCheckLocale?.current==='function'?window.MindCheckLocale.current():document.documentElement.lang;return window.MindCheckCalmCopy[code]?code:'en';}
 const t=key=>window.MindCheckCalmCopy[lang()][key]||window.MindCheckCalmCopy.en[key]||key;
 const icon=(path)=>'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
 const icons={breathe:icon('<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h5a3 3 0 1 1-3 3"/>'),ground:icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>'),focus:icon('<path d="M6 18 18 6M6 6h12v12"/>'),check:icon('<path d="m5 12 4 4L19 6"/>')};
 const breathe=document.createElement('div');breathe.id='mcCalmBreathe';breathe.dataset.calmPanel='breathe';
 while(root.firstChild)breathe.appendChild(root.firstChild);root.appendChild(breathe);
 const nav=document.createElement('div');nav.className='mc-calm-modes';nav.setAttribute('role','group');
 nav.innerHTML=['breathe','ground','focus'].map(key=>'<button type="button" data-calm-mode="'+key+'" aria-controls="mcCalm'+({breathe:'Breathe',ground:'Ground',focus:'Focus'}[key])+'" aria-pressed="'+(key==='breathe')+'">'+icons[key]+'<span data-calm="'+key+'"></span><i aria-hidden="true"></i></button>').join('');root.prepend(nav);
 const ground=document.createElement('div');ground.id='mcCalmGround';ground.dataset.calmPanel='ground';ground.hidden=true;
 ground.innerHTML='<h3 data-calm="groundTitle"></h3><p class="mc-calm-lead" data-calm="groundHint"></p><div class="mc-calm-sense-art" aria-hidden="true"><span id="mcCalmSenseNumber">5</span></div><div class="mc-calm-steps" id="mcCalmSenseSteps" aria-hidden="true">'+[0,1,2,3,4].map(()=>'<i></i>').join('')+'</div>';
 const grounding=$('mcGrounding');ground.appendChild(grounding);grounding.open=true;root.appendChild(ground);
 const focus=document.createElement('div');focus.id='mcCalmFocus';focus.dataset.calmPanel='focus';focus.hidden=true;
 focus.innerHTML='<h3 data-calm="focusTitle"></h3><p class="mc-calm-lead" id="mcCalmFocusHint" data-calm="focusHint"></p><div id="mcCalmFocusChoices">'+['rest','move','task'].map((key,i)=>'<button type="button" data-focus-choice="'+key+'"><span class="mc-calm-choice-icon" aria-hidden="true">'+['◌','◎','↗'][i]+'</span><span><strong data-calm="'+key+'"></strong><small data-calm="'+key+'Hint"></small></span><span aria-hidden="true">→</span></button>').join('')+'</div><div id="mcCalmFocusAction" hidden><div class="mc-calm-focus-symbol" id="mcCalmFocusSymbol" aria-hidden="true">'+icons.focus+'</div><p id="mcCalmFocusPrompt" role="status" aria-live="polite"></p><button type="button" id="mcCalmFocusCommit" class="mc-calm-primary" data-calm="commit"></button><button type="button" id="mcCalmFocusBack" class="mc-calm-secondary" data-calm="choose"></button></div>';
 root.appendChild(focus);
 const settings=document.createElement('details');settings.id='mcCalmSettings';settings.className='mc-calm-settings';settings.innerHTML='<summary><span data-calm="settings"></span><small id="mcCalmSettingsValue"></small><span aria-hidden="true">⌄</span></summary><div class="mc-calm-settings-body"></div>';
 const options=breathe.querySelector('.mc-breathing-options');options.before(settings);settings.lastElementChild.appendChild(options);
 const extras=document.createElement('div');extras.className='mc-calm-preferences';extras.innerHTML='<div><span data-calm="visual"></span><div class="mc-calm-visual-choice" role="group"><button type="button" data-calm-visual="heart" aria-pressed="true" data-calm="heart"></button><button type="button" data-calm-visual="orb" aria-pressed="false" data-calm="orb"></button></div></div><div><span data-calm="sound"></span><button type="button" id="mcCalmSound" aria-pressed="false"></button></div><p id="mcCalmAudioStatus" role="status" aria-live="polite"></p>';settings.lastElementChild.appendChild(extras);
 const timeline=document.createElement('div');timeline.className='mc-calm-timeline';timeline.setAttribute('role','progressbar');timeline.setAttribute('aria-valuemin','0');timeline.setAttribute('aria-valuemax','100');timeline.setAttribute('aria-valuenow','0');timeline.innerHTML='<span></span>';breathe.querySelector('.mc-breathing-meters').after(timeline);
 const footer=document.createElement('p');footer.className='mc-calm-optional';footer.dataset.calm='optional';root.appendChild(footer);
 const announce=document.createElement('p');announce.className='mc-calm-sr';announce.setAttribute('role','status');announce.setAttribute('aria-live','polite');root.appendChild(announce);
 root.dataset.calmActive=active;root.dataset.calmVisual='heart';root.classList.add('mc-calm-studio');
 function pause(){if(root.dataset.breathState==='running')$('mcBreathingStart').click();}
 function stopNotes(){soundEpoch++;for(const node of notes){try{node.stop();}catch(_){}}notes.clear();}
 function markComplete(mode){if(completed.has(mode))return;completed.add(mode);renderNav();announce.textContent=t(mode)+'. '+t('complete');}
 function renderNav(){for(const button of nav.querySelectorAll('button')){const key=button.dataset.calmMode;button.setAttribute('aria-pressed',String(key===active));button.dataset.complete=String(completed.has(key));button.setAttribute('aria-label',t(key)+(completed.has(key)?' · '+t('complete'):''));}nav.setAttribute('aria-label',t('space'));}
 function select(mode){if(mode!=='breathe'){pause();stopNotes();}active=mode;root.dataset.calmActive=mode;for(const panel of [breathe,ground,focus])panel.hidden=panel.dataset.calmPanel!==mode;settings.open=false;$('mcBreathingGuide').open=false;if(mode==='ground')grounding.open=true;renderNav();sheet.scrollTop=0;window.dispatchEvent(new Event('resize'));}
 nav.addEventListener('click',event=>{const button=event.target.closest('[data-calm-mode]');if(button)select(button.dataset.calmMode);});
 function renderFocus(){
  $('mcCalmFocusChoices').hidden=!!choice;$('mcCalmFocusAction').hidden=!choice;
  $('mcCalmFocusHint').textContent=t(focusDone?'focusDoneHint':'focusHint');
  focus.querySelector('h3').textContent=t(focusDone?'focusDone':'focusTitle');
  $('mcCalmFocusPrompt').textContent=choice?t(choice+'Action'):'';
  $('mcCalmFocusCommit').hidden=focusDone;
  $('mcCalmFocusBack').textContent=t(focusDone?'again':'choose');
  $('mcCalmFocusSymbol').innerHTML=focusDone?icons.check:icons.focus;
  focus.dataset.complete=String(focusDone);
 }
 focus.addEventListener('click',event=>{const button=event.target.closest('[data-focus-choice]');if(button){choice=button.dataset.focusChoice;focusDone=false;renderFocus();$('mcCalmFocusCommit').focus();}});
 $('mcCalmFocusCommit').addEventListener('click',()=>{focusDone=true;renderFocus();markComplete('focus');$('mcCalmFocusBack').focus();});
 $('mcCalmFocusBack').addEventListener('click',()=>{const previous=choice;choice='';focusDone=false;renderFocus();focus.querySelector('[data-focus-choice="'+previous+'"]').focus();});
 for(const button of extras.querySelectorAll('[data-calm-visual]'))button.addEventListener('click',()=>{root.dataset.calmVisual=button.dataset.calmVisual;extras.querySelectorAll('[data-calm-visual]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));});
 function audioUnavailable(){sound=false;stopNotes();$('mcCalmAudioStatus').textContent=t('soundUnavailable');renderSound();}
 function getAudio(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unavailable');if(!audio)audio=new Audio();return audio.resume();}catch(_){return Promise.reject(Error('unavailable'));}}
 function renderSound(){$('mcCalmSound').textContent=t(sound?'soundOn':'soundOff');$('mcCalmSound').setAttribute('aria-pressed',String(sound));}
 $('mcCalmSound').addEventListener('click',()=>{sound=!sound;stopNotes();$('mcCalmAudioStatus').textContent='';renderSound();if(sound)getAudio().catch(audioUnavailable);});
 // Chimes are opt-in, one per phase, and never play after leaving the activity.
 async function chime(phase){if(!sound||document.hidden||!sheet.open||active!=='breathe')return;const epoch=soundEpoch;try{await getAudio();if(epoch!==soundEpoch||!sound||root.dataset.breathState!=='running')return;const oscillator=audio.createOscillator(),gain=audio.createGain(),at=audio.currentTime;oscillator.type='sine';oscillator.frequency.value=phase==='inhale'?528:396;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.035,at+.04);gain.gain.exponentialRampToValueAtTime(.0001,at+.65);oscillator.connect(gain);gain.connect(audio.destination);notes.add(oscillator);oscillator.onended=()=>{notes.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(at);oscillator.stop(at+.7);}catch(_){audioUnavailable();}}
 window.addEventListener('mindcheck:breathphase',e=>chime(e.detail.phase));
 window.addEventListener('mindcheck:breathcomplete',()=>{stopNotes();markComplete('breathe');});
 function renderGround(){ground.dataset.complete=String(groundStep===5);ground.querySelector('h3').textContent=t(groundStep===5?'groundEnd':'groundTitle');ground.querySelector('.mc-calm-lead').textContent=t(groundStep===5?'groundEndHint':'groundHint');$('mcCalmSenseNumber').textContent=groundStep===5?'✓':String(5-groundStep);[...$('mcCalmSenseSteps').children].forEach((dot,i)=>dot.dataset.state=i<groundStep?'done':i===groundStep?'current':'next');}
 window.addEventListener('mindcheck:groundstep',e=>{groundStep=e.detail.index;renderGround();if(groundStep===5)markComplete('ground');});
 new MutationObserver(()=>{if(root.dataset.breathState!=='running')stopNotes();}).observe(root,{attributes:true,attributeFilter:['data-breath-state']});
 sheet.addEventListener('close',stopNotes);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopNotes();});
 function summary(){$('mcCalmSettingsValue').textContent=({'gentle':'4 : 6','steady':'5 : 5','easy':'3 : 3'}[$('mcBreathingRhythm').value]||'4 : 6')+' · '+$('mcBreathingDuration').selectedOptions[0].textContent;}
 settings.addEventListener('change',summary);
 function render(){root.querySelectorAll('[data-calm]').forEach(el=>el.textContent=t(el.dataset.calm));renderNav();renderFocus();renderGround();renderSound();summary();timeline.setAttribute('aria-label',t('session'));extras.querySelector('[role=group]').setAttribute('aria-label',t('visual'));const home=$('mcOpenBreathing');home.querySelector('strong').textContent=t('space');home.querySelector('small').textContent=t('hint');if(sheet.dataset.panel==='breathing')$('mcHomeSheetTitle').textContent=t('space');}
 window.addEventListener('mindcheck:languagechange',render);
 new MutationObserver(()=>{if(sheet.dataset.panel==='breathing')$('mcHomeSheetTitle').textContent=t('space');}).observe(sheet,{attributes:true,attributeFilter:['open','data-panel']});
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
