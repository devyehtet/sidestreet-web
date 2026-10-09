"use client";
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
const key='sidestreet-analytics-consent-v1';
const lifetime=180*24*60*60*1000;

export default function AnalyticsConsent({measurementId,origin}){
 const pathname=usePathname();
 const [choice,setChoice]=useState(null);
 const [loaded,setLoaded]=useState(false);
 const [ready,setReady]=useState(false);
 const [open,setOpen]=useState(false);
 const [production,setProduction]=useState(false);
 const started=useRef(false);
 const previousPage=useRef('');
 useEffect(()=>{
  setProduction(window.location.origin===origin);
  try{
   const saved=JSON.parse(localStorage.getItem(key));
   if(saved&&['accepted','rejected'].includes(saved.choice)&&saved.expires>Date.now())setChoice(saved.choice);
  }catch{ /* A blocked storage area leaves consent unset. */ }
  setLoaded(true);
 },[origin]);
 useEffect(()=>{
  if(!ready||choice!=='accepted'||!pathname||previousPage.current===pathname)return;
  const page=origin+pathname;
  let referrer='';
  try{const u=new URL(previousPage.current?origin+previousPage.current:document.referrer);referrer=u.origin+u.pathname;}catch{ /* Direct visit. */ }
  window.gtag('set',{page_location:page,page_referrer:referrer});
  window.gtag('event','page_view',{page_location:page,page_referrer:referrer,page_title:document.title,send_to:measurementId});
  previousPage.current=pathname;
 },[ready,choice,pathname,origin,measurementId]);
 function select(next){
  try{localStorage.setItem(key,JSON.stringify({choice:next,expires:Date.now()+lifetime}));}catch{ /* Choice still applies to this visit. */ }
  if(next==='rejected'&&started.current){
   window['ga-disable-'+measurementId]=true;
   window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   document.cookie.split(';').forEach(c=>{
    const name=c.trim().split('=')[0];
    if(!/^_ga(?:_|$)/.test(name))return;
    const hostname=window.location.hostname;
    for(const domain of ['',hostname,'.'+hostname])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'');
   });
   window.location.reload();
   return;
  }
  setChoice(next);setOpen(false);
 }
 function initialize(){
  if(started.current)return;
  started.current=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted'});
  window.gtag('js',new Date());
  window.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:origin+window.location.pathname,page_referrer:''});
  setReady(true);
 }
 if(!loaded||!production)return null;
 return <>
  {choice==='accepted'&&<Script id="sidestreet-ga4" src={'https://www.googletagmanager.com/gtag/js?id='+measurementId} strategy="afterInteractive" onReady={initialize}/>}
  {(choice===null||open)?<section className="analytics-consent" role="region" aria-label="Analytics preferences">
   <h2>Help us improve the guide</h2>
   <p>May we use Google Analytics cookies to understand which guides readers enjoy? You can browse either way. <Link href="/privacy">Privacy policy</Link></p>
   <div><button type="button" onClick={()=>select('rejected')}>Reject analytics</button><button type="button" onClick={()=>select('accepted')}>Accept analytics</button>{choice!==null&&<button type="button" onClick={()=>setOpen(false)}>Close</button>}</div>
  </section>:<button className="analytics-preferences" type="button" onClick={()=>setOpen(true)}>Analytics preferences</button>}
 </>;
}
