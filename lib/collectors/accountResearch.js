import { fetchBraveCached } from "./braveCache.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

function clean(value) {
  return String(value || "").replace(/["'<>]/g, " ").replace(/\s+/g, " ").trim();
}

function domainOf(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function researchKind(text = "") {
  const value = String(text).toLowerCase();
  if (/copilot|formation|academy|acculturation|comp[eé]tence|upskill/.test(value)) {
    return "adoption_training";
  }
  if (/agent|llm|g[eé]n[eé]rative|rag|intelligence artificielle|\bia\b/.test(value)) {
    return "ai_project";
  }
  if (/recrut|hiring|poste|emploi|talent/.test(value)) {
    return "hiring";
  }
  if (/partenariat|partnership|lev[eé]e|invest|acquisition|croissance/.test(value)) {
    return "strategic";
  }
  if (/transformation|num[eé]rique|digital|automatisation|automation/.test(value)) {
    return "transformation";
  }
  return "context";
}

export async function researchAccountPublicContext({
  company,
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  countPerQuery = 8
} = {}) {
  const safeCompany = clean(company);
  if (!safeCompany) {
    return { available: true, provider: "brave_search_api", evidence: [], searches: [] };
  }
  if (!apiKey) {
    return {
      available: false,
      provider: "brave_search_api",
      reason: "BRAVE_SEARCH_API_KEY is not configured",
      evidence: [],
      searches: []
    };
  }

  const queries = [
    `"${safeCompany}" ("intelligence artificielle" OR IA OR Copilot OR LLM OR automatisation) France`,
    `"${safeCompany}" (transformation OR innovation OR recrutement OR partenariat) France`
  ];

  const evidence = [];
  const searches = [];

  for (const query of queries) {
    const url = new URL(BRAVE_WEB_SEARCH_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("country", "FR");
    url.searchParams.set("search_lang", "fr");
    url.searchParams.set("ui_lang", "fr-FR");
    url.searchParams.set("count", String(Math.min(Math.max(Number(countPerQuery) || 8, 1), 10)));
    url.searchParams.set("freshness", "py");

    try {
      const cached = await fetchBraveCached(url.toString(), {
        apiKey,
        ttlMs: 6 * 60 * 60 * 1000
      });
      const payload = cached.payload;
      const results = payload?.web?.results || [];
      searches.push({
        query,
        ok: true,
        raw_results: results.length,
        cache_hit: cached.cache_hit
      });

      for (const result of results) {
        const sourceUrl = String(result?.url || "").trim();
        if (!/^https?:\/\//i.test(sourceUrl)) continue;
        const title = String(result?.title || "").trim();
        const snippet = String(result?.description || "").trim();
        const combined = [title, snippet].filter(Boolean).join(" ");

        evidence.push({
          title: title || sourceUrl,
          url: sourceUrl,
          domain: domainOf(sourceUrl),
          snippet: snippet || null,
          kind: researchKind(combined),
          age: result?.age || null,
          evidence_kind: "public_web_result"
        });
      }
    } catch (error) {
      searches.push({
        query,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const deduped = new Map();
  for (const item of evidence) {
    if (!deduped.has(item.url)) deduped.set(item.url, item);
  }

  return {
    available: true,
    provider: "brave_search_api",
    note:
      "Résultats publics à vérifier. Ils complètent la fiche compte mais ne modifient pas le score commercial sans validation.",
    evidence: [...deduped.values()].slice(0, 14),
    searches
  };
}
