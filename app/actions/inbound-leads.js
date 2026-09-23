"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { setInboundLeadStatus } from "../../lib/db/inboundLeads.js";

async function requireWriter() {
  const context = await getCurrentWorkspaceMembership();

  if (
    !context.configured ||
    !context.claims?.sub ||
    !context.membership ||
    context.membership.role === "viewer"
  ) {
    throw new Error("Workspace write access required");
  }

  return context;
}

function clean(value, max = 200) {
  return String(value || "").trim().slice(0, max);
}

export async function updateInboundLeadStatus(formData) {
  const context = await requireWriter();
  const leadId = clean(formData.get("lead_id"), 80);
  const status = clean(formData.get("status"), 40);

  if (!leadId || !status) throw new Error("Lead and status are required");

  await setInboundLeadStatus({
    workspaceId: context.membership.workspace_id,
    leadId,
    status
  });

  revalidatePath("/inbound");
}
