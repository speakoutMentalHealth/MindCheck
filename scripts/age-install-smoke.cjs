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
  for(const [width,height] of [[320,480],[320,568],[390,600],[390,844],[430,740]]){
   const ctx=await browser.newContext({
     viewport:{width,height},serviceWorkers:'block',
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
   assert.equal(await page.locator('#age-form').isVisible(),true,'DOB step is visible');
   assert.equal(await page.locator('#mcAgeInstallCard').isVisible(),false,'Install card leaves the age-confirmation step');
   assert.equal(await page.locator('.choices').isVisible(),false,'Large age tiles leave the confirmation step');
   assert.equal(await page.locator('#mcAgeSelectedLabel').innerText(),'18+ Adults');
   const layout=await page.evaluate(()=>{
     const r=document.getElementById('continue').getBoundingClientRect();
     const d=document.getElementById('birthdate').getBoundingClientRect();
     return {
       scrollY:window.scrollY,
       top:r.top,
       bottom:r.bottom,
       dateBottom:d.bottom,
       height:window.innerHeight,
       horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth+2,
       focus:document.activeElement?.id
     };
   });
   assert.equal(layout.scrollY,0,'Confirmation screen must reset scrolling');
   assert.equal(layout.horizontalOverflow,false,'Confirmation form must fit phone width');
   assert(layout.top>=0 && layout.bottom<=layout.height-4,
     'Continue must be on screen without scrolling at '+width+'x'+height+': '+JSON.stringify(layout));
   assert(layout.dateBottom<layout.top,'Date field must appear before Continue');
   assert.equal(layout.focus,'mcAgeFormTitle','Focus heading rather than opening phone date picker');
   await page.locator('#mcAgeChange').click();
   assert.equal(await page.locator('#age-form').isVisible(),false,'Change category returns to two age cards');
   assert.equal(await page.locator('.choices').isVisible(),true,'Both categories reappear');
   assert.equal(await page.locator('#mcAgeInstallCard').isVisible(),true,'Download option returns to selection');
   await page.locator('[data-choice="youth"]').click();
   assert.equal(await page.locator('#mcAgeSelectedLabel').innerText(),'Under 18');
   assert.equal(await page.locator('#continue').isVisible(),true);
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
