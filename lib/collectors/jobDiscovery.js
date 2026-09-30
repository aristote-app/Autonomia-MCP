import { createHash } from "node:crypto";
import { fetchBraveCached } from "./braveCache.js";
import { classifyAiRole } from "../taxonomy/roles.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const AI_ROLE_FAMILIES = Object.freeze([
  {
    id: "genai_engineering",
    terms: [
      '"AI Engineer"', '"Ingénieur IA"', '"GenAI Engineer"', '"Generative AI Engineer"',
      '"LLM Engineer"', '"RAG Engineer"', '"AI Developer"', '"Développeur IA"'
    ]
  },
  {
    id: "ml_data",
    terms: [
      '"Machine Learning Engineer"', '"ML Engineer"', '"Data Scientist"', '"MLOps"',
      '"LLMOps"', '"Deep Learning"', '"Applied Scientist"'
    ]
  },
  {
    id: "architecture",
    terms: [
      '"AI Architect"', '"Architecte IA"', '"Data AI Architect"', '"GenAI Architect"',
      '"Cloud AI Architect"', '"Solution Architect AI"'
    ]
  },
  {
    id: "product_project",
    terms: [
      '"AI Product Manager"', '"AI Product"', '"Chef de projet IA"', '"AI Project Manager"',
      '"Responsable IA"', '"Program Manager AI"'
    ]
  },
  {
    id: "agentic_automation",
    terms: [
      '"Agentic AI"', '"AI Agent"', '"Agents IA"', '"AI Automation"',
      '"Intelligent Automation"', '"Conversational AI"'
    ]
  },
  {
    id: "vision_nlp_research",
    terms: [
      '"Computer Vision"', '"NLP Engineer"', '"Natural Language Processing"',
      '"Research Scientist" AI', '"Speech AI"', '"Multimodal AI"'
    ]
  },
  {
    id: "governance_consulting",
    terms: [
      '"AI Consultant"', '"Consultant IA"', '"AI Governance"', '"Responsible AI"',
      '"AI Act"', '"AI Transformation"'
    ]
  },
  {
    id: "generic_ai",
    terms: [
      '"intelligence artificielle"', '"artificial intelligence"', '"Generative AI"',
      '"IA générative"', '"LLM"', '"Machine Learning"'
    ]
  }
]);

function familyQuery(sourceId, family) {
  const site =
    sourceId === "linkedin"
      ? "site:linkedin.com/jobs/view"
      : "site:indeed.com/viewjob";
  return `${site} (${family.terms.join(" OR ")}) France`;
}

