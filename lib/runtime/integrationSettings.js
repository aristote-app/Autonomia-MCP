import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const FILE = join(process.cwd(), ".runtime", "integration-settings.json");

export const RUNTIME_INTEGRATION_KEYS = Object.freeze([
  "KASPR_API_KEY",
  "KASPR_DATA_TO_GET",
  "WAALAXY_API_KEY",
  "AUTONOMIA_WAALAXY_WEBHOOK_TOKEN",
  "AUTONOMIA_INBOUND_TOKEN",
  "AUTONOMIA_ACCOUNT_RESEARCH_ENABLED",
  "AUTONOMIA_DECISION_DISCOVERY_ENABLED"
]);

const SECRET_KEYS = new Set([
  "KASPR_API_KEY",
  "WAALAXY_API_KEY",
  "AUTONOMIA_WAALAXY_WEBHOOK_TOKEN",
  "AUTONOMIA_INBOUND_TOKEN"
]);

const BOOLEAN_KEYS = new Set([
  "AUTONOMIA_ACCOUNT_RESEARCH_ENABLED",
  "AUTONOMIA_DECISION_DISCOVERY_ENABLED"
]);

function cleanValue(key, value) {
  if (!RUNTIME_INTEGRATION_KEYS.includes(key)) {
    throw new Error("Unsupported runtime integration setting");
  }

  if (value == null) return null;
  const text = String(value).trim();

  if (BOOLEAN_KEYS.has(key)) {
    return text === "true" ? "true" : "false";
  }

  const max = SECRET_KEYS.has(key) ? 4000 : 2000;
  return text.slice(0, max);
}

async function readFileState() {
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8"));
    const values = {};
    for (const key of RUNTIME_INTEGRATION_KEYS) {
      if (typeof parsed?.values?.[key] === "string") {
        values[key] = parsed.values[key];
      }
    }
    return {
      version: 1,
      updated_at: parsed?.updated_at || null,
      values
    };
  } catch {
    return { version: 1, updated_at: null, values: {} };
  }
}

export async function saveRuntimeIntegrationSettings(updates = {}) {
  const current = await readFileState();
  const nextValues = { ...current.values };

  for (const [key, raw] of Object.entries(updates || {})) {
    const value = cleanValue(key, raw);
    if (value == null || value === "") delete nextValues[key];
    else nextValues[key] = value;
  }

  const payload = {
    version: 1,
    updated_at: new Date().toISOString(),
    values: nextValues
  };

  await mkdir(dirname(FILE), { recursive: true });
  const temp = FILE + ".tmp";
  await writeFile(temp, JSON.stringify(payload, null, 2) + "\n", {
    encoding: "utf8",
    mode: 0o600
  });
  await chmod(temp, 0o600);
  await rename(temp, FILE);
  await chmod(FILE, 0o600);

  for (const key of RUNTIME_INTEGRATION_KEYS) {
    if (typeof nextValues[key] === "string" && nextValues[key]) {
      process.env[key] = nextValues[key];
    } else if (Object.prototype.hasOwnProperty.call(updates, key)) {
      delete process.env[key];
    }
  }

  return runtimeIntegrationStatus(payload);
}

export async function runtimeIntegrationStatus(prefetched = null) {
  const state = prefetched || await readFileState();

  const configured = {};
  const managedByRuntimeFile = {};
  for (const key of RUNTIME_INTEGRATION_KEYS) {
    configured[key] = Boolean(process.env[key] || state.values[key]);
    managedByRuntimeFile[key] = Boolean(state.values[key]);
  }

  return {
    updated_at: state.updated_at,
    configured,
    managed_by_runtime_file: managedByRuntimeFile,
    flags: {
      account_research:
        String(process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED || state.values.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED || "") === "true",
      decision_discovery:
        String(process.env.AUTONOMIA_DECISION_DISCOVERY_ENABLED || state.values.AUTONOMIA_DECISION_DISCOVERY_ENABLED || "") === "true"
    }
  };
}
