import test from 'node:test';
import assert from 'node:assert/strict';
import {placeFacts} from '../src/lib/place-facts.mjs';
test('an article source date cannot imply a place price was checked',()=>{
 const rows=placeFacts({hours:'10am–5pm',price:'฿250',src:['venue']},{venue:{url:'https://venue.example',consultedAt:'2026-10-19'}});
 assert.deepEqual(rows.map(r=>r.checkedAt),[null,null]);assert.equal(rows[0].label,'Reference hours');
});
test('field-specific review never certifies an unreviewed cost or an unrelated source',()=>{
 const p={hours:'10am–5pm',price:'฿250',src:['venue'],factReview:{checkedAt:'2026-10-19',sourceIds:['venue'],fields:['hours']}};
 const sources={venue:{url:'https://venue.example'}};
 assert.equal(placeFacts(p,sources)[0].checkedAt,'2026-10-19');assert.equal(placeFacts(p,sources)[1].checkedAt,null);
 assert.equal(placeFacts({...p,src:[]},sources)[0].checkedAt,null);
 assert.equal(placeFacts({...p,factReview:{...p.factReview,checkedAt:'2026-02-31'}},sources)[0].checkedAt,null);
 assert.deepEqual(placeFacts({},sources),[]);
});
