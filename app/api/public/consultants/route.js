import { getAutonomiaServerClient } from "../../../../lib/db/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLE_MAP = {
  "ai-project-manager": {
    families: ["ai-project", "transformation"],
    keywords: ["project", "projet", "programme", "roadmap", "delivery", "transformation", "stakeholder"]
  },
  "genai-engineer": {
    families: ["genai-engineer", "prompt", "data-engineering"],
    keywords: ["genai", "generative", "generative ai", "llm", "rag", "langchain", "langgraph", "openai", "fastapi"]
  },
  "llm-engineer": {
    families: ["genai-engineer", "prompt", "data-science"],
    keywords: ["llm", "langchain", "langgraph", "evaluation", "rag", "prompt", "openai", "anthropic"]
  },
  "rag-engineer": {
    families: ["genai-engineer", "data-engineering", "prompt"],
    keywords: ["rag", "retrieval", "vector", "embedding", "langchain", "llamaindex", "search", "pgvector"]
  },
  "ai-agent-engineer": {
    families: ["automation", "genai-engineer", "prompt"],
    keywords: ["agent", "agentic", "langgraph", "tool calling", "mcp", "orchestration", "automation", "n8n"]
  },
  "data-scientist": {
    families: ["data-science", "data-engineering"],
    keywords: ["data science", "machine learning", "python", "pytorch", "tensorflow", "statistics", "ml", "spark"]
  },
  "ml-engineer": {
    families: ["data-science", "data-engineering", "mlops"],
    keywords: ["machine learning", "ml engineer", "pytorch", "tensorflow", "docker", "fastapi", "model serving"]
  },
  "mlops-llmops-engineer": {
    families: ["mlops", "data-engineering"],
    keywords: ["mlops", "llmops", "docker", "kubernetes", "mlflow", "kubeflow", "ci/cd", "aws", "azure", "gcp"]
  },
  "ai-product-manager": {
    families: ["ai-product", "transformation"],
    keywords: ["product", "produit", "roadmap", "discovery", "product manager", "product owner", "ai product"]
  },
  "ai-governance": {
    families: ["governance", "change", "transformation"],
    keywords: ["governance", "gouvernance", "ai act", "responsible ai", "risk", "risque", "compliance", "conformite"]
  },
  "automation-engineer": {
    families: ["automation"],
    keywords: ["automation", "automatisation", "n8n", "make", "zapier", "workflow", "api", "webhook", "power automate"]
  }
};

