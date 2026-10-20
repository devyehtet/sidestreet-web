import Link from 'next/link';
import StructuredData from '@/components/structured-data';
import {collectionSchema,breadcrumbSchema} from '@/lib/seo.mjs';
import {notFound} from 'next/navigation';
import {data,config,topicSlugs,metadata as pageMetadata} from '@/lib/content';
import planning from '@/content/topic-planning.json';
import {StoryCard,SectionTitle,Places} from '@/components/editorial';

export function generateStaticParams(){return Object.values(topicSlugs).map(slug=>({slug}))}
export async function generateMetadata({params}){
 const {slug}=await params;
 const id=Object.keys(topicSlugs).find(id=>topicSlugs[id]===slug);
 if(!id)notFound();
 const plan=planning[id];
 return pageMetadata(plan?.title||data.categories[id],plan?.description||'City guides and practical field notes about '+data.categories[id]+'.',undefined,'/topics/'+slug);
}
export default async function Topic({params}){
 const {slug}=await params;
 const id=Object.keys(topicSlugs).find(id=>topicSlugs[id]===slug);
 if(!id)notFound();
 const stories=data.stories.filter(s=>s.cat===id);
 if(id==='news')stories.reverse().sort((a,b)=>(b.datePublished||'').localeCompare(a.datePublished||''));
 const plan=planning[id];
 return <main id="main" className="container directory">
  <StructuredData value={collectionSchema(config.siteUrl,data.categories[id],'/topics/'+slug,stories.map(s=>[s.title,'/guides/'+s.slug]))}/>
  <StructuredData value={breadcrumbSchema(config.siteUrl,[['Home','/'],[data.categories[id],'/topics/'+slug]])}/>
  <div className="page-heading"><span className="eyebrow">THE EDITORIAL SECTORS / {stories.length} GUIDES</span><h1>{data.categories[id]}</h1><p>{plan?.intro||'Local favourites, practical field notes and a different perspective.'}</p></div>
  {plan&&<section className="city-planning" aria-labelledby="topic-start"><h2 id="topic-start">{plan.heading}</h2><ul className="city-planning-links">{plan.links.map(([guide,label,description])=><li key={guide}><Link href={'/guides/'+guide}>{label} ↗</Link><p>{description}</p></li>)}</ul></section>}
  <div className="story-grid three">{stories.map(s=><StoryCard story={s} key={s.id}/>)}</div>
  {id==='hotels'&&<section className="editorial-section"><SectionTitle eyebrow="WHERE TO STAY" title="HOTELS IN OUR GUIDE"/><Places places={data.places.filter(p=>p.kind==='stay')}/></section>}
 </main>
}
