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
  },
  {
    sourceId: "francetravail_training_web",
    kind: "training",
    query: 'site:candidat.francetravail.fr/offres "formateur" IA',
    urlPattern: /candidat\.francetravail\.fr\/offres/i
  },
  {
    sourceId: "emploi_territorial",
    kind: "territory",
    query: 'site:emploi-territorial.fr/offre "intelligence artificielle"',
    urlPattern: /emploi-territorial\.fr\/offre\//i
  },
  {
    sourceId: "emploi_territorial",
    kind: "territory",
    query: 'site:emploi-territorial.fr/offre "IA" automatisation collectivité',
    urlPattern: /emploi-territorial\.fr\/offre\//i
  },
  {
    sourceId: "emploi_territorial",
    kind: "territory",
    query: 'site:emploi-territorial.fr/offre "IA" usagers collectivité',
    urlPattern: /emploi-territorial\.fr\/offre\//i
  },
  {
    sourceId: "aides_territoires",
    kind: "territory_program",
    query: 'site:aides-territoires.beta.gouv.fr "intelligence artificielle" collectivités',
    urlPattern: /aides-territoires\.beta\.gouv\.fr\/(?:aides|programmes)\//i
  },
  {
    sourceId: "banque_territoires_programs",
    kind: "territory_program",
    query: 'site:banquedesterritoires.fr "intelligence artificielle" collectivités programme',
    urlPattern: /banquedesterritoires\.fr\//i
  },
  {
    sourceId: "francenum_programs",
    kind: "territory_program",
    query: 'site:francenum.gouv.fr/aides-financieres "intelligence artificielle" région TPE PME',
    urlPattern: /francenum\.gouv\.fr\/aides-financieres\//i
  },
  {
    sourceId: "anct_programs",
    kind: "territory_program",
    query: 'site:anct.gouv.fr "intelligence artificielle" collectivités accompagnement',
    urlPattern: /anct\.gouv\.fr\//i
  },
  {
    sourceId: "demarche_numerique_territoires_ia",
    kind: "territory_program",
    query: 'site:demarche.numerique.gouv.fr/commencer/territoires-d-ia cofinancement collectivités IA',
    urlPattern: /demarche\.numerique\.gouv\.fr\/commencer\/territoires-d-ia-/i
  },
  {
    sourceId: "demarche_numerique_territoires_ia",
    kind: "territory_program",
    query: 'site:demarche.numerique.gouv.fr/commencer/territoires-d-ia "IA Factory" collectivités',
    urlPattern: /demarche\.numerique\.gouv\.fr\/commencer\/territoires-d-ia-/i
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

function isTerritoryRelevant(text) {
  return /collectivit[eé]|territorial|territoriaux|mairie|municipal|communaut[eé] de communes|communaut[eé] d['’]agglom[eé]ration|m[eé]tropole|d[eé]partement|r[eé]gion|\bEPCI\b|syndicat mixte|\bPETR\b|service public|usagers?/i.test(
    text
  );
}

function isTerritoryProgramRelevant(text) {
  const territorialAudience =
    isTerritoryRelevant(text) ||
    /\bTPE\b|\bPME\b|entreprises? locales?|d[eé]veloppement [eé]conomique|artisans?|commer[cç]ants?/i.test(text);
  const programEvidence =
    /programme|appel [àa] projets?|appel [àa] manifestation|\bAAP\b|\bAMI\b|appel [àa] candidatures?|aide financi[eè]re|subvention|cofinancement|financement|guichet|accompagnement|diagnostic|acc[eé]l[eé]rateur|incubateur|formation/i.test(text);
  return territorialAudience && programEvidence;
}

function territoryProgramType(text) {
  if (/appel [àa] projets?|appel [àa] manifestation|\bAAP\b|\bAMI\b|appel [àa] candidatures?/i.test(text)) {
    return "territory_call_for_projects";
  }
  if (/aide financi[eè]re|subvention|cofinancement|financement|guichet/i.test(text)) {
    return "territory_funding_program";
  }
  return "territory_support_program";
}

function territorySignalKeys(text) {
  const keys = ["territorial", "territory_ai_job"];
  if (isTrainingRelevant(text)) keys.push("training_need", "territory_ai_training");
  if (/charte|gouvernance|ai act|cadre d['’]usage|r[eè]gles? d['’]usage|responsabilit[eé]/i.test(text)) {
    keys.push("territory_ai_governance");
  }
  if (/automatisation|automatiser|workflow|processus|robotisation|compte.?rendu/i.test(text)) {
    keys.push("territory_automation");
  }
  if (/\bRAG\b|assistant documentaire|documents?|proc[eé]dures?|base de connaissances/i.test(text)) {
    keys.push("territory_document_rag");
  }
  if (/usagers?|administr[eé]s?|relation usager|service aux usagers/i.test(text)) {
    keys.push("territory_citizen_relation");
  }
  if (/\bTPE\b|\bPME\b|entreprises? locales?|d[eé]veloppement [eé]conomique|artisans?|commer[cç]ants?/i.test(text)) {
    keys.push("territory_sme_ai_program");
  }
  if (keys.length === 2) keys.push("territory_ai_project");
  return keys;
}

export function normalizeWebDemandResult(spec, result) {
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
  if (spec.kind === "territory" && !isTerritoryRelevant(text)) {
    return null;
  }
  if (spec.kind === "territory_program" && !isTerritoryProgramRelevant(text)) {
    return null;
  }

  const signalKeys = [
    ...classification.matches.map((match) => match.id)
  ];

  let contractType = null;
  let marketSignalType = null;
  if (spec.kind === "freelance") {
    signalKeys.push("freelance");
    contractType = "Freelance / indépendant";
  } else if (spec.kind === "training") {
    signalKeys.push("training_need");
    if (/recherche.{0,40}formateur|formateur.{0,40}freelance|sous[- ]?trait/i.test(text)) {
      signalKeys.push("training_subcontracting");
    }
    contractType = "Besoin formation IA";
  } else if (spec.kind === "adoption") {
    signalKeys.push("training_need", "ai_adoption_signal");
    contractType = "Signal adoption / formation IA";
  } else if (spec.kind === "territory") {
    signalKeys.push(...territorySignalKeys(text));
    contractType = "Signal recrutement collectivité IA";
  } else if (spec.kind === "territory_program") {
    marketSignalType = territoryProgramType(text);
    signalKeys.push("territorial", "territory_program", marketSignalType);
    contractType = "Programme / appel territorial IA";
  }

  return {
    sourceId: spec.sourceId,
    sourceRecordId: stableHash(sourceUrl),
    title: title || "(sans titre)",
    companyName: null,
    location: null,
    contractType,
    marketSignalType,
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
      market_signal_type: marketSignalType,
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
        .map((result) => normalizeWebDemandResult(spec, result))
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
