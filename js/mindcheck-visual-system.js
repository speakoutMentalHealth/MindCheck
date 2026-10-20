/* Decorative SVG icons inherit the real controls' translated accessible names. */
(function(){'use strict';
function svg(paths,cls){return '<svg class="'+(cls||'')+'" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths+'</svg>';}
const leaf='<path d="M12 35C5 14 21 8 37 10c1 18-6 29-21 25M12 39l17-21M19 29l-1-8M24 24l7-1"/>',heart='<path d="M24 38S7 28 7 17c0-10 13-13 17-4 4-9 17-6 17 4 0 11-17 21-17 21Z"/>',waves='<path d="M5 17c7-8 12 8 19 0s12 8 19 0M5 25c7-8 12 8 19 0s12 8 19 0M5 33c7-8 12 8 19 0s12 8 19 0"/>',journey='<path d="M10 36V25m14 11V17m14 19V9M7 40h34"/>',face='<circle cx="24" cy="24" r="17"/><path d="M16 28q8 10 16 0M18 19h.01M30 19h.01"/>';
function mount(){
 document.querySelectorAll('#moodSection .mood').forEach(button=>{
  const value=Number(button.dataset.val),mouth=value>=3?'<path d="M16 28q8 '+(value===4?'12':'7')+' 16 0"/>':value===2?'<path d="M18 31h12"/>':'<path d="M16 33q8 -'+(value===0?'10':'6')+' 16 0"/>';
  for(const node of [...button.childNodes])if(node.nodeType===3)node.remove();
  button.insertAdjacentHTML('afterbegin',svg('<circle cx="24" cy="24" r="19"/><path d="M17 20h.01M31 20h.01" stroke-width="3.8"/>'+mouth,'mc-emotion-face'));
 });
 const icons=[face,leaf,heart];document.querySelectorAll('.mc-front-discover-card>span').forEach((el,i)=>el.innerHTML=svg(icons[i]||leaf));
 const breathe=document.querySelector('#mcOpenBreathing .mc-home-tool-icon'),progress=document.querySelector('#mcOpenJourney .mc-home-tool-icon');if(breathe)breathe.innerHTML=svg(waves);if(progress)progress.innerHTML=svg(journey);
 document.querySelectorAll('#helpSection .big').forEach((el,i)=>el.innerHTML=svg(i===0?'<path d="M24 8 43 40H5ZM24 20v9m0 5h.01"/>':i===1?'<path d="M14 8 8 14c-2 11 15 28 26 26l6-6-9-7-5 5c-5-2-8-5-10-10l5-5Z"/>':'<path d="M8 10h32v24H23l-10 7v-7H8Z"/><path d="M16 19h16m-16 7h11"/>'));
 const tip=document.querySelector('#tipCard .big');if(tip)tip.innerHTML=svg(leaf);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
