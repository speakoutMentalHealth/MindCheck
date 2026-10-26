/* Privacy-safe, offline-mocked browser regression for My Buddy and assessment filters. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs/promises');
const base='http://127.0.0.1:8796/';
(async()=>{
 const server=spawn('python3',['-m','http.server','8796','--bind','127.0.0.1'],{stdio:'ignore'});
 let browser;
 try{
  await new Promise(resolve=>setTimeout(resolve,700));
  browser=await chromium.launch();
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:820},serviceWorkers:'block',acceptDownloads:true});
   await context.addInitScript(()=>{
    sessionStorage.setItem('mc-age-entry-band','adult');
    sessionStorage.setItem('mc-age-entry-adult','1');
    window.google={accounts:{oauth2:{
     initTokenClient:({callback})=>({requestAccessToken:()=>callback({access_token:'fake-browser-test-token'})}),
     revoke:(_token,done)=>done?.()
    }}};
   });
   const page=await context.newPage();
   let uploads=0;
   await page.route('https://www.googleapis.com/**',async route=>{
    const req=route.request();
    assert.match(req.headers().authorization||'',/^Bearer fake-browser-test-token$/,'Google Drive stays opt-in');
    if(req.method()==='POST'){
     uploads++;
     assert.match(req.postData()||'',/Test diary entry/,'diary content is uploaded only on user action');
     return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'saved-one',name:'MindCheck My Buddy Test -- 2026-10-26T00-00-00-000Z.json'})});
    }
    if(req.url().includes('alt=media'))
     return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,title:'Old diary',mood:'',journal:'Older private writing',tasks:[{text:'Drink water',done:true}]})});
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({files:[{id:'legacy-one',name:'MindCheck My Buddy Old diary -- 2026-10-20T00-00-00-000Z.json',createdTime:'2026-10-20T00:00:00Z'}]})});
   });
   page.on('dialog',dialog=>{void dialog.accept()});
   await page.goto(base+'assessment-centre.html',{waitUntil:'domcontentloaded'});
   const cards=page.locator('.ac-grid .ac-card');
   assert.equal(await cards.count(),8,'all assessment entries are present');
   assert.equal(await cards.filter({visible:true}).count(),8,'all entries visible by default');
   await page.locator('[data-ac-filter="questionnaire"]').click();
   assert.equal(await cards.filter({visible:true}).count(),4,'questionnaire filter shows four cards');
   assert.equal(await page.locator('[data-ac-filter="questionnaire"]').getAttribute('aria-pressed'),'true');
   assert.match(await page.locator('#acFilterStatus').innerText(),/4 of 8/);
   await page.locator('[data-ac-filter="guidance"]').click();
   assert.equal(await cards.filter({visible:true}).count(),4,'guidance filter shows four cards');
   await page.locator('[data-ac-filter="all"]').click();
   assert.equal(await cards.filter({visible:true}).count(),8,'All restores every card');
   const layout=await page.locator('.ac-filters').evaluate(group=>({
    fit:group.scrollWidth<=group.clientWidth+2,
    touch:[...group.querySelectorAll('button')].every(button=>button.getBoundingClientRect().height>=44)
   }));
   assert.equal(layout.fit,true,'filter buttons fit on mobile without horizontal scroll');
   assert.equal(layout.touch,true,'filter buttons remain touch-sized');
   await page.goto(base+'daily-life.html',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#buddy-reflection').isVisible(),false,'diary opens after selecting a mood');
   await page.locator('.buddy-mood[data-feeling="good"]').click();
   assert.equal(await page.locator('#buddy-reflection').isVisible(),true);
   await page.locator('#buddy-diary-title').fill('Test');
   await page.locator('#journal').fill('Test diary entry');
   await page.locator('#task-input').fill('Take a break');
   await page.locator('#task-form button[type="submit"]').click();
   assert.equal(await page.locator('#tasks .task').count(),1);
   await page.locator('#tasks .task input[type="checkbox"]').check();
   assert.equal(await page.locator('#tasks .task.done').count(),1);
   assert.equal(uploads,0,'diary and task entry do not silently upload');
   await page.locator('#buddy-drive-save').click();
   await page.waitForFunction(()=>document.querySelector('#buddy-drive-status')?.dataset.state==='success');
   assert.equal(uploads,1,'one explicit save makes one Drive upload');
   await page.getByRole('button',{name:/Open diary: Old diary/}).click();
   await page.waitForFunction(()=>document.getElementById('journal')?.value==='Older private writing');
   assert.equal(await page.locator('#buddy-reflection').isVisible(),true,'legacy moodless diary remains readable');
   assert.equal(await page.locator('.buddy-mood[aria-pressed="true"]').count(),0,'legacy diary does not invent a mood');
   assert.equal(await page.locator('#tasks .task.done').count(),1);
   const downloadPromise=page.waitForEvent('download');
   await page.locator('#export').click();
   const download=await downloadPromise;
   assert.match(await fs.readFile(await download.path(),'utf8'),/Older private writing/,'export contains the opened diary');
   await context.close();
  }
  console.log('PASS assessment filters and My Buddy: 320/390/1280 layouts, opt-in mocked Drive, moodless diary, local export');
 }finally{await browser?.close();server.kill()}
})().catch(error=>{console.error(error);process.exitCode=1});
