"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAutonomiaServerClient } from "../../lib/db/supabase.js";
import {
  WORKSPACE_ROLES,
  requireWorkspaceAdmin
} from "../../lib/auth/access.js";
import {
  authConfigured,
  getCurrentClaims
} from "../../lib/auth/server.js";
import {
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh
} from "../../lib/market/automatedRefresh.js";

function slugify(value) {
  return String(value || "autonomia")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "autonomia";
}

function redirectAdmin(params = {}) {
  const search = new URLSearchParams(params);
  redirect(search.size ? `/admin?${search.toString()}` : "/admin");
}

export async function bootstrapWorkspace(formData) {
  if (!authConfigured()) {
    redirectAdmin({ error: "auth_not_configured" });
  }

  const claims = await getCurrentClaims();
  if (!claims?.sub) {
    redirect("/login?next=/admin");
  }

  const client = getAutonomiaServerClient();
  const { count, error: countError } = await client
    .from("workspaces")
    .select("id", { count: "exact", head: true });

  if (countError) throw countError;
  if ((count || 0) > 0) {
    redirectAdmin({ error: "workspace_already_exists" });
  }

  const name = String(formData.get("name") || "Autonomia").trim() || "Autonomia";
  const displayName = String(formData.get("display_name") || "").trim() || null;

  const { data: workspace, error: workspaceError } = await client
    .from("workspaces")
    .insert({
      name,
      slug: slugify(name),
      created_by: claims.sub
    })
    .select("id,name,slug")
    .single();

  if (workspaceError) throw workspaceError;

  const [profileResult, memberResult] = await Promise.all([
    client.from("user_profiles").upsert({
      id: claims.sub,
      display_name: displayName
    }),
    client.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: claims.sub,
      role: "admin",
      active: true,
      invited_by: claims.sub
    })
  ]);

  if (profileResult.error) throw profileResult.error;
  if (memberResult.error) throw memberResult.error;

  const { error: activityError } = await client.from("activity_log").insert({
    workspace_id: workspace.id,
    actor_user_id: claims.sub,
    entity_type: "workspace",
    entity_id: workspace.id,
    action: "workspace_bootstrapped",
    metadata: {
      name: workspace.name,
      slug: workspace.slug
    }
  });

  if (activityError) throw activityError;

  revalidatePath("/admin");
  redirectAdmin({ success: "workspace_created" });
}

