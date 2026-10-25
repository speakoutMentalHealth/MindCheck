/* Local-only personal milestones. Official badges, rewards and claim flow untouched. */
(function(){
'use strict';
var root=document.getElementById('mcMilestones');if(!root)return;
var copy={
en:{eyebrow:'YOUR PROGRESS',title:'Small steps are worth celebrating',intro:'Every check-in and gentle activity counts, at your own pace.',checkins:'Mood check-ins',challenges:'Completed challenges',activeDays:'Active days',milestones:'Personal milestones',privacy:'These personal milestones stay in this browser. They do not change official awards or cash reward eligibility.',first:'First check-in',steady:'Five check-ins',reflect:'Ten check-ins',begin:'First challenge',habit:'Seven challenges',growth:'Twenty challenges',earned:'Achieved',next:'In progress'},
ha:{eyebrow:'CIGABANKA',title:'Ko karamin ci gaba abin murna ne',intro:'Kowane duba yanayi da karamin aiki yana da muhimmanci.',checkins:'Duba yanayi',challenges:'Ayyukan da aka kammala',activeDays:'Kwanakin aiki',milestones:'Matakan ci gaba',privacy:'Wadannan matakai suna cikin burauzar nan kawai. Ba sa canza kyaututtuka ko cancantar lada.',first:'Duba yanayi na farko',steady:'Duba yanayi biyar',reflect:'Duba yanayi goma',begin:'Aiki na farko',habit:'Ayyuka bakwai',growth:'Ayyuka ashirin',earned:'An cimma',next:'Ana ci gaba'},
ig:{eyebrow:'ỌGANỊHU GỊ',title:'Obere nzọụkwụ bara uru',intro:'Nyocha ọnọdụ uche na obere ihe omume ọ bụla dị mkpa.',checkins:'Nyocha ọnọdụ uche',challenges:'Ihe omume emechara',activeDays:'Ụbọchị ọrụ',milestones:'Nzọụkwụ ọganihu',privacy:'A na-echekwa ihe ndị a na ihe nchọgharị a. Ha anaghị agbanwe ụgwọ ọrụ.',first:'Nyocha mbụ',steady:'Nyocha ise',reflect:'Nyocha iri',begin:'Ihe omume mbụ',habit:'Ihe omume asaa',growth:'Ihe omume iri abụọ',earned:'Emechara',next:'Na-aga n’ihu'},
yo:{eyebrow:'ÌLỌSÍWÁJÚ RẸ',title:'Ìgbésẹ̀ kékeré yẹ fún ayẹyẹ',intro:'Gbogbo àyẹ̀wò ìmọ̀lára àti iṣẹ́ rere ṣe pàtàkì.',checkins:'Àyẹ̀wò ìmọ̀lára',challenges:'Iṣẹ́ tí a parí',activeDays:'Ọjọ́ ìṣe',milestones:'Àwọn ìpele ìlọsíwájú',privacy:'A fi ìpele wọ̀nyí pamọ́ nínú aṣàwákiri yìí. Wọn kò yí ẹ̀bùn padà.',first:'Àyẹ̀wò àkọ́kọ́',steady:'Àyẹ̀wò márùn-ún',reflect:'Àyẹ̀wò mẹ́wàá',begin:'Iṣẹ́ àkọ́kọ́',habit:'Iṣẹ́ méje',growth:'Iṣẹ́ ogún',earned:'A ṣàṣeyọrí',next:'Ń lọ síwájú'},
pcm:{eyebrow:'YOUR PROGRESS',title:'Every small step matter',intro:'Every mood check and small activity count.',checkins:'Mood check-ins',challenges:'Challenges wey you finish',activeDays:'Days wey you active',milestones:'Your milestones',privacy:'Na this browser dey keep am. E no change official awards or cash reward.',first:'First mood check',steady:'Five mood checks',reflect:'Ten mood checks',begin:'First challenge',habit:'Seven challenges',growth:'Twenty challenges',earned:'You don do am',next:'You dey progress'},
fr:{eyebrow:'VOTRE PROGRESSION',title:'Chaque petit pas mérite d’être célébré',intro:'Chaque bilan et chaque activité douce comptent, à votre rythme.',checkins:"Bilans d’humeur",challenges:'Défis accomplis',activeDays:'Jours actifs',milestones:'Étapes personnelles',privacy:'Ces étapes restent dans ce navigateur. Elles ne modifient pas les récompenses officielles.',first:'Premier bilan',steady:'Cinq bilans',reflect:'Dix bilans',begin:'Premier défi',habit:'Sept défis',growth:'Vingt défis',earned:'Accompli',next:'En cours'}
};
function t(k){var lang='en';try{lang=(localStorage.getItem('mc_lang')||'en').split('-')[0].toLowerCase();}catch(e){}return(copy[lang]||copy.en)[k]||copy.en[k];}
function read(k,fallback){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v===null?fallback:v;}catch(e){return fallback;}}
function render(){
root.querySelectorAll('[data-mcm]').forEach(function(el){el.textContent=t(el.dataset.mcm);});
var history=read('mc_mood_history',[]);if(!Array.isArray(history))history=[];
var challenges=read('mc_journey_challenges_v1',{});if(!challenges||typeof challenges!=='object'||Array.isArray(challenges))challenges={};
var completed=0,active=new Set();
Object.keys(challenges).forEach(function(day){var values=challenges[day];if(!Array.isArray(values))return;var unique=[...new Set(values.filter(function(x){return ['gratitude','breathing','connection','selfcare'].includes(x);} ))];completed+=unique.length;if(unique.length)active.add(day);});
history.forEach(function(item){if(!item||typeof item!=='object')return;var d=new Date(item.ts);if(!Number.isNaN(d.getTime())){var day=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');active.add(day);}});
document.getElementById('mcMilestoneCheckins').textContent=history.length;
document.getElementById('mcMilestoneChallenges').textContent=completed;
document.getElementById('mcMilestoneDays').textContent=active.size;
var goals=[['first',1,history.length,'🌱'],['steady',5,history.length,'🌟'],['reflect',10,history.length,'✨'],['begin',1,completed,'💚'],['habit',7,completed,'🌿'],['growth',20,completed,'🏅']];
var list=document.getElementById('mcMilestoneList');list.replaceChildren();
goals.forEach(function(goal){var key=goal[0],target=goal[1],current=goal[2],done=current>=target;var item=document.createElement('div');item.className='mc-milestone-item'+(done?' is-earned':'');item.setAttribute('role','listitem');var icon=document.createElement('span');icon.textContent=goal[3];icon.setAttribute('aria-hidden','true');var info=document.createElement('div');var name=document.createElement('strong');name.textContent=t(key);var label=document.createElement('span');label.textContent=done?t('earned'):(Math.min(current,target)+' / '+target+' · '+t('next'));info.append(name,label);item.append(icon,info);list.appendChild(item);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#goBadges,.mood,#mcJourneyChallengeList button,[data-lang],#mcChangeLanguage'))setTimeout(render,80);});
document.addEventListener('visibilitychange',function(){if(!document.hidden)render();});
window.addEventListener('storage',render);
window.MindCheckMilestones={refresh:render};
})();
