"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  setSalesContactOutreachStatus,
  setSalesContactOptOut
} from "../../lib/db/salesContacts.js";

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

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export async function updateContactPipelineStage(formData) {
  const context = await requireWriter();
  const contactId = clean(formData.get("contact_id"), 80);
  const status = clean(formData.get("status"), 30);
  const note = clean(formData.get("note"), 1000) || null;

  if (!contactId || !status) {
    throw new Error("Contact and status are required");
  }

  await setSalesContactOutreachStatus({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId,
    status,
    note
  });

  revalidatePath("/contacts");
}

export async function optOutContact(formData) {
  const context = await requireWriter();
  const contactId = clean(formData.get("contact_id"), 80);
  const note = clean(formData.get("note"), 1000) || null;

  if (!contactId) throw new Error("Contact is required");

  await setSalesContactOptOut({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId,
    note
  });

  revalidatePath("/contacts");
}
