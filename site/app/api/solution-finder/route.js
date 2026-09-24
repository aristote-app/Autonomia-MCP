import { NextResponse } from "next/server";
import { z } from "zod";
import { aiRoles } from "@/content/ai-roles";
import { academyTrainings } from "@/content/academy-trainings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Input = z.object({
  query: z.string().trim().min(8).max(2500)
});

const ROLE_HINTS = {
  "ai-project-manager": {
    why: "Cadrer le besoin, coordonner les parties prenantes et piloter le passage de l’idée au déploiement.",
    keywords: ["projet", "cadrage", "roadmap", "piloter", "prioriser", "coordination", "déploiement", "transformation"]
  },
  "genai-engineer": {
    why: "Concevoir et intégrer des fonctionnalités fondées sur l’IA générative dans les outils et processus métier.",
    keywords: ["genai", "ia générative", "assistant", "chatbot", "llm", "génération", "openai", "claude", "gemini"]
  },
  "llm-engineer": {
    why: "Fiabiliser le comportement des modèles : contexte, évaluation, prompting système, tool use et qualité.",
    keywords: ["llm", "évaluation", "hallucination", "prompt système", "qualité modèle", "context", "fine tuning"]
  },
  "rag-engineer": {
    why: "Construire une recherche documentaire fiable : ingestion, retrieval, citations, reranking et évaluation.",
    keywords: ["rag", "document", "documents", "pdf", "base documentaire", "recherche interne", "retrieval", "connaissance", "intranet"]
  },
  "ai-agent-engineer": {
    why: "Concevoir des agents capables d’utiliser des outils et d’exécuter un workflow sous contrôle.",
    keywords: ["agent", "agentique", "orchestration", "tool calling", "mcp", "autonome", "workflow agent"]
  },
  "data-scientist": {
    why: "Analyser les données et construire des modèles prédictifs, scores ou expérimentations quantitatives.",
    keywords: ["data science", "prédire", "prévision", "scoring", "statistique", "modèle prédictif", "forecast"]
  },
  "ml-engineer": {
    why: "Transformer un modèle ML en composant logiciel intégré, performant et maintenable.",
    keywords: ["machine learning", "ml engineer", "modèle ml", "serving", "inférence", "pytorch", "tensorflow"]
  },
  "mlops-llmops-engineer": {
    why: "Industrialiser, observer et maintenir les modèles et applications IA en production.",
    keywords: ["mlops", "llmops", "industrialiser", "production", "monitoring", "observabilité", "mlflow", "kubernetes"]
  },
  "ai-product-manager": {
    why: "Transformer un problème utilisateur en produit IA priorisé, testable et mesurable.",
    keywords: ["produit", "product", "fonctionnalité", "mvp", "discovery", "parcours utilisateur", "priorisation"]
  },
  "ai-governance": {
    why: "Définir les règles d’usage, les responsabilités, les risques et le cadre AI Act.",
    keywords: ["ai act", "gouvernance", "conformité", "risque", "charte", "juridique", "responsible ai", "sécurité"]
  },
  "automation-engineer": {
    why: "Automatiser des tâches et processus entre outils, API, messagerie, CRM et logiciels métier.",
    keywords: ["automatiser", "automatisation", "workflow", "n8n", "make", "zapier", "power automate", "crm", "reporting", "compte rendu", "relance", "email", "e-mail", "copier-coller"]
  }
};

