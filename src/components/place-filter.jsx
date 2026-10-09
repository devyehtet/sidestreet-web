'use client';
import {useState} from 'react';
export default function PlaceFilter({kinds,children}){const [kind,setKind]=useState('');return <div className="filter-shell" data-filter={kind||'all'}><div className="filter-chips" role="group" aria-label="Filter places"><button aria-pressed={!kind} onClick={()=>setKind('')}>All places</button>{kinds.map(k=><button key={k.id} aria-pressed={kind===k.id} onClick={()=>setKind(k.id)}>{k.name}</button>)}</div>{children}{kind&&<style>{`.filter-shell[data-filter="${kind}"] [data-place-kind]:not([data-place-kind="${kind}"]){display:none}`}</style>}</div>}
