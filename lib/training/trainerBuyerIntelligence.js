/**
 * Source-backed buyer watchlist. These are research leads, not orders.
 * Names/dates/roles are limited to the linked public publication.
 */
export const TRAINER_BUYERS = Object.freeze([
 {
  id:"gerald-gore-management-ain",
  buyer:"Kepsom / INSPIRAC Formation (Gérald Gore)",
  buyerStatus:"Gérald Gore lié à Kepsom / INSPIRAC ; entreprise contractante de la mission à confirmer",
  contact:"Gérald Gore",
  contactProfile:"https://fr.linkedin.com/in/gerald-gore-formation-accompagnement-management",
  contactSource:"https://fr.linkedin.com/in/gerald-gore-formation-accompagnement-management",
  businessPhone:"07 62 20 47 57",
  businessPhoneSource:"https://www.kepsom.com/contact",
  businessPhoneType:"Numéro public de Kepsom / INSPIRAC (standard professionnel, pas une ligne personnelle vérifiée)",
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
  buyer:"Vitalform76",
  buyerStatus:"Aymeric Carré déclare diriger Vitalform76 ; mission et budget à confirmer",
  contact:"Aymeric Carré",
  contactProfile:"https://fr.linkedin.com/in/aymeric-carr%C3%A9-099609292",
  contactSource:"https://fr.linkedin.com/in/aymeric-carr%C3%A9-099609292",
  businessPhone:"06 67 21 40 81",
  businessPhoneSource:"https://www.vitalform76.com/mentions-legales",
  businessPhoneType:"Téléphone professionnel public de Vitalform76",
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
  contact:"Grégory Gorwa",contactRole:"Fondateur et président de Thot Disciplina ; implication dans cette recherche précise à confirmer",
  contactProfile:"https://fr.linkedin.com/in/gr%C3%A9gory-gorwa-79516a336",
  contactSource:"https://www.linkedin.com/company/thot-disciplina",
  businessPhone:"06 99 35 88 36",
  businessPhoneSource:"https://fr.linkedin.com/in/gr%C3%A9gory-gorwa-79516a336",
  businessPhoneType:"Téléphone commercial public de Thot Disciplina, affiché dans son catalogue partagé sur LinkedIn",
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
  contact:"Aurélia Pichon",
  contactRole:"Directrice générale ; responsabilité de recrutement des formateurs indiquée sur le site officiel",
  contactProfile:"https://fr.linkedin.com/in/aur%C3%A9lia-pichon-37305b16b",
  contactSource:"https://leones-formation.fr/a-propos/",
  businessPhone:"+33 6 73 55 40 32",
  businessPhoneSource:"https://leones-formation.fr/contact/",
  businessPhoneType:"Téléphone public de Leones Formation ; pas la ligne directe personnelle de la directrice",
  secondaryContact:"Mathieu Richard — interlocuteur commercial cité par l’annonce, BTS NDRC",
  country:"FR",theme:"sante_securite",mode:"présentiel",
  need:"Sessions SST et MAC SST dans le Doubs (25)",
  location:"Doubs (25)",dates:"Sessions publiées de février à juin 2026",deadline:"2026-06-30",state:"historique",
  source:"https://fr.linkedin.com/posts/leones-formation_mathieu-richard-recrute-des-formateurs-sst-activity-7404932677692424192-tr73",
  evidence:"Organisme et interlocuteur nommés, dates anciennes ; requalification de commandes futures uniquement"
 } ,
 {
  id:"gerfi-plus-ia-medicosocial",
  buyer:"GERFI+",
  buyerStatus:"Organisme de formation médico-social, auteur de l'annonce",
  contact:null,contactRole:"Responsable pédagogique ou recrutement d'intervenants à identifier",
  country:"FR",theme:"ia_digital",mode:"présentiel",
  need:"Formateur spécialisé en intelligence artificielle : usage responsable et pertinent dans le médico-social, interventions intra-établissement",
  location:"France (plusieurs établissements)",dates:"Annonce publiée en 2026 ; sessions et disponibilités à reconfirmer",
  state:"a_qualifier",
  source:"https://fr.linkedin.com/posts/gerfiplus_recrutement-formateur-ia-activity-7442213687932772352-1FbT",
  evidence:"Publication de l'organisme sollicitant des intervenants IA, sans preuve d'une session actuellement ouverte"
 },
 {
  id:"valerie-collis-droit-social-suisse-2027",
  buyer:"Organisme de formation du Bachelor RH non identifié",
  buyerStatus:"Interlocutrice signataire de l'annonce ; organisme contractant à identifier",
  contact:"Valérie Collis",contactRole:"Autrice de l'annonce, capacité de contractualisation à confirmer",
  country:"CH",theme:"management",mode:"à confirmer",
  need:"Module de 35 heures : droit social suisse et recrutement pour Bachelor RH de niveau Bac+3",
  location:"Suisse (lieu précis à confirmer)",dates:"Du 20 mai au 25 juin 2027",
  state:"a_qualifier",
  source:"https://fr.linkedin.com/posts/val%C3%A9rie-collis-5a76a025_recherche-formateurtrice-droit-social-activity-7457763954472189952-9jYj",
  evidence:"Annonce datée pour 2027, facturation française envisagée ; horaires, lieu et statut à confirmer"
 },
 {
  id:"ascot-formations-pass-htb-novembre",
  buyer:"ASCOT Formations",
  buyerStatus:"Organisme de formation relayant la recherche d'un partenaire pour répondre à un client",
  contact:"Mathieu Gallet",contactRole:"Auteur de l'annonce relayée ; rôle dans l'achat à confirmer",
  country:"FR",theme:"sante_securite",mode:"à confirmer",
  need:"Formateur habilité au PASS RTE HTB encadrant, recyclage et examen officiel RTE",
  location:"France (lieu à confirmer)",dates:"Semaine 47, novembre 2026",
  state:"a_qualifier",
  source:"https://fr.linkedin.com/company/ascot-formations",
  evidence:"Annonce publiée et relayée sur la page de l'organisme ; date de novembre 2026, confirmer les autorisations exigées"
 },
 {
  id:"bti-advisory-github-copilot-octobre",
  buyer:"BTI-Advisory (client final à identifier)",
  buyerStatus:"Intermédiaire mentionné sur le profil de l'autrice ; acheteur direct non établi",
  contact:"Meriem Nasri",contactRole:"Autrice de la mission freelance, mandat à vérifier",
  country:"FR",theme:"ia_digital",mode:"à confirmer",
  need:"Mission freelance : formation de deux jours pour développeurs sur GitHub Copilot Business/Enterprise, prompting, tests et refactoring",
  location:"Paris",dates:"Octobre 2026, dates précises à confirmer",
  state:"a_qualifier",
  source:"https://fr.linkedin.com/in/meriem-nasri-4a608a134",
  evidence:"Publication récente visible sur le profil professionnel, vérifier le statut ouvert et le donneur d'ordre réel"
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
