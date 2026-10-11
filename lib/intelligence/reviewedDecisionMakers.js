// Public professional sources reviewed on 2026-10-11. Exact aliases only:
// a similarly named business must never inherit another company's contact.
const contacts = [
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
  if (!contact || now - Date.parse(contact.reviewedAt) > 30 * 86400000) return null;
  return contact;
}