const DEFAULT_JOB_DISCOVERY_QUERIES = Object.freeze(
  AI_ROLE_FAMILIES.flatMap((family, index) => [
    {
      sourceId: "linkedin",
      family: family.id,
      familyIndex: index + 1,
      query: familyQuery("linkedin", family),
    },
    {
      sourceId: "indeed",
      family: family.id,
      familyIndex: index + 1,
      query: familyQuery("indeed", family),
    }
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
  /recruitment/i,
  /staffing/i,
  /talent acquisition agency/i,
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

function cleanCompany(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^[\s·|–—-]+|[\s·|–—-]+$/g, "")
    .trim() || null;
}

function cleanTitle(sourceId, title) {
  let value = String(title || "").trim();
  value = value.replace(/\s*\|\s*LinkedIn.*$/i, "");
  value = value.replace(/\s*-\s*Indeed(?:\.com|\.fr)?.*$/i, "");

  if (sourceId === "linkedin") {
    let match = value.match(/^(.*?)\s+recrute pour des postes de\s+(.+)$/i);
    if (match) return { companyName: cleanCompany(match[1]), title: match[2].trim() };

    match = value.match(/^(.*?)\s+hiring\s+(.+?)(?:\s+in\s+.+)?$/i);
    if (match) return { companyName: cleanCompany(match[1]), title: match[2].trim() };

    match = value.match(/^(.+?)\s+at\s+(.+)$/i);
    if (match) return { companyName: cleanCompany(match[2]), title: match[1].trim() };
  }

  return { companyName: null, title: value };
}

function inferCompanyFromDescription(description) {
  const value = String(description || "").replace(/\s+/g, " ").trim();
  if (!value) return null;

  const patterns = [
    /(?:Entreprise|Soci[eé]t[eé]|Company)\s*[:·-]\s*([^|.;]{2,80})/i,
    /(?:chez|at)\s+([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ0-9&.'’+ -]{2,70})(?=[,.;|]|\s+(?:recherche|recrute|hiring|is looking))/i
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return cleanCompany(match[1]);
  }
  return null;
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
  if (sourceId === "linkedin") return /(?:[a-z]{2,3}\.)?linkedin\.com\/jobs\/view/i.test(url);
  return /(?:fr\.)?indeed\.(?:com|fr)\/viewjob/i.test(url);
}

function franceEvidence(sourceId, sourceUrl, text, query = "") {
  const url = String(sourceUrl || "");
  const evidence = String(text || "");
  const scopedQuery = String(query || "");

  if (sourceId === "linkedin" && /https?:\/\/fr\.linkedin\.com\/jobs\/view/i.test(url)) {
    return true;
  }
  if (sourceId === "indeed" && /https?:\/\/fr\.indeed\.com\/viewjob/i.test(url)) {
    return true;
  }

  if (
    /\bFrance\b/i.test(scopedQuery) &&
    validSourceUrl(sourceId, sourceUrl)
  ) {
    return true;
  }

  return /\bFrance\b|\bParis\b|Île-de-France|Ile-de-France|Lyon|Marseille|Toulouse|Lille|Nantes|Bordeaux|Montpellier|Rennes|Grenoble|Nice|Strasbourg|Sophia Antipolis|Saint-Denis|Saint-Ouen|Courbevoie|La Défense|Boulogne-Billancourt/i.test(evidence);
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
  const cleaned = cleanTitle(sourceId, rawTitle);
  const inferredCompany = cleaned.companyName || inferCompanyFromDescription(description);
  const text = [cleaned.title, inferredCompany, description].filter(Boolean).join(" ");
  const roleClassification = classifyAiRole({
    title: cleaned.title,
    description
  });

  const skills = termsPresent(text, SKILL_TERMS);
  const tools = termsPresent(text, TOOL_TERMS);
  const freelance = /freelance|ind[eé]pendant|contractor|mission\s+(?:de\s+)?\d+/i.test(text);
  const intermediary = intermediaryRisk([inferredCompany, text].filter(Boolean).join(" "));
  const frenchMarketEvidence = franceEvidence(sourceId, sourceUrl, text, query);
  const directEmployerEvidence = Boolean(
    inferredCompany &&
    !intermediary &&
    frenchMarketEvidence &&
    sourceUrl &&
    validSourceUrl(sourceId, sourceUrl)
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
      discovery_version: "linkedin_indeed_ai_terms_v6",
      query,
      search_title: rawTitle,
      search_description: description,
      age: result?.age || null,
      source_profile: result?.profile || null,
      publisher_company: inferredCompany,
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
  maxPages = 3,
  cacheTtlMs = 60 * 60 * 1000
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
      url.searchParams.set("freshness", freshness);
      url.searchParams.set("extra_snippets", "true");

      try {
        const cached = await fetchBraveCached(url.toString(), {
          apiKey,
          ttlMs: cacheTtlMs
        });
        const payload = cached.payload;

        const results = payload?.web?.results || [];
        const normalized = results
          .filter((result) => result?.url && validSourceUrl(spec.sourceId, result.url))
          .map((result) =>
            normalizeJobSearchResult({
              sourceId: spec.sourceId,
              query: spec.query,
              result
            })
          )
          .filter((item) => {
            const evidence = [
              item.title,
              item.rawPayload?.search_description,
              item.rawPayload?.age
            ].filter(Boolean).join(" ");

            return (
              isAiRelevant(item) &&
              item.rawPayload?.france_evidence === true &&
              !isClosed(evidence)
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
      scope: "publicly indexable LinkedIn and Indeed job pages",
      exhaustiveWithinProvider: false,
      reason: "Coverage spans the main AI role families with paginated public-web discovery. LinkedIn and Indeed do not expose a complete unrestricted jobs feed through this connector, so non-indexed/private listings cannot be guaranteed."
    },
    items: output,
    searches,
    stats: {
      successfulSearches,
      totalSearches: searches.length,
      linkedin: output.filter((item) => item.sourceId === "linkedin").length,
      indeed: output.filter((item) => item.sourceId === "indeed").length,
      freelance: output.filter((item) => item.signalKeys.includes("freelance")).length,
      salaried: output.filter((item) => !item.signalKeys.includes("freelance")).length,
      directEmployerCandidates: output.filter((item) => item.signalKeys.includes("direct_employer_candidate")).length,
      intermediaryRisk: output.filter((item) => item.signalKeys.includes("intermediary_risk")).length
    }
  };
}

export { DEFAULT_JOB_DISCOVERY_QUERIES };
