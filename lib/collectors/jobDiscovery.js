import { isExcludedCommercialCompany } from "../intelligence/commercialLeadPolicy.js";
import { createHash } from "node:crypto";
import { fetchBraveCached } from "./braveCache.js";
import { classifyAiRole } from "../taxonomy/roles.js";
import { extractEmployerEvidence } from "./employerEvidence.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const AI_SEARCH_TERMS = Object.freeze([
  '"AI Engineer"',
  '"intelligence artificielle"',
  '"Generative AI"',
  '"LLM"',
  '"Machine Learning"',
  '"Data Scientist"',
  '"MLOps"',
  '"AI Product"',
  '"Agentic AI"',
  '"RAG"',
  '"Copilot"',
  '"AI Governance"'
]);

function sourceQuery(sourceId, term) {
  if (sourceId === "linkedin") return `site:linkedin.com/jobs/view ${term} France`;
  if (sourceId === "indeed") return `site:fr.indeed.com/viewjob ${term} France`;
  if (sourceId === "welcome_to_the_jungle") return `site:welcometothejungle.com/fr/companies/ ${term} jobs France`;
  if (sourceId === "apec") return `site:apec.fr/candidat/recherche-emploi.html/emploi/detail-offre ${term} France`;
  if (sourceId === "hellowork") return `site:hellowork.com/fr-fr/emplois/ ${term} France`;
  throw new Error("Unknown job discovery source");
}

const DEFAULT_JOB_DISCOVERY_QUERIES = Object.freeze(
  AI_SEARCH_TERMS.flatMap((term, index) => [
    {
      sourceId: "linkedin",
      family: index + 1,
      term,
      query: sourceQuery("linkedin", term)
    },
    {
      sourceId: "indeed",
      family: index + 1,
      term,
      query: sourceQuery("indeed", term)
    }
  ]).concat([
    ...["welcome_to_the_jungle", "apec", "hellowork"].flatMap((sourceId) =>
      ['"AI Engineer"', '"Data Scientist"', '"responsable formation IA"'].map((term, index) => ({
        sourceId, family: "extension-" + (index + 1), term,
        query: sourceQuery(sourceId, term), maxPages: 1
      }))
    )
  ])
);

const TOOL_TERMS = [
  "n8n", "Make", "Zapier", "UiPath", "Copilot", "Azure OpenAI", "OpenAI",
  "Claude", "Vertex AI", "Bedrock", "Mistral", "LangChain", "LangGraph",
  "LlamaIndex", "Pinecone", "Weaviate", "pgvector", "Python", "FastAPI",
  "Docker", "Kubernetes", "Terraform"
];

const SKILL_TERMS = [
  "GenAI", "Generative AI", "IA générative", "LLM", "RAG", "Agentic AI",
  "agents IA", "Machine Learning", "MLOps", "LLMOps", "AI Act",
  "Responsible AI", "gouvernance IA", "prompt engineering", "automation",
  "automatisation", "Computer Vision", "NLP", "AI Product"
];

const INTERMEDIARY_PATTERNS = [
  /cabinet de recrutement/i,
  /agence de recrutement/i,
  /pour le compte de (?:notre|son) client/i,
  /chez (?:notre|un) client/i,
  /client final/i,
  /mission chez un client/i,
  /\bESN\b/i,
  /soci[eé]t[eé] de conseil/i,
  /conseil en recrutement/i,
  /link\s*consulting/i,
  /signe\s*\+/i,
  /\bsofteam\b/i,
  /\bvisian\b/i,
  /pickmeup/i,
  /asap\s*technologies/i,
  /gamme\s*solutions/i,
  /mon\s*consultant\s*ind[eé]pendant/i,
  /free[- ]?work/i,
  /\bjobright(?:\.ai)?\b/i,
  /\bjobgether\b/i,
  /\balten\b/i,
  /\bcapgemini\b/i,
  /\baccenture\b/i,
  /sopra\s*steria/i,
  /\bcgi\b/i,
  /\binetum\b/i,
  /\bdevoteam\b/i,
  /\bwavestone\b/i,
  /\btalan\b/i,
  /\beviden\b/i,
  /\batos\b/i,
  /\bmeritis\b/i,
  /\baubay\b/i,
  /\bextia\b/i,
  /\bdavidson\b/i,
  /\bonepoint\b/i
];

function stableHash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 24);
}

