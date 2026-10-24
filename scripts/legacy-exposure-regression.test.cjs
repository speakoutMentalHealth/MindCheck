/* Public frontend legacy-access regression guard.
 * Does not contact endpoints, enumerate private records, or reveal credentials.
 * This checks only selected known public entrypoints, not deployed backends.
 */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const read=path=>readFileSync(path,'utf8');
const publicEntrypoints=[
 'index.html','age-entry.html','youth.html',
 'certificate/index.html','verify.html'
];
test('deprecated cash payout and attendee-list API are absent from public entrypoints',()=>{
 for(const path of publicEntrypoints){
  const source=read(path);
  assert.doesNotMatch(source,/award_claim|cash[_ -]?claim|sheetdb\\.io\\/api\\/v1\\//i,path+' includes deprecated payout or list API integration');
 }
});
test('youth page includes no third-party scripts or external-data submissions',()=>{
 const source=read('youth.html');
 assert.doesNotMatch(source,/<script[^>]+src\\s*=/i);
 assert.doesNotMatch(source,/fetch\\s*\\(|XMLHttpRequest|sendBeacon\\s*\\(/i);
 assert.doesNotMatch(source,/<(?:form|input|textarea)\\b/i);
 assert.doesNotMatch(source,/href=["'][^"']*(?:guide\\.html|assessment-centre\\.html|report\\.html)/i);
});
test('analytics exclude health, report and certificate routes and do not record form contents',()=>{
 const source=read('js/mindcheck-analytics.js');
 const privacy=read('scripts/analytics-privacy.test.cjs');
 assert.match(source,/Unknown routes, reports, screenings, chats, monitoring and certificates are excluded/);
 assert.match(privacy,/health, support, certificates and unknown routes send nothing/);
 assert.doesNotMatch(source,/FormData\\s*\\(|\\.value\\s*[,+)]|localStorage\\.getItem\\(/);
});
test('security handover keeps receiver-owner and credential retirement as unverified tasks',()=>{
 const source=read('docs/backend-security-handover.md');
 assert.match(source,/backend verification is NOT complete/i);
 assert.match(source,/Rotate or revoke the old credential/i);
 assert.match(source,/authenticated owner\\/editor access/i);
});
