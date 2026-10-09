import {updateFeed} from '@/lib/update-feed';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(updateFeed(),{headers:{'Cache-Control':'public, max-age=60, s-maxage=60'}});}
