import { prioritizeEditorialBacklog } from "../lib/editorialOpportunityEngine.js";

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
