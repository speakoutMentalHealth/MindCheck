/* Isolated local UI checks; no real forms or external services are submitted. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {readdirSync}=require('node:fs');
(async()=>{
 const server=spawn('python3',['-m','http.server','8768','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
 try{
  for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:8768/index.html');break}catch{await new Promise(r=>setTimeout(r,100));}}
  browser=await chromium.launch({headless:true});
  const pages=readdirSync('.').filter(p=>p.endsWith('.html')).concat('certificate/index.html');
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
   await context.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:8768/')?route.continue():route.abort());
   const page=await context.newPage();
   for(const path of pages){
    await page.goto('http://127.0.0.1:8768/'+path,{waitUntil:'domcontentloaded'});
    const select=page.locator('#mcLanguageSelect');await select.waitFor({state:'visible'});
    assert.equal(await select.locator('option').count(),6,path+' six languages');
    const box=await select.boundingBox();assert(box.y>=0&&box.y+box.height<=160&&box.x>=0&&box.x+box.width<=width,path+' top control fits '+width);
    await select.selectOption('yo');assert.equal(await page.evaluate(()=>localStorage.getItem('mc_lang')),'yo');
    await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
    const scrolled=await select.boundingBox();assert(scrolled.y>=0&&scrolled.y<160,path+' stays visible');
    await select.selectOption('en');
   }
   await page.goto('http://127.0.0.1:8768/index.html?section=moodSection');
   const activeBefore=await page.locator('section.active').first().getAttribute('id');
   await page.locator('#mcLanguageSelect').selectOption('fr');
   assert.equal(await page.locator('section.active').first().getAttribute('id'),activeBefore,'language must preserve current step');
   await page.goto('http://127.0.0.1:8768/assessment-centre.html');
   assert.equal(await page.locator('#mcLanguageSelect').inputValue(),'fr','cross-page selection retained');
   assert.equal(await page.locator('html').getAttribute('lang'),'en','untranslated standalone source language retained');
   await page.reload();assert.equal(await page.locator('#mcLanguageSelect').inputValue(),'fr');
   console.log('PASS '+pages.length+' pages at '+width+'px; top visibility, scrolling, switching, persistence and source language');
   if(width===390){await page.screenshot({path:'/tmp/mc-language-mobile.png',fullPage:false});}
   await context.close();
  }
  const blocked=await browser.newContext({serviceWorkers:'block'});await blocked.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=function(){throw Error('storage unavailable')};});
  const p=await blocked.newPage();await p.goto('http://127.0.0.1:8768/index.html');await p.locator('#mcLanguageSelect').selectOption('ha');assert.equal(await p.locator('#mcLanguageSelect').inputValue(),'ha');await blocked.close();
  console.log('PASS language switching remains usable with blocked storage');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
