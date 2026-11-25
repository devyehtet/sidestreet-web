'use client';
import Script from'next/script';
import{useEffect,useCallback}from'react';
import{usePathname}from'next/navigation';
export default function ReachSDK({serverOrigin,publisherId,origin,pageCategories}){
 const pathname=usePathname();
 const update=useCallback(()=>{if(window.location.origin!==origin)return;const value={key:pathname,category:pageCategories[pathname]||'general'};if(window.ReachPublisher?.version)void window.ReachPublisher.setPage(value);else{window.ReachPublisherQueue=[['setPage',value]];}},[pathname,pageCategories,origin]);
 useEffect(()=>{update();window.addEventListener('reach:sdk-ready',update);return()=>window.removeEventListener('reach:sdk-ready',update);},[update]);
 // One-time withdrawal bridge for visitors who used the old HttpOnly cookie integration.
 // The legacy endpoints remain only to remove those old choices; new learning uses Reach SDK.
 useEffect(()=>{if(window.location.origin!==origin)return;void(async()=>{try{await fetch('/api/audience-profile',{method:'DELETE',headers:{'Content-Type':'application/json'},body:'{}',credentials:'same-origin'});await fetch('/api/ad-preferences',{method:'DELETE',headers:{'Content-Type':'application/json'},body:'{}',credentials:'same-origin'});}catch{/* No new tracking profile is created by the migration. */}})();},[origin]);
 if(!serverOrigin||!/^pub_[a-f0-9]{32}$/.test(publisherId||''))return null;
 return <Script id="reach-publisher-sdk" src={serverOrigin+'/publisher-sdk.js'} data-publisher={publisherId} strategy="afterInteractive" onReady={update}/>;
}
