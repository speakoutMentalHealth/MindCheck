// Read-only release check: never request a certificate ID or print private data.
const { readFileSync } = require('node:fs');
const { pathToFileURL } = require('node:url');

const releaseMarker = '// Public verification confirms an issued record only; never publish private assessment scores.';
function classifyPage(source) {
  if (typeof source !== 'string') return { ok: false, reason: 'missing-page' };
  if (!source.includes(releaseMarker)) return { ok: false, reason: 'release-marker-missing' };
  if (!source.includes('Certificate record found')) return { ok: false, reason: 'verification-ui-missing' };
  if (/\bdata\.score\b|\bScore:\s*['"`]?\s*\+\s*String\(/i.test(source)) {
    return { ok: false, reason: 'public-score-reference-present' };
  }
  return { ok: true };
}

async function main() {
  const source = readFileSync('verify.html', 'utf8');
  const sourceCheck = classifyPage(source);
  if (!sourceCheck.ok) throw Error('Release source failed: ' + sourceCheck.reason);
  const base = 'https://mindcheck.speakoutmentalhealth.org/verify.html';
  const sha = String(process.env.GITHUB_SHA || '').replace(/[^a-fA-F0-9]/g, '').slice(0, 12);
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(base + '?release=' + sha + '&attempt=' + attempt, {
        headers: { 'User-Agent': 'SpeakOut-certificate-publication/1.0', 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(15000),
        redirect: 'follow'
      });
      const page = response.ok ? await response.text() : '';
      const check = classifyPage(page);
      if (response.status === 200 && check.ok) {
        console.log('PASS: live MindCheck certificate verification page includes the privacy correction.');
        return;
      }
      console.log('Attempt ' + attempt + ': certificate publication marker unavailable (' +
        (response.ok ? check.reason : 'HTTP ' + response.status) + ').');
    } catch {
      console.log('Attempt ' + attempt + ': certificate page request unavailable.');
    }
    if (attempt < 5) await new Promise(resolve => setTimeout(resolve, 15000));
  }
  throw Error('Live certificate privacy correction not verified. Do not claim deployment complete.');
}

module.exports = { classifyPage };
if (require.main === module) main().catch(error => {
  console.error('::error::' + error.message);
  process.exitCode = 1;
});
