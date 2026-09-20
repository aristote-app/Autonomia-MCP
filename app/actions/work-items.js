"use server";

import { revalidatePath } from "next/cache";
import { getAutonomiaServerClient } from "../../lib/db/supabase.js";
import {
  getCurrentWorkspaceMembership,
  canManageWorkspace
} from "../../lib/auth/access.js";

const ITEM_TYPES = new Set(["opportunity", "job_signal", "inbound_lead"]);
const STAGES = new Set([
  "new",
  "review",
  "go",
  "no_go",
  "in_progress",
  "proposal",
  "submitted",
  "won",
  "lost",
  "archived"
]);
const PRIORITIES = new Set(["low", "normal", "high", "urgent"]);

async function requireWriter() {
  const context = await getCurrentWorkspaceMembership();
  if (!context.membership || !context.claims?.sub || context.membership.role === "viewer") {
    throw new Error("Workspace write access required");
  }
  return context;
}

function identity(formData) {
  const itemType = String(formData.get("item_type") || "");
  const itemId = String(formData.get("item_id") || "");

  if (!ITEM_TYPES.has(itemType) || !itemId) {
    throw new Error("Invalid work item identity");
  }

  return { itemType, itemId };
}

async function appendActivity(client, context, {
  itemType,
  itemId,
  action,
  metadata = {}
}) {
  const { error } = await client.from("activity_log").insert({
    workspace_id: context.membership.workspace_id,
    actor_user_id: context.claims.sub,
    entity_type: itemType,
    entity_id: itemId,
    action,
    metadata
  });

  if (error) throw error;
}

export async function claimWorkItem(formData) {
  const context = await requireWriter();
  const { itemType, itemId } = identity(formData);
  const client = getAutonomiaServerClient();

  const { error } = await client.from("work_items").upsert({
    workspace_id: context.membership.workspace_id,
    item_type: itemType,
    item_id: itemId,
    owner_user_id: context.claims.sub,
    updated_by: context.claims.sub,
    updated_at: new Date().toISOString()
  }, {
    onConflict: "workspace_id,item_type,item_id"
  });

  if (error) throw error;

  await appendActivity(client, context, {
    itemType,
    itemId,
    action: "work_item_claimed"
  });

  revalidatePath("/");
}

export async function assignWorkItem(formData) {
  const context = await requireWriter();
  if (!canManageWorkspace(context.membership.role)) {
    throw new Error("Workspace manager role required");
  }

  const { itemType, itemId } = identity(formData);
  const ownerUserId = String(formData.get("owner_user_id") || "");
  const client = getAutonomiaServerClient();

  if (ownerUserId) {
    const { data: member, error: memberError } = await client
      .from("workspace_members")
      .select("user_id")
      .eq("workspace_id", context.membership.workspace_id)
      .eq("user_id", ownerUserId)
      .eq("active", true)
      .maybeSingle();

    if (memberError) throw memberError;
    if (!member) throw new Error("Selected owner is not an active workspace member");
  }

  const { error } = await client.from("work_items").upsert({
    workspace_id: context.membership.workspace_id,
    item_type: itemType,
    item_id: itemId,
    owner_user_id: ownerUserId || null,
    updated_by: context.claims.sub,
    updated_at: new Date().toISOString()
  }, {
    onConflict: "workspace_id,item_type,item_id"
  });

  if (error) throw error;

  await appendActivity(client, context, {
    itemType,
    itemId,
    action: "work_item_assigned",
    metadata: { owner_user_id: ownerUserId || null }
  });

  revalidatePath("/");
}

export async function updateWorkItem(formData) {
  const context = await requireWriter();
  const { itemType, itemId } = identity(formData);
  const client = getAutonomiaServerClient();

  const { data: existing, error: existingError } = await client
    .from("work_items")
    .select("id,owner_user_id")
    .eq("workspace_id", context.membership.workspace_id)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (
    existing?.owner_user_id &&
    existing.owner_user_id !== context.claims.sub &&
    !canManageWorkspace(context.membership.role)
  ) {
    throw new Error("Only the owner or a workspace manager can update this item");
  }

  const stage = String(formData.get("stage") || "review");
  const priority = String(formData.get("priority") || "normal");
  const nextAction = String(formData.get("next_action") || "").trim() || null;
  const dueAtRaw = String(formData.get("due_at") || "").trim();

  if (!STAGES.has(stage) || !PRIORITIES.has(priority)) {
    throw new Error("Invalid workflow value");
  }

  const payload = {
    workspace_id: context.membership.workspace_id,
    item_type: itemType,
    item_id: itemId,
    owner_user_id: existing?.owner_user_id || context.claims.sub,
    stage,
    priority,
    next_action: nextAction,
    due_at: dueAtRaw ? new Date(dueAtRaw).toISOString() : null,
    updated_by: context.claims.sub,
    updated_at: new Date().toISOString()
  };

  const { error } = await client.from("work_items").upsert(payload, {
    onConflict: "workspace_id,item_type,item_id"
  });

  if (error) throw error;

  await appendActivity(client, context, {
    itemType,
    itemId,
    action: "work_item_updated",
    metadata: {
      stage,
      priority,
      due_at: payload.due_at
    }
  });

  revalidatePath("/");
}
