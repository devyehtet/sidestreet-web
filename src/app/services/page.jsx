import Link from 'next/link';
import {data,config,metadata as pageMetadata} from '@/lib/content';
import StructuredData from '@/components/structured-data';
import {collectionSchema} from '@/lib/seo.mjs';
import ServiceDirectory from '@/components/service-directory';
import categories from '@/content/service-categories.json';
import placements from '@/content/sponsored-placements.json';
import {directoryListings,publicPlacements} from '@/lib/services.mjs';
export const metadata=pageMetadata('The best for your trip — travel services','Find transport, tours, cooking classes, mobile data, luggage storage, stays, restaurants and shops by destination and visitor need.',undefined,'/services');
export const dynamic='force-dynamic';
export default async function Services({searchParams}){
 const params=await searchParams;const city=data.cities.some(c=>c.id===params.city)?params.city:'';
 return <main id="main" className="container directory"><StructuredData value={collectionSchema(config.siteUrl,'Travel services','/services',categories.map(c=>[c.name,'/services']))}/><div className="page-heading"><span className="eyebrow">TRAVEL SERVICES / CHOOSE BY NEED</span><h1>The best for your trip</h1><p>Practical shops and services, matched to the reason you need them.</p></div><div className="service-intro"><p>Choose a destination and category, then compare the current offer directly with the business. Independent listings and paid placements are labelled separately; no invented ratings or universal “best” awards are used.</p><Link className="text-link" href="/advertise">Run a travel business? Advertise with us ↗</Link></div><ServiceDirectory cities={data.cities.map(({id,slug,name})=>({id,slug,name}))} categories={categories} listings={directoryListings(data.places)} sponsored={publicPlacements(placements,categories,data.cities)} sources={data.sources} initialCity={city}/></main>;
}
