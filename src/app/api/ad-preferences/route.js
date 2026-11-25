import{handleAdPreferences}from'@/lib/ad-preferences.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const GET=request=>handleAdPreferences(request);
export const POST=request=>handleAdPreferences(request);
export const DELETE=request=>handleAdPreferences(request);
