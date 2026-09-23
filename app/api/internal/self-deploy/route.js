import { mkdir, open, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { requireInternalToken } from "../../../../lib/security.js";
import {
  validDeploySha,
  verifyGitHubDeploymentToken
} from "../../../../lib/deploy/githubOidc.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RUNTIME_DIR = join(process.cwd(), ".runtime");
const LOG_FILE = join(RUNTIME_DIR, "self-deploy.log");
const SCRIPT = join(process.cwd(), "scripts", "o2switch-sync-cockpit.sh");

function legacyEnabled() {
  return process.env.AUTONOMIA_SELF_DEPLOY_ENABLED === "true";
}

async function authorizeDeploy(request) {
  const authorization = request.headers.get("authorization") || "";
  if (/^Bearer\s+/i.test(authorization)) {
    const token = authorization.replace(/^Bearer\s+/i, "").trim();
    try {
      const oidc = await verifyGitHubDeploymentToken(token);
      if (oidc.ok) return { ok: true, mode: "github_oidc", claims: oidc.claims };
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
          {
            error: "GitHub deployment identity verification failed",
            reason: error instanceof Error ? error.message : String(error)
          },
          { status: 401 }
        )
      };
    }
  }

  const legacy = requireInternalToken(request);
  if (!legacy.ok) return legacy;
  if (!legacyEnabled()) {
    return {
      ok: false,
      response: Response.json({ error: "Legacy self deploy is disabled" }, { status: 403 })
    };
  }
  return { ok: true, mode: "legacy_token", claims: null };
}

async function tailLog(maxBytes = 12000) {
  try {
    const content = await readFile(LOG_FILE, "utf8");
    return content.slice(-maxBytes);
  } catch {
    return "";
  }
}

export async function POST(request) {
  const auth = await authorizeDeploy(request);
  if (!auth.ok) return auth.response;

  const payload = await request.json().catch(() => ({}));
  const targetSha = String(payload?.sha || "").trim();

  if (!validDeploySha(targetSha)) {
    return Response.json(
      { error: "A validated 40-character Git commit SHA is required" },
      { status: 400 }
    );
  }

  await mkdir(RUNTIME_DIR, { recursive: true });
  const handle = await open(LOG_FILE, "a");
  const timestamp = new Date().toISOString();
  await handle.appendFile(
    "\n=== SELF DEPLOY " + timestamp + " · " + targetSha + " · " + auth.mode + " ===\n"
  );

  const child = spawn("bash", [SCRIPT], {
    cwd: process.cwd(),
    detached: true,
    env: {
      ...process.env,
      FORCE_DEPLOY: "0",
      AUTONOMIA_DEPLOY_SHA: targetSha
    },
    stdio: ["ignore", handle.fd, handle.fd]
  });

  child.unref();
  await handle.close();

  return Response.json(
    {
      accepted: true,
      pid: child.pid,
      target_sha: targetSha,
      auth_mode: auth.mode,
      started_at: timestamp,
      note: "Deployment runs in the background and is pinned to the validated commit SHA."
    },
    { status: 202 }
  );
}

export async function GET(request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "deploy") {
    const auth = await authorizeDeploy(request);
    if (!auth.ok) return auth.response;

    const targetSha = String(url.searchParams.get("sha") || "").trim();
    if (!validDeploySha(targetSha)) {
      return Response.json(
        { error: "A validated 40-character Git commit SHA is required" },
        { status: 400 }
      );
    }

    await mkdir(RUNTIME_DIR, { recursive: true });
    const handle = await open(LOG_FILE, "a");
    const timestamp = new Date().toISOString();
    await handle.appendFile(
      "\n=== SELF DEPLOY " + timestamp + " · " + targetSha + " · " + auth.mode + " · GET ===\n"
    );

    const child = spawn("bash", [SCRIPT], {
      cwd: process.cwd(),
      detached: true,
      env: {
        ...process.env,
        FORCE_DEPLOY: "0",
        AUTONOMIA_DEPLOY_SHA: targetSha
      },
      stdio: ["ignore", handle.fd, handle.fd]
    });

    child.unref();
    await handle.close();

    return Response.json(
      {
        accepted: true,
        pid: child.pid,
        target_sha: targetSha,
        auth_mode: auth.mode,
        started_at: timestamp,
        transport: "get_oidc",
        note: "Deployment runs in the background and is pinned to the validated commit SHA."
      },
      {
        status: 202,
        headers: {
          "cache-control": "no-store, no-cache, must-revalidate"
        }
      }
    );
  }

  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;

  return Response.json({
    oidc_enabled: true,
    legacy_enabled: legacyEnabled(),
    log_tail: await tailLog()
  }, {
    headers: {
      "cache-control": "no-store, no-cache, must-revalidate"
    }
  });
}
