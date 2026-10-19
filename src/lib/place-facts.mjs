// A source check applies only to the fields explicitly reviewed for this place.
export function placeFacts(place, sources) {
 const review=place.factReview;
 const checkedAt=review?.checkedAt;
 const dateValid=typeof checkedAt==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)&&Number.isFinite(Date.parse(checkedAt))&&new Date(checkedAt).toISOString().slice(0,10)===checkedAt;
 const sourcesValid=Array.isArray(review?.sourceIds)&&review.sourceIds.length>0&&review.sourceIds.every(id=>sources[id]?.url&&(place.src||[]).includes(id));
 return ['hours','price'].filter(field=>typeof place[field]==='string'&&place[field].trim()).map(field=>{
  const sourceChecked=Boolean(dateValid&&sourcesValid&&review.fields?.includes(field));
  return {field,value:place[field],label:(sourceChecked?'Published ':'Reference ')+(field==='hours'?'hours':'cost'),checkedAt:sourceChecked?checkedAt:null};
 });
}
