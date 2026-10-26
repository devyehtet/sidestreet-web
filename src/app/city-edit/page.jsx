import Link from 'next/link';
import {data,config,cityFor,guideUrl,metadata as pageMetadata} from '@/lib/content';
import {StoryCard,SectionTitle} from '@/components/editorial';
import StructuredData from '@/components/structured-data';
import {collectionSchema} from '@/lib/seo.mjs';
export const metadata=pageMetadata('The City Edit: 30 Ideas for Your Next Outing','Explore 30 researched food, shopping, garden and culture guides across 18 cities, with venue photographs, maps and practical ways to plan your visit.','syd-opera-house','/city-edit');
export default function CityEdit(){
 const stories=data.stories.filter(s=>s.editorialCollection==='city-edit-oct26');
 const cities=data.cities.filter(c=>stories.some(s=>s.city===c.id));
 return <main id="main" className="container directory"><StructuredData value={collectionSchema(config.siteUrl,'The City Edit','/city-edit',stories.map(s=>[s.title,guideUrl(s)]))}/><div className="page-heading"><span className="eyebrow">THE SIDESTREET CITY EDIT / OCTOBER 2026</span><h1>30 REASONS<br/>TO GO OUT.</h1><p>Food worth planning for. Places worth looking at. A slower way to see the city. Find your next outing across {cities.length} destinations.</p></div><nav className="destination-pills city-edit-nav" aria-label="Jump to a destination">{cities.map(c=><a href={'#edit-'+c.id} key={c.id}>{c.name} ↓</a>)}</nav><p className="city-edit-note">Independent research guides with official venue, tourism or publisher references. Photographs are licensed archive images. Suggested visit formats are editorial ideas; these are not firsthand reviews.</p>{cities.map(c=><section key={c.id} id={'edit-'+c.id} className="editorial-section"><SectionTitle eyebrow={c.country} title={cityFor(c.id).name} href={'/city/'+c.slug} label="Full city guide"/><div className="story-grid three">{stories.filter(s=>s.city===c.id).map(s=><StoryCard key={s.id} story={s}/>)}</div></section>)}<Link className="button" href="/cities">KEEP EXPLORING ↗</Link></main>
}
