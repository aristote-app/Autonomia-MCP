"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspaceAdmin } from "../../lib/auth/access.js";
import { hasTemporaryIntegrationsAccess } from "../../lib/integrations/access.js";
import { saveRuntimeIntegrationSettings } from "../../lib/runtime/integrationSettings.js";

function value(formData, name, max = 4000) {
  return String(formData.get(name) || "").trim().slice(0, max);
}

async function requireAdminOrTemporaryAccess() {
  const context = await requireWorkspaceAdmin();
  if (context.authorized) return context;

  const temporaryAccess = await hasTemporaryIntegrationsAccess().catch(() => false);
  if (!temporaryAccess) throw new Error("Integrations access required");

  return {
    authorized: true,
    temporary: true,
    claims: null,
    membership: null
  };
}

export async function saveIntegrationSettings(formData) {
  await requireAdminOrTemporaryAccess();

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

  redirect("/integrations?saved=1#connection-settings");
}
