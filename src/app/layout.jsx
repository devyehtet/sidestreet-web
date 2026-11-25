import '@fontsource/syne/800.css';
import '@fontsource/oswald/600.css';
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/600.css';
import '@fontsource/playfair-display/400.css';
import './globals.css';
import {Header,Footer} from '@/components/shell';
import {brand,config,data,cityUrl,guideUrl,topicUrl} from '@/lib/content';
import {canServeAds} from '@/lib/publishing.mjs';
import Advertising from '@/components/advertising';
import AnalyticsConsent from '@/components/analytics-consent';
import {AdPreferencesProvider} from '@/components/ad-preferences';
import {adConfiguration} from '@/lib/ad-preferences.mjs';
const origin=config.siteUrl;
const advertisingPaths=['/', '/whats-on', ...data.cities.map(cityUrl), ...data.stories.map(guideUrl), ...Object.keys(data.categories).map(topicUrl)];
export const metadata={...(origin?{metadataBase:new URL(origin)}:{}),robots:{index:Boolean(origin),follow:true,googleBot:{index:Boolean(origin),follow:true,'max-image-preview':'large'}},title:{default:brand+' — City life & global culture',template:'%s | '+brand},description:'Independent city guides, local food, culture and discoveries from Bangkok to the world.',...(config.googleSiteVerification?{verification:{google:config.googleSiteVerification}}:{}),...(config.adsenseClient?{other:{'google-adsense-account':config.adsenseClient}}:{})};
export default function Layout({children}){const reach=adConfiguration();return <html lang="en" data-scroll-behavior="smooth"><body><AdPreferencesProvider enabled={reach.configured} origin={origin}><Header/>{children}<Footer/>{origin&&config.analyticsMeasurementId&&<AnalyticsConsent measurementId={config.analyticsMeasurementId} origin={origin}/>}{canServeAds(config)&&<Advertising client={config.adsenseClient} origin={origin} paths={advertisingPaths}/>}</AdPreferencesProvider></body></html>}
