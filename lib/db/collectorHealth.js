import { getAutonomiaServerClient } from "./supabase.js";

/**
 * Safe, compact projection of recent collector runs for the Growth cockpit.
 * The raw query payload, errors and credentials are intentionally not sent to the client.
 */
export function summarizeCollectorRuns(rows = [], { limit = 5 } = {}) {
  const names = {
    job_signals: "Radar recrutements",
    extended_demand: "Radar formation & projets",
    freework: "Missions freelance",
    opportunity_hunter: "Qualification des entreprises"
  };
  const seen = new Set();
  const result = [];
  for (const row of rows) {
    const key = String(row?.query_payload?.kind || row?.source_id || "other");
    if (seen.has(key)) continue;
    seen.add(key);
    const status = ["running", "success", "partial", "failed"].includes(row?.status)
      ? row.status : "unknown";
    const extracted = row?.stats?.persisted ?? row?.stats?.persisted_rows ?? null;
    result.push({
      id: String(row?.id || key),
      label: names[key] || "Autre collecte",
      status,
      startedAt: row?.started_at || null,
      completedAt: row?.completed_at || null,
      count: Number.isFinite(Number(extracted)) && extracted !== null ? Number(extracted) : null
    });
    if (result.length >= limit) break;
  }
  return result;
}

export async function loadCollectorHealth() {
  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("collector_runs")
    .select("id,source_id,query_payload,status,started_at,completed_at,stats")
    .order("started_at", { ascending: false })
    .limit(80);

  if (error) throw error;
  return summarizeCollectorRuns(data || []);
}
