function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const territoryClusters = [
  {
    cluster: "Stratégie IA territoriale",
    pillar: "Construire une feuille de route IA pour une intercommunalité",
    summary: "Aider une communauté de communes ou d'agglomération à passer de l'acculturation à un portefeuille de cas d'usage priorisés, gouvernés et mesurables.",
    topics: [
      "Comment construire une feuille de route IA pour une communauté de communes",
      "Quels cas d'usage IA prioriser dans une intercommunalité",
      "Comment lancer un diagnostic IA des services d'une communauté d'agglomération",
      "Comment organiser la gouvernance IA entre DGS, DSI et directions métiers",
      "Comment choisir les premiers projets IA sans lancer un grand programme informatique",
      "Comment mesurer la valeur d'un programme IA territorial sans inventer de ROI",
      "Comment cadrer les données et responsabilités avant un projet IA public",
      "Comment créer un comité IA intercommunal utile et léger"
    ]
  },
  {
    cluster: "Agents & services publics",
    pillar: "Déployer des usages IA utiles aux agents et aux services publics",
    summary: "Partir des tâches réelles des agents, garder la validation humaine et documenter les limites, les données utilisées et les procédures d'escalade.",
    topics: [
      "IA pour les agents territoriaux : 12 cas d'usage concrets et contrôlables",
      "Automatiser les comptes rendus de réunion dans une collectivité avec validation humaine",
      "Créer un assistant IA interne qui cite les procédures de la collectivité",
      "Utiliser l'IA pour préparer des réponses aux administrés sans automatiser la décision",
      "Résumer des dossiers administratifs avec l'IA sans perdre les sources",
      "Créer une veille réglementaire assistée par IA pour les services territoriaux",
      "Aider un service RH territorial à préparer ses documents avec l'IA",
      "Utiliser l'IA pour préparer les réunions et suivre les décisions interservices"
    ]
  },
  {
    cluster: "Développement économique local",
    pillar: "Accompagner les TPE-PME du territoire dans l'adoption de l'IA",
    summary: "Donner au service développement économique un programme opérationnel pour détecter les besoins des entreprises, organiser des ateliers et transformer les diagnostics en projets.",
    topics: [
      "Comment une communauté de communes peut accompagner les TPE-PME sur l'IA",
      "Construire un accélérateur IA territorial pour les TPE et PME",
      "Organiser des ateliers IA pour les entreprises d'un territoire",
      "Comment détecter les besoins IA des entreprises locales avant de créer un programme",
      "Créer un diagnostic IA court pour les TPE-PME d'une intercommunalité",
      "Quels cas d'usage IA proposer aux artisans, commerces et petites entreprises",
      "Comment construire un parcours collectif puis individuel d'accompagnement IA",
      "Comment suivre les résultats d'un programme IA pour les entreprises locales"
    ]
  },
  {
    cluster: "Formation & adoption collectivités",
    pillar: "Former les agents et sécuriser l'adoption de l'IA",
    summary: "Structurer une montée en compétences progressive : règles d'usage, pratique métier, vérification, référents internes et partage des méthodes.",
    topics: [
      "Construire un plan de formation IA pour les agents d'une communauté de communes",
      "Former les managers territoriaux à encadrer l'usage de l'IA",
      "Créer un réseau de référents IA dans une collectivité",
      "Organiser une acculturation IA pour les élus et directions générales",
      "Former les agents à vérifier les réponses d'une IA générative",
      "Créer une charte d'usage opérationnelle de l'IA pour les agents",
      "Passer d'une formation ChatGPT à des cas d'usage métier réellement appliqués",
      "Mesurer l'adoption de l'IA dans une collectivité sans confondre usage et valeur"
    ]
  },
  {
    cluster: "Services techniques & infrastructures",
    pillar: "Appliquer l'IA aux services techniques et aux infrastructures territoriales",
    summary: "Cadrer des usages IA sur des données techniques, des réseaux et des équipements publics sans transformer un cas d'usage métier en projet opaque : données, supervision humaine, mesure, résilience et réversibilité restent explicites.",
    topics: [
      "IA pour optimiser un réseau d'eau potable : cas d'usage, données et garde-fous",
      "Détecter les anomalies et fuites d'un réseau d'eau avec l'IA sans automatiser aveuglément les décisions",
      "Utiliser l'IA pour prioriser la maintenance des équipements publics",
      "Créer une maintenance prédictive simple pour les équipements d'une intercommunalité",
      "Aider les services voirie à prioriser les interventions avec des données et de l'IA",
      "Utiliser l'IA pour analyser les consommations énergétiques des bâtiments publics",
      "Préparer des tournées et interventions plus efficaces pour les services techniques avec l'IA",
      "Comment cadrer un pilote IA pour un service technique territorial avant passage à l'échelle"
    ]
  }
];

export const territoryBacklog = territoryClusters.flatMap((group) =>
  group.topics.map((title) => ({
    type: "territory-use-case",
    cluster: group.cluster,
    clusterSlug: slugify(group.cluster),
    pillar: group.pillar,
    title,
    slug: slugify(title),
    status: "backlog",
    minWords: 2200
  }))
);

export const territoryPillars = territoryClusters.map((group) => ({
  type: "territory-pillar",
  cluster: group.cluster,
  slug: slugify(group.cluster),
  title: group.pillar,
  summary: group.summary,
  topics: group.topics.map((title) => ({ title, slug: slugify(title) }))
}));

export function getTerritoryTopic(slug) {
  return territoryBacklog.find((topic) => topic.slug === slug) || null;
}

export function getTerritoryPillar(slugOrCluster) {
  return territoryPillars.find(
    (pillar) => pillar.slug === slugOrCluster || pillar.cluster === slugOrCluster
  ) || null;
}

export const territoryEditorialCounts = {
  backlog: territoryBacklog.length,
  pillars: territoryPillars.length
};
