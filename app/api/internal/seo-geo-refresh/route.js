import { loadSeoGeoData } from "../../../../lib/seo-geo/refresh.js";
import { writeSeoGeoSnapshot } from "../../../../lib/seo-geo/snapshot.js";
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

  const data = await loadSeoGeoData({ prepareBriefs: true, maxBriefs: 5 });
  const snapshot = await writeSeoGeoSnapshot(data);
  const recommendations = snapshot.recommendations?.ok
    ? snapshot.recommendations?.data?.recommendations || []
    : [];
  const territoryRecommendations = recommendations
    .filter((item) => item?.family === "territory")
    .slice(0, 10)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      cluster: item.cluster,
      action: item.action,
      score: item.score,
      evidence: item.evidence
    }));
  const draftBriefs = (Array.isArray(snapshot.draftQueue) ? snapshot.draftQueue : [])
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      family: item.family,
      cluster: item.cluster,
      action: item.action,
      score: item.score,
      evidence: item.evidence,
      briefReady: Boolean(item.brief)
    }));
  const territoryDraftBriefs = (
    Array.isArray(snapshot.territoryDraftQueue)
      ? snapshot.territoryDraftQueue
      : []
  ).map((item) => ({
    slug: item.slug,
    title: item.title,
    family: item.family,
    cluster: item.cluster,
    action: item.action,
    score: item.score,
    evidence: item.evidence,
    briefReady: Boolean(item.brief)
  }));

  return Response.json({
    ok: Boolean(
      snapshot.manifest?.ok &&
      snapshot.google?.ok &&
      snapshot.searchDemand?.ok &&
      snapshot.recommendations?.ok
    ),
    generatedAt: snapshot.generatedAt,
    siteConnected: Boolean(snapshot.manifest?.ok),
    searchConsoleConnected: Boolean(snapshot.google?.ok && snapshot.google?.data?.configured),
    searchDemandConnected: Boolean(snapshot.searchDemand?.ok && snapshot.searchDemand?.data?.configured),
    searchQueries: Number(snapshot.signalSummary?.searchQueries) || 0,
    totalSignals: Number(snapshot.signalSummary?.total) || 0,
    territorySignals: Number(snapshot.signalSummary?.territory) || 0,
    recommendations: recommendations.length,
    preparedBriefs: draftBriefs.length,
    preparedTerritoryBriefs: territoryDraftBriefs.length,
    territoryRecommendations,
    draftBriefs,
    territoryDraftBriefs,
    topClusters: snapshot.signalSummary?.topClusters || [],
    sourceCounts: snapshot.sourceCounts || {},
    errors: {
      manifest: snapshot.manifest?.ok ? null : snapshot.manifest?.error,
      google: snapshot.google?.ok ? null : snapshot.google?.error,
      searchDemand: snapshot.searchDemand?.ok ? null : snapshot.searchDemand?.error,
      recommendations: snapshot.recommendations?.ok ? null : snapshot.recommendations?.error
    }
  }, {
    headers: { "cache-control": "no-store, no-cache, must-revalidate" }
  });
}
