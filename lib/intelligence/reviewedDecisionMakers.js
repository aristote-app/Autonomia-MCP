// Public professional sources reviewed on 2026-10-11. Exact aliases only:
// a similarly named business must never inherit another company's contact.
import { reviewedResearchContacts } from "./reviewedOpportunityContacts.js";

const contacts = [
  {
    aliases: ["NEOMA REIMS", "NEOMA Business School"],
    name: "Alain Goudey",
    role: "Directeur général adjoint au numérique · NEOMA Business School",
    status: "Direction numérique et stratégie IA documentées · mandat de commande à confirmer",
    linkedin: "https://www.linkedin.com/in/goudey",
    source: "https://neoma-bs.fr/professeurs/goudey-alain",
    additionalSource: "https://alain.goudey.eu/CV-Alain%20GOUDEY-fr-2025.pdf",
    reason: "La fiche officielle NEOMA présente Alain Goudey comme directeur général adjoint en charge du numérique. Son CV public fournit l'URL LinkedIn personnelle. Des publications récentes documentent le déploiement de l'IA à l'école. Aucun mandat d'achat pour l'annonce précise n'est établi.",
    reviewedAt: "2026-10-19"
  },
  {
    aliases: ["DITP", "DITP.", "Direction interministérielle de la transformation publique"],
    name: "Laurent Blanc",
    role: "Interlocuteur projets IA et transformation publique · DITP",
    status: "Responsable de projet IA documenté · rôle dans l'achat à confirmer",
    linkedin: "https://fr.linkedin.com/in/laurentblanc",
    source: "https://fr.linkedin.com/in/laurentblanc",
    reason: "Son profil professionnel public présente les travaux IA de Services Publics+ et son implication dans le programme à la DITP. Son périmètre actuel, son rôle dans le besoin du cockpit et toute autorité de commande doivent être vérifiés avant démarche commerciale.",
    reviewedAt: "2026-10-19"
  },
  {
    aliases: ["CDC Informatique", "CDC INFORMATIQUE"],
    name: "Fabian Boutrouille",
    role: "Directeur de projet · CDC Informatique",
    status: "Contact projet SI identifié · mandat d'achat IA à confirmer",
    linkedin: "https://fr.linkedin.com/in/fabian-boutrouille-701616134",
    source: "https://fr.linkedin.com/in/fabian-boutrouille-701616134",
    reason: "Son profil professionnel indique une fonction de directeur de projet chez CDC Informatique et des publications relatives à la plateforme d'industrialisation IA de la filière SI du Groupe CDC. Son rôle exact dans la consultation repérée et sa capacité de décision commerciale restent à qualifier.",
    reviewedAt: "2026-10-19"
  },
  {
    aliases: ["EQUANS", "Equans France"],
    name: "Philippe Kerignard",
    role: "Head of Innovation & Digital Transformation · Equans",
    status: "Direction innovation identifiée · responsabilité du besoin commercial à confirmer",
    linkedin: "https://fr.linkedin.com/in/kerignard",
    source: "https://fr.linkedin.com/in/kerignard",
    reason: "Son profil professionnel public confirme son rôle Innovation et transformation digitale chez Equans en 2026. Point d'entrée possible pour une offre BUILD; aucune preuve qu'il porte l'achat ou l'annonce repérée.",
    reviewedAt: "2026-10-19"
  },
  {
    aliases: ["SARL LABORATOIRE L&M", "Laboratoire L&M", "Laboratoire LM", "Laboratoire LM Formations", "L&M Formations", "Formation LM"],
    name: "Fabrice Leroy",
    role: "Gérant · ingénieur conseil",
    status: "Dirigeant identifié · décision sur ce besoin à confirmer",
    linkedin: "https://fr.linkedin.com/in/laboratoire-lm-formations-fabrice-leroy-6a211a60",
    source: "https://fr.linkedin.com/posts/laboratoire-lm-formations-fabrice-leroy-6a211a60_recrutement-formateur-formationprofessionnelle-activity-7512862760922243073-KTRf",
    reason: "Le gérant publie lui-même une recherche de formateurs. Point d’entrée pertinent pour qualifier le besoin de formation.",
    reviewedAt: "2026-10-11"
  },
  {
    aliases: ["PerformAcademy", "Perform Academy"],
    name: "Thomas Péchiné",
    role: "Conseiller / formateur · Vienne",
    status: "Contact opérationnel · décideur final à identifier",
    linkedin: "https://fr.linkedin.com/in/p%C3%A9chin%C3%A9-thomas-b04bb414a",
    source: "https://www.performacademy-formation.com/lequipe/",
    reason: "L’équipe officielle confirme son poste. Lucie Barge a annoncé la transmission de l’entreprise ; les nouveaux dirigeants ne sont pas encore identifiés dans les sources consultées.",
    additionalSource: "https://fr.linkedin.com/posts/lucie-barge_une-page-se-tourne-et-quelle-page-apr%C3%A8s-activity-7510728066319417344-9e4s",
    reviewedAt: "2026-10-11"
  },
  {
    aliases: ["G2F", "G2F Conseil", "G2FConseil"],
    name: "Guy de Froment",
    role: "Président · G2F Conseil",
    status: "Intermédiaire · décideur du client final non identifié",
    linkedin: "https://fr.linkedin.com/in/guy-de-froment-8ba2b73b",
    source: "https://fr.linkedin.com/company/g2f-conseil",
    reason: "G2F est un cabinet de recrutement. Son président est un point d’entrée pour identifier le client, pas le décideur du besoin publié pour ce client.",
    reviewedAt: "2026-10-11"
  },
{
  "aliases": [
    "GROUPE SKILLSET"
  ],
  "name": "Emmanuelle Lamachère",
  "role": "Dirigeante · Groupe Skillset",
  "status": "Dirigeante et auteure des offres · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/emmanuellelamachere",
  "source": "https://fr.linkedin.com/jobs/view/apporteurs-d-affaires-btob-f-h-%E2%80%93-secteur-de-la-formation-at-groupe-skillset-4433868482",
  "reason": "La dirigeante publie les recrutements du groupe. Point d’entrée direct pour qualifier les projets de formation et d’IA.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "Copylot Group"
  ],
  "name": "Pierre Rochouane",
  "role": "Président · Copylot Group",
  "status": "Dirigeant identifié · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/pierrerochouane",
  "source": "https://www.copylot.com/",
  "reason": "Le site officiel présente son président et renvoie vers ce profil LinkedIn. Le responsable du besoin commercial ou formation reste à qualifier.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "BEFORMA"
  ],
  "name": "Marine Roche",
  "role": "Responsable formation · Beforma, La Réunion",
  "status": "Contact pédagogique · décideur final à confirmer",
  "linkedin": "https://re.linkedin.com/in/rochemarine/en",
  "source": "https://re.linkedin.com/jobs/view/formateur-comptabilit%C3%A9-et-finance-en-cdi-ou-freelance-h-f-at-ai-by-beforma-business-education-3927301550",
  "reason": "Une offre de Beforma la désigne comme responsable de formation et participante aux entretiens avec le dirigeant Jimmy Sangarin. Son rôle sur le recrutement IA reste à confirmer.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "ECORIS"
  ],
  "name": "Thibaud Gervasoni",
  "role": "Directeur du campus · Ecoris Grenoble",
  "status": "Direction du campus identifiée · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/thibaud-gervasoni-216864138",
  "source": "https://ecoris.com/remise-des-diplomes-2024-ecoris-grenoble/",
  "reason": "Le site officiel confirme la direction du campus de Grenoble, lieu de l’offre de masterclass IA. Le profil personnel correspond à Ecoris Grenoble.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "ELVATUS"
  ],
  "name": "Jamal Mazaz",
  "role": "Fondateur · Elvatus, réseau de formateurs",
  "status": "Intermédiaire identifié · client final à qualifier",
  "linkedin": "https://fr.linkedin.com/in/jamalmazaz",
  "source": "https://fr.linkedin.com/posts/jamalmazaz_formateurtrice-recherch%C3%A9e-en-droit-activity-7500432647060488192-3iWG",
  "reason": "Le fondateur publie des recherches de formateurs. Elvatus intervient pour des organismes de formation : le décideur du client final reste à identifier.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "AGENCE FRANCAISE D'INFORMATIQUE"
  ],
  "name": "Philippe Danne",
  "role": "Direction générale · AFI",
  "status": "Contact de direction · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/philippe-danne-61340512",
  "source": "https://fr.linkedin.com/company/afi-sa",
  "reason": "Le profil professionnel et la page AFI confirment son rattachement à l’éditeur. La responsabilité du besoin Finances publiques reste à qualifier.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "WOOSPEAK"
  ],
  "name": "Mikael Misard",
  "role": "Directeur de publication · Woospeak",
  "status": "Contact de direction · mandat sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/mikaelmisard/en",
  "source": "https://www.woospeak.com/mentions-legales",
  "reason": "Les mentions légales le désignent comme directeur de publication et son profil indique CEO. Le mandat de gérant ayant changé, le décideur du recrutement IA reste à confirmer.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "SPL GAAM HDF"
  ],
  "name": "Jérôme Fedelich",
  "role": "Directeur général · SPL GAAM HDF",
  "status": "Contact nommé dans le marché · attribution selon la procédure",
  "linkedin": "https://fr.linkedin.com/in/jfedelich",
  "source": "https://centraledesmarches.com/marches-publics/Amiens-SPL-GAAM-HDF-ACCORD-CADRE-MONO-ET-MULTI-ATTRIBUTAIRES-A-BONS-DE-COMMANDE-ET-MARCHES-SUBSEQUENTS-PRESTATIONS-INTELLECTUELLES/622275",
  "reason": "L’avis du marché de prestations intellectuelles le nomme comme point de contact. Sa fonction de directeur général est également confirmée par un partenaire industriel.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "Akanea"
  ],
  "name": "Natalia Bekaley",
  "role": "Responsable développement RH · Akanea",
  "status": "Contact RH · décideur opérationnel WMS à identifier",
  "linkedin": "https://fr.linkedin.com/in/natalia-bekaley-2800aa173",
  "source": "https://fr.linkedin.com/posts/natalia-bekaley-2800aa173_recrutement-rh-it-activity-7251922961916465152-d90z",
  "reason": "Son profil et ses publications confirment sa participation au recrutement chez Akanea. Point d’entrée RH pour demander le responsable du recrutement des consultants formateurs WMS.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "Ville de Lyon"
  ],
  "name": "François Pallin",
  "role": "Délégué à la protection des données · Ville de Lyon",
  "status": "Responsable métier identifié · décision du marché à confirmer",
  "linkedin": "https://fr.linkedin.com/in/francois-pallin-bb89301",
  "source": "https://afcdp.net/workgroup/lyon/",
  "reason": "L’AFCDP confirme sa fonction de DPO de la Ville de Lyon. Cette fonction correspond au marché RGPD / RIA ; son implication dans la procédure et l’attribution restent à confirmer.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "ADALIA CONSULTING"
  ],
  "name": "Cécile Jourdain",
  "role": "Présidente et responsable de formation · Adalia",
  "status": "Dirigeante identifiée · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/c%C3%A9cile-jourdain-b54649151",
  "source": "https://adaliaconsulting.fr/qui-sommes-nous/",
  "reason": "L’équipe officielle la présente comme présidente et responsable de formation. Le profil correspond à Adalia School dans le Grand Est, lieu de l’offre de codage et robotique.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "AXSENS"
  ],
  "name": "Mathieu Barre",
  "role": "Direction administrative et RH · Axsens",
  "status": "Contact de direction · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/mathieu-barre-267ba96",
  "source": "https://www.axsens.com/notreequipe/",
  "reason": "Le site officiel confirme la direction administrative et RH. Point d’entrée pour identifier le responsable du besoin numérique, IA et formation ; le pilotage opérationnel reste à qualifier.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "Universite de lille",
    "Université de Lille"
  ],
  "name": "Nicolas Gras",
  "role": "Directeur immobilier et logistique · Université de Lille",
  "status": "Responsable métier identifié · décision du marché à confirmer",
  "linkedin": "https://fr.linkedin.com/in/nicolas-gras-9b946918b",
  "source": "https://fr.linkedin.com/jobs/view/adjoint-au-responsable-maintenance-du-parc-immobilier-h-f-at-universit%C3%A9-de-lille-4448868956",
  "reason": "L’université le présente comme directeur immobilier et logistique et auteur d’une offre sur la maintenance du parc. Point d’entrée pour qualifier le marché de maintenance incendie et son périmètre multiétablissements.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "UNIVERSITE D'AIX MARSEILLE"
  ],
  "name": "Ségolène Durand",
  "role": "Directrice du patrimoine immobilier · Aix-Marseille Université",
  "status": "Responsable métier identifiée · décision du marché à confirmer",
  "linkedin": "https://fr.linkedin.com/in/durand-segolene-691563aa",
  "source": "https://www.univ-amu.fr/ddpi-direction-patrimoine-immobilier",
  "reason": "L’annuaire officiel de la direction du patrimoine confirme sa fonction. Le marché de contrôle technique des bâtiments relève de ce domaine ; son implication dans ce marché reste à confirmer.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "CONSEIL DEPARTEMENTAL DU CALVADOS (CD 14)"
  ],
  "name": "Myriam Kimmel",
  "role": "Directrice de la communication · Département du Calvados",
  "status": "Responsable métier identifiée · décision du marché à confirmer",
  "linkedin": "https://fr.linkedin.com/in/myriam-k-bba9758/fr",
  "source": "https://fr.linkedin.com/posts/d%C3%A9partementducalvados_refonte-du-journal-interne-linterview-de-activity-7245326721367818242-xiwY",
  "reason": "Le Département nomme et lie son profil dans une publication consacrée au journal interne. L’annuaire Service Public confirme sa fonction ; point d’entrée métier pour le marché du magazine départemental.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "PYRAMIDIA"
  ],
  "name": "Hugo Chaussavoine",
  "role": "Dirigeant et directeur de publication · Pyramidia",
  "status": "Dirigeant identifié · décision sur ce besoin à confirmer",
  "linkedin": "https://fr.linkedin.com/in/hugo-chaussavoine-25b1b1147",
  "source": "https://pyramidia.fr/mentions-legales/",
  "reason": "Les mentions légales nomment Hugo Chaussavoine et son profil mentionne Pyramidia. Le recrutement du formateur IA et le profil utilisé actuellement restent à qualifier.",
  "reviewedAt": "2026-10-11"
},
{
  "aliases": [
    "City'up (972)"
  ],
  "name": "Lise Moutamalle",
  "role": "Directrice générale déléguée · City’up",
  "status": "Contact de direction · pilote du marché LLM à identifier",
  "linkedin": "https://mq.linkedin.com/in/lise-moutamalle-ba1b9b11b/fr",
  "source": "https://centraledesmarches.com/marches-publics/Fort-de-France-City-up-972-Prestations-de-developpement-d-agents-LLM-et-services-associes/621528",
  "reason": "Le SIRET du marché correspond à City’up, dont Lise Moutamalle est directrice générale déléguée. Le contact officiel du marché est la cellule commande publique ; le pilote technique et le pouvoir de décision sur les agents LLM restent à qualifier.",
  "reviewedAt": "2026-10-11"
}
];

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, " et ").replace(/[^a-z0-9]+/g, " ").trim();
}

