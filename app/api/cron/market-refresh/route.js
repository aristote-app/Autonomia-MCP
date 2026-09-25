import {
  runAutomatedMarketRefresh,
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh,
  runAutomatedExtendedDemandRefresh
} from "../../../../lib/market/automatedRefresh.js";
import { isAuthorizedMarketRefreshRequest } from "../../../../lib/security/marketRefreshAuth.js";
import { runAutomatedTerritorySignalRefresh } from "../../../../lib/market/territorySignals.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  if (!(await isAuthorizedMarketRefreshRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = new URL(request.url).searchParams.get("mode") || "full";
  const publicOnly = mode === "public";
  const territoryOnly = mode === "territories";
  const territoryProgramsOnly = mode === "territory-programs";

  if (territoryProgramsOnly) {
    try {
      const extended = await runAutomatedExtendedDemandRefresh({
        triggerMode: "scheduled",
        includeWeb: true,
        includeFranceTravail: false,
        webKinds: ["territory_program"]
      });

      const territoryPrograms = extended.territoryPrograms || {
        discoveredRows: 0,
        persistedRows: 0,
        error: null
      };
      const ok = Boolean(extended.available) && !territoryPrograms.error;

      return Response.json({
        ok,
        mode,
        completedAt: new Date().toISOString(),
        territoryPrograms,
        web: extended.web || null
      }, {
        status: ok ? 200 : 502
      });
    } catch (error) {
      return Response.json({
        ok: false,
        mode,
        completedAt: new Date().toISOString(),
        territoryPrograms: {
          discoveredRows: 0,
          persistedRows: 0,
          error: error instanceof Error ? error.message : String(error)
        }
      }, { status: 502 });
    }
  }

  if (territoryOnly) {
    try {
      const territorySignals = await runAutomatedTerritorySignalRefresh({
        triggerMode: "scheduled"
      });

      return Response.json({
        ok: Boolean(territorySignals.available),
        mode,
        completedAt: new Date().toISOString(),
        territorySignals
      }, {
        status: territorySignals.available ? 200 : 502
      });
    } catch (error) {
      return Response.json({
        ok: false,
        mode,
        completedAt: new Date().toISOString(),
        territorySignals: {
          available: false,
          source: "multi_public",
          persisted: 0,
          error: error instanceof Error ? error.message : String(error)
        }
      }, { status: 502 });
    }
  }

  const requestedQuery = new URL(request.url).searchParams.get("q");
  const queries = requestedQuery
    ? [requestedQuery]
    : [
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
    territorySignals: null,
    runs
  }, {
    status: publicOk || (!publicOnly && freelance?.ok) ? 200 : 502
  });
}
