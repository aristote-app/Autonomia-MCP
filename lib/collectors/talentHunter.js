import { fetchBraveCached } from "./braveCache.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const SOURCES = Object.freeze([
  {
    id: "malt",
    label: "Malt",
    query: (q) => 'site:malt.fr/profile "' + q + '" freelance',
    accepts: (url) => {
      try {
        const parsed = new URL(url);
        return /(^|\.)malt\.fr$/i.test(parsed.hostname) && parsed.pathname.startsWith("/profile/");
      } catch {
        return false;
      }
    }
  },
  {
    id: "freelance_com",
    label: "Freelance.com",
    query: (q) => 'site:plateforme.freelance.com/freelance "' + q + '"',
    accepts: (url) => {
      try {
        const parsed = new URL(url);
        return /^plateforme\.freelance\.com$/i.test(parsed.hostname) && parsed.pathname.startsWith("/freelance/");
      } catch {
        return false;
      }
    }
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    query: (q) => 'site:linkedin.com/in "' + q + '" (freelance OR indépendant OR consultant) France',
    accepts: (url) => {
      try {
        const parsed = new URL(url);
        return /(^|\.)linkedin\.com$/i.test(parsed.hostname) && /^\/in\//i.test(parsed.pathname);
      } catch {
        return false;
      }
    }
  },
  {
    id: "collective_work",
    label: "Collective.work",
    query: (q) => 'site:collective.work/profile "' + q + '" freelance',
    accepts: (url) => {
      try {
        const parsed = new URL(url);
        return /(^|\.)collective\.work$/i.test(parsed.hostname) && /^\/profile\//i.test(parsed.pathname);
      } catch {
        return false;
      }
    }
  }
]);

const SKILLS = Object.freeze([
  ["LangGraph", /\blanggraph\b/i],
  ["LangChain", /\blangchain\b/i],
  ["RAG", /\brag\b|retrieval[- ]augmented/i],
  ["LLM", /\bllms?\b/i],
  ["MCP", /\bmcp\b|model context protocol/i],
  ["Python", /\bpython\b/i],
  ["FastAPI", /\bfastapi\b/i],
  ["OpenAI", /\bopenai\b|chatgpt/i],
  ["Claude", /\bclaude\b/i],
  ["Gemini", /\bgemini\b/i],
  ["Microsoft Copilot", /\bcopilot\b/i],
  ["Copilot Studio", /copilot studio/i],
  ["n8n", /\bn8n\b/i],
  ["Make", /\bmake\.com\b|\bmake\b/i],
  ["Power Automate", /power automate/i],
  ["Agentic AI", /agentic|agentique|agents? ia|ai agents?/i],
  ["IA générative", /ia g[eé]n[eé]rative|genai|generative ai/i],
  ["Formation IA", /formation ia|formateur ia|training ai/i],
  ["Adoption IA", /adoption ia|change management|conduite du changement/i],
  ["Gouvernance IA", /gouvernance ia|ai governance|ai act|rgpd/i],
  ["Data Science", /data scien/i],
  ["Machine Learning", /machine learning|\bmlops?\b/i],
  ["Azure", /\bazure\b/i],
  ["AWS", /\baws\b|amazon web services/i],
  ["Docker", /\bdocker\b/i],
  ["Kubernetes", /\bkubernetes\b|\bk8s\b/i]
]);

