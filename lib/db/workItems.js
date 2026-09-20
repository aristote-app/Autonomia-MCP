import { getAutonomiaServerClient } from "./supabase.js";
import {
  getCurrentWorkspaceMembership,
  canManageWorkspace
} from "../auth/access.js";

function queueKey(itemType, itemId) {
  return `${itemType}:${itemId}`;
}

export async function getTeamWorkflowContext(queueItems = []) {
  const context = await getCurrentWorkspaceMembership();

  if (!context.configured || !context.membership || !context.claims?.sub) {
    return {
      enabled: false,
      currentUserId: context.claims?.sub || null,
      role: context.membership?.role || null,
      canWrite: false,
      canAssign: false,
      members: [],
      workItems: {}
    };
  }

  const client = getAutonomiaServerClient();
  const workspaceId = context.membership.workspace_id;
  const ids = queueItems.map((item) => item.entity_id).filter(Boolean);

  const [workResult, membersResult] = await Promise.all([
    ids.length
      ? client
          .from("work_items")
          .select("id,item_type,item_id,owner_user_id,stage,priority,next_action,due_at,updated_at")
          .eq("workspace_id", workspaceId)
          .in("item_id", ids)
      : Promise.resolve({ data: [], error: null }),
    client
      .from("workspace_members")
      .select("user_id,role,active")
      .eq("workspace_id", workspaceId)
      .eq("active", true)
      .order("created_at", { ascending: true })
  ]);

  if (workResult.error) throw workResult.error;
  if (membersResult.error) throw membersResult.error;

  const memberIds = (membersResult.data || []).map((member) => member.user_id);
  const profilesResult = memberIds.length
    ? await client.from("user_profiles").select("id,display_name").in("id", memberIds)
    : { data: [], error: null };

  if (profilesResult.error) throw profilesResult.error;

  const names = new Map(
    (profilesResult.data || []).map((profile) => [profile.id, profile.display_name || null])
  );

  const members = (membersResult.data || []).map((member) => ({
    ...member,
    display_name: names.get(member.user_id) || null
  }));

  const workItems = Object.fromEntries(
    (workResult.data || []).map((item) => [
      queueKey(item.item_type, item.item_id),
      item
    ])
  );

  return {
    enabled: true,
    workspaceId,
    currentUserId: context.claims.sub,
    role: context.membership.role,
    canWrite: context.membership.role !== "viewer",
    canAssign: canManageWorkspace(context.membership.role),
    members,
    workItems
  };
}

export { queueKey };
