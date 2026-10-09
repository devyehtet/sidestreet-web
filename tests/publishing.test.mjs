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
