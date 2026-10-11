import { getAutonomiaServerClient } from "./supabase.js";

const NEWSLETTER_ENTITY = "linkedin_newsletter";

function numeric(value) {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function listLinkedinNewsletterMetrics({ workspaceId, limit = 50 } = {}) {
  if (!workspaceId) return [];

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("activity_log")
    .select("entity_id,metadata,created_at")
    .eq("workspace_id", workspaceId)
    .eq("entity_type", NEWSLETTER_ENTITY)
    .eq("action", "metrics_updated")
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(Number(limit) || 50, 1), 100));

  if (error) throw error;
  return data || [];
}

export function latestLinkedinNewsletterMetrics(rows = []) {
  const latest = new Map();

  for (const row of rows) {
    const key = row.entity_id || "newsletter";
    if (latest.has(key)) continue;
    latest.set(key, { ...(row.metadata || {}), updatedAt: row.created_at });
  }

  return {
    newsletter: latest.get("newsletter") || null,
    issues: Object.fromEntries([...latest.entries()].filter(([key]) => key !== "newsletter"))
  };
}

export async function saveLinkedinNewsletterMetrics({
  workspaceId,
  actorUserId = null,
  subscribers = null,
  issueId = "issue-01",
  issueTitle = null,
  impressions = null,
  reactions = null,
  comments = null,
  shares = null,
  clicks = null
} = {}) {
  if (!workspaceId) throw new Error("Workspace is required");

  const client = getAutonomiaServerClient();
  const rows = [];

  if (numeric(subscribers) != null) {
    rows.push({
      workspace_id: workspaceId,
      actor_user_id: actorUserId || null,
      entity_type: NEWSLETTER_ENTITY,
      entity_id: "newsletter",
      action: "metrics_updated",
      metadata: { subscribers: numeric(subscribers), source: "linkedin_manual" }
    });
  }

  const issueMetrics = {
    impressions: numeric(impressions),
    reactions: numeric(reactions),
    comments: numeric(comments),
    shares: numeric(shares),
    clicks: numeric(clicks)
  };

  if (Object.values(issueMetrics).some((value) => value != null)) {
    rows.push({
      workspace_id: workspaceId,
      actor_user_id: actorUserId || null,
      entity_type: NEWSLETTER_ENTITY,
      entity_id: issueId || "issue-01",
      action: "metrics_updated",
      metadata: {
        title: issueTitle || null,
        ...issueMetrics,
        source: "linkedin_manual"
      }
    });
  }

  if (!rows.length) return [];

  const { data, error } = await client
    .from("activity_log")
    .insert(rows)
    .select("entity_id,metadata,created_at");

  if (error) throw error;
  return data || [];
}
