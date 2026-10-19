/* Local-only localization checks. No live health answers or external form submissions. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),{spawn}=require('node:child_process');
(async()=>{
 const source=fs.readFileSync('index.html','utf8');
 const tips=vm.runInNewContext(source.match(/const TIPS = (\[[\s\S]*?\n    \]);/)[1]);
 assert.equal(tips.length,120);assert.equal(new Set(tips.map(t=>t.key)).size,120,'every tip needs a unique translation key');
 const server=spawn('python3',['-m','http.server','8771','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
 try{
  for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:8771/');break}catch{await new Promise(r=>setTimeout(r,100));}}
  browser=await chromium.launch({headless:true});
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
   await context.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:8771/')?route.continue():route.abort());
   await context.addInitScript(()=>{window.sharedPayload=null;Object.defineProperty(navigator,'share',{value:async payload=>{window.sharedPayload=payload;}});});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const code of ['ha','ig','yo','pcm','fr']){
    await page.goto('http://127.0.0.1:8771/index.html?section=tipsSection');
    const key=await page.locator('#tipText').getAttribute('data-tip-key');
    await page.locator('#mcLanguageSelect').selectOption(code);
    assert.equal(await page.locator('#tipText').getAttribute('data-tip-key'),key,'switch preserves current tip');
    assert.equal(await page.locator('#tipText').innerText(),await page.evaluate(key=>MindCheckLocale.t(key),key));
    const missing=await page.evaluate(keys=>keys.filter(key=>!MindCheckLocale.t(key)||MindCheckLocale.t(key)===key),tips.map(t=>t.key));assert.deepEqual(missing,[],code+' missing tip translations');
    // Current tip, saved tip, share text and active screen all use the same locale.
    await page.locator('#tipSaveBtn').click();await page.locator('#tipSaveBtn').click();
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mc_tips_saved')));assert.equal(saved.length,1);assert.equal(saved[0].key,key);
    const before=await page.locator('#tipText').innerText();
    await page.locator('#mcLanguageSelect').selectOption('en');await page.locator('#mcLanguageSelect').selectOption(code);
    assert.equal(await page.locator('#savedTipsList .mc-saved-tip-content>span').first().innerText(),before);
    await page.locator('#tipShareBtn').click();assert.equal(await page.evaluate(()=>sharedPayload.text.split('\n')[0]),before);
    assert.equal(await page.locator('#tipStatus').innerText(),await page.evaluate(()=>MindCheckLocale.t('shareOpened')));
    await page.locator('#savedTipsList button').first().click();
    await page.goto('http://127.0.0.1:8771/assessment-centre.html');
    assert.equal(await page.locator('html').getAttribute('lang'),code);
    const coverage=await page.evaluate(()=>{
     const dict=MindCheckAssessmentTranslations[MindCheckLocale.current()];const en=Object.keys(MindCheckAssessmentTranslations.en);const walker=document.createTreeWalker(document.getElementById('assessmentMain'),NodeFilter.SHOW_TEXT);let node,left=[];
     while(node=walker.nextNode()){const text=node.textContent.replace(/\s+/g,' ').trim();if(en.includes(text)&&dict[text]!==text)left.push(text);}
     return left;
    });assert.deepEqual(coverage,[],code+' library text left in English');
    assert.equal(await page.locator('.ac-card').count(),8);
    await page.locator('[data-ac-filter="questionnaire"]').click();assert.equal(await page.locator('.ac-card:visible').count(),4);
    assert.equal(await page.locator('.ac-card a[href="adhd.html"]').getAttribute('href'),'adhd.html');
    if(width===390&&code==='fr'){await page.waitForTimeout(250);await page.screenshot({path:'/tmp/mc-assessment-localized.png',fullPage:true});}
    await page.locator('#mcLanguageSelect').selectOption('en');assert.equal(await page.locator('h1').innerText(),'Assessment Centre');
    await page.evaluate(()=>localStorage.clear());
   }
   assert.deepEqual(errors,[]);console.log('PASS '+width+'px: 5 translated languages, 120 tips each, live selection, keyed saves, deduplication, sharing, library coverage, filters and English restoration');

   await context.close();
  }
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
