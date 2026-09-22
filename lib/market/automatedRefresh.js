import { refreshAutonomiaMarket } from "../engines/refreshMarket.js";
import {
  persistOpportunityItems,
  startCollectorRun,
  finishCollectorRun
} from "../db/persist.js";
import { searchFreeWork } from "../collectors/freework.js";
import { discoverJobSignals } from "../collectors/jobDiscovery.js";
import { upsertJobSignals } from "../db/jobSignals.js";


export async function runAutomatedFreelanceRefresh({
  category = "ia",
  limit = 50,
  triggerMode = "scheduled"
} = {}) {
  const runId = await startCollectorRun({
    sourceId: "freework",
    triggerMode,
    queryPayload: { category, limit }
  });

  try {
    const result = await searchFreeWork({ category, page: 1, limit });
    const persistence = await persistOpportunityItems(result.items || [], {
      collectorRunId: runId
    });

    await finishCollectorRun(runId, {
      status: "success",
      stats: {
        fetched: result.count || 0,
        persisted: persistence.count || 0,
        category,
        source_url: result.sourceUrl || null
      }
    });

    return {
      available: true,
      source: "freework",
      category,
      fetchedRows: result.count || 0,
      persistedRows: persistence.count || 0,
      sourceUrl: result.sourceUrl || null,
      robotsAllowed: result.robots?.allowed !== false
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await finishCollectorRun(runId, {
      status: "failed",
      stats: { category, limit },
      errorMessage: message
    });

    throw error;
  }
}

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


export async function runAutomatedJobSignalRefresh({
  triggerMode = "scheduled"
} = {}) {
  const runId = await startCollectorRun({
    sourceId: null,
    triggerMode,
    queryPayload: { kind: "job_signals", sources: ["linkedin", "indeed"] }
  });

  try {
    const discovery = await discoverJobSignals();

    if (!discovery.available) {
      await finishCollectorRun(runId, {
        status: "failed",
        stats: { discovered: 0, persisted: 0 },
        errorMessage: discovery.reason || "Job discovery unavailable"
      });

      return {
        available: false,
        reason: discovery.reason,
        discoveredRows: 0,
        persistedRows: 0,
        searches: discovery.searches || []
      };
    }

    const persistence = await upsertJobSignals(discovery.items || []);

    await finishCollectorRun(runId, {
      status: "success",
      stats: {
        provider: discovery.provider || null,
        discovered: discovery.items?.length || 0,
        persisted: persistence.count || 0,
        searches: discovery.searches || []
      }
    });

    return {
      available: true,
      provider: discovery.provider,
      discoveredRows: discovery.items?.length || 0,
      persistedRows: persistence.count || 0,
      searches: discovery.searches || []
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await finishCollectorRun(runId, {
      status: "failed",
      stats: {},
      errorMessage: message
    });

    throw error;
  }
}
