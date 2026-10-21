// Conservative categorization for source-linked training announcements.
// Never infer a direct buyer from an unverified job-board title alone.
export const TRAINING_FAMILIES=Object.freeze({
 ia:"IA, agents IA et automatisation",
 bureautique:"Bureautique et outils numériques",
 management:"Management, RH et commerce",
 petite_enfance:"Petite enfance",
 securite:"Sécurité, SST et prévention",
 langues:"Langues",
 technique:"Métiers techniques et industrie",
 autres:"Autres formations"
});
export const BUYER_TYPES=Object.freeze({
 direct:"Acheteur direct",
 of:"Organisme de formation",
 inconnu:"Acheteur à vérifier"
});
const RULES=[
 ["ia",/(?:\bIA\b|\bAI\b|intelligence artificielle|chatgpt|copilot|genai|prompt|agents? ia|automatisation|\bLLM\b|\bRAG\b|machine learning|data science|n8n)/i],
 ["petite_enfance",/(?:petite enfance|cr[eè]che|AEPE|assistante? maternelle|pu[eé]riculture)/i],
 ["securite",/(?:\bSST\b|\bMAC SST\b|habilitation|incendie|\bHACCP\b|AFGSU|gestes et postures|hygi[eè]ne|pr[eé]vention|s[eé]curit[eé])/i],
 ["bureautique",/(?:Excel|Word|PowerPoint|Microsoft 365|bureautique|Teams|SharePoint)/i],
 ["management",/(?:management|manager|leadership|RH|recrutement|ressources humaines|relation client|vente|commerce|commercial)/i],
 ["langues",/(?:anglais|espagnol|allemand|FLE|langues|linguistique|fran[cç]ais langue)/i],
 ["technique",/(?:usinage|maintenance industrielle|industrie|BTP|construction|logistique|[eé]lectricit[eé]|m[eé]canique)/i]
];
const OF_PATTERN=/(?:\bCFA\b|\bOPCO\b|\bIFAPME\b|centre de formation|organisme de formation|training provider|acad[eé]mie de formation|formation continue|training center|formateur pour nos clients|training agency)/i;
const DIRECT_PATTERN=/(?:entreprise cliente directe|formation de nos (?:salari[eé]s|collaborateurs|agents|[eé]quipes)|former (?:nos|ses) (?:salari[eé]s|collaborateurs|agents|[eé]quipes)|pour notre personnel|in.house training|our employees)/i;
export function classifyTrainingFamily(text="",hint=""){
 const content=String(text||"");
 // Never trust search query's theme as proof; evaluate announcement title/snippet first.
 for(const [id,re] of RULES){if(re.test(content))return id;}
 const aliases={ia_digital:"ia",management:"management",petite_enfance:"petite_enfance",sante_securite:"securite",bureautique:"bureautique",langues:"langues"};
 return aliases[hint]||"autres";
}
export function classifyTrainingBuyer({buyer="",description="",typeEvidence=""}={}){
 if(["direct","of"].includes(typeEvidence))return typeEvidence;
 const org=String(buyer||"");
 const text=String(description||"");
 if(OF_PATTERN.test(org))return "of";
 if(DIRECT_PATTERN.test(text)&&org&&!OF_PATTERN.test(text))return "direct";
 return "inconnu";
}
export function rankTrainingLead(lead){
 let score=0;
 if(lead.theme==="ia")score+=40;
 if(lead.buyerType==="direct")score+=30;
 if(lead.state==="nouveau"||lead.state==="a_qualifier")score+=10;
 if(lead.contactProfile)score+=5;
 return score;
}
