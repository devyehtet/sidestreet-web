import {adPageContext} from '@/lib/ad-context.mjs';
import ReachAd from './reach-ad';
import placements from '@/content/reach-placements.json';
export default function PublisherAd({slot,contained=false,category}){
 const placement=placements[slot];
 if(!placement)return null;
 return <ReachAd serverOrigin={process.env.NEXT_PUBLIC_REACH_AD_SERVER} placementId={placement.placementId} placementName={placement.name} contained={contained} context={adPageContext(category)}/>;
}
