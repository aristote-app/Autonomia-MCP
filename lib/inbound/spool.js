import { mkdir, readFile, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { normalizeInboundLead } from "./normalize.js";
import { persistInboundLead } from "../db/inboundLeads.js";

const SPOOL_DIRS = [
  "/home/dide4169/autonomia-cockpit-app/.runtime/inbound-spool",
  "/home/dide4169/autonomia-public-site-src/site/.runtime/inbound-spool"
];

async function withTimeout(promise, ms) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Inbound spool persistence timed out")), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function isDiagnosticPayload(payload) {
  return payload?.requested_service === "diagnostic_pipeline" ||
    payload?.form_id === "diagnostic-pipeline" ||
    payload?.email === "diagnostic@build-autonomia.com";
}

async function listFiles() {
  const items = [];
  for (const dir of SPOOL_DIRS) {
    try {
      await mkdir(dir, { recursive: true });
      const files = await readdir(dir);
      for (const name of files.filter((item) => item.endsWith(".json"))) {
        items.push({ dir, name, path: join(dir, name) });
      }
    } catch {}
  }
  return items;
}

export async function drainInboundSpool({ limit = 10, timeoutMs = 5000 } = {}) {
  const files = (await listFiles()).slice(0, Math.max(1, Math.min(Number(limit) || 10, 50)));
  if (!files.length) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;

  await Promise.all(files.map(async (file) => {
    try {
      const payload = JSON.parse(await readFile(file.path, "utf8"));

      if (isDiagnosticPayload(payload)) {
        await unlink(file.path).catch(() => {});
        processed += 1;
        return;
      }

      const normalized = normalizeInboundLead(payload);
      await withTimeout(persistInboundLead(normalized), timeoutMs);
      await unlink(file.path).catch(() => {});
      processed += 1;
    } catch {
      failed += 1;
    }
  }));

  return { processed, failed };
}

function queuedLeadFromPayload(payload, file) {
  let normalized;
  try {
    normalized = normalizeInboundLead(payload);
  } catch {
    return null;
  }

  return {
    id: "queued:" + (normalized.external_lead_id || file.name),
    external_lead_id: normalized.external_lead_id,
    workspace_id: null,
    owner_user_id: null,
    source_channel: normalized.source_channel,
    source_platform: normalized.source_platform,
    first_name: normalized.first_name,
    last_name: normalized.last_name,
    email: normalized.email,
    phone: normalized.phone,
    company_name: normalized.company_name,
    requested_service: normalized.requested_service,
    message: normalized.message,
    desired_timeline: normalized.desired_timeline,
    company_size: normalized.company_size,
    status: "new",
    scan_context: normalized.scan_context,
    marketing_consent: normalized.marketing_consent,
    consent_timestamp: normalized.consent_timestamp,
    first_received_at: normalized.received_at,
    last_received_at: normalized.received_at,
    first_touch: {
      occurred_at: normalized.received_at,
      source_channel: normalized.source_channel,
      source_platform: normalized.source_platform,
      ...normalized.attribution
    },
    latest_touch: {
      occurred_at: normalized.received_at,
      source_channel: normalized.source_channel,
      source_platform: normalized.source_platform,
      ...normalized.attribution
    },
    created_at: normalized.received_at,
    updated_at: normalized.received_at,
    queued: true
  };
}

export async function listQueuedInboundLeads({ limit = 100 } = {}) {
  const files = (await listFiles()).slice(0, Math.max(1, Math.min(Number(limit) || 100, 500)));
  const leads = [];

  for (const file of files) {
    try {
      const payload = JSON.parse(await readFile(file.path, "utf8"));
      if (isDiagnosticPayload(payload)) continue;
      const lead = queuedLeadFromPayload(payload, file);
      if (lead) leads.push(lead);
    } catch {}
  }

  return leads.sort((a, b) => new Date(b.last_received_at || 0) - new Date(a.last_received_at || 0));
}
