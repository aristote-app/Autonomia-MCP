import { fetchBraveCached } from "./braveCache.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const INTERMEDIARY_DOMAINS = [
  "francetravail.fr",
  "collective.work",
  "free-work.com",
  "freelancerepublik.com",
  "lehibou.com",
  "indeed.com",
  "indeed.fr",
  "linkedin.com"
];

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function coreTitle(value) {
  return clean(value)
    .replace(/\s*[-–—]\s*Freelance\s*\(H\/F\).*$/i, "")
    .replace(/\s*\(H\/F\).*$/i, "")
    .replace(/\s*[-–—]\s*freelance.*$/i, "")
    .slice(0, 220);
}

function domainOf(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function excluded(url) {
  const domain = domainOf(url);
  return !domain || INTERMEDIARY_DOMAINS.some(
    (blocked) => domain === blocked || domain.endsWith("." + blocked)
  );
}

function tokenSet(value) {
  return new Set(
    clean(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9+#.]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4)
  );
}

function overlapScore(query, text) {
  const expected = tokenSet(query);
  const actual = tokenSet(text);
  if (!expected.size) return 0;
  const matched = [...expected].filter((token) => actual.has(token)).length;
  return Math.round((matched / expected.size) * 100);
}

export async function resolveHiddenEndClient({
  account,
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  maxSignals = 2,
  countPerQuery = 8
} = {}) {
  if (!apiKey) {
    return {
      available: false,
      reason: "BRAVE_SEARCH_API_KEY is not configured",
      candidates: [],
      searches: []
    };
  }

  if (!account?.intermediary_risk) {
    return {
      available: true,
      reason: "Account is not marked as intermediary risk",
      candidates: [],
      searches: []
    };
  }

  const signals = (account.timeline || [])
    .filter((event) => coreTitle(event?.title).length >= 12)
    .slice(0, Math.max(1, Number(maxSignals) || 2));

  const candidates = [];
  const searches = [];

  for (const signal of signals) {
    const title = coreTitle(signal.title);
    const query = '"' + title + '"';
    const url = new URL(BRAVE_WEB_SEARCH_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("country", "FR");
    url.searchParams.set("search_lang", "fr");
    url.searchParams.set("ui_lang", "fr-FR");
    url.searchParams.set("count", String(Math.min(Math.max(Number(countPerQuery) || 8, 1), 10)));

    try {
      const cached = await fetchBraveCached(url.toString(), { apiKey });
      const payload = cached.payload;
      const results = payload?.web?.results || [];
      let accepted = 0;

      for (const result of results) {
        const resultUrl = clean(result?.url);
        if (!resultUrl || excluded(resultUrl)) continue;

        const evidenceText = [result?.title, result?.description].filter(Boolean).join(" ");
        const score = overlapScore(title, evidenceText);
        if (score < 45) continue;

        candidates.push({
          source_signal_title: signal.title,
          source_signal_url: signal.source_url || null,
          candidate_url: resultUrl,
          candidate_domain: domainOf(resultUrl),
          title: clean(result?.title),
          snippet: clean(result?.description),
          similarity_score: score,
          evidence_kind: "possible_end_client_trace"
        });
        accepted += 1;
      }

      searches.push({
        query,
        source_signal_title: signal.title,
        raw_results: results.length,
        candidates: accepted,
        ok: true,
        cache_hit: cached.cache_hit
      });
    } catch (error) {
      searches.push({
        query,
        source_signal_title: signal.title,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const unique = new Map();
  for (const candidate of candidates) {
    const current = unique.get(candidate.candidate_url);
    if (!current || candidate.similarity_score > current.similarity_score) {
      unique.set(candidate.candidate_url, candidate);
    }
  }

  return {
    available: true,
    provider: "brave_search_api",
    candidates: [...unique.values()]
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 12),
    searches,
    note:
      "Ces résultats sont seulement des traces possibles du même besoin. Ils ne prouvent pas l'identité du client final et doivent être vérifiés avant toute prospection."
  };
}
