export const VERIFIED_JOB_SIGNAL_FALLBACK = [
  {
    sourceId: "linkedin",
    sourceRecordId: "4466980987",
    title: "Candidature spontanée - AI Engineer Freelance – GenAI & LLM Production Architect",
    companyName: "ECARIS",
    location: "Île-de-France, France",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.linkedin.com/jobs/view/candidature-spontan%C3%A9e-ai-engineer-freelance-%E2%80%93-genai-llm-production-architect-at-ecaris-4466980987",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T21:05:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "LLM", "RAG", "Agentic AI"],
    tools: [],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["AI Engineer", "GenAI", "LLM", "RAG", "Agentic AI"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note: "Public LinkedIn Jobs page observed open on 2026-09-22."
    }
  },
  {
    sourceId: "linkedin",
    sourceRecordId: "4466903400",
    title: "ingénieur informatique Plateforme Linux & IA Infrastructure (IT) / Freelance",
    companyName: "Free-Work",
    location: "Saint-Denis",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.linkedin.com/jobs/view/ing%C3%A9nieur-informatique-plateforme-linux-ia-infrastructure-it-freelance-at-free-work-4466903400",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T21:05:00.000Z",
    roles: ["AI Engineer"],
    skills: ["IA", "Infrastructure", "Automatisation"],
    tools: ["Linux"],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["IA", "Linux", "Infrastructure", "Automatisation"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note: "Public LinkedIn Jobs page observed open on 2026-09-22."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "a4ae051078329f88",
    title: "Senior AI Platform Engineer (IT) / Freelance",
    companyName: "Comet",
    location: "Paris (75)",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=a4ae051078329f88",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T21:05:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Generative AI", "Agents IA", "MLOps", "Cloud"],
    tools: ["AWS", "GCP", "Terraform", "Docker", "Kubernetes", "MLflow", "Airflow"],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["AI Platform Engineer", "GenAI", "Agents IA", "MLOps", "Cloud"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note: "Public Indeed page observed on 2026-09-22; independent/freelance contract."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "b59e10c98a661003",
    title: "Architecte / Ingénieur IA – R&D (Agentic AI) H/F (IT) / Freelance",
    companyName: "E2E Delivery",
    location: "Paris (75)",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=b59e10c98a661003",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T21:05:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Agentic AI", "Generative AI", "LLM", "RAG", "gouvernance IA"],
    tools: ["Python"],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["Agentic AI", "LLM", "RAG", "Python", "gouvernance IA"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note: "Public Indeed page observed on 2026-09-22; independent/freelance contract."
    }
  },
  {
    sourceId: "indeed",
    sourceRecordId: "d197e51808b6ce58",
    title: "Consultant Développeur IA Data (H/F) (IT) / Freelance",
    companyName: "ODHCOM - FREELANCEREPUBLIK",
    location: "Saint-Ouen (93)",
    contractType: "Freelance / indépendant",
    sourceUrl: "https://fr.indeed.com/viewjob?jk=d197e51808b6ce58",
    publishedAt: null,
    sourceUpdatedAt: "2026-09-22T21:05:00.000Z",
    roles: ["AI Engineer"],
    skills: ["Agentic AI", "Multimodal AI", "Generative AI", "Data"],
    tools: ["GCP", "Vertex AI"],
    useCases: [],
    signalKeys: ["freelance"],
    keywordSeeds: ["IA", "Agentic AI", "GCP", "Vertex AI", "Multimodal AI"],
    rawPayload: {
      discovery: "verified_public_fallback",
      verified_on: "2026-09-22",
      evidence_note: "Public Indeed page observed on 2026-09-22; independent/freelance contract."
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
