import { getAutonomiaServerClient } from "../db/supabase.js";
import { getCurrentClaims, authConfigured } from "./server.js";

export const WORKSPACE_ROLES = Object.freeze([
  "admin",
  "direction",
  "public_markets",
  "sales",
  "staffing",
  "contributor",
  "viewer"
]);

export const ADMIN_ROLES = new Set(["admin", "direction"]);

export function canManageWorkspace(role) {
  return ADMIN_ROLES.has(role);
}

export async function getCurrentWorkspaceMembership() {
  if (!authConfigured()) {
    return {
      configured: false,
      claims: null,
      membership: null
    };
  }

  const claims = await getCurrentClaims();
  if (!claims?.sub) {
    return {
      configured: true,
      claims: null,
      membership: null
    };
  }

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("workspace_members")
    .select("workspace_id,user_id,role,active,workspaces(id,name,slug)")
    .eq("user_id", claims.sub)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return {
    configured: true,
    claims,
    membership: data || null
  };
}

export async function requireWorkspaceAdmin() {
  const context = await getCurrentWorkspaceMembership();

  if (!context.configured) {
    return {
      ...context,
      authorized: false,
      reason: "auth_not_configured"
    };
  }

  if (!context.claims) {
    return {
      ...context,
      authorized: false,
      reason: "not_authenticated"
    };
  }

  if (!context.membership || !canManageWorkspace(context.membership.role)) {
    return {
      ...context,
      authorized: false,
      reason: "not_authorized"
    };
  }

  return {
    ...context,
    authorized: true,
    reason: null
  };
}
