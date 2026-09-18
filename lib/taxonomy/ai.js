export const AI_MARKET_TOPICS = Object.freeze({
  all: {
    label: "IA - couverture large",
    queries: [
      "intelligence artificielle",
      "IA générative",
      "machine learning",
      "data science"
    ]
  },
  genai: {
    label: "IA générative / LLM",
    queries: [
      "IA générative",
      "LLM",
      "modèle de langage",
      "assistant IA",
      "Copilot"
    ]
  },
  agents: {
    label: "Agents IA / agentic",
    queries: [
      "agent IA",
      "agents intelligents",
      "agentic AI",
      "assistant intelligent",
      "orchestration IA"
    ]
  },
  rag: {
    label: "RAG / recherche augmentée",
    queries: [
      "RAG",
      "retrieval augmented generation",
      "recherche augmentée",
      "base vectorielle",
      "recherche sémantique"
    ]
  },
  governance: {
    label: "Gouvernance / Responsible AI",
    queries: [
      "gouvernance IA",
      "IA responsable",
      "éthique intelligence artificielle",
      "conformité IA",
      "risques IA"
    ]
  },
  ai_act: {
    label: "AI Act",
    queries: [
      "AI Act",
      "règlement intelligence artificielle",
      "mise en conformité IA"
    ]
  },
  data_ml: {
    label: "Data science / ML / MLOps",
    queries: [
      "data science",
      "machine learning",
      "apprentissage automatique",
      "MLOps",
      "modèle prédictif"
    ]
  },
  automation: {
    label: "Automatisation augmentée par IA",
    queries: [
      "automatisation IA",
      "automatisation intelligente",
      "n8n IA",
      "Power Automate IA",
      "workflow intelligent"
    ]
  },
  training: {
    label: "Formation / acculturation IA",
    queries: [
      "formation intelligence artificielle",
      "formation IA",
      "acculturation IA",
      "formation ChatGPT",
      "formation IA générative",
      "sensibilisation IA"
    ]
  }
});

export function topicQueryPlan(topic, customQuery) {
  const preset = AI_MARKET_TOPICS[topic] || AI_MARKET_TOPICS.all;
  const base = customQuery?.trim() ? [customQuery.trim()] : [];
  return [...new Set([...base, ...preset.queries])];
}

const SIGNALS = [
  ["agents", /\b(agent(?:s)?\s+(?:ia|intelligent)|agentic|multi[- ]?agent)\b/i],
  ["rag", /\b(rag|retrieval augmented generation|recherche augment[eé]e|vectoriel(?:le)?)\b/i],
  ["genai", /\b(ia g[eé]n[eé]rative|generative ai|llm|grand mod[eè]le de langage|copilot|chatgpt|claude|gemini|mistral)\b/i],
  ["governance", /\b(gouvernance ia|ia responsable|responsible ai|risques? ia|[eé]thique ia)\b/i],
  ["ai_act", /\b(ai act|r[eè]glement.{0,25}intelligence artificielle|conformit[eé].{0,15}ia)\b/i],
  ["data_ml", /\b(data science|machine learning|apprentissage automatique|mlops|deep learning|nlp|computer vision)\b/i],
  ["automation", /\b(automatisation intelligente|automatisation ia|n8n|power automate|workflow.{0,15}ia)\b/i],
  ["training", /\b(formation.{0,25}(?:ia|intelligence artificielle|chatgpt)|acculturation ia|sensibilisation ia)\b/i]
];

export function classifyAiText(text) {
  const value = String(text || "");
  const tags = [];
  for (const [tag, pattern] of SIGNALS) {
    if (pattern.test(value)) tags.push(tag);
  }
  return {
    isAiRelated: tags.length > 0,
    tags
  };
}
