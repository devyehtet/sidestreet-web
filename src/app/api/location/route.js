import {data} from '@/lib/content';
import {locationSuggestion} from '@/lib/traveller.mjs';
export const dynamic='force-dynamic';
export async function GET(request){
 const suggestion=locationSuggestion(request.headers.get('x-vercel-ip-city'),request.headers.get('x-vercel-ip-country'),data.cities);
 return Response.json(suggestion,{headers:{'Cache-Control':'private, no-store','Vary':'x-vercel-ip-city, x-vercel-ip-country'}});
}
