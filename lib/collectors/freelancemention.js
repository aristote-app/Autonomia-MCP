import { fetchJson } from "./http.js";
import { normalizeFreelanceMention } from "./normalize.js";

const API_BASE = "https://app.freelancemention.fr/api/v1";

function apiKey() {
  const value = process.env.FREELANCEMENTION_API_KEY;
  if (!value) throw new Error("FREELANCEMENTION_API_KEY is not configured");
  return value;
}

function headers() {
  return {
    "x-api-key": apiKey(),
    "content-type": "application/json"
  };
}

export async function listFreelanceMentionSearches() {
  return fetchJson(`${API_BASE}/searches`, { headers: headers() });
}

export async function createFreelanceMentionSearch(criteria) {
  if (!Array.isArray(criteria?.keywords) || !criteria.keywords.length) {
    throw new Error("FreelanceMention keywords are required");
  }

  return fetchJson(`${API_BASE}/searches`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(criteria)
  });
}

export async function getFreelanceMentionResults({
  searchId,
  limit = 50,
  offset = 0,
  since
}) {
  if (!searchId) throw new Error("FreelanceMention searchId is required");

  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const url = new URL(`${API_BASE}/searches/${encodeURIComponent(searchId)}/results`);
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("offset", String(safeOffset));
  if (since) url.searchParams.set("since", new Date(since).toISOString());

  const payload = await fetchJson(url.toString(), { headers: headers() });

  return {
    source: "freelancemention",
    searchId: payload.search_id || searchId,
    total: payload.total ?? payload.data?.length ?? 0,
    limit: payload.limit ?? safeLimit,
    offset: payload.offset ?? safeOffset,
    items: (payload.data || []).map(normalizeFreelanceMention)
  };
}
