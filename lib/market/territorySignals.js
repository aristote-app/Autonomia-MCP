import { searchBoamp } from "../collectors/boamp.js";
import { searchTed } from "../collectors/ted.js";
import {
  TERRITORY_SIGNAL_QUERIES,
  normalizeTerritoryMarketSignal
} from "../signals/territory.js";
import {
  getActiveTerritoriesBySirens,
  insertTerritorySignals,
  listActiveTerritoryDirectory
} from "../db/territories.js";
import {
  startCollectorRun,
  finishCollectorRun
} from "../db/persist.js";


function normalizeBuyerName(value = "") {
  let text = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";

  text = text
    .replace(/^cc\s+/, "communaute de communes ")
    .replace(/^ca\s+/, "communaute d agglomeration ")
    .replace(/^cu\s+/, "communaute urbaine ")
    .replace(/^comcom\s+/, "communaute de communes ");

  return text.replace(/\s+/g, " ").trim();
}

function territoryCoreName(value = "") {
  return normalizeBuyerName(value)
    .replace(/^communaute de communes\s+/, "")
    .replace(/^communaute d agglomeration\s+/, "")
    .replace(/^communaute urbaine\s+/, "")
    .replace(/^metropole\s+/, "")
    .replace(/^syndicat mixte\s+/, "")
    .replace(/^petr\s+/, "")
    .trim();
}

export function buildTerritoryNameIndex(directory = []) {
  const exact = new Map();
  const core = new Map();
  const collisions = new Set();

  for (const territory of directory) {
    const fullKey = normalizeBuyerName(territory?.name);
    if (fullKey) exact.set(fullKey, territory);

    const coreKey = territoryCoreName(territory?.name);
    if (!coreKey || coreKey.length < 6) continue;

    if (core.has(coreKey) && core.get(coreKey)?.id !== territory?.id) {
      collisions.add(coreKey);
    } else {
      core.set(coreKey, territory);
    }
  }

  for (const key of collisions) core.delete(key);

  return { exact, core };
}

export function matchTerritoryByName(buyerName, index) {
  const fullKey = normalizeBuyerName(buyerName);
  if (!fullKey) return null;

  const exact = index.exact.get(fullKey);
  if (exact) return exact;

  const coreKey = territoryCoreName(buyerName);
  if (!coreKey || coreKey.length < 6) return null;
  return index.core.get(coreKey) || null;
}

function isFreshDetectedAt(value, days) {
  const timestamp = Date.parse(String(value || ""));
  if (!Number.isFinite(timestamp)) return false;
  return timestamp >= Date.now() - days * 24 * 60 * 60 * 1000;
}

const TERRITORY_PUBLIC_COLLECTORS = Object.freeze({
  boamp: ({ query, limit }) => searchBoamp({ query, limit }),
  ted: ({ query, limit }) => searchTed({ query, limit })
});

function normalizeSourceList(sources = ["boamp", "ted"]) {
  const unique = [...new Set((sources || []).map((value) => String(value || "").trim()).filter(Boolean))];
  const supported = unique.filter((source) => TERRITORY_PUBLIC_COLLECTORS[source]);
  return supported.length ? supported : ["boamp", "ted"];
}

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
  sources = ["boamp", "ted"],
  limitPerQuery = 30,
  triggerMode = "scheduled"
} = {}) {
  const activeSources = normalizeSourceList(sources);
  const runId = await startCollectorRun({
    sourceId: null,
    triggerMode,
    queryPayload: {
      kind: "territory_signals",
      queries,
      sources: activeSources,
      limit_per_query: limitPerQuery
    }
  });

  try {
    const requests = activeSources.flatMap((source) =>
      queries.map((query) => ({ source, query }))
    );

    const settled = await Promise.allSettled(
      requests.map(({ source, query }) =>
        TERRITORY_PUBLIC_COLLECTORS[source]({ query, limit: limitPerQuery })
      )
    );

    const queryRuns = settled.map((entry, index) => ({
      source: requests[index].source,
      query: requests[index].query,
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
      (run.result?.items || []).map((item) => ({
        item: {
          ...item,
          source: item?.source || run.source
        },
        query: run.query,
        source: run.source
      }))
    );

    const withBuyerSiren = fetched.filter(({ item }) => item?.buyerSiren);
    const [territoryMap, territoryDirectory] = await Promise.all([
      getActiveTerritoriesBySirens(withBuyerSiren.map(({ item }) => item.buyerSiren)),
      listActiveTerritoryDirectory({ limit: 3000 })
    ]);
    const territoryNameIndex = buildTerritoryNameIndex(territoryDirectory);

    let matchedBySiren = 0;
    let matchedByName = 0;

    const candidates = fetched
      .map(({ item, query }) => {
        let territory = item?.buyerSiren ? territoryMap.get(item.buyerSiren) : null;
        let matchKind = "siren";

        if (!territory && item?.buyerName) {
          territory = matchTerritoryByName(item.buyerName, territoryNameIndex);
          if (territory) matchKind = "buyer_name";
        }

        if (!territory) return null;

        if (matchKind === "siren") matchedBySiren += 1;
        else matchedByName += 1;

        return normalizeTerritoryMarketSignal(item, territory, query, { matchKind });
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

    const fresh180d = uniqueCandidates.filter((item) =>
      isFreshDetectedAt(item.detectedAt, 180)
    ).length;
    const fresh365d = uniqueCandidates.filter((item) =>
      isFreshDetectedAt(item.detectedAt, 365)
    ).length;
    const samples = uniqueCandidates.slice(0, 10).map((item) => ({
      territory_name: item.payload?.territory_name || null,
      territory_type: item.payload?.territory_type || null,
      match_kind: item.payload?.territory_match_kind || null,
      signal_type: item.signalType,
      title: item.title,
      detected_at: item.detectedAt,
      importance: item.importance,
      evidence_url: item.evidenceUrl || null,
      buyer_name: item.payload?.buyer_name || null,
      buyer_siren: item.payload?.buyer_siren || null
    }));

    const sourceStats = Object.fromEntries(
      activeSources.map((source) => {
        const runs = queryRuns.filter((run) => run.source === source);
        const sourceFetched = runs.reduce(
          (sum, run) => sum + Number(run.result?.items?.length || 0),
          0
        );
        return [
          source,
          {
            requests: runs.length,
            successful_requests: runs.filter((run) => run.ok).length,
            failed_requests: runs.filter((run) => !run.ok).length,
            fetched: sourceFetched
          }
        ];
      })
    );

    const stats = {
      queries: queries.length,
      sources: activeSources,
      source_requests: queryRuns.length,
      successful_queries: queryRuns.filter((run) => run.ok).length,
      failed_queries: queryRuns.filter((run) => !run.ok).length,
      source_stats: sourceStats,
      fetched: fetched.length,
      with_buyer_siren: withBuyerSiren.length,
      territory_directory: territoryDirectory.length,
      matched_by_siren: matchedBySiren,
      matched_by_name: matchedByName,
      matched_territories: new Set(uniqueCandidates.map((item) => item.territoryId)).size,
      candidate_signals: uniqueCandidates.length,
      fresh_180d: fresh180d,
      fresh_365d: fresh365d,
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
      source: activeSources.length === 1 ? activeSources[0] : "multi_public",
      ...stats,
      samples,
      queryRuns: queryRuns.map(({ source, query, ok, error }) => ({
        source,
        query,
        ok,
        error
      }))
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await finishCollectorRun(runId, {
      status: "failed",
      stats: {
        queries: queries.length,
        sources: activeSources,
        limit_per_query: limitPerQuery
      },
      errorMessage: message
    });

    throw error;
  }
}
