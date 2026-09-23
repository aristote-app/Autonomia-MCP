import { mkdir, open, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { requireInternalToken } from "../../../../lib/security.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RUNTIME_DIR = join(process.cwd(), ".runtime");
const LOG_FILE = join(RUNTIME_DIR, "self-deploy.log");
const SCRIPT = join(process.cwd(), "scripts", "o2switch-sync-cockpit.sh");

function enabled() {
  return process.env.AUTONOMIA_SELF_DEPLOY_ENABLED === "true";
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
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;

  if (!enabled()) {
    return Response.json(
      { error: "Self deploy is disabled" },
      { status: 403 }
    );
  }

  await mkdir(RUNTIME_DIR, { recursive: true });
  const handle = await open(LOG_FILE, "a");
  const timestamp = new Date().toISOString();
  await handle.appendFile("\n=== SELF DEPLOY " + timestamp + " ===\n");

  const child = spawn("bash", [SCRIPT], {
    cwd: process.cwd(),
    detached: true,
    env: {
      ...process.env,
      FORCE_DEPLOY: "0"
    },
    stdio: ["ignore", handle.fd, handle.fd]
  });

  child.unref();
  await handle.close();

  return Response.json(
    {
      accepted: true,
      pid: child.pid,
      started_at: timestamp,
      note: "Deployment runs in the background. The app may restart when the build completes."
    },
    { status: 202 }
  );
}

export async function GET(request) {
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;

  return Response.json({
    enabled: enabled(),
    log_tail: await tailLog()
  });
}
