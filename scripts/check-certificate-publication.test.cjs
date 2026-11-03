const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { classifyPage } = require('./check-certificate-publication.cjs');
const source = readFileSync('verify.html', 'utf8');

test('current source contains the privacy release marker without displaying score', () => {
  assert.deepEqual(classifyPage(source), { ok: true });
});
test('public score regression is rejected even when release marker is retained', () => {
  const unsafe = source.replace('Certificate record found', "Certificate record found' + String(data.score) + '");
  assert.equal(classifyPage(unsafe).ok, false);
});
test('missing or unrelated pages fail closed', () => {
  assert.equal(classifyPage('').ok, false);
  assert.equal(classifyPage('<html>Not Found</html>').ok, false);
});
