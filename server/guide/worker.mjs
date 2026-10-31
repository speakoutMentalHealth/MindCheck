import '../../js/guide-content.js';
import { explain } from './provider.mjs';
import { verifyAdultToken } from './age-entitlement.mjs';
const {topics}=globalThis.MindCheckGuideContent;
const origin='https://mindcheck.speakoutmentalhealth.org';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':origin,'Vary':'Origin','X-Content-Type-Options':'nosniff'};
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
async function smallBody(request){const reader=request.body?.getReader();if(!reader)throw Error('Missing body');let count=0,body='';const decoder=new TextDecoder();try{for(;;){const {done,value}=await reader.read();if(done)break;count+=value.byteLength;if(count>256){await reader.cancel();throw Error('Body too large');}body+=decoder.decode(value,{stream:true});}return JSON.parse(body+decoder.decode());}finally{reader.releaseLock();}}
export function createHandler(generate=explain){return async function(request,env){
 if(request.headers.get('Origin')!==origin)return reply({error:'Unavailable'},403);
 if(new URL(request.url).pathname!=='/')return reply({error:'Not found'},404);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Max-Age':'600'}});
 if(request.method!=='POST')return reply({error:'Method not allowed'},405);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return reply({error:'Use JSON'},415);
 let data;try{data=await smallBody(request);}catch(_){return reply({error:'Invalid selection'},400);}
 if(!data||Array.isArray(data)||Object.keys(data).sort().join(',')!=='adult,language,question'||data.adult!==true||!Object.hasOwn(topics,data.question)||!['en','fr'].includes(data.language))return reply({error:'Invalid selection'},400);
 const topic=topics[data.question],fact=(topic[data.language]||topic).answer;
 const fallback=reason=>reply({source:'prepared',answer:fact,reason});
 // Generated AI requires a trusted, signed adult entitlement. Browser DOB or
 // adult:true is not proof of adulthood. All missing settings fail closed.
 if(env.GUIDE_REQUIRE_ADULT_TOKEN!=='true')return fallback('authorization');
 const authorization=request.headers.get('Authorization')||'';
 const match=/^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(authorization);
 if(!match||!await verifyAdultToken(env.AGE_AUTH_SECRET,match[1]))return fallback('authorization');
 // Reviewed free-pilot regions: Nigeria and US. Missing country fails closed.
 // Origin checks are CORS hygiene, not authentication. The limiter is mandatory.
 if(env.GUIDE_ENABLED!=='true')return fallback('disabled');
 if(!env.GEMINI_API_KEY||!env.GEMINI_MODEL||!env.GUIDE_LIMITER)return fallback('configuration');
 if(!['NG','US'].includes(request.cf?.country))return fallback('region');
 try{
  const limit=await env.GUIDE_LIMITER.limit({key:'mindcheck-guide-pilot'});if(!limit.success)return fallback('busy');
  const answer=await generate(env,fact,data.language,AbortSignal.timeout(12000));
  if(typeof answer!=='string'||answer.trim().length<10||answer.length>900||/[<>]|https?:|www\.|\b(prescrib|medicat|diagnos|dosage|cure|suicid)/i.test(answer))return fallback('output');
  return reply({source:'gemini',answer:answer.trim()});
 }catch(error){const status=Number(error?.statusCode);const reason=error?.name==='TimeoutError'||error?.name==='AbortError'?'timeout':status===429?'quota':status===401||status===403?'provider_access':status===404?'model':status===400?'provider_request':'provider';return fallback(reason);} // Never return or log provider errors, keys, requests or IP addresses.
};}
export default {fetch:createHandler()};
