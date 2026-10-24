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
assert.match(await page.locator('#group').innerText(),/under 13/);
assert.equal(await page.evaluate(()=>sessionStorage.getItem('mc-age-entry-youth-group')),'child');
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
