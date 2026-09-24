import { prioritizeEditorialBacklog } from "../lib/editorialOpportunityEngine.js";

const territoryResult = prioritizeEditorialBacklog(
  [
    {
      query: "communauté de communes feuille de route IA agents entreprises locales",
      cluster: "Collectivités & territoires",
      family: "territory-use-case",
      public_procurement_mentions: 8,
      territory_mentions: 12,
      job_mentions: 2
    }
  ],
  { max_results: 50 }
);

const territoryRecommendation = territoryResult.recommendations.find(
  (item) => item.family === "territory" && item.evidence.matched_signals > 0
);

if (!territoryRecommendation) {
  throw new Error("Expected an evidence-backed territory editorial recommendation.");
}

if (
  territoryRecommendation.evidence.public_procurement_mentions <= 0 ||
  territoryRecommendation.evidence.territory_mentions <= 0
) {
  throw new Error("Territory recommendation must preserve public/territory evidence.");
}

const result = prioritizeEditorialBacklog(
  [
    {
      query: "automatiser suivi actions atelier client",
      search_impressions: 900,
      search_clicks: 40,
      paid_search_conversions: 3,
      inbound_mentions: 8,
      revenue: 12000
    },
    {
      query: "formation managers workflows agents ia",
      search_impressions: 500,
      search_clicks: 22,
      inbound_mentions: 5,
      job_mentions: 30,
      ai_citations: 2
    }
  ],
  { max_results: 25 }
);

if (!result.rules?.evidence_first) {
  throw new Error("Editorial engine must remain evidence-first.");
}

if (result.rules?.no_signal_auto_publish !== false) {
  throw new Error("Editorial engine must never auto-publish no-signal topics.");
}

if (result.remaining_candidates < 300) {
  throw new Error(`Unexpectedly small remaining backlog: ${result.remaining_candidates}`);
}

const promoted = result.recommendations.filter((item) => item.action === "promote");
if (!promoted.length) {
  throw new Error("Expected at least one evidence-backed promote recommendation.");
}

const invalid = result.recommendations.find(
  (item) => item.action === "promote" && item.evidence.matched_signals === 0
);
if (invalid) {
  throw new Error(`Topic promoted without evidence: ${invalid.slug}`);
}

const overlap = result.recommendations.find((item) => item.action === "review_overlap");
if (overlap && overlap.closest_published?.similarity < 0.72) {
  throw new Error("Overlap review must be backed by high semantic similarity.");
}

console.log(
  JSON.stringify(
    {
      ok: true,
      remaining_candidates: result.remaining_candidates,
      top_recommendations: result.recommendations.slice(0, 5).map((item) => ({
        slug: item.slug,
        action: item.action,
        score: item.score,
        matched_signals: item.evidence.matched_signals
      }))
    },
    null,
    2
  )
);


const concreteTerritoryTraining = prioritizeEditorialBacklog(
  [
    {
      query: "Formation et accompagnement des managers territoriaux à l'usage de l'intelligence artificielle",
      cluster: "Collectivités & territoires",
      family: "territory-use-case",
      public_procurement_mentions: 1,
      territory_mentions: 5
    }
  ],
  { max_results: 100 }
);

const managersTraining = concreteTerritoryTraining.recommendations.find(
  (item) => item.slug === "former-les-managers-territoriaux-a-encadrer-l-usage-de-l-ia"
);
const charterTopic = concreteTerritoryTraining.recommendations.find(
  (item) => item.slug === "creer-une-charte-d-usage-operationnelle-de-l-ia-pour-les-agents"
);

if (!managersTraining || managersTraining.evidence.matched_signals <= 0) {
  throw new Error(
    "Concrete manager-training evidence must keep the manager topic evidence-backed."
  );
}

if (charterTopic && managersTraining.score <= charterTopic.score) {
  throw new Error(
    "When a generic territory topic remains in the shortlist, a direct manager-training match must rank above it."
  );
}



