/* Browser regression: the portfolio-style intro must last ~15 seconds
 * even when iOS prefers reduced motion. No personal data leaves localhost. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const net = require('node:net');
const port = 8815;
const origin = 'http://127.0.0.1:' + port + '/';

async function serverReady() {
  for(let i = 0; i < 100; i++) {
    try {
      await new Promise((resolve,reject) => {
        const socket = net.connect(port, '127.0.0.1');
        socket.once('connect', () => { socket.destroy(); resolve(); });
        socket.once('error', reject);
      });
      return;
    } catch (_) { await new Promise(resolve => setTimeout(resolve, 80)); }
  }
  throw Error('Local MindCheck server did not start');
}

(async () => {
  const server = spawn('python3', ['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  let browser;
  try {
    await serverReady();
    browser = await chromium.launch({headless:true});
    const context = await browser.newContext({
      viewport:{width:390,height:844},
      reducedMotion:'reduce',
      serviceWorkers:'block'
    });
    const page = await context.newPage();
    await page.goto(origin + 'age-entry.html', {waitUntil:'domcontentloaded'});
    const intro = page.locator('#mcLaunchIntro');
    assert.equal(await intro.isVisible(), true, 'Reduced Motion: opening must show');
    await page.waitForTimeout(900);
    assert.equal(await intro.isVisible(),true,'Reduced motion: intro still visible');
    const gentleAnimations=await page.locator('.mc-launch-prelude').evaluate(el=>el.getAnimations().length);
    assert(gentleAnimations>0,'Reduced motion: a gentle crossfade must be scheduled');
    await page.waitForTimeout(4700);
    const gentle=await page.evaluate(()=>({
      word:Number(getComputedStyle(document.querySelector('.mc-launch-prelude')).opacity),
      panel:Number(getComputedStyle(document.querySelector('.mc-launch-inner')).opacity)
    }));
    assert(gentle.word<0.15&&gentle.panel>0.8,
      'Reduced motion: wordmark must give way to the logo and message');
    await page.waitForTimeout(5000);
    assert.equal(await intro.isVisible(),true,'15-second intro should still show after 10 seconds');
    assert.match(await page.locator('#mcLaunchDescription').innerText(),/Towards a sound mind and growth/);
    await intro.waitFor({state:'hidden',timeout:7000});
    const elapsed=await page.evaluate(()=>performance.now());
    assert(elapsed>=14000,'Intro dismissed before 14 seconds: '+elapsed+'ms');
    assert(elapsed<19000,'Intro did not dismiss after 15 seconds: '+elapsed+'ms');

    // DOB handoff must skip the second intro before it is ever painted.
    await page.locator('[data-choice="youth"]').click();
    await page.locator('#birthdate').fill('2014-07-01');
    await page.locator('#continue').click();
    await page.waitForURL('**/youth.html');
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('mc-launch-handoff')),true);
    assert.equal(await page.locator('#mcLaunchIntro').isVisible(),false,'Youth handoff must not flash');
    assert.equal(await page.locator('#mcLaunchIntro').evaluate(el=>el.hidden),true,'Youth handoff should be hidden by code');

    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await intro.isVisible(),true,'Refreshing youth must replay the full intro');
    await page.waitForTimeout(950);
    assert.equal(await intro.isVisible(),true,'Reduced Motion youth refresh must not flash');
    await page.locator('[data-mc-launch-skip]').click();
    await intro.waitFor({state:'hidden'});
    assert.equal(await page.locator('#main-content').isVisible(),true);

    await context.close();

    // Test the actual unveiling instead of assuming a static splash timer.
    const full=await browser.newContext({viewport:{width:390,height:844},
      reducedMotion:'no-preference',serviceWorkers:'block'});
    const animated=await full.newPage();
    await animated.goto(origin+'age-entry.html',{waitUntil:'domcontentloaded'});
    await animated.waitForTimeout(950);
    const early=await animated.evaluate(()=>{
      const prelude=document.querySelector('.mc-launch-prelude');
      const logo=document.querySelector('.mc-launch-logo');
      const panel=document.querySelector('.mc-launch-inner');
      const ring=document.querySelector('.mc-launch-ring');
      return {
        wordAnimations:prelude.getAnimations().length,
        panelDuration:panel.getAnimations().some(a=>a.effect?.getTiming().duration===15000),
        logoDuration:logo.getAnimations().some(a=>a.effect?.getTiming().duration===15000),
        ringTransform:getComputedStyle(ring).transform
      };
    });
    assert(early.wordAnimations>0&&early.panelDuration&&early.logoDuration,
      'Full motion: intro and logo must use 15-second animated storyboard');
    await animated.waitForTimeout(850);
    const ringAfter=await animated.locator('.mc-launch-ring').first()
      .evaluate(el=>getComputedStyle(el).transform);
    assert.notEqual(ringAfter,early.ringTransform,'Orbital ring must visibly move');
    await animated.waitForTimeout(2400);
    const partial=await animated.locator('.mc-launch-logo')
      .evaluate(el=>getComputedStyle(el).clipPath);
    assert(partial!=='none','Logo must have an animated unveiling mask');
    await animated.waitForTimeout(2800);
    const revealed=await animated.locator('.mc-launch-logo')
      .evaluate(el=>getComputedStyle(el).clipPath);
    assert.notEqual(revealed,partial,'SpeakOut logo must be progressively unveiled');
    assert.equal(await animated.locator('#mcLaunchIntro').isVisible(),true);
    await animated.waitForTimeout(3200);
    assert.equal(await animated.locator('#mcLaunchIntro').isVisible(),true,
      'Closing message must stay visible beyond the original 8.5-second duration');
    assert.equal(await animated.locator('.mc-launch-footnote a').getAttribute('href'),
      'https://speakoutmentalhealth.org/');
    assert.match(await animated.locator('#mcLaunchDescription').innerText(),
      /Towards a sound mind and growth/);
    await animated.locator('[data-mc-launch-skip]').click();
    await animated.locator('#mcLaunchIntro').waitFor({state:'hidden'});
    await full.close();
    console.log('PASS: 15-second cinematic intro, real logo unveiling and rotating rings, gentler reduced-motion fade, 10-second message hold check, age routing, refresh and Skip.');
  } finally {
    if(browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch(err => { console.error(err); process.exitCode=1; });
