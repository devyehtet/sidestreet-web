import test from 'node:test';
import assert from 'node:assert/strict';
import {publicOrigin,adsenseClient,adsTxt,resolvePublishing,canServeAds} from '../src/lib/publishing.mjs';
const client='ca-pub-1234567890123456';
test('local and malformed domains cannot activate publishing',()=>{
 for(const url of ['http://localhost:3000','https://127.0.0.1','https://example.com','https://guide.test/path','https://user:secret@guide.test','https://guide.test?token=1','invalid'])assert.equal(publicOrigin(url),'');
 assert.equal(publicOrigin('https://guide.test/'),'https://guide.test');
});
test('ads.txt only contains a valid configured seller, with no placeholder',()=>{
 assert.equal(adsTxt(''),'');assert.equal(adsTxt('ca-pub-0000000000000000'),'');
 assert.equal(adsenseClient(client+'\nINJECTED'),'');
 assert.equal(adsTxt(client),'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
});
test('verification can be configured without enabling tracking or ads',()=>{
 const c=resolvePublishing({siteUrl:'',adsenseClient:'',adsenseEnabled:false,consentConfigured:false},{NEXT_PUBLIC_SITE_URL:'https://guide.test',ADSENSE_CLIENT:client});
 assert.equal(c.adsenseClient,client);assert.equal(canServeAds(c),false);
 assert.equal(canServeAds({...c,adsenseEnabled:true}),false);
 assert.equal(canServeAds({...c,adsenseEnabled:true,consentConfigured:true}),true);
 assert.equal(canServeAds({...c,adsenseEnabled:true,consentConfigured:true,siteUrl:''}),false);
});

test('GA4 only accepts a measurement ID, never arbitrary script input',()=>{
 assert.equal(resolvePublishing({}, {NEXT_PUBLIC_GA_MEASUREMENT_ID:'G-9G33152W7G'}).analyticsMeasurementId,'G-9G33152W7G');
 for(const id of ['', 'UA-123-1', 'G-ABC<script>', 'G-ABC&secret=1'])assert.equal(resolvePublishing({}, {NEXT_PUBLIC_GA_MEASUREMENT_ID:id}).analyticsMeasurementId,'');
});
