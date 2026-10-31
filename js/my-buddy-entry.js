/* Keep the legacy dashboard mood trigger pointing to the unified My Buddy page. */
(function(){
 'use strict';
 function openBuddy(event){
  const target=event.target.closest('#goMood');
  if(!target)return;
  if(event.type==='keydown'&&event.key!=='Enter'&&event.key!==' ')return;
  event.preventDefault();
  event.stopImmediatePropagation();
  window.location.assign('daily-life.html');
 }
 document.addEventListener('click',openBuddy,true);
 document.addEventListener('keydown',openBuddy,true);
})();
