/* Local-only interaction and accessibility checks. No personal data or real submissions. */
const {chromium}=require('playwright');const assert=require('node:assert/strict');
const {spawn}=require('node:child_process'),net=require('node:net');
(async()=>{let browser;const server=spawn('python3',['-m','http.server','8773','--bind','127.0.0.1'],{stdio:'ignore'});
try{
 for(let n=0;n<40;n++){try{await new Promise((res,rej)=>{const socket=net.connect(8773,'127.0.0.1');socket.on('connect',()=>{socket.end();res();});socket.on('error',rej);});break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true});
 for(const width of [320,390,1280]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  await context.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:8773/')?route.continue():route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install();await page.goto('http://127.0.0.1:8773/index.html?section=homeSection');
  await page.locator('#mcOpenBreathing').click();
  const rhythm=page.locator('#mcBreathingRhythm'),duration=page.locator('#mcBreathingDuration'),start=page.locator('#mcBreathingStart'),reset=page.locator('#mcBreathingReset');
  await page.locator('#mcCalmSettings summary').click();await rhythm.waitFor({state:'visible'});assert.equal(await rhythm.locator('option').count(),3);assert.equal(await duration.locator('option').count(),3);
  if(width===390){
   for(const [pattern,cycle] of [['gentle',10],['steady',10],['easy',6]])for(const time of [30000,60000,120000]){
    await page.locator('#mcCalmSettings').evaluate(el=>el.open=true);await rhythm.selectOption(pattern);await duration.selectOption(String(time));await page.locator('#mcCalmSettings').evaluate(el=>el.open=false);
    assert.equal(await page.locator('#mcBreathingProgress').innerText(),'0 / '+(time/1000/cycle));
    await start.click();assert(await rhythm.isDisabled());assert(await duration.isDisabled());
    await page.clock.runFor(1200);await start.click();const frozen=await page.locator('#mcBreathingRemaining').innerText();
    await page.clock.runFor(2000);assert.equal(await page.locator('#mcBreathingRemaining').innerText(),frozen,'pause freezes timer');
    await start.click();await page.clock.runFor(30);await page.clock.fastForward(time+1000);
    assert.equal(await page.locator('#mcBreathing').getAttribute('data-breath-state'),'complete');
    assert.equal(await page.locator('#mcBreathingRemaining').innerText(),'0:00');assert(await rhythm.isEnabled());
    await reset.click();assert.equal(await page.locator('#mcBreathing').getAttribute('data-breath-state'),'ready');
   }
  }
  await page.locator('#mcCalmSettings').evaluate(el=>el.open=true);await rhythm.selectOption('gentle');await duration.selectOption('30000');await page.locator('#mcCalmSettings').evaluate(el=>el.open=false);await start.click();await page.clock.runFor(1200);
  const current=await page.locator('#mcBreathingRemaining').innerText();await page.locator('#mcLanguageSelect').selectOption('fr');
  assert.equal(await page.locator('#mcBreathing').getAttribute('data-breath-state'),'running');
  assert.equal(await page.locator('#mcBreathingRemaining').innerText(),current,'language changes preserve time');
  await page.locator('[data-calm-mode=ground]').click();await page.clock.runFor(30);
  assert.equal(await page.locator('#mcBreathing').getAttribute('data-breath-state'),'paused','grounding pauses breathing');
  assert(await page.locator('#mcGroundingBack').isDisabled());
  await page.locator('#mcGroundingNext').click();assert.equal(await page.locator('#mcGroundingProgress').innerText(),'2 / 5');
  await page.locator('#mcGroundingBack').click();assert.equal(await page.locator('#mcGroundingProgress').innerText(),'1 / 5');
  for(let i=0;i<5;i++)await page.locator('#mcGroundingNext').click();
  assert.equal(await page.locator('#mcGroundingNext').innerText(),'Recommencer');
  assert.equal(await page.locator('#mcGrounding input,#mcGrounding textarea').count(),0,'grounding must not collect sensory answers');
  await page.locator('#mcGroundingNext').click();assert.equal(await page.locator('#mcGroundingProgress').innerText(),'1 / 5');
  await page.locator('[data-calm-mode=breathe]').click();await reset.click();await page.locator('#mcCalmSettings summary').click();
  for(const code of ['en','ha','ig','yo','pcm','fr']){
   await page.locator('#mcLanguageSelect').selectOption(code);
   const missing=await page.locator('#mcBreathing [data-bx]').evaluateAll(els=>els.filter(el=>!el.textContent.trim()||el.textContent===el.dataset.bx).map(el=>el.dataset.bx));assert.deepEqual(missing,[]);
   const bounds=await rhythm.boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1,'rhythm selector fits at '+width);
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert.equal(overflow,false,'page overflow '+width);
  await page.locator('#mcLanguageSelect').selectOption('en');await page.clock.runFor(500);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const violations=await page.evaluate(async()=>(await axe.run(document.getElementById('mcBreathing'),{rules:{region:{enabled:false}}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})));
  assert.deepEqual(violations,[],'breathing accessibility at '+width);
  if(width===390){await page.locator('#mcBreathing').screenshot({path:'/tmp/mc-breathing-studio.png'});}
  await page.locator('#mcCalmSettings').evaluate(el=>el.open=false);await page.emulateMedia({reducedMotion:'reduce'});await start.click();await page.clock.runFor(1000);
  assert.equal(await page.locator('.mc-breathing-heart-svg').evaluate(el=>getComputedStyle(el).transform),'none');
  assert.deepEqual(errors,[]);console.log('PASS breathing studio '+width+'px: rhythms, durations, pause/resume/reset, language continuity, grounding, reduced motion and accessibility');await context.close();
 }
}finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
