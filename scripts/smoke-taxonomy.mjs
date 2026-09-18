import { AI_MARKET_TOPICS, classifyAiText, topicQueryPlan } from "../lib/taxonomy/ai.js";

function assert(value, message) {
  if (!value) throw new Error(message);
}

const agents = topicQueryPlan("agents");
assert(agents.includes("agent IA"), "agents query plan missing agent IA");

const rag = classifyAiText("Déploiement d'une architecture RAG avec base vectorielle et LLM.");
assert(rag.isAiRelated, "RAG text not classified as AI");
assert(rag.tags.includes("rag"), "RAG tag missing");
assert(rag.tags.includes("genai"), "GenAI tag missing");

const training = classifyAiText("Acculturation IA et formation ChatGPT des agents.");
assert(training.tags.includes("training"), "Training tag missing");

console.log("AI TAXONOMY", {
  topics: Object.keys(AI_MARKET_TOPICS),
  agentsQueries: agents,
  rag
});
