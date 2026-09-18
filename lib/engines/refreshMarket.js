import { searchAiPublicMarket } from "./aiPublicMarket.js";
import { searchOpcoAiTrainingMarket } from "../training/opco.js";
import { searchFreeWork } from "../collectors/freework.js";
import { getLeHibouMarketSignal } from "../collectors/lehibou.js";
import { searchUpworkJobs } from "../collectors/upwork.js";
import { getFreelanceMentionResults } from "../collectors/freelancemention.js";

function key(item) {
  if (item?.source && item?.sourceId) return `${item.source}:${item.sourceId}`;
  if (item?.sourceUrl) return `${item.source || "unknown"}:${item.sourceUrl}`;
  return null;
}

function uniqueItems(items) {
  const seen = new Map();
  for (const item of items || []) {
    const k = key(item);
    if (!k) continue;
    if (!seen.has(k)) seen.set(k, item);
  }
  return [...seen.values()];
}

function sourceStatus(id, status, details = {}) {
  return { id, status, ...details };
}

export async function refreshAutonomiaMarket({
  query = "intelligence artificielle",
  scopes = ["public", "training", "freelance"],
  publicTopic = "all",
  limitPerQuery = 5,
  freeWorkCategory = "ia",
  freeWorkLimit = 50,
  freelanceMentionSearchId,
  freelanceMentionSince,
  includeUpwork = true,
  upworkFirst = 20
} = {}) {
  const startedAt = new Date().toISOString();
  const coverage = [];
  const opportunities = [];
  const signals = [];
  const errors = [];

  if (scopes.includes("public")) {
    try {
      const result = await searchAiPublicMarket({
        topic: publicTopic,
        query,
        sources: ["boamp", "ted"],
        limitPerQuery
      });
      opportunities.push(...(result.items || []));
      coverage.push(
        sourceStatus("boamp", "live", { scope: "public" }),
        sourceStatus("ted", "live", { scope: "public" })
      );
      if (result.errors?.length) errors.push(...result.errors.map((e) => ({ scope: "public", ...e })));
    } catch (error) {
      errors.push({
        scope: "public",
        error: error instanceof Error ? error.message : String(error)
      });
      coverage.push(
        sourceStatus("boamp", "error", { scope: "public" }),
        sourceStatus("ted", "error", { scope: "public" })
      );
    }
  }

  if (scopes.includes("training")) {
    try {
      const result = await searchOpcoAiTrainingMarket({
        query,
        sources: ["boamp", "ted"],
        limitPerQuery: Math.min(Math.max(limitPerQuery, 1), 20)
      });
      opportunities.push(...(result.items || []));
      coverage.push(
        sourceStatus("opco", "live_via_boamp_ted", {
          scope: "training",
          trackedBuyers: result.selectedOpcos?.length || 11,
          matches: result.opcoMatches || 0
        })
      );
      if (result.errors?.length) errors.push(...result.errors.map((e) => ({ scope: "training", ...e })));
    } catch (error) {
      coverage.push(sourceStatus("opco", "error", { scope: "training" }));
      errors.push({
        scope: "training",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  if (scopes.includes("freelance")) {
    try {
      const result = await searchFreeWork({
        category: freeWorkCategory,
        page: 1,
        limit: freeWorkLimit
      });
      opportunities.push(...(result.items || []));
      coverage.push(sourceStatus("freework", "live", {
        scope: "freelance",
        category: freeWorkCategory,
        sampleSize: result.items?.length || 0,
        note: "Category-page collection; not a source-native full-text query."
      }));
    } catch (error) {
      coverage.push(sourceStatus("freework", "error", { scope: "freelance" }));
      errors.push({
        scope: "freelance",
        source: "freework",
        error: error instanceof Error ? error.message : String(error)
      });
    }

    try {
      const signal = await getLeHibouMarketSignal();
      signals.push(signal);
      coverage.push(sourceStatus("lehibou", "market_signal_live", {
        scope: "freelance",
        note: "Publisher market figures, not mission inventory."
      }));
    } catch (error) {
      coverage.push(sourceStatus("lehibou", "error", { scope: "freelance" }));
      errors.push({
        scope: "freelance",
        source: "lehibou",
        error: error instanceof Error ? error.message : String(error)
      });
    }

    if (process.env.FREELANCEMENTION_API_KEY && freelanceMentionSearchId) {
      try {
        const result = await getFreelanceMentionResults({
          searchId: freelanceMentionSearchId,
          limit: Math.min(Math.max(freeWorkLimit, 1), 100),
          offset: 0,
          since: freelanceMentionSince
        });
        opportunities.push(...(result.items || []));
        coverage.push(sourceStatus("freelancemention", "live", {
          scope: "freelance",
          searchId: freelanceMentionSearchId,
          matches: result.items?.length || 0
        }));
      } catch (error) {
        coverage.push(sourceStatus("freelancemention", "error", { scope: "freelance" }));
        errors.push({
          scope: "freelance",
          source: "freelancemention",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } else {
      coverage.push(sourceStatus(
        "freelancemention",
        process.env.FREELANCEMENTION_API_KEY ? "search_id_required" : "credentials_required",
        { scope: "freelance" }
      ));
    }

    if (includeUpwork && process.env.UPWORK_ACCESS_TOKEN) {
      try {
        const result = await searchUpworkJobs({
          query,
          first: Math.min(Math.max(upworkFirst, 1), 50),
          after: "0"
        });
        opportunities.push(...(result.items || []));
        coverage.push(sourceStatus("upwork", "live", {
          scope: "freelance",
          matches: result.items?.length || 0
        }));
      } catch (error) {
        coverage.push(sourceStatus("upwork", "error", { scope: "freelance" }));
        errors.push({
          scope: "freelance",
          source: "upwork",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } else {
      coverage.push(sourceStatus(
        "upwork",
        includeUpwork ? "credentials_required" : "skipped",
        { scope: "freelance" }
      ));
    }

    for (const id of ["linkedin", "datasales", "indeed", "malt"]) {
      coverage.push(sourceStatus(id, "authorized_import_only", { scope: "freelance" }));
    }
  }

  const deduped = uniqueItems(opportunities);

  return {
    query,
    scopes,
    startedAt,
    refreshedAt: new Date().toISOString(),
    rawOpportunityRows: opportunities.length,
    uniqueOpportunityRows: deduped.length,
    opportunities: deduped,
    signals,
    coverage,
    errors,
    evidencePolicy:
      "Coverage reports exactly which connectors ran. Authorized-import-only sources were not scraped. Missing credentials and source errors are surfaced explicitly."
  };
}
