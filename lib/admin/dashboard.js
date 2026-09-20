import { getAutonomiaServerClient } from "../db/supabase.js";
import { authConfigured, getCurrentClaims } from "../auth/server.js";
import { canManageWorkspace } from "../auth/access.js";

function stageCounts(items = []) {
  return items.reduce((acc, item) => {
    acc[item.stage] = (acc[item.stage] || 0) + 1;
    return acc;
  }, {});
}

export async function getAdminDashboard() {
  if (!authConfigured()) {
    return {
      state: "auth_not_configured"
    };
  }

  const claims = await getCurrentClaims();
  if (!claims?.sub) {
    return {
      state: "not_authenticated"
    };
  }

  const client = getAutonomiaServerClient();

  const { data: membership, error: membershipError } = await client
    .from("workspace_members")
    .select("workspace_id,user_id,role,active,workspaces(id,name,slug)")
    .eq("user_id", claims.sub)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (membershipError) throw membershipError;

  if (!membership) {
    const { count, error } = await client
      .from("workspaces")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return {
      state: (count || 0) === 0 ? "bootstrap" : "not_authorized",
      claims
    };
  }

  if (!canManageWorkspace(membership.role)) {
    return {
      state: "not_authorized",
      claims,
      membership
    };
  }

  const workspaceId = membership.workspace_id;

  const [
    membersResult,
    workItemsResult,
    activitiesResult,
    opportunitiesResult,
    signalsResult,
    collectorRunsResult
  ] = await Promise.all([
    client
      .from("workspace_members")
      .select("workspace_id,user_id,role,active,created_at,updated_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true }),
    client
      .from("work_items")
      .select("id,item_type,item_id,owner_user_id,stage,priority,next_action,due_at,updated_at")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false })
      .limit(500),
    client
      .from("activity_log")
      .select("id,actor_user_id,entity_type,entity_id,action,metadata,created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(30),
    client.from("opportunities").select("id", { count: "exact", head: true }),
    client.from("content_job_signals").select("id", { count: "exact", head: true }),
    client
      .from("collector_runs")
      .select("id,source_id,status,started_at,completed_at,stats,error_message")
      .order("started_at", { ascending: false })
      .limit(20)
  ]);

  const firstError = [
    membersResult.error,
    workItemsResult.error,
    activitiesResult.error,
    opportunitiesResult.error,
    signalsResult.error,
    collectorRunsResult.error
  ].find(Boolean);

  if (firstError) throw firstError;

  const rawMembers = membersResult.data || [];
  const memberIds = rawMembers.map((member) => member.user_id);

  const [{ data: authUsers, error: authUsersError }, profilesResult] = await Promise.all([
    client.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    memberIds.length
      ? client.from("user_profiles").select("id,display_name").in("id", memberIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (authUsersError) throw authUsersError;
  if (profilesResult.error) throw profilesResult.error;

  const emailById = new Map(
    (authUsers?.users || []).map((user) => [user.id, user.email || null])
  );
  const displayNameById = new Map(
    (profilesResult.data || []).map((profile) => [profile.id, profile.display_name || null])
  );

  const members = rawMembers.map((member) => ({
    ...member,
    email: emailById.get(member.user_id) || null,
    display_name: displayNameById.get(member.user_id) || null
  }));

  const workItems = workItemsResult.data || [];
  const activeMembers = members.filter((member) => member.active).length;

  return {
    state: "ready",
    claims,
    membership,
    workspace: membership.workspaces,
    metrics: {
      activeMembers,
      opportunities: opportunitiesResult.count || 0,
      jobSignals: signalsResult.count || 0,
      workItems: workItems.length
    },
    stageCounts: stageCounts(workItems),
    members,
    recentActivities: activitiesResult.data || [],
    collectorRuns: collectorRunsResult.data || []
  };
}
