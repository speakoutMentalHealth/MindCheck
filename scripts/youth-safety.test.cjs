/* Safety regression checks for the login-free age-banded public experience.
 * These tests detect accidental youth feature exposure in UI. They do NOT
 * constitute verified age authorization, penetration testing or clinical review. */
const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const html = name => readFileSync(name,'utf8');
const entry = html('age-entry.html');
const youth = html('youth.html');

test('DOB stays on device and only age bands are stored',()=>{
 assert.match(entry,/type="date"/);
 assert.match(entry,/event\.preventDefault\(\)/);
 assert.match(entry,/sessionStorage\.setItem\('mc-age-entry-band'/);
 assert.doesNotMatch(entry,/localStorage\.setItem\(/);
 assert.doesNotMatch(entry,/<form[^>]*action\s*=/i);
 assert.doesNotMatch(entry,/<script[^>]+src\s*=/i);
 assert.doesNotMatch(entry,/fetch\s*\(|sendBeacon\s*\(|XMLHttpRequest/);
 assert.match(entry,/actual!==selected/);
});

test('youth page remains education-only without data collection or external scripts',()=>{
 assert.match(youth,/mc-age-entry-band/);
 assert.match(youth,/mc-age-entry-youth-group/);
 assert.doesNotMatch(youth,/<(?:form|input|textarea|iframe)\b/i);
 assert.doesNotMatch(youth,/<script[^>]+src\s*=/i);
 assert.doesNotMatch(youth,/fetch\s*\(|sendBeacon\s*\(|XMLHttpRequest|localStorage\.setItem/);
 assert.doesNotMatch(youth,/href=["'][^"']*(?:assessment-centre|report\.html|guide\.html|certificate|counsellor-exam)/i);
 for(const id of ['activities','calm','support','start','stop','calm-status'])
  assert.match(youth,new RegExp('id=["\\']'+id+'["\\']'),'missing youth feature '+id);
 assert.match(youth,/trusted adult/i);
 assert.match(youth,/emergency services/i);
});

test('adult-sensitive public pages retain age-navigation guards',()=>{
 const pages=['index.html','assessment-centre.html','adhd.html','pcl5-screening.html',
 'professional-assessments.html','audit-screening.html','clinical-assessment-guide.html',
 'report.html','monitoring.html','guide.html','counsellor-exam.html','counsellor-certificate.html','certificate.html'];
 for(const page of pages){
  const source=html(page);
  assert.match(source,/mc-age-entry-band/,page+' missing age routing state');
  assert.match(source,/age-entry\.html/,page+' missing age-entry redirect');
 }
});

test('youth design preserves basic keyboard and timer affordances',()=>{
 assert.match(youth,/class="mc-quality-skip"/);
 assert.match(youth,/href="#main-content"/);
 assert.match(youth,/prefers-reduced-motion/);
 assert.match(youth,/aria-live/);
 assert.match(youth,/id="start"/);
 assert.match(youth,/id="stop"/);
});
