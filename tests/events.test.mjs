import test from 'node:test';
import assert from 'node:assert/strict';
import {isUpcoming,localDate} from '../src/lib/events.mjs';
const cities=[{id:'nyc',timezone:'America/New_York'},{id:'bkk',timezone:'Asia/Bangkok'}];
test('New York events remain visible on their local final day',()=>{
 const now=new Date('2026-11-01T00:30:00Z');
 assert.equal(localDate('America/New_York',now),'2026-10-31');
 assert.equal(isUpcoming({city:'nyc',date:'2026-10-31'},cities,now),true);
 assert.equal(isUpcoming({city:'nyc',date:'2026-10-31'},cities,new Date('2026-11-01T05:30:00Z')),false);
});
test('recurring events persist and sample products stay excluded',()=>{
 assert.equal(isUpcoming({recur:'Every Sunday'},cities),true);
 assert.equal(isUpcoming({sample:true,recur:'Every Sunday'},cities),false);
});

test('unconfirmed research never appears as an upcoming event',()=>{
 assert.equal(isUpcoming({publicationStatus:'research',city:'bkk',date:'2099-01-01'},cities),false);
 assert.equal(isUpcoming({publicationStatus:'research',recur:'Every Sunday'},cities),false);
});
