import { readFile } from "node:fs/promises";

const [, , service = "cockpit", targetSha = "", statusCode = "1", logFile = ""] = process.argv;

const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!base || !key || !logFile) {
  process.exit(0);
}

let logTail = "";
try {
  const content = await readFile(logFile, "utf8");
  logTail = content.slice(-12000);
} catch {}

const now = new Date().toISOString();
const payload = [{
  source_id: "deploy-diagnostic",
  trigger_mode: "self-deploy",
  query_payload: {
    service,
    target_sha: targetSha || null
  },
  status: Number(statusCode) === 0 ? "success" : "failed",
  started_at: now,
  completed_at: now,
  stats: {
    exit_code: Number(statusCode) || 0,
    log_bytes: logTail.length
  },
  error_message: logTail || null
}];

const response = await fetch(base.replace(/\/$/, "") + "/rest/v1/collector_runs", {
  method: "POST",
  headers: {
    apikey: key,
    authorization: "Bearer " + key,
    "content-type": "application/json",
    prefer: "return=minimal"
  },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  const body = await response.text().catch(() => "");
  console.error("deploy diagnostic upload failed", response.status, body.slice(0, 500));
}
