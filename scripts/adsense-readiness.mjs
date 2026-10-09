import fs from 'node:fs';
import {resolvePublishing,publicOrigin,contactEmail,adsenseClient,canServeAds} from '../src/lib/publishing.mjs';
const raw=JSON.parse(fs.readFileSync(new URL('../src/content/site.config.json',import.meta.url),'utf8'));
const config=resolvePublishing(raw,process.env);
const rows=[
 ['Public HTTPS domain configured',Boolean(publicOrigin(config.siteUrl))],
 ['Publisher name supplied',Boolean(config.publisherName?.trim())],
 ['Working public contact email supplied',Boolean(contactEmail(config.contactEmail))&&config.contactEmailReady===true],
 ...(!process.argv.includes('--pre-application')?[['AdSense publisher ID supplied',Boolean(adsenseClient(config.adsenseClient))]]:[]),
 ['Originality, facts and photo licences reviewed',config.editorialReviewComplete===true&&/^\d{4}-\d{2}-\d{2}$/.test(config.editorialReviewedAt||'')],
];
console.log('AdSense application preparation — local configuration check');
if(process.argv.includes('--pre-application'))console.log('Pre-application mode: an AdSense ID is not required yet.');
for(const [label,ready] of rows)console.log(`${ready?'OK':'PENDING'}  ${label}`);
console.log(`Ads: ${canServeAds(config)?'configured for public origin':'disabled'}`);
console.log('Always pending here: deploy, verify public reachability and live HTTPS, then submit the site in your AdSense account.');
console.log('Before serving ads: publish the applicable Google-certified CMP messages and verify actual consent behaviour.');
console.log('This report does not verify email delivery, domain ownership, content quality, consent compliance or Google approval.');
if(process.argv.includes('--strict')&&rows.some(([,ready])=>!ready))process.exitCode=1;
