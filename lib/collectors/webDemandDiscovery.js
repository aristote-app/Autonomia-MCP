import { createHash } from "node:crypto";
import { fetchJson } from "./http.js";
import { classifyAiRole } from "../taxonomy/roles.js";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const QUERY_SPECS = Object.freeze([
  {
    sourceId: "freelancerepublik",
    kind: "freelance",
    query: 'site:freelancerepublik.com/missions IA freelance',
    urlPattern: /freelancerepublik\.com\/missions\//i
  },
  {
    sourceId: "lehibou",
    kind: "freelance",
    query: 'site:lehibou.com freelance IA mission',
    urlPattern: /lehibou\.com\//i
  },
  {
    sourceId: "linkedin_post",
    kind: "freelance",
    query: 'site:linkedin.com/posts "mission freelance" IA France',
    urlPattern: /linkedin\.com\/posts\//i
  },
  {
    sourceId: "linkedin_training",
    kind: "training",
    query: 'site:fr.linkedin.com/jobs/view "formateur IA"',
    urlPattern: /fr\.linkedin\.com\/jobs\/view/i
  },
  {
    sourceId: "linkedin_training_post",
    kind: "training",
    query: 'site:linkedin.com/posts "recherche formateur IA"',
    urlPattern: /linkedin\.com\/posts\//i
  },
  {
    sourceId: "linkedin_training_post",
    kind: "training",
    query: 'site:linkedin.com/posts "formation IA" "Copilot" entreprise',
    urlPattern: /linkedin\.com\/posts\//i
  },
  {
    sourceId: "indeed_training",
    kind: "training",
    query: 'site:fr.indeed.com/viewjob "formateur IA"',
    urlPattern: /fr\.indeed\.com\/viewjob/i
  },
  {
    sourceId: "linkedin_training_post",
    kind: "adoption",
    query: 'site:linkedin.com/posts "acculturation IA" entreprise',
    urlPattern: /linkedin\.com\/posts\//i
  },
  {
    sourceId: "linkedin_training_post",
    kind: "adoption",
    query: 'site:linkedin.com/posts "déploiement Copilot" collaborateurs',
    urlPattern: /linkedin\.com\/posts\//i
  }
]);

const TOOL_TERMS = [
  "Copilot",
  "Microsoft 365",
  "ChatGPT",
  "OpenAI",
  "Claude",
  "Gemini",
  "Mistral",
  "n8n",
  "Make",
  "Power Automate",
  "Azure OpenAI"
];

const SKILL_TERMS = [
  "IA générative",
  "Generative AI",
  "GenAI",
  "LLM",
  "RAG",
  "Agentic AI",
  "AI Act",
  "AI literacy",
  "gouvernance IA",
  "acculturation",
  "sensibilisation",
  "conduite du changement",
  "formation IA"
];

function stableHash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 24);
}

function termsPresent(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.filter((term) => lower.includes(term.toLowerCase()));
}

function isClosed(text) {
  return /candidatures? ne sont plus accept[ée]es|offre expir[ée]e|poste pourvu|job is no longer available/i.test(
    text
  );
}

function isAiRelevant(text) {
  return /\bIA\b|\bAI\b|intelligence artificielle|GenAI|g[eé]n[eé]rative|LLM|RAG|Agentic|Copilot|ChatGPT|Machine Learning|MLOps|AI Act/i.test(
    text
  );
}

function isFreelanceRelevant(text) {
  return /freelance|ind[eé]pendant|mission|consultant|expert/i.test(text);
}

function isTrainingRelevant(text) {
  return /formateur|formatrice|formation|acculturation|sensibilisation|adoption|copilot|ai literacy|conduite du changement|change management/i.test(
    text
  );
}

function normalizeResult(spec, result) {
  const sourceUrl = result?.url || null;
  const title = String(result?.title || "").trim();
  const description =
    result?.description || result?.extra_snippets?.join(" ") || "";
  const text = [title, description].filter(Boolean).join(" ");

  if (!sourceUrl || !spec.urlPattern.test(sourceUrl)) return null;
  if (isClosed(text) || !isAiRelevant(text)) return null;

  const classification = classifyAiRole({
    title,
    description
  });

  const skills = termsPresent(text, SKILL_TERMS);
  const tools = termsPresent(text, TOOL_TERMS);

  if (spec.kind === "freelance" && !isFreelanceRelevant(text)) return null;
  if (
    (spec.kind === "training" || spec.kind === "adoption") &&
    !isTrainingRelevant(text)
  ) {
    return null;
  }

  const signalKeys = [
    ...classification.matches.map((match) => match.id)
  ];

  let contractType = null;
  if (spec.kind === "freelance") {
    signalKeys.push("freelance");
    contractType = "Freelance / indépendant";
  } else if (spec.kind === "training") {
    signalKeys.push("training_need");
    if (/recherche.{0,40}formateur|formateur.{0,40}freelance|sous[- ]?trait/i.test(text)) {
      signalKeys.push("training_subcontracting");
    }
    contractType = "Besoin formation IA";
  } else {
    signalKeys.push("training_need", "ai_adoption_signal");
    contractType = "Signal adoption / formation IA";
  }

  return {
    sourceId: spec.sourceId,
    sourceRecordId: stableHash(sourceUrl),
    title: title || "(sans titre)",
    companyName: null,
    location: null,
    contractType,
    sourceUrl,
    publishedAt: null,
    sourceUpdatedAt: new Date().toISOString(),
    roles: classification.matches.map((match) => match.label),
    skills,
    tools,
    useCases: [],
    signalKeys: [...new Set(signalKeys)],
    keywordSeeds: [
      ...new Set([
        ...skills,
        ...tools,
        ...classification.matches.map((match) => match.label)
      ])
    ],
    rawPayload: {
      discovery: "brave_web_search",
      search_kind: spec.kind,
      query: spec.query,
      search_title: result?.title || null,
      search_description: description,
      age: result?.age || null
    }
  };
}

export async function discoverWebDemandSignals({
  apiKey = process.env.BRAVE_SEARCH_API_KEY,
  specs = QUERY_SPECS,
  count = 20,
  freshness = "pm"
} = {}) {
  if (!apiKey) {
    return {
      available: false,
      reason: "BRAVE_SEARCH_API_KEY is not configured",
      provider: "brave_search_api",
      items: [],
      searches: []
    };
  }

  const items = [];
  const searches = [];

  for (const spec of specs) {
    const url = new URL(BRAVE_WEB_SEARCH_URL);
    url.searchParams.set("q", spec.query);
    url.searchParams.set("country", "FR");
    url.searchParams.set("search_lang", "fr");
    url.searchParams.set("ui_lang", "fr-FR");
    url.searchParams.set(
      "count",
      String(Math.min(Math.max(Number(count) || 20, 1), 20))
    );
    url.searchParams.set("freshness", freshness);

    try {
      const payload = await fetchJson(url.toString(), {
        headers: {
          "x-subscription-token": apiKey
        }
      });

      const results = payload?.web?.results || [];
      const normalized = results
        .map((result) => normalizeResult(spec, result))
        .filter(Boolean);

      items.push(...normalized);
      searches.push({
        sourceId: spec.sourceId,
        kind: spec.kind,
        query: spec.query,
        ok: true,
        rawResults: results.length,
        results: normalized.length
      });
    } catch (error) {
      searches.push({
        sourceId: spec.sourceId,
        kind: spec.kind,
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

export { QUERY_SPECS as WEB_DEMAND_QUERY_SPECS };
