import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Input = z.object({
  query: z.string().trim().min(8).max(2500)
});

const ROLE_CATALOG = {
  "ai-project-manager": {
    label: "AI Project Manager",
    slug: "ai-project-manager",
    role: "ai-project-manager",
    why: "Piloter le cadrage, les arbitrages, les dépendances et le passage à l’exécution.",
    keywords: ["projet", "roadmap", "piloter", "coordination", "prioriser", "cadrage", "direction", "déploiement"]
  },
  "genai-engineer": {
    label: "GenAI / LLM Engineer",
    slug: "genai-engineer",
    role: "genai-engineer",
    why: "Concevoir et intégrer des fonctionnalités fondées sur les modèles génératifs.",
    keywords: ["llm", "genai", "generative", "chatbot", "assistant", "openai", "anthropic", "modèle", "ia générative"]
  },
  "rag-engineer": {
    label: "RAG Engineer",
    slug: "rag-engineer",
    role: "rag-engineer",
    why: "Structurer l’ingestion documentaire, le retrieval, les citations et l’évaluation des réponses.",
    keywords: ["rag", "document", "documents", "base documentaire", "connaissance", "recherche", "retrieval", "pdf", "intranet", "assistant documentaire"]
  },
  "ai-agent-engineer": {
    label: "AI Agent Engineer",
    slug: "ai-agent-engineer",
    role: "ai-agent-engineer",
    why: "Construire des workflows agentiques avec outils, permissions, contrôles et supervision humaine.",
    keywords: ["agent", "agentique", "workflow", "orchestration", "tool", "mcp", "autonome", "actions"]
  },
  "automation-engineer": {
    label: "Automation / AI Engineer",
    slug: "automation-engineer",
    role: "automation-engineer",
    why: "Automatiser des processus entre outils, API, messagerie, CRM et applications métier.",
    keywords: ["automatiser", "automatisation", "n8n", "make", "zapier", "power automate", "crm", "reporting", "compte rendu", "relance", "email", "mail"]
  },
  "ai-product-manager": {
    label: "AI Product Manager",
    slug: "ai-product-manager",
    role: "ai-product-manager",
    why: "Transformer un besoin utilisateur en produit IA priorisé, testable et mesurable.",
    keywords: ["produit", "product", "fonctionnalité", "utilisateur", "discovery", "mvp", "roadmap produit"]
  },
  "ai-governance": {
    label: "AI Governance Consultant",
    slug: "ai-governance",
    role: "ai-governance",
    why: "Cadrer les règles d’usage, les risques, les responsabilités et l’AI Act.",
    keywords: ["ai act", "gouvernance", "conformité", "risque", "responsable", "charte", "juridique", "sécurité"]
  },
  "data-scientist": {
    label: "Data Scientist",
    slug: "data-scientist",
    role: "data-scientist",
    why: "Modéliser, expérimenter et exploiter les données pour des cas d’usage prédictifs ou analytiques.",
    keywords: ["data science", "prédire", "prediction", "scoring", "forecast", "prévision", "statistique"]
  },
  "mlops-llmops-engineer": {
    label: "MLOps / LLMOps Engineer",
    slug: "mlops-llmops-engineer",
    role: "mlops-llmops-engineer",
    why: "Industrialiser, observer et maintenir les modèles et applications IA en production.",
    keywords: ["mlops", "llmops", "production", "industrialiser", "observabilité", "monitoring", "kubernetes", "mlflow"]
  }
};

