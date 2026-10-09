import CityFollow from '@/components/city-follow';
import {data,metadata as pageMetadata} from '@/lib/content';
import {updateFeed} from '@/lib/update-feed';
export const metadata=pageMetadata('Follow cities and updates','Choose destinations and find their news, new guides and event updates. Preferences stay in your browser.',undefined,'/updates');
export default function Updates(){return <main id="main" className="container directory"><div className="page-heading"><span className="eyebrow">CITY NEWS / YOUR DESTINATIONS</span><h1>Follow your next trip</h1></div><CityFollow all cities={data.cities.map(({id,name,country})=>({id,name,country}))} feed={updateFeed()}/></main>;}
