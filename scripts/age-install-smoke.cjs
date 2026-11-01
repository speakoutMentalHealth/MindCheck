/* PWA installation on the age-selection front door, with no production writes. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {readFileSync}=require('node:fs');
const port=8873,origin='http://127.0.0.1:'+port+'/';
async function ready(){
 for(let i=0;i<80;i++){
  try{const r=await fetch(origin+'age-entry.html');if(r.ok)return;}catch(_){}
  await new Promise(resolve=>setTimeout(resolve,90));
 }
 throw new Error('Local static server unavailable');
}
(async()=>{
 const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
 let browser;
 try{
  await ready();browser=await chromium.launch({headless:true});
  const manifest=JSON.parse(readFileSync('manifest.webmanifest','utf8'));
  assert.equal(manifest.start_url,'./age-entry.html');
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.icons.some(x=>x.sizes==='192x192'),true);
  for(const width of [320,390]){
   const ctx=await browser.newContext({
     viewport:{width,height:844},serviceWorkers:'block',
     userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
   });
   const page=await ctx.newPage();
   await page.goto(origin+'age-entry.html',{waitUntil:'domcontentloaded'});
   await page.locator('[data-mc-launch-skip]').click();
   await page.locator('#mcLaunchIntro').waitFor({state:'hidden'});
   assert.equal(await page.locator('#mcAgeInstall').isVisible(),true,'Install CTA visible');
   const placement=await page.evaluate(()=>{
     const buttons=document.querySelector('.choices').getBoundingClientRect();
     const card=document.querySelector('#mcAgeInstallCard').getBoundingClientRect();
     return {below:card.top>=buttons.bottom-2,within:card.right<=innerWidth+2};
   });
   assert.equal(placement.below,true,'Install button must be immediately below age choices');
   assert.equal(placement.within,true,'Install card fits mobile width');
   await page.locator('#mcAgeInstall').click();
   assert.equal(await page.locator('#mcAgeInstallDialog').isVisible(),true);
   assert.match(await page.locator('#mcAgeInstallSteps').innerText(),/Safari/);
   assert.match(await page.locator('#mcAgeInstallSteps').innerText(),/Add to Home Screen/);
   await page.locator('[data-install-close]').click();
   assert.equal(await page.locator('#mcAgeInstallDialog').isVisible(),false);
   await page.locator('[data-choice="adult"]').click();
   assert.equal(await page.locator('#age-form').isVisible(),true,'DOB form unaffected');
   await ctx.close();
  }
  const ctx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  const page=await ctx.newPage();
  await page.goto(origin+'age-entry.html',{waitUntil:'domcontentloaded'});
  await page.locator('[data-mc-launch-skip]').click();
  await page.locator('#mcLaunchIntro').waitFor({state:'hidden'});
  // The platform may offer an install event; the browser user still approves.
  await page.evaluate(()=>{
    const e=new Event('beforeinstallprompt',{cancelable:true});
    e.prompt=async()=>{window.__pwaPromptInvoked=true;};
    e.userChoice=Promise.resolve({outcome:'accepted'});
    window.dispatchEvent(e);
  });
  await page.locator('#mcAgeInstall').click();
  assert.equal(await page.evaluate(()=>window.__pwaPromptInvoked),true,'Native prompt invoked if supported');
  await ctx.close();
  console.log('PASS: visible PWA install CTA, iPhone Safari guidance, Android-capable native prompt, and age routing.');
 }finally{await browser?.close();server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
