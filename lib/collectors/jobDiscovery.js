import { createHash } from "node:crypto";
import { fetchJson } from "./http.js";
import { classifyAiRole } from "../taxonomy/roles.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const DEFAULT_JOB_DISCOVERY_QUERIES = Object.freeze([
  {
    sourceId: "linkedin",
    query: 'site:linkedin.com/jobs/view freelance IA'
  },
  {
    sourceId: "linkedin",
    query: '"LinkedIn Jobs" "AI Engineer" freelance France'
  },
  {
    sourceId: "indeed",
    query: 'site:indeed.com/viewjob freelance IA'
  },
  {
    sourceId: "indeed",
    query: '"Indeed" "AI Engineer" freelance France'
  }
]);

const TOOL_TERMS = [
  "n8n",
  "Make",
  "Zapier",
  "UiPath",
  "Copilot",
  "Azure OpenAI",
  "OpenAI",
  "Claude",
  "Vertex AI",
  "Bedrock",
  "Mistral",
  "LangChain",
  "LangGraph",
  "LlamaIndex",
  "Pinecone",
  "Weaviate",
  "pgvector",
  "Python",
  "FastAPI",
  "Docker",
  "Kubernetes",
  "Terraform"
];

const SKILL_TERMS = [
  "GenAI",
  "Generative AI",
  "IA générative",
  "LLM",
  "RAG",
  "Agentic AI",
  "agents IA",
  "Machine Learning",
  "MLOps",
  "LLMOps",
  "AI Act",
  "Responsible AI",
  "gouvernance IA",
  "prompt engineering",
  "automation",
  "automatisation"
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

function cleanTitle(sourceId, title) {
  let value = String(title || "").trim();
  value = value.replace(/\s*\|\s*LinkedIn.*$/i, "");
  value = value.replace(/\s*-\s*Indeed(?:\.com)?.*$/i, "");

  if (sourceId === "linkedin") {
    const match = value.match(/^(.*?)\s+recrute pour des postes de\s+(.+)$/i);
    if (match) return { companyName: match[1].trim(), title: match[2].trim() };
  }

  return { companyName: null, title: value };
}

function termsPresent(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.filter((term) => lower.includes(term.toLowerCase()));
}

export function normalizeJobSearchResult({ sourceId, query, result }) {
  const sourceUrl = result?.url || null;
  const rawTitle = result?.title || "";
  const description = result?.description || result?.extra_snippets?.join(" ") || "";
  const cleaned = cleanTitle(sourceId, rawTitle);
  const text = [cleaned.title, description].filter(Boolean).join(" ");
  const queryText = String(query || "");

  const roleClassification = classifyAiRole({
    title: cleaned.title,
    description
  });

  const skills = termsPresent(text, SKILL_TERMS);
  const tools = termsPresent(text, TOOL_TERMS);
  const freelance = /freelance|ind[eé]pendant/i.test([text, queryText].join(" "));

  return {
    sourceId,
    sourceRecordId: extractRecordId(sourceId, sourceUrl),
    title: cleaned.title || rawTitle || "(sans titre)",
    companyName: cleaned.companyName,
    location: null,
    contractType: freelance ? "Freelance / indépendant" : "Emploi salarié",
    sourceUrl,
    publishedAt: null,
    sourceUpdatedAt: new Date().toISOString(),
    roles: roleClassification.matches.map((match) => match.label),
    skills,
    tools,
    useCases: [],
    signalKeys: [
      ...roleClassification.matches.map((match) => match.id),
      freelance ? "freelance" : "recruitment_signal"
    ],
    keywordSeeds: [...new Set([...skills, ...tools, ...roleClassification.matches.map((match) => match.label)])],
    rawPayload: {
      discovery: "brave_web_search",
      query,
      search_title: rawTitle,
      search_description: description,
      age: result?.age || null,
      source_profile: result?.profile || null
    }
  };
}

export async function discoverJobSignals({
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  queries = DEFAULT_JOB_DISCOVERY_QUERIES,
  count = 20,
  freshness = "pm"
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

  for (const spec of queries) {
    const url = new URL(BRAVE_WEB_SEARCH_URL);
    url.searchParams.set("q", spec.query);
    url.searchParams.set("country", "FR");
    url.searchParams.set("search_lang", "fr");
    url.searchParams.set("ui_lang", "fr-FR");
    url.searchParams.set("count", String(Math.min(Math.max(Number(count) || 20, 1), 20)));
    url.searchParams.set("freshness", freshness);

    try {
      const payload = await fetchJson(url.toString(), {
        headers: {
          "x-subscription-token": apiKey
        }
      });

      const results = payload?.web?.results || [];
      const normalized = results
        .filter((result) => {
          if (!result?.url) return false;
          const url = String(result.url);
          return spec.sourceId === "linkedin"
            ? /linkedin\.com\/jobs\/view/i.test(url)
            : /indeed\.com\/viewjob|indeed\.fr\/viewjob|fr\.indeed\.com\/viewjob/i.test(url);
        })
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

          const aiRelevant =
            item.roles.length > 0 ||
            item.skills.length > 0 ||
            /\bIA\b|\bAI\b|GenAI|LLM|RAG|Agentic|Copilot|Machine Learning|MLOps/i.test(evidence);

          const closed =
            /candidatures? ne sont plus accept[ée]es|offre expir[ée]e|poste pourvu|job is no longer available/i.test(evidence);

          return item.contractType === "Freelance / indépendant" && aiRelevant && !closed;
        });

      items.push(...normalized);
      searches.push({
        sourceId: spec.sourceId,
        query: spec.query,
        ok: true,
        rawResults: results.length,
        results: normalized.length
      });
    } catch (error) {
      searches.push({
        sourceId: spec.sourceId,
        query: spec.query,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const deduped = new Map();
  for (const item of items) {
    const key = `${item.sourceId}:${item.sourceRecordId}`;
    if (!deduped.has(key)) deduped.set(key, item);
  }

  return {
    available: true,
    provider: "brave_search_api",
    items: [...deduped.values()],
    searches
  };
}

export { DEFAULT_JOB_DISCOVERY_QUERIES };
