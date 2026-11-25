import{handleAdPreferences}from'@/lib/ad-preferences.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const GET=request=>handleAdPreferences(request);
export const POST=()=>Response.json({error:'Use Reach Publisher SDK audience controls. This legacy integration is withdrawal-only.'},{status:410,headers:{'Cache-Control':'no-store'}});
export const DELETE=async request=>{const response=await handleAdPreferences(request);if(response.ok)response.headers.set('Set-Cookie','__Host-sidestreet-ad-preferences=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');return response;};
