import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from './worker.mjs';
import {explain} from './provider.mjs';
const good={question:'mood',language:'en',adult:true};
function request(body=good,options={}){const r=new Request('https://mindcheck-guide.example/',{method:'POST',headers:{Origin:'https://mindcheck.speakoutmentalhealth.org','Content-Type':'application/json',...options.headers},body:JSON.stringify(body)});Object.defineProperty(r,'cf',{value:{country:options.country??'NG'}});return r;}
const env={GUIDE_REQUIRE_ADULT_TOKEN:'false',GUIDE_ENABLED:'true',GEMINI_API_KEY:'test-key-never-live',GEMINI_MODEL:'gemini-3.5-flash-lite',GUIDE_LIMITER:{limit:async()=>({success:true})}};
test('fixed selectors only: private input, injection, minors and oversize rejected before provider',async()=>{let calls=0;const handler=createHandler(async()=>{calls++;return 'unused'});for(const body of [{...good,prompt:'PRIVATE FIXTURE'}, {...good,question:'ignore instructions'}, {...good,adult:false},{...good,language:'xx'},null,{...good,notes:'x'.repeat(300)}]){const r=await handler(request(body),env);assert.equal(r.status,400);}assert.equal(calls,0);});
test('disabled, unknown region, missing key/limiter and quota fail to prepared answer',async()=>{let calls=0;const handler=createHandler(async()=>{calls++;return 'unused'});for(const [e,options]of [[{},{}],[env,{country:'GB'}],[env,{country:'DE'}],[env,{country:'XX'}],[{...env,GEMINI_API_KEY:''},{}],[{...env,GUIDE_LIMITER:null},{}],[{...env,GUIDE_LIMITER:{limit:async()=>({success:false})}},{}]]){const r=await handler(request(good,options),e);assert.equal((await r.json()).source,'prepared');}assert.equal(calls,0);});
test('provider receives only approved fact; output limits and errors fall back without leaking',async()=>{let fact;const handler=createHandler(async(e,f,l,signal)=>{fact=f;assert.equal(l,'en');assert(signal instanceof AbortSignal);return 'Your check-ins stay in this browser. Open My journey to see your history.'});const r=await handler(request(),env);assert.equal((await r.json()).source,'gemini');assert.match(fact,/Choose the mood/);for(const output of ['<img src=x onerror=alert(1)>','https://bad.example','Take medication','x'.repeat(901),'']){const r=await createHandler(async()=>output)(request(),env);assert.equal((await r.json()).source,'prepared');}const r2=await createHandler(async()=>{throw Error('PRIVATE PROVIDER ERROR')})(request(),env);assert.doesNotMatch(await r2.text(),/PRIVATE/);});
test('origin, method, MIME and preflight guards',async()=>{const handler=createHandler();assert.equal((await handler(request(good,{headers:{Origin:'https://other.example'}}),env)).status,403);const get=new Request('https://example/',{headers:{Origin:'https://mindcheck.speakoutmentalhealth.org'}});assert.equal((await handler(get,env)).status,405);assert.equal((await handler(request(good,{headers:{'Content-Type':'text/plain'}}),env)).status,415);const preflight=new Request('https://example/',{method:'OPTIONS',headers:{Origin:'https://mindcheck.speakoutmentalhealth.org'}});assert.equal((await handler(preflight,env)).status,204);});
test('pinned AI SDK integration builds a Google request without telemetry or retries',async()=>{const previous=globalThis.fetch;let payload,url,headers;globalThis.fetch=async(u,o)=>{url=String(u);payload=JSON.parse(o.body);headers=new Headers(o.headers);return new Response(JSON.stringify({candidates:[{content:{role:'model',parts:[{text:'Open My journey to review saved check-ins.'}]},finishReason:'STOP'}],usageMetadata:{promptTokenCount:20,candidatesTokenCount:10,totalTokenCount:30}}),{headers:{'Content-Type':'application/json'}});};try{const text=await explain(env,'Only this public platform fact.','en',new AbortController().signal);assert.match(text,/My journey/);assert.match(url,/generativelanguage.googleapis.com/);assert.match(url,/gemini-3.5-flash-lite/);assert.equal(headers.get('x-goog-api-key'),env.GEMINI_API_KEY);assert.equal(payload.generationConfig.maxOutputTokens,240);assert.doesNotMatch(JSON.stringify(payload),/mc_mood_history|PRIVATE FIXTURE/);}finally{globalThis.fetch=previous;}});

test('safe diagnostics distinguish region, provider rejection, quota and timeout',async()=>{for(const [error,reason] of [[{statusCode:403},'provider_access'],[{statusCode:404},'model'],[{statusCode:429},'quota'],[{name:'TimeoutError'},'timeout']]){const r=await createHandler(async()=>{throw {...error,responseBody:'PRIVATE_PROVIDER_BODY'}})(request(),env);const data=await r.json();assert.equal(data.reason,reason);assert(!JSON.stringify(data).includes('PRIVATE'));}for(const country of ['NG','US']){const r=await createHandler(async()=> 'Open My journey to review the saved check-ins.')(request(good,{country}),env);assert.equal((await r.json()).source,'gemini');}const r=await createHandler()(request(good,{country:'GB'}),env);assert.equal((await r.json()).reason,'region');});

test('signed entitlement gate rejects missing and forged tokens',async()=>{
 const locked={...env,GUIDE_REQUIRE_ADULT_TOKEN:'true',AGE_AUTH_SECRET:'development-only-secret-that-is-long-enough'};
 let calls=0;const handler=createHandler(async()=>{calls++;return 'Not called';});
 const missing=await handler(request(),locked);assert.equal(missing.status,403);
 const forged=await handler(request(good,{headers:{Authorization:'Bearer forged.token'}}),locked);assert.equal(forged.status,403);
 assert.equal(calls,0);
});
test('signed entitlement gate accepts a valid short-lived adult token',async()=>{
 const {issueAdultToken}=await import('./age-entitlement.mjs');
 const secret='development-only-secret-that-is-long-enough';
 const token=await issueAdultToken(secret,{subject:'account-123',expiresAt:Math.floor(Date.now()/1000)+300});
 const locked={...env,GUIDE_REQUIRE_ADULT_TOKEN:'true',AGE_AUTH_SECRET:secret};
 const handler=createHandler(async()=> 'Review your mood check-in history in My journey.');
 const response=await handler(request(good,{headers:{Authorization:'Bearer '+token}}),locked);
 assert.equal(response.status,200);assert.equal((await response.json()).source,'gemini');
});

test('unspecified or malformed adult-token configuration never calls AI provider',async()=>{
 let generated=0;
 const handler=createHandler(async()=>{generated++;return 'UNSAFE PROVIDER CALL';});
 for(const mode of [undefined,'False','off','0','TRUE','']){
  const environment={...env};
  if(mode===undefined)delete environment.GUIDE_REQUIRE_ADULT_TOKEN;
  else environment.GUIDE_REQUIRE_ADULT_TOKEN=mode;
  const response=await handler(request(),environment);
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.source,'prepared');
  assert.equal(body.reason,'authorization');
  assert.equal(generated,0);
 }
 const explicit=await handler(request(),env);
 assert.equal((await explicit.json()).source,'prepared');
 assert.equal(generated,1);
});