function assertTerritoryIntent(signalQuery, targetSlug, decoySlugs = []) {
  const output = prioritizeEditorialBacklog(
    [
      {
        query: signalQuery,
        cluster: "Collectivités & territoires",
        family: "territory-use-case",
        public_procurement_mentions: 1,
        territory_mentions: 5
      }
    ],
    { max_results: 100 }
  );

  const target = output.recommendations.find((item) => item.slug === targetSlug);
  if (!target || target.evidence.matched_signals <= 0) {
    throw new Error(`Expected concrete territory intent to support ${targetSlug}: ${signalQuery}`);
  }

  for (const decoySlug of decoySlugs) {
    const decoy = output.recommendations.find((item) => item.slug === decoySlug);
    if (decoy && target.score <= decoy.score) {
      throw new Error(
        `Expected ${targetSlug} (${target.score}) to outrank ${decoySlug} (${decoy.score}) for: ${signalQuery}`
      );
    }
  }
}

assertTerritoryIntent(
  "Formation et accompagnement des managers territoriaux à l'usage de l'intelligence artificielle",
  "former-les-managers-territoriaux-a-encadrer-l-usage-de-l-ia",
  [
    "creer-une-charte-d-usage-operationnelle-de-l-ia-pour-les-agents",
    "organiser-une-acculturation-ia-pour-les-elus-et-directions-generales"
  ]
);

assertTerritoryIntent(
  "Programme d'accompagnement IA des TPE PME et entreprises locales du territoire",
  "comment-une-communaute-de-communes-peut-accompagner-les-tpe-pme-sur-l-ia",
  [
    "former-les-managers-territoriaux-a-encadrer-l-usage-de-l-ia",
    "creer-une-charte-d-usage-operationnelle-de-l-ia-pour-les-agents"
  ]
);

assertTerritoryIntent(
  "Automatisation des comptes rendus de réunion et du suivi des actions pour les agents",
  "automatiser-les-comptes-rendus-de-reunion-dans-une-collectivite-avec-validation-humaine",
  [
    "creer-un-assistant-ia-interne-qui-cite-les-procedures-de-la-collectivite",
    "utiliser-l-ia-pour-preparer-des-reponses-aux-administres-sans-automatiser-la-decision"
  ]
);

assertTerritoryIntent(
  "Charte IA, gouvernance, règles d'usage et responsabilités pour les agents territoriaux",
  "creer-une-charte-d-usage-operationnelle-de-l-ia-pour-les-agents",
  [
    "former-les-managers-territoriaux-a-encadrer-l-usage-de-l-ia",
    "organiser-des-ateliers-ia-pour-les-entreprises-d-un-territoire"
  ]
);

assertTerritoryIntent(
  "Améliorer la relation usager et préparer les réponses aux administrés avec validation humaine",
  "utiliser-l-ia-pour-preparer-des-reponses-aux-administres-sans-automatiser-la-decision",
  [
    "creer-un-assistant-ia-interne-qui-cite-les-procedures-de-la-collectivite",
    "automatiser-les-comptes-rendus-de-reunion-dans-une-collectivite-avec-validation-humaine"
  ]
);

assertTerritoryIntent(
  "Assistant documentaire RAG sur les procédures et documents internes avec citation des sources",
  "creer-un-assistant-ia-interne-qui-cite-les-procedures-de-la-collectivite",
  [
    "utiliser-l-ia-pour-preparer-des-reponses-aux-administres-sans-automatiser-la-decision",
    "automatiser-les-comptes-rendus-de-reunion-dans-une-collectivite-avec-validation-humaine"
  ]
);


const waterNetworkTerritory = prioritizeEditorialBacklog(
  [
    {
      query: "Fourniture d'un outil d'optimisation de la performance des réseaux d'eau potable à l'aide de l'intelligence artificielle",
      cluster: "Collectivités & territoires",
      family: "territory-use-case",
      public_procurement_mentions: 1,
      territory_mentions: 5
    }
  ],
  { max_results: 100 }
);

const waterTopic = waterNetworkTerritory.recommendations.find(
  (item) => item.slug === "ia-pour-optimiser-un-reseau-d-eau-potable-cas-d-usage-donnees-et-garde-fous"
);

if (!waterTopic || waterTopic.evidence.matched_signals <= 0) {
  throw new Error("A concrete water-network AI signal must produce an evidence-backed technical territory topic.");
}
