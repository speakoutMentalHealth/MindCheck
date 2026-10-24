import test from 'node:test';
import assert from 'node:assert/strict';
import {ageFromDateOfBirth, ageBand} from './age-policy.mjs';
const today = new Date(2026,9,24);
test('adult boundary',()=>{assert.equal(ageFromDateOfBirth('2008-10-24',today),18);assert.equal(ageBand(18),'adult');});
test('minor boundary',()=>{assert.equal(ageFromDateOfBirth('2008-10-25',today),17);assert.equal(ageBand(17),'teen');});
test('child boundary',()=>{assert.equal(ageBand(12),'child');assert.equal(ageBand(13),'teen');});
test('leap dates',()=>{assert.equal(ageFromDateOfBirth('2025-02-29',today),null);assert.equal(ageFromDateOfBirth('2024-02-29',today),2);});
test('invalid or future date',()=>{for(const date of ['2027-01-01','2026-13-01','2026-04-31','hello','1899-01-01']) assert.equal(ageFromDateOfBirth(date,today),null);});