function clean(value, max = 5000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalized(value) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokens(value) {
  return new Set(
    normalized(value)
      .replace(/[^a-z0-9+#.]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 3)
  );
}

function overlapScore(query, text) {
  const expected = tokens(query);
  const actual = tokens(text);
  if (!expected.size) return 0;
  const matched = [...expected].filter((token) => actual.has(token)).length;
  return Math.round((matched / expected.size) * 100);
}

function sourceFromUrl(url) {
  return SOURCES.find((source) => source.accepts(url)) || null;
}

function titleName(title, sourceId) {
  const value = clean(title, 300)
    .replace(/\s*\|\s*(Malt|LinkedIn|Collective\.work).*$/i, "")
    .trim();

  if (!value) return null;

  if (sourceId === "linkedin") {
    return clean(value.split(/\s[-–—]\s/)[0], 160) || null;
  }

  if (value.includes(",")) {
    const comma = value.split(",")[0]?.trim();
    if (comma && comma.length >= 2 && comma.length <= 120) return comma;
  }

  const dash = value.split(/\s[-–—]\s/)[0]?.trim();
  return dash && dash.length <= 120 ? dash : null;
}

function headlineFromTitle(title, name) {
  const value = clean(title, 400)
    .replace(/\s*\|\s*(Malt|LinkedIn).*$/i, "")
    .trim();
  if (!value || !name) return value || null;

  const lower = value.toLowerCase();
  const lowerName = name.toLowerCase();
  let rest = lower.startsWith(lowerName) ? value.slice(name.length) : value;
  rest = rest.replace(/^\s*[,–—-]?\s*/, "");
  return clean(rest, 260) || null;
}

function extractSkills(text) {
  const value = clean(text, 8000);
  return SKILLS.filter(([, pattern]) => pattern.test(value)).map(([name]) => name);
}

function extractTjm(text, sourceId) {
  if (!["malt", "freelance_com", "collective_work"].includes(sourceId)) return null;
  const value = clean(text, 5000);
  const match =
    value.match(/(?:tjm\s*(?:indicatif)?\s*[:\-]?\s*)?(\d{2,4})\s*€\s*(?:\/|par)\s*(?:jour|j\b)/i) ||
    value.match(/(\d{2,4})\s*€\s*\/\s*jour/i);
  if (!match) return null;
  const amount = Number(match[1]);
  return Number.isFinite(amount) && amount >= 100 && amount <= 5000 ? amount : null;
}

function extractLocations(text) {
  const value = clean(text, 5000);
  const cities = [
    "Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nantes",
    "Rennes", "Tours", "Montpellier", "Nice", "Strasbourg", "Grenoble"
  ];
  return cities.filter((city) => new RegExp("\\b" + city + "\\b", "i").test(value));
}

function relevanceScore({ query, text, sourceId, skills }) {
  let score = 45;
  score += Math.min(30, Math.round(overlapScore(query, text) * 0.3));
  score += Math.min(15, skills.length * 3);
  if (/freelance|ind[eé]pendant|consultant/i.test(text)) score += 6;
  if (/disponib|available|proposer un projet/i.test(text)) score += 4;
  if (sourceId === "malt" || sourceId === "freelance_com") score += 3;
  return Math.min(100, score);
}

export function parseTalentSearchResult(result, query) {
  const url = clean(result?.url, 1000);
  const source = sourceFromUrl(url);
  if (!source) return null;

  const title = clean(result?.title, 500);
  const snippet = clean(result?.description, 4000);
  const evidence = [title, snippet].filter(Boolean).join(" ");
  const name = titleName(title, source.id);
  if (!name || name.length < 2) return null;

  const skills = extractSkills(evidence);
  const relevance = relevanceScore({
    query,
    text: evidence,
    sourceId: source.id,
    skills
  });

  if (relevance < 55) return null;

  return {
    source_platform: source.id,
    source_label: source.label,
    profile_url: url,
    display_name: name,
    headline: headlineFromTitle(title, name),
    snippet: snippet || null,
    skills,
    tjm: extractTjm(evidence, source.id),
    currency: "EUR",
    remote: /remote|t[eé]l[eé]travail|hybride/i.test(evidence),
    locations: extractLocations(evidence),
    relevance_score: relevance,
    evidence_kind: "public_professional_profile_candidate",
    search_query: query,
    search_age: result?.age || null
  };
}

export async function discoverTalentCandidates({
  query,
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  sources = ["malt", "freelance_com", "linkedin", "collective_work"],
  countPerSource = 20,
  maxPages = 1,
  maxCandidates = 120
} = {}) {
  const safeQuery = clean(query, 180);
  if (!safeQuery) {
    return {
      available: true,
      provider: "brave_search_api",
      candidates: [],
      searches: [],
      reason: "A talent search query is required"
    };
  }

  if (!apiKey) {
    return {
      available: false,
      provider: "brave_search_api",
      candidates: [],
      searches: [],
      reason: "BRAVE_SEARCH_API_KEY is not configured"
    };
  }

  const selected = SOURCES.filter((source) => sources.includes(source.id));
  const candidates = [];
  const searches = [];

  const pageCount = Math.min(Math.max(Number(maxPages) || 1, 1), 10);
  const count = Math.min(Math.max(Number(countPerSource) || 20, 1), 20);

  for (const source of selected) {
    const q = source.query(safeQuery);

    for (let offset = 0; offset < pageCount; offset += 1) {
      const url = new URL(BRAVE_WEB_SEARCH_URL);
      url.searchParams.set("q", q);
      url.searchParams.set("country", "FR");
      url.searchParams.set("search_lang", "fr");
      url.searchParams.set("ui_lang", "fr-FR");
      url.searchParams.set("count", String(count));
      if (offset > 0) url.searchParams.set("offset", String(offset));

      try {
        const cached = await fetchBraveCached(url.toString(), {
          apiKey,
          ttlMs: 24 * 60 * 60 * 1000
        });
        const results = cached.payload?.web?.results || [];
        let accepted = 0;

        for (const result of results) {
          const candidate = parseTalentSearchResult(result, safeQuery);
          if (!candidate || candidate.source_platform !== source.id) continue;
          candidates.push(candidate);
          accepted += 1;
        }

        searches.push({
          source: source.id,
          query: q,
          offset,
          ok: true,
          raw_results: results.length,
          candidates: accepted,
          cache_hit: cached.cache_hit
        });

        if (!cached.payload?.query?.more_results_available) break;
      } catch (error) {
        searches.push({
          source: source.id,
          query: q,
          offset,
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
        break;
      }
    }
  }

  const deduped = new Map();
  for (const candidate of candidates) {
    const key = candidate.profile_url.toLowerCase().replace(/\/$/, "");
    const current = deduped.get(key);
    if (!current || candidate.relevance_score > current.relevance_score) {
      deduped.set(key, candidate);
    }
  }

  return {
    available: true,
    provider: "brave_search_api",
    candidates: [...deduped.values()]
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, Math.min(Math.max(Number(maxCandidates) || 120, 1), 500)),
    searches,
    note:
      "Recherche ciblée dans des résultats publics indexés. Les profils restent candidats jusqu'à validation humaine ; aucune prospection ni enrichissement payant n'est déclenché."
  };
}

export const TALENT_HUNTER_SOURCES = SOURCES.map(({ id, label }) => ({ id, label }));
