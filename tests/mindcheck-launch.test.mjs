import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const launch = read('js/mindcheck-launch.js');

function buildPage(reduced = false, handoff = false) {
  const listeners = {};
  const scheduled = new Map();
  const classes = new Set(handoff ? ['mc-launch-handoff'] : []);
  let nextTimer = 0;
  const skip = {
    focus() { this.focused = true; },
    addEventListener(type, callback) { listeners['skip-' + type] = callback; }
  };
  const motion = {
    setAttribute(name,value) { this[name]=value; },
    addEventListener(type,callback) { listeners['motion-'+type]=callback; }
  };
  const main = {
    tagName: 'MAIN', inert: false, focused: false,
    hasAttribute() { return false; },
    setAttribute() { this.tabindexAdded = true; },
    focus() { this.focused = true; }
  };
  const intro = {
    tagName: 'DIV', hidden: false, dataset: {},
    classList: { add(name) { classes.add(name); } },
    querySelector(selector) { return selector === '[data-mc-launch-motion]' ? motion : skip; },
    addEventListener(type, callback) { listeners['intro-' + type] = callback; }
  };
  const document = {
    body: { children: [intro, main] },
    documentElement: { classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); }
    } },
    getElementById(id) { return id === 'mcLaunchIntro' ? intro : null; },
    querySelector() { return main; }
  };
  const window = {
    matchMedia() { return { matches: reduced }; },
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      scheduled.set(id, { callback, delay });
      return id;
    }
  };
  const clearTimeout = id => scheduled.delete(id);
  runInNewContext(launch, { document, window, clearTimeout, URL });
  return { listeners, scheduled, classes, main, intro, skip, motion };
}

test('each primary entry has a replayable, skippable introduction', () => {
  for (const page of ['age-entry.html', 'index.html', 'youth.html']) {
    const html = read(page);
    assert.match(html, /id="mcLaunchIntro"/);
    assert.match(html, /data-mc-launch-skip/);
    assert.match(html, /class="mc-launch-prelude"/);
    assert.match(html, /class="mc-launch-stars"/);
    assert.match(html, /class="mc-launch-mist"/);
    assert.match(html, /class="mc-launch-logo"/);
    assert.match(html, /SpeakOut<\/a>/);
    assert.match(html, /Towards a sound mind and healthy growth\./);
    assert.match(html, /A product of <a href="https:\/\/speakoutmentalhealth\.org\/"/);
    if (page === 'index.html') {
      assert.match(html, /js\/mindcheck-launch\.js\?v=20261104-orbit/);
    } else {
      assert.ok(html.includes(launch), 'age and youth keep the intro script inline');
      assert.doesNotMatch(html, /<script[^>]+src\s*=/i);
    }
    assert.match(html, /css\/mindcheck-launch-finish\.css\?v=20261104-orbit/);
  }
});

test('automatic 15-second exit restores the existing app', () => {
  const page = buildPage();
  assert.equal(page.main.inert, true);
  assert.equal(page.classes.has('mc-launch-open'), true);
  const timeout = [...page.scheduled.values()].find(item => item.delay === 15000);
  assert.ok(timeout);
  timeout.callback();
  assert.equal(page.main.inert, false);
  assert.equal(page.classes.has('is-exiting'), true);
});

test('Skip intro exits immediately and returns keyboard focus', () => {
  const page = buildPage();
  page.listeners['skip-click']();
  assert.equal(page.main.inert, false);
  assert.equal(page.main.focused, true);
  assert.equal([...page.scheduled.values()].some(item => item.delay === 15000), false);
});

test('reduced-motion visitors get the same 15-second reading window', () => {
  const page = buildPage(true);
  assert.ok([...page.scheduled.values()].some(item => item.delay === 15000));
  assert.equal([...page.scheduled.values()].some(item => item.delay === 150), false);
  assert.equal(page.intro.dataset.motion, 'gentle');
  assert.ok(read('js/mindcheck-launch.js').includes("clipPath:'circle(36%"));
  assert.match(read('css/mindcheck-launch-finish.css'), /@keyframes mc-unveil-logo/);
});

test('age gates, support pages and offline assets remain connected', () => {
  assert.match(read('age-entry.html'), /mc-age-entry-youth-group/);
  assert.match(read('index.html'), /mc-age-entry-adult/);
  assert.match(read('youth.html'), /mc-age-entry-band/);
  assert.match(read('assessment-centre.html'), /mindcheck-launch-finish\.css/);
  assert.match(read('daily-life.html'), /mindcheck-launch-finish\.css/);
  const worker = read('sw.js');
  assert.match(worker, /mc-v75-orbit-20261104/);
  assert.match(worker, /\.\/js\/mindcheck-launch\.js\?v=20261104-orbit/);
  assert.match(worker, /\.\/css\/mindcheck-launch-finish\.css\?v=20261104-orbit/);
});

test('age handoff is suppressed before first paint and refresh gets the full intro', () => {
  const firstVisit = buildPage(false, true);
  assert.equal(firstVisit.intro.hidden, true);
  assert.equal(firstVisit.main.inert, false);
  assert.equal(firstVisit.scheduled.size, 0);

  const refreshed = buildPage(false, false);
  assert.equal(refreshed.intro.hidden, false);
  assert.ok([...refreshed.scheduled.values()].some(item => item.delay === 15000));

  for (const path of ['index.html', 'youth.html']) {
    const html = read(path);
    const prelude = html.slice(0, html.indexOf('</head>'));
    assert.match(prelude, /mc-launch-handoff-once/);
    assert.match(prelude, /mc-launch-handoff/);
  }
  assert.match(read('age-entry.html'), /sessionStorage\.setItem\('mc-launch-handoff-once',actual\)/);
  assert.match(read('css/mindcheck-launch-finish.css'), /html\.mc-launch-handoff \.mc-launch-intro\{display:none!important\}/);
});

 test('orbit controls respect reduced motion and allow an explicit opt-in', () => {
  const reduced=buildPage(true);
  assert.equal(reduced.intro.dataset.orbit,'paused');
  assert.equal(reduced.motion.textContent,'Animate logo');
  reduced.listeners['motion-click']();
  assert.equal(reduced.intro.dataset.orbit,'running');
  assert.equal(reduced.motion['aria-pressed'],'true');
  reduced.listeners['motion-click']();
  assert.equal(reduced.intro.dataset.orbit,'paused');
  const full=buildPage();
  assert.equal(full.intro.dataset.orbit,'running');
  full.listeners['motion-click']();
  assert.equal(full.intro.dataset.orbit,'paused');
});
