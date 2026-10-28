import {personalLinkedInProfileUrl} from '../intelligence/commercialLeadPolicy.js';
export const TRAINING_STAGES=Object.freeze({detectee:'Annonce détectée',acheteur:'Acheteur identifié',decideur:'Décideur trouvé',qualifie:'Besoin qualifié',message:'Message préparé',contacte:'Contacté',reponse:'Réponse obtenue',rdv:'Rendez-vous',proposition:'Proposition transmise',gagne:'Gagné',perdu:'Perdu'});
const LIMITS={contact:160,organisation:240,dates:300,modalite:200,tarif:160,notes:5000,email:254,linkedin:500,phone:80,role:200,message:10000};
export function normalizeTrainingDraft(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Invalid draft');
 const out={};
 for(const [key,max]of Object.entries(LIMITS)){if(input[key]!=null){if(typeof input[key]!=='string'||input[key].length>max)throw new Error('Invalid '+key);out[key]=input[key].trim();}}
 out.stage=input.stage||'detectee';if(!Object.hasOwn(TRAINING_STAGES,out.stage))throw new Error('Invalid stage');
 if(out.email&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(out.email))throw new Error('Invalid email');
 if(out.linkedin){out.linkedin=personalLinkedInProfileUrl(out.linkedin);if(!out.linkedin)throw new Error('Invalid LinkedIn');}
 out.nextFollowup=input.nextFollowup||'';
 if(out.nextFollowup&&(!/^\d{4}-\d{2}-\d{2}$/.test(out.nextFollowup)||Number.isNaN(Date.parse(out.nextFollowup+'T12:00:00Z'))||new Date(out.nextFollowup+'T12:00:00Z').toISOString().slice(0,10)!==out.nextFollowup))throw new Error('Invalid date');
 out.contactVerified=input.contactVerified===true;out.doNotContact=input.doNotContact===true;
 if(out.doNotContact||['gagne','perdu','reponse','rdv'].includes(out.stage))out.nextFollowup='';
 return out;
}
export function workflowMatch(draft={},filter='all',today=new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Paris'})){
 if(filter==='all')return true;
 if(filter==='due')return !!draft.nextFollowup&&draft.nextFollowup<=today&&!draft.doNotContact&&!['gagne','perdu','reponse','rdv'].includes(draft.stage);
 if(filter==='todo')return !draft.doNotContact&&!['contacte','reponse','rdv','proposition','gagne','perdu'].includes(draft.stage);
 return draft.stage===filter;
}
function csvCell(value){let s=String(value||'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function trainingWaalaxyCsv(leads=[],drafts={}){
 const seen=new Set();const rows=[['First name','Last name','Intitulé du poste','Numéro de téléphone','Company name','LinkedIn URL','Email']];
 for(const lead of leads){const d=drafts[lead.id]||{};if(d.doNotContact||['gagne','perdu'].includes(d.stage))continue;const url=personalLinkedInProfileUrl(d.linkedin||lead.contactProfile);if(!url||seen.has(url))continue;seen.add(url);const name=(d.contact||lead.contact||'').trim().split(/\s+/);rows.push([name.shift()||'',name.join(' '),d.role||lead.contactRole,d.phone||lead.businessPhone,d.organisation||lead.buyer,url,d.email||lead.businessEmail]);}
 return {count:rows.length-1,text:'\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')};
}
export function gmailComposeLink(email,message=''){
 if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email||''))return null;
 const lines=message.split('\n');const subject=(lines.shift()||'').replace(/^Objet\s*:\s*/i,'');
 return 'https://mail.google.com/mail/?'+new URLSearchParams({view:'cm',fs:'1',to:email,su:subject,body:lines.join('\n').trim()}).toString();
}
