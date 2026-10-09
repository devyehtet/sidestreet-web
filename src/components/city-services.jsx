import Link from 'next/link';
import {data} from '@/lib/content';
import categories from '@/content/service-categories.json';
import placements from '@/content/sponsored-placements.json';
import {publicPlacements} from '@/lib/services.mjs';
export default function CityServices({city}){
 const paid=publicPlacements(placements,categories,data.cities).filter(p=>p.city===city.id);
 return <section className="city-services"><span className="eyebrow">THE BEST FOR YOUR TRIP</span><h2>Useful services in {city.name}</h2><p>Find transport, meals, shops and bookable experiences by the task you need help with.</p><Link className="button" href={'/services?city='+city.id}>Explore {city.name} services ↗</Link>{paid.map(p=><article className="service-card sponsored" key={p.id}><span className="sponsor-label">Sponsored · Paid placement</span><h3>{p.name}</h3><p><strong>Best for:</strong> {p.bestFor}</p><p>{p.description}</p><a href={p.url} target="_blank" rel="sponsored noopener noreferrer">Visit advertiser ↗</a></article>)}</section>;
}