export async function inviteMember(formData) {
  const context = await requireWorkspaceAdmin();
  if (!context.authorized) {
    redirect(context.reason === "not_authenticated" ? "/login?next=/admin" : "/");
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") || "").trim() || null;
  const role = String(formData.get("role") || "viewer");

  if (!email || !email.includes("@")) {
    redirectAdmin({ error: "invalid_email" });
  }

  if (!WORKSPACE_ROLES.includes(role)) {
    redirectAdmin({ error: "invalid_role" });
  }

  const client = getAutonomiaServerClient();
  const { data, error } = await client.auth.admin.inviteUserByEmail(email);

  if (error) {
    redirectAdmin({ error: "invite_failed" });
  }

  const userId = data?.user?.id;
  if (!userId) {
    redirectAdmin({ error: "invite_missing_user" });
  }

  const [profileResult, memberResult] = await Promise.all([
    client.from("user_profiles").upsert({
      id: userId,
      display_name: displayName
    }),
    client.from("workspace_members").upsert({
      workspace_id: context.membership.workspace_id,
      user_id: userId,
      role,
      active: true,
      invited_by: context.claims.sub,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "workspace_id,user_id"
    })
  ]);

  if (profileResult.error) throw profileResult.error;
  if (memberResult.error) throw memberResult.error;

  await client.from("activity_log").insert({
    workspace_id: context.membership.workspace_id,
    actor_user_id: context.claims.sub,
    entity_type: "workspace_member",
    entity_id: userId,
    action: "member_invited",
    metadata: { email, role }
  });

  revalidatePath("/admin");
  redirectAdmin({ success: "member_invited" });
}

async function ensureAdminCanBeChanged(client, workspaceId, targetUserId, nextRole, nextActive) {
  const { data: target, error: targetError } = await client
    .from("workspace_members")
    .select("role,active")
    .eq("workspace_id", workspaceId)
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (targetError) throw targetError;
  if (!target) return;

  const removesAdmin =
    target.role === "admin" &&
    target.active &&
    (nextRole !== "admin" || nextActive === false);

  if (!removesAdmin) return;

  const { count, error } = await client
    .from("workspace_members")
    .select("user_id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .eq("role", "admin")
    .eq("active", true);

  if (error) throw error;
  if ((count || 0) <= 1) {
    redirectAdmin({ error: "last_admin" });
  }
}

export async function updateMemberRole(formData) {
  const context = await requireWorkspaceAdmin();
  if (!context.authorized) {
    redirect(context.reason === "not_authenticated" ? "/login?next=/admin" : "/");
  }

  const userId = String(formData.get("user_id") || "");
  const role = String(formData.get("role") || "");

  if (!userId || !WORKSPACE_ROLES.includes(role)) {
    redirectAdmin({ error: "invalid_member_update" });
  }

  const client = getAutonomiaServerClient();
  await ensureAdminCanBeChanged(
    client,
    context.membership.workspace_id,
    userId,
    role,
    true
  );

  const { error } = await client
    .from("workspace_members")
    .update({
      role,
      updated_at: new Date().toISOString()
    })
    .eq("workspace_id", context.membership.workspace_id)
    .eq("user_id", userId);

  if (error) throw error;

  await client.from("activity_log").insert({
    workspace_id: context.membership.workspace_id,
    actor_user_id: context.claims.sub,
    entity_type: "workspace_member",
    entity_id: userId,
    action: "member_role_changed",
    metadata: { role }
  });

  revalidatePath("/admin");
  redirectAdmin({ success: "role_updated" });
}

export async function setMemberActive(formData) {
  const context = await requireWorkspaceAdmin();
  if (!context.authorized) {
    redirect(context.reason === "not_authenticated" ? "/login?next=/admin" : "/");
  }

  const userId = String(formData.get("user_id") || "");
  const active = String(formData.get("active") || "") === "true";

  if (!userId) {
    redirectAdmin({ error: "invalid_member_update" });
  }

  if (!active && userId === context.claims.sub) {
    redirectAdmin({ error: "cannot_disable_self" });
  }

  const client = getAutonomiaServerClient();
  await ensureAdminCanBeChanged(
    client,
    context.membership.workspace_id,
    userId,
    null,
    active
  );

  const { error } = await client
    .from("workspace_members")
    .update({
      active,
      updated_at: new Date().toISOString()
    })
    .eq("workspace_id", context.membership.workspace_id)
    .eq("user_id", userId);

  if (error) throw error;

  await client.from("activity_log").insert({
    workspace_id: context.membership.workspace_id,
    actor_user_id: context.claims.sub,
    entity_type: "workspace_member",
    entity_id: userId,
    action: active ? "member_activated" : "member_deactivated",
    metadata: {}
  });

  revalidatePath("/admin");
  redirectAdmin({ success: active ? "member_activated" : "member_deactivated" });
}

export async function refreshMarketNow() {
  const context = await requireWorkspaceAdmin();
  if (!context.authorized) {
    redirect(context.reason === "not_authenticated" ? "/login?next=/admin" : "/");
  }

  const client = getAutonomiaServerClient();

  let freelance;
  try {
    freelance = await runAutomatedFreelanceRefresh({
      category: "ia",
      limit: 50,
      triggerMode: "on_demand"
    });
  } catch (error) {
    await client.from("activity_log").insert({
      workspace_id: context.membership.workspace_id,
      actor_user_id: context.claims.sub,
      entity_type: "collector",
      entity_id: "freework",
      action: "market_refresh_failed",
      metadata: {
        source: "freework",
        error: error instanceof Error ? error.message : String(error)
      }
    });

    revalidatePath("/admin");
    revalidatePath("/");
    redirectAdmin({ error: "market_refresh_failed" });
  }

  let jobSignals;
  try {
    jobSignals = await runAutomatedJobSignalRefresh({
      triggerMode: "on_demand"
    });
  } catch (error) {
    jobSignals = {
      available: false,
      reason: error instanceof Error ? error.message : String(error),
      discoveredRows: 0,
      persistedRows: 0
    };
  }

  await client.from("activity_log").insert({
    workspace_id: context.membership.workspace_id,
    actor_user_id: context.claims.sub,
    entity_type: "collector",
    entity_id: "market-refresh",
    action: "market_refresh_completed",
    metadata: {
      freework_fetched: freelance?.fetchedRows || 0,
      freework_persisted: freelance?.persistedRows || 0,
      job_signals_available: Boolean(jobSignals?.available),
      job_signals_discovered: jobSignals?.discoveredRows || 0,
      job_signals_persisted: jobSignals?.persistedRows || 0,
      job_signals_reason: jobSignals?.reason || null
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");

  redirectAdmin({
    success: "market_refreshed",
    freelance: String(freelance?.persistedRows || 0),
    signals: String(jobSignals?.persistedRows || 0),
    signals_status: jobSignals?.available ? "ok" : "unavailable"
  });
}

