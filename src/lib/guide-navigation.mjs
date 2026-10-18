import {sectionId} from './seo.mjs';

export function mapSearchUrl(query) {
 return 'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query}).toString();
}
export function directionsUrl(destination,origin,mode) {
 return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',destination,...(origin?{origin}:{}),...(mode?{travelmode:mode}:{})}).toString();
}
export function walkingRouteUrl(stops) {
 // Mobile browsers support at most three intermediate waypoints.
 if(stops.length<2||stops.length>5)return null;
 return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:stops[0].query,destination:stops.at(-1).query,...(stops.length>2?{waypoints:stops.slice(1,-1).map(s=>s.query).join('|')} : {}),travelmode:'walking'}).toString();
}
export function guideSections(story,places) {
 return [...(story.quickPlan?[['Plan this outing','plan-this-outing']]:story.faq?.length?[[story.faq[0][0],'quick-answer']]:[]),...(story.items||[]).map((item,i)=>{const title=places.find(p=>p.id===item.p)?.name||item.n;return [title,sectionId(title,i)];}),...(story.sections||[]).filter(s=>!s.relatedReading).map((s,i)=>[s.h,sectionId(s.h,i+(story.items||[]).length)]),...(story.tips?.length?[['Good to know','good-to-know']]:[]),...(story.faq?.length>(story.quickPlan?0:1)?[['Common questions','common-questions']]:[])].map(([label,id])=>({label,id}));
}
export function guideNavigation(story,places,cities) {
 const route=story.navigationRoute;
 if(route?.mode==='walking'&&route.stops?.length>=2&&route.stops.length<=5&&route.stops.every(s=>s.name&&s.query&&s.note))return {ordered:true,title:route.title,summary:route.summary,stops:route.stops,routeUrl:walkingRouteUrl(route.stops),total:route.stops.length};
 const ids=[...new Set([...(story.places||[]),...(story.items||[]).map(x=>x.p).filter(Boolean)])];
 const found=ids.map(id=>places.find(p=>p.id===id)).filter(Boolean);
 return {ordered:false,title:'Find your next stop',summary:'Choose a place to see its map and plan your journey.',stops:found.slice(0,8).map(p=>{const city=cities.find(c=>c.id===p.city);return {name:p.name,query:[p.name,p.area,city?.name,city?.country].filter(Boolean).join(', '),note:p.blurb,href:city?'/city/'+city.slug+'#'+p.id:null};}),routeUrl:null,total:found.length};
}
