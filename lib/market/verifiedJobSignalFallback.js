export const VERIFIED_JOB_SIGNAL_FALLBACK = [
  {
    sourceId: "linkedin",
    sourceRecordId: "4469956925",
    title: "Senior AI Engineer / ingénieur informatique IA (IT) / Freelance",
    companyName: "Free-Work",
    location: "Paris",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.linkedin.com/jobs/view/senior-ai-engineer-ing%C3%A9nieur-informatique-ia-it-freelance-at-free-work-4469956925",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T20:45:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "RAG", "Agentic AI", "gouvernance IA"],
    tools: [],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["AI Engineer", "GenAI", "RAG", "Agentic AI", "gouvernance IA"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note:
        "Public LinkedIn Jobs page observed open on 2026-09-22; listing showed a freelance Senior AI Engineer role in Paris."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "1aca39d46ad89084",
    title: "Agentic AI Engineer (IT) / Freelance",
    companyName: "Cherry Pick",
    location: "Paris (75)",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=1aca39d46ad89084",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T20:45:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Agentic AI", "Generative AI", "automatisation"],
    tools: [],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["Agentic AI", "AI Engineer", "Generative AI", "automatisation"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note:
        "Public Indeed job page observed on 2026-09-22; independent/freelance contract in Paris."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "7fa8053623dd2c66",
    title: "Senior AI Engineer Azure / GenAI / Copilot - Freelance (H/F) (IT) / Freelance",
    companyName: "LeHibou",
    location: "Paris (75)",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=7fa8053623dd2c66",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T20:45:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "Agents IA", "Copilot", "MLOps"],
    tools: ["Azure"],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["AI Engineer", "Azure", "GenAI", "Copilot", "Agents IA"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note:
        "Public Indeed job page observed in September 2026; independent/freelance contract in Paris."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "8d0af1e0cc961e03",
    title: "Senior AI Engineer / Ingénieur IA (IT) / Freelance",
    companyName: "Phaidon London - Glocomms",
    location: "Paris (75)",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=8d0af1e0cc961e03",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T20:45:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "RAG", "Agents IA", "gouvernance IA", "automatisation"],
    tools: [],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["AI Engineer", "GenAI", "RAG", "Agents IA", "gouvernance IA"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note:
        "Public Indeed job page observed in September 2026; independent/freelance contract in Paris."
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
