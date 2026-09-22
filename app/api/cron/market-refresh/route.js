import {
  runAutomatedMarketRefresh,
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh
} from "../../../../lib/market/automatedRefresh.js";
import { isAuthorizedMarketRefreshRequest } from "../../../../lib/security/marketRefreshAuth.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  if (!isAuthorizedMarketRefreshRequest(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = new URL(request.url).searchParams.get("mode") || "full";
  const publicOnly = mode === "public";

  const queries = [
    "intelligence artificielle",
    "IA générative",
    "LLM",
    "agent IA"
  ];

  const runs = [];

  let freelance = null;
  let jobSignals = null;

  if (!publicOnly) {
    try {
      freelance = {
        ok: true,
        ...(await runAutomatedFreelanceRefresh({
          category: "ia",
          limit: 50,
          triggerMode: "scheduled"
        }))
      };
    } catch (error) {
      freelance = {
        ok: false,
        source: "freework",
        error: error instanceof Error ? error.message : String(error)
      };
    }

    try {
      jobSignals = await runAutomatedJobSignalRefresh({
        triggerMode: "scheduled"
      });
    } catch (error) {
      jobSignals = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
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

  const publicOk = runs.some((run) => run.ok);

  return Response.json({
    ok: publicOnly ? publicOk : Boolean(freelance?.ok) || publicOk,
    mode,
    completedAt: new Date().toISOString(),
    freelance,
    jobSignals,
    runs
  }, {
    status: publicOk || (!publicOnly && freelance?.ok) ? 200 : 502
  });
}
