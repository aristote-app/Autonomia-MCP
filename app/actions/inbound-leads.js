"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  getAutonomiaWorkspace,
  setInboundLeadStatus,
  updateInboundLeadFollowUp
} from "../../lib/db/inboundLeads.js";
import { hasTemporaryInboundAccess } from "../../lib/inbound/access.js";

async function requireWriter() {
  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));

  if (context?.membership?.workspace_id && context.membership.role !== "viewer") {
    return context;
  }

  const temporaryAccess = await hasTemporaryInboundAccess().catch(() => false);
  if (!temporaryAccess) {
    throw new Error("Workspace write access required");
  }

  const workspace = await getAutonomiaWorkspace();
  if (!workspace?.id) {
    throw new Error("Autonomia workspace is required");
  }

  return {
    ...context,
    membership: {
      workspace_id: workspace.id,
      role: "direction",
      workspaces: workspace
    }
  };
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


export async function updateInboundLeadFollowUpAction(formData) {
  const context = await requireWriter();
  const leadId = clean(formData.get("lead_id"), 80);
  const status = clean(formData.get("status"), 40);
  const priority = clean(formData.get("priority"), 20) || "normal";
  const nextAction = clean(formData.get("next_action"), 500);
  const followUpDueAt = clean(formData.get("follow_up_due_at"), 40);
  const followUpNote = clean(formData.get("follow_up_note"), 3000);

  if (!leadId || !status) throw new Error("Lead and status are required");

  await updateInboundLeadFollowUp({
    workspaceId: context.membership.workspace_id,
    leadId,
    status,
    nextAction,
    followUpNote,
    followUpDueAt,
    priority
  });

  revalidatePath("/inbound");
}
