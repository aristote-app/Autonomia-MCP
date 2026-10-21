import {isExcludedCommercialCompany} from "../intelligence/commercialLeadPolicy.js";
import {classifyTrainingFamily,classifyTrainingBuyer} from "./trainingLeadFilters.js";
const COUNTRIES={FR:"France",CH:"Suisse",BE:"Belgique",CA:"Canada"};
function safeUrl(v) {
 try {const u=new URL(v);return u.protocol==="https:"&&!u.username&&!u.password&&
 (/(^|\.)linkedin\.com$/.test(u.hostname)||/(^|\.)indeed\.com$/.test(u.hostname)||/(^|\.)codeur\.com$/.test(u.hostname)||u.hostname==="candidat.francetravail.fr")?u.toString():null;}
 catch{return null;}
}
export function fromSignal(signal) {
 if(isExcludedCommercialCompany(signal?.company_name))return null;
 const isFranceTravail=signal?.source_id==="france_travail_jobs";
 const description=signal?.raw_payload?.search_description||signal?.raw_payload?.description||"";
 const content=[signal?.title,description].join(" ");
 // A training-related salaried vacancy is not evidence of a training purchase.
 if(isFranceTravail&&(!/formateur|formatrice/i.test(signal.title||"")||!/freelance|ind[eé]pendant|sous[- ]?trait|prestataire/i.test(content)||/^(CDI|CDD|SAI|MIS)$/i.test(signal.raw_payload?.type_contrat||"")))return null;
 const country=signal?.raw_payload?.target_country||(isFranceTravail?"FR":null);
 const source=safeUrl(signal?.source_url);
 if(!COUNTRIES[country]||!source)return null;
 const sourceTitle=String(signal.title||"Demande de formateur").slice(0,180);
 const company=String(signal.company_name||"").trim();
 const theme=classifyTrainingFamily([sourceTitle,description].join(" "),signal.raw_payload?.training_theme);
 const buyerType=signal.raw_payload?.training_buyer_type==="direct"?"direct":classifyTrainingBuyer({buyer:company,description:description});
 return {
  id:"signal-"+signal.id,
  buyer:company||"Organisme acheteur non identifié",
  buyerStatus:company?"Organisation citée par la source, statut d’acheteur à vérifier":"Auteur, client final et entreprise contractante à identifier",
  contact:null,
  contactRole:"Responsable pédagogique, recrutement de formateurs ou direction formation à rechercher et vérifier",
  country,theme,buyerType,
  mode:signal.raw_payload?.training_delivery==="distanciel_mentionne"?"distanciel mentionné":signal.raw_payload?.training_delivery==="presentiel_mentionne"?"présentiel mentionné":"à confirmer",
  need:sourceTitle,publishedAt:signal.published_at||null,dates:signal.published_at?"Publication : "+new Date(signal.published_at).toLocaleDateString("fr-FR")+" ; intervention à confirmer":"Dates à confirmer",location:signal.location||COUNTRIES[country],
  state:"nouveau",source,
  evidence:"Signal issu de recherche web publique ; identité, budget et mission active à vérifier"
 };
}

