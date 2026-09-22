import { runAutomatedMarketRefresh, runAutomatedJobSignalRefresh } from "../../../../lib/market/automatedRefresh.js";

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

  // Run freelance first and only once. Free-Work does not depend on the text query,
  // so fetching it four times wastes execution time and can starve persistence.
  let freelance = null;
  try {
    freelance = {
      ok: true,
      ...(await runAutomatedMarketRefresh({
        query: "intelligence artificielle",
        scopes: ["freelance"],
        limitPerQuery: 6
      }))
    };
  } catch (error) {
    freelance = {
      ok: false,
      query: "intelligence artificielle",
      scopes: ["freelance"],
      error: error instanceof Error ? error.message : String(error)
    };
  }

  let jobSignals = null;
  try {
    jobSignals = await runAutomatedJobSignalRefresh();
  } catch (error) {
    jobSignals = {
      available: true,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  for (const query of queries) {
    try {
      runs.push({
        ok: true,
        ...(await runAutomatedMarketRefresh({
          query,
          scopes: ["public", "training"],
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

  return Response.json({
    ok: Boolean(freelance?.ok) || runs.some((run) => run.ok),
    completedAt: new Date().toISOString(),
    freelance,
    jobSignals,
    runs
  });
}
