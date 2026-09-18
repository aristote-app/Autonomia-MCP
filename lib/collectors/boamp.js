import { fetchJson } from "./http.js";
import { normalizeBoamp } from "./normalize.js";

const BOAMP_RECORDS_URL =
  "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";

function escapeOdsql(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

export async function searchBoamp({ query, limit = 25, offset = 0 }) {
  if (!query?.trim()) throw new Error("BOAMP query is required");

  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const where = `search(*, "${escapeOdsql(query.trim())}")`;

  const url = new URL(BOAMP_RECORDS_URL);
  url.searchParams.set("where", where);
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("offset", String(safeOffset));
  url.searchParams.set("order_by", "dateparution desc");

  const payload = await fetchJson(url.toString());

  return {
    source: "boamp",
    total: payload.total_count ?? payload.results?.length ?? 0,
    items: (payload.results || []).map(normalizeBoamp)
  };
}
