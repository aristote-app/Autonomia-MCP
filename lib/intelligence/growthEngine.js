import { isExcludedCommercialCompany, personalLinkedInProfileUrl } from "./commercialLeadPolicy.js";
/**
 * AUTONOMIA Growth Engine — deterministic commercial prioritisation.
 * Data inputs are already persisted in the cockpit. No automated LinkedIn actions.
 * Scores are prioritisation heuristics, never probabilities of purchase.
 */
const DAY=86400000;
const STOP=new Set(["won","lost","stopped"]);
const ESN=/\b(?:ESN|SSII)\b|capgemini|sopra\s*steria|alten|devoteam|inetum|atos|eviden|onepoint|aubay|extia|meritis|davidson|wavestone|accenture|talan|cgi france|cabinet de recrutement|agence de recrutement/i;
const TRACKS=[
  {id:"EXPERTS",label:"Experts IA",role:/cto|dsi|cio|head of (?:ai|data|engineering)|directeur (?:technique|informatique|data)|recrut|talent acquisition|engineering manager/i,
   keywords:/staffing|freelance|recrut|rag|llm|mlops|ai engineer|data scientist|head of ai|expert|d[eé]veloppeur/i,
   angle:"renfort ponctuel en compétences IA pour vos projets"},
  {id:"ACADEMY",label:"Formation IA",role:/formation|learning|l&d|d[eé]veloppement des comp[eé]tences|drh|ressources humaines|talent development/i,
   keywords:/formation|adoption|copilot|academy|comp[eé]tences|acculturation|sensibilisation|change management/i,
   angle:"formations IA adaptées aux métiers et aux pratiques de vos équipes"},
  {id:"BUILD",label:"Réalisation IA",role:/dsi|cto|cio|transformation|innovation|op[eé]rations|digital|chef de projet|project manager|directeur g[eé]n[eé]ral/i,
   keywords:/automatisation|agentic|workflow|projet|build|solution|digital|transformation|r[eé]alisation|int[eé]gration/i,
   angle:"réalisation de cas d'usage et automatisations IA sur mesure"}
];
function value(s){return String(s||"").trim();}
function accountId(s){return value(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function validLink(s){try { const u=new URL(s);return u.protocol==="https:" && !u.username && !u.password ? u.toString():null; } catch{return null;}}
function ageDays(s,now){const time=new Date(s||"").getTime();return Number.isFinite(time)?Math.max(0,(now-time)/DAY):null;}
function eligibleContact(c){return c && !c.do_not_contact && !STOP.has(c.outreach_status);}
function contactRole(c){return [c?.matched_role,c?.role_title].filter(Boolean).join(" ");}
function trackWeight(track,account,contact){
  const content=[...(account.offers||[]),...(account.timeline||[]).slice(0,3).map(e=>e.title),...(account.timeline||[]).slice(0,3).flatMap(e=>e.signal_keys||[])].join(" ");
  return (track.keywords.test(content)?18:0)+(contact&&track.role.test(contactRole(contact))?20:0);
}
function recentEvidence(account,now){
  return (account.timeline||[]).map(e=>{
    const date=e.date||e.published_at||null;
    return {title:value(e.title),date,url:validLink(e.source_url),source:value(e.source_id),age:ageDays(date,now)};
  }).filter(e=>e.title&&e.url&&e.age!==null&&e.age<=90).sort((a,b)=>a.age-b.age)[0]||null;
}
function contactPriority(c,track){
  let v=c.verification_status==="verified"?25:5;
  if(track.role.test(contactRole(c)))v+=30;
  if(c.outreach_status==="replied")v+=45;
  if(c.outreach_status==="meeting")v+=50;
  if(c.outreach_status==="proposal")v+=40;
  if(c.linkedin_url)v+=10;
  return v+(Number(c.relevance_score||0)/10);
}
function firstName(c){return value(c?.first_name)||value(c?.full_name).split(/\s+/)[0]||"";}
function draftMessage(account,track,contact,evidence){
  const hello="Bonjour"+(firstName(contact)?" "+firstName(contact):"")+",";
  const company=value(account.name)||"votre organisation";
  const context=evidence
    ?"J'ai vu une publication récente concernant "+evidence.title+" chez "+company+"."
    :"Je vous contacte dans le cadre de vos responsabilités chez "+company+".";
  const offer=track.id==="ACADEMY"
    ?"Chez AUTONOMIA, nous concevons des formations IA adaptées aux usages réels des équipes."
    :track.id==="EXPERTS"
      ?"Chez AUTONOMIA, nous aidons les équipes à mobiliser des experts IA sur des besoins précis."
      :"Chez AUTONOMIA, nous réalisons des automatisations et des solutions IA adaptées aux processus métier.";
  const question=track.id==="ACADEMY"
    ?"Seriez-vous disponible pour échanger sur les priorités de montée en compétences IA de vos équipes ?"
    :track.id==="EXPERTS"
      ?"Le renfort ponctuel de compétences IA pourrait-il vous être utile ?"
      :"Y a-t-il actuellement un processus que vous envisagez de simplifier grâce à l'IA ?";
  return [hello,"",context,offer,question,"","Déborah","https://calendly.com/deborah-build-autonomia/30min"].join("\n");
}
function suggestedAction(c,waalaxyReady,account){
  if(!c)return {id:"find_decider",label:"Identifier un décideur",reason:"Aucun contact exploitable pour cette offre dans le cockpit."};
  if(c.outreach_status==="replied")return {id:"respond",label:"Répondre au prospect",reason:"Une réponse est enregistrée : traiter manuellement avant toute autre séquence."};
  if(c.outreach_status==="meeting")return {id:"prepare_meeting",label:"Préparer le rendez-vous",reason:"Le contact est déjà au stade rendez-vous."};
  if(c.outreach_status==="proposal")return {id:"follow_proposal",label:"Suivre la proposition",reason:"Une proposition est déjà enregistrée."};
  if(["queued","active"].includes(c.outreach_status))return {id:"monitor",label:"Suivre la campagne",reason:"Une prospection est déjà en cours : ne pas doubler l'envoi."};
  if(c.verification_status!=="verified")return {id:"verify",label:"Vérifier le profil LinkedIn",reason:"Le rôle et l'identité du contact doivent être confirmés."};
  if(!personalLinkedInProfileUrl(c.linkedin_url))return {id:"find_linkedin",label:"Trouver le profil LinkedIn",reason:"Le contact doit avoir une URL de profil personnel LinkedIn valide, et non une recherche générique."};
  if(account.account_type!=="end_client_candidate"&&account.account_type!=="public_buyer")return {id:"verify_client",label:"Vérifier le client final",reason:"L'entreprise doit être vérifiée avant toute campagne."};
  return {id:"prepare",label:waalaxyReady?"Préparer l'import Waalaxy":"Préparer l'approche",reason:"Le message doit être validé, puis affecté à une campagne existante."};
}
/**
 * Scores are additive and transparent; a direct employer flag alone is NOT proof of client status.
 * Every play is a recommendation, not an authorisation to contact.
 */
export function buildGrowthPlays({accounts=[],contacts=[],waalaxyReady=false,now=new Date(),limit=120}={}){
  const time=new Date(now).getTime();
  const byAccount=new Map();
  for(const c of contacts){
    if(!eligibleContact(c))continue;
    const k=accountId(c.account_key||c.account_name);
    if(k&&!byAccount.has(k))byAccount.set(k,[]);
    if(k)byAccount.get(k).push(c);
  }
  // Contacts already stored in the cockpit may exist without a detected job signal.
  // They are legitimate proactive leads, but their need must not be invented.
  const accountUniverse=[...accounts];
  const knownAccounts=new Set(accounts.map(a=>accountId(a?.slug||a?.name)));
  for(const [key,pool] of byAccount){
    if(knownAccounts.has(key)||!pool[0]?.account_name)continue;
    accountUniverse.push({
      name:pool[0].account_name,slug:key,account_type:"end_client_candidate",
      offers:[],timeline:[],intermediary_risk:false
    });
    knownAccounts.add(key);
  }
  const plays=[];
  const seen=new Set();
  for(const account of accountUniverse){
    if(!account?.name||account.intermediary_risk||account.account_type==="intermediary"||ESN.test(account.name)||isExcludedCommercialCompany(account.name))continue;
    const key=accountId(account.slug||account.name);
    const pool=(byAccount.get(key)||[]).filter(eligibleContact);
    const evidence=recentEvidence(account,time);
    const tracks=TRACKS.map(track=>{
      const contactsForRole=pool.filter(c=>track.role.test(contactRole(c)));
      const candidate=contactsForRole
        .sort((a,b)=>contactPriority(b,track)-contactPriority(a,track))[0]||null;
      return {track,contact:candidate,weight:trackWeight(track,account,candidate)};
    }).sort((a,b)=>b.weight-a.weight);
    const chosen=tracks.filter(x=>x.weight>0).slice(0,2);
    if(!chosen.length)chosen.push(tracks.find(x=>x.track.id==="BUILD"));
    const usedContacts=new Set();
    for(const {track,contact,weight} of chosen){
      if(contact?.id && usedContacts.has(contact.id))continue;
      if(contact?.id)usedContacts.add(contact.id);
      if(!track)continue;
      const id=[key,track.id].join(":");
      if(seen.has(id))continue;
      seen.add(id);
      const age=evidence?.age??null;
      const score=Math.min(100,Math.round(
        20+Math.min(weight,35)+(evidence?(age<=7?20:age<=30?12:5):0)
        +(contact?.verification_status==="verified"?14:0)
        +(contact?.outreach_status==="replied"?15:0)
        +(contact?.outreach_status==="meeting"?18:0)
      ));
      const action=suggestedAction(contact,waalaxyReady,account);
      plays.push({
        id,accountKey:key,accountSlug:account.slug||key,company:account.name,
        offer:track.id,offerLabel:track.label,score,
        contactId:contact?.id||null,
        contactName:value(contact?.full_name)||null,
        contactRole:contactRole(contact)||null,
        contactVerification:contact?.verification_status||null,
        linkedIn:personalLinkedInProfileUrl(contact?.linkedin_url),
        contactStatus:contact?.outreach_status||"not_started",
        evidence:evidence?{title:evidence.title,url:evidence.url,date:evidence.date,source:evidence.source}:null,
        evidenceType:evidence?"signal public documenté — besoin à qualifier":"ciblage proactif — besoin à qualifier",
        clientStatus:account.account_type==="public_buyer"?"Acheteur public à qualifier":account.account_type==="end_client_candidate"?"Client final candidat — à confirmer":"Client final non vérifié",
        messageStatus:contact?.verification_status==="verified" && personalLinkedInProfileUrl(contact?.linkedin_url) && evidence ? "Brouillon à valider" : "Brouillon de découverte — vérification nécessaire",
        action, message:draftMessage(account,track,contact,evidence),
        route:"/accounts/"+encodeURIComponent(account.slug||key),
        noAutoSend:true
      });
    }
  }
  const rank={respond:0,prepare_meeting:1,follow_proposal:2,prepare:3,verify:4,find_decider:5,find_linkedin:6,verify_client:7,monitor:8};
  plays.sort((a,b)=>(rank[a.action.id]??10)-(rank[b.action.id]??10)||b.score-a.score||a.company.localeCompare(b.company,"fr"));
  return plays.slice(0,Math.max(1,Math.min(500,Number(limit)||120)));
}
export function growthStats({accounts=[],contacts=[],inbound=[]}={}){
  const excluded=(accounts||[]).filter(a=>a.intermediary_risk||a.account_type==="intermediary"||(ESN.test(a.name||"")||isExcludedCommercialCompany(a.name))).length;
  const active=(contacts||[]).filter(c=>!c.do_not_contact);
  return {
    accounts:(accounts||[]).length,excluded,contacts:active.length,
    verified:active.filter(c=>c.verification_status==="verified").length,
    pipelineMeetings:active.filter(c=>c.outreach_status==="meeting").length+
      (inbound||[]).filter(l=>l.status==="meeting").length,
    interested:active.filter(c=>c.outreach_status==="replied").length+
      (inbound||[]).filter(l=>["qualified","contacted"].includes(l.status)).length,
    offers:active.filter(c=>c.outreach_status==="proposal").length+
      (inbound||[]).filter(l=>l.status==="proposal").length
  };
}
/** Illustration uniquement : ne calcule pas les rendez-vous réels. */
export function weeklyCapacity({target=40,invites=200,accept=.35,replied=.18,booked=.35}={}){
  const number=(v,max)=>Math.min(max,Math.max(0,Number(v)||0));
  const linkedin=number(invites,200)*number(accept,1)*number(replied,1)*number(booked,1);
  const required=Math.max(0,Math.ceil(number(target,1000)-linkedin));
  return {target:number(target,1000),linkedinTheoretical:Math.round(linkedin*10)/10,otherChannelsRequired:required,
    meetingsPerWorkingDay:Math.ceil(number(target,1000)/5)};
}
