/* Local home layout and modal continuity checks; no real health submissions. */
const {chromium}=require('playwright');const assert=require('node:assert/strict');const {spawn}=require('node:child_process'),net=require('node:net');
(async()=>{let browser;const server=spawn('python3',['-m','http.server','8775','--bind','127.0.0.1'],{stdio:'ignore'});
try{
 for(let n=0;n<40;n++){try{await new Promise((r,j)=>{const s=net.connect(8775,'127.0.0.1');s.on('connect',()=>{s.end();r();});s.on('error',j);});break}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true});
 for(const [width,height] of [[320,568],[360,640],[390,664],[430,740],[1280,900]]){
  const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
  await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8775/')?r.continue():r.abort());
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8775/');await page.locator('body.mc-home-compact').waitFor();
  const welcomeSize=await page.evaluate(()=>({overflow:document.documentElement.scrollHeight-innerHeight,width:document.documentElement.scrollWidth}));
  assert(welcomeSize.width<=width+2,'welcome horizontal overflow');
  if(width<=430)assert(welcomeSize.overflow<=60,'welcome excessive scroll '+JSON.stringify({width,height,...welcomeSize}));
  const action=await page.locator('.mc-primary-action').boundingBox();assert(action.y+action.height<=height,'primary action above fold');
  if(width===390)await page.waitForTimeout(350);
  if(width===390)await page.screenshot({path:'/tmp/mc-compact-welcome.png'});
  await page.locator('.mc-primary-action').click();await page.locator('#moodSection.active').waitFor();
  await page.locator('[data-mc-nav-target="homeSection"]').click();await page.locator('#homeSection.active').waitFor();
  const homeSize=await page.evaluate(()=>({overflow:document.documentElement.scrollHeight-innerHeight,width:document.documentElement.scrollWidth}));
  if(width<=430)assert(homeSize.overflow<=60,'dashboard excessive scroll '+JSON.stringify({width,height,...homeSize}));
  for(const id of ['mcOpenBreathing','mcOpenJourney']){const b=await page.locator('#'+id).boundingBox();assert(b.y+b.height<height-65,'home tools above navigation');}
  if(width===390)await page.waitForTimeout(350);
  if(width===390)await page.screenshot({path:'/tmp/mc-compact-home.png'});
  await page.locator('#mcOpenBreathing').click();assert(await page.locator('#mcHomeSheet').isVisible());
  assert(await page.locator('#mcLanguageSelect').isVisible());
  await page.waitForTimeout(350);
  const sheetLayout=await page.evaluate(()=>{const bar=document.getElementById('mcLanguageBar').getBoundingClientRect(),head=document.querySelector('.mc-home-sheet-head').getBoundingClientRect(),title=document.getElementById('mcBreathingTitle').getBoundingClientRect();return {bar:bar.bottom,headTop:head.top,headBottom:head.bottom,title:title.top};});
  assert(Math.abs(sheetLayout.headTop-sheetLayout.bar)<3,'sheet header follows language row without duplicated space');
  assert(sheetLayout.title>=sheetLayout.headBottom,'breathing title is not hidden by sheet header');
  await page.locator('#mcLanguageSelect').selectOption('fr');
  await page.locator('#mcBreathingStart').click();await page.waitForTimeout(300);
  await page.locator('#mcHomeSheetClose').click();assert.equal(await page.locator('#mcBreathing').getAttribute('data-breath-state'),'paused','closing breathing pauses session');
  assert.equal(await page.evaluate(()=>document.getElementById('mcLanguageBar').parentElement===document.body),true,'language returns to global header');
  await page.locator('#mcOpenBreathing').click();assert.equal(await page.locator('#mcBreathingStart').innerText(),'Reprendre');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>document.getElementById('mcLanguageBar').parentElement===document.body);assert.equal(await page.locator('#mcHomeSheet').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement.id),'mcOpenBreathing','Escape restores trigger focus');
  await page.locator('#mcOpenJourney').click();assert.equal(await page.locator('#mcBreathing').isVisible(),false);assert(await page.locator('#mcJourney .mc-journey-stats').isVisible());
  await page.locator('#mcHomeSheetClose').click();
  for(const lang of ['ha','ig','yo','pcm','fr','en']){
   await page.locator('#mcLanguageSelect').selectOption(lang);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert.equal(overflow,false,'translated home width '+lang);
   if(width>=360&&width<=430){const extra=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);assert(extra<=60,'translated home excessive scroll '+lang+' '+extra);}
  }
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const violations=await page.evaluate(async()=>(await axe.run({rules:{region:{enabled:false}}})).violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(violations,[]);
  if(width===390){await page.evaluate(()=>document.documentElement.style.fontSize='150%');await page.locator('#mcOpenBreathing').scrollIntoViewIfNeeded();assert(await page.locator('#mcOpenBreathing').isVisible(),'tools stay reachable with enlarged text');}
  assert.deepEqual(errors,[]);console.log('PASS compact home '+width+'x'+height+'; welcome scroll '+welcomeSize.overflow+'px, home scroll '+homeSize.overflow+'px; tools, language, pause/resume, Escape focus and accessibility');
  await ctx.close();
 }
}finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
