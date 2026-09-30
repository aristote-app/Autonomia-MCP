import { runAutomatedJobSignalRefresh } from "../../../../lib/market/automatedRefresh.js";
import { runOpportunityHunter } from "../../../../lib/market/opportunityHunter.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;

  try {
    const result = await verifyGitHubDeploymentToken(token);
    return Boolean(result?.ok);
  } catch {
    return false;
  }
}

export async function GET(request) {
  if (!(await authorize(request))) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();

  try {
    const jobSignals = await runAutomatedJobSignalRefresh({
      triggerMode: "on_demand"
    });

    const opportunityHunter = await runOpportunityHunter({
      maxAccounts: 3,
      maxPhoneFallbacks: 1
    });

    return Response.json({
      ok: true,
      startedAt,
      completedAt: new Date().toISOString(),
      jobSignals,
      opportunityHunter
    }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    return Response.json({
      ok: false,
      startedAt,
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