const TRAINING_CATALOG = {
  "ia-entreprise": {
    title: "Formation IA en entreprise",
    slug: "ia-generative-entreprise",
    why: "Construire un socle de compétences adapté aux populations, usages et règles de l’organisation.",
    keywords: ["formation", "former", "équipes", "collaborateurs", "compétences", "acculturation", "adoption"]
  },
  "chatgpt": {
    title: "ChatGPT en entreprise",
    slug: "chatgpt-entreprise",
    why: "Transformer l’usage spontané de ChatGPT en méthodes de travail vérifiables et réutilisables.",
    keywords: ["chatgpt", "prompt", "rédaction", "synthèse", "assistant"]
  },
  "copilot": {
    title: "Microsoft Copilot",
    slug: "microsoft-copilot-365-ia",
    why: "Faire adopter Copilot sur les tâches réelles dans l’environnement Microsoft 365.",
    keywords: ["copilot", "microsoft 365", "teams", "outlook", "excel", "word", "powerpoint"]
  },
  "ia-generative": {
    title: "IA générative",
    slug: "ia-generative-entreprise",
    why: "Donner un cadre opérationnel commun pour utiliser les modèles génératifs dans les métiers.",
    keywords: ["ia générative", "genai", "llm", "générative", "generative"]
  },
  "ai-act": {
    title: "AI Act & gouvernance IA",
    slug: "gouvernance-ia-ai-act",
    why: "Rendre les règles, responsabilités et pratiques de gouvernance compréhensibles et actionnables.",
    keywords: ["ai act", "gouvernance", "conformité", "risque", "réglementation", "responsable"]
  },
  "agents-ia": {
    title: "Agents IA",
    slug: "agents-ia-entreprise",
    why: "Comprendre, concevoir et superviser des workflows agentiques avec des garde-fous.",
    keywords: ["agent", "agentique", "automatisation", "workflow", "supervision"]
  },
  "prompt-engineering": {
    title: "Prompt engineering",
    slug: "prompt-engineering-ia",
    why: "Structurer les demandes, les formats et les critères de qualité pour rendre les usages reproductibles.",
    keywords: ["prompt", "instruction", "chatgpt", "méthode", "réutilisable"]
  }
};

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function scoreCatalog(query, catalog) {
  const haystack = normalize(query);
  return Object.entries(catalog)
    .map(([id, item]) => {
      const score = item.keywords.reduce((total, keyword) => (
        haystack.includes(normalize(keyword)) ? total + Math.max(1, normalize(keyword).split(" ").length) : total
      ), 0);
      return { id, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function fallbackClassification(query) {
  const roleScores = scoreCatalog(query, ROLE_CATALOG);
  const trainingScores = scoreCatalog(query, TRAINING_CATALOG);
  const normalized = normalize(query);

  const trainingIntent = [
    "formation", "former", "monter en competence", "collaborateur", "equipe", "manager",
    "adoption", "sensibilis", "academy"
  ].some((term) => normalized.includes(term));

  const roleIds = (roleScores.length ? roleScores : [{ id: "ai-project-manager", score: 1 }])
    .slice(0, 3)
    .map((item) => item.id);

  let trainingIds = trainingScores.slice(0, 3).map((item) => item.id);
  if (trainingIntent && !trainingIds.length) trainingIds = ["ia-entreprise"];

  const route = trainingIntent
    ? (roleScores.length ? "hybrid" : "academy")
    : "experts";

  const firstRole = ROLE_CATALOG[roleIds[0]];
  const summary = route === "academy"
    ? "Votre demande relève principalement d’une montée en compétences à relier aux tâches et aux usages réels de vos équipes."
    : route === "hybrid"
      ? "Votre besoin combine une capacité d’exécution immédiate et des compétences à transférer durablement dans l’organisation."
      : `Votre demande peut être traduite en mission opérationnelle, avec ${firstRole?.label || "une expertise IA ciblée"} comme premier rôle à examiner.`;

  return { summary, route, role_ids: roleIds, training_ids: trainingIds };
}

function extractResponseText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

async function classifyWithOpenAI(query) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const roleIds = Object.keys(ROLE_CATALOG);
  const trainingIds = Object.keys(TRAINING_CATALOG);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const instructions = [
    "You route B2B AI needs for Autonomia, an AI execution partner.",
    "Return ONLY valid JSON, no markdown.",
    "Never invent an offer. Select only IDs from the provided catalogs.",
    "Choose experts, Academy, or hybrid according to the need.",
    "Use 0 to 3 role_ids and 0 to 3 training_ids.",
    "If the request is ambiguous, include ai-project-manager rather than inventing a role.",
    "Write summary in French, concise and operational.",
    `Allowed role_ids: ${roleIds.join(", ")}.`,
    `Allowed training_ids: ${trainingIds.join(", ")}.`,
    'JSON shape: {"summary":"...","route":"experts|academy|hybrid","role_ids":["..."],"training_ids":["..."]}'
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_SOLUTION_MODEL || "gpt-5.6-luna",
        instructions,
        input: query,
        max_output_tokens: 500
      }),
      signal: controller.signal
    });

    if (!response.ok) return null;
    const payload = await response.json();
    const raw = extractResponseText(payload).trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "").trim();
    const parsed = JSON.parse(raw);

    const role_ids = Array.isArray(parsed.role_ids)
      ? parsed.role_ids.filter((id) => ROLE_CATALOG[id]).slice(0, 3)
      : [];
    const training_ids = Array.isArray(parsed.training_ids)
      ? parsed.training_ids.filter((id) => TRAINING_CATALOG[id]).slice(0, 3)
      : [];
    const route = ["experts", "academy", "hybrid"].includes(parsed.route) ? parsed.route : "hybrid";

    if (!role_ids.length && !training_ids.length) return null;

    return {
      summary: String(parsed.summary || "").trim().slice(0, 700) || fallbackClassification(query).summary,
      route,
      role_ids,
      training_ids
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadExperts(role) {
  const base = (process.env.AUTONOMIA_COCKPIT_PUBLIC_URL || "https://cockpit.build-autonomia.com").replace(/\/$/, "");

  try {
    const response = await fetch(
      `${base}/api/public/consultants?role=${encodeURIComponent(role)}&limit=3`,
      { cache: "no-store" }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.profiles) ? data.profiles.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export async function POST(request) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Input.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 422 });
  }

  const query = parsed.data.query;
  const ai = await classifyWithOpenAI(query);
  const classification = ai || fallbackClassification(query);

  const roles = await Promise.all(
    classification.role_ids.map(async (id) => {
      const item = ROLE_CATALOG[id];
      return {
        id,
        label: item.label,
        slug: item.slug,
        role: item.role,
        why: item.why,
        experts: await loadExperts(item.role)
      };
    })
  );

  const trainings = classification.training_ids
    .map((id) => {
      const item = TRAINING_CATALOG[id];
      return item ? { id, title: item.title, slug: item.slug, why: item.why } : null;
    })
    .filter(Boolean);

  return NextResponse.json(
    {
      ok: true,
      query,
      summary: classification.summary,
      route: classification.route,
      roles,
      trainings,
      engine: ai ? "openai" : "catalog",
      generated_at: new Date().toISOString()
    },
    { headers: { "cache-control": "no-store" } }
  );
}
