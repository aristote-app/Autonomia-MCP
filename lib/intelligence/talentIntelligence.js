import { discoverTalentCandidates } from "../collectors/talentHunter.js";
import {
  getConsultantDiscoverySummary,
  upsertDiscoveredConsultantCandidates
} from "../db/consultants.js";

export const TALENT_INTELLIGENCE_TARGET = 350;

export const TALENT_INTELLIGENCE_FAMILIES = Object.freeze([
  { id: "genai-engineer", cluster: "GenAI", query: "AI Engineer GenAI LLM RAG Python" },
  { id: "agentic", cluster: "Agentic AI", query: "Agentic AI LangGraph agents MCP Python" },
  { id: "ai-architect", cluster: "Architecture", query: "AI Architect GenAI Azure AWS LLM" },
  { id: "rag", cluster: "RAG", query: "RAG LLM Engineer vector database Python" },
  { id: "data-science", cluster: "Data / ML", query: "Data Scientist Machine Learning IA Python freelance" },
  { id: "data-engineering", cluster: "Data Engineering", query: "Data Engineer Python Spark IA freelance" },
  { id: "mlops", cluster: "MLOps", query: "MLOps LLMOps Docker Kubernetes AI freelance" },
  { id: "ai-product", cluster: "Product", query: "AI Product Manager Product Owner IA freelance" },
  { id: "ai-project", cluster: "Gestion de projet", query: "Chef de projet IA AI Project Manager freelance" },
  { id: "transformation", cluster: "Transformation", query: "Consultant transformation IA stratégie adoption freelance" },
  { id: "automation", cluster: "Automatisation", query: "Automatisation IA n8n Make Power Automate freelance" },
  { id: "copilot", cluster: "Copilot", query: "Consultant Microsoft Copilot Copilot Studio freelance" },
  { id: "training", cluster: "Formation", query: "Formateur IA ChatGPT Copilot entreprise freelance" },
  { id: "change", cluster: "Adoption", query: "Consultant adoption IA conduite du changement freelance" },
  { id: "governance", cluster: "Gouvernance", query: "Consultant AI Act gouvernance IA RGPD freelance" },
  { id: "prompt", cluster: "Prompt / LLM", query: "Prompt Engineer LLM GenAI freelance France" },
  { id: "nocode", cluster: "No-code", query: "Consultant no-code IA Make n8n Airtable freelance" },
  { id: "ai-strategy", cluster: "Stratégie", query: "Consultant stratégie intelligence artificielle GenAI freelance" }
]);

function dayIndex(date = new Date()) {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return Math.floor(utc.getTime() / 86400000);
}

export function selectTalentFamilies({
  date = new Date(),
  batchSize = 4,
  families = TALENT_INTELLIGENCE_FAMILIES,
  rotationOffset = 0
} = {}) {
  const size = Math.min(Math.max(Number(batchSize) || 4, 1), families.length);
  const offset = Math.max(Number(rotationOffset) || 0, 0);
  const start = ((dayIndex(date) * size) + offset) % families.length;
  const out = [];

  for (let i = 0; i < size; i += 1) {
    out.push(families[(start + i) % families.length]);
  }

  return out;
}

function dedupeCandidates(candidates = []) {
  const byUrl = new Map();

  for (const candidate of candidates || []) {
    const key = String(candidate.profile_url || "").trim().toLowerCase().replace(/\/$/, "");
    if (!key) continue;

    const current = byUrl.get(key);
    if (!current || Number(candidate.relevance_score || 0) > Number(current.relevance_score || 0)) {
      byUrl.set(key, candidate);
    }
  }

  return [...byUrl.values()].sort(
    (a, b) => Number(b.relevance_score || 0) - Number(a.relevance_score || 0)
  );
}

export async function runTalentIntelligenceBatch({
  date = new Date(),
  targetCandidates = TALENT_INTELLIGENCE_TARGET,
  batchSize = 4,
  countPerSource = 20,
  maxPages = 2,
  maxPersist = 120,
  sources = ["malt", "freelance_com", "linkedin", "collective_work"],
  actorUserId = null,
  rotationOffset = 0
} = {}) {
  const before = await getConsultantDiscoverySummary();
  const usableBefore = Number(before.usable_discovered || 0);

  if (usableBefore >= targetCandidates) {
    return {
      skipped: true,
      reason: "target_reached",
      target: targetCandidates,
      before,
      after: before,
      families: [],
      searches: [],
      found: 0,
      created: 0,
      updated: 0
    };
  }

  const families = selectTalentFamilies({
    date,
    batchSize,
    rotationOffset: usableBefore + Math.max(Number(rotationOffset) || 0, 0)
  });
  const found = [];
  const searches = [];

  for (const family of families) {
    const result = await discoverTalentCandidates({
      query: family.query,
      sources,
      countPerSource,
      maxPages,
      maxCandidates: Math.min(maxPersist, 200)
    });

    searches.push(
      ...(result.searches || []).map((search) => ({
        ...search,
        family_id: family.id,
        cluster: family.cluster
      }))
    );

    found.push(
      ...(result.candidates || []).map((candidate) => ({
        ...candidate,
        talent_family: family.id,
        talent_cluster: family.cluster
      }))
    );
  }

  const deduped = dedupeCandidates(found);
  const remaining = Math.max(0, targetCandidates - usableBefore);
  const selected = deduped.slice(0, Math.min(maxPersist, remaining));

  const persisted = await upsertDiscoveredConsultantCandidates(selected, {
    actorUserId
  });

  const after = await getConsultantDiscoverySummary();

  return {
    skipped: false,
    target: targetCandidates,
    before,
    after,
    families,
    searches,
    found: deduped.length,
    selected: selected.length,
    created: persisted.created,
    updated: persisted.updated,
    active_preserved: persisted.active_preserved,
    rejected_preserved: persisted.rejected_preserved || 0,
    skill_links: persisted.skill_links,
    cache_hits: searches.filter((item) => item.cache_hit).length,
    search_calls: searches.length
  };
}
