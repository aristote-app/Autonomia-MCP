import { discoverTalentCandidates } from "../../../../lib/collectors/talentHunter.js";
import {
  getConsultantDiscoverySummary,
  upsertDiscoveredConsultantCandidates
} from "../../../../lib/db/consultants.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRESETS = Object.freeze([
  "AI Engineer LangGraph RAG Python",
  "Formateur IA Copilot adoption",
  "Automatisation IA n8n Make"
]);

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const oidc = await verifyGitHubDeploymentToken(token);
    if (!oidc.ok) {
      return {
        ok: false,
        response: Response.json(
          { error: "Unauthorized GitHub deployment identity", reason: oidc.reason },
          { status: 401 }
        )
      };
    }
    return { ok: true, claims: oidc.claims };
  } catch (error) {
    return {
      ok: false,
      response: Response.json(
        {
          error: "GitHub deployment identity verification failed",
          reason: error instanceof Error ? error.message : String(error)
        },
        { status: 401 }
      )
    };
  }
}

function dedupe(candidates = []) {
  const seen = new Map();
  for (const candidate of candidates || []) {
    const key = String(candidate.profile_url || "").toLowerCase().replace(/\/$/, "");
    if (!key) continue;
    const current = seen.get(key);
    if (!current || Number(candidate.relevance_score || 0) > Number(current.relevance_score || 0)) {
      seen.set(key, candidate);
    }
  }
  return [...seen.values()];
}

export async function POST(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const summary = await getConsultantDiscoverySummary();
  if (Number(summary.candidates || 0) >= 8) {
    return Response.json({
      bootstrapped: false,
      reason: "candidate_pool_already_seeded",
      candidates: summary.candidates
    });
  }

  const results = [];
  const searches = [];

  for (const query of PRESETS) {
    const result = await discoverTalentCandidates({
      query,
      sources: ["malt", "freelance_com", "linkedin"],
      countPerSource: 8
    });

    searches.push(...(result.searches || []));
    results.push(...(result.candidates || []));
  }

  const candidates = dedupe(results).slice(0, 40);
  const persisted = await upsertDiscoveredConsultantCandidates(candidates);

  return Response.json({
    bootstrapped: true,
    presets: PRESETS.length,
    found: candidates.length,
    created: persisted.created,
    updated: persisted.updated,
    active_preserved: persisted.active_preserved,
    search_calls: searches.length,
    cached_calls: searches.filter((item) => item.cache_hit).length
  });
}
