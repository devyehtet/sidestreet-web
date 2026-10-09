'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
export default function Search({entries}) {
 const [query,setQuery]=useState('');const [open,setOpen]=useState(false);const input=useRef(null);
 useEffect(()=>{const onKey=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.current?.focus();setOpen(true)}if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[]);
 const q=query.trim().toLowerCase();const hits=q.length>=2?entries.filter(e=>(e.title+' '+e.keywords).toLowerCase().includes(q)).slice(0,8):[];
 return <div className="search-box"><label className="sr-only" htmlFor="site-search">Search cities, guides and places</label><span aria-hidden="true">⌕</span><input ref={input} id="site-search" type="search" placeholder="Find your next discovery…" value={query} onChange={e=>{setQuery(e.target.value);setOpen(true)}} onFocus={()=>setOpen(true)}/><kbd>⌘ K</kbd>{open&&q.length>=2&&<div className="search-results"><div className="search-result-head"><span>{hits.length?'Discoveries':'No matches found'}</span><button aria-label="Close search results" onClick={()=>setOpen(false)}>×</button></div>{hits.map(h=><Link key={h.href} href={h.href} onClick={()=>setOpen(false)}>{h.title}<small>{h.label}</small></Link>)}{!hits.length&&<p>Try a city, a dish or a landmark.</p>}</div>}</div>;
}
