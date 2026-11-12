import test from 'node:test';
import assert from 'node:assert/strict';
import {newsPhase,currentNews} from '../src/lib/news-lifecycle.mjs';
const cities=[{id:'nyc',timezone:'America/New_York'},{id:'bkk',timezone:'Asia/Bangkok'}];
test('news remains active through the destination local final day',()=>{
 const story={kind:'news',city:'nyc',newsWindow:{start:'2026-10-31',end:'2026-11-01'}};
 assert.equal(newsPhase(story,cities,new Date('2026-11-02T03:00:00Z')),'active');
 assert.equal(newsPhase(story,cities,new Date('2026-11-02T06:00:00Z')),'archive');
});
test('homepage excludes archives and unbounded reports from current programme picks',()=>{
 const now=new Date('2026-11-12T12:00:00Z');
 const stories=[{id:'old',kind:'news',city:'bkk',newsWindow:{end:'2026-11-01'}},{id:'report',kind:'news',city:'bkk'},{id:'next',kind:'news',city:'bkk',newsWindow:{start:'2026-11-14',end:'2026-11-29'}},{id:'guide',kind:'guide',city:'bkk'}];
 assert.deepEqual(currentNews(stories,cities,now).map(s=>s.id),['next']);
 assert.equal(newsPhase(stories[1],cities,now),'report');
 assert.equal(newsPhase(stories[3],cities,now),null);
});
