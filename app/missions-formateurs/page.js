import Link from "next/link";
import {searchJobSignals} from "../../lib/db/jobSignals.js";
import {hasAutonomiaDatabase} from "../../lib/db/supabase.js";
import {TRAINER_BUYERS} from "../../lib/training/trainerBuyerIntelligence.js";
import BuyerWorkbench from "./BuyerWorkbench.js";
import {classifyTrainingFamily,classifyTrainingBuyer,rankTrainingLead} from "../../lib/training/trainingLeadFilters.js";

export const dynamic="force-dynamic";
export const metadata={title:"Acheteurs et missions formateurs · AUTONOMIA Academy",robots:{index:false,follow:false}};

const COUNTRIES={FR:"France",CH:"Suisse",BE:"Belgique",CA:"Canada"};
function safeUrl(v) {
 try {const u=new URL(v);return u.protocol==="https:"&&!u.username&&!u.password&&
 (/(^|\.)linkedin\.com$/.test(u.hostname)||/(^|\.)indeed\.com$/.test(u.hostname))?u.toString():null;}
 catch{return null;}
}
function fromSignal(signal) {
 const country=signal?.raw_payload?.target_country;
 const source=safeUrl(signal?.source_url);
 if(!COUNTRIES[country]||!source)return null;
 const sourceTitle=String(signal.title||"Demande de formateur").slice(0,180);
 const company=String(signal.company_name||"").trim();
 const theme=classifyTrainingFamily([sourceTitle,signal.raw_payload?.search_description||""].join(" "),signal.raw_payload?.training_theme);
 const buyerType=classifyTrainingBuyer({buyer:company,description:signal.raw_payload?.search_description||""});
 return {
  id:"signal-"+signal.id,
  buyer:company||"Organisme acheteur non identifié",
  buyerStatus:company?"Organisation citée par la source, statut d’acheteur à vérifier":"Auteur, client final et entreprise contractante à identifier",
  contact:null,
  contactRole:"Responsable pédagogique, recrutement de formateurs ou direction formation à rechercher et vérifier",
  country,theme,buyerType,
  mode:signal.raw_payload?.training_delivery==="distanciel_mentionne"?"distanciel mentionné":signal.raw_payload?.training_delivery==="presentiel_mentionne"?"présentiel mentionné":"à confirmer",
  need:sourceTitle,dates:"Dates à confirmer",location:signal.location||COUNTRIES[country],
  state:"nouveau",source,
  evidence:"Signal issu de recherche web publique ; identité, budget et mission active à vérifier"
 };
}

export default async function Page() {
 const result=hasAutonomiaDatabase()?await searchJobSignals({
  sources:["linkedin","indeed"],signalKey:"trainer_mission_demand",franceOnly:false,limit:500
 }).catch(()=>null):null;
 const incoming=(result?.items||[]).map(fromSignal).filter(Boolean);
 const reviewed=TRAINER_BUYERS.filter(lead=>lead.source).map(lead=>({
   ...lead,
   theme:classifyTrainingFamily(lead.need||"",lead.theme),
   buyerType:classifyTrainingBuyer({buyer:lead.buyer,description:lead.evidence||""})
 }));
 const leads=[...incoming,...reviewed].sort((a,b)=>rankTrainingLead(b)-rankTrainingLead(a));
 return <main style={{maxWidth:1220,margin:"0 auto",padding:"32px 22px 90px",fontFamily:"system-ui,sans-serif"}}>
  <p><Link href="/growth">← Retour à Growth Intelligence</Link></p>
  <p style={{letterSpacing:2,color:"#61708c",fontSize:12}}>AUTONOMIA · ACADEMY · DÉVELOPPEMENT COMMERCIAL</p>
  <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",margin:"8px 0"}}>Organismes acheteurs et missions de formateurs</h1>
  <p style={{maxWidth:920,lineHeight:1.7}}>France, Suisse, Belgique et Canada francophone. Le réseau de formateurs est déjà constitué : ce tableau sert à retrouver les demandes, identifier les acheteurs, qualifier leurs besoins et préparer des propositions commerciales à valider avant tout envoi.</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:12,margin:"24px 0"}}>
   {[
    [incoming.length,"demandes découvertes automatiquement"],
    [TRAINER_BUYERS.length,"acheteurs ou interlocuteurs documentés à requalifier"],
    [Object.keys(COUNTRIES).length,"pays couverts"]
   ].map(([v,label])=><div key={label} style={{padding:18,background:"#f0f4fa",borderRadius:12,minWidth:180}}><strong style={{display:"block",fontSize:25}}>{v}</strong><span>{label}</span></div>)}
  </div>
  <p style={{fontSize:13,color:"#526179"}}>Les exemples issus de publications publiques peuvent être passés ou pourvus. Une entreprise citée ou un auteur de publication n’est pas automatiquement le décideur contractuel.</p>
  <BuyerWorkbench leads={leads}/>
 </main>;
}
