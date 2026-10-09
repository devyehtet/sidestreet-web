import {createHash} from 'node:crypto';
import {data} from '@/lib/content';
import {isUpcoming} from './events.mjs';
const version=record=>createHash('sha256').update(JSON.stringify(record)).digest('hex').slice(0,16);
export function updateFeed(){
 const stories=data.stories.filter(s=>s.city&&s.city!=='global').map(s=>({id:'guide:'+s.slug,city:s.city,title:s.title,description:s.dek,type:s.kind==='news'?'News':'Guide',date:s.dateModified||s.datePublished||'',version:version(s),href:'/guides/'+s.slug}));
 const events=data.events.filter(e=>e.verifiedAt&&isUpcoming(e,data.cities)).map(e=>({id:'event:'+e.id,city:e.city,title:e.title,description:e.blurb,type:'Event',date:e.verifiedAt,version:version(e),href:'/city/'+data.cities.find(c=>c.id===e.city)?.slug}));
 return [...stories,...events].sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
}
