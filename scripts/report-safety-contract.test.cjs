const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('report.html','utf8');

test('emergency and lack-of-monitoring guidance remain visible',()=>{
 assert.match(source,/Reports are not monitored continuously/i);
 assert.match(source,/immediate danger/i);
 assert.match(source,/href="tel:112"/);
 assert.match(source,/role="status" aria-live="polite"/);
});
test('an HTTP receipt is not described as confirmed storage or human response',()=>{
 assert.match(source,/acknowledged by the receiving service/i);
 assert.match(source,/response times are not guaranteed/i);
 assert.doesNotMatch(source,/report (?:was|has been) (?:saved|reviewed|assigned)/i);
 assert.doesNotMatch(source,/we will (?:definitely|always) (?:reply|respond)/i);
});
test('unconfirmed submissions retain user text and explain possible receipt ambiguity',()=>{
 assert.match(source,/We could not confirm a receipt/i);
 assert.match(source,/The report may still have arrived/i);
 assert.match(source,/Your text is kept here/i);
 assert.match(source,/if \(receipt\) \{/);
 assert.match(source,/form\.reset\(\)/);
});
test('receipt parsing is bounded and requires strict acknowledgement',()=>{
 assert.match(source,/length > 8192/);
 assert.match(source,/response\.ok/);
 assert.match(source,/parsed\.ok === true/);
 assert.match(source,/AbortController\(\)/);
 assert.match(source,/if\(busy\)return/);
});
