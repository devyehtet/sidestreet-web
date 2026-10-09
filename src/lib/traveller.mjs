export const followKey='sidestreet-follow-v1';
export const countryCodes={Thailand:'TH',Myanmar:'MM',Singapore:'SG',Malaysia:'MY',Vietnam:'VN',Japan:'JP','South Korea':'KR','United Kingdom':'GB',Portugal:'PT','United States':'US',Mexico:'MX',Argentina:'AR',Australia:'AU','South Africa':'ZA',Cambodia:'KH',Taiwan:'TW','China · Hong Kong SAR':'HK',France:'FR','Türkiye':'TR',Spain:'ES',Italy:'IT',Netherlands:'NL',Germany:'DE','United Arab Emirates':'AE',Indonesia:'ID',Nepal:'NP',Morocco:'MA'};
const normalize=v=>String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function locationSuggestion(city,country,cities){
 let decoded='';try{decoded=decodeURIComponent(city||'');}catch{ /* An invalid location is ignored. */ }
 const candidates=cities.filter(c=>countryCodes[c.country]===country);
 const match=candidates.find(c=>[c.name,c.slug,...(c.geoAliases||[])].some(n=>normalize(n)===normalize(decoded)&&normalize(decoded)));
 return {cityId:match?.id||null,country:countryCodes[candidates[0]?.country]?country:null,cityIds:candidates.map(c=>c.id)};
}
export function cleanPreferences(value,cities){
 if(!value||typeof value!=='object')return {cities:[],seen:{}};
 const ids=new Set(cities.map(c=>c.id));
 return {cities:[...new Set((Array.isArray(value.cities)?value.cities:[]).filter(id=>ids.has(id)))].slice(0,32),seen:Object.fromEntries(Object.entries(value.seen&&typeof value.seen==='object'?value.seen:{}).filter(([k,v])=>k.length<160&&typeof v==='string'&&v.length<100).slice(0,500))};
}
export function unreadUpdates(feed,preferences){return feed.filter(x=>preferences.cities.includes(x.city)&&preferences.seen[x.id]!==x.version);}
export function followCity(preferences,cityId,feed){return {cities:[...new Set([...preferences.cities,cityId])],seen:{...preferences.seen,...Object.fromEntries(feed.filter(x=>x.city===cityId).map(x=>[x.id,x.version]))}};}
