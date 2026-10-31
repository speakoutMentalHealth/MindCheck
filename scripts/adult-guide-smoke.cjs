/* Independent adult-entry and guide privacy scenarios. All external calls blocked or mocked. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),{spawn}=require('node:child_process'),net=require('node:net');
(async()=>{let browser;const server=spawn('python3',['-m','http.server','8796','--bind','127.0.0.1'],{stdio:'ignore'});const origin='http://127.0.0.1:8796/';try{for(let n=0;n<50;n++){try{await new Promise((r,j)=>{const s=net.connect(8796,'127.0.0.1');s.on('connect',()=>{s.end();r()});s.on('error',j)});break}catch{await new Promise(r=>setTimeout(r,100))}}browser=await chromium.launch();
for(const [width,height] of [[320,568],[390,600],[430,740]]){
 const c=await browser.newContext({viewport:{width,height},serviceWorkers:'block'}),p=await c.newPage();let posts=0;
 await c.route('**/*',r=>{if(r.request().method()==='POST')posts++;return r.request().url().startsWith(origin)?r.continue():r.abort()});
 await c.route('**/js/guide-config.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.MindCheckGuideConfig={enabled:false,endpoint:""}'}));
 await p.goto(origin+'index.html');await p.waitForURL('**/age-entry.html');
 await p.locator('[data-choice="youth"]').click();await p.locator('#birthdate').fill('2012-04-01');await p.locator('#continue').click();await p.waitForURL('**/youth.html');
 assert.equal(posts,0);
 // A mismatched initial choice must still route by calculated age.
 await p.goto(origin+'age-entry.html');await p.locator('[data-choice="adult"]').click();await p.locator('#birthdate').fill('2012-04-01');await p.locator('#continue').click();await p.waitForURL('**/youth.html');
 assert.equal(await p.locator('#everyday .card').count(),4);await p.locator('[data-section-link="everyday"]').click();assert.equal(await p.locator('#everyday').isVisible(),true);await p.locator('.youth-language-tools summary').click();await p.locator('#mcYouthLanguage').selectOption('fr');assert.match(await p.locator('#everyday h2').innerText(),/habitudes/);assert.match(await p.locator('#everyday [data-youth-i18n="schoolBody"]').innerText(),/enseignant/);await p.locator('#mcYouthLanguage').selectOption('en');assert.match(await p.locator('#everyday h2').innerText(),/Little skills/);
 assert.equal(posts,0);
 await p.goto(origin+'guide.html');await p.waitForURL('**/age-entry.html');
 await p.locator('[data-choice="adult"]').click();await p.locator('#birthdate').fill('1990-04-01');await p.locator('#continue').click();await p.waitForURL('**/index.html');
 await p.goto(origin+'guide.html');await p.locator('#mcGuideTopics button').first().waitFor();
 assert.equal(await p.locator('#mcGuideTopics button').count(),6);assert.equal(await p.locator('#mcAdultWellnessTitle').count(),1);assert.equal(await p.locator('#mcAdultWellnessTitle + p + div article').count(),4);await p.locator('#mcLanguageSelect').selectOption('fr');await p.waitForFunction(()=>document.getElementById('mcAdultWellnessTitle').textContent.includes('adultes'));assert.match(await p.locator('[data-adult-i18n="sleepBody"]').innerText(),/caféine/);await p.locator('#mcLanguageSelect').selectOption('en');await p.waitForFunction(()=>document.getElementById('mcAdultWellnessTitle').textContent.includes('adults'));
 for(const b of await p.locator('#mcGuideTopics button').all()){await b.click();assert(await p.locator('#mcGuideAnswer').innerText());}
 assert.equal(await p.locator('#mcGuideAI').isVisible(),false);
 assert.match(await p.locator('#mcGuideAIStatus').innerText(),/not connected/);
 assert.equal(posts,0);
 await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 assert.deepEqual(await p.evaluate(async()=>(await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)),[]);
 await c.close();console.log('PASS DOB entry, youth isolation, adult guide and accessibility '+width);
}
for(const path of ['privacy.html','terms.html','suicide-support.html','kiddies.html']){
 const c=await browser.newContext({serviceWorkers:'block'}),p=await c.newPage();
 await p.goto(origin+path);assert.notEqual(new URL(p.url()).pathname,'/age-entry.html');await c.close();
}
console.log('PASS public policies and urgent support without age-entry redirect');
const ai=await browser.newContext({serviceWorkers:'block'});await ai.addInitScript(()=>{window.mcAdultEntryGranted=true;localStorage.setItem('mc_mood_history','PRIVATE FIXTURE')});await ai.addInitScript(()=>{window.MindCheckVerifiedAdultAccess={getToken:async()=> 'mockpayload.mocksignature'}});await ai.route('https://**/*',r=>r.abort());await ai.route('**/js/guide-config.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.MindCheckGuideConfig={enabled:true,endpoint:"https://mindcheck-guide.speakout-platform-api.workers.dev/"}'}));let submitted;await ai.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',async r=>{submitted=r.request().postDataJSON();await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'gemini',answer:'<script>PRIVATE FIXTURE</script> is displayed as text.'})})});const ap=await ai.newPage();await ap.goto(origin+'age-entry.html');await ap.locator('[data-choice="adult"]').click();await ap.locator('#birthdate').fill('1990-04-01');await ap.locator('#continue').click();await ap.waitForURL('**/index.html');await ap.goto(origin+'guide.html');await ap.locator('#mcGuideAI').click();await ap.locator('#mcGuideAIAnswer').waitFor({state:'visible'});assert.deepEqual(submitted,{question:'mood',language:'en',adult:true});assert.equal(await ap.locator('#mcGuideAIAnswer script').count(),0);await ai.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',r=>r.abort());await ap.reload();await ap.locator('#mcGuideAI').click();await ap.waitForFunction(()=>document.getElementById('mcGuideAIStatus').textContent.includes('unavailable'));assert(await ap.locator('#mcGuideAnswer').isVisible());for(const reason of ['region','quota','timeout','model','authorization']){await ai.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'prepared',answer:'Prepared public fact.',reason})}));await ap.locator('#mcGuideAI').click();await ap.waitForFunction(code=>document.getElementById('mcGuideAIStatus').textContent.includes('['+code+']'),reason);assert(await ap.locator('#mcGuideAnswer').isVisible());}await ai.close();console.log('PASS optional AI privacy contract, safe text rendering and failure fallback (mocked provider)');
const denied=await browser.newContext({serviceWorkers:'block'});let unauthorizedCalls=0;
await denied.route('https://**/*',r=>r.abort());
await denied.route('https://mindcheck-guide.speakout-platform-api.workers.dev/**',r=>{unauthorizedCalls++;return r.abort()});
const dp=await denied.newPage();await dp.goto(origin+'age-entry.html');await dp.locator('[data-choice="adult"]').click();await dp.locator('#birthdate').fill('1990-04-01');await dp.locator('#continue').click();await dp.waitForURL('**/index.html');await dp.goto(origin+'guide.html');await dp.locator('#mcGuideAI').click();
await dp.waitForFunction(()=>document.getElementById('mcGuideAIStatus').textContent.includes('[authorization]'));
assert.equal(unauthorizedCalls,0);assert(await dp.locator('#mcGuideAnswer').isVisible());assert.equal(await dp.locator('#mcGuideAIAnswer').isVisible(),false);await denied.close();console.log('PASS missing adult token keeps prepared guidance without provider request');
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
