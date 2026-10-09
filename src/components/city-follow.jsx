'use client';
import {useEffect,useState,useSyncExternalStore} from 'react';
import Link from 'next/link';
import {followKey,cleanPreferences,followCity,unreadUpdates} from '@/lib/traveller.mjs';
const empty={cities:[],seen:{}};
let cache=empty,raw=null;
let memory=null;
function getSnapshot(){
 let next;try{next=localStorage.getItem(followKey);}catch{return memory||empty;}
 if(next!==raw){raw=next;try{cache=JSON.parse(next)||empty;}catch{cache=empty;}}
 return cache;
}
const serverSnapshot=()=>empty;
function subscribe(callback){window.addEventListener('storage',callback);window.addEventListener('sidestreet-follow-change',callback);return ()=>{window.removeEventListener('storage',callback);window.removeEventListener('sidestreet-follow-change',callback);};}
function save(value){memory=value;cache=value;try{localStorage.setItem(followKey,JSON.stringify(value));raw=localStorage.getItem(followKey);}catch{ /* Preferences work for this session when storage is blocked. */ }window.dispatchEvent(new Event('sidestreet-follow-change'));}
export default function CityFollow({cities,feed,cityId=null,compact=false,all=false}){
 const saved=useSyncExternalStore(subscribe,getSnapshot,serverSnapshot);
 const preferences=cleanPreferences(saved,cities);
 const [currentFeed,setCurrentFeed]=useState(feed);
 const [suggestion,setSuggestion]=useState(null);
 const [selected,setSelected]=useState(cityId||'');
 const [open,setOpen]=useState(!compact);
 const [message,setMessage]=useState('');
 useEffect(()=>{
  const controller=new AbortController();
  fetch('/api/location',{signal:controller.signal,cache:'no-store'}).then(r=>r.ok?r.json():null).then(x=>setSuggestion(x)).catch(()=>{});
  let lastRefresh=0;
  const refresh=()=>{if(document.visibilityState==='hidden'||Date.now()-lastRefresh<60000)return;lastRefresh=Date.now();fetch('/api/updates',{signal:controller.signal}).then(r=>r.ok?r.json():feed).then(x=>{if(Array.isArray(x))setCurrentFeed(x);}).catch(()=>{});};
  refresh();window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
  return ()=>{controller.abort();window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);};
 },[feed]);
 const unread=unreadUpdates(currentFeed,preferences);
 const followed=preferences.cities.includes(cityId||selected);
 const selectedCity=cities.find(c=>c.id===(cityId||selected));
 const recommended=cities.filter(c=>suggestion?.cityIds?.includes(c.id));
 const visible=currentFeed.filter(x=>preferences.cities.includes(x.city));
 function toggle(id){
  if(!id)return;
  if(preferences.cities.includes(id)){save({...preferences,cities:preferences.cities.filter(c=>c!==id)});setMessage('City unfollowed.');}
  else{save(followCity(preferences,id,currentFeed));setMessage('City followed. Future additions and dated updates will appear here.');}
 }
 function markRead(){save({...preferences,seen:{...preferences.seen,...Object.fromEntries(visible.map(x=>[x.id,x.version]))}});setMessage('Updates marked as read.');}
 if(compact&&!open)return <button className="updates-toggle" onClick={()=>setOpen(true)}>City updates{unread.length>0&&<span aria-label={unread.length+' unread updates'}> {unread.length}</span>}</button>;
 return <section className={'city-follow '+(compact?'updates-panel':'')} aria-label="Follow cities and updates">
 <div className="follow-heading"><div><span className="eyebrow">YOUR NEXT DESTINATION</span><h2>{cityId?'Follow '+selectedCity?.name:'Your city updates'}</h2></div>{compact&&<button onClick={()=>setOpen(false)} aria-label="Close city updates">Close ×</button>}</div>
 <p>Follow the places you are visiting. News, new guides and dated changes appear when you return to the site.</p>
 {!cityId&&<div className="follow-choice"><label htmlFor={compact?'header-follow-city':'follow-city'}>Choose a city</label><select id={compact?'header-follow-city':'follow-city'} value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select a destination</option>{cities.map(c=><option key={c.id} value={c.id}>{c.name} — {c.country}</option>)}</select></div>}
 <button className="button" disabled={!(cityId||selected)} aria-pressed={followed} onClick={()=>toggle(cityId||selected)}>{followed?'Unfollow':'Follow'}{selectedCity?' '+selectedCity.name:''}</button>
 {!cityId&&recommended.length>0&&<div className="location-suggestions"><p>Approximate network location suggests {suggestion.cityId?cities.find(c=>c.id===suggestion.cityId)?.name:'these destinations'}. Choose any city; travel plans and VPNs may differ.</p>{recommended.map(c=><button key={c.id} onClick={()=>setSelected(c.id)}>{c.name}</button>)}</div>}
 <p className="muted">Saved in this browser. No account, GPS access or background push notifications. <Link href="/privacy">Privacy & choices</Link></p>
 {preferences.cities.length>0&&<><h3>Following</h3><div className="followed-cities">{preferences.cities.map(id=><button key={id} onClick={()=>toggle(id)} aria-label={'Unfollow '+cities.find(c=>c.id===id)?.name}>{cities.find(c=>c.id===id)?.name} ×</button>)}</div><div className="follow-heading"><h3>{unread.length} unread {unread.length===1?'update':'updates'}</h3><button onClick={markRead} disabled={!unread.length}>Mark all as read</button></div><ul className="update-list">{(all?visible:visible.slice(0,8)).map(x=><li key={x.id}><span className="eyebrow">{x.type} / {cities.find(c=>c.id===x.city)?.name}{preferences.seen[x.id]!==x.version?' / NEW':''}</span><Link href={x.href} onClick={()=>save({...preferences,seen:{...preferences.seen,[x.id]:x.version}})}>{x.title}</Link>{x.date&&<small>Updated {x.date}</small>}</li>)}</ul>{!all&&<Link className="text-link" href="/updates">All updates & preferences ↗</Link>}</>}
 <button className="clear-follow" onClick={()=>{save(empty);setMessage('Follow preferences cleared.');}}>Clear follow preferences</button>
 <p role="status" className="follow-status">{message}</p>
 </section>;
}
