import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const data = JSON.parse(fs.readFileSync(new URL('src/content/content.json', root), 'utf8'));
const config = JSON.parse(fs.readFileSync(new URL('src/content/site.config.json', root), 'utf8'));
const changes = JSON.parse(fs.readFileSync(new URL('docs/ADSENSE-CONTENT-REMEDIATION-2026-10-19.json', root), 'utf8'));
const rewritten = new Set(changes.guides.map(g => g.slug));
const prose = story => [...(story.body || []), ...(story.items || []).map(item => item.text), ...(story.sections || []).filter(section => !section.relatedReading).flatMap(section => section.p || [])];
const paragraphs = new Map();
for (const story of data.stories) for (const text of prose(story)) {
 const key = text.trim().replace(/\s+/gu, ' ').toLowerCase();
 if (key) paragraphs.set(key, new Set([...(paragraphs.get(key) || []), story.slug]));
}
const home = fs.readFileSync(new URL('src/app/page.jsx', root), 'utf8');
const guides = data.stories.map(story => {
 const sourceIds = [...new Set([...(story.src || []), ...(story.sections || []).flatMap(s => [s.sourceId, ...(s.sourceIds || [])]).filter(Boolean)])];
 const sources = sourceIds.map(id => data.sources[id]).filter(Boolean);
 const mainProseWords = prose(story).join(' ').trim().split(/\s+/u).filter(Boolean).length;
 const indicators = [];
 if (mainProseWords < 300) indicators.push('Short main prose: manually check whether the reader task is fully answered; no Google minimum word count is implied.');
 if (sources.length && sources.every(source => new URL(source.url).hostname.replace(/^www\./u, '') === 'timeout.com')) indicators.push('Research references are exclusively a third-party editorial publication; verify claims with primary sources.');
 if (!(story.places?.length || story.items?.length || story.planLinks?.length)) indicators.push('No place selection, comparison items or practical next-step links recorded; inspect for generic planning advice.');
 if (!story.researchNote) indicators.push('Research scope is not recorded.');
 const repeatedWith = [...new Set(prose(story).flatMap(text => [...(paragraphs.get(text.trim().replace(/\s+/gu, ' ').toLowerCase()) || [])]).filter(slug => slug !== story.slug))];
 if (repeatedWith.length) indicators.push('Exact article paragraph also appears in another guide; inspect whether duplication adds value.');
 return {slug:story.slug, title:story.title, linkedFromHome:home.includes(`'${story.id}'`), mainProseWords, sources:sourceIds, sourceCheckDates:sources.map(source => ({url:source.url, consultedAt:source.consultedAt || null})), textRewriteRecorded:rewritten.has(story.slug), fullPublisherReview:'pending', indicators, repeatedWith};
}).sort((a,b) => Number(b.linkedFromHome)-Number(a.linkedFromHome) || b.indicators.length-a.indicators.length || a.mainProseWords-b.mainProseWords);
const report = {
 date:new Date().toISOString().slice(0,10),
 purpose:'Manual editorial review queue after the low-value-content rejection. This is not a plagiarism test, factual verification, legal clearance, quality score or Google approval predictor.',
 summary:{guides:guides.length, priorityTextRewrites:guides.filter(g => g.textRewriteRecorded).length, remainingTextReviews:guides.filter(g => !g.textRewriteRecorded).length, fullPublisherReviewsPending:guides.length, shortMainProse:guides.filter(g => g.mainProseWords<300).length, exclusivelyTimeOutSources:guides.filter(g => g.indicators.some(i => i.startsWith('Research references'))).length, sitewideEditorialSignoff:config.editorialReviewComplete === true},
 requiredReview:['The article solves a specific reader task with place-specific detail and original comparison or analysis.','Operational claims agree with primary sources and the text, tables, map anchors and place cards agree.','No invented visit, expertise, rating, price or current operating guarantee.','Original image file, licence conditions, author attribution, crops and contextual accuracy have been checked individually.','Publisher has read the final article and accepted responsibility for its accuracy.'],
 guides:process.argv.includes('--summary')?undefined:guides
};
console.log(JSON.stringify(report, null, 2));
if (process.argv.includes('--strict') && !report.summary.sitewideEditorialSignoff) process.exitCode=1;
