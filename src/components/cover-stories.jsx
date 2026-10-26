'use client';

import {useRef,useState} from 'react';
import Link from 'next/link';

export default function CoverStories({stories}) {
 const [selected,setSelected]=useState(0);
 const tabs=useRef([]);
 function move(event,index){
  let next;
  if(event.key==='ArrowRight')next=(index+1)%stories.length;
  else if(event.key==='ArrowLeft')next=(index+stories.length-1)%stories.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=stories.length-1;
  else return;
  event.preventDefault();setSelected(next);tabs.current[next]?.focus();
 }
 return <div className="magazine-hero">
  {stories.map((s,index)=><article key={s.id} id={'cover-panel-'+index} role="tabpanel" tabIndex={0} aria-labelledby={'cover-tab-'+index} hidden={selected!==index} className="magazine-panel">
   <img className="magazine-image" src={s.photo.src} srcSet={s.photo.variants?.length?[...s.photo.variants,{src:s.photo.src,w:s.photo.w}].map(v=>`${v.src} ${v.w}w`).join(', '):undefined} sizes="(max-width:1520px) 100vw, 1456px" alt={s.photo.alt||s.photo.title||s.label} width={s.photo.w} height={s.photo.h} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'}/>
   <div className="magazine-shade"/>
   <span className="hero-edition">THE SIDESTREET EDIT <span>0{index+1} / 0{stories.length}</span></span>
   <div className="magazine-copy"><span className="hero-category">{s.label}</span><h2>{s.title}</h2><p>{s.description}</p><Link className="hero-read" href={s.href}>{s.action} <span aria-hidden="true">↗</span></Link></div>
  </article>)}
  <div className="cover-tabs" role="tablist" aria-label="Featured city stories">{stories.map((s,index)=><button key={s.id} ref={el=>{tabs.current[index]=el}} id={'cover-tab-'+index} role="tab" type="button" aria-selected={selected===index} aria-controls={'cover-panel-'+index} tabIndex={selected===index?0:-1} onClick={()=>setSelected(index)} onKeyDown={e=>move(e,index)}><span className="cover-tab-number">0{index+1}</span><span>{s.label}<strong>{s.title}</strong></span><span className="cover-tab-arrow" aria-hidden="true">↗</span></button>)}</div>
 </div>;
}
