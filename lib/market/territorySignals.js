import { searchBoamp } from "../collectors/boamp.js";
import {
  TERRITORY_SIGNAL_QUERIES,
  normalizeTerritoryMarketSignal
} from "../signals/territory.js";
import {
  getActiveTerritoriesBySirens,
  insertTerritorySignals
} from "../db/territories.js";
import {
  startCollectorRun,
  finishCollectorRun
} from "../db/persist.js";

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function runAutomatedTerritorySignalRefresh({
  queries = TERRITORY_SIGNAL_QUERIES,
  limitPerQuery = 30,
  triggerMode = "scheduled"
} = {}) {
  const runId = await startCollectorRun({
    sourceId: "boamp",
    triggerMode,
    queryPayload: {
      kind: "territory_signals",
      queries,
      limit_per_query: limitPerQuery
    }
  });

  try {
    const settled = await Promise.allSettled(
      queries.map((query) => searchBoamp({ query, limit: limitPerQuery }))
    );

    const queryRuns = settled.map((entry, index) => ({
      query: queries[index],
      ok: entry.status === "fulfilled",
      result: entry.status === "fulfilled" ? entry.value : null,
      error:
        entry.status === "rejected"
          ? entry.reason instanceof Error
            ? entry.reason.message
            : String(entry.reason)
          : null
    }));

    const fetched = queryRuns.flatMap((run) =>
      (run.result?.items || []).map((item) => ({ item, query: run.query }))
    );

    const withBuyerSiren = fetched.filter(({ item }) => item?.buyerSiren);
    const territoryMap = await getActiveTerritoriesBySirens(
      withBuyerSiren.map(({ item }) => item.buyerSiren)
    );

    const candidates = withBuyerSiren
      .map(({ item, query }) => {
        const territory = territoryMap.get(item.buyerSiren);
        if (!territory) return null;
        return normalizeTerritoryMarketSignal(item, territory, query);
      })
      .filter(Boolean);

    const uniqueCandidates = uniqueBy(
      candidates,
      (item) =>
        [
          item.territoryId,
          item.signalType,
          item.evidenceUrl || "",
          item.payload?.source_record_id || ""
        ].join("|")
    );

    const persistence = await insertTerritorySignals(uniqueCandidates);

    const stats = {
      queries: queries.length,
      successful_queries: queryRuns.filter((run) => run.ok).length,
      failed_queries: queryRuns.filter((run) => !run.ok).length,
      fetched: fetched.length,
      with_buyer_siren: withBuyerSiren.length,
      matched_territories: new Set(uniqueCandidates.map((item) => item.territoryId)).size,
      candidate_signals: uniqueCandidates.length,
      persisted: persistence.inserted,
      duplicates: persistence.duplicates
    };

    await finishCollectorRun(runId, {
      status: queryRuns.some((run) => run.ok) ? "success" : "failed",
      stats,
      errorMessage:
        queryRuns.every((run) => !run.ok)
          ? queryRuns.map((run) => run.error).filter(Boolean).join(" | ")
          : null
    });

    return {
      available: queryRuns.some((run) => run.ok),
      source: "boamp",
      ...stats,
      queryRuns: queryRuns.map(({ query, ok, error }) => ({ query, ok, error }))
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await finishCollectorRun(runId, {
      status: "failed",
      stats: { queries: queries.length, limit_per_query: limitPerQuery },
      errorMessage: message
    });

    throw error;
  }
}
