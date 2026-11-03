'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const {auditPublic, requestPublicFile} = require('./production-readonly-preflight.cjs');

test('public preflight makes GET requests only and recognizes a published page', async () => {
  const requests = [];
  const results = await auditPublic({
    cases: [['safe.html', [/Welcome/]]],
    options: {attempts: 1},
    fetcher: async (url, init) => {
      requests.push({url: String(url), method: init.method});
      return {ok: true, text: async () => '<h1>Welcome</h1>'};
    }
  });
  assert.deepEqual(results, [{path: 'safe.html', ok: true}]);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, 'GET');
});

test('fails closed on missing expected publication marker', async () => {
  const results = await auditPublic({
    cases: [['safe.html', [/Welcome/]]],
    options: {attempts: 1},
    fetcher: async () => ({ok: true, text: async () => '<h1>Old version</h1>'})
  });
  assert.equal(results[0].ok, false);
});

test('detects public certificate display of score even with other markers', async () => {
  const results = await auditPublic({
    cases: [['verify.html', [/Certificate ID/]]],
    options: {attempts: 1},
    fetcher: async () => ({ok: true, text: async () => 'Certificate ID; score = data.score'})
  });
  assert.equal(results[0].ok, false);
});

test('detects Google API key in published client guide config', async () => {
  const results = await auditPublic({
    cases: [['js/guide-config.js', [/example/]]],
    options: {attempts: 1},
    fetcher: async () => ({ok: true, text: async () => "example='AIza123456789012345678901234567890'"})
  });
  assert.equal(results[0].ok, false);
});

test('retries publication fetch after temporary HTTP error', async () => {
  let count = 0;
  const data = await requestPublicFile(async () => {
    count++;
    return count === 1 ? {ok: false, status: 503} : {ok: true, text: async () => 'Updated'};
  }, 'https://example.com', 'test', {attempts: 2, sleep: async () => {}});
  assert.equal(data, 'Updated');
  assert.equal(count, 2);
});
