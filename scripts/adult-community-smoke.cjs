/* MindCheck 18+ Community integration: local browser-only privacy and age-navigation checks. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const net = require("node:net");
const fs = require("node:fs");
const origin = "http://127.0.0.1:8799/";
(async () => {
  const server = spawn("python3", ["-m","http.server","8799","--bind","127.0.0.1"], { stdio:"ignore" });
  let browser;
  try {
    for (let i=0;i<60;i++) {
      try {
        await new Promise((resolve,reject)=>{
          const socket = net.connect(8799,"127.0.0.1");
          socket.on("connect",()=>{socket.end();resolve();});
          socket.on("error",reject);
        });
        break;
      } catch { await new Promise(r=>setTimeout(r,100)); }
    }
    assert(!fs.readFileSync("youth.html","utf8").includes("community.html"),
      "Under-18 experience must not link to the adult forum.");
    const config = fs.readFileSync("js/community-config.js","utf8");
    assert.match(config, /enabled:\s*false/, "Production handoff must remain off.");
    browser = await chromium.launch({ headless:true });
    for(const width of [320,390,430,1280]) {
      const context = await browser.newContext({viewport:{width,height:850},serviceWorkers:"block"});
      await context.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
      const page = await context.newPage(), errors = [], writes = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("request", req => { if(req.method() !== "GET") writes.push(req.url()); });
      await page.goto(origin+"community.html");
      await page.waitForURL("**/age-entry.html");
      await page.locator("[data-choice=adult]").click();
      await page.locator("#birthdate").fill("2012-03-01");
      await page.locator("#continue").click();
      await page.waitForURL("**/youth.html");
      assert.equal(await page.locator('a[href="community.html"]').count(),0,
        "Youth view must not have a community CTA.");
      await page.goto(origin+"community.html");
      await page.waitForURL("**/age-entry.html");
      await page.locator("[data-choice=adult]").click();
      await page.locator("#birthdate").fill("1990-04-01");
      await page.locator("#continue").click();
      await page.waitForURL("**/index.html");
      await page.goto(origin+"index.html?section=homeSection");
      // The adult home initially shows the welcome stage on a fresh session.
      // Enter its existing companion journey before testing dashboard cards.
      if (!await page.locator("#homeSection.active").isVisible()) {
        await page.locator(".mc-front-door .mc-primary-action").click();
        await page.locator("#homeSection.active").waitFor();
      }
      assert.equal(await page.locator("#goCommunity").count(),1,
        "Adult home has exactly one Community feature card.");
      assert.equal(await page.locator('header .mc-community-nav-entry').count(),1);
      assert(await page.locator("#mcHomeCommunityLink").isVisible(),
        "18+ Community must be visible in the real compact adult dashboard.");
      const tileLabel = await page.locator("#mcHomeCommunityLink strong").evaluate(el => {
        const style = getComputedStyle(el);
        return { whiteSpace: style.whiteSpace, labelOverflow: el.scrollWidth > el.clientWidth + 2 };
      });
      assert.equal(tileLabel.whiteSpace, "nowrap", "Community label must not break vertically.");
      assert.equal(tileLabel.labelOverflow, false, "Community label must fit its tile at "+width+"px.");
      await page.locator("#mcHomeCommunityLink").click();
      await page.waitForURL("**/community.html");
      assert.equal(await page.locator(".room").count(),6);
      assert.equal(await page.locator("#communityTitle").evaluate(el=>getComputedStyle(el).color),"rgb(255, 255, 255)",
        "Community hero heading must remain white on the dark background.");
      await page.locator('[data-c-filter="connect"]').click();
      assert.equal(await page.locator(".room:visible").count(),2,"Room directory category filter works.");
      await page.locator('[data-c-filter="all"]').click();
      assert.equal(await page.locator(".room:visible").count(),6,"All community rooms restored.");
      assert.equal(await page.locator("#mcCommunityOpen").isVisible(),false,
        "Forum is closed until explicit backend release.");
      assert.equal(await page.locator("#mcCommunityNotOpen").isVisible(),true);
      assert(await page.locator("#mcLanguageSelect").isVisible(),
        "Adult community retains the language selection.");
      assert.equal(await page.locator("#mcLanguageSelect option").count(),6);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
        "Community must fit mobile viewport "+width);
      assert.equal(await page.locator(".mc-quality-skip").count(),1);
      await page.addScriptTag({path:require.resolve("axe-core/axe.min.js")});
      const violations = await page.evaluate(async()=>{
        const result = await axe.run({runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});
        return result.violations.filter(x=>["serious","critical"].includes(x.impact)).map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)}));
      });
      assert.deepEqual(violations,[],"Community accessibility at "+width+"px");
      assert.deepEqual(errors,[],"No runtime errors at "+width+"px");
      assert.deepEqual(writes,[],"No write requests or forum API calls while disabled.");
      await context.close();
    }
    console.log("PASS: age-separated MindCheck Community, no youth entry, feature-locked forum, responsive + accessible.");
  } finally { await browser?.close(); server.kill(); }
})().catch(e=>{ console.error(e); process.exitCode=1; });
