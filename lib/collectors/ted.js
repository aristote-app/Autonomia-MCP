import { fetchJson } from "./http.js";
import { normalizeTed } from "./normalize.js";

const TED_SEARCH_URL = "https://api.ted.europa.eu/v3/notices/search";

function toTedFullTextQuery(value) {
  const terms = String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replace(/[()"']/g, ""))
    .filter(Boolean);

  if (!terms.length) throw new Error("TED query is required");
  return `FT ~ (${terms.join(" ")})`;
}

export async function searchTedExpert({
  expertQuery,
  limit = 25,
  page = 1,
  scope = "ACTIVE"
}) {
  if (!expertQuery?.trim()) throw new Error("TED expert query is required");

  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);

  const body = {
    query: expertQuery.trim(),
    fields: [
      "publication-number",
      "publication-date",
      "notice-title",
      "buyer-name",
      "deadline-receipt-tender-date-lot",
      "procedure-type",
      "contract-nature",
      "classification-cpv"
    ],
    page: safePage,
    limit: safeLimit,
    scope,
    checkQuerySyntax: true,
    paginationMode: "PAGE_NUMBER"
  };

  const payload = await fetchJson(TED_SEARCH_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  const notices = payload.notices || payload.results || [];

  return {
    source: "ted",
    total: payload.totalNoticeCount ?? payload.total_count ?? notices.length,
    items: notices.map(normalizeTed),
    meta: {
      responseKeys: Object.keys(payload),
      query: expertQuery.trim(),
      scope
    }
  };
}

export async function searchTed({ query, limit = 25, page = 1, scope = "ACTIVE" }) {
  return searchTedExpert({
    expertQuery: toTedFullTextQuery(query),
    limit,
    page,
    scope
  });
}
