/* SpeakOut ecosystem access belongs in the footer, clear of reading and controls. */
(function(){
'use strict';
if(document.querySelector('.mc-platform-switcher'))return;
const entries=[['SpeakOut','https://speakoutmentalhealth.org/'],['MindCheck','https://mindcheck.speakoutmentalhealth.org/'],['SpeakOut TV','https://speakoutmentalhealth.org/tv.html']];
const footers=document.querySelectorAll('.mc-home-footer');
for(const footer of footers){
 const existing=footer.querySelector('a[href="https://speakoutmentalhealth.org/"]');
 const details=document.createElement('details');details.className='mc-platform-switcher';
 const summary=document.createElement('summary');summary.textContent='SpeakOut ↗';
 const nav=document.createElement('nav');nav.setAttribute('aria-label','SpeakOut platforms');
 for(const [name,url] of entries){const link=document.createElement('a');link.href=url;link.textContent=name;nav.appendChild(link);}
 details.append(summary,nav);if(existing)existing.replaceWith(details);else footer.appendChild(details);
 details.addEventListener('toggle',()=>{if(details.open)document.querySelectorAll('.mc-platform-switcher').forEach(other=>{if(other!==details)other.open=false;});});
 document.addEventListener('click',event=>{if(!details.contains(event.target))details.open=false;});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&details.open){details.open=false;summary.focus();}});
}
})();
