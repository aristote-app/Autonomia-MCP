import { getAutonomiaServerClient } from "./supabase.js";

async function resolveInboundWorkspaceId(client, preferredWorkspaceId = null) {
  if (preferredWorkspaceId) return preferredWorkspaceId;
  if (process.env.AUTONOMIA_DEFAULT_WORKSPACE_ID) {
    return process.env.AUTONOMIA_DEFAULT_WORKSPACE_ID;
  }

  const { data: autonomiaWorkspace, error: autonomiaError } = await client
    .from("workspaces")
    .select("id,name,slug")
    .eq("slug", "autonomia")
    .limit(1)
    .maybeSingle();

  if (autonomiaError) throw autonomiaError;
  if (autonomiaWorkspace?.id) return autonomiaWorkspace.id;

  const { data: workspaces, error: workspaceError } = await client
    .from("workspaces")
    .select("id,name,slug")
    .limit(2);

  if (workspaceError) throw workspaceError;
  if ((workspaces || []).length === 1) return workspaces[0].id;

  throw new Error("Inbound workspace is not configured");
}

function uniqueAttributions(items = []) {
  const seen = new Set();
  const out = [];

  for (const item of items) {
    const key = JSON.stringify(item || {});
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out.slice(-100);
}

export async function persistInboundLead(normalized) {
  if (!normalized?.external_lead_id || !normalized?.dedupe_key) {
    throw new Error("Normalized inbound lead is required");
  }

  const client = getAutonomiaServerClient();
  const workspaceId = await resolveInboundWorkspaceId(
    client,
    normalized.workspace_id || null
  );

  let { data: existing, error: externalError } = await client
    .from("inbound_leads")
    .select("*")
    .eq("external_lead_id", normalized.external_lead_id)
    .maybeSingle();

  if (externalError) throw externalError;

  if (!existing) {
    const { data, error } = await client
      .from("inbound_leads")
      .select("*")
      .eq("dedupe_key", normalized.dedupe_key)
      .order("last_received_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    existing = data || null;
  }

  const touch = {
    occurred_at: normalized.received_at,
    source_channel: normalized.source_channel,
    source_platform: normalized.source_platform,
    ...normalized.attribution
  };

  let lead;

  if (!existing) {
    const { data, error } = await client
      .from("inbound_leads")
      .insert({
        external_lead_id: normalized.external_lead_id,
        workspace_id: workspaceId,
        source_channel: normalized.source_channel,
        source_platform: normalized.source_platform,
        first_name: normalized.first_name,
        last_name: normalized.last_name,
        email: normalized.email,
        phone: normalized.phone,
        company_name: normalized.company_name,
        requested_service: normalized.requested_service,
        message: normalized.message,
        desired_timeline: normalized.desired_timeline,
        company_size: normalized.company_size,
        status: "new",
        contact_key: normalized.contact_key,
        dedupe_key: normalized.dedupe_key,
        scan_context: normalized.scan_context,
        marketing_consent: normalized.marketing_consent,
        consent_timestamp: normalized.consent_timestamp,
        privacy_notice_version: normalized.privacy_notice_version,
        consent_source: normalized.consent_source,
        first_received_at: normalized.received_at,
        last_received_at: normalized.received_at,
        first_touch: touch,
        latest_touch: touch,
        attribution_history: [touch]
      })
      .select("*")
      .single();

    if (error) throw error;
    lead = data;
  } else {
    const history = uniqueAttributions([
      ...(Array.isArray(existing.attribution_history) ? existing.attribution_history : []),
      touch
    ]);

    const { data, error } = await client
      .from("inbound_leads")
      .update({
        workspace_id: existing.workspace_id || workspaceId,
        source_channel: normalized.source_channel,
        source_platform: normalized.source_platform,
        first_name: normalized.first_name || existing.first_name,
        last_name: normalized.last_name || existing.last_name,
        phone: normalized.phone || existing.phone,
        company_name: normalized.company_name || existing.company_name,
        requested_service: normalized.requested_service || existing.requested_service,
        message: normalized.message || existing.message,
        desired_timeline: normalized.desired_timeline || existing.desired_timeline,
        company_size: normalized.company_size || existing.company_size,
        scan_context: normalized.scan_context,
        marketing_consent: normalized.marketing_consent,
        consent_timestamp: normalized.consent_timestamp,
        privacy_notice_version: normalized.privacy_notice_version,
        consent_source: normalized.consent_source,
        last_received_at: normalized.received_at,
        latest_touch: touch,
        attribution_history: history,
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw error;
    lead = data;
  }

  const { data: duplicateEvent, error: duplicateEventError } = await client
    .from("inbound_lead_events")
    .select("id")
    .eq("event_hash", normalized.event_hash)
    .maybeSingle();

  if (duplicateEventError) throw duplicateEventError;

  if (!duplicateEvent) {
    const { error: eventError } = await client
      .from("inbound_lead_events")
      .insert({
        lead_id: lead.id,
        event_type: existing ? "lead_received_again" : "lead_received",
        occurred_at: normalized.received_at,
        event_hash: normalized.event_hash,
        payload: normalized
      });

    if (eventError) throw eventError;

    const { error: touchError } = await client
      .from("inbound_lead_touchpoints")
      .insert({
        lead_id: lead.id,
        occurred_at: normalized.received_at,
        source_channel: normalized.source_channel,
        source_platform: normalized.source_platform,
        landing_page_url: normalized.attribution.landing_page_url,
        landing_page_topic: normalized.attribution.landing_page_topic,
        referrer_url: normalized.attribution.referrer_url,
        form_id: normalized.attribution.form_id,
        utm_source: normalized.attribution.utm_source,
        utm_medium: normalized.attribution.utm_medium,
        utm_campaign: normalized.attribution.utm_campaign,
        utm_content: normalized.attribution.utm_content,
        utm_term: normalized.attribution.utm_term,
        campaign_id: normalized.attribution.campaign_id,
        adset_id: normalized.attribution.adset_id,
        ad_id: normalized.attribution.ad_id,
        creative_id: normalized.attribution.creative_id,
        gclid: normalized.attribution.gclid,
        fbclid: normalized.attribution.fbclid,
        first_touch: lead.first_touch,
        attribution_history: lead.attribution_history || []
      });

    if (touchError) throw touchError;
  }

  return {
    lead,
    created: !existing,
    duplicate_event: Boolean(duplicateEvent)
  };
}

export async function listInboundLeads({
  workspaceId,
  status = null,
  limit = 200
} = {}) {
  if (!workspaceId) return [];

  const client = getAutonomiaServerClient();
  let query = client
    .from("inbound_leads")
    .select(
      "id,external_lead_id,workspace_id,owner_user_id,source_channel,source_platform,first_name,last_name,email,phone,company_name,requested_service,message,desired_timeline,company_size,status,scan_context,marketing_consent,consent_timestamp,first_received_at,last_received_at,first_touch,latest_touch,created_at,updated_at"
    )
    .eq("workspace_id", workspaceId)
    .order("last_received_at", { ascending: false })
    .limit(Math.min(Math.max(Number(limit) || 200, 1), 500));

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function setInboundLeadStatus({
  workspaceId,
  leadId,
  status,
  ownerUserId = undefined
} = {}) {
  const allowed = new Set([
    "new",
    "enriched",
    "qualified",
    "needs_review",
    "contacted",
    "meeting",
    "proposal",
    "negotiation",
    "won",
    "lost",
    "disqualified"
  ]);

  if (!allowed.has(status)) throw new Error("Invalid inbound lead status");

  const client = getAutonomiaServerClient();
  const update = {
    status,
    updated_at: new Date().toISOString()
  };
  if (ownerUserId !== undefined) update.owner_user_id = ownerUserId || null;

  const { data, error } = await client
    .from("inbound_leads")
    .update(update)
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Inbound lead not found");
  return data;
}


export async function claimUnassignedPublicInboundLeads({ workspaceId } = {}) {
  if (!workspaceId) return 0;

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("inbound_leads")
    .update({
      workspace_id: workspaceId,
      updated_at: new Date().toISOString()
    })
    .is("workspace_id", null)
    .eq("source_platform", "autonomia_public_site")
    .select("id");

  if (error) throw error;
  return Array.isArray(data) ? data.length : 0;
}

export async function updateInboundLeadFollowUp({
  workspaceId,
  leadId,
  status,
  nextAction,
  followUpNote,
  followUpDueAt,
  priority
} = {}) {
  const allowedStatuses = new Set([
    "new",
    "enriched",
    "qualified",
    "needs_review",
    "contacted",
    "meeting",
    "proposal",
    "negotiation",
    "won",
    "lost",
    "disqualified"
  ]);
  const allowedPriorities = new Set(["low", "normal", "high", "urgent"]);

  if (!workspaceId || !leadId) throw new Error("Workspace and lead are required");
  if (!allowedStatuses.has(status)) throw new Error("Invalid inbound lead status");
  if (!allowedPriorities.has(priority)) throw new Error("Invalid inbound lead priority");

  const client = getAutonomiaServerClient();
  const { data: existing, error: existingError } = await client
    .from("inbound_leads")
    .select("scan_context")
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) throw new Error("Inbound lead not found");

  const scanContext =
    existing.scan_context && typeof existing.scan_context === "object"
      ? existing.scan_context
      : {};

  const { data, error } = await client
    .from("inbound_leads")
    .update({
      status,
      scan_context: {
        ...scanContext,
        next_action: nextAction || null,
        follow_up_note: followUpNote || null,
        follow_up_due_at: followUpDueAt || null,
        priority
      },
      updated_at: new Date().toISOString()
    })
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Inbound lead not found");
  return data;
}