const TRAINING_HINTS = {
  "ia-generative-entreprise": {
    why: "Donner aux équipes un socle commun pour utiliser l’IA générative avec méthode et contrôle.",
    keywords: ["ia générative", "genai", "collaborateurs", "acculturation", "adoption", "formation ia"]
  },
  "chatgpt-entreprise": {
    why: "Transformer ChatGPT en méthode de travail réutilisable pour rédiger, synthétiser, analyser et rechercher.",
    keywords: ["chatgpt", "rédaction", "synthèse", "assistant", "prompts chatgpt"]
  },
  "microsoft-copilot-365-ia": {
    why: "Faire adopter Copilot sur les tâches réelles dans Word, Excel, PowerPoint, Outlook et Teams.",
    keywords: ["copilot", "microsoft 365", "teams", "outlook", "word", "excel", "powerpoint"]
  },
  "prompt-engineering-ia": {
    why: "Passer de prompts improvisés à des instructions structurées, testables et partageables.",
    keywords: ["prompt", "prompt engineering", "instruction", "structured output"]
  },
  "agents-ia-entreprise": {
    why: "Apprendre à cadrer, concevoir et superviser des agents IA avec les bons garde-fous.",
    keywords: ["agent ia", "agents ia", "agentique", "tool calling", "supervision agent"]
  },
  "automatisation-ia": {
    why: "Rendre les équipes capables d’identifier et construire des automatisations IA utiles.",
    keywords: ["automatiser", "automatisation", "workflow", "n8n", "make", "tâche répétitive"]
  },
  "ia-dirigeants-managers": {
    why: "Donner aux dirigeants et managers les repères pour décider, prioriser et encadrer les usages IA.",
    keywords: ["dirigeant", "direction", "manager", "comex", "management"]
  },
  "ia-chefs-projet": {
    why: "Apprendre à cadrer et piloter un projet IA de l’opportunité au déploiement.",
    keywords: ["chef de projet", "project manager", "piloter projet", "cadrage projet"]
  },
  "ia-marketing-communication": {
    why: "Appliquer l’IA aux workflows marketing et communication avec contrôle de la qualité.",
    keywords: ["marketing", "communication", "contenu", "campagne", "seo", "réseaux sociaux"]
  },
  "ia-commerciaux-b2b": {
    why: "Appliquer l’IA à la prospection, la qualification, la préparation et le suivi commercial.",
    keywords: ["commercial", "vente", "prospection", "lead", "leads", "crm", "qualification"]
  },
  "ia-ressources-humaines": {
    why: "Appliquer l’IA aux processus RH en gardant la validation humaine et le cadre de confidentialité.",
    keywords: ["rh", "ressources humaines", "recrutement", "onboarding", "formation rh"]
  },
  "ia-finance-comptabilite": {
    why: "Utiliser l’IA pour analyser, documenter et accélérer les tâches finance/comptabilité.",
    keywords: ["finance", "comptabilité", "comptable", "facture", "budget"]
  },
  "ia-relation-client-support": {
    why: "Structurer l’usage de l’IA pour répondre, router et assister les équipes de support.",
    keywords: ["support", "relation client", "service client", "ticket", "questions récurrentes"]
  },
  "creation-contenu-ia": {
    why: "Créer et contrôler des contenus multimodaux avec une méthode de production réutilisable.",
    keywords: ["création contenu", "image", "vidéo", "audio", "contenu"]
  },
  "analyse-donnees-reporting-ia": {
    why: "Accélérer l’analyse, la consolidation et le commentaire de données et reportings.",
    keywords: ["reporting", "tableau", "données", "analyse données", "kpi", "consolidation"]
  },
  "gouvernance-ia-ai-act": {
    why: "Transformer l’AI Act et la gouvernance en règles opérationnelles compréhensibles par les équipes.",
    keywords: ["ai act", "gouvernance", "conformité", "responsable", "risque ia"]
  },
  "ia-responsable-securite": {
    why: "Cadrer les risques de sécurité, données et accès liés aux usages d’IA.",
    keywords: ["sécurité", "rssI", "cybersécurité", "données sensibles", "permissions"]
  },
  "llm-rag-agents-ia": {
    why: "Approfondir l’architecture LLM, RAG et agents pour des profils techniques.",
    keywords: ["llm", "rag", "agents", "langchain", "langgraph", "architecture ia"]
  },
  "rag-recherche-documentaire-ia": {
    why: "Comprendre et construire des assistants documentaires fondés sur le RAG et la recherche.",
    keywords: ["rag", "recherche documentaire", "assistant documentaire", "documents internes", "base documentaire"]
  },
  "product-management-ia": {
    why: "Apprendre à concevoir, prioriser et évaluer des fonctionnalités IA du point de vue produit.",
    keywords: ["product", "produit ia", "product manager", "mvp", "discovery"]
  }
};

