import { fetchJson } from "./http.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

function clean(value) {
  return String(value || "").replace(/["'<>]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeLinkedInUrl(value) {
  const url = String(value || "");
  const match = url.match(/^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[^?#/]+/i);
  return match ? match[0].replace(/^http:/i, "https:") : null;
}

function nameFromTitle(title) {
  const value = String(title || "").replace(/\s*\|\s*LinkedIn.*$/i, "").trim();
  const first = value.split(/\s[-–—]\s/)[0]?.trim();
  if (!first || first.length < 3) return null;
  return first;
}

const COMPANY_STOPWORDS = new Set([
  "groupe", "group", "france", "sas", "sasu", "sarl", "sa", "eurl", "ltd", "inc"
]);

function normalizedText(value) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function scoreDecisionMakerCandidate({ text, company, role }) {
  const lower = normalizedText(text);
  const companyNormalized = normalizedText(company);
  const companyTerms = companyNormalized
    .split(/\s+/)
    .filter((x) => x.length >= 3 && !COMPANY_STOPWORDS.has(x));
  const roleTerms = normalizedText(role)
    .split(/[\s/]+/)
    .filter((x) => x.length >= 3);

  const companyMatches = companyTerms.filter((term) => lower.includes(term));
  const roleMatches = roleTerms.filter((term) => lower.includes(term));
  const exactCompany = companyNormalized.length >= 4 && lower.includes(companyNormalized);

  // A role match without account evidence is not enough: it could be a homonym
  // or a person working at another company.
  if (!exactCompany && companyMatches.length === 0) {
    return 35 + Math.min(roleMatches.length * 5, 15);
  }

  let score = 58;
  if (exactCompany) score += 20;
  else score += Math.min(18, 10 + companyMatches.length * 4);

  score += Math.min(roleMatches.length * 7, 21);
  if (/\bfrance\b|\bparis\b|\bile de france\b/.test(lower)) score += 3;

  return Math.min(100, score);
}

export async function discoverDecisionMakers({
  company,
  roles = [],
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  maxRoles = 3,
  countPerRole = 5
} = {}) {
  if (!apiKey) {
    return {
      available: false,
      reason: "BRAVE_SEARCH_API_KEY is not configured",
      provider: "brave_search_api",
      candidates: [],
      searches: []
    };
  }

  const safeCompany = clean(company);
  const selectedRoles = (roles || []).map((role) =>
    typeof role === "string" ? role : role?.label
  ).filter(Boolean).slice(0, Math.max(1, Number(maxRoles) || 3));

  if (!safeCompany || !selectedRoles.length) {
    return {
      available: true,
      provider: "brave_search_api",
      candidates: [],
      searches: []
    };
  }

  const candidates = [];
  const searches = [];

  for (const role of selectedRoles) {
    const query = `site:linkedin.com/in "${safeCompany}" "${clean(role)}" France`;
    const url = new URL(BRAVE_WEB_SEARCH_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("country", "FR");
    url.searchParams.set("search_lang", "fr");
    url.searchParams.set("ui_lang", "fr-FR");
    url.searchParams.set("count", String(Math.min(Math.max(Number(countPerRole) || 5, 1), 10)));

    try {
      const payload = await fetchJson(url.toString(), {
        headers: { "x-subscription-token": apiKey }
      });

      const results = payload?.web?.results || [];
      let accepted = 0;

      for (const result of results) {
        const linkedinUrl = normalizeLinkedInUrl(result?.url);
        if (!linkedinUrl) continue;

        const title = String(result?.title || "").trim();
        const description = String(result?.description || "").trim();
        const evidence = [title, description].filter(Boolean).join(" ");
        const score = scoreDecisionMakerCandidate({ text: evidence, company: safeCompany, role });

        // Keep only plausible professional matches; the account page must not present
        // arbitrary LinkedIn results as verified decision makers.
        if (score < 65) continue;

        candidates.push({
          linkedin_url: linkedinUrl,
          name_guess: nameFromTitle(title),
          headline: title || null,
          snippet: description || null,
          matched_role: role,
          relevance_score: score,
          evidence_kind: "public_search_candidate"
        });
        accepted += 1;
      }

      searches.push({ query, role, ok: true, raw_results: results.length, candidates: accepted });
    } catch (error) {
      searches.push({
        query,
        role,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const deduped = new Map();
  for (const candidate of candidates) {
    const current = deduped.get(candidate.linkedin_url);
    if (!current || candidate.relevance_score > current.relevance_score) {
      deduped.set(candidate.linkedin_url, candidate);
    }
  }

  return {
    available: true,
    provider: "brave_search_api",
    note:
      "Candidates come from public web-index results. Role/company matching is heuristic and must be verified before enrichment or outreach.",
    candidates: [...deduped.values()]
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 12),
    searches
  };
}
