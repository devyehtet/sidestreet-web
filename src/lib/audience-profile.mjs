import{createHmac,randomBytes,timingSafeEqual}from'node:crypto';
import{adConfiguration}from'./ad-preferences.mjs';
export const AUDIENCE_LEARNING_VERSION='reach-model-2026-11-v1';
export const AUDIENCE_COOKIE='__Host-sidestreet-audience-learning';
const TTL=30*86400000,features=['food','travel','hotels','music','things'];
const headers={'Cache-Control':'private, no-store, max-age=0','Vary':'Cookie','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
const absent={consented:false,audienceToken:'',tokenExpiresAt:null,interests:[],prediction:{gender:'unknown',ageGroup:'unknown'},status:'not-consented'};
function cookie(value,config){const body=Buffer.from(JSON.stringify(value)).toString('base64url');return body+'.'+createHmac('sha256',config.cookieSecret).update('audience-learning:'+body).digest('base64url');}
function read(request,config,now){try{const value=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(AUDIENCE_COOKIE+'='))?.slice(AUDIENCE_COOKIE.length+1);if(!value||value.length>1024)return null;const[body,sig,...rest]=value.split('.'),expected=createHmac('sha256',config.cookieSecret).update('audience-learning:'+body).digest(),actual=Buffer.from(sig,'base64url');if(rest.length||actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;const p=JSON.parse(Buffer.from(body,'base64url').toString());if(p.v!==AUDIENCE_LEARNING_VERSION||!(/^[a-f0-9]{32}$/).test(p.id)||p.adult!==true||!Number.isFinite(p.issuedAt)||p.issuedAt>now||!Number.isFinite(p.expiresAt)||p.expiresAt<=now||p.expiresAt-p.issuedAt>TTL)return null;return p;}catch{return null;}}
function respond(config,value,setCookie,maxAge=TTL/1000){const response=Response.json({configured:config.configured,version:AUDIENCE_LEARNING_VERSION,...value},{headers});if(setCookie!==undefined)response.headers.append('Set-Cookie',`${AUDIENCE_COOKIE}=${setCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${setCookie?maxAge:0}`);return response;}
export async function reachAudience(config,input,transport=fetch,now=Date.now()){
 const time=String(now),nonce=randomBytes(16).toString('hex'),body=JSON.stringify(input),signature=createHmac('sha256',config.signingKey).update(time+'.'+nonce+'.'+body).digest('base64url');
 const response=await transport(config.serverOrigin+'/audience/profile',{method:'POST',headers:{'Content-Type':'application/json','x-reach-publisher':config.publisherId,'x-reach-time':time,'x-reach-nonce':nonce,'x-reach-signature':signature},body,cache:'no-store',signal:AbortSignal.timeout(5000)});if(!response.ok)throw new Error('Audience service is temporarily unavailable.');return response.json();
}
export async function handleAudienceProfile(request,env=process.env,now=Date.now(),transport=fetch){
 const config=adConfiguration(env),error=(message,status)=>Response.json({error:message,...absent},{status,headers});
 if(!config.configured)return respond(config,absent);
 const suppliedOrigin=request.headers.get('origin');if(suppliedOrigin&&suppliedOrigin!==config.siteOrigin||request.headers.get('sec-fetch-site')==='cross-site')return error('Use audience learning on Sidestreet.',403);
 const profile=read(request,config,now);const send=input=>reachAudience(config,input,transport,now);
 async function withdraw(){if(!profile)return respond(config,absent,'');try{await send({action:'withdraw',profileId:profile.id});return respond(config,{...absent,deleted:true},'');}catch{return respond(config,{...absent,pendingDeletion:true,status:'withdrawal-pending',message:'Collection stopped. Profile deletion will retry when the service is available.'},cookie({...profile,pending:true},config),Math.max(0,Math.floor((profile.expiresAt-now)/1000)));}}
 if(request.method==='GET'){if(!profile)return respond(config,absent);if(profile.pending)return withdraw();try{const state=await send({action:'read',profileId:profile.id});return respond(config,state,state.consented?undefined:'');}catch{return error('Audience learning is unavailable. General/contextual ads remain available.',503);}}
 if(!['POST','DELETE'].includes(request.method))return error('Method not allowed.',405);
 if(suppliedOrigin!==config.siteOrigin)return error('A same-origin request is required.',403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return error('Use a JSON request.',415);
 let input;try{const body=await request.text();if(body.length>2048)return error('Request is too large.',413);input=JSON.parse(body);if(!input||typeof input!=='object'||Array.isArray(input))throw new Error();}catch{return error('Invalid audience request.',400);}
 if(request.method==='DELETE')return withdraw();
 if(input.action==='event'){if(!profile||profile.pending)return error('Audience consent is required.',403);if(!features.includes(input.category)||typeof input.eventId!=='string'||!/^[a-f0-9]{32}$/.test(input.eventId))return error('Invalid category event.',400);try{return respond(config,await send({action:'event',profileId:profile.id,category:input.category,eventId:input.eventId}));}catch{return error('Audience learning is temporarily unavailable.',503);}}
 if(input.action!=='grant'||input.version!==AUDIENCE_LEARNING_VERSION||input.adult!==true||input.consent!==true)return error('Review the adult audience-learning notice and explicitly agree.',400);
 const gender=input.gender??'all',ageGroup=input.ageGroup??'all',training=input.training===true;if(!['all','male','female'].includes(gender)||!['all','18-25','26-35','36-50'].includes(ageGroup)||((gender!=='all'||ageGroup!=='all')&&!training))return error('Optional training answers require the separate training agreement.',400);
 try{if(profile)await send({action:'withdraw',profileId:profile.id});const next={v:AUDIENCE_LEARNING_VERSION,id:randomBytes(16).toString('hex'),adult:true,issuedAt:now,expiresAt:now+TTL};const state=await send({action:'grant',profileId:next.id,version:AUDIENCE_LEARNING_VERSION,adult:true,consent:true,training,gender,ageGroup});return respond(config,state,cookie(next,config));}catch{return error('Could not enable audience learning. No new tracking profile was enabled.',503);}
}
