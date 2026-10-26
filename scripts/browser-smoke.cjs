/* Browser-based regression tests for the MindCheck public UI.
 * Run with: npm install --no-save playwright@1.56.1 && npx playwright install chromium && node scripts/browser-smoke.cjs
 * Tests run against a local static server and never submit a screening or personal data. */
const { chromium, devices } = require('./adult-browser-fixture.cjs');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const net = require('node:net');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function run() {
  const server = spawn('python3', ['-m','http.server','8765','--bind','127.0.0.1'], {stdio:'ignore'});
  let browser;
  try {
    for (let n=0; n<40; n++) {try{await new Promise((resolve,reject)=>{let c=net.connect(8765,'127.0.0.1');c.on('connect',()=>{c.end();resolve()});c.on('error',reject)});break}catch(e){if(n===39)throw e;await sleep(250)}}
    browser=await chromium.launch({headless:true});
    const setups=[
      {name:'small 320px phone',viewport:{width:320,height:740},isMobile:true,hasTouch:true},
      {name:'small Android phone',viewport:{width:360,height:780},isMobile:true,hasTouch:true},
      {name:'iPhone-size viewport',viewport:{width:390,height:844},isMobile:true,hasTouch:true},
      {name:'tablet',viewport:{width:820,height:1180},hasTouch:true},
      {name:'desktop',viewport:{width:1366,height:900}}
    ];
    // PWA install metadata is a baseline, not proof of native device behavior.
    const manifestResponse=await fetch('http://127.0.0.1:8765/manifest.webmanifest');
    assert(manifestResponse.ok,'PWA manifest missing');
    const manifest=await manifestResponse.json();
    assert.equal(manifest.display,'standalone','PWA must launch standalone');
    assert(manifest.name && manifest.short_name && manifest.start_url && manifest.scope,'PWA metadata incomplete');
    assert(manifest.icons.some(icon=>icon.sizes==='192x192'),'192px PWA icon missing');
    assert(manifest.icons.some(icon=>icon.sizes==='512x512'),'512px PWA icon missing');
    // PWA offline navigation: an uncached path must explain offline status,
    // never silently display the homepage under the wrong URL.
    {
      const offlineContext=await browser.newContext({serviceWorkers:'allow'});
      const offlinePage=await offlineContext.newPage();
      await offlinePage.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
      await offlinePage.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:15000});
      const fallbackCached=await offlinePage.evaluate(async()=>{
        const hit=await caches.match('./offline.html');
        return !!hit && (await hit.text()).includes("You're offline");
      });
      assert(fallbackCached,'branded offline fallback not available in the installed app cache');
      await offlineContext.setOffline(true);
      await offlinePage.goto('http://127.0.0.1:8765/assessment-centre.html',{waitUntil:'domcontentloaded'});
      assert.match(await offlinePage.locator('h1').first().innerText(),/assessment centre/i,'cached assessment centre unavailable offline');
      await offlineContext.close();
    }
    {
      const denied=await browser.newContext({serviceWorkers:'block'});
      await denied.addInitScript(()=>{Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('Storage blocked','SecurityError')}});});
      const deniedPage=await denied.newPage();const deniedErrors=[];
      deniedPage.on('pageerror',e=>deniedErrors.push(e.message));
      await deniedPage.goto('http://127.0.0.1:8765/daily-life.html',{waitUntil:'domcontentloaded'});
      await deniedPage.locator('.buddy-mood').nth(1).click();
      assert.equal(await deniedPage.locator('.buddy-mood[aria-pressed="true"]').count(),1,'My Buddy remains usable when local storage is blocked');
      assert.deepEqual(deniedErrors,[],'storage denial must not break app');
      await denied.close();
    }
    {
      const reporting=await browser.newContext({serviceWorkers:'block'});const rp=await reporting.newPage();
      let payload=null;
      await rp.route('https://script.google.com/**',async route=>{payload=new URLSearchParams(route.request().postData());await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})});});
      await rp.goto('http://127.0.0.1:8765/report.html',{waitUntil:'domcontentloaded'});
      await rp.evaluate(()=>localStorage.setItem('mc_uid','synthetic-device-id-must-not-be-sent'));
      await rp.locator('#who').selectOption('myself');await rp.locator('#concernType').selectOption('other');
      await rp.locator('#details').fill('Synthetic QA only. No real person or incident.');await rp.locator('#allowContact').selectOption('no');
      await rp.locator('#submitBtn').click();await rp.locator('#msg').filter({hasText:'acknowledged'}).waitFor();
      assert.equal(payload.get('uid'),'anonymous','anonymous reports must not link mood history');
      assert(!payload.toString().includes('synthetic-device-id-must-not-be-sent'),'device identifier leaked');
      await rp.waitForTimeout(1800);assert(rp.url().endsWith('/report.html'),'receipt must remain visible');
      await reporting.close();
    }
    for(const setup of setups){
      const context=await browser.newContext({...setup,serviceWorkers:'block',reducedMotion:'no-preference'});
      const page=await context.newPage();const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
      const firstVisit=page.locator('.mc-front-door .mc-hero');
      assert(await firstVisit.isVisible(),setup.name+' redesigned public welcome missing');
      const frontDimensions=await firstVisit.boundingBox();
      assert(frontDimensions && frontDimensions.width>280,setup.name+' public welcome width invalid');
      const frontArtwork=page.locator('.mc-front-scene');
      assert(await frontArtwork.isVisible(),setup.name+' welcome artwork missing');
      await page.locator('.mc-front-door .mc-primary-action').click();
      await page.locator('#homeSection.active').waitFor();
      assert.equal(await page.locator('.mc-primary-action').innerText(),'My Mental Health Companion →',setup.name+' companion action label');
      // The adult dashboard was opened through the public Home route.
      // The homepage redesign must render visually and preserve the primary My Buddy action.
      const hero=page.locator('#homeSection .mc-dashboard-hero');
      assert(await hero.isVisible(),setup.name+' redesigned hero missing');
      assert((await hero.boundingBox()).width>=Math.min(280,setup.viewport.width*.7),setup.name+' redesigned hero collapsed');
      await page.locator('.mc-dashboard-main-action').click();
      await page.waitForURL('**/daily-life.html');
      assert(await page.locator('.buddy-mood').first().isVisible(),setup.name+' dashboard action must open My Buddy');
      await page.goto('http://127.0.0.1:8765/index.html?section=homeSection',{waitUntil:'domcontentloaded'});
      await page.locator('#homeSection.active').waitFor();
      assert.equal(await page.locator('.mc-front-door').isVisible(),false,setup.name+' first-visit promotional content persists in dashboard');
      await page.locator('#mcOpenBreathing').click();
      const breathColors=await page.locator('#mcBreathing').evaluate(el=>({title:getComputedStyle(el.querySelector('h4')).color,cue:getComputedStyle(el.querySelector('.mc-breathing-cue')).color}));
      assert.notEqual(breathColors.title,'rgb(255, 255, 255)',setup.name+' breathing heading invisible');
      assert.notEqual(breathColors.cue,'rgb(255, 255, 255)',setup.name+' breathing cue invisible');
      assert.equal(await page.locator('#mcSmartWellness').count(),0,'redundant suggestion section returned');
      assert.equal(await page.locator('#mcJourneyChallengeList .mc-journey-task').count(),4,'today should have four challenges');
      const appWidth=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:window.innerWidth}));
      assert(appWidth.w<=appWidth.viewport+2,setup.name+' has horizontal overflow '+JSON.stringify(appWidth));
      // Validate breathing works, countdown changes and heart stays centered.
      const stage=page.locator('.mc-breathing-stage'),heart=page.locator('#mcBreathingCircle');
      const center=async()=>{let a=await stage.boundingBox(),b=await heart.boundingBox();assert(a&&b,setup.name+' missing breathing geometry');let dx=Math.abs((a.x+a.width/2)-(b.x+b.width/2));assert(dx<3,setup.name+' heart off-center by '+dx)};
      await center();
      const timerBounds=await page.locator('.mc-breathing-countdown').boundingBox();
      const heartBounds=await heart.boundingBox();
      assert(timerBounds.y>heartBounds.y+heartBounds.height,'timer must not obscure heart');
      assert.equal(await page.locator('.mc-breath-cycle-dots i').count(),3,'three cycle markers');
      await page.locator('#mcBreathingStart').click();
      await page.waitForTimeout(1200);
      await center();
      let s1=await heart.evaluate(el=>({transform:getComputedStyle(el).transform,scale:el.style.getPropertyValue('--mc-breath-scale'),width:el.getBoundingClientRect().width}));
      await page.waitForTimeout(1250);
      let s2=await heart.evaluate(el=>({transform:getComputedStyle(el).transform,scale:el.style.getPropertyValue('--mc-breath-scale'),width:el.getBoundingClientRect().width}));
      assert.notEqual(s1.scale,s2.scale,setup.name+' breathing scale variable did not animate');
      assert(Math.abs(s2.width-s1.width)>6,setup.name+' breathing heart did not visibly grow: '+JSON.stringify({s1,s2}));
      const beatSamples=[];
      for(let i=0;i<12;i++){
        beatSamples.push(await page.locator('.mc-breathing-heart-svg').evaluate(el=>el.style.getPropertyValue('--mc-heart-beat')));
        await page.waitForTimeout(180);
      }
      assert(new Set(beatSamples).size>1,'double heartbeat must visibly change within breath');
      await page.locator('#mcBreathingStart').click();
      const frozenBeat=await page.locator('.mc-breathing-heart-svg').evaluate(el=>getComputedStyle(el).transform);
      const frozen=await heart.evaluate(el=>el.style.getPropertyValue('--mc-breath-scale'));
      await page.waitForTimeout(250);
      assert.equal(await heart.evaluate(el=>el.style.getPropertyValue('--mc-breath-scale')),frozen,'paused breathing must freeze');
      assert.equal(await page.locator('.mc-breathing-heart-svg').evaluate(el=>getComputedStyle(el).transform),frozenBeat,'pause must freeze heartbeat too');
      assert.equal(await page.locator('#mcBreathingStart').innerText(),'Resume');
      await page.locator('#mcBreathingReset').click();
      assert.equal(await page.locator('#mcBreathingProgress').innerText(),'0 / 3');
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.locator('#mcBreathingStart').click();
      await page.waitForTimeout(200);
      assert.equal(await page.locator('.mc-breathing-heart-svg').evaluate(el=>getComputedStyle(el).transform),'none','reduced motion disables heartbeat');
      await page.locator('#mcBreathingReset').click();
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.locator('#mcHomeSheetClose').click();
      // A synthetic daily check-in persists locally, once, without a cloud write.
      const checkinRequests=[];
      await page.route('https://script.google.com/**',async route=>{checkinRequests.push(route.request().url());await route.abort();});
      await page.locator('[data-mc-nav-target="moodSection"]').click();
      await page.waitForURL('**/daily-life.html');
      await page.locator('.buddy-mood').nth(1).click();
      assert.equal(await page.locator('.buddy-mood[aria-pressed="true"]').count(),1,'one mood selected');
      await page.locator('.buddy-mood').nth(2).click();
      assert.equal(await page.locator('.buddy-mood[aria-pressed="true"]').count(),1,'selecting another mood replaces the previous selection');
      assert.deepEqual(checkinRequests,[],'mood selection must never leave this device');
      await page.goto('http://127.0.0.1:8765/index.html?section=homeSection',{waitUntil:'domcontentloaded'});
      await page.locator('#homeSection.active').waitFor();
      // Opening tips should show a translated tip; save/remove controls remain available.
      await page.locator('[data-mc-nav-target="tipsSection"]').click();
      assert((await page.locator('#tipText').innerText()).length>10,'missing wellness tip');
      assert(await page.locator('#tipSaveBtn').isVisible(),'Save tip missing');
      const priorTip=await page.locator('#tipText').innerText();
      await page.locator('#tipCard').dispatchEvent('pointerdown',{pointerType:'touch',isPrimary:true,pointerId:1,clientX:200,clientY:120});
      await page.locator('#tipCard').dispatchEvent('pointerup',{pointerType:'touch',isPrimary:true,pointerId:1,clientX:100,clientY:125});
      assert.notEqual(await page.locator('#tipText').innerText(),priorTip,'swipe should advance the tip');
      await page.locator('#tipSaveBtn').click();
      assert((await page.locator('#savedTipsList li').count())>=1,'saved tips missing');
      assert.equal(await page.locator('#tipSaveBtn').getAttribute('aria-pressed'),'true','saved state accessible');
      await page.locator('#savedTipsList button').first().click();
      assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mc_tips_saved')).length),0,'saved tip removed');
      await page.locator('#tipsBackHome').click();
      await page.locator('#mcLanguageSelect').selectOption('fr');
      await page.locator('[data-mc-nav-target="tipsSection"]').click();
      assert.equal(await page.evaluate(()=>localStorage.getItem('mc_lang')),'fr');
      assert((await page.locator('#tipText').innerText()).length>10,'translated tip is empty');
      // Cross-page navigation: start on Assessment Centre, then use each
      // fixed bottom tab and assert the destination screen is actually active.
      for(const [label,target] of [['My Buddy','moodSection'],['Wellness','tipsSection'],['Support','helpSection'],['Awards','badgesSection'],['Home','homeSection']]){
        await page.goto('http://127.0.0.1:8765/assessment-centre.html',{waitUntil:'domcontentloaded'});
        const tab=page.locator(target==='moodSection'?'#mc-premium-tabs .mc-standalone-tab[href="daily-life.html"]':'#mc-premium-tabs .mc-standalone-tab[href*="'+target+'"]');
        await tab.click();
        if(target==='moodSection'){
          await page.waitForURL('**/daily-life.html');
          assert(await page.locator('.buddy-mood').first().isVisible(),setup.name+' My Buddy tab broken');
          assert.equal(await page.locator('#mc-premium-tabs [aria-current="page"]').count(),1,setup.name+' My Buddy active tab missing');
          assert.equal(await page.locator('#mc-premium-tabs a[aria-current="page"] .mc-tab-label').innerText(),'My Buddy');
        }else{
          await page.waitForFunction(id=>document.body.classList.contains('mc-stage-dashboard')&&document.getElementById(id)?.classList.contains('active'),target,{timeout:5000});
          assert.equal(await page.locator('#mc-premium-tabs [aria-current="page"]').count(),1,setup.name+' incorrect active tab '+label);
        }
      }
      // Library filters change visible pathways without removing their disclosures.
      await page.goto('http://127.0.0.1:8765/assessment-centre.html',{waitUntil:'domcontentloaded'});
      await page.locator('[data-ac-filter="questionnaire"]').click();
      assert.equal(await page.locator('.ac-card:visible').count(),4,'questionnaire filter');
      await page.locator('[data-ac-filter="guidance"]').click();
      assert.equal(await page.locator('.ac-card:visible').count(),4,'guidance filter');
      await page.locator('[data-ac-filter="all"]').click();
      assert.equal(await page.locator('.ac-card:visible').count(),8,'all pathways restored');
      // Visual layout audit on standalone screens at each viewport.
      for(const file of ['assessment-centre.html','pcl5-screening.html','adhd.html','audit-screening.html','clinician-referral-preparation.html']){
        await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded'});
        const metrics=await page.evaluate(()=>{
          const nav=document.getElementById('mc-premium-tabs');
          const main=document.querySelector('main');
          const rect=nav?.getBoundingClientRect();
          const bounds=main?.getBoundingClientRect();
          return {width:document.documentElement.scrollWidth,viewport:innerWidth,navVisible:!!rect&&rect.width>0&&rect.height>0,navBottom:rect?.bottom,screenHeight:innerHeight,contentBottom:bounds?.bottom,navTop:rect?.top};
        });
        assert(metrics.width<=metrics.viewport+3,setup.name+' '+file+' horizontal overflow: '+JSON.stringify(metrics));
        assert(metrics.navVisible,setup.name+' '+file+' missing fixed tabs');
        assert(Math.abs(metrics.navBottom-metrics.screenHeight)<28,setup.name+' '+file+' misplaced bottom tabs');
        assert(metrics.contentBottom>metrics.navTop,setup.name+' '+file+' unexpectedly short content');
      }
      // Mock official verifier responses: an 'ok' result for a different ID must be rejected.
      const cert=await context.newPage();
      await cert.route('https://script.google.com/**', async route=>{
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,cert_id:'MC-CERT-OTHER',name:'Test Record',score:80,date:'2026-01-01'})});
      });
      await cert.goto('http://127.0.0.1:8765/verify.html',{waitUntil:'domcontentloaded'});
      await cert.locator('#certInput').fill('MC-CERT-EXPECTED');
      await cert.locator('#verifyBtn').click();
      await cert.locator('#statusBox').getByText('Certificate not verified').waitFor();
      assert.equal(await cert.locator('#statusBox').getAttribute('class'),'status bad','certificate ID mismatch wrongly verified');
      await cert.close();
      assert.deepEqual(errors,[],setup.name+' JavaScript errors: '+errors.join('; '));
      await context.close();
      process.stdout.write('PASS '+setup.name+' — layout, breathing, challenges, tips, language switching\n');
    }
  } finally {if(browser)await browser.close();server.kill('SIGTERM')}
}
run().catch(err=>{console.error(err);process.exitCode=1});
