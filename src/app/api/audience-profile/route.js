import {handleAudienceProfile} from '@/lib/audience-profile.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const GET=request=>handleAudienceProfile(request);
export const POST=()=>Response.json({error:'Use Reach Publisher SDK audience controls. This legacy integration is withdrawal-only.'},{status:410,headers:{'Cache-Control':'no-store'}});
export const DELETE=request=>handleAudienceProfile(request);