function extractRecordId(sourceId, url) {
  try {
    if (sourceId === "linkedin") {
      const match = String(url).match(/-(\d+)(?:[/?#]|$)/);
      if (match) return match[1];
    }
    if (sourceId === "indeed") {
      const parsed = new URL(url);
      const jk = parsed.searchParams.get("jk");
      if (jk) return jk;
    }
  } catch {}
  return stableHash(url);
}

function termsPresent(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.filter((term) => lower.includes(term.toLowerCase()));
}

function isAiRelevant(item) {
  const evidence = [
    item.title,
    item.rawPayload?.search_description,
    item.rawPayload?.age
  ].filter(Boolean).join(" ");

  return (
    item.roles.length > 0 ||
    item.skills.length > 0 ||
    /\bIA\b|\bAI\b|intelligence artificielle|artificial intelligence|GenAI|LLM|RAG|Agentic|Copilot|Machine Learning|MLOps|Data Scientist|Computer Vision|NLP|Prompt Engineer/i.test(evidence)
  );
}

function isClosed(text) {
  return /candidatures? ne sont plus accept[ée]es|offre expir[ée]e|poste pourvu|job is no longer available|no longer accepting applications/i.test(text);
}

function intermediaryRisk(text) {
  const value = String(text || "");
  return INTERMEDIARY_PATTERNS.some((pattern) => pattern.test(value));
}

function validSourceUrl(sourceId, value) {
  const url = String(value || "");
  if (sourceId === "linkedin") return /^https:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/jobs\/view/i.test(url);
  if (sourceId === "indeed") return /^https:\/\/(?:fr\.)?indeed\.(?:com|fr)\/viewjob/i.test(url);
  if (sourceId === "welcome_to_the_jungle") return /^https:\/\/www\.welcometothejungle\.com\/fr\/companies\/[^/]+\/jobs\/[^/?#]+/i.test(url);
  if (sourceId === "apec") return /^https:\/\/www\.apec\.fr\/candidat\/recherche-emploi\.html\/emploi\/detail-offre\/[^/?#]+/i.test(url);
  if (sourceId === "hellowork") return /^https:\/\/www\.hellowork\.com\/fr-fr\/emplois\/\d+\.html/i.test(url);
  return false;
}

function franceEvidence(sourceId, sourceUrl, text, query = "") {
  const url = String(sourceUrl || "");
  const evidence = String(text || "");

  if (sourceId === "linkedin" && /https?:\/\/fr\.linkedin\.com\/jobs\/view/i.test(url)) {
    return true;
  }
  if (sourceId === "indeed" && /https?:\/\/fr\.indeed\.com\/viewjob/i.test(url)) {
    return true;
  }

  if (/\bFrance\b/i.test(String(query || ""))) return true;

  return /\bFrance\b|\bParis\b|Île-de-France|Ile-de-France|Lyon|Marseille|Toulouse|Lille|Nantes|Bordeaux|Montpellier|Rennes|Grenoble|Nice|Strasbourg|Sophia Antipolis|Saint-Denis|Saint-Ouen|Courbevoie|La Défense|Boulogne-Billancourt|Issy-les-Moulineaux|Nanterre|Rungis|Valbonne|Tours/i.test(evidence);
}

function parsePublishedAtFromAge(age, now = new Date()) {
  const value = String(age || "").trim().toLowerCase();
  if (!value) return null;

  if (/today|aujourd/.test(value)) return now.toISOString();
  if (/yesterday|hier/.test(value)) {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  }

  const match = value.match(/(\d+)\s*(minute|min|hour|heure|day|jour|week|semaine|month|mois)/i);
  if (!match) return null;

  const amount = Math.max(0, Number(match[1]) || 0);
  const unit = match[2].toLowerCase();
  let ms = 0;
  if (/minute|min/.test(unit)) ms = amount * 60 * 1000;
  else if (/hour|heure/.test(unit)) ms = amount * 60 * 60 * 1000;
  else if (/day|jour/.test(unit)) ms = amount * 24 * 60 * 60 * 1000;
  else if (/week|semaine/.test(unit)) ms = amount * 7 * 24 * 60 * 60 * 1000;
  else if (/month|mois/.test(unit)) ms = amount * 30 * 24 * 60 * 60 * 1000;

  return ms ? new Date(now.getTime() - ms).toISOString() : null;
}

function inferLocation(text) {
  const value = String(text || "");
  const match = value.match(/\b(Paris|Lyon|Marseille|Toulouse|Lille|Nantes|Bordeaux|Montpellier|Rennes|Grenoble|Nice|Strasbourg|Sophia Antipolis|Saint-Denis|Saint-Ouen|Courbevoie|La Défense|Boulogne-Billancourt|Île-de-France|Ile-de-France|France)\b/i);
  return match?.[1] || null;
}

export function normalizeJobSearchResult({ sourceId, query, result }) {
  const sourceUrl = result?.url || null;
  const rawTitle = result?.title || "";
  const description = result?.description || result?.extra_snippets?.join(" ") || "";
  const employer = extractEmployerEvidence({ sourceId, rawTitle, description, sourceUrl });
  const cleaned = { title: employer.jobTitle, companyName: employer.companyName };
  const inferredCompany = employer.companyName;
  const text = [cleaned.title, inferredCompany, description].filter(Boolean).join(" ");
  const roleClassification = classifyAiRole({
    title: cleaned.title,
    description
  });

  const skills = termsPresent(text, SKILL_TERMS);
  const tools = termsPresent(text, TOOL_TERMS);
  const freelance = /freelance|ind[eé]pendant|contractor|mission\s+(?:de\s+)?\d+/i.test(text);
  const intermediary = isExcludedCommercialCompany(inferredCompany) || intermediaryRisk([inferredCompany, text].filter(Boolean).join(" "));
  const frenchMarketEvidence = franceEvidence(sourceId, sourceUrl, text, query);
  const directEmployerEvidence = Boolean(
    inferredCompany &&
    !intermediary &&
    frenchMarketEvidence &&
    sourceUrl &&
    validSourceUrl(sourceId, sourceUrl) &&
    Boolean(employer.evidence)
  );

  return {
    sourceId,
    sourceRecordId: extractRecordId(sourceId, sourceUrl),
    title: cleaned.title || rawTitle || "(sans titre)",
    companyName: inferredCompany,
    location: inferLocation(text),
    contractType: freelance ? "Freelance / indépendant" : "Emploi salarié",
    sourceUrl,
    publishedAt: parsePublishedAtFromAge(result?.age),
    sourceUpdatedAt: new Date().toISOString(),
    roles: roleClassification.matches.map((match) => match.label),
    skills,
    tools,
    useCases: [],
    signalKeys: [
      ...roleClassification.matches.map((match) => match.id),
      freelance ? "freelance" : "recruitment_signal",
      ...(directEmployerEvidence ? ["direct_employer_candidate"] : []),
      ...(intermediary ? ["intermediary_risk"] : [])
    ],
    keywordSeeds: [...new Set([
      ...skills,
      ...tools,
      ...roleClassification.matches.map((match) => match.label)
    ])],
    rawPayload: {
      discovery: "brave_web_search",
      discovery_version: "verified_employer_v10",
      company_evidence_source: employer.evidence,
      query,
      search_title: rawTitle,
      search_description: description,
      age: result?.age || null,
      source_profile: result?.profile || null,
      publisher_company: inferredCompany,
      company_inferred_from_url: employer.evidence === "employer_career_slug",
      direct_employer_evidence: directEmployerEvidence,
      france_evidence: frenchMarketEvidence,
      intermediary_risk: intermediary
    }
  };
}

export async function discoverJobSignals({
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  queries = DEFAULT_JOB_DISCOVERY_QUERIES,
  count = 20,
  freshness = "pw",
  maxPages = 1,
  cacheTtlMs = 3 * 60 * 60 * 1000
} = {}) {
  if (!apiKey) {
    return {
      available: false,
      reason: "BRAVE_SEARCH_API_KEY is not configured",
      items: [],
      searches: []
    };
  }

  const items = [];
  const searches = [];
  const pageSize = Math.min(Math.max(Number(count) || 20, 1), 20);

  for (const spec of queries) {
    const pageLimit = Math.min(
      Math.max(Number(spec.maxPages ?? maxPages) || 1, 1),
      10
    );

    for (let offset = 0; offset < pageLimit; offset += 1) {
      const url = new URL(BRAVE_WEB_SEARCH_URL);
      url.searchParams.set("q", spec.query);
      url.searchParams.set("country", "FR");
      url.searchParams.set("ui_lang", "fr-FR");
      url.searchParams.set("count", String(pageSize));
      url.searchParams.set("offset", String(offset));
      if (spec.sourceId !== "indeed" && freshness) url.searchParams.set("freshness", freshness);
      url.searchParams.set("extra_snippets", "true");

      try {
        const cached = await fetchBraveCached(url.toString(), {
          apiKey,
          ttlMs: cacheTtlMs
        });
        const payload = cached.payload;

        const results = payload?.web?.results || [];
        const validUrlResults = results.filter(
          (result) => result?.url && validSourceUrl(spec.sourceId, result.url)
        );
        const mapped = validUrlResults.map((result) =>
          normalizeJobSearchResult({
            sourceId: spec.sourceId,
            query: spec.query,
            result
          })
        );
        const aiRelevantCount = mapped.filter((item) => isAiRelevant(item)).length;
        const franceRelevantCount = mapped.filter(
          (item) => item.rawPayload?.france_evidence === true
        ).length;
        const closedCount = mapped.filter((item) => {
          const evidence = [
            item.title,
            item.rawPayload?.search_description,
            item.rawPayload?.age
          ].filter(Boolean).join(" ");
          return isClosed(evidence);
        }).length;
        const normalized = mapped.filter((item) => {
          const evidence = [
            item.title,
            item.rawPayload?.search_description,
            item.rawPayload?.age
          ].filter(Boolean).join(" ");

          return (
            isAiRelevant(item) &&
            item.rawPayload?.france_evidence === true &&
            !isClosed(evidence) &&
            !isExcludedCommercialCompany(item.companyName)
          );
        });

        items.push(...normalized);
        searches.push({
          sourceId: spec.sourceId,
          family: spec.family || null,
          query: spec.query,
          offset,
          ok: true,
          cacheHit: cached.cache_hit,
          rawResults: results.length,
          validJobUrls: validUrlResults.length,
          aiRelevant: aiRelevantCount,
          franceRelevant: franceRelevantCount,
          closed: closedCount,
          withCompany: mapped.filter((item) => Boolean(item.companyName)).length,
          directEmployerCandidates: mapped.filter((item) =>
            item.signalKeys.includes("direct_employer_candidate")
          ).length,
          intermediaryRisk: mapped.filter((item) =>
            item.signalKeys.includes("intermediary_risk")
          ).length,
          results: normalized.length
        });

        const more = Boolean(payload?.query?.more_results_available);
        if (!more || results.length === 0) break;
      } catch (error) {
        searches.push({
          sourceId: spec.sourceId,
          family: spec.family || null,
          query: spec.query,
          offset,
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
        break;
      }
    }
  }

  const deduped = new Map();
  for (const item of items) {
    const key = `${item.sourceId}:${item.sourceRecordId}`;
    const current = deduped.get(key);
    if (!current || (!current.companyName && item.companyName)) {
      deduped.set(key, item);
    }
  }

  const output = [...deduped.values()];
  const successfulSearches = searches.filter((search) => search.ok).length;
  return {
    available: successfulSearches > 0,
    ...(successfulSearches > 0 ? {} : { reason: "All LinkedIn/Indeed discovery searches failed" }),
    provider: "brave_search_api",
    coverage: {
      scope: "publicly indexable job pages: LinkedIn, Indeed, Welcome to the Jungle, Apec, HelloWork",
      exhaustiveWithinProvider: false,
      reason: "Public web index only; discovery is non-exhaustive. Publisher access rules apply, and job pages must be independently verified before outreach."
    },
    items: output,
    searches,
    stats: {
      successfulSearches,
      totalSearches: searches.length,
      linkedin: output.filter((item) => item.sourceId === "linkedin").length,
      indeed: output.filter((item) => item.sourceId === "indeed").length,
      welcomeToTheJungle: output.filter((item) => item.sourceId === "welcome_to_the_jungle").length,
      apec: output.filter((item) => item.sourceId === "apec").length,
      hellowork: output.filter((item) => item.sourceId === "hellowork").length,
      freelance: output.filter((item) => item.signalKeys.includes("freelance")).length,
      salaried: output.filter((item) => !item.signalKeys.includes("freelance")).length,
      directEmployerCandidates: output.filter((item) => item.signalKeys.includes("direct_employer_candidate")).length,
      intermediaryRisk: output.filter((item) => item.signalKeys.includes("intermediary_risk")).length
    }
  };
}

export { DEFAULT_JOB_DISCOVERY_QUERIES };
