"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { requireWorkspaceAdmin } from "../../lib/auth/access.js";
import { saveRuntimeIntegrationSettings } from "../../lib/runtime/integrationSettings.js";

function value(formData, name, max = 4000) {
  return String(formData.get(name) || "").trim().slice(0, max);
}

async function requireAdmin() {
  const context = await requireWorkspaceAdmin();
  if (!context.authorized) throw new Error("Workspace admin access required");
  return context;
}

async function requestPassengerRestart() {
  const dir = join(process.cwd(), "tmp");
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, "restart.txt"),
    "Autonomia runtime integrations updated " + new Date().toISOString() + "\n",
    "utf8"
  );
}

export async function saveIntegrationSettings(formData) {
  await requireAdmin();

  const updates = {
    AUTONOMIA_ACCOUNT_RESEARCH_ENABLED:
      formData.get("account_research_enabled") === "on" ? "true" : "false",
    AUTONOMIA_DECISION_DISCOVERY_ENABLED:
      formData.get("decision_discovery_enabled") === "on" ? "true" : "false"
  };

  const optionalFields = [
    "KASPR_API_KEY",
    "KASPR_DATA_TO_GET",
    "WAALAXY_API_KEY",
    "AUTONOMIA_WAALAXY_WEBHOOK_TOKEN",
    "AUTONOMIA_INBOUND_TOKEN"
  ];

  for (const key of optionalFields) {
    if (formData.get("clear_" + key) === "on") {
      updates[key] = null;
      continue;
    }
    const submitted = value(formData, key);
    if (submitted) updates[key] = submitted;
  }

  await saveRuntimeIntegrationSettings(updates);

  revalidatePath("/integrations");
  revalidatePath("/");
  revalidatePath("/accounts");
  await requestPassengerRestart();
}
