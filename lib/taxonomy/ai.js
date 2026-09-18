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
  ["rag", /(?:\brag\b|retrieval augmented generation|recherche augment[eé]e|base vectorielle|recherche s[eé]mantique)/i],
  ["genai", /(?:ia g[eé]n[eé]rative|intelligence artificielle g[eé]n[eé]rative|generative ai|\bllm\b|mod[eè]les? de langage|\bcopilot\b|\bchatgpt\b|\bclaude\b|\bgemini\b|\bmistral\b)/i],
  ["governance", /(?:gouvernance.{0,20}(?:\bia\b|intelligence artificielle)|ia responsable|responsible ai|risques?.{0,20}(?:\bia\b|intelligence artificielle)|[eé]thique.{0,20}(?:\bia\b|intelligence artificielle))/i],
  ["ai_act", /(?:\bai act\b|\bria\b|r[eè]glement.{0,40}intelligence artificielle|conformit[eé].{0,30}(?:\bia\b|intelligence artificielle))/i],
  ["data_ml", /(?:data science|machine learning|apprentissage automatique|\bmlops\b|deep learning|\bnlp\b|computer vision|vision par ordinateur)/i],
  ["automation", /(?:automatisation intelligente|automatisation.{0,25}(?:\bia\b|intelligence artificielle)|\bn8n\b|power automate|workflow.{0,25}(?:\bia\b|intelligence artificielle))/i],
  ["training", /(?:\bformation\b.{0,50}(?:\bia\b|intelligence artificielle|chatgpt|copilot|ia g[eé]n[eé]rative)|\bacculturation\b.{0,30}(?:\bia\b|intelligence artificielle)|\bsensibilisation\b.{0,30}(?:\bia\b|intelligence artificielle))/i]
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
