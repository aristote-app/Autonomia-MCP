export const problemJourneys = [
  {
    slug: "reduire-travail-manuel",
    title: "Réduire le travail manuel répétitif",
    description: "E-mails, classement, saisie, relances, comptes rendus et reporting : identifier les tâches où l’IA et l’automatisation peuvent enlever du travail de transport sans retirer le contrôle humain.",
    clusters: ["E-mails & boîte de réception", "Administration & opérations", "Réunions & gestion de projet", "Data & reporting"]
  },
  {
    slug: "retrouver-information",
    title: "Retrouver une information interne plus vite",
    description: "Construire une recherche interne utile sur les documents, procédures, contrats, comptes rendus et bases de connaissances sans transformer chaque dossier en chatbot isolé.",
    clusters: ["Knowledge management & recherche interne", "Google Drive & documents", "IT, helpdesk & sécurité"]
  },
  {
    slug: "repondre-clients-plus-vite",
    title: "Répondre plus vite aux clients et prospects",
    description: "Qualifier, préparer des réponses, retrouver le bon contexte et déclencher la bonne action tout en gardant les décisions sensibles sous contrôle humain.",
    clusters: ["Support client", "Commercial & CRM", "Retail & e-commerce"]
  },
  {
    slug: "securiser-dossiers",
    title: "Contrôler des dossiers avant transmission",
    description: "Détecter les pièces manquantes, comparer des documents, suivre les obligations et créer des files d’exception plutôt que laisser l’IA décider silencieusement.",
    clusters: ["Administration & opérations", "Juridique & conformité", "Achats & fournisseurs"]
  },
  {
    slug: "automatiser-reporting",
    title: "Automatiser le reporting et les synthèses",
    description: "Transformer des données, comptes rendus et exports en synthèses utiles sans inventer les causes derrière les chiffres.",
    clusters: ["Data & reporting", "Direction & management", "Réunions & gestion de projet"]
  },
  {
    slug: "fiabiliser-flux-documents",
    title: "Fiabiliser les flux de documents",
    description: "Classer, nommer, extraire, comparer et router les documents entrants vers le bon dossier ou la bonne personne.",
    clusters: ["Google Drive & documents", "E-mails & boîte de réception", "Finance & comptabilité", "Logistique & supply chain"]
  },
  {
    slug: "mieux-piloter-projets",
    title: "Mieux piloter les projets et les décisions",
    description: "Faire remonter les actions ouvertes, préparer les réunions, mémoriser les décisions et détecter les blocages sans multiplier les tableaux manuels.",
    clusters: ["Réunions & gestion de projet", "Direction & management", "BTP & chantier"]
  },
  {
    slug: "creer-assistant-documentaire",
    title: "Créer un assistant documentaire fiable",
    description: "Passer d’un stock de fichiers à une mémoire interrogeable, avec citations, permissions, fraîcheur des sources et capacité à dire « je ne sais pas ».",
    clusters: ["Knowledge management & recherche interne", "Google Drive & documents", "Juridique & conformité"]
  }
];

export const professionJourneys = [
  {
    slug: "direction-managers",
    title: "Direction & managers",
    description: "Synthèses de direction, décisions, reporting, réunions et copilotes internes.",
    clusters: ["Direction & management", "Data & reporting", "Réunions & gestion de projet"]
  },
  {
    slug: "commercial",
    title: "Commerciaux & responsables des ventes",
    description: "Préparation de rendez-vous, qualification, CRM, relances et analyse des opportunités.",
    clusters: ["Commercial & CRM", "E-mails & boîte de réception", "Data & reporting"]
  },
  {
    slug: "marketing-communication",
    title: "Marketing & communication",
    description: "Production, recyclage, briefs, veille, segmentation et exploitation des signaux clients.",
    clusters: ["Marketing & contenu", "Commercial & CRM", "Retail & e-commerce"]
  },
  {
    slug: "rh",
    title: "RH & recrutement",
    description: "Onboarding, procédures, entretiens, compétences et assistance documentaire sans automatiser la décision humaine.",
    clusters: ["RH & recrutement", "Knowledge management & recherche interne", "Administration & opérations"]
  },
  {
    slug: "finance-comptabilite",
    title: "Finance, comptabilité & DAF",
    description: "Factures, contrôles de cohérence, justificatifs, écarts, trésorerie et commentaires de gestion.",
    clusters: ["Finance & comptabilité", "Data & reporting", "E-mails & boîte de réception"]
  },
  {
    slug: "operations-administration",
    title: "Opérations & administration",
    description: "Dossiers, pièces manquantes, courriers, formulaires, routage et suivi des demandes.",
    clusters: ["Administration & opérations", "E-mails & boîte de réception", "Google Drive & documents"]
  },
  {
    slug: "chefs-projet-pmo",
    title: "Chefs de projet & PMO",
    description: "Comptes rendus, plans d’action, ordres du jour, mémoire projet et synthèses d’avancement.",
    clusters: ["Réunions & gestion de projet", "Data & reporting", "Knowledge management & recherche interne"]
  },
  {
    slug: "dsi-it-helpdesk",
    title: "DSI, IT & helpdesk",
    description: "Tickets, documentation, incidents, accès, procédures et assistants internes.",
    clusters: ["IT, helpdesk & sécurité", "Knowledge management & recherche interne", "Data & reporting"]
  },
  {
    slug: "juridique-conformite",
    title: "Juridique & conformité",
    description: "Contrats, clauses, politiques internes, obligations, dates et assistants documentaires sourcés.",
    clusters: ["Juridique & conformité", "Knowledge management & recherche interne", "Administration & opérations"]
  },
  {
    slug: "achats-supply-chain",
    title: "Achats & supply chain",
    description: "Offres fournisseurs, devis, incidents, documents transport et contrôles commande-livraison-facture.",
    clusters: ["Achats & fournisseurs", "Logistique & supply chain", "Finance & comptabilité"]
  },
  {
    slug: "support-relation-client",
    title: "Support & relation client",
    description: "Triage, brouillons de réponse, historique client, base de connaissances et signaux d’insatisfaction.",
    clusters: ["Support client", "Commercial & CRM", "Retail & e-commerce"]
  },
  {
    slug: "chantier-construction",
    title: "Chantier & construction",
    description: "Comptes rendus, réserves, photos, documents, relances entreprises et mémoire de chantier.",
    clusters: ["BTP & chantier", "Réunions & gestion de projet", "Achats & fournisseurs"]
  }
];

