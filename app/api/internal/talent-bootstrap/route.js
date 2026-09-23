import { runTalentIntelligenceBatch } from "../../../../lib/intelligence/talentIntelligence.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const oidc = await verifyGitHubDeploymentToken(token);
    if (!oidc.ok) {
      return {
        ok: false,
        response: Response.json(
          { error: "Unauthorized GitHub deployment identity", reason: oidc.reason },
          { status: 401 }
        )
      };
    }
    return { ok: true, claims: oidc.claims };
  } catch (error) {
    return {
      ok: false,
      response: Response.json(
        {
          error: "GitHub deployment identity verification failed",
          reason: error instanceof Error ? error.message : String(error)
        },
        { status: 401 }
      )
    };
  }
}

export async function POST(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const result = await runTalentIntelligenceBatch({
    targetCandidates: 350,
    batchSize: 6,
    countPerSource: 20,
    maxPages: 2,
    maxPersist: 180
  });

  return Response.json({
    talent_intelligence: true,
    target: result.target,
    skipped: result.skipped,
    reason: result.reason || null,
    families: (result.families || []).map((family) => ({
      id: family.id,
      cluster: family.cluster,
      query: family.query
    })),
    found: result.found || 0,
    selected: result.selected || 0,
    created: result.created || 0,
    updated: result.updated || 0,
    usable_before: result.before?.usable_discovered || 0,
    usable_after: result.after?.usable_discovered || 0,
    candidates_after: result.after?.candidates || 0,
    search_calls: result.search_calls || 0,
    cache_hits: result.cache_hits || 0
  });
}
