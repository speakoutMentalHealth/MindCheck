/* Strict local-only interactive Community preview regression. No service calls, no user records. */
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process"),net=require("node:net"),fs=require("node:fs");
const origin="http://127.0.0.1:8843/";
(async()=>{
  const server=spawn("python3",["-m","http.server","8843","--bind","127.0.0.1"],{stdio:"ignore"});
  let browser;
  try{
    for(let i=0;i<50;i++){
      try{await new Promise((resolve,reject)=>{const s=net.connect(8843,"127.0.0.1");s.once("connect",()=>{s.end();resolve();});s.once("error",reject)});break}
      catch{await new Promise(r=>setTimeout(r,100))}
    }
    const source=fs.readFileSync("js/community-room-preview.js","utf8");
    for(const forbidden of ["firebase-config","getFirestore(","indexedDB","localStorage.","fetch(","XMLHttpRequest","navigator.sendBeacon"]){
      assert(!source.includes(forbidden),"Preview must not use a persistent or network backend: "+forbidden);
    }
    browser=await chromium.launch({headless:true});
    const denied=await browser.newContext({serviceWorkers:"block",viewport:{width:390,height:844}});
    const youth=await denied.newPage();
    await youth.goto(origin+"community-preview.html?room=learn-build");
    await youth.waitForURL("**/age-entry.html");
    assert.equal(await youth.locator("#topicList .topic").count(),0,"unconfirmed browser redirected");
    await denied.close();
    for(const width of [320,390,430,1280]){
      const cx=await browser.newContext({serviceWorkers:"block",viewport:{width,height:850}});
      await cx.addInitScript(()=>{
        sessionStorage.setItem("mc-age-entry-band","adult");
        sessionStorage.setItem("mc-age-entry-adult","1");
      });
      let writes=0,jsErrors=[];
      await cx.route("**/*",route=>{
        if(route.request().method()!=="GET"){writes++;return route.abort();}
        if(!route.request().url().startsWith(origin))return route.abort();
        return route.continue();
      });
      const page=await cx.newPage();
      page.on("pageerror",e=>jsErrors.push(e.message));
      await page.goto(origin+"community-preview.html?room=learn-build");
      await page.locator("#roomTitle").waitFor();
      assert.match(await page.locator("#roomTitle").textContent(),/Learning & digital skills/);
      assert.equal(await page.locator("#roomList .space").count(),6);
      assert.equal(await page.locator("#topicList .topic").count(),2);
      await page.locator("#searchTopics").fill("digital skill");
      assert.equal(await page.locator("#topicList .topic").count(),1,"topic search");
      await page.locator("#searchTopics").fill("");
      await page.locator("#topicList .topic").first().click();
      assert(await page.locator("#thread").isVisible());
      assert.equal(await page.locator("#replyList .reply").count(),1);
      await page.locator("#replyBody").fill("This is an example reply for the private sandbox.");
      await page.locator('#replyForm button[type="submit"]').click();
      assert.match(await page.locator("#notice").innerText(),/simulated moderator review/);
      await page.locator("#moderatorMode").click();
      assert.equal(await page.locator("#queue li").count(),1,"sample reply goes to moderation");
      await page.locator("#queue li button").filter({hasText:"Approve"}).click();
      assert.equal(await page.locator("#replyList .reply").count(),2);
      await page.locator("#reportTopic").click();
      await page.locator("#reportReason").selectOption("spam");
      await page.locator('#reportForm button[type="submit"]').click();
      assert.match(await page.locator("#reportStatus").innerText(),/1 simulated reports/);
      await page.locator("#backToTopics").click();
      await page.locator("#createTopic").click();
      await page.locator("#topicTitle").fill("A simulated digital skills question");
      await page.locator("#topicBody").fill("This is only a preview test and should not be uploaded.");
      await page.locator('#topicForm button[type="submit"]').click();
      assert.equal(await page.locator("#topicList .topic").count(),2,"pending topic not visible before review");
      await page.locator("#queue li button").filter({hasText:"Approve"}).click();
      assert.equal(await page.locator("#topicList .topic").count(),3,"approved simulated topic displayed");
      const widthInfo=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,screen:innerWidth}));
      assert(widthInfo.doc<=widthInfo.screen+2,"no horizontal scroll "+width+JSON.stringify(widthInfo));
      await page.reload();
      assert.equal(await page.locator("#topicList .topic").count(),2,"example content clears on reload");
      assert.equal(await page.locator("#moderatorMode").getAttribute("aria-pressed"),"false");
      await page.locator('[data-room="private-groups"]').click();
      assert.match(await page.locator("#roomDesc").textContent(),/no real private names/);
      assert.equal(writes,0,"simulation never sends writes");
      assert.deepEqual(jsErrors,[],"no preview runtime exceptions");
      if(width===390){
        await page.addScriptTag({path:require.resolve("axe-core/axe.min.js")});
        const fails=await page.evaluate(async()=> (await axe.run({runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}}))
          .violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
        assert.deepEqual(fails,[],"preview accessible at 390px");
      }
      console.log("PASS 18+ sandbox room navigation, moderation, reporting and no writes "+width+"px");
      await cx.close();
    }
  }finally{await browser?.close();server.kill();}
})().catch(err=>{console.error(err);process.exitCode=1;});
