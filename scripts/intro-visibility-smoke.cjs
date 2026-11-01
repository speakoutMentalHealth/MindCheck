/* Browser regression: the portfolio-style intro must last ~4.5 seconds
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
    await page.waitForTimeout(2200);
    assert.equal(await intro.isVisible(), true, 'Reduced Motion: stays visible after 3 seconds');
    await intro.waitFor({state:'hidden', timeout:2800});
    const elapsed = await page.evaluate(() => performance.now());
    assert(elapsed>=4000, 'Intro dismissed too early: '+elapsed+' ms');

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
    console.log('PASS iPhone-width intro: 4.5-second reduced-motion display, no DOB flash, refresh replay and skip.');
  } finally {
    if(browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch(err => { console.error(err); process.exitCode=1; });
