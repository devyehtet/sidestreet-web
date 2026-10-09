import {data,metadata as pageMetadata} from '@/lib/content';
import {Events} from '@/components/editorial';
export const dynamic='force-dynamic';
export const metadata=pageMetadata('What’s on around the world','Upcoming festivals, concerts and recurring markets across our city guides.',undefined,'/whats-on');
export default function WhatsOn(){return <main id="main" className="container directory"><div className="page-heading"><span className="eyebrow">THE CULTURAL CALENDAR</span><h1>WHAT’S<br/><span className="stroke-text-dark">ON.</span></h1><p>Festivals, concerts, markets, and the dates that bring a city to life.</p></div><Events events={data.events}/><p className="muted">Event dates may change. Confirm with the organiser before booking travel.</p></main>}
