import { NextResponse } from "next/server";
import { requireWorkspaceAdmin } from "../../../lib/auth/access.js";
import { hasTemporaryIntegrationsAccess } from "../../../lib/integrations/access.js";
import { saveRuntimeIntegrationSettings } from "../../../lib/runtime/integrationSettings.js";

function value(formData, name, max = 4000) {
  return String(formData.get(name) || "").trim().slice(0, max);
}

async function authorized() {
  const admin = await requireWorkspaceAdmin().catch(() => ({ authorized: false }));
  if (admin?.authorized) return true;
  return hasTemporaryIntegrationsAccess().catch(() => false);
}

export async function POST(request) {
  const allowed = await authorized();

  if (!allowed) {
    return NextResponse.redirect(
      new URL("/integrations?access=required#connection-settings", request.url),
      { status: 303 }
    );
  }

  try {
    const formData = await request.formData();

    const updates = {
      AUTONOMIA_ACCOUNT_RESEARCH_ENABLED:
        formData.get("account_research_enabled") === "on" ? "true" : "false",
      AUTONOMIA_DECISION_DISCOVERY_ENABLED:
        formData.get("decision_discovery_enabled") === "on" ? "true" : "false"
    };

    const optionalFields = [
      "KASPR_API_KEY",
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

    const state = await saveRuntimeIntegrationSettings(updates);
    const kasprSaved = Boolean(state?.configured?.KASPR_API_KEY);

    return NextResponse.redirect(
      new URL(
        "/integrations?saved=1&kaspr=" + (kasprSaved ? "ready" : "missing") + "#connection-settings",
        request.url
      ),
      { status: 303 }
    );
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message.slice(0, 160) : "save_failed"
    );

    return NextResponse.redirect(
      new URL("/integrations?save_error=" + message + "#connection-settings", request.url),
      { status: 303 }
    );
  }
}
