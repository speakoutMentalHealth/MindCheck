/* All remote writes are intercepted. This checks receipt wording, not live delivery. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),{spawn}=require('node:child_process'),net=require('node:net');
(async()=>{let browser;const server=spawn('python3',['-m','http.server','8778','--bind','127.0.0.1'],{stdio:'ignore'});try{
for(let i=0;i<50;i++){try{await new Promise((r,j)=>{const s=net.connect(8778,'127.0.0.1');s.on('connect',()=>{s.end();r()});s.on('error',j)});break}catch{await new Promise(r=>setTimeout(r,100))}}
browser=await chromium.launch();
for(const mode of ['opaque','offline','storage-blocked']){
 const context=await browser.newContext({viewport:{width:390,height:664},serviceWorkers:'block'});let posts=0;
 await context.route('**/*',async route=>{const req=route.request();if(req.url().startsWith('http://127.0.0.1:8778/'))return route.continue();if(req.url().startsWith('https://script.google.com/')&&req.method()==='POST'){posts++;return mode==='offline'?route.abort():route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'})}return route.abort()});
 if(mode==='storage-blocked')await context.addInitScript(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='mc_monitoring_weeks')throw new Error('Fixture storage unavailable');return original.call(this,key,value)}});
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8778/monitoring.html');
 await p.locator('#week_start').fill('2026-10-19');await p.locator('#program').fill('<img src=x onerror="window.fixtureExecuted=true">');await p.locator('#screened_pct').fill('101');await p.locator('#submitMonitoring').click();assert.match(await p.locator('#monStatus').innerText(),/0 to 100/);assert.equal(posts,0);
 await p.locator('#screened_pct').fill('10');await p.locator('#submitMonitoring').click();await p.waitForFunction(()=>!document.getElementById('submitMonitoring').disabled);
 const status=await p.locator('#monStatus').innerText();assert.doesNotMatch(status,/indicators recorded in the register|data was not sent/);
 if(mode==='storage-blocked'){assert.match(status,/Nothing was sent/);assert.equal(posts,0);assert.equal(await p.locator('#monTable tbody tr').count(),0)}else{assert.match(status,/Saved on this device/);assert.match(status,/unconfirmed|could not be confirmed/);assert.equal(posts,1);assert.equal(await p.locator('#monTable tbody tr').count(),1);assert.equal(await p.locator('#monTable img').count(),0);assert.equal(await p.evaluate(()=>Boolean(window.fixtureExecuted)),false);await p.reload();assert.equal(await p.locator('#monTable tbody tr').count(),1,'local backup survives reload');const download=p.waitForEvent('download');await p.locator('#exportCsv').click();const file=await download;assert.equal(file.suggestedFilename(),'mindcheck-weekly-monitoring.csv')}
 assert.deepEqual(errors,[]);await context.close();console.log('PASS monitoring '+mode+': honest status, local backup, validation and safe rendering');
}
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
