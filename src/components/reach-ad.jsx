'use client';
import{useEffect}from'react';
import{useAdPreferences}from'./ad-preferences';
import{cohortDescription}from'@/lib/ad-preference-options.mjs';
export default function ReachAd({serverOrigin,placementId}){
 const audience=useAdPreferences();
 const configured=audience?.configured,granted=audience?.preferences.choice==='granted';
 const expiresAt=audience?.tokenExpiresAt,refresh=audience?.refreshPreferences;
 useEffect(()=>{if(granted&&expiresAt<=Date.now()+30000)void refresh?.();},[granted,expiresAt,refresh]);
 if(!serverOrigin||!/^pl_[a-f0-9]{32}$/.test(placementId||''))return null;
 const src=serverOrigin+'/serve/'+placementId+(granted&&audience.audienceToken?'?audience='+encodeURIComponent(audience.audienceToken):'');
 return <aside className="reach-publisher-ad container" aria-label="Advertisement"><div className="reach-publisher-ad-label"><span>ADVERTISEMENT</span><span>LOCAL CONNECTIONS / REACH</span></div><div className="reach-publisher-ad-slot">{audience?.loading||(granted&&expiresAt<=Date.now())?<div className="reach-ad-loading" aria-label="Loading advertisement">Loading advertisement…</div>:<iframe key={src} src={src} title="Advertisement — Reach local network" width="300" height="250" loading="lazy" referrerPolicy="origin" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" style={{border:0,display:'block',maxWidth:'100%'}}/>}</div>{configured&&<div className="reach-ad-choice"><div><strong>{granted?'Your ad preferences are on.':'Your guide. Your ad choices.'}</strong><p>{granted?cohortDescription(audience.preferences)+'. Matching ads are selected when available.':'Share optional gender and age preferences, or keep browsing with general ads.'}</p></div><div><button type="button" onClick={audience.openPreferences}>Choose ad preferences</button>{audience.preferences.choice==='unset'&&<button type="button" disabled={audience.busy} onClick={audience.keepGeneral}>Keep general ads</button>}</div></div>}</aside>;
}
