/* Isolated reading-flow checks. Never submits assessments or creates certificates. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process'),{mkdir,writeFile}=require('node:fs/promises'),net=require('node:net');
const base='http://127.0.0.1:8771',path='/training-hub.html',sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 const server=spawn('python3',['-m','http.server','8771','--bind','127.0.0.1'],{stdio:'ignore'});let browser;const reports=[];
 await mkdir('artifacts/training-centre',{recursive:true});
 try{
  for(let i=0;i<30;i++){try{await new Promise((r,j)=>{const c=net.connect(8771,'127.0.0.1');c.on('connect',()=>{c.end();r()});c.on('error',j)});break}catch(e){if(i===29)throw e;await sleep(200)}}
  browser=await chromium.launch();
  for(const width of [320,360,390,820,1366]){
   const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
   await context.route('https://fonts.googleapis.com/**',r=>r.abort());
   const page=await context.newPage(),errors=[],writes=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url())});
   await page.goto(base+path);await page.locator('body.is-enhanced').waitFor();
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.th-lesson:visible').count(),1);
   assert.equal(await page.locator('#assessmentLink').isVisible(),false);assert.equal(await page.locator('#prevLesson').isDisabled(),true);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width}`);
   await page.screenshot({path:`artifacts/training-centre/${width}-initial.png`,fullPage:true});
   async function accessible(){await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const a=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[],`accessibility ${width}`)}
   await accessible();
   // Browsing a topic alone must not mark it reviewed or unlock assessment.
   await page.locator('[data-open-lesson="5"]').click();await page.locator('#nextLesson').click();
   assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),1);assert.equal(await page.locator('#assessmentLink').isVisible(),false);
   await page.locator('[data-open-lesson="1"]').click();await page.locator('#nextLesson').click();
   await page.reload();assert.equal(await page.locator('[data-lesson="2"]').isVisible(),true);
   assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),2);assert.equal(await page.evaluate(()=>scrollY),0,'initial load must keep front door visible');
   for(let lesson=2;lesson<=4;lesson++){assert.equal(await page.locator(`[data-lesson="${lesson}"]`).isVisible(),true);await page.locator('#nextLesson').click()}
   assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),5);assert.equal(await page.locator('#assessmentLink').isVisible(),true);
   const target=await page.locator('#assessmentLink').getAttribute('href');assert.match(target,/^https:\/\/script.google.com\/macros\/s\/[^/]+\/exec\?type=assessment$/);
   await page.route('https://script.google.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<h1>Synthetic assessment destination</h1>'}));
   await page.locator('#assessmentLink').click();await page.getByRole('heading',{name:'Synthetic assessment destination'}).waitFor();await page.goBack();
   assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),5);
   await page.locator('#prevLesson').click();assert.equal(await page.locator('[data-lesson="4"]').isVisible(),true);assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),5);
   await page.locator('#nightToggle').click();assert.equal(await page.locator('#nightToggle').getAttribute('aria-pressed'),'true');await accessible();
   await page.screenshot({path:`artifacts/training-centre/${width}-night.png`,fullPage:true});
   await page.locator('#resetProgress').click();await page.getByRole('button',{name:'Keep progress',exact:true}).click();assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),5);
   await page.locator('#resetProgress').click();await page.getByRole('button',{name:'Reset progress',exact:true}).click();assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),0);assert.equal(await page.locator('#assessmentLink').isVisible(),false);
   assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);reports.push({width,passed:true});await context.close();
  }
  for(const fixture of ['blocked','corrupt','legacy','invalid']){
   const context=await browser.newContext({serviceWorkers:'block'});await context.addInitScript(f=>{
    if(f==='blocked')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}});
    if(f==='corrupt')localStorage.setItem('mc_training_reader_v2','{bad');
    if(f==='legacy')localStorage.setItem('mc_training_lessons_done','3');
    if(f==='invalid')localStorage.setItem('mc_training_reader_v2',JSON.stringify({current:900,reviewed:[1,1,-1,6,'2',null]}));
   },fixture);
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+path);await page.locator('body.is-enhanced').waitFor();
   const expected=fixture==='legacy'?3:fixture==='invalid'?1:0;assert.equal(await page.locator('#trainingProgress').evaluate(el=>el.value),expected);
   if(fixture==='legacy')assert.equal(await page.locator('[data-lesson="4"]').isVisible(),true);
   if(fixture==='blocked'){await page.locator('#nextLesson').click();assert.match(await page.locator('#storageStatus').innerText(),/cannot save/)}
   assert.deepEqual(errors,[]);await context.close();reports.push({fixture,passed:true});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false}),nojsPage=await nojs.newPage();await nojsPage.goto(base+path);assert.equal(await nojsPage.locator('.th-lesson:visible').count(),5);assert.equal(await nojsPage.locator('#assessmentLink').isVisible(),true);await nojs.close();
  const offline=await browser.newContext(),page=await offline.newPage();await page.goto(base+'/');await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await offline.setOffline(true);await page.goto(base+path);await page.locator('body.is-enhanced').waitFor();
  for(let i=0;i<5;i++)await page.locator('#nextLesson').click();await page.locator('#assessmentLink').click();assert.equal(new URL(page.url()).pathname,path);assert.match(await page.locator('#networkStatus').innerText(),/offline/);await offline.close();
  await writeFile('artifacts/training-centre/results.json',JSON.stringify({reports,noJavaScript:true,offline:true},null,2));console.log('PASS training centre: 5 widths, light/dark accessibility, real reading navigation, assessment handoff, persistence, reset, legacy/invalid/blocked storage, no-JS and offline.');
 }finally{if(browser)await browser.close();server.kill('SIGTERM')}
}
run().catch(e=>{console.error(e);process.exitCode=1});
