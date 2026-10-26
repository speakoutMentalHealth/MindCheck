/* Current guide regression: age-gated prepared guidance and My Buddy routing. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process'),net=require('node:net');
(async()=>{const server=spawn('python3',['-m','http.server','8799','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
try{
 for(let n=0;n<50;n++){try{await new Promise((r,j)=>{const s=net.connect(8799,'127.0.0.1');s.on('connect',()=>{s.end();r()});s.on('error',j)});break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch();const origin='http://127.0.0.1:8799/';
 for(const width of [320,390,1280]){
  const c=await browser.newContext({viewport:{width,height:740},serviceWorkers:'block'}),calls=[];
  await c.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
  await c.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',r=>{calls.push(r.request().postData());return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'prepared',answer:'Prepared guidance.'})})});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(origin+'guide.html');await p.waitForURL('**/age-entry.html');
  await p.locator('[data-choice="adult"]').click();await p.locator('#birthdate').fill('1990-04-01');await p.locator('#continue').click();await p.waitForURL('**/index.html');
  await p.goto(origin+'guide.html?topic=mood');await p.locator('#mcGuideAnswer').waitFor({state:'visible'});
  assert((await p.locator('#mcGuideAnswer').innerText()).trim().length>20,'prepared answer present');
  assert.equal(calls.length,0,'guide must not auto-send requests');
  await p.goto(origin+'index.html');await p.locator('.mc-ai-guide-entry').click();await p.waitForURL('**/guide.html');
  await p.goto(origin+'index.html?section=moodSection');await p.waitForURL('**/daily-life.html');
  assert(await p.getByText('My Buddy',{exact:true}).first().isVisible(),'mood entry opens My Buddy');
  assert.equal(calls.length,0,'navigation must not send wellbeing data');
  assert.deepEqual(errors,[]);await c.close();console.log('PASS guide '+width+': age gate, prepared answer, no automatic AI requests, My Buddy route');
 }
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
