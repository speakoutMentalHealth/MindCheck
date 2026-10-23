/* Local fixtures only: calm activities, privacy, sound consent and mobile access. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),{spawn}=require('node:child_process'),net=require('node:net');
(async()=>{let browser;const server=spawn('python3',['-m','http.server','8781','--bind','127.0.0.1'],{stdio:'ignore'});try{
 for(let n=0;n<60;n++){try{await new Promise((r,j)=>{const s=net.connect(8781,'127.0.0.1');s.on('connect',()=>{s.end();r()});s.on('error',j)});break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch({headless:true});
 for(const [width,height] of [[320,568],[390,600],[430,740],[1280,900]]){
  const c=await browser.newContext({viewport:{width,height},serviceWorkers:'block'}),writes=[],p=await c.newPage(),errors=[],dialogs=[];
  await c.route('**/*',r=>{if(r.request().method()!=='GET')writes.push(r.request().method()+' '+r.request().url());return r.request().url().startsWith('http://127.0.0.1:8781/')?r.continue():r.abort()});
  await c.addInitScript(()=>{window.audioCalls={created:0,started:0,stopped:0};window.AudioContext=class{constructor(){window.audioCalls.created++;this.currentTime=0;this.destination={}}resume(){return Promise.resolve()}createOscillator(){return{frequency:{value:0},connect(){},disconnect(){},start(){window.audioCalls.started++},stop(){window.audioCalls.stopped++}}}createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}}});
  p.on('pageerror',e=>errors.push(e.message));p.on('dialog',async d=>{dialogs.push(d.message());await d.dismiss()});await p.clock.install();
  await p.goto('http://127.0.0.1:8781/index.html?section=homeSection');await p.locator('#mcOpenBreathing').click();await p.clock.runFor(400);
  assert.equal(await p.locator('#mcHomeSheetTitle').innerText(),'Calm space');assert.equal(await p.evaluate(()=>audioCalls.created),0,'no audio context without consent');
  await p.locator('#mcBreathingStart').click();await p.clock.runFor(1100);assert.equal(await p.evaluate(()=>audioCalls.started),0,'default session silent');
  await p.locator('[data-calm-mode=ground]').click();assert.equal(await p.locator('#mcBreathing').getAttribute('data-breath-state'),'paused');
  assert.equal(await p.locator('#mcCalmBreathe').isVisible(),false);assert.equal(await p.locator('#mcCalmSenseNumber').innerText(),'5');
  for(let n=0;n<5;n++){await p.locator('#mcGroundingNext').click();assert.equal(await p.locator('#mcCalmSenseNumber').innerText(),n===4?'✓':String(4-n));}
  assert.equal(await p.locator('[data-calm-mode=ground]').getAttribute('data-complete'),'true');await p.locator('#mcGroundingBack').click();assert.equal(await p.locator('#mcCalmSenseNumber').innerText(),'1');
  await p.locator('[data-calm-mode=focus]').click();for(const choice of ['rest','move','task']){await p.locator('[data-focus-choice='+choice+']').click();assert((await p.locator('#mcCalmFocusPrompt').innerText()).length>20);await p.locator('#mcCalmFocusBack').click();assert.equal(await p.evaluate(()=>document.activeElement.dataset.focusChoice),choice)}
  await p.locator('[data-focus-choice=task]').click();await p.locator('#mcCalmFocusCommit').click();assert.equal(await p.locator('[data-calm-mode=focus]').getAttribute('data-complete'),'true');assert.equal(await p.locator('#mcCalmFocusCommit').isVisible(),false);
  const focusText=await p.locator('#mcCalmFocusPrompt').innerText();await p.locator('[data-calm-mode=breathe]').click();await p.locator('[data-calm-mode=focus]').click();assert.equal(await p.locator('#mcCalmFocusPrompt').innerText(),focusText,'activity switch preserves chosen step');
  await p.locator('[data-calm-mode=breathe]').click();await p.locator('#mcBreathingReset').click();
  await p.locator('#mcCalmSettings summary').click();await p.locator('[data-calm-visual=orb]').click();assert.equal(await p.locator('#mcBreathing').getAttribute('data-calm-visual'),'orb');await p.locator('#mcCalmSound').click();assert.equal(await p.locator('#mcCalmSound').getAttribute('aria-pressed'),'true');assert.equal(await p.evaluate(()=>audioCalls.created),1);
  await p.locator('#mcCalmSettings summary').click();await p.locator('#mcBreathingStart').click();await p.clock.runFor(500);assert((await p.evaluate(()=>audioCalls.started))>=1);await p.clock.runFor(4000);assert((await p.evaluate(()=>audioCalls.started))>=2,'one cue at new phase');
  await p.locator('[data-calm-mode=focus]').click();const count=await p.evaluate(()=>audioCalls.started);await p.clock.runFor(8000);assert.equal(await p.evaluate(()=>audioCalls.started),count,'no hidden-activity chimes');
  await p.locator('[data-calm-mode=breathe]').click();await p.locator('#mcBreathingReset').click();await p.locator('#mcBreathingStart').click();await p.clock.runFor(50);await p.clock.fastForward(31000);assert.equal(await p.locator('[data-calm-mode=breathe]').getAttribute('data-complete'),'true');assert.equal(await p.locator('.mc-calm-timeline').getAttribute('aria-valuenow'),'100');
  for(const lang of width===390?['en','ha','ig','yo','pcm','fr']:['en']){
   await p.locator('#mcLanguageSelect').selectOption(lang);
   for(const mode of ['breathe','ground','focus']){await p.locator('[data-calm-mode='+mode+']').click();await p.clock.runFor(400);const missing=await p.locator('#mcBreathing [data-calm]').evaluateAll(els=>els.filter(e=>!e.textContent.trim()||e.textContent===e.dataset.calm&&e.dataset.calm!=='focus').map(e=>e.dataset.calm));assert.deepEqual(missing,[]);const geometry=await p.locator('#mcHomeSheet').evaluate(d=>({overflow:d.scrollHeight-d.clientHeight,width:document.documentElement.scrollWidth}));assert(geometry.width<=width+2,'no horizontal overflow');if(width>=390)assert(geometry.overflow<=2,'compact '+mode+' '+lang+' '+JSON.stringify(geometry));
    await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const violations=await p.evaluate(async()=>(await axe.run(document.getElementById('mcHomeSheet'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(violations,[],'accessibility '+mode+' '+lang);
   }
  }
  await p.locator('#mcLanguageSelect').selectOption('en');for(const mode of ['breathe','ground','focus']){await p.locator('[data-calm-mode='+mode+']').click();await p.clock.runFor(400);if(width===390)await p.screenshot({path:'/tmp/calm-'+mode+'.png',animations:'disabled'});}
  assert.equal(await p.locator('#mcBreathing input,#mcBreathing textarea').count(),0,'no personal-answer fields');assert.deepEqual(writes,[],'no activity POSTs');assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[]);
  await c.close();console.log('PASS calm space '+width+'x'+height+': activities, completion, continuity, translations, sound consent, privacy and accessibility');
 }
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
