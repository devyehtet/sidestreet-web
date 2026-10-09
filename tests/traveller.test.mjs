import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {locationSuggestion,cleanPreferences,followCity,unreadUpdates} from '../src/lib/traveller.mjs';
import {publicPlacements,directoryListings} from '../src/lib/services.mjs';
const data=JSON.parse(readFileSync(new URL('../src/content/content.json',import.meta.url)));
const categories=JSON.parse(readFileSync(new URL('../src/content/service-categories.json',import.meta.url)));
test('geo suggestions require matching country, tolerate encoded city and never force a fallback city',()=>{
 assert.equal(locationSuggestion('Chiang%20Mai','TH',data.cities).cityId,'cnx');
 assert.equal(locationSuggestion('Bangkok','US',data.cities).cityId,null);
 assert.equal(locationSuggestion('%invalid','TH',data.cities).cityId,null);
 assert.deepEqual(locationSuggestion(null,null,data.cities),{cityId:null,country:null,cityIds:[]});
 assert.deepEqual(locationSuggestion('unknown','TH',data.cities).cityIds,['bkk','cnx','hkt']);
});
test('following establishes a baseline; changed versions and additions notify only followed cities',()=>{
 const feed=[{id:'a',city:'bkk',version:'1'},{id:'b',city:'cnx',version:'1'}];
 const prefs=followCity(cleanPreferences(null,data.cities),'bkk',feed);
 assert.equal(unreadUpdates(feed,prefs).length,0);
 const changed=[{id:'a',city:'bkk',version:'2'},{id:'b',city:'cnx',version:'2'},{id:'c',city:'bkk',version:'1'}];
 assert.deepEqual(unreadUpdates(changed,prefs).map(x=>x.id),['a','c']);
 assert.equal(unreadUpdates(changed,{...prefs,cities:[]}).length,0);
 assert.deepEqual(cleanPreferences({cities:['invalid','bkk','bkk'],seen:{a:123,b:'1'}},data.cities),{cities:['bkk'],seen:{b:'1'}});
});
test('only confirmed active sponsors with valid destinations, categories and safe URLs appear',()=>{
 const sponsor={id:'test',status:'published',sponsorshipConfirmed:true,city:'bkk',category:'tours',name:'Example',bestFor:'A group tour',description:'An agreed description',url:'https://example.com',startsAt:'2026-10-01',endsAt:'2026-10-31'};
 const now=new Date('2026-10-10T12:00:00Z');
 const show=p=>publicPlacements([p],categories,data.cities,now).length;
 assert.equal(show(sponsor),1);
 for(const changes of [{status:'draft'},{sponsorshipConfirmed:false},{endsAt:'2026-10-09'},{startsAt:'2026-10-11'},{city:'unknown'},{category:'fake'},{url:'javascript:alert(1)'},{url:'https://user:password@example.com'},{startsAt:'2026-02-30'},{id:''}])assert.equal(show({...sponsor,...changes}),0);
 assert.equal(publicPlacements([],categories,data.cities,now).length,0);
});
test('service directory resolves every category and never treats independent businesses as sponsors',()=>{
 const listings=directoryListings(data.places);
 assert.ok(listings.length>0);
 assert.ok(listings.every(p=>categories.some(c=>c.id===p.category)&&p.sponsored===false));
 assert.equal(listings.find(p=>p.id==='bkk-private-guide').category,'tours');
 assert.equal(listings.find(p=>p.id==='bkk-luggage-bounce').category,'luggage');
});
