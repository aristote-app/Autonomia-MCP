import { runAutomatedMarketRefresh } from "../../../../lib/market/automatedRefresh.js";
import { refreshEditorialJobSignals } from "../../../../lib/content/jobRefresh.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queries = [
    "intelligence artificielle",
    "IA générative",
    "LLM",
    "agent IA"
  ];

  const runs = [];
  for (const query of queries) {
    try {
      runs.push({
        ok: true,
        ...(await runAutomatedMarketRefresh({
          query,
          scopes: ["public", "training", "freelance"],
          limitPerQuery: 6
        }))
      });
    } catch (error) {
      runs.push({
        ok: false,
        query,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  let editorialJobSignals;
  try {
    editorialJobSignals = await refreshEditorialJobSignals();
  } catch (error) {
    editorialJobSignals = {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  return Response.json({
    ok: runs.some((run) => run.ok) || editorialJobSignals?.ok,
    completedAt: new Date().toISOString(),
    runs,
    editorialJobSignals
  });
}
