/* My Buddy uses the original on-device MindCheck progress records. */
(function(){
  'use strict';
  const values={great:4,good:3,okay:2,low:1,anxious:0};
  const keys=['mc_mood_history','mc_points','mc_streak','mc_lastCheckin','mc_badges'];
  const day=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v===null?fallback:v}catch(_){return fallback}}
  function save(feeling){
    if(!Object.prototype.hasOwnProperty.call(values,feeling)) return;
    const status=document.getElementById('buddy-checkin-status');
    try{
      const now=new Date(), today=day(now), yesterday=new Date(now);yesterday.setDate(yesterday.getDate()-1);
      const last=localStorage.getItem('mc_lastCheckin')||'';
      let history=read(keys[0],[]);if(!Array.isArray(history))history=[];
      history=history.filter(x=>x&&typeof x.ts==='string'&&!isNaN(new Date(x.ts).getTime())&&Number.isInteger(x.mood_value)&&x.mood_value>=0&&x.mood_value<=4);
      let points=read(keys[1],0), streak=read(keys[2],0), badges=read(keys[4],[]);
      points=typeof points==='number'&&Number.isFinite(points)&&points>=0?points:0;
      streak=typeof streak==='number'&&Number.isFinite(streak)&&streak>=0?streak:0;
      badges=Array.isArray(badges)?badges.filter(x=>typeof x==='string'):[];
      const fresh=last!==today;
      if(fresh){history.push({ts:now.toISOString(),mood_value:values[feeling]});points+=10;streak=last===day(yesterday)?streak+1:1;}
      else {let i=history.length-1;while(i>=0&&day(new Date(history[i].ts))!==today)i--;if(i>=0)history[i].mood_value=values[feeling];}
      for(const [id,eligible] of [['first_checkin',true],['streak_3',streak>=3],['streak_7',streak>=7],['streak_20',streak>=20],['points_100',points>=100],['points_300',points>=300]]) if(eligible&&!badges.includes(id))badges.push(id);
      const changes=[[keys[0],JSON.stringify(history)],[keys[1],String(points)],[keys[2],String(streak)],[keys[3],today],[keys[4],JSON.stringify(badges)]];
      const previous=changes.map(([k])=>[k,localStorage.getItem(k)]);
      try{for(const [k,v] of changes){localStorage.setItem(k,v);if(localStorage.getItem(k)!==v)throw Error('storage');}}
      catch(e){for(const [k,v] of previous){try{if(localStorage.getItem(k)!==v){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}}catch(_){}}throw e;}
      status.textContent=`${fresh?'Check-in saved.':'Today’s mood updated.'} ${streak}-day streak${streak>=20?' · 20-day badge unlocked!':` · ${Math.min(streak,20)} of 20 days toward your badge.`} Saved on this browser.`;
    }catch(_){status.textContent='Your check-in could not be saved on this browser. Please check your storage settings and try again.';}
  }
  document.querySelectorAll('.buddy-mood').forEach(button=>button.addEventListener('click',()=>save(button.dataset.feeling)));
})();
