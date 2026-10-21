/**
 * Source-backed buyer watchlist. These are research leads, not orders.
 * Names/dates/roles are limited to the linked public publication.
 */
export const TRAINER_BUYERS = Object.freeze([
 {
  id:"gerald-gore-management-ain",
  buyer:"Gérald Gore (publication de recherche de formateur)",
  buyerStatus:"Interlocuteur identifié ; entité acheteuse à confirmer",
  contact:"Gérald Gore",
  contactRole:"Auteur de la demande publique — rôle contractuel à confirmer",
  country:"FR", theme:"management", mode:"présentiel",
  need:"Entretiens managériaux et RH : intégration, entretien annuel, engagement, recrutement",
  location:"Ain (01)", dates:"28 octobre 2026 (dernière date annoncée ; autres dates passées)",
  deadline:"2026-10-28", state:"date_a_revalider",
  source:"https://fr.linkedin.com/posts/gerald-gore-formation-accompagnement-management_recherche-formateur-formatrice-entretiens-activity-7493895914902781952-XyGw",
  evidence:"Publication nominative exposant le thème, les dates et le présentiel ; mandat exact à vérifier"
 },
 {
  id:"aymeric-carre-mac-fo-sst",
  buyer:"Organisme demandeur à identifier",
  buyerStatus:"Publication individuelle ; société et décision d’achat non vérifiées",
  contact:"Aymeric Carré",
  contactRole:"Auteur de l’appel à formateurs — pouvoir d’achat à confirmer",
  country:"FR",theme:"sante_securite",mode:"présentiel",
  need:"Animation d’un MAC FO SST en intra pour six formateurs SST",
  location:"Dieppe (76)",dates:"Avant fin 2026, dates à préciser",deadline:"2026-12-31",state:"a_qualifier",
  source:"https://fr.linkedin.com/posts/aymeric-carr%C3%A9-099609292_sst-formateursst-macfosst-activity-7452325382306922496-Jrpz",
  evidence:"Publication nominative et besoin en intra documentés ; organisme non cité"
 },
 {
  id:"thot-disciplina-sst",
  buyer:"Thot Disciplina Formation",
  buyerStatus:"Organisme nommé dans sa publication professionnelle",
  contact:null,contactRole:"Responsable pédagogique / planification à identifier",
  country:"FR",theme:"sante_securite",mode:"présentiel",
  need:"MAC SST ; besoin initial pour deux sessions à Gouvieux (60)",
  location:"Gouvieux (60)",dates:"12 et 13 octobre 2026",deadline:"2026-10-13",state:"pourvu",
  source:"https://fr.linkedin.com/posts/thot-disciplina_recherche-formateur-sst-12-13-octobre-activity-7506778563627573249-BU3I",
  evidence:"Commentaire de l’organisme indiquant qu’un formateur a été trouvé ; uniquement pour futures collaborations"
 },
 {
  id:"leones-sst-2026",
  buyer:"Leones Formation",
  buyerStatus:"Organisme nommé dans sa publication professionnelle",
  contact:"Mathieu Richard",
  contactRole:"Interlocuteur désigné dans la publication pour le recrutement de formateurs ; fonction exacte à confirmer",
  country:"FR",theme:"sante_securite",mode:"présentiel",
  need:"Sessions SST et MAC SST dans le Doubs (25)",
  location:"Doubs (25)",dates:"Sessions publiées de février à juin 2026",deadline:"2026-06-30",state:"historique",
  source:"https://fr.linkedin.com/posts/leones-formation_mathieu-richard-recrute-des-formateurs-sst-activity-7404932677692424192-tr73",
  evidence:"Organisme et interlocuteur nommés, dates anciennes ; requalification de commandes futures uniquement"
 }
]);

const THEMES={
 management:"management et ressources humaines",
 petite_enfance:"petite enfance",
 sante_securite:"prévention, santé et sécurité",
 bureautique:"bureautique",
 langues:"langues",
 ia_digital:"intelligence artificielle et numérique"
};
export function trainerProposalDraft(lead,{contact="",organisation="",dates="",modalite="",tarif=""}={}){
 const company=organisation.trim()||lead.buyer||"votre organisme";
 const topic=lead.need||THEMES[lead.theme]||"la formation concernée";
 const hello=contact.trim()?("Bonjour "+contact.trim()+","):"Bonjour,";
 const timing=dates.trim()||lead.dates||"vos dates à confirmer";
 const location=modalite.trim()||lead.mode||"les modalités à convenir";
 const historical=lead.state==="pourvu"||lead.state==="historique";
 return `Objet : ${historical?"Vos prochaines missions de formation":"Votre recherche de formateur"} — ${topic.slice(0,65)}

${hello}

${historical?"J’ai consulté votre précédente publication concernant "+topic+" ("+timing+"). Je vous contacte au sujet de vos prochains besoins, cette intervention n’étant pas présentée comme ouverte.":"J’ai vu votre recherche concernant "+topic+" ("+timing+")."}

Je vous contacte pour AUTONOMIA Academy, avec un réseau de formateurs intervenant en France et dans les pays francophones. Nous pouvons étudier une intervention ${location}, sous réserve de validation du périmètre et des disponibilités.

${historical?"Prévoyez-vous de nouvelles sessions ?":"Votre recherche est-elle toujours d’actualité ?"} Pourriez-vous me confirmer la durée, le public concerné, les objectifs et le budget prévu ?${tarif.trim()?"\n\nIndication tarifaire à discuter : "+tarif.trim()+"." : ""}

Je pourrai alors vous transmettre rapidement une proposition adaptée et le profil de l’intervenant.

Bien cordialement,
Déborah Dian
AUTONOMIA Academy`;
}
