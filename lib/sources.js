export const SOURCE_GROUPS = [
  {
    id: "freelance",
    label: "Missions freelance IA",
    description: "Missions, TJM, compétences et intitulés réellement demandés."
  },
  {
    id: "public",
    label: "Marchés publics IA",
    description: "Avis ouverts, historique d'attribution, acheteurs et titulaires."
  },
  {
    id: "training",
    label: "Formation IA",
    description: "Appels d'offres formation, OPCO et demande observable."
  }
];

export const SOURCES = [
  { id: "freelancemention", name: "FreelanceMention", group: "freelance", priority: "P0", status: "ready_for_credentials", mode: "official_api" },
  { id: "linkedin", name: "LinkedIn Jobs", group: "freelance", priority: "P0", status: "ready_for_search_api", mode: "public_web_index_or_authorized_import" },
  { id: "indeed", name: "Indeed.fr", group: "freelance", priority: "P1", status: "ready_for_search_api", mode: "public_web_index_or_authorized_import" },
  { id: "malt", name: "Malt", group: "freelance", priority: "P1", status: "planned", mode: "public_or_authorized_access" },
  { id: "upwork", name: "Upwork", group: "freelance", priority: "P1", status: "ready_for_credentials", mode: "official_api" },
  { id: "freework", name: "Free-Work", group: "freelance", priority: "P1", status: "active", mode: "robots_guarded_public_pages" },
  { id: "lehibou", name: "LeHibou", group: "freelance", priority: "P1", status: "technical_access_blocked", mode: "manual_or_web_verification" },

  { id: "boamp", name: "BOAMP", group: "public", priority: "P0", status: "active", mode: "official_api" },
  { id: "ted", name: "TED / JOUE", group: "public", priority: "P0", status: "active", mode: "official_api" },
  { id: "decp", name: "DECP", group: "public", priority: "P0", status: "planned", mode: "open_data" },
  { id: "place", name: "PLACE", group: "public", priority: "P0", status: "planned", mode: "public_portal" },
  { id: "profils_acheteurs", name: "Profils acheteurs", group: "public", priority: "P1", status: "registry_active", mode: "mixed_public_portals" },
  { id: "marches_securises", name: "Marchés-Sécurisés", group: "public", priority: "P1", status: "live_validation", mode: "robots_guarded_public_search" },

  { id: "opco", name: "11 OPCO", group: "training", priority: "P0", status: "planned", mode: "public_portals" },
  { id: "mcf_offer", name: "Mon Compte Formation - offre", group: "training", priority: "P1", status: "active", mode: "open_data" },
  { id: "mcf_engaged", name: "Mon Compte Formation - formations engagées", group: "training", priority: "P1", status: "active", mode: "open_data" },
  { id: "mcf_flows", name: "Mon Compte Formation - entrées/sorties", group: "training", priority: "P1", status: "active", mode: "open_data" }
];