export function getReviewedDecisionMaker(company, { now = Date.now() } = {}) {
  const key = normalize(company);
  if (!key) return null;
  const contact = contacts.find((entry) => entry.aliases.some((alias) => normalize(alias) === key));
  // A historical role should not silently remain a current recommendation.
  if (!contact || !Number.isFinite(Date.parse(contact.reviewedAt)) || now < Date.parse(contact.reviewedAt) || now - Date.parse(contact.reviewedAt) > 30 * 86400000) return null;
  return contact;
}

// Resolve only these reviewed ads; never assign one platform client to every ad.
const opportunityContacts = [
  ...reviewedResearchContacts,
  {
    "ids": [
      "ab6f8fa9-3c1f-4099-8183-71627a7b8a21"
    ],
    "company": "Entreprise non identifiée",
    "resolvedCompany": "Elvatus",
    "contactCompany": "ELVATUS",
    "source": "https://www.meteojob.com/jobs/56115697"
  },
  {
    "ids": [
      "65e482a2-7be2-428c-8f21-6c0dab3c85d9"
    ],
    "company": "DIRECTEMPLOI",
    "resolvedCompany": "ECE · OMNES Education",
    "name": "Gérard Réus",
    "role": "Directeur délégué à la formation · ECE",
    "status": "Responsable des programmes identifié · décision sur ce recrutement à confirmer",
    "linkedin": "https://fr.linkedin.com/in/gerardreus/fr",
    "source": "https://www.jobijoba.com/fr/annonce/54/01f38a33a677b5ee099298c7ea61dd21",
    "reason": "L’annonce de responsable pédagogique MSc IA nomme l’ECE. Gérard Réus présente son pilotage des programmes ingénieurs, Bachelors et MSc sur son profil. Directemploi est la plateforme de diffusion ; l’implication du directeur dans ce recrutement reste à confirmer.",
    "reviewedAt": "2026-10-11"
  }
];

export function getReviewedOpportunityDecisionMaker(company, opportunityId, options = {}) {
  const entry = opportunityContacts.find((item) => item.ids.includes(String(opportunityId || "")) && normalize(item.company) === normalize(company));
  if (!entry) return null;
  const contact = entry.contactCompany ? getReviewedDecisionMaker(entry.contactCompany, options) : entry;
  const now = options.now ?? Date.now();
  if (!contact || now - Date.parse(contact.reviewedAt) > 30 * 86400000) return null;
  return { ...contact, resolvedCompany: entry.resolvedCompany, source: entry.source, reason: entry.contactCompany ? `L’annonce Spark portant la référence 212KTGR nomme Elvatus. ${contact.reason}` : contact.reason };
}
