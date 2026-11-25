// Reach Publisher SDK owns the iframe, placement dimensions and current targeting.
// This server-rendered slot also works across Next.js client-side route changes.
export default function ReachAd({serverOrigin,placementId,placementName,contained=false,context='general'}){
 if(!serverOrigin||!/^pl_[a-f0-9]{32}$/.test(placementId||''))return null;
 return <aside className={'reach-publisher-ad '+(contained?'reach-ad-contained':'container')} aria-label={placementName?'Advertisement — '+placementName:'Advertisement'} data-ad-placement={placementId} data-ad-context={context}><div className="reach-publisher-ad-label"><span>ADVERTISEMENT</span><span>LOCAL CONNECTIONS / REACH</span></div><div className="reach-publisher-ad-slot" data-reach-placement={placementId}/></aside>;
}
