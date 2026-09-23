import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES = {
  "ai-project-manager": {
    name: "AI Project Manager",
    href: "/ai-project-manager",
    keywords: ["projet", "pilotage", "roadmap", "coordination", "stakeholder", "delivery", "programme", "cadrage"]
  },
  "genai-engineer": {
    name: "GenAI Engineer",
    href: "/consultant-genai",
    keywords: ["genai", "ia generative", "llm", "assistant", "chatbot", "openai", "modele", "prompt"]
  },
  "rag-engineer": {
    name: "RAG Engineer",
    href: "/consultant-rag",
    keywords: ["rag", "document", "documents", "base documentaire", "recherche interne", "retrieval", "knowledge", "connaissance"]
  },
  "ai-agent-engineer": {
    name: "AI Agent Engineer",
    href: "/consultant-agent-ia",
    keywords: ["agent", "agentique", "workflow", "orchestration", "outil", "tools", "mcp", "autonome"]
  },
  "automation-engineer": {
    name: "Automation / AI Automation Engineer",
    href: "/expert-ia",
    keywords: ["automatiser", "automatisation", "n8n", "make", "zapier", "power automate", "reporting", "compte rendu", "email", "crm", "processus"]
  },
  "ai-product-manager": {
    name: "AI Product Manager",
    href: "/expert-ia",
    keywords: ["produit", "product", "priorisation", "discovery", "fonctionnalite", "roadmap", "cas d usage"]
  },
  "ai-governance": {
    name: "AI Governance Consultant",
    href: "/expert-ia",
    keywords: ["ai act", "gouvernance", "conformite", "risque", "responsible ai", "juridique", "securite", "reglementaire"]
  }
};

const TRAININGS = {
  "formation-ia-entreprise": {
    name: "Formation IA en entreprise",
    href: "/formation-ia-entreprise",
    keywords: ["former", "formation", "equipes", "collaborateurs", "adoption", "montee en competences"]
  },
  "formation-chatgpt-entreprise": {
    name: "ChatGPT en entreprise",
    href: "/formation-chatgpt-entreprise",
    keywords: ["chatgpt", "ia generative", "redaction", "synthese", "recherche", "assistants"]
  },
  "formation-copilot": {
    name: "Microsoft Copilot",
    href: "/formation-copilot",
    keywords: ["copilot", "microsoft 365", "teams", "outlook", "word", "excel", "powerpoint"]
  },
  "formation-agents-ia": {
    name: "Agents IA",
    href: "/formation-agents-ia",
    keywords: ["agent", "agentique", "workflow", "orchestration", "supervision"]
  },
  "formation-prompt-engineering": {
    name: "Prompt engineering",
    href: "/formation-prompt-engineering",
    keywords: ["prompt", "instruction", "requete", "qualite", "verification"]
  },
  "formation-ai-act": {
    name: "AI Act & gouvernance IA",
    href: "/formation-ai-act",
    keywords: ["ai act", "gouvernance", "conformite", "reglementaire", "risque"]
  },
  "formation-ia-generative": {
    name: "IA générative",
    href: "/formation-ia-generative",
    keywords: ["ia generative", "llm", "chatgpt", "culture ia", "sensibilisation"]
  }
};

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function score(text, keywords = []) {
  return keywords.reduce((total, keyword) => {
    const normalized = normalize(keyword);
    if (!normalized) return total;
    return total + (text.includes(normalized) ? Math.max(2, normalized.split(" ").length * 2) : 0);
  }, 0);
}

