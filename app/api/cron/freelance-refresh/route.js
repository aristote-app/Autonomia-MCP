import {
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh
} from "../../../../lib/market/automatedRefresh.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  return Boolean(secret && auth === `Bearer ${secret}`);
}

export async function GET(request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();

  let freelance;
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

  let jobSignals;
  try {
    jobSignals = await runAutomatedJobSignalRefresh({
      triggerMode: "scheduled"
    });
  } catch (error) {
    jobSignals = {
      available: false,
      error: error instanceof Error ? error.message : String(error),
      discoveredRows: 0,
      persistedRows: 0
    };
  }

  return Response.json({
    ok: Boolean(freelance?.ok),
    startedAt,
    completedAt: new Date().toISOString(),
    freelance,
    jobSignals
  }, {
    status: freelance?.ok ? 200 : 502
  });
}
