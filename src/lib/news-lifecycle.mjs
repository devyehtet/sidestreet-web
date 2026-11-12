import {localDate} from './events.mjs';

// An event period is not a source-check date or proof of current operation.
export function newsPhase(story, cities, now = new Date()) {
 if(story.kind !== 'news') return null;
 const window=story.newsWindow;
 if(!window?.end || !/^\d{4}-\d{2}-\d{2}$/.test(window.end)) return 'report';
 const timezone=cities.find(city=>city.id===story.city)?.timezone || 'UTC';
 const today=localDate(timezone,now);
 if(window.end < today) return 'archive';
 if(window.start && window.start > today) return 'upcoming';
 return 'active';
}
export function currentNews(stories,cities,now=new Date()) {
 return stories.filter(story=>['active','upcoming'].includes(newsPhase(story,cities,now)))
  .sort((a,b)=>(b.dateModified||b.datePublished||'').localeCompare(a.dateModified||a.datePublished||''));
}
