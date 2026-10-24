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
assert.match(await page.locator('#message').innerText(),/Under 18/);
await page.locator('[data-choice="youth"]').click();await page.locator('#continue').click();await page.waitForURL('**/youth.html');
assert.match(await page.locator('#group').innerText(),/under 13/i);
const youthStyle=await page.locator('header').evaluate(h=>{const n=h.querySelector('.notice'),p=h.querySelector('#intro'),c=getComputedStyle(n),bg=getComputedStyle(h);return {headerHeight:h.getBoundingClientRect().height,noticeColor:c.color,noticeSize:parseFloat(c.fontSize),introColor:getComputedStyle(p).color,alignment:bg.textAlign}});
assert.equal(youthStyle.alignment,'left','youth hero uses readable left-aligned text');
assert.notEqual(youthStyle.noticeColor,'rgb(255, 255, 255)','youth notice must not use white-on-pale text');
assert.notEqual(youthStyle.introColor,'rgb(255, 255, 255)','youth intro must remain readable');
assert(youthStyle.noticeSize<=18,'youth notice must not inherit oversized global header typography');
if(width<=390){const heroHeight=await page.locator('.youth-hero').evaluate(el=>el.getBoundingClientRect().height);assert(heroHeight<450,'youth hero must fit comfortably on mobile');}
assert.equal(await page.evaluate(()=>sessionStorage.getItem('mc-age-entry-youth-group')),'child');
assert.equal(await page.locator('#activities .card h3').count(),4,'youth cards need semantic headings');
assert.equal(await page.locator('input,textarea,form').count(),0,'youth educational page must not contain personal-data forms');
assert.equal(await page.locator('a[href="assessment-centre.html"],a[href="guide.html"],a[href="counsellor-exam.html"]').count(),0,'youth navigation must not expose adult features');
for(const target of ['#activities','#calm','#support'])assert.equal(await page.locator('.youth-discover a[href="'+target+'"]').count(),1);
await page.locator('#start').click();assert.equal(await page.locator('#stop').isEnabled(),true);await page.locator('#stop').click();assert.equal(await page.locator('#start').isEnabled(),true);
assert.match(await page.locator('#calm-announcement').innerText(),/stopped/i);
assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).some(k=>/birth|dob/i.test(k))),false);
await page.goto(base+'assessment-centre.html');await page.waitForURL('**/age-entry.html');
await page.locator('[data-choice="adult"]').click();await page.locator('#birthdate').fill('1990-04-01');await page.locator('#continue').click();await page.waitForURL('**/index.html');
assert.equal(await page.evaluate(()=>sessionStorage.getItem('mc-age-entry-band')),'adult');
await page.goto(base+'assessment-centre.html');assert.equal(new URL(page.url()).pathname,'/assessment-centre.html');
assert.deepEqual(writes,[]);await context.close();
}
console.log('PASS age entry: mobile/desktop, DOB mismatch, youth routing, adult routing, sensitive page navigation, no DOB storage or POST');
}finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
