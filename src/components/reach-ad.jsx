// A direct iframe avoids a third-party script dependency in the publisher page.
export default function ReachAd({serverOrigin,placementId}) {
  if (!serverOrigin || !/^pl_[a-f0-9]{32}$/.test(placementId || '')) return null;
  return <aside className="reach-publisher-ad container" aria-label="Advertisement">
    <div className="reach-publisher-ad-label"><span>ADVERTISEMENT</span><span>LOCAL CONNECTIONS / REACH</span></div>
    <div className="reach-publisher-ad-slot"><iframe
      src={`${serverOrigin}/serve/${placementId}`}
      title="Advertisement — Reach local network"
      width="300" height="250" loading="lazy" referrerPolicy="origin"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      style={{border:0,display:'block',maxWidth:'100%'}}
    /></div>
  </aside>;
}
