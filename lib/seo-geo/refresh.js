import { hasAutonomiaDatabase } from "../db/supabase.js";
import { searchRankedOpportunities } from "../db/intelligence.js";
import { searchJobSignals } from "../db/jobSignals.js";
import { listInboundLeads } from "../db/inboundLeads.js";
import { listRecentTerritoryProgramSignals } from "../db/signals.js";
import {
  listRecentTerritorySignals,
  listActiveTerritoryDirectory
} from "../db/territories.js";
import { buildSeoGeoSignals, summarizeSeoGeoSignals } from "./demandSignals.js";

export const DEFAULT_PUBLIC_SITE = "https://build-autonomia.com";

export function siteConfig() {
  return {
    base: String(process.env.AUTONOMIA_PUBLIC_SITE_URL || DEFAULT_PUBLIC_SITE).replace(/\/$/, ""),
    token: process.env.AUTONOMIA_ORGANIC_TOKEN || ""
  };
}

export async function organicFetch(path, options = {}) {
  const { base, token } = siteConfig();
  if (!token) return { ok: false, error: "organic_token_missing" };

  try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      cache: "no-store",
      headers: {
        ...(options.headers || {}),
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      }
    });

    const body = await response.json().catch(() => null);
    return response.ok
      ? { ok: true, data: body }
      : {
          ok: false,
          status: response.status,
          error: body?.error || "request_failed",
          data: body
        };
  } catch (error) {
    return { ok: false, error: error?.message || "network_error" };
  }
}

function settledValue(entry, fallback, source, errors) {
  if (entry?.status === "fulfilled") return entry.value;
  const message =
    entry?.reason instanceof Error
      ? entry.reason.message
      : String(entry?.reason || "unknown_error");
  errors[source] = message;
  console.error(`SEO/GEO market source error [${source}]`, entry?.reason);
  return fallback;
}

async function loadMarketSignals() {
  if (!hasAutonomiaDatabase()) {
    return {
      opportunities: [],
      jobs: [],
      inboundLeads: [],
      territorySignals: [],
      territoryPrograms: [],
      territoryDirectory: [],
      loadErrors: { database: "not_configured" }
    };
  }

  const workspaceId = process.env.AUTONOMIA_DEFAULT_WORKSPACE_ID || null;
  const settled = await Promise.allSettled([
    searchRankedOpportunities({
      actionability: "active",
      aiRelatedOnly: true,
      minFitScore: 0,
      limit: 250
    }),
    searchJobSignals({
      sources: [
        "france_travail_jobs",
        "linkedin",
        "indeed",
        "freework",
        "freelancerepublik",
        "lehibou",
        "emploi_territorial"
      ],
      limit: 350
    }),
    workspaceId ? listInboundLeads({ workspaceId, limit: 250 }) : Promise.resolve([]),
    listRecentTerritorySignals({ days: 365, limit: 300 }),
    listRecentTerritoryProgramSignals({ days: 365, limit: 300 }),
    listActiveTerritoryDirectory({ limit: 2000 })
  ]);

  const errors = {};
  const opportunities = settledValue(settled[0], { items: [] }, "opportunities", errors);
  const jobs = settledValue(settled[1], { items: [] }, "jobs", errors);
  const inboundLeads = settledValue(settled[2], [], "inboundLeads", errors);
  const territorySignals = settledValue(settled[3], [], "territorySignals", errors);
  const territoryPrograms = settledValue(settled[4], [], "territoryPrograms", errors);
  const territoryDirectory = settledValue(settled[5], [], "territoryDirectory", errors);

  return {
    opportunities: opportunities?.items || [],
    jobs: jobs?.items || [],
    inboundLeads: inboundLeads || [],
    territorySignals: territorySignals || [],
    territoryPrograms: territoryPrograms || [],
    territoryDirectory: territoryDirectory || [],
    loadErrors: errors
  };
}

