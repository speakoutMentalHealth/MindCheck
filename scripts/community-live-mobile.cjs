/* Read-only live mobile visual/interaction QA. No registrations or forum writes. */
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const fs = require("node:fs");
const out = "artifacts/live-community";
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    for(const [width,height] of [[320,568],[390,844],[430,932],[1280,850]]){
      const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,serviceWorkers:"block",reducedMotion:"reduce"});
      await context.addInitScript(()=>{
        try{sessionStorage.setItem("mc-age-entry-band","adult");sessionStorage.setItem("mc-age-entry-adult","1");}catch(_){}
      });
      // Other MindCheck pages may send existing analytics/telemetry;
      // block them in this read-only audit but never count them as forum writes.
      let blockedWrites=0;
      await context.route("**/*", route=>{
        if(!["GET","HEAD","OPTIONS"].includes(route.request().method())){blockedWrites++;return route.abort();}
        return route.continue();
      });
      const community=await context.newPage();
      await community.goto("https://mindcheck.speakoutmentalhealth.org/community.html",{waitUntil:"domcontentloaded",timeout:30000});
      assert(/community\.html/.test(community.url()),"Adult navigation page should remain accessible");
      await community.locator("#communityTitle").waitFor({state:"visible"});
      const heading=await community.locator("#communityTitle").evaluate(el=>getComputedStyle(el).color);
      assert.equal(heading,"rgb(255, 255, 255)","Forum heading is white on the dark banner");
      assert.equal(await community.locator(".room:visible").count(),6);
      await community.locator('[data-c-filter="connect"]').click();
      assert.equal(await community.locator(".room:visible").count(),2,"Directory filtering");
      await community.locator('[data-c-filter="all"]').click();
      const size=await community.evaluate(()=>({screen:innerWidth,doc:document.documentElement.scrollWidth}));
      assert(size.doc<=size.screen+2,"Community horizontal overflow at "+width+": "+JSON.stringify(size));
      assert.equal(await community.locator("#mcCommunityOpen").isVisible(),false,"No live forum handoff enabled");
      await community.screenshot({path:out+"/mindcheck-"+width+".png",fullPage:true});
      const home=await context.newPage();
      await home.goto("https://mindcheck.speakoutmentalhealth.org/",{waitUntil:"domcontentloaded",timeout:30000});
      await home.locator("body.mc-home-compact").waitFor();
      if(!await home.locator("#homeSection.active").isVisible()){
        await home.locator(".mc-front-door .mc-primary-action").click();
        await home.locator("#homeSection.active").waitFor();
      }
      const tile=home.locator("#mcHomeCommunityLink strong");
      assert(await tile.isVisible(),"Community tile visible");
      const fit=await tile.evaluate(el=>({text:el.textContent,whiteSpace:getComputedStyle(el).whiteSpace,scroll:el.scrollWidth,client:el.clientWidth}));
      assert.equal(fit.text,"Community");
      assert.equal(fit.whiteSpace,"nowrap");
      assert(fit.scroll<=fit.client+2,"Community tile text does not clip at "+width+": "+JSON.stringify(fit));
      await home.screenshot({path:out+"/home-"+width+".png",fullPage:true});
      const forum=await context.newPage();
      await forum.goto("https://speakoutmentalhealth.org/forum.html",{waitUntil:"domcontentloaded",timeout:30000});
      await forum.locator("h1").filter({hasText:"Community discussions"}).waitFor();
      assert.equal(await forum.locator("#discussion").isVisible(),false,"Private threads not displayed before publication");
      const forumWidth=await forum.evaluate(()=>({screen:innerWidth,doc:document.documentElement.scrollWidth}));
      assert(forumWidth.doc<=forumWidth.screen+2,"Forum horizontal overflow at "+width+": "+JSON.stringify(forumWidth));
      await forum.screenshot({path:out+"/forum-"+width+".png",fullPage:true});
      const preview=await context.newPage();
      let previewWrites=0;
      preview.on("request", req => {
        if(!["GET","HEAD","OPTIONS"].includes(req.method())) previewWrites++;
      });
      await preview.goto("https://mindcheck.speakoutmentalhealth.org/community-preview.html?room=learn-build",{waitUntil:"domcontentloaded",timeout:30000});
      await preview.locator("#roomTitle").waitFor();
      assert.equal(await preview.locator("#roomList .space").count(),6,"Six example rooms can be entered");
      assert.equal(await preview.locator("#topicList .topic").count(),2,"Two example discussions");
      await preview.locator("#topicList .topic").first().click();
      await preview.locator("#replyBody").fill("A simulated reply that remains only in the browser.");
      await preview.locator('#replyForm button[type="submit"]').click();
      await preview.locator("#moderatorMode").click();
      assert.equal(await preview.locator("#queue li").count(),1,"Simulated moderation queue");
      assert.equal(previewWrites,0,"Interactive example room does not submit browser data");
      const previewWidth=await preview.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert(previewWidth<=2,"Preview horizontal overflow "+width);
      await preview.screenshot({path:out+"/preview-"+width+".png",fullPage:true});
      console.log("PASS live mobile Community at "+width+"x"+height+"; demo room interactive; no forum writes; unrelated analytics blocked="+blockedWrites);
      await context.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
