import path from "node:path";
import { spawn } from "node:child_process";
import { getAutonomiaServerClient } from "../../../../lib/db/supabase.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const oidc = await verifyGitHubDeploymentToken(token);
    if (oidc.ok) return { ok: true };
    return { ok: false, response: Response.json({ error: "Unauthorized", reason: oidc.reason }, { status: 401 }) };
  } catch (error) {
    return {
      ok: false,
      response: Response.json({ error: "OIDC verification failed", reason: error?.message || String(error) }, { status: 401 })
    };
  }
}

async function statusPayload() {
  const db = getAutonomiaServerClient();
  const { data: runs, error: runsError } = await db
    .from("academy_sync_runs")
    .select("id,status,resource_id,file_name,source_updated_at,rows_seen,rows_upserted,started_at,finished_at,error_message")
    .eq("source", "SIRO")
    .order("started_at", { ascending: false })
    .limit(20);

  if (runsError) throw runsError;

  const rows = (runs || []).reduce(
    (max, run) => Math.max(max, Number(run.rows_upserted) || 0),
    0
  );

  return { rows, runs: (runs || []).slice(0, 5) };
}

export async function GET(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "status";

  if (action === "status") {
    try {
      return Response.json({ ok: true, ...(await statusPayload()) }, { headers: { "cache-control": "no-store" } });
    } catch (error) {
      return Response.json({ ok: false, error: error?.message || String(error) }, { status: 500 });
    }
  }

  if (action !== "start") {
    return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
  }

  try {
    const current = await statusPayload();
    const latest = current.runs?.[0];
    if (latest?.status === "running" && Date.now() - new Date(latest.started_at).getTime() < 2 * 60 * 60 * 1000) {
      return Response.json({ ok: true, alreadyRunning: true, ...current }, { status: 202 });
    }

    const child = spawn(process.execPath, [path.join(process.cwd(), "scripts", "sync-academy-siro.mjs")], {
      cwd: process.cwd(),
      env: process.env,
      detached: true,
      stdio: "ignore"
    });
    child.unref();

    return Response.json({ ok: true, started: true, pid: child.pid, ...current }, { status: 202 });
  } catch (error) {
    return Response.json({ ok: false, error: error?.message || String(error) }, { status: 500 });
  }
}
