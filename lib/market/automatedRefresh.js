import { refreshAutonomiaMarket } from "../engines/refreshMarket.js";
import {
  persistOpportunityItems,
  startCollectorRun,
  finishCollectorRun
} from "../db/persist.js";
import { searchFreeWork } from "../collectors/freework.js";
import { discoverJobSignals } from "../collectors/jobDiscovery.js";
import { upsertJobSignals } from "../db/jobSignals.js";
import { getVerifiedJobSignalFallback } from "./verifiedJobSignalFallback.js";
import { discoverWebDemandSignals } from "../collectors/webDemandDiscovery.js";
import { discoverFranceTravailDemand } from "../collectors/franceTravail.js";


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

    let provider = discovery.provider || null;
    let items = discovery.items || [];
    let fallbackReason = null;

    if (!discovery.available || items.length === 0) {
      items = getVerifiedJobSignalFallback();
      provider = "verified_public_fallback";
      fallbackReason = discovery.available
        ? "Live Brave discovery returned 0 matching freelance AI jobs"
        : discovery.reason || "Live discovery unavailable";
    }

    const persistence = await upsertJobSignals(items);

    await finishCollectorRun(runId, {
      status: "success",
      stats: {
        provider,
        discovered: items.length,
        persisted: persistence.count || 0,
        searches: discovery.searches || [],
        fallback_reason: fallbackReason
      }
    });

    return {
      available: true,
      provider,
      fallback: Boolean(fallbackReason),
      fallbackReason,
      discoveredRows: items.length,
      persistedRows: persistence.count || 0,
      persistenceErrors: persistence.errors || [],
      bulkPersistenceError: persistence.bulkError || null,
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


export async function runAutomatedExtendedDemandRefresh({
  triggerMode = "scheduled",
  includeWeb = true,
  includeFranceTravail = true
} = {}) {
  const runId = await startCollectorRun({
    sourceId: null,
    triggerMode,
    queryPayload: {
      kind: "extended_demand",
      includeWeb,
      includeFranceTravail,
      sources: [
        ...(includeWeb ? [
          "freelancerepublik",
          "lehibou",
          "linkedin_post",
          "linkedin_training",
          "linkedin_training_post",
          "indeed_training"
        ] : []),
        ...(includeFranceTravail ? ["francetravail"] : [])
      ]
    }
  });

  try {
    const [webResult, franceTravailResult] = await Promise.allSettled([
      includeWeb
        ? discoverWebDemandSignals()
        : Promise.resolve({
            available: false,
            provider: "brave_search_api",
            reason: "skipped_by_schedule",
            items: [],
            searches: []
          }),
      includeFranceTravail
        ? discoverFranceTravailDemand()
        : Promise.resolve({
            available: false,
            provider: "france_travail_offres_v2",
            reason: "skipped_by_schedule",
            items: [],
            searches: []
          })
    ]);

    const web =
      webResult.status === "fulfilled"
        ? webResult.value
        : {
            available: false,
            provider: "brave_search_api",
            reason:
              webResult.reason instanceof Error
                ? webResult.reason.message
                : String(webResult.reason),
            items: [],
            searches: []
          };

    const franceTravail =
      franceTravailResult.status === "fulfilled"
        ? franceTravailResult.value
        : {
            available: false,
            provider: "france_travail_offres_v2",
            reason:
              franceTravailResult.reason instanceof Error
                ? franceTravailResult.reason.message
                : String(franceTravailResult.reason),
            items: [],
            searches: []
          };

    const items = [
      ...(web.items || []),
      ...(franceTravail.items || [])
    ];

    const persistence = await upsertJobSignals(items);

    const result = {
      available: Boolean(web.available || franceTravail.available),
      web: {
        available: Boolean(web.available),
        provider: web.provider || null,
        reason: web.reason || null,
        discoveredRows: web.items?.length || 0,
        searches: web.searches || []
      },
      franceTravail: {
        available: Boolean(franceTravail.available),
        provider: franceTravail.provider || null,
        reason: franceTravail.reason || null,
        discoveredRows: franceTravail.items?.length || 0,
        searches: franceTravail.searches || []
      },
      discoveredRows: items.length,
      persistedRows: persistence.count || 0,
      persistenceErrors: persistence.errors || [],
      bulkPersistenceError: persistence.bulkError || null
    };

    await finishCollectorRun(runId, {
      status: "success",
      stats: {
        discovered: result.discoveredRows,
        persisted: result.persistedRows,
        web_discovered: result.web.discoveredRows,
        france_travail_discovered: result.franceTravail.discoveredRows,
        france_travail_available: result.franceTravail.available,
        web_available: result.web.available,
        persistence_errors: result.persistenceErrors.length
      }
    });

    return result;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error
          ? JSON.stringify({
              code: error.code || null,
              message: error.message || null,
              details: error.details || null,
              hint: error.hint || null
            })
          : String(error);

    await finishCollectorRun(runId, {
      status: "failed",
      stats: {},
      errorMessage: message
    });
    throw error;
  }
}
