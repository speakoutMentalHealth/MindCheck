// Exact reviewed disclaimer sentences are educational boundaries, not diagnoses.
// Only whole sentences are exempted; appended advice still meets the normal guard.
const disclaimers=new Set([
 'screening results are not a diagnosis',
 'screening results are not a diagnosis; a qualified professional should interpret clinical concerns',
 'these screening results are not a diagnosis',
 'these tools do not provide a diagnosis',
 'these tools do not diagnose medical conditions',
 'this is not a diagnosis',
 'this is not a medical diagnosis',
 'mindcheck does not provide medical diagnoses',
 "un résultat n'est pas un diagnostic",
 'ces résultats ne constituent pas un diagnostic',
 'ces outils ne permettent pas de poser un diagnostic'
]);
const normalize=s=>s.trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').replace(/[.!?]+$/,'');
export function safeGuideOutput(answer){
 if(typeof answer!=='string'||answer.trim().length<10||answer.length>900||/[<>]|https?:|www\./i.test(answer))return false;
 const remaining=answer.split(/(?<=[.!?])\s+/u).filter(sentence=>!disclaimers.has(normalize(sentence))).join(' ');
 return !/\b(prescrib|medicat|diagnos|dosage|cure|suicid)/i.test(remaining);
}
