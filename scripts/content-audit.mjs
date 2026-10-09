import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const data = JSON.parse(fs.readFileSync(new URL('src/content/content.json', root), 'utf8'));
const errors = [];
const warnings = [];
const known = (list, key) => new Set(list.map(item => item[key]));
const cities = known(data.cities, 'id');
const places = known(data.places, 'id');
const categories = new Set(Object.keys(data.categories));
function unique(list, key, label) {
  const seen = new Set();
  for (const item of list) { if (!item[key] || seen.has(item[key])) errors.push(`${label}: missing or duplicate ${key} ${item[key]}`); seen.add(item[key]); }
}
function references(ids, owner) { for (const id of ids || []) if (!data.sources[id]) errors.push(`${owner}: unknown source ${id}`); }
function image(id, owner) { if (id && !data.images[id]) errors.push(`${owner}: unknown image ${id}`); }
function webUrl(url, owner) { if (!url) return; try { if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error(); } catch { errors.push(`${owner}: invalid web URL`); } }
for (const [list, label] of [[data.cities,'City'],[data.stories,'Guide'],[data.places,'Place'],[data.events,'Event']]) unique(list, 'id', label);
unique(data.stories, 'slug', 'Guide'); unique(data.cities, 'slug', 'City');
for (const [id, source] of Object.entries(data.sources)) webUrl(source.url, `Source ${id}`);
for (const [id, img] of Object.entries(data.images)) {
  if (!img.by || /see file page/i.test(img.by) || !img.lic || !img.page) errors.push(`Image ${id}: incomplete credit`);
  if (!img.src?.startsWith('/images/') || !fs.existsSync(new URL(`public${img.src}`, root))) errors.push(`Image ${id}: local file missing`);
  if (img.lic?.startsWith('CC') && !img.licUrl) errors.push(`Image ${id}: licence link missing`);
  if (img.page?.startsWith('/') && !fs.existsSync(new URL(`public${img.page}`, root))) errors.push(`Image ${id}: local source missing`);
}
for (const city of data.cities) image(city.img, city.id);
for (const place of data.places) {
  if (!cities.has(place.city)) errors.push(`${place.id}: unknown city`);
  image(place.img, place.id); references(place.src, place.id); webUrl(place.url, place.id);
  if (!place.url && !place.src?.length) warnings.push(`${place.id}: no venue or research link`);
}
for (const event of data.events) {
  if (!cities.has(event.city)) errors.push(`${event.id}: unknown event city`);
  references(event.src, event.id); webUrl(event.url, event.id);
}
const rows = data.stories.map(story => {
  if (story.city !== 'world' && !cities.has(story.city)) errors.push(`${story.id}: unknown city ${story.city}`);
  if (!categories.has(story.cat)) errors.push(`${story.id}: unknown category`);
  if (!story.img) errors.push(`${story.id}: missing lead image`);
  image(story.img, story.id);
  const ids = [...new Set([...(story.src || []),...(story.sections || []).flatMap(s => [s.sourceId,...(s.sourceIds || [])]).filter(Boolean)])];
  references(ids, story.id);
  for (const id of [...(story.places || []),...(story.items || []).map(i => i.p).filter(Boolean)]) if (!places.has(id)) errors.push(`${story.id}: unknown place ${id}`);
  const parts = [story.title,story.dek,...(story.body || []),...(story.tips || []),...(story.items || []).map(i=>i.text),...(story.sections || []).flatMap(s=>[s.h,...s.p]),...(story.faq || []).flat(),...(story.quickPlan || []).flat(),...(story.planTable?.rows || []).flat()];
  const words = parts.join(' ').trim().split(/\s+/u).length;
  if (!ids.length) warnings.push(`${story.slug}: no research references`);
  return {slug:story.slug, words, sources:ids.length, planning:Boolean(story.quickPlan), modified:story.dateModified || ''};
});
console.log(JSON.stringify({guides:rows.length,places:data.places.length,images:Object.keys(data.images).length,errors,warnings,articles:process.argv.includes('--summary')?undefined:rows},null,2));
if (errors.length) process.exitCode = 1;
