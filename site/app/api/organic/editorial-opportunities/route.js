import { requireOrganicAuth } from "../../../../lib/organic/auth.js";
import { rankEditorialOpportunities } from "../../../../lib/organic/editorialScoring.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = requireOrganicAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const signals = Array.isArray(body.signals) ? body.signals : [];
  const maxResults = Number(body.max_results || 25);

  return Response.json({
    ok: true,
    recommendations: rankEditorialOpportunities(
      signals,
      maxResults
    ),
    signal_count: signals.length,
    generated_at: new Date().toISOString()
  });
}
