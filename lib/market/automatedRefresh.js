import { refreshAutonomiaMarket } from "../engines/refreshMarket.js";
import { persistOpportunityItems } from "../db/persist.js";
import { discoverJobSignals } from "../collectors/jobDiscovery.js";
import { upsertJobSignals } from "../db/jobSignals.js";

export async function runAutomatedMarketRefresh({
  query = "intelligence artificielle",
  scopes = ["public", "training", "freelance"],
  limitPerQuery = 8
} = {}) {
  const result = await refreshAutonomiaMarket({
    query,
    scopes,
    limitPerQuery,
    includeUpwork: true
  });

  const persistence = await persistOpportunityItems(result.opportunities || []);

  return {
    query,
    scopes,
    refreshedAt: result.refreshedAt,
    rawOpportunityRows: result.rawOpportunityRows,
    uniqueOpportunityRows: result.uniqueOpportunityRows,
    persistedRows: persistence.count || 0,
    coverage: result.coverage,
    errors: result.errors
  };
}


export async function runAutomatedJobSignalRefresh() {
  const discovery = await discoverJobSignals();

  if (!discovery.available) {
    return {
      available: false,
      reason: discovery.reason,
      discoveredRows: 0,
      persistedRows: 0,
      searches: discovery.searches || []
    };
  }

  const persistence = await upsertJobSignals(discovery.items || []);

  return {
    available: true,
    provider: discovery.provider,
    discoveredRows: discovery.items?.length || 0,
    persistedRows: persistence.count || 0,
    searches: discovery.searches || []
  };
}
