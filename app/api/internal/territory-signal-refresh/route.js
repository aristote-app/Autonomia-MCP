import { runAutomatedTerritorySignalRefresh } from "../../../../lib/market/territorySignals.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const oidc = await verifyGitHubDeploymentToken(token);
    if (oidc.ok) return { ok: true };
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized", reason: oidc.reason }, { status: 401 })
    };
  } catch (error) {
    return {
      ok: false,
      response: Response.json(
        { error: "OIDC verification failed", reason: error?.message || String(error) },
        { status: 401 }
      )
    };
  }
}

export async function GET(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 40, 10), 75);

  try {
    const result = await runAutomatedTerritorySignalRefresh({
      limitPerQuery: limit,
      triggerMode: "github_oidc"
    });

    return Response.json({
      ok: Boolean(result?.available),
      source: result?.source || "boamp",
      queries: result?.queries || 0,
      successfulQueries: result?.successful_queries || 0,
      failedQueries: result?.failed_queries || 0,
      fetched: result?.fetched || 0,
      withBuyerSiren: result?.with_buyer_siren || 0,
      matchedTerritories: result?.matched_territories || 0,
      candidateSignals: result?.candidate_signals || 0,
      persisted: result?.persisted || 0,
      duplicates: result?.duplicates || 0
    }, {
      headers: { "cache-control": "no-store, no-cache, must-revalidate" }
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: error?.message || String(error)
    }, {
      status: 500,
      headers: { "cache-control": "no-store, no-cache, must-revalidate" }
    });
  }
}
