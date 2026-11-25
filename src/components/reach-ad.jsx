'use client';
import{useEffect}from'react';
import{useAdPreferences}from'./ad-preferences';
export default function ReachAd({serverOrigin,placementId}){
 const audience=useAdPreferences();
 const granted=audience?.preferences.choice==='granted';
 const expiresAt=audience?.tokenExpiresAt,refresh=audience?.refreshPreferences;
 useEffect(()=>{if(granted&&expiresAt<=Date.now()+30000)void refresh?.();},[granted,expiresAt,refresh]);
 if(!serverOrigin||!/^pl_[a-f0-9]{32}$/.test(placementId||''))return null;
 const src=serverOrigin+'/serve/'+placementId+(granted&&audience.audienceToken?'?audience='+encodeURIComponent(audience.audienceToken):'');
 return <aside className="reach-publisher-ad container" aria-label="Advertisement"><div className="reach-publisher-ad-label"><span>ADVERTISEMENT</span><span>LOCAL CONNECTIONS / REACH</span></div><div className="reach-publisher-ad-slot">{audience?.loading||(granted&&expiresAt<=Date.now())?<div className="reach-ad-loading" aria-label="Loading advertisement">Loading advertisement…</div>:<iframe key={src} src={src} title="Advertisement — Reach local network" width="300" height="250" loading="lazy" referrerPolicy="origin" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" style={{border:0,display:'block',maxWidth:'100%'}}/>}</div></aside>;
}
