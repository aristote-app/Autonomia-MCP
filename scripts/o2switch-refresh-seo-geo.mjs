import { loadSeoGeoData } from "../lib/seo-geo/refresh.js";
import { seoGeoSnapshotPath, writeSeoGeoSnapshot } from "../lib/seo-geo/snapshot.js";

const startedAt = new Date().toISOString();
console.log(`[seo-geo] refresh started ${startedAt}`);

try {
  const data = await loadSeoGeoData({ prepareBriefs: true, maxBriefs: 5 });
  const snapshot = await writeSeoGeoSnapshot(data);

  const recommendations = snapshot.recommendations?.ok
    ? snapshot.recommendations?.data?.recommendations || []
    : [];

  console.log(
    JSON.stringify(
      {
        ok: Boolean(snapshot.recommendations?.ok),
        generatedAt: snapshot.generatedAt,
        signals: snapshot.signalSummary?.total || 0,
        territorySignals: snapshot.signalSummary?.territory || 0,
        searchQueries: snapshot.signalSummary?.searchQueries || 0,
        recommendations: recommendations.length,
        preparedBriefs: snapshot.draftQueue?.length || 0,
        snapshot: seoGeoSnapshotPath(),
        errors: {
          manifest: snapshot.manifest?.ok ? null : snapshot.manifest?.error,
          searchConsole: snapshot.searchDemand?.ok ? null : snapshot.searchDemand?.error,
          recommendations: snapshot.recommendations?.ok ? null : snapshot.recommendations?.error
        }
      },
      null,
      2
    )
  );

  if (!snapshot.recommendations?.ok) {
    process.exitCode = 2;
  }
} catch (error) {
  console.error("[seo-geo] refresh failed", error);
  process.exitCode = 1;
}