function localAnalysis(query) {
  const text = normalize(query);
  const roleScores = Object.entries(ROLES)
    .map(([slug, item]) => ({ slug, score: score(text, item.keywords) }))
    .sort((a, b) => b.score - a.score);

  const trainingScores = Object.entries(TRAININGS)
    .map(([slug, item]) => ({ slug, score: score(text, item.keywords) }))
    .sort((a, b) => b.score - a.score);

  const asksTraining = /(former|formation|equipes|collaborateurs|adoption|montee en competences|academy)/.test(text);
  const asksBuild = /(automatis|creer|construire|developper|deployer|assistant|agent|rag|workflow|reporting|qualifier|processus)/.test(text);

  const roleSlugs = roleScores.filter((item) => item.score > 0).slice(0, 3).map((item) => item.slug);
  const trainingSlugs = trainingScores.filter((item) => item.score > 0).slice(0, 3).map((item) => item.slug);

  if (!roleSlugs.length && asksBuild) roleSlugs.push("ai-project-manager");
  if (!trainingSlugs.length && asksTraining) trainingSlugs.push("formation-ia-entreprise");
  if (!roleSlugs.length && !trainingSlugs.length) {
    roleSlugs.push("ai-project-manager", "genai-engineer");
    trainingSlugs.push("formation-ia-entreprise");
  }

  const route = roleSlugs.length && trainingSlugs.length
    ? "hybrid"
    : roleSlugs.length
      ? "experts"
      : "academy";

  return {
    route,
    summary: "Autonomia a traduit votre demande en compétences à mobiliser et en montée en compétences éventuelle.",
    explanation:
      route === "hybrid"
        ? "Le besoin semble combiner une capacité d’exécution immédiate et un transfert de compétences vers les équipes."
        : route === "experts"
          ? "Le besoin semble d’abord nécessiter une expertise opérationnelle ciblée."
          : "Le besoin semble d’abord relever de l’adoption et de la montée en compétences.",
    roleSlugs,
    trainingSlugs,
    engine: "semantic_fallback"
  };
}

