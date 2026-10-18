'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {mapSearchUrl,directionsUrl} from '@/lib/guide-navigation.mjs';

export default function GuideNavigator({navigation,sections,cityName}) {
 const [selected,setSelected]=useState(0);
 const [activeSection,setActiveSection]=useState('');
 const [routeVisible,setRouteVisible]=useState(false);
 const routeRef=useRef(null);
 useEffect(()=>{
  if(!routeRef.current)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setRouteVisible(true);observer.disconnect();}},{threshold:.1});
  observer.observe(routeRef.current);return ()=>observer.disconnect();
 },[]);
 const {stops,ordered,routeUrl}=navigation;
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{
   const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
   if(visible[0])setActiveSection(visible[0].target.id);
  },{rootMargin:'-8% 0px -65% 0px',threshold:0});
  for(const {id} of sections){const el=document.getElementById(id);if(el)observer.observe(el);}
  return ()=>observer.disconnect();
 },[sections]);
 const stop=stops[selected];
 const columns=Math.min(stops.length,4);
 const positions=stops.map((_,i)=>({x:stops.length===1?50:14+(i%columns)*72/Math.max(1,columns-1),y:stops.length>4?(i<4?30:72):(i%2?65:35)}));
 const line=positions.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
 return <section id="guide-navigation" className={'guide-navigator'+(routeVisible?' route-is-visible':'')} ref={routeRef} aria-label="Guide navigation">
 {stops.length>0&&<>
 <header className="route-heading"><div><span className="eyebrow">{ordered?'FOLLOW THE SIDE STREETS':'YOUR PLACES, AT A GLANCE'}</span><h2>{navigation.title}</h2><p>{navigation.summary}</p></div><span className="route-count mono"><span>{stops.length} {ordered?'STOPS':'PLACES'}</span><span>{cityName||'WORLDWIDE'}</span></span></header>
 <div className="route-workspace">
 <div className="route-visual"><div className="route-map-label mono">{ordered?'SUGGESTED WALK':'PLACE EXPLORER'} <span>↗</span></div>
 <div className="route-diagram" aria-label={ordered?'Schematic walking sequence, not a geographic map':'Place selector, not a walking sequence'}>
 <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="route-base" d={ordered?line:''}/>{ordered&&<path className="route-draw" pathLength="1" d={line}/>}</svg>
 {stops.map((s,i)=><button key={s.query} type="button" className={'route-pin '+(selected===i?'is-active':'')} style={{left:positions[i].x+'%',top:positions[i].y+'%'}} aria-pressed={selected===i} aria-controls="selected-guide-stop" aria-label={'Show '+(ordered?'stop ':'place ')+(i+1)+': '+s.name} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,'0')}</span></button>)}
 </div><p className="route-map-caption">{ordered?'Schematic stop order, not to scale.':'Places shown independently, not in walking order.'} Open Google Maps for streets and current directions.</p></div>
 <div className="route-stop-panel" id="selected-guide-stop" aria-live="polite" aria-atomic="true"><div className="route-stop-content" key={selected}><span className="eyebrow">{ordered?'STOP':'PLACE'} {String(selected+1).padStart(2,'0')} / {String(stops.length).padStart(2,'0')}</span><h3>{stop.name}</h3><p>{stop.note}</p><div className="route-stop-actions"><a className="button" href={directionsUrl(stop.query,undefined,ordered?'walking':undefined)} target="_blank" rel="noopener noreferrer">Directions here ↗</a><a href={mapSearchUrl(stop.query)} target="_blank" rel="noopener noreferrer">View on Google Maps ↗</a>{stop.href&&<Link href={stop.href}>Place details ↗</Link>}</div></div><div className="route-step-controls"><button type="button" onClick={()=>setSelected(i=>i-1)} disabled={selected===0} aria-label="Previous place">← Previous</button><span className="mono">{selected+1} / {stops.length}</span><button type="button" onClick={()=>setSelected(i=>i+1)} disabled={selected===stops.length-1} aria-label="Next place">Next →</button></div></div>
 </div>
 <ol className="route-stop-list" aria-label={ordered?'Suggested stop order':'Choose a place'}>{stops.map((s,i)=><li key={s.query}><button type="button" onClick={()=>setSelected(i)} aria-pressed={selected===i}><span className="route-list-number mono">{String(i+1).padStart(2,'0')}</span><span>{s.name}</span>{selected===i&&<span aria-hidden="true">↗</span>}</button></li>)}</ol>
 <footer className="route-footer">{routeUrl&&<a className="button" href={routeUrl} target="_blank" rel="noopener noreferrer">Open walking route ↗</a>}<p>{navigation.total>stops.length?`${stops.length} of ${navigation.total} places shown here; see all listings below. `:''}{ordered?'A suggested sequence: confirm access and crossings before setting off.':'Choose the places that suit your trip.'} Directions open in Google Maps.</p></footer>
 </>}
 {sections.length>0&&<nav id="guide-chapters" className="guide-chapters" aria-label="In this guide"><div className="guide-chapter-heading"><span className="eyebrow">READ YOUR WAY</span><h2>Inside this guide</h2><span className="mono">{sections.length} SECTIONS</span></div><ol>{sections.map(({label,id},i)=><li key={id}><a href={'#'+id} aria-current={activeSection===id?'location':undefined}><span className="mono">{String(i+1).padStart(2,'0')}</span>{label}<span aria-hidden="true">↓</span></a></li>)}</ol></nav>}
 </section>;
}