const ROLE_TRAINING_FALLBACK = {
  "ai-project-manager": "ia-chefs-projet",
  "genai-engineer": "ia-generative-entreprise",
  "llm-engineer": "llm-rag-agents-ia",
  "rag-engineer": "rag-recherche-documentaire-ia",
  "ai-agent-engineer": "agents-ia-entreprise",
  "data-scientist": "analyse-donnees-reporting-ia",
  "ml-engineer": "llm-rag-agents-ia",
  "mlops-llmops-engineer": "llm-rag-agents-ia",
  "ai-product-manager": "product-management-ia",
  "ai-governance": "gouvernance-ia-ai-act",
  "automation-engineer": "automatisation-ia"
};

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function scoreHints(query, hints) {
  const haystack = normalize(query);
  return Object.entries(hints)
    .map(([id, item]) => {
      const score = item.keywords.reduce((total, keyword) => {
        const token = normalize(keyword);
        if (!haystack.includes(token)) return total;
        return total + Math.max(1, token.split(/\s+/).length);
      }, 0);
      return { id, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function existsRole(id) {
  return aiRoles.some((role) => role.slug === id) && Boolean(ROLE_HINTS[id]);
}

function existsTraining(id) {
  return academyTrainings.some((training) => training.slug === id) && Boolean(TRAINING_HINTS[id]);
}

function fallbackClassification(query) {
  const roleScores = scoreHints(query, ROLE_HINTS);
  const trainingScores = scoreHints(query, TRAINING_HINTS);
  const text = normalize(query);

  const trainingIntent = [
    "former", "formation", "monter en competence", "montee en competence", "apprendre",
    "equipes", "collaborateurs", "managers", "adoption", "sensibiliser"
  ].some((token) => text.includes(token));

  const executionIntent = [
    "automatis", "construire", "creer", "developper", "integrer", "deployer", "assistant",
    "agent", "workflow", "rag", "reporting", "qualification", "processus"
  ].some((token) => text.includes(token));

  const roleIds = (roleScores.length ? roleScores : [{ id: "ai-project-manager", score: 1 }])
    .slice(0, 1)
    .map((item) => item.id)
    .filter(existsRole);

  let trainingIds = trainingScores.slice(0, 1).map((item) => item.id).filter(existsTraining);
  if (trainingIntent && !trainingIds.length) trainingIds = ["ia-generative-entreprise"];

  let route = "experts";
  if (trainingIntent && !executionIntent) route = "academy";
  else if (trainingIds.length && roleIds.length) route = "hybrid";

  if (route !== "academy" && !trainingIds.length && roleIds[0]) {
    const companionTraining = ROLE_TRAINING_FALLBACK[roleIds[0]];
    if (companionTraining && existsTraining(companionTraining)) {
      trainingIds = [companionTraining];
      route = "hybrid";
    }
  }

  if (route === "academy") {
    return {
      summary: "Votre demande relève principalement d’une montée en compétences à relier aux tâches, outils et règles réelles de vos équipes.",
      route,
      role_ids: [],
      training_ids: trainingIds.length ? trainingIds : ["ia-generative-entreprise"]
    };
  }

  const firstRole = aiRoles.find((role) => role.slug === roleIds[0]);
  return {
    summary: route === "hybrid"
      ? "Votre besoin combine une capacité d’exécution immédiate et des compétences à transférer durablement dans l’organisation."
      : `Votre demande peut être traduite en mission opérationnelle, avec ${firstRole?.title || "une expertise IA ciblée"} comme premier métier à examiner.`,
    route,
    role_ids: roleIds,
    training_ids: trainingIds
  };
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

  const allowedRoles = aiRoles.map((role) => role.slug).filter(existsRole);
  const allowedTrainings = academyTrainings.map((training) => training.slug).filter(existsTraining);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const instructions = [
    "Tu es le routeur commercial d'Autonomia, AI Execution Partner B2B.",
    "Analyse le problème exprimé, sans inventer d'offre ni de profil.",
    "Choisis uniquement des identifiants présents dans les catalogues autorisés.",
    "Experts = besoin d'exécution, build, cadrage, expertise ou delivery.",
    "Academy = besoin de montée en compétences, adoption ou transfert.",
    "Hybrid = les deux sont utiles.",
    "Retourne UNIQUEMENT du JSON valide, sans markdown.",
    "0 à 1 role_id et 0 à 1 training_id. Priorise la recommandation la plus directement utile.",
    "Si le besoin expert est ambigu, utilise ai-project-manager plutôt que d'inventer un métier.",
    "Le summary doit être en français, concret, en 1 à 3 phrases, sans promesse de résultat.",
    `role_ids autorisés: ${allowedRoles.join(", ")}`,
    `training_ids autorisés: ${allowedTrainings.join(", ")}`,
    'Format JSON: {"summary":"...","route":"experts|academy|hybrid","role_ids":["..."],"training_ids":["..."]}'
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
    const rawText = extractResponseText(payload)
      .trim()
      .replace(/^\`\`\`json\s*/i, "")
      .replace(/\`\`\`$/i, "")
      .trim();
    const parsed = JSON.parse(rawText);

    const roleIds = Array.isArray(parsed.role_ids)
      ? parsed.role_ids.filter(existsRole).slice(0, 1)
      : [];
    const trainingIds = Array.isArray(parsed.training_ids)
      ? parsed.training_ids.filter(existsTraining).slice(0, 1)
      : [];
    const route = ["experts", "academy", "hybrid"].includes(parsed.route)
      ? parsed.route
      : (roleIds.length && trainingIds.length ? "hybrid" : trainingIds.length ? "academy" : "experts");

    if (!roleIds.length && !trainingIds.length) return null;

    return {
      summary: String(parsed.summary || "").trim().slice(0, 800) || fallbackClassification(query).summary,
      route,
      role_ids: roleIds,
      training_ids: trainingIds
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
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
  const aiClassification = await classifyWithOpenAI(query);
  let classification = aiClassification || fallbackClassification(query);

  if (
    classification.route !== "academy" &&
    classification.role_ids?.[0] &&
    !classification.training_ids?.length
  ) {
    const companionTraining = ROLE_TRAINING_FALLBACK[classification.role_ids[0]];
    if (companionTraining && existsTraining(companionTraining)) {
      classification = {
        ...classification,
        route: "hybrid",
        training_ids: [companionTraining]
      };
    }
  }

  const roles = classification.role_ids.map((id) => {
    const role = aiRoles.find((item) => item.slug === id);
    const hint = ROLE_HINTS[id];
    return {
      id,
      label: role?.title || id,
      french_title: role?.frenchTitle || null,
      slug: id,
      why: hint.why
    };
  });

  const trainings = classification.training_ids
    .map((id) => {
      const training = academyTrainings.find((item) => item.slug === id);
      const hint = TRAINING_HINTS[id];
      if (!training || !hint) return null;
      return {
        id,
        slug: training.slug,
        title: training.title,
        subtitle: training.subtitle,
        why: hint.why,
        standard_days: training.standardDays || null
      };
    })
    .filter(Boolean);

  let summary = classification.summary;

  if (!aiClassification) {
    const roleName = roles[0]?.french_title || roles[0]?.label || null;
    const trainingName = trainings[0]?.title || null;

    if (roleName && trainingName) {
      summary = `Pour ce besoin, le métier à mobiliser en priorité est ${roleName}. En complément, la formation « ${trainingName} » permet de transférer la méthode et les usages aux équipes concernées.`;
    } else if (roleName) {
      summary = `Pour ce besoin, le métier à mobiliser en priorité est ${roleName}. Un échange de cadrage permettra ensuite de préciser le périmètre de la mission.`;
    } else if (trainingName) {
      summary = `Votre demande relève d’abord d’une montée en compétences. La formation « ${trainingName} » est le parcours Autonomia le plus directement lié au besoin exprimé.`;
    }
  }

  return NextResponse.json(
    {
      ok: true,
      query,
      summary,
      route: classification.route,
      roles,
      trainings,
      engine: aiClassification ? "openai" : "catalog",
      generated_at: new Date().toISOString()
    },
    { headers: { "cache-control": "no-store" } }
  );
}
