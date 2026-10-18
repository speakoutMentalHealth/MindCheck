/* Isolated synthetic UI checks: no course accounts, uploads, emails or health data. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {mkdir,writeFile}=require('node:fs/promises');
const net=require('node:net');
const base='http://127.0.0.1:8770',path='/become-a-counsellor.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 const server=spawn('python3',['-m','http.server','8770','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
 const reports=[];await mkdir('artifacts/counsellor-pathway',{recursive:true});
 try{
  for(let n=0;n<30;n++){try{await new Promise((r,j)=>{const c=net.connect(8770,'127.0.0.1');c.on('connect',()=>{c.end();r()});c.on('error',j)});break}catch(e){if(n===29)throw e;await sleep(200)}}
  browser=await chromium.launch();
  for(const width of [320,360,390,820,1366]){
   const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
   await context.route('https://fonts.googleapis.com/**',r=>r.abort());
   const page=await context.newPage(),errors=[],writes=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url())});
   await page.goto(base+path);await page.locator('#beginnerPath').waitFor({state:'visible'});
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('input[type=file]').count(),0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${width}`);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const axe=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`accessibility at ${width}`);
   if([390,1366].includes(width))await page.screenshot({path:`artifacts/counsellor-pathway/${width}-light.png`,fullPage:true});
   await page.getByRole('checkbox',{name:'I completed the provider’s course.'}).check();
   assert.equal(await page.locator('#learningProgress').evaluate(el=>el.value),1);
   await page.getByRole('checkbox',{name:'I downloaded my provider certificate.'}).check();
   await page.getByRole('heading',{name:'Foundation checklist complete.'}).waitFor();
   await page.reload();assert.equal(await page.locator('#courseComplete').isChecked(),true);assert.equal(await page.locator('#certificateReady').isChecked(),true);
   await page.locator('#courseComplete').uncheck();assert.equal(await page.locator('#certificateReady').isChecked(),false);assert.equal(await page.locator('#certificateReady').isDisabled(),true);
   await page.locator('#courseComplete').check();
   await page.getByRole('button',{name:'Reset checklist',exact:true}).click();
   await page.getByRole('button',{name:'Keep progress',exact:true}).click();assert.equal(await page.locator('#courseComplete').isChecked(),true);
   await page.getByRole('button',{name:'Reset checklist',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Reset checklist',exact:true}).click();
   assert.equal(await page.locator('#courseComplete').isChecked(),false);
   await page.getByRole('radio',{name:/I already have training/}).check();assert.equal(await page.locator('#qualifiedPath').isVisible(),true);assert.equal(await page.locator('#beginnerPath').isVisible(),false);
   await page.reload();assert.equal(await page.locator('#qualifiedPath').isVisible(),true);
   await page.getByRole('radio',{name:/I’m starting out/}).check();
   await page.getByRole('button',{name:'Night mode',exact:true}).click();assert.equal(await page.locator('body').getAttribute('class'),'night');
   const darkAxe=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).catch(async()=>{
     await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});return page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   });assert.deepEqual(darkAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`dark accessibility at ${width}`);
   if(width===390)await page.screenshot({path:'artifacts/counsellor-pathway/390-night.png',fullPage:true});
   await page.reload();assert.equal(await page.getByRole('button',{name:'Night mode',exact:true}).getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'Night mode',exact:true}).click();
   await page.getByText('Has my certificate been submitted here?',{exact:true}).click();assert.equal(await page.locator('details[open]').count(),1);
   assert.equal(await page.locator('#courseBtn').getAttribute('href'),'https://www.betherecertificate.org/');
   assert.match(await page.locator('#reviewContact').getAttribute('href'),/^mailto:speaaakout@gmail.com\?subject=/);
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.cp-conversation-one').evaluate(el=>getComputedStyle(el).animationName),'none');
   assert.deepEqual(errors,[],`page errors at ${width}`);assert.deepEqual(writes,[],`unexpected submission at ${width}`);
   reports.push({width,checklist:true,routes:true,reset:true,nightMode:true,reducedMotion:true,axeViolations:0,submissions:0});await context.close();
  }
  for(const fixture of ['blocked','corrupt','legacy']){
   const context=await browser.newContext({serviceWorkers:'block'});
   await context.addInitScript(fixture=>{
    if(fixture==='blocked')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}});
    if(fixture==='corrupt')localStorage.setItem('mc_counsellor_pathway_v2','{broken');
    if(fixture==='legacy'){localStorage.setItem('mc_counsellor_course_done','1');localStorage.setItem('mc_cert_uploaded_name','synthetic.pdf');localStorage.setItem('mc_counsellor_exam_last','{broken');}
   },fixture);
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+path);
   await page.locator('#beginnerPath').waitFor({state:'visible'});
   if(fixture==='legacy'){assert.equal(await page.locator('#courseComplete').isChecked(),true);assert.equal(await page.locator('#certificateReady').isChecked(),false);assert.equal((await page.locator('body').innerText()).includes('synthetic.pdf'),false);}
   if(fixture==='blocked'){await page.locator('#courseComplete').check();assert.match(await page.locator('#storageStatus').innerText(),/cannot save/);}
   assert.deepEqual(errors,[]);await context.close();reports.push({fixture,passed:true});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false});const page=await nojs.newPage();await page.goto(base+path);assert.equal(await page.locator('#courseBtn').isVisible(),true);assert.equal(await page.locator('#qualifiedPath').isVisible(),true);await nojs.close();
  // The guide and its interactions can be revisited offline after caching.
  const offline=await browser.newContext({serviceWorkers:'allow'}),offlinePage=await offline.newPage();await offlinePage.goto(base+'/');await offlinePage.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
  await offline.setOffline(true);await offlinePage.goto(base+path);await offlinePage.getByRole('heading',{name:/Learn to listen/}).waitFor();await offlinePage.locator('#courseComplete').check();await offline.close();
  await writeFile('artifacts/counsellor-pathway/results.json',JSON.stringify({reports,noJavaScriptLinks:true,offlineGuide:true},null,2));
  console.log('PASS counsellor pathway — 5 widths, light/dark accessibility, progress, reset, route switching, storage denial/corruption, legacy migration, no-JS links and offline guide.');
 }finally{if(browser)await browser.close();server.kill('SIGTERM')}
}
run().catch(e=>{console.error(e);process.exitCode=1});
