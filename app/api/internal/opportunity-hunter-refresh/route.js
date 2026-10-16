import { runAutomatedJobSignalRefresh } from "../../../../lib/market/automatedRefresh.js";
import { runOpportunityHunter } from "../../../../lib/market/opportunityHunter.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  try {
    const result = await verifyGitHubDeploymentToken(token);
    return Boolean(result?.ok);
  } catch {
    return false;
  }
}
// Never echo raw provider objects, private profiles, access tokens, query URLs
// or Supabase internals in this diagnostic response.
export function safeHunterError(error) {
  const code = String(error?.code || "").trim();
  const safeCode = /^[A-Za-z0-9_]{1,20}$/.test(code) ? code : "UNEXPECTED_ERROR";
  return {
    code: safeCode,
    category: error?.name === "AbortError" ? "timeout" :
      code ? "provider_or_database" : "unexpected"
  };
}

export async function GET(request) {
  if (!(await authorize(request))) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const startedAt = new Date().toISOString();
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "full" ? "full" : "recent";
  const base = { startedAt, mode };

  let jobSignals;
  try {
    jobSignals = await runAutomatedJobSignalRefresh({
      triggerMode: mode === "full" ? "on_demand_backfill" : "on_demand",
      freshness: mode === "full" ? "pm" : "pw",
      maxPages: mode === "full" ? 2 : 1
    });
  } catch (error) {
    return Response.json({
      ok: false, ...base, completedAt: new Date().toISOString(),
      failedStage: "job_discovery_or_persistence",
      diagnostic: safeHunterError(error)
    }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  let opportunityHunter;
  try {
    opportunityHunter = await runOpportunityHunter({
      maxAccounts: mode === "full" ? 6 : 3,
      maxPhoneFallbacks: mode === "full" ? 2 : 1
    });
  } catch (error) {
    return Response.json({
      ok: false, ...base, completedAt: new Date().toISOString(),
      failedStage: "buyer_qualification",
      diagnostic: safeHunterError(error),
      jobSignals: {
        available: jobSignals.available,
        provider: jobSignals.provider,
        discoveredRows: jobSignals.discoveredRows,
        persistedRows: jobSignals.persistedRows
      }
    }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  return Response.json({
    ok: true, ...base, completedAt: new Date().toISOString(),
    jobSignals, opportunityHunter
  }, { headers: { "Cache-Control": "no-store" } });
}
