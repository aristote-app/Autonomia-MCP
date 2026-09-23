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
