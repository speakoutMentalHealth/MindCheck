/* In-app guide: fixed public topics only. Never reads wellbeing or assessment fields. */
(()=>{'use strict';let dialog,opener,loading;const supported=new Set(['mood','calm','assessment','privacy','install','training']);
function mount(){
 dialog=document.createElement('dialog');dialog.id='mcContextGuide';dialog.setAttribute('aria-labelledby','mcGuideTitle');
 dialog.innerHTML="<div class=\"mc-guide-wrap\"><header class=\"mc-guide-brand\"><strong>MindCheck · AI Guide</strong><button type=\"button\" data-guide-close aria-label=\"Close guide\">×</button></header><p class=\"mc-guide-eyebrow\">YOUR WAY AROUND MINDCHECK</p><label class=\"mc-guide-language\">Guide language <select id=\"mcGuideLanguage\"><option value=\"en\">English</option><option value=\"fr\">Français</option></select></label><p class=\"mc-guide-small\">Hausa, Igbo, Yoruba and Pidgin guide translations are awaiting review.</p><h1 id=\"mcGuideTitle\">A little guidance.</h1><p class=\"mc-guide-intro\" id=\"mcGuideIntro\">Choose a question about the app. No personal details needed.</p><div class=\"mc-guide-topics\" role=\"group\" aria-label=\"Platform questions\" id=\"mcGuideTopics\"></div><section class=\"mc-guide-answer\" aria-labelledby=\"mcGuideQuestion\"><p class=\"mc-guide-eyebrow\" id=\"mcGuideSource\">Prepared platform answer</p><h2 id=\"mcGuideQuestion\"></h2><p id=\"mcGuideAnswer\"></p><a id=\"mcGuideLink\"></a><hr><p class=\"mc-guide-small\" id=\"mcGuidePrivacy\">Optional AI explanations use only your selected question and language. Your personal wellbeing data is excluded.</p><button id=\"mcGuideAI\" type=\"button\" hidden>Explain with Gemini</button><p class=\"mc-guide-small\" id=\"mcGuideAIStatus\" role=\"status\" aria-live=\"polite\"></p><p id=\"mcGuideAIAnswer\" hidden></p></section><p class=\"mc-guide-small\" id=\"mcGuideBoundary\">This guide explains the platform. It does not give medical advice or interpret screening results.</p><footer><a href=\"index.html\" id=\"mcGuideHome\">Home</a><a href=\"privacy.html\" id=\"mcGuidePrivacyLink\">Privacy</a><a href=\"suicide-support.html\" id=\"mcGuideSupportLink\">Urgent support</a></footer></div>";
 document.body.append(dialog);
 dialog.querySelector('[data-guide-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{window.MindCheckGuide?.cancel();opener?.focus();});
 const select=document.getElementById('mcGuideLanguage');select.value=document.documentElement.lang==='fr'?'fr':'en';
 select.addEventListener('change',()=>window.MindCheckGuide?.select(window.MindCheckGuide.current()));
 loading=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='js/mindcheck-guide.js?v=20261024-context';s.onload=resolve;s.onerror=reject;document.head.append(s);});
}
document.addEventListener('click',async event=>{const a=event.target.closest('a.mc-ai-guide-entry,a.mc-inline-guide');if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 if(!window.MindCheckAdult?.confirmed()||!window.HTMLDialogElement||!window.MindCheckGuideContent)return;
 const url=new URL(a.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('/guide.html'))return;
 event.preventDefault();opener=a;const selected=url.searchParams.get('topic');const topic=supported.has(selected)?selected:'mood';
 if(!dialog)mount();document.getElementById('mcGuideLanguage').value=document.documentElement.lang==='fr'?'fr':'en';
 dialog.showModal();
 try{await loading;if(dialog.open)window.MindCheckGuide.select(topic,true);}catch{dialog.close();location.href=a.href;}
});})();
