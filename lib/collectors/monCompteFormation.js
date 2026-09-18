import { fetchJson } from "./http.js";

const DATASETS = {
  offer: "moncompteformation-loffre-de-formation",
  engaged: "moncompteformation-les-formations-engagees",
  flows: "moncompteformation-entrees-et-sorties-de-formation"
};

function resourceDate(resource) {
  const raw =
    resource.last_modified ||
    resource.latest ||
    resource.published ||
    resource.created_at ||
    resource.created ||
    null;
  const parsed = raw ? Date.parse(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

async function resolveDataset(slug, format = "json") {
  const url = `https://www.data.gouv.fr/api/1/datasets/${slug}/`;
  const payload = await fetchJson(url, { timeoutMs: 20000 });
  const wanted = format.toLowerCase();

  const resources = (payload.resources || [])
    .filter((resource) => !resource.archived)
    .filter((resource) => String(resource.format || "").toLowerCase() === wanted)
    .filter((resource) => Boolean(resource.url))
    .sort((a, b) => resourceDate(b) - resourceDate(a));

  return {
    slug,
    title: payload.title || slug,
    lastModified: payload.last_modified || payload.last_update || null,
    resource: resources[0]
      ? {
          id: resources[0].id || null,
          url: resources[0].url,
          format: resources[0].format || wanted,
          title: resources[0].title || null,
          filesize: resources[0].filesize || resources[0].file_size || null,
          lastModified:
            resources[0].last_modified ||
            resources[0].latest ||
            resources[0].published ||
            resources[0].created_at ||
            resources[0].created ||
            null
        }
      : null
  };
}

export async function getMcfTrainingSources({ format = "json" } = {}) {
  const entries = await Promise.all(
    Object.entries(DATASETS).map(async ([kind, slug]) => [
      kind,
      await resolveDataset(slug, format)
    ])
  );

  return {
    source: "mon_compte_formation_open_data",
    checkedAt: new Date().toISOString(),
    datasets: Object.fromEntries(entries)
  };
}
