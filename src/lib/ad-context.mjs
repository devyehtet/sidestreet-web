// Coarse current-page taxonomy only; no browsing history or inferred audience.
export function adPageContext(category){return ['food','travel','hotels'].includes(category)?category:'general';}
export function contextualAdUrl(origin,placementId,context,audienceToken=''){
 const query=new URLSearchParams();
 const category=adPageContext(context);
 if(category!=='general')query.set('context',category);
 if(audienceToken)query.set('audience',audienceToken);
 return origin+'/serve/'+placementId+(query.size?'?'+query.toString():'');
}
