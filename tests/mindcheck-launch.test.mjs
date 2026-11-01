import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const launch = read('js/mindcheck-launch.js');

function buildPage(reduced = false) {
  const listeners = {};
  const scheduled = new Map();
  const classes = new Set();
  let nextTimer = 0;
  const skip = {
    focus() { this.focused = true; },
    addEventListener(type, callback) { listeners['skip-' + type] = callback; }
  };
  const main = {
    tagName: 'MAIN', inert: false, focused: false,
    hasAttribute() { return false; },
    setAttribute() { this.tabindexAdded = true; },
    focus() { this.focused = true; }
  };
  const intro = {
    tagName: 'DIV', hidden: false,
    classList: { add(name) { classes.add(name); } },
    querySelector() { return skip; },
    addEventListener(type, callback) { listeners['intro-' + type] = callback; }
  };
  const document = {
    body: { children: [intro, main] },
    documentElement: { classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); }
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
  runInNewContext(launch, { document, window, clearTimeout });
  return { listeners, scheduled, classes, main, intro, skip };
}

test('each primary entry has a replayable, skippable introduction', () => {
  for (const page of ['age-entry.html', 'index.html', 'youth.html']) {
    const html = read(page);
    assert.match(html, /id="mcLaunchIntro"/);
    assert.match(html, /data-mc-launch-skip/);
    assert.match(html, /class="mc-launch-prelude"/);
    assert.match(html, /class="mc-launch-stars"/);
    assert.match(html, /class="mc-launch-mist"/);
    if (page === 'index.html') {
      assert.match(html, /js\/mindcheck-launch\.js\?v=20261101/);
    } else {
      assert.ok(html.includes(launch), 'age and youth keep the intro script inline');
      assert.doesNotMatch(html, /<script[^>]+src\s*=/i);
    }
    assert.match(html, /css\/mindcheck-launch-finish\.css\?v=20261101/);
  }
});

test('automatic 4.5-second exit restores the existing app', () => {
  const page = buildPage();
  assert.equal(page.main.inert, true);
  assert.equal(page.classes.has('mc-launch-open'), true);
  const timeout = [...page.scheduled.values()].find(item => item.delay === 4500);
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
  assert.equal([...page.scheduled.values()].some(item => item.delay === 4500), false);
});

test('reduced-motion visitors are not forced through the animation', () => {
  const page = buildPage(true);
  assert.ok([...page.scheduled.values()].some(item => item.delay === 150));
});

test('age gates, support pages and offline assets remain connected', () => {
  assert.match(read('age-entry.html'), /mc-age-entry-youth-group/);
  assert.match(read('index.html'), /mc-age-entry-adult/);
  assert.match(read('youth.html'), /mc-age-entry-band/);
  assert.match(read('assessment-centre.html'), /mindcheck-launch-finish\.css/);
  assert.match(read('daily-life.html'), /mindcheck-launch-finish\.css/);
  const worker = read('sw.js');
  assert.match(worker, /mc-v67-intro-ui-polish-20261101/);
  assert.match(worker, /\.\/js\/mindcheck-launch\.js\?v=20261101/);
  assert.match(worker, /\.\/css\/mindcheck-launch-finish\.css\?v=20261101/);
});
