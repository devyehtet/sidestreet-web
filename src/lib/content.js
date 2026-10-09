import data from '@/content/content.json';
import rawConfig from '@/content/site.config.json';
import {resolvePublishing} from './publishing.mjs';
const config = resolvePublishing(rawConfig, process.env);
export { data, config };
export const brand = config.siteName || 'Sidestreet';
export const cityFor = id => data.cities.find(c => c.id === id);
export const guideUrl = s => '/guides/' + s.slug;
export const cityUrl = c => '/city/' + c.slug;
export const topicSlugs = {news:'news',things:'things-to-do',food:'food-and-drink',travel:'travel',hotels:'hotels',music:'music'};
export const topicUrl = id => '/topics/' + topicSlugs[id];
export const photoFor = key => data.images[key];
export function metadata(title, description, image, pathname, options = {}) {
  const photo=photoFor(image)||photoFor(data.stories[0]?.img);
  const url=config.siteUrl&&pathname?config.siteUrl+pathname:undefined;
  const images=config.siteUrl&&photo?[{url:config.siteUrl+photo.src,width:photo.w,height:photo.h,alt:title}]:undefined;
  return {title,description,...(url?{alternates:{canonical:url}}:{}),openGraph:{title,description,type:options.article?'article':'website',siteName:brand,locale:'en_US',...(url?{url}:{}),...(images?{images}:{}),...(options.modifiedTime?{modifiedTime:options.modifiedTime}:{})},twitter:{card:images?'summary_large_image':'summary',title,description,...(images?{images:images.map(p=>p.url)}:{})}};
}
