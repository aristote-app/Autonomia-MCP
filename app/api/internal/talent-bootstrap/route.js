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

  const target = 350;
  const rounds = [];
  let totalFound = 0;
  let totalSelected = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSearchCalls = 0;
  let totalCacheHits = 0;
  let usableBefore = null;
  let usableAfter = null;

  for (let round = 0; round < 3; round += 1) {
    const result = await runTalentIntelligenceBatch({
      targetCandidates: target,
      batchSize: 6,
      countPerSource: 20,
      maxPages: 2,
      maxPersist: 180,
      rotationOffset: round * 6
    });

    if (usableBefore == null) usableBefore = result.before?.usable_discovered || 0;
    usableAfter = result.after?.usable_discovered || result.before?.usable_discovered || 0;

    totalFound += result.found || 0;
    totalSelected += result.selected || 0;
    totalCreated += result.created || 0;
    totalUpdated += result.updated || 0;
    totalSearchCalls += result.search_calls || 0;
    totalCacheHits += result.cache_hits || 0;

    rounds.push({
      round: round + 1,
      skipped: Boolean(result.skipped),
      reason: result.reason || null,
      families: (result.families || []).map((family) => ({
        id: family.id,
        cluster: family.cluster
      })),
      created: result.created || 0,
      updated: result.updated || 0,
      usable_after: usableAfter
    });

    if (result.skipped || usableAfter >= target) break;
  }

  return Response.json({
    talent_intelligence: true,
    target,
    reached: Number(usableAfter || 0) >= target,
    rounds,
    found: totalFound,
    selected: totalSelected,
    created: totalCreated,
    updated: totalUpdated,
    usable_before: usableBefore || 0,
    usable_after: usableAfter || 0,
    search_calls: totalSearchCalls,
    cache_hits: totalCacheHits
  });
}
