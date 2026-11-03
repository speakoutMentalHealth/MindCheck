#!/usr/bin/env node
'use strict';
/*
 * MindCheck public-release preflight. GETs only; never posts wellbeing, report,
 * certificate, or identity data. UI markers prove publication, NOT functionality
 * or successful external backend delivery.
 */
const ORIGIN = 'https://mindcheck.speakoutmentalhealth.org';
const checks = Object.freeze([
  ['age-entry.html', [/id="birthdate"/, /id="continue"/, /data-choice="adult"/, /data-choice="youth"/]],
  ['index.html', [/id="startBtn"/, /assessment-centre\.html/, /report\.html/]],
  ['youth.html', [/MindCheck/i, /youth/i]],
  ['assessment-centre.html', [/Assessment Centre/, /Questionnaires/i]],
  ['guide.html', [/id="mcGuideAI"/, /guide-config\.js/]],
  ['report.html', [/id="submitBtn"/, /readReceipt\(/]],
  ['monitoring.html', [/local(?:ly)? only/i, /Export CSV/]],
  ['verify.html', [/Certificate ID/, /Certificate not verified/]],
  ['privacy.html', [/Privacy/i]],
  ['manifest.webmanifest', [/"start_url"/, /age-entry\.html/, /"display":\s*"standalone"/]],
  ['sw.js', [/const CACHE/, /addEventListener\('fetch'/]],
  ['js/guide-config.js', [/mindcheck-guide\.speakout-platform-api\.workers\.dev/]]
]);

async function requestPublicFile(fetcher, origin, path, options = {}) {
  const { attempts = 3, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) } = options;
  let lastError = 'unknown error';
  const url = new URL(path, origin.endsWith('/') ? origin : origin + '/');
  for (let n = 1; n <= attempts; n++) {
    try {
      const response = await fetcher(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) return await response.text();
      lastError = 'HTTP ' + response.status;
    } catch (error) {
      lastError = error instanceof Error ? error.name : 'network error';
    }
    if (n < attempts) await sleep(800 * n);
  }
  throw new Error(lastError);
}

async function auditPublic({ fetcher = fetch, origin = ORIGIN, cases = checks, options = {} } = {}) {
  const results = [];
  for (const [path, markers] of cases) {
    try {
      const body = await requestPublicFile(fetcher, origin, path, options);
      const missing = markers.find(pattern => !pattern.test(body));
      if (missing) throw new Error('required public marker missing');
      if (path === 'verify.html' && /\bdata\.score\b/.test(body)) throw new Error('public certificate score exposure regression');
      if (path === 'js/guide-config.js' && /AIza[0-9A-Za-z_-]{20,}/.test(body)) throw new Error('client-exposed Google API credential');
      results.push({ path, ok: true });
    } catch (e) {
      results.push({ path, ok: false, reason: e.message });
    }
  }
  return results;
}

if (require.main === module) {
  auditPublic().then(results => {
    for (const row of results) console.log((row.ok ? 'PASS' : 'FAIL') + ' ' + row.path + (row.ok ? '' : ': ' + row.reason));
    const failed = results.filter(r => !r.ok);
    console.log('Public publication preflight: ' + (results.length - failed.length) + '/' + results.length + ' passed. No remote writes were made.');
    if (failed.length) process.exitCode = 1;
  }).catch(() => { console.error('Public preflight unavailable'); process.exitCode = 1; });
}
module.exports = { ORIGIN, checks, auditPublic, requestPublicFile };
