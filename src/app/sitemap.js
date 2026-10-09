import {config,data,guideUrl,cityUrl,topicUrl} from '@/lib/content';
export default function sitemap(){
 const base=config.siteUrl;if(!base)return [];
 const paths=['/','/cities','/whats-on','/about','/contact','/privacy','/terms','/credits','/editorial-policy','/services','/advertise','/updates',...data.cities.map(cityUrl),...Object.keys(data.categories).map(topicUrl)];
 return [...paths.map(p=>({url:base+p})),...data.stories.map(s=>({url:base+guideUrl(s),...(s.dateModified?{lastModified:s.dateModified}:{})}))];
}
