const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const base='http://127.0.0.1:8791/';
(async()=>{
const server=spawn('python3',['-m','http.server','8791','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
try{
await new Promise(r=>setTimeout(r,700));browser=await chromium.launch();
for(const width of [320,390,1280]){
const context=await browser.newContext({viewport:{width,height:800},serviceWorkers:'block'}),page=await context.newPage();
const writes=[];page.on('request',req=>{if(req.method()!=='GET')writes.push(req.url());});
await page.goto(base+'index.html');await page.waitForURL('**/age-entry.html');
await page.locator('[data-choice="adult"]').click();
await page.locator('#birthdate').fill('2015-04-01');await page.locator('#continue').click();
await page.waitForURL('**/youth.html');
assert.match(await page.locator('#group').innerText(),/under 13/i);
assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('kids-mode')),true,'child route uses Kids Mode');
assert.match(await page.locator('#welcome').innerText(),/Feelings Adventure/);
assert.equal(await page.locator('#adventure-map').isVisible(),true,'Kids Mode adventure map visible');
assert.equal(await page.locator('.adventure-stop').count(),6,'six optional adventure destinations');
assert.deepEqual(await page.locator('.adventure-stop strong').allTextContents(),[
  'Feelings Garden','Story Street','Skills Studio','Calm Corner','Kiddies TV','Kiddies Learn'
],'the six adventure destinations match the intended youth experience');
assert.equal(await page.locator('.adventure-stop').filter({hasText:'Kiddies TV'}).getAttribute('href'),'https://speakoutmentalhealth.org/kiddies-tv.html','Kiddies TV uses its child-focused destination');
assert.equal(await page.locator('.adventure-stop').filter({hasText:'Kiddies Learn'}).getAttribute('href'),'https://speakoutmentalhealth.org/kiddies.html','Kiddies Learn uses its education destination');
assert.equal(await page.locator('#activities').isVisible(),false,'other sections hidden on home');
const menuLayout=await page.locator('.youth-section-menu').evaluate(nav=>({fits:nav.scrollWidth<=nav.clientWidth+2,allVisible:[...nav.querySelectorAll('a:not([hidden])')].every(link=>{const a=link.getBoundingClientRect(),n=nav.getBoundingClientRect();return a.left>=n.left-2&&a.right<=n.right+2&&a.height>=44})}));
assert.equal(menuLayout.fits,true,'all menu destinations fit without horizontal scrolling');
assert.equal(menuLayout.allVisible,true,'every menu destination is fully visible and touch-sized');
await page.locator('[data-section-link="play"]').click();
assert.equal(await page.locator('#play').isVisible(),true,'play menu shows play only');
assert.equal(await page.locator('#adventure-map').isVisible(),false,'map hidden when play selected');
assert.equal(await page.locator('#quiz-answers button').count(),3,'quiz options render');
assert.match(await page.locator('#quiz-progress').innerText(),/Question 1 of 6/);
assert.equal(await page.locator('#quiz-next').isDisabled(),true,'must answer before advancing');
await page.locator('[data-section-link="activities"]').click();
assert.equal(await page.locator('#activities').isVisible(),true,'feelings menu opens feelings only');
assert.equal(await page.locator('#play').isVisible(),false,'play hidden after switching');
await page.locator('[data-section-link="play"]').click();
assert.match(await page.locator('#play').innerText(),/Ada's rainy-day story/);
assert.match(await page.locator('#play').innerText(),/Tobi feels nervous/);
assert.match(await page.locator('#play').innerText(),/Ahmed's kindness quest/);
await page.locator('[data-ahmed-choice="ask"]').click();assert.match(await page.locator('#ahmed-feedback').innerText(),/respects/);
await page.locator('#ahmed-reset').click();assert.match(await page.locator('#ahmed-feedback').innerText(),/Choose a kind action/);
assert.equal(await page.locator('.youth-art span').innerText(),'👧🏽');
assert.equal(await page.locator('#story-step').innerText(),'Scene 1 of 4');
await page.locator('#story-next').click();assert.equal(await page.locator('#story-step').innerText(),'Scene 2 of 4');
await page.locator('#story-reset').click();assert.equal(await page.locator('#story-step').innerText(),'Scene 1 of 4');
await page.locator('[data-kind-choice="talk"]').click();assert.match(await page.locator('#kind-feedback').innerText(),/trusted adult/i);
await page.locator('#kind-reset').click();assert.match(await page.locator('#kind-feedback').innerText(),/Choose an answer/);
await page.locator('[data-section-link="everyday"]').click();
assert.equal(await page.locator('#everyday').isVisible(),true,'language selector is in life skills');
await page.locator('.youth-language-tools summary').click();
await page.locator('#mcYouthLanguage').selectOption('fr');
assert.equal(await page.locator('#everyday').getAttribute('lang'),'fr');
assert.equal(await page.locator('#everyday .quiet').first().getAttribute('lang'),'fr');
assert.match(await page.locator('#everyday .quiet').first().innerText(),/français/);
await page.locator('#mcYouthLanguage').selectOption('en');
assert.match(await page.locator('#everyday .quiet').first().innerText(),/Everyday learning cards/);
const youthStyle=await page.locator('header').evaluate(h=>{const n=h.querySelector('.notice'),p=h.querySelector('#intro'),c=getComputedStyle(n),bg=getComputedStyle(h);return {headerHeight:h.getBoundingClientRect().height,noticeColor:c.color,noticeSize:parseFloat(c.fontSize),introColor:getComputedStyle(p).color,alignment:bg.textAlign}});
assert.equal(youthStyle.alignment,'left','youth hero uses readable left-aligned text');
assert.notEqual(youthStyle.noticeColor,'rgb(255, 255, 255)','youth notice must not use white-on-pale text');
assert.notEqual(youthStyle.introColor,'rgb(255, 255, 255)','youth intro must remain readable');
assert(youthStyle.noticeSize<=18,'youth notice must not inherit oversized global header typography');
if(width<=390){const heroHeight=await page.locator('.youth-hero').evaluate(el=>el.getBoundingClientRect().height);assert(heroHeight<450,'youth hero must fit comfortably on mobile');}
assert.equal(await page.evaluate(()=>sessionStorage.getItem('mc-age-entry-youth-group')),'child');
assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).some(k=>/birth|dob/i.test(k))),false);
await page.goto(base+'assessment-centre.html');await page.waitForURL('**/age-entry.html');
await page.locator('[data-choice="adult"]').click();await page.locator('#birthdate').fill('1990-04-01');await page.locator('#continue').click();await page.waitForURL('**/index.html');
assert.equal(await page.evaluate(()=>sessionStorage.getItem('mc-age-entry-band')),'adult');
await page.goto(base+'assessment-centre.html');assert.equal(new URL(page.url()).pathname,'/assessment-centre.html');
assert.deepEqual(writes,[]);await context.close();
}
console.log('PASS age entry: mobile/desktop, DOB auto-routing, youth routing, adult routing, sensitive page navigation, no DOB storage or POST');
}finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
