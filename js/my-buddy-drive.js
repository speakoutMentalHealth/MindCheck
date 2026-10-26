/* My Buddy diary: opt-in Google Drive, in-memory OAuth token, no background uploads. */
(()=>{'use strict';
const save=document.getElementById('buddy-drive-save'),list=document.getElementById('buddy-drive-list'),connect=document.getElementById('buddy-drive-connect'),disconnect=document.getElementById('buddy-drive-disconnect'),status=document.getElementById('buddy-drive-status'),files=document.getElementById('buddy-drive-files');
if(!save||!list||!status||!files)return;
const clientId=document.querySelector('meta[name="mc-google-drive-client-id"]')?.content?.trim()||'';
const scope='https://www.googleapis.com/auth/drive.file';
let token='',oauthClient=null,pending='',busy=false;
const titleInput=document.getElementById('buddy-diary-title');
let currentId='',lastSaveId='';
const say=(message,state='info')=>{status.textContent=message;status.dataset.state=state};
function ui(){save.disabled=busy;list.disabled=busy;disconnect.disabled=!token||busy}
function script(){return new Promise((resolve,reject)=>{if(window.google?.accounts?.oauth2)return resolve();const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=resolve;s.onerror=()=>reject(Error('Google sign-in could not load'));document.head.append(s)})}
function auth(action){if(!clientId){say('Google Drive is not configured. Download a copy instead.');return}pending=action;try{if(!window.google?.accounts?.oauth2){say('Google sign-in is loading. Tap Save Diary again in a moment, or open in Safari if this browser blocks sign-in.');void script().catch(()=>say('Google sign-in could not load. Open My Buddy in Safari and try again.'));return}if(!oauthClient)oauthClient=google.accounts.oauth2.initTokenClient({client_id:clientId,scope,callback:response=>{if(!response?.access_token){say('Google sign-in was cancelled or not approved.');return}token=response.access_token;ui();const next=pending;pending='';if(next==='save')void upload();else if(next==='list')void browse()}});oauthClient.requestAccessToken({prompt:'consent'})}catch(e){say('Unable to open Google sign-in. Try again in your browser.')}}
async function api(url,options={}){if(!token)throw Error('Connect your Google Drive to continue.');const response=await fetch(url,{...options,headers:{Authorization:'Bearer '+token,...(options.headers||{})}});if(response.status===401){token='';ui();throw Error('Google connection expired. Tap Save Diary to reconnect.')}if(!response.ok)throw Error('Google Drive could not complete the request ('+response.status+').');return response}
function snapshot(){return {version:1,title:(titleInput?.value||'').trim().slice(0,100),date:new Date().toISOString(),mood:document.getElementById('buddy-mood')?.value||'',journal:document.getElementById('journal')?.value||'',tasks:Array.from(document.querySelectorAll('#tasks .task'),li=>({text:li.querySelector('span')?.textContent||'',done:!!li.querySelector('input')?.checked}))}}
function safeTitle(value){return String(value||'').replace(/[\\/<>:"|?*\x00-\x1F]/g,' ').trim().slice(0,100)||'My Diary'}
function displayName(file){
 const raw=file.name.replace(/^MindCheck My Buddy /,'').replace(/\.json$/i,'');
 const match=raw.match(/^(.*?) -- \d{4}-\d{2}-\d{2}T/);
 return match?safeTitle(match[1]):'My Diary';
}
function fileRow(file){
 const row=document.createElement('div');row.className='buddy-file';
 const open=document.createElement('button');open.type='button';open.className='buddy-file-open';
 const title=document.createElement('strong');title.textContent=displayName(file);
 const date=document.createElement('small');const parsed=file.createdTime?new Date(file.createdTime):null;
 date.textContent=parsed&&!Number.isNaN(parsed.getTime())?parsed.toLocaleString():'Saved diary';
 open.append(title,date);open.setAttribute('aria-label','Open diary: '+title.textContent);
 open.addEventListener('click',()=>{void openDiary(file.id)});
 const del=document.createElement('button');del.type='button';del.className='buddy-file-delete';del.textContent='×';
 del.setAttribute('aria-label','Remove diary: '+title.textContent);del.title='Move diary to Google Drive Trash';
 del.addEventListener('click',()=>{void removeDiary(file.id,title.textContent,row)});
 row.append(open,del);return row;
}
async function upload(){
 if(busy)return;
 const data=snapshot();if(!data.journal.trim()&&!data.tasks.length){say('Write in your diary or add a task before saving.','error');return}
 if(!token){auth('save');return}
 if(!confirm('Save this diary to your Google Drive? The file is not end-to-end encrypted.'))return;
 busy=true;ui();say('Saving your diary…');
 try{
 const date=new Date();const name='MindCheck My Buddy '+safeTitle(data.title)+' -- '+date.toISOString().replace(/[:.]/g,'-')+'.json';
 const metadata={name,mimeType:'application/json',description:'MindCheck My Buddy diary'};
 const boundary='buddy'+Date.now();const body='--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(metadata)+'\r\n--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(data)+'\r\n--'+boundary+'--';
 const response=await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body});
 const saved=await response.json();lastSaveId=saved.id||'';currentId=lastSaveId;
 say('Saved successfully to Google Drive. See your diary below.','success');
 await browse(true);
 document.getElementById('buddy-drive-files')?.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(e){say(e.message,'error')}finally{busy=false;ui()}
}
async function browse(quiet=false){
 if(!token){if(!quiet)auth('list');return}
 if(!quiet){busy=true;ui()}
 try{
 const q="name contains 'MindCheck My Buddy ' and trashed = false";
 let pageToken='',all=[],pages=0;
 do{
 const url='https://www.googleapis.com/drive/v3/files?q='+encodeURIComponent(q)+'&fields=nextPageToken,files(id,name,createdTime)&page_size=100&orderBy=createdTime%20desc'+(pageToken?'&pageToken='+encodeURIComponent(pageToken):'');
 const response=await api(url);const data=await response.json();if(!Array.isArray(data.files))throw Error('Could not read the diary list.');
 all=all.concat(data.files);pageToken=data.nextPageToken||'';pages++;
 }while(pageToken&&pages<10);
 files.replaceChildren();for(const file of all){if(typeof file.id==='string'&&typeof file.name==='string')files.append(fileRow(file))}
 if(!all.length&&!quiet)say('No saved diaries yet.');else if(!quiet)say('Saved diaries are listed below. Tap a title to open, or × to remove.');
 }catch(e){say('Unable to refresh saved diaries: '+e.message,'error')}finally{if(!quiet){busy=false;ui()}}
}
async function removeDiary(id,title,row){
 if(busy)return;
 if(!confirm('Remove "'+title+'"? It will be moved to your Google Drive Trash, where it can be recovered.'))return;
 busy=true;ui();say('Removing diary…');
 try{
 await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(id)+'?fields=id,trashed',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});
 row.remove();if(currentId===id)currentId='';say('Diary removed from this list and moved to Google Drive Trash.','success');
 }catch(e){say('Could not remove diary: '+e.message,'error')}finally{busy=false;ui()}
}
async function openDiary(id){
 if(busy)return;
 if(!confirm('Open this saved diary? It will replace your current unsaved writing and checklist.'))return;
 try{
 const response=await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(id)+'?alt=media');const data=await response.json();
 if(data.version!==1||typeof data.journal!=='string'||data.journal.length>10000||!Array.isArray(data.tasks)||data.tasks.length>100)throw Error('This diary format is not supported.');
 if(titleInput)titleInput.value=typeof data.title==='string'?data.title.slice(0,100):'';
 document.getElementById('journal').value=data.journal;
 if(typeof data.mood==='string'&&['great','good','okay','low','anxious'].includes(data.mood))window.buddySelectMood?.(data.mood);
 document.getElementById('tasks').replaceChildren();for(const task of data.tasks){if(task&&typeof task.text==='string'&&task.text.length<=180)window.buddyAddTask?.(task.text,!!task.done)}
 currentId=id;say('Saved diary opened. Changes are temporary until you save again.','success');document.getElementById('journal')?.scrollIntoView({behavior:'smooth',block:'center'});
 }catch(e){say(e.message,'error')}
}
if(clientId)void script().catch(()=>say('Google sign-in is unavailable in this browser. Open My Buddy in Safari to connect.'));save.addEventListener('click',()=>{void upload()});list.addEventListener('click',()=>{void browse()});connect?.addEventListener('click',()=>{void auth('list')});disconnect.addEventListener('click',()=>{const old=token;token='';files.replaceChildren();ui();if(old&&window.google?.accounts?.oauth2)google.accounts.oauth2.revoke(old,()=>{});say('Google Drive disconnected. Your temporary writing remains on this page.')});ui();
})();
