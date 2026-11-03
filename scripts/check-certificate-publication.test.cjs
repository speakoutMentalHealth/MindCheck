const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { classifyPage } = require('./check-certificate-publication.cjs');
const source = readFileSync('verify.html', 'utf8');

test('current source contains the privacy release marker without displaying score', () => {
  assert.deepEqual(classifyPage(source), { ok: true });
});
test('old public certificate page that displays score fails release check', () => {
  assert.deepEqual(classifyPage(source.replace(
    '// Public verification confirms an issued record only; never publish private assessment scores.',
    "setStatus(true, 'Certificate record found', 'Score: ' + String(data.score));"
  )).ok, false);
});
test('missing or unrelated pages fail closed', () => {
  assert.equal(classifyPage('').ok, false);
  assert.equal(classifyPage('<html>Not Found</html>').ok, false);
});
