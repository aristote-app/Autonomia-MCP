import {
  analyzeOrganicRecords,
  detectCannibalization
} from "../lib/organicDecisionEngine.js";

const now = new Date("2026-09-20T12:00:00Z");

const records = [
  {
    provider: "google_search_console",
    observed_at: "2026-09-20",
    url: "https://autonomia.fr/cas-usage-ia/test-winner",
    query: "automatisation ia entreprise",
    impressions: 1000,
    clicks: 5,
    conversions: 2,
    previous_impressions: 1500,
    modified_at: "2026-01-01"
  },
  {
    provider: "google_generative_ai",
    observed_at: "2026-09-20",
    url: "https://autonomia.fr/cas-usage-ia/test-cited",
    query: "assistant ia documentaire",
    impressions: 40,
    clicks: 0,
    citations: 4,
    conversions: 0,
    modified_at: "2026-09-01"
  },
  {
    provider: "google_search_console",
    observed_at: "2026-09-20",
    url: "https://autonomia.fr/cas-usage-ia/page-a",
    query: "formation agent ia",
    impressions: 120,
    clicks: 3,
    conversions: 0,
    modified_at: "2026-09-10"
  },
  {
    provider: "google_search_console",
    observed_at: "2026-09-20",
    url: "https://autonomia.fr/formation-ia/cas-usage/page-b",
    query: "formation agent ia",
    impressions: 100,
    clicks: 4,
    conversions: 0,
    modified_at: "2026-09-10"
  }
];

const result = analyzeOrganicRecords(records, now);
const actions = new Set(result.recommendations.map((item) => item.action));

for (const required of [
  "expand_winner",
  "improve_search_snippet",
  "refresh_content",
  "investigate_decay",
  "strengthen_citable_answer"
]) {
  if (!actions.has(required)) {
    throw new Error(`Expected recommendation action missing: ${required}`);
  }
}

const cannibalization = detectCannibalization(records);
if (!cannibalization.some((item) => item.query === "formation agent ia")) {
  throw new Error("Expected cannibalization signal for shared query.");
}

console.log(
  JSON.stringify(
    {
      ok: true,
      recommendation_actions: [...actions],
      cannibalization_findings: cannibalization.length
    },
    null,
    2
  )
);
