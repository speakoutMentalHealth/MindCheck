/* Local fixtures only: all provider calls intercepted, no health records transmitted. */
const {chromium}=require('./adult-browser-fixture.cjs');
const assert=require('node:assert/strict'),{spawn}=require('node:child_process'),net=require('node:net');
(async()=>{const server=spawn('python3',['-m','http.server','8799','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
try{
 for(let n=0;n<50;n++){try{await new Promise((r,j)=>{const s=net.connect(8799,'127.0.0.1');s.on('connect',()=>{s.end();r()});s.on('error',j)});break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch();const origin='http://127.0.0.1:8799/';
 for(const width of [320,390,1280]){
  const c=await browser.newContext({viewport:{width,height:740},serviceWorkers:'block'}),calls=[];let mode='ok';
  await c.addInitScript(()=>{window.MindCheckVerifiedAdultAccess={getToken:async()=> 'mockpayload.mocksignature'}});
  await c.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
  await c.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',r=>{calls.push(r.request().postDataJSON());return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(mode==='ok'?{source:'gemini',answer:'Choose a mood, then save your check-in. History remains in this browser.'}:{source:'prepared',reason:'quota',answer:'Prepared answer.'})})});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(origin+'index.html?section=moodSection');
  await p.evaluate(()=>{localStorage.setItem('fixture-private-mood','never-send-this');});
  const link=p.locator('#moodSection .mc-inline-guide');await link.click();
  await p.locator('#mcContextGuide[open]').waitFor();await p.locator('#mcGuideQuestion').filter({hasText:'mood'}).waitFor();
  assert(p.url().includes('index.html'),'guide stays in the app');assert.equal(calls.length,0);
  await p.locator('#mcGuideAI').click();await p.locator('#mcGuideAIAnswer').waitFor({state:'visible'});
  assert.deepEqual(calls,[{question:'mood',language:'en',adult:true}]);
  await p.locator('#mcGuideAI').click();assert.equal(calls.length,1,'public answer cached in memory');
  await p.locator('#mcGuideLanguage').selectOption('fr');await p.locator('#mcGuideAI').click();await p.locator('#mcGuideAIAnswer').waitFor({state:'visible'});
  assert.deepEqual(calls[1],{question:'mood',language:'fr',adult:true});
  await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const violations=await p.evaluate(async()=>(await axe.run(document.getElementById('mcContextGuide'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  assert.deepEqual(violations,[]);await p.evaluate(()=>document.body.classList.add('night'));assert.deepEqual(await p.evaluate(async()=>(await axe.run(document.getElementById('mcContextGuide'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)),[]);if(width===390)await p.screenshot({path:'/tmp/mc-contextual-ai-preview.png'});assert.equal(await p.locator('#mcContextGuide').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
  await p.keyboard.press('Escape');assert.equal(await p.locator('#mcContextGuide').evaluate(e=>e.open),false);assert.equal(await link.evaluate(e=>e===document.activeElement),true);
  await p.goto(origin+'assessment-centre.html');await p.locator('main .mc-inline-guide').click();await p.locator('#mcGuideQuestion').filter({hasText:'assessments'}).waitFor();mode='quota';await p.locator('#mcGuideAI').click();await p.waitForFunction(()=>document.getElementById('mcGuideAIStatus').textContent.includes('[quota]'));assert(await p.locator('#mcGuideAnswer').isVisible());
  assert.equal(calls[2].question,'assessment');assert.deepEqual(errors,[]);await c.close();console.log('PASS in-app guide '+width+': exact public payloads, no auto generation, language-specific cache, fallback, accessible dialog, focus restoration');
 }
 // Missing adult authorization must never call the AI endpoint.
 const denied=await browser.newContext({serviceWorkers:'block'});let unauthorizedCalls=0;
 await denied.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',r=>{unauthorizedCalls++;return r.abort()});
 const dp=await denied.newPage();await dp.goto(origin+'index.html?section=moodSection');await dp.locator('#moodSection .mc-inline-guide').click();await dp.locator('#mcGuideAI').click();
 await dp.waitForFunction(()=>document.getElementById('mcGuideAIStatus').textContent.includes('[authorization]'));
 assert.equal(unauthorizedCalls,0);assert(await dp.locator('#mcGuideAnswer').isVisible());assert.equal(await dp.locator('#mcGuideAIAnswer').isVisible(),false);await denied.close();
 // Closing invalidates a delayed request; its reply must not appear on reopening.
 const c=await browser.newContext({serviceWorkers:'block'});await c.addInitScript(()=>{window.MindCheckVerifiedAdultAccess={getToken:async()=> 'mockpayload.mocksignature'}});await c.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());let release;
 await c.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',async r=>{await new Promise(resolve=>release=resolve);try{await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'gemini',answer:'Delayed public answer that should not be displayed.'})})}catch{}});
 const p=await c.newPage();await p.goto(origin+'index.html');await p.locator('.mc-ai-guide-entry').click();await p.locator('#mcGuideAI').click();for(let i=0;i<30&&!release;i++)await p.waitForTimeout(50);assert(release);await p.keyboard.press('Escape');release();await p.locator('.mc-ai-guide-entry').click();assert.equal(await p.locator('#mcGuideAIAnswer').isVisible(),false);await c.close();console.log('PASS close aborts generation and rejects stale replies');
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
