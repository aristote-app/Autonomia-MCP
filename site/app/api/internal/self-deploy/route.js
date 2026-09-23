import { mkdir, open } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import {
  validDeploySha,
  verifyGitHubDeploymentToken
} from "@/lib/deploy/githubOidc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RUNTIME_DIR = join(process.cwd(), ".runtime");
const LOG_FILE = join(RUNTIME_DIR, "self-deploy.log");
const SCRIPT = join(process.cwd(), "scripts", "o2switch-sync-public-site.sh");

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
    const oidc = await verifyGitHubDeploymentToken(token);
    if (oidc.ok) return { ok: true, claims: oidc.claims };
    return {
      ok: false,
      response: Response.json(
        { error: "Unauthorized GitHub deployment identity", reason: oidc.reason },
        { status: 401 }
      )
    };
  } catch (error) {
    return {
      ok: false,
      response: Response.json(
        { error: "GitHub deployment identity verification failed", reason: error?.message || String(error) },
        { status: 401 }
      )
    };
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("action") !== "deploy") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const targetSha = String(url.searchParams.get("sha") || "").trim();
  if (!validDeploySha(targetSha)) {
    return Response.json({ error: "A validated 40-character Git commit SHA is required" }, { status: 400 });
  }

  await mkdir(RUNTIME_DIR, { recursive: true });
  const handle = await open(LOG_FILE, "a");
  const startedAt = new Date().toISOString();
  await handle.appendFile("\n=== PUBLIC SELF DEPLOY " + startedAt + " · " + targetSha + " ===\n");

  const child = spawn("bash", [SCRIPT], {
    cwd: process.cwd(),
    detached: true,
    env: {
      ...process.env,
      AUTONOMIA_DEPLOY_SHA: targetSha
    },
    stdio: ["ignore", handle.fd, handle.fd]
  });

  child.unref();
  await handle.close();

  return Response.json(
    {
      accepted: true,
      target_sha: targetSha,
      pid: child.pid,
      started_at: startedAt
    },
    {
      status: 202,
      headers: { "cache-control": "no-store, no-cache, must-revalidate" }
    }
  );
}
