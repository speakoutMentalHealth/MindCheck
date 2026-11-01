/* Browser regression: the portfolio-style intro must last ~8.5 seconds
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
    assert.equal(await intro.isVisible(), true, 'Reduced Motion: not a brief flash');
    const gentleStart = await page.locator('.mc-launch-prelude').evaluate(el=>Number(getComputedStyle(el).opacity));
    assert(gentleStart > 0.5, 'Reduced Motion: wordmark must actually fade into view');
    await page.waitForTimeout(2200);
    assert.equal(await intro.isVisible(), true, 'Reduced Motion: stays visible after 3 seconds');
    const gentleEnd = await page.evaluate(()=>({
      word: Number(getComputedStyle(document.querySelector('.mc-launch-prelude')).opacity),
      panel: Number(getComputedStyle(document.querySelector('.mc-launch-inner')).opacity)
    }));
    assert(gentleEnd.word < 0.15 && gentleEnd.panel > 0.7,
      'Reduced Motion: staged wordmark-to-content crossfade must be visible');
    await page.waitForTimeout(2700);
    assert.equal(await intro.isVisible(), true, 'Extended intro must remain visible after roughly 6 seconds');
    assert.equal(await page.locator('.mc-launch-inner').isVisible(), true, 'Completed closing message should remain readable');
    await intro.waitFor({state:'hidden', timeout:4300});
    const elapsed = await page.evaluate(() => performance.now());
    assert(elapsed>=8000, 'Intro dismissed before eight seconds: '+elapsed+' ms');
    assert(elapsed<12000, 'Intro failed to exit automatically: '+elapsed+' ms');

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

    // The default mobile experience must show tangible movement, not just
    // an unchanged four-second logo. Assert real JS-driven animations run.
    const full = await browser.newContext({
      viewport:{width:390,height:844},
      reducedMotion:'no-preference',
      serviceWorkers:'block'
    });
    const animated = await full.newPage();
    await animated.goto(origin + 'age-entry.html', {waitUntil:'domcontentloaded'});
    await animated.waitForTimeout(700);
    const early = await animated.evaluate(()=>({
      word:Number(getComputedStyle(document.querySelector('.mc-launch-prelude')).opacity),
      panel:Number(getComputedStyle(document.querySelector('.mc-launch-inner')).opacity),
      animations:document.querySelector('.mc-launch-inner').getAnimations().length,
      logoTransform:getComputedStyle(document.querySelector('.mc-launch-mark')).transform
    }));
    assert(early.word>0.3,'Full animation: opening wordmark must be visible');
    assert(early.animations>=1,'Full animation: inner panel must be animated by JS/CSS');
    await animated.waitForTimeout(2250);
    const later = await animated.evaluate(()=>({
      word:Number(getComputedStyle(document.querySelector('.mc-launch-prelude')).opacity),
      panel:Number(getComputedStyle(document.querySelector('.mc-launch-inner')).opacity),
      logoTransform:getComputedStyle(document.querySelector('.mc-launch-mark')).transform
    }));
    assert(later.word < early.word,'Full animation: opening wordmark must fade away');
    assert(later.panel > early.panel+0.3,'Full animation: logo and copy must appear');
    assert(later.logoTransform!==early.logoTransform,'Full animation: logo entrance must visibly move');
    assert.equal(await animated.locator('.mc-launch-footnote a').getAttribute('href'),
      'https://speakoutmentalhealth.org/','SpeakOut product credit is linked');
    assert.match(await animated.locator('#mcLaunchDescription').innerText(),/Towards a sound mind and growth/);
    await full.close();
    console.log('PASS iPhone-width cinematic intro: visible JS animation and gentler reduced-motion sequence; 8.5-second duration, no DOB flash, refresh replay, Skip, and linked SpeakOut credit.');
  } finally {
    if(browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch(err => { console.error(err); process.exitCode=1; });
