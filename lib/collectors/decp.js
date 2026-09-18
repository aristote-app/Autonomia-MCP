import { fetchJson } from "./http.js";

const DECP_DATASET =
  "donnees-essentielles-de-la-commande-publique-decp-arrete-du-22-12-2022-marches";

const DECP_METADATA_URL =
  `https://www.data.gouv.fr/api/1/datasets/${DECP_DATASET}/`;

function dateValue(resource) {
  const value =
    resource.last_modified ||
    resource.latest ||
    resource.published ||
    resource.created_at ||
    resource.created ||
    null;
  const parsed = value ? Date.parse(value) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getDecpDatasetMetadata() {
  const payload = await fetchJson(DECP_METADATA_URL, { timeoutMs: 20000 });

  return {
    id: payload.id || DECP_DATASET,
    title: payload.title || "Données essentielles de la commande publique",
    lastModified: payload.last_modified || payload.last_update || null,
    resources: Array.isArray(payload.resources) ? payload.resources : []
  };
}

export async function getLatestDecpResource({ format = "json" } = {}) {
  const metadata = await getDecpDatasetMetadata();
  const wanted = String(format).toLowerCase();

  const candidates = metadata.resources
    .filter((resource) => !resource.archived)
    .filter((resource) => String(resource.format || "").toLowerCase() === wanted)
    .filter((resource) => Boolean(resource.url))
    .sort((a, b) => dateValue(b) - dateValue(a));

  const resource = candidates[0];

  if (!resource) {
    throw new Error(`No active DECP ${wanted} resource found`);
  }

  return {
    source: "decp",
    datasetTitle: metadata.title,
    datasetLastModified: metadata.lastModified,
    resource: {
      id: resource.id || null,
      title: resource.title || resource.description || null,
      format: resource.format || wanted,
      url: resource.url,
      lastModified:
        resource.last_modified ||
        resource.latest ||
        resource.published ||
        resource.created_at ||
        resource.created ||
        null,
      filesize: resource.filesize || resource.file_size || null
    }
  };
}
