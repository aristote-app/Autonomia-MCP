import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";
import {
  drainInboundSpool,
  listQueuedInboundLeads
} from "../../../../lib/inbound/spool.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const result = await verifyGitHubDeploymentToken(token);
    if (result.ok) return { ok: true };
    return {
      ok: false,
      response: Response.json(
        { error: "Unauthorized GitHub deployment identity", reason: result.reason },
        { status: 401 }
      )
    };
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

export async function GET(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "status";

  if (!["status", "drain"].includes(action)) {
    return Response.json({ error: "Unsupported action" }, { status: 400 });
  }

  const before = await listQueuedInboundLeads({ limit: 500 });

  if (action === "status") {
    return Response.json(
      {
        ok: true,
        queued: before.length,
        timestamp: new Date().toISOString()
      },
      { headers: { "cache-control": "no-store" } }
    );
  }

  const result = await drainInboundSpool({ limit: 50, timeoutMs: 8000 });
  const after = await listQueuedInboundLeads({ limit: 500 });

  return Response.json(
    {
      ok: true,
      queued_before: before.length,
      processed: result.processed,
      failed: result.failed,
      queued_after: after.length,
      timestamp: new Date().toISOString()
    },
    { headers: { "cache-control": "no-store" } }
  );
}
