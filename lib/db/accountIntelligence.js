import { searchRankedOpportunities } from "./intelligence.js";
import { searchJobSignals } from "./jobSignals.js";
import { buildAccountIntelligence, findAccountBySlug } from "../intelligence/accounts.js";

const ACCOUNT_SIGNAL_SOURCES = [
  "linkedin",
  "indeed",
  "freelancerepublik",
  "lehibou",
  "france_travail_jobs"
];

export async function loadAccountIntelligence({ limit = 150 } = {}) {
  const [opportunities, jobSignals] = await Promise.all([
    searchRankedOpportunities({
      actionability: "active",
      aiRelatedOnly: true,
      minFitScore: 0,
      limit: 200
    }),
    searchJobSignals({
      sources: ACCOUNT_SIGNAL_SOURCES,
      franceOnly: true,
      limit: 500
    })
  ]);

  const accounts = buildAccountIntelligence({
    opportunities: opportunities.items || [],
    jobSignals: jobSignals.items || []
  });

  return {
    generated_at: new Date().toISOString(),
    account_count: accounts.length,
    accounts: accounts.slice(0, Math.max(1, Number(limit) || 150))
  };
}

export async function loadAccountBySlug(slug) {
  const result = await loadAccountIntelligence({ limit: 500 });
  return findAccountBySlug(result.accounts, slug);
}
