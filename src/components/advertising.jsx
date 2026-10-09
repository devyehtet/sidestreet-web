'use client';
import {useSyncExternalStore} from 'react';
import Script from 'next/script';
import {usePathname} from 'next/navigation';
const subscribe = () => () => {};
export default function Advertising({client, origin, paths}) {
  const pathname=usePathname();
  const onPublicSite = useSyncExternalStore(subscribe, () => window.location.origin === origin, () => false);
  if (!onPublicSite || !paths.includes(pathname)) return null;
  return <Script id="google-adsense" strategy="afterInteractive" async src={'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+client} crossOrigin="anonymous"/>;
}