export const sectorJourneys = [
  {
    slug: "btp-construction",
    title: "BTP & construction",
    description: "Automatiser le suivi documentaire et opérationnel des chantiers sans perdre la traçabilité.",
    clusters: ["BTP & chantier", "Achats & fournisseurs", "Réunions & gestion de projet"]
  },
  {
    slug: "immobilier",
    title: "Immobilier & gestion de biens",
    description: "Demandes locataires, états des lieux, interventions, dossiers et suivi des prestataires.",
    clusters: ["Immobilier & gestion de biens", "Administration & opérations", "E-mails & boîte de réception"]
  },
  {
    slug: "retail-ecommerce",
    title: "Retail & e-commerce",
    description: "Catalogue, avis clients, support, questions produit, synthèses de vente et veille autorisée.",
    clusters: ["Retail & e-commerce", "Support client", "Marketing & contenu"]
  },
  {
    slug: "industrie-logistique",
    title: "Industrie, logistique & supply chain",
    description: "Incidents, livraisons, documents transport, procédures et synthèses fournisseurs.",
    clusters: ["Logistique & supply chain", "Achats & fournisseurs", "Data & reporting"]
  },
  {
    slug: "services-professionnels",
    title: "Conseil & services professionnels",
    description: "Entretiens, briefs, livrables, ateliers, synthèses et capitalisation des missions.",
    clusters: ["Conseil & services professionnels", "Knowledge management & recherche interne", "Réunions & gestion de projet"]
  },
  {
    slug: "finance-services",
    title: "Finance & services administratifs",
    description: "Contrôles documentaires, factures, justificatifs, reporting et procédures.",
    clusters: ["Finance & comptabilité", "Administration & opérations", "Data & reporting"]
  },
  {
    slug: "saas-tech",
    title: "SaaS & entreprises technologiques",
    description: "Support, helpdesk, knowledge base, CRM, documentation et flux internes.",
    clusters: ["IT, helpdesk & sécurité", "Support client", "Commercial & CRM", "Knowledge management & recherche interne"]
  },
  {
    slug: "organismes-formation",
    title: "Organismes de formation & éducation professionnelle",
    description: "Dossiers, documents, reporting, support apprenants, contenus et capitalisation pédagogique.",
    clusters: ["Administration & opérations", "Knowledge management & recherche interne", "Marketing & contenu", "Data & reporting"]
  },
  {
    slug: "collectivites",
    title: "Collectivités & acteurs publics",
    description: "Usages documentaires, relation usager, procédures et automatisations à cadrer avec les obligations du secteur public.",
    clusters: ["Administration & opérations", "Knowledge management & recherche interne", "Support client"],
    href: "/territoires"
  },
  {
    slug: "cabinets-juridiques",
    title: "Cabinets juridiques & fonctions conformité",
    description: "Contrats, clauses, dossiers, obligations et recherche documentaire sourcée.",
    clusters: ["Juridique & conformité", "Knowledge management & recherche interne", "Administration & opérations"]
  }
];

export function articlesForJourney(journey, articles, limit = 8) {
  const clusterOrder = new Map(journey.clusters.map((cluster, index) => [cluster, index]));
  return articles
    .filter((article) => clusterOrder.has(article.cluster))
    .sort((a, b) => {
      const clusterDelta = clusterOrder.get(a.cluster) - clusterOrder.get(b.cluster);
      if (clusterDelta !== 0) return clusterDelta;
      return String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""));
    })
    .slice(0, limit);
}
