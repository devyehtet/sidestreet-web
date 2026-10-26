import {Photo} from '@/components/editorial';
import {data,cityFor} from '@/lib/content';
import {sectionId} from '@/lib/seo.mjs';
export default function RoundupPick({item,index}){
 const place=data.places.find(p=>p.id===item.p);
 if(!place)return null;
 const query=[place.name,place.area,cityFor(place.city)?.name].filter(Boolean).join(', ');
 return <section className="roundup-pick" id={sectionId(place.name,index)}>
  <div className="pick-photo"><Photo id={place.img} alt={place.name} credit note="Archive photograph of this venue." sizes="(max-width:760px) 100vw, 50vw"/><span className="pick-number" aria-label={'Selection '+(index+1)}>{String(index+1).padStart(2,'0')}</span></div>
  <div className="pick-copy"><span className="pick-badge">BEST FOR · {item.bestFor}</span><h2>{place.name}</h2><p className="pick-address">{place.area} · {cityFor(place.city)?.name}</p><p>{item.text}</p><h3>Why it makes our edit</h3><p>{item.whyPick}</p><h3>Before you go</h3><p>{item.beforeYouGo}</p><div className="pick-actions"><a href={place.url} target="_blank" rel="noopener noreferrer">Website & enquiries ↗</a><a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query)} target="_blank" rel="noopener noreferrer">Find on Maps ↗</a></div><div className="section-sources"><span>Research:</span>{item.sourceIds.map(id=><a key={id} href={data.sources[id].url} target="_blank" rel="noopener noreferrer">{data.sources[id].name} ↗</a>)}</div></div>
 </section>;
}
