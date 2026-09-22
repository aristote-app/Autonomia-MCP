export const VERIFIED_JOB_SIGNAL_FALLBACK = [
  {
    sourceId: "indeed",
    sourceRecordId: "fa4572550e9d153c",
    title: "AI Engineer (GenAI & LLM) – Practice IA",
    companyName: "MARGO",
    location: "Paris",
    contractType: null,
    sourceUrl: "https://fr.indeed.com/viewjob?jk=fa4572550e9d153c",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T00:00:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "Agentic AI", "RAG", "LLM"],
    tools: [],
    useCases: [],
    signalKeys: ["recruitment_signal"],
    keywordSeeds: ["AI Engineer", "GenAI", "Agentic AI", "RAG", "LLM"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note:
        "Public Indeed job page observed by Autonomia. Fallback signal only; live discovery takes precedence when available."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "b6341913f2edfd75",
    title: "AI Engineer",
    companyName: "Kering",
    location: "Paris",
    contractType: null,
    sourceUrl: "https://fr.indeed.com/viewjob?jk=b6341913f2edfd75",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T00:00:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "LLM", "RAG", "MLOps"],
    tools: ["Vertex AI", "BigQuery", "LangChain", "LlamaIndex", "OpenAI", "Gemini", "Anthropic"],
    useCases: [],
    signalKeys: ["recruitment_signal"],
    keywordSeeds: ["AI Engineer", "RAG", "MLOps", "Vertex AI", "Agentic AI"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22"
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "216c338d385edb73",
    title: "AI Engineer H/F",
    companyName: "LCL",
    location: "Villejuif",
    contractType: null,
    sourceUrl: "https://fr.indeed.com/viewjob?jk=216c338d385edb73",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T00:00:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "LLMOps", "RAG"],
    tools: [],
    useCases: [],
    signalKeys: ["recruitment_signal"],
    keywordSeeds: ["AI Engineer", "LLMOps", "RAG", "GenAI"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22"
    }
  },
  {
    sourceId: "linkedin",
    sourceRecordId: "4464867770",
    title: "AI Engineer",
    companyName: "STATION F",
    location: "Paris",
    contractType: "Temps plein",
    sourceUrl: "https://fr.linkedin.com/jobs/view/ai-engineer-at-station-f-4464867770",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T00:00:00.000Z",
    roles: ["AI Engineer"],
    skills: ["RAG", "Generative AI", "Agents IA", "Evaluation"],
    tools: [],
    useCases: [],
    signalKeys: ["recruitment_signal"],
    keywordSeeds: ["AI Engineer", "RAG", "Agents IA", "Evaluation"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22"
    }
  },
  {
    sourceId: "linkedin",
    sourceRecordId: "4462346692",
    title: "Stage Applied IA Engineer - Sept 2026",
    companyName: "STATION F",
    location: "Paris",
    contractType: "Stage",
    sourceUrl: "https://fr.linkedin.com/jobs/view/stage-applied-ia-engineer-sept-2026-station-f-at-station-f-4462346692",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T00:00:00.000Z",
    roles: ["Applied AI Engineer"],
    skills: ["Agents IA", "Data pipelines", "Evaluation", "Automatisation"],
    tools: [],
    useCases: [],
    signalKeys: ["recruitment_signal"],
    keywordSeeds: ["Applied AI", "Agents IA", "Evaluation", "Automatisation"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22"
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "032087bc08929a10",
    title: "Consultant·e Machine Learning & AI Engineer",
    companyName: "Wavestone",
    location: "Puteaux",
    contractType: "Stage",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=032087bc08929a10",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T00:00:00.000Z",
    roles: ["Consultant AI Engineer"],
    skills: ["Machine Learning", "Generative AI", "LLM", "RAG", "Agents IA"],
    tools: ["Python"],
    useCases: [],
    signalKeys: ["recruitment_signal"],
    keywordSeeds: ["AI Engineer", "LLM", "RAG", "Agents IA", "Machine Learning"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22"
    }
  }
];

export function getVerifiedJobSignalFallback() {
  return VERIFIED_JOB_SIGNAL_FALLBACK.map((item) => ({
    ...item,
    roles: [...item.roles],
    skills: [...item.skills],
    tools: [...item.tools],
    useCases: [...item.useCases],
    signalKeys: [...item.signalKeys],
    keywordSeeds: [...item.keywordSeeds],
    rawPayload: { ...item.rawPayload }
  }));
}
