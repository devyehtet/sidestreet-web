import{createHmac,timingSafeEqual}from'node:crypto';
import{AD_CONSENT_VERSION,emptyAdPreference}from'./ad-preference-options.mjs';
export const AD_PREFERENCE_COOKIE='__Host-sidestreet-ad-preferences';
export const PREFERENCE_TTL=30*86400000;
export const TOKEN_TTL=5*60000;
const genders=['all','male','female'],ages=['all','18-25','26-35','36-50'];
const baseHeaders={'Cache-Control':'private, no-store, max-age=0','Vary':'Cookie','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
function mac(value,key){return createHmac('sha256',key).update(value).digest();}
function equalSignature(value,key,sig){try{const bytes=Buffer.from(sig,'base64url'),expected=mac(value,key);return bytes.length===expected.length&&timingSafeEqual(bytes,expected);}catch{return false;}}
function origin(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&u.pathname==='/'&&!u.search&&!u.hash?u.origin:'';}catch{return'';}}
export function adConfiguration(env=process.env){const siteOrigin=origin(env.NEXT_PUBLIC_SITE_URL),serverOrigin=origin(env.NEXT_PUBLIC_REACH_AD_SERVER),publisherId=env.REACH_PUBLISHER_ID||'',signingKey=env.REACH_PUBLISHER_SIGNING_KEY||'',cookieSecret=env.REACH_CONSENT_COOKIE_SECRET||'';return{siteOrigin,serverOrigin,publisherId,signingKey,cookieSecret,configured:Boolean(siteOrigin&&serverOrigin&&/^pub_[a-f0-9]{32}$/.test(publisherId)&&signingKey.length>=32&&cookieSecret.length>=32)};}
export function encodePreference(choice,config,now=Date.now()){
 const value={v:AD_CONSENT_VERSION,choice:choice.choice,issuedAt:now,expiresAt:now+PREFERENCE_TTL};
 if(choice.choice==='granted'){if(choice.adult!==true||choice.consent!==true||!genders.includes(choice.gender)||!ages.includes(choice.ageGroup)||(choice.gender==='all'&&choice.ageGroup==='all'))throw new Error('Choose an adult audience group and explicitly agree, or keep general ads.');Object.assign(value,{adult:true,gender:choice.gender,ageGroup:choice.ageGroup});}
 else if(choice.choice!=='declined')throw new Error('Unsupported ad preference.');
 const payload=Buffer.from(JSON.stringify(value)).toString('base64url');return payload+'.'+mac('sidestreet-preference:'+payload,config.cookieSecret).toString('base64url');
}
export function decodePreference(cookie,config,now=Date.now()){
 if(!cookie||cookie.length>2048)return null;
 try{const[body,sig,...rest]=cookie.split('.');if(rest.length||!sig||!equalSignature('sidestreet-preference:'+body,config.cookieSecret,sig))return null;const p=JSON.parse(Buffer.from(body,'base64url').toString());if(p.v!==AD_CONSENT_VERSION||!Number.isFinite(p.issuedAt)||p.issuedAt>now||!Number.isFinite(p.expiresAt)||p.expiresAt<=now||p.expiresAt-p.issuedAt>PREFERENCE_TTL)return null;if(p.choice==='declined')return{choice:'declined',gender:'all',ageGroup:'all',expiresAt:p.expiresAt};if(p.choice!=='granted'||p.adult!==true||!genders.includes(p.gender)||!ages.includes(p.ageGroup)||(p.gender==='all'&&p.ageGroup==='all'))return null;return{choice:'granted',gender:p.gender,ageGroup:p.ageGroup,expiresAt:p.expiresAt,consentedAt:p.issuedAt};}catch{return null;}
}
export function audienceToken(preference,config,now=Date.now()){
 if(preference?.choice!=='granted')return'';
 const payload=Buffer.from(JSON.stringify({v:1,publisherId:config.publisherId,gender:preference.gender,ageGroup:preference.ageGroup,consent:true,exp:Math.min(now+TOKEN_TTL,preference.expiresAt)})).toString('base64url');return payload+'.'+mac(payload,config.signingKey).toString('base64url');
}
function response(config,preference,now,setCookie){const p=preference||emptyAdPreference;return Response.json({configured:config.configured,version:AD_CONSENT_VERSION,preferences:p,audienceToken:audienceToken(p,config,now),tokenExpiresAt:p.choice==='granted'?Math.min(now+TOKEN_TTL,p.expiresAt):null},{headers:{...baseHeaders,...(setCookie?{'Set-Cookie':`${AD_PREFERENCE_COOKIE}=${setCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${PREFERENCE_TTL/1000}`}:{})}});}
export async function handleAdPreferences(request,env=process.env,now=Date.now()){
 const config=adConfiguration(env);if(!config.configured)return request.method==='GET'?response(config,null,now):Response.json({error:'Ad preferences are temporarily unavailable.'},{status:503,headers:baseHeaders});
 const error=(message,status)=>Response.json({error:message},{status,headers:baseHeaders});
 const suppliedOrigin=request.headers.get('origin'),fetchSite=request.headers.get('sec-fetch-site');
 if(suppliedOrigin&&suppliedOrigin!==config.siteOrigin||fetchSite==='cross-site')return error('Use ad preferences from the Sidestreet website.',403);
 if(request.method==='GET'){const raw=request.headers.get('cookie')?.split(';').map(c=>c.trim()).find(c=>c.startsWith(AD_PREFERENCE_COOKIE+'='))?.slice(AD_PREFERENCE_COOKIE.length+1);return response(config,decodePreference(raw,config,now),now);}
 if(!['POST','DELETE'].includes(request.method))return error('Method not allowed.',405);
 if(suppliedOrigin!==config.siteOrigin)return error('A same-origin request is required.',403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return error('Use a JSON request.',415);
 let input;try{const raw=await request.text();if(raw.length>2048)return error('Request is too large.',413);input=JSON.parse(raw);if(!input||typeof input!=='object'||Array.isArray(input))throw new Error();}catch{return error('Invalid preference request.',400);}
 if(request.method==='DELETE'||input.action==='decline'){
  const cookie=encodePreference({choice:'declined'},config,now);return response(config,decodePreference(cookie,config,now),now,cookie);
 }
 if(input.action!=='grant'||input.version!==AD_CONSENT_VERSION)return error('Review the current ad preference notice before agreeing.',400);
 try{const cookie=encodePreference({choice:'granted',gender:input.gender,ageGroup:input.ageGroup,adult:input.adult,consent:input.consent},config,now);return response(config,decodePreference(cookie,config,now),now,cookie);}catch(e){return error(e.message,400);}
}