function unique(items = []) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function lower(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function extractInitials(displayName) {
  const cleaned = String(displayName || "")
    .replace(/^Découvrez le profil freelance de\s+/i, "")
    .replace(/^Discover the freelancer profile for\s+/i, "")
    .replace(/^Découvrez le profil de\s+/i, "")
    .replace(/^Profil freelance de\s+/i, "")
    .replace(/^Freelance profile of\s+/i, "")
    .trim();

  const parts = cleaned
    .replace(/[^\p{L}\p{N}.\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "IA";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] || "") : "";
  return (first + last).toUpperCase().slice(0, 2) || "IA";
}

function formatAvailability(row) {
  const today = new Date().toISOString().slice(0, 10);
  const available = row.available_from ? String(row.available_from).slice(0, 10) : null;

  if (row.status === "active" && available && available <= today) {
    return { label: "Disponible", status: "available" };
  }
  if (row.status === "active" && available) {
    return {
      label: "Disponible à partir du " + new Intl.DateTimeFormat("fr-FR").format(new Date(available + "T12:00:00Z")),
      status: "future"
    };
  }
  if (row.status === "active") {
    return { label: "Disponibilité à confirmer", status: "confirm" };
  }
  if (available) {
    return {
      label: "Disponibilité indiquée à partir du " + new Intl.DateTimeFormat("fr-FR").format(new Date(available + "T12:00:00Z")),
      status: "confirm"
    };
  }
  return { label: "Disponibilité à confirmer", status: "confirm" };
}

function scoreConsultant(row, role) {
  const config = ROLE_MAP[role] || ROLE_MAP["genai-engineer"];
  const family = lower(row.metadata?.talent_family);
  const headline = lower(row.metadata?.headline || row.notes);
  const skills = unique([
    ...(row.metadata?.discovered_skills || []),
    ...(row.consultant_skills || []).map((item) => item.skills?.name)
  ]);
  const haystack = [headline, ...skills.map(lower)].join(" ");

  let score = 0;
  if (config.families.includes(family)) score += 80;
  for (const keyword of config.keywords) {
    if (haystack.includes(lower(keyword))) score += 10;
  }
  score += Math.min(Number(row.metadata?.relevance_score || 0) / 10, 10);
  if (row.status === "active") score += 25;
  if (row.tjm != null) score += 6;
  if (row.available_from) score += 4;
  return score;
}

function publicProfile(row) {
  const skills = unique([
    ...(row.consultant_skills || []).map((item) => item.skills?.name),
    ...(row.metadata?.discovered_skills || [])
  ]);

  const headline = String(row.metadata?.headline || row.notes || "Consultant IA").trim();
  const availability = formatAvailability(row);
  const bullets = [];

  if (headline) bullets.push(headline);
  if (row.years_experience != null) {
    bullets.push(Number(row.years_experience) + " ans d'expérience indiqués");
  }
  if (Array.isArray(row.locations) && row.locations.length) {
    bullets.push("Zone : " + row.locations.slice(0, 3).join(", "));
  }
  if (row.remote) bullets.push("Remote / hybride possible");
  if (skills.length) {
    bullets.push("Compétences clés : " + skills.slice(0, 5).join(" · "));
  }

  const rawTjm = row.tjm == null ? null : Number(row.tjm);
  const publicTjm = Number.isFinite(rawTjm) ? Math.round(rawTjm * 1.2) : null;

  return {
    id: row.id,
    initials: extractInitials(row.display_name),
    title: headline,
    cv_bullets: bullets.slice(0, 5),
    skills,
    years_experience: row.years_experience == null ? null : Number(row.years_experience),
    location: Array.isArray(row.locations) && row.locations.length ? row.locations.slice(0, 3).join(", ") : null,
    remote: Boolean(row.remote),
    availability,
    tjm: publicTjm,
    currency: row.currency || "EUR",
    updated_at: row.updated_at || null
  };
}

export async function GET(request) {
  const url = new URL(request.url);
  const role = String(url.searchParams.get("role") || "genai-engineer").trim();
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 6), 1), 12);

  if (!ROLE_MAP[role]) {
    return Response.json({ ok: false, error: "unknown_role" }, { status: 400 });
  }

  try {
    const client = getAutonomiaServerClient();
    const { data, error } = await client
      .from("consultants")
      .select("id,display_name,status,available_from,tjm,currency,remote,locations,years_experience,notes,metadata,updated_at,consultant_skills(skills(name))")
      .neq("status", "rejected")
      .order("updated_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const ranked = (data || [])
      .map((row) => ({ row, score: scoreConsultant(row, role) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => publicProfile(item.row));

    const lastUpdated = ranked
      .map((item) => item.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1) || null;

    return Response.json(
      {
        ok: true,
        role,
        label: "CV consultants — mise à jour en temps réel",
        availability_note: "La disponibilité n’est affichée comme confirmée que lorsqu’elle est explicitement renseignée dans le cockpit.",
        pricing_note: "Les TJM affichés correspondent au TJM Autonomia, calculé sur le TJM enregistré dans le cockpit avec une majoration de 20 %.",
        profiles: ranked,
        count: ranked.length,
        generated_at: new Date().toISOString(),
        data_updated_at: lastUpdated
      },
      {
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch {
    return Response.json(
      { ok: false, error: "consultant_feed_unavailable", profiles: [] },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }
}
