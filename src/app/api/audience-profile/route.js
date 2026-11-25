import {handleAudienceProfile} from '@/lib/audience-profile.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const GET=request=>handleAudienceProfile(request);
export const POST=request=>handleAudienceProfile(request);
export const DELETE=request=>handleAudienceProfile(request);
