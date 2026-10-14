/* Browser-based regression tests for the MindCheck public UI.
 * Run with: npm install --no-save playwright@1.56.1 && npx playwright install chromium && node scripts/browser-smoke.cjs
 * Tests run against a local static server and never submit a screening or personal data. */
const { chromium, devices } = require('playwright');
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
      {name:'small Android phone',viewport:{width:360,height:780},isMobile:true,hasTouch:true},
      {name:'iPhone-size viewport',viewport:{width:390,height:844},isMobile:true,hasTouch:true},
      {name:'tablet',viewport:{width:820,height:1180},hasTouch:true},
      {name:'desktop',viewport:{width:1366,height:900}}
    ];
    for(const setup of setups){
      const context=await browser.newContext({...setup,serviceWorkers:'block',reducedMotion:'no-preference'});
      const page=await context.newPage();const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
      await page.locator('#startBtn').click();
      await page.locator('.tbtn.live[data-lang="en"]').click();
      await page.waitForTimeout(250);
      assert.equal(await page.locator('#mcSmartWellness').count(),0,'redundant suggestion section returned');
      assert.equal(await page.locator('#mcJourneyChallengeList .mc-journey-task').count(),4,'today should have four challenges');
      const appWidth=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:window.innerWidth}));
      assert(appWidth.w<=appWidth.viewport+2,setup.name+' has horizontal overflow '+JSON.stringify(appWidth));
      // Validate breathing works, countdown changes and heart stays centered.
      const stage=page.locator('.mc-breathing-stage'),heart=page.locator('#mcBreathingCircle');
      const center=async()=>{let a=await stage.boundingBox(),b=await heart.boundingBox();assert(a&&b,setup.name+' missing breathing geometry');let dx=Math.abs((a.x+a.width/2)-(b.x+b.width/2));assert(dx<3,setup.name+' heart off-center by '+dx)};
      await center();
      await page.locator('#mcBreathingStart').click();
      await page.waitForTimeout(1200);
      await center();
      let s1=await heart.evaluate(el=>getComputedStyle(el).transform);
      await page.waitForTimeout(1250);
      let s2=await heart.evaluate(el=>getComputedStyle(el).transform);
      assert.notEqual(s1,s2,setup.name+' breathing heart did not animate');
      await page.locator('#mcBreathingStart').click();
      assert.equal(await page.locator('#mcBreathingStart').innerText(),'Resume');
      await page.locator('#mcBreathingReset').click();
      assert.equal(await page.locator('#mcBreathingProgress').innerText(),'0 / 3');
      // Opening tips should show a translated tip; save/remove controls remain available.
      await page.locator('#goTips').click();
      assert((await page.locator('#tipText').innerText()).length>10,'missing wellness tip');
      assert(await page.locator('#tipSaveBtn').isVisible(),'Save tip missing');
      await page.locator('#tipSaveBtn').click();
      assert((await page.locator('#savedTipsList li').count())>=1,'saved tips missing');
      await page.locator('#mcChangeLanguage').click();
      await page.locator('.tbtn.live[data-lang="fr"]').click();
      await page.locator('#goTips').click();
      assert.equal(await page.evaluate(()=>localStorage.getItem('mc_lang')),'fr');
      assert((await page.locator('#tipText').innerText()).length>10,'translated tip is empty');
      assert.deepEqual(errors,[],setup.name+' JavaScript errors: '+errors.join('; '));
      await context.close();
      process.stdout.write('PASS '+setup.name+' — layout, breathing, challenges, tips, language switching\n');
    }
  } finally {if(browser)await browser.close();server.kill('SIGTERM')}
}
run().catch(err=>{console.error(err);process.exitCode=1});
