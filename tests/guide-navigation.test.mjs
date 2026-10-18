import test from 'node:test';
import assert from 'node:assert/strict';
import {guideNavigation,mapSearchUrl,walkingRouteUrl,directionsUrl,guideSections} from '../src/lib/guide-navigation.mjs';
test('place comparisons never become an invented walking route',()=>{
 const places=[{id:'a',name:'A & B',city:'b',area:'Old Town',blurb:'Choose an appointment'},{id:'c',name:'Other shop',city:'b'}];
 const nav=guideNavigation({places:['a','a'],items:[{p:'c'}]},places,[{id:'b',name:'Bangkok',country:'Thailand',slug:'bangkok'}]);
 assert.equal(nav.ordered,false);assert.equal(nav.routeUrl,null);assert.equal(nav.stops.length,2);
 assert.match(nav.stops[0].query,/Bangkok, Thailand/);assert.equal(new URL(mapSearchUrl(nav.stops[0].query)).searchParams.get('query'),nav.stops[0].query);
});
test('walking routes preserve stop order within mobile waypoint limits',()=>{
 const stops=['Start & station','Middle | lane','Finish café'].map(query=>({query}));
 const url=new URL(walkingRouteUrl(stops));assert.equal(url.searchParams.get('origin'),stops[0].query);assert.equal(url.searchParams.get('waypoints'),stops[1].query);assert.equal(url.searchParams.get('destination'),stops[2].query);assert.equal(url.searchParams.get('travelmode'),'walking');assert.equal(url.searchParams.get('api'),'1');
 assert.equal(walkingRouteUrl(Array(6).fill({query:'stop'})),null);assert.equal(walkingRouteUrl([]),null);
 const destination=new URL(directionsUrl('A & B, Bangkok'));assert.equal(destination.searchParams.has('origin'),false);assert.equal(destination.searchParams.get('destination'),'A & B, Bangkok');
});
test('chapter links keep article IDs stable and skip related-reading sections',()=>{
 const story={quickPlan:[['Time','2 hours']],items:[{p:'a'}],sections:[{h:'Read this'},{h:'Elsewhere',relatedReading:true}],faq:[['Q','A']]};
 assert.deepEqual(guideSections(story,[{id:'a',name:'A stop'}]).map(s=>s.id),['plan-this-outing','section-1-a-stop','section-2-read-this','common-questions']);
});