async function llmAnalysis(query) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) return null;

  const roleList = Object.entries(ROLES).map(([slug, item]) => `${slug}: ${item.name}`).join("\n");
  const trainingList = Object.entries(TRAININGS).map(([slug, item]) => `${slug}: ${item.name}`).join("\n");

  const system = `Tu es le moteur d'orientation commercial du site Autonomia.
Tu dois transformer une demande B2B en une orientation parmi les métiers Experts et les formations Academy EXISTANTS.
Tu n'inventes jamais un métier, une formation, un expert, une disponibilité, un prix ou une preuve.
Retourne uniquement un objet JSON valide avec:
{
  "route": "experts" | "academy" | "hybrid",
  "summary": "phrase courte de compréhension du besoin",
  "explanation": "1 à 2 phrases expliquant le dispositif",
  "roleSlugs": ["slug", "..."],
  "trainingSlugs": ["slug", "..."]
}
Maximum 3 métiers et 3 formations.

Métiers autorisés:
${roleList}

Formations autorisées:
${trainingList}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: query }
      ]
    }),
    cache: "no-store"
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const raw = payload?.choices?.[0]?.message?.content;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const roleSlugs = Array.isArray(parsed.roleSlugs)
      ? parsed.roleSlugs.filter((slug) => ROLES[slug]).slice(0, 3)
      : [];
    const trainingSlugs = Array.isArray(parsed.trainingSlugs)
      ? parsed.trainingSlugs.filter((slug) => TRAININGS[slug]).slice(0, 3)
      : [];

    if (!roleSlugs.length && !trainingSlugs.length) return null;

    return {
      route: ["experts", "academy", "hybrid"].includes(parsed.route)
        ? parsed.route
        : roleSlugs.length && trainingSlugs.length
          ? "hybrid"
          : roleSlugs.length
            ? "experts"
            : "academy",
      summary: String(parsed.summary || "").trim().slice(0, 420),
      explanation: String(parsed.explanation || "").trim().slice(0, 700),
      roleSlugs,
      trainingSlugs,
      engine: "llm"
    };
  } catch {
    return null;
  }
}

function explainRole(roleSlug, query) {
  const text = normalize(query);
  const item = ROLES[roleSlug];
  if (roleSlug === "rag-engineer") return "Pour structurer la recherche, la récupération et la fiabilité des réponses sur vos documents.";
  if (roleSlug === "automation-engineer") return "Pour transformer le processus décrit en workflow automatisé et connecté à vos outils.";
  if (roleSlug === "ai-agent-engineer") return "Pour concevoir l’orchestration, les outils, les permissions et la supervision d’agents IA.";
  if (roleSlug === "ai-project-manager") return "Pour cadrer le besoin, coordonner les parties prenantes et transformer l’objectif en plan d’exécution.";
  if (roleSlug === "genai-engineer") return "Pour construire ou intégrer une fonctionnalité basée sur des modèles d’IA générative.";
  if (roleSlug === "ai-product-manager") return "Pour prioriser les cas d’usage et relier la valeur métier au delivery IA.";
  if (roleSlug === "ai-governance") return "Pour cadrer les risques, responsabilités, règles d’usage et exigences réglementaires.";
  return text ? `Compétence sélectionnée à partir de la demande exprimée : ${item.name}.` : item.name;
}

function explainTraining(trainingSlug) {
  if (trainingSlug === "formation-copilot") return "Pour faire adopter Copilot sur les tâches réelles de vos équipes Microsoft 365.";
  if (trainingSlug === "formation-chatgpt-entreprise") return "Pour structurer l’usage de ChatGPT en méthodes de travail vérifiables et réutilisables.";
  if (trainingSlug === "formation-agents-ia") return "Pour comprendre, concevoir et superviser des workflows agentiques.";
  if (trainingSlug === "formation-prompt-engineering") return "Pour transformer les prompts en méthodes reproductibles avec critères de qualité.";
  if (trainingSlug === "formation-ai-act") return "Pour rendre les règles de gouvernance et les exigences AI Act actionnables.";
  if (trainingSlug === "formation-ia-generative") return "Pour donner aux équipes une base opérationnelle commune sur l’IA générative.";
  return "Pour transformer le besoin en compétences internes durables et réutilisables.";
}

async function fetchExperts(roleSlugs) {
  const base =
    process.env.AUTONOMIA_COCKPIT_URL ||
    process.env.NEXT_PUBLIC_COCKPIT_URL ||
    "https://cockpit.build-autonomia.com";

  const supported = roleSlugs.filter((slug) => [
    "ai-project-manager",
    "genai-engineer",
    "rag-engineer",
    "ai-agent-engineer",
    "automation-engineer",
    "ai-product-manager",
    "ai-governance"
  ].includes(slug));

  const responses = await Promise.all(
    supported.slice(0, 2).map(async (roleSlug) => {
      try {
        const response = await fetch(
          `${base.replace(/\/$/, "")}/api/public/consultants?role=${encodeURIComponent(roleSlug)}&limit=3`,
          { cache: "no-store" }
        );
        if (!response.ok) return [];
        const data = await response.json();
        return (data.profiles || []).map((profile) => ({
          ...profile,
          role_slug: roleSlug,
          role_name: ROLES[roleSlug]?.name || "Expert IA"
        }));
      } catch {
        return [];
      }
    })
  );

  const seen = new Set();
  return responses.flat().filter((profile) => {
    if (!profile?.id || seen.has(profile.id)) return false;
    seen.add(profile.id);
    return true;
  }).slice(0, 6);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const query = String(body?.query || "").trim();
  if (query.length < 12 || query.length > 3000) {
    return NextResponse.json({ error: "invalid_query" }, { status: 422 });
  }

  const llm = await llmAnalysis(query).catch(() => null);
  const analysis = llm || localAnalysis(query);

  const roles = analysis.roleSlugs.map((slug) => ({
    slug,
    name: ROLES[slug].name,
    href: ROLES[slug].href,
    why: explainRole(slug, query)
  }));

  const trainings = analysis.trainingSlugs.map((slug) => ({
    slug,
    name: TRAININGS[slug].name,
    href: TRAININGS[slug].href,
    why: explainTraining(slug)
  }));

  const experts = await fetchExperts(analysis.roleSlugs);

  return NextResponse.json(
    {
      ok: true,
      query,
      route: analysis.route,
      summary: analysis.summary || "Votre besoin a été traduit en dispositif Autonomia.",
      explanation: analysis.explanation || "",
      roles,
      trainings,
      experts,
      engine: analysis.engine,
      generated_at: new Date().toISOString()
    },
    { headers: { "cache-control": "no-store" } }
  );
}
