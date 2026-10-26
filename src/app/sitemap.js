import {config,data,guideUrl,cityUrl,topicUrl} from '@/lib/content';
export default function sitemap(){
 const base=config.siteUrl;if(!base)return [];
 const paths=['/','/cities','/best-of','/whats-on','/about','/contact','/privacy','/terms','/credits','/editorial-policy','/corrections','/advertising-policy','/services','/advertise','/updates',...Object.keys(data.categories).map(topicUrl)];
 return [...paths.map(p=>({url:base+p})),...data.cities.map(c=>({url:base+cityUrl(c),...(c.dateModified?{lastModified:c.dateModified}:{})})),...data.stories.map(s=>({url:base+guideUrl(s),...(s.dateModified?{lastModified:s.dateModified}:{})}))];
}