function searchSignalsFromDemand(searchDemand) {
  if (!searchDemand?.ok) return [];
  return (searchDemand.data?.rows || []).map((row) => ({
    query: row.query,
    search_impressions: Number(row.impressions) || 0,
    search_clicks: Number(row.clicks) || 0,
    search_position: Number(row.position) || 0,
    source: "google_search_console"
  }));
}

async function prepareDraftQueue(
  recommendations = [],
  maxBriefs = 5,
  { family = null } = {}
) {
  const selected = recommendations
    .filter((item) => Number(item?.evidence?.matched_signals || 0) > 0)
    .filter((item) => !family || item?.family === family)
    .slice(0, Math.max(0, Math.min(Number(maxBriefs) || 5, 10)));

  const queue = [];
  for (const item of selected) {
    const brief = await organicFetch("/api/organic/brief", {
      method: "POST",
      body: JSON.stringify({
        family: item.family,
        slug: item.slug
      })
    });

    queue.push({
      slug: item.slug,
      family: item.family,
      title: item.title,
      cluster: item.cluster,
      score: item.score,
      action: item.action,
      evidence: item.evidence,
      brief: brief.ok ? brief.data : null,
      brief_error: brief.ok ? null : brief.error || "brief_failed"
    });
  }

  return queue;
}

export async function loadSeoGeoData({ prepareBriefs = false, maxBriefs = 5 } = {}) {
  const market = await loadMarketSignals();
  const marketSignals = buildSeoGeoSignals(market);
  const signalSummary = summarizeSeoGeoSignals(marketSignals);

  const [manifest, backlog, google, searchDemand] = await Promise.all([
    organicFetch("/api/organic/manifest"),
    organicFetch("/api/organic/backlog"),
    organicFetch("/api/organic/google/sitemap"),
    organicFetch("/api/organic/google/search-demand?days=28&limit=500")
  ]);

  const searchSignals = searchSignalsFromDemand(searchDemand);
  const allSignals = [...marketSignals, ...searchSignals];

  const recommendations = await organicFetch("/api/organic/editorial-opportunities", {
    method: "POST",
    body: JSON.stringify({ signals: allSignals, max_results: 25 })
  });

  const recommendationItems = recommendations.ok
    ? recommendations.data?.recommendations || []
    : [];

  const draftQueue = prepareBriefs
    ? await prepareDraftQueue(recommendationItems, maxBriefs)
    : [];
  const territoryDraftQueue = prepareBriefs
    ? await prepareDraftQueue(recommendationItems, 5, { family: "territory" })
    : [];

  return {
    generatedAt: new Date().toISOString(),
    market,
    signals: allSignals,
    signalSummary: {
      ...signalSummary,
      searchQueries: searchSignals.length,
      total: signalSummary.total + searchSignals.length
    },
    manifest,
    backlog,
    recommendations,
    google,
    searchDemand,
    draftQueue,
    territoryDraftQueue
  };
}

export function compactSeoGeoSnapshot(data) {
  return {
    generatedAt: data?.generatedAt || new Date().toISOString(),
    signalSummary: data?.signalSummary || {},
    manifest: data?.manifest || { ok: false, error: "missing" },
    backlog: data?.backlog || { ok: false, error: "missing" },
    recommendations: data?.recommendations || { ok: false, error: "missing" },
    google: data?.google || { ok: false, error: "missing" },
    searchDemand: data?.searchDemand || { ok: false, error: "missing" },
    draftQueue: Array.isArray(data?.draftQueue) ? data.draftQueue : [],
    territoryDraftQueue: Array.isArray(data?.territoryDraftQueue)
      ? data.territoryDraftQueue
      : [],
    marketLoadErrors: data?.market?.loadErrors || {},
    sourceCounts: {
      opportunities: data?.market?.opportunities?.length || 0,
      jobs: data?.market?.jobs?.length || 0,
      inboundLeads: data?.market?.inboundLeads?.length || 0,
      territorySignals: data?.market?.territorySignals?.length || 0,
      territoryPrograms: data?.market?.territoryPrograms?.length || 0,
      territoryDirectory: data?.market?.territoryDirectory?.length || 0,
      signals: data?.signals?.length || 0
    }
  };
}
