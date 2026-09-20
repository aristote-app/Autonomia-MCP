import { createHash } from "node:crypto";
import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

const DUPLICATE_WINDOW_DAYS = 30;
const MAX_ATTRIBUTION_HISTORY = 50;

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function clean(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalized(value) {
  return clean(value).toLowerCase();
}

function hash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stable(value[key])])
    );
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stable(value));
}

export function leadKeys(input) {
  const email = normalized(input.email);
  const company = normalized(input.company_name);
  const service = normalized(input.requested_service);

  return {
    contactKey: hash(email),
    dedupeKey: hash([email, company, service].join("|"))
  };
}

export function buildTouchpoint(input) {
  return {
    source_channel: input.source_channel,
    source_platform: input.source_platform,
    landing_page_url: input.landing_page_url || null,
    landing_page_topic: input.landing_page_topic || null,
    referrer_url: input.referrer_url || null,
    form_id: input.form_id || null,
    utm_source: input.utm_source || null,
    utm_medium: input.utm_medium || null,
    utm_campaign: input.utm_campaign || null,
    utm_content: input.utm_content || null,
    utm_term: input.utm_term || null,
    campaign_id: input.campaign_id || null,
    adset_id: input.adset_id || null,
    ad_id: input.ad_id || null,
    creative_id: input.creative_id || null,
    gclid: input.gclid || null,
    fbclid: input.fbclid || null
  };
}

function historyKey(value) {
  return hash(stableStringify(value));
}

export function mergeAttributionHistory(...groups) {
  const unique = new Map();

  for (const group of groups) {
    const values = Array.isArray(group) ? group : group ? [group] : [];
    for (const value of values) {
      if (!value || typeof value !== "object") continue;
      unique.set(historyKey(value), value);
    }
  }

  return [...unique.values()].slice(-MAX_ATTRIBUTION_HISTORY);
}

export function nextActionForScan(scanContext) {
  const plan = scanContext?.plan;

  if (plan === "experts") {
    return "Qualifier le besoin puis préparer la recherche de profils IA.";
  }
  if (plan === "academy") {
    return "Qualifier les publics puis cadrer le parcours de formation IA.";
  }
  if (plan === "hybrid") {
    return "Qualifier le besoin puis cadrer expertise externe et montée en compétences.";
  }

  return "Qualifier le lead et déterminer la prochaine action.";
}

async function resolveDefaultWorkspace(client) {
  const slug = clean(process.env.AUTONOMIA_DEFAULT_WORKSPACE_SLUG);
  if (!slug) return null;

  const { data, error } = await client
    .from("workspaces")
    .select("id,slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data?.id || null;
}

async function findLead(client, input, dedupeKey) {
  const { data: exact, error: exactError } = await client
    .from("inbound_leads")
    .select("*")
    .eq("external_lead_id", input.external_lead_id)
    .maybeSingle();

  if (exactError) throw exactError;
  if (exact) return { lead: exact, matchMethod: "external_lead_id" };

  const cutoff = new Date(
    Date.now() - DUPLICATE_WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: recent, error: recentError } = await client
    .from("inbound_leads")
    .select("*")
    .eq("dedupe_key", dedupeKey)
    .gte("last_received_at", cutoff)
    .order("last_received_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recentError) throw recentError;
  if (recent) return { lead: recent, matchMethod: "recent_contact_company_service" };

  return { lead: null, matchMethod: null };
}

async function createOrUpdateLead(client, input) {
  const receivedAt = input.received_at;
  const keys = leadKeys(input);
  const currentTouch = buildTouchpoint(input);
  const found = await findLead(client, input, keys.dedupeKey);
  const workspaceId = found.lead?.workspace_id || await resolveDefaultWorkspace(client);

  if (!found.lead) {
    const firstTouch = input.first_touch || currentTouch;
    const attributionHistory = mergeAttributionHistory(
      input.attribution_history,
      currentTouch
    );

    const { data, error } = await client
      .from("inbound_leads")
      .insert({
        external_lead_id: input.external_lead_id,
        workspace_id: workspaceId,
        source_channel: input.source_channel,
        source_platform: input.source_platform,
        first_name: clean(input.first_name),
        last_name: clean(input.last_name) || null,
        email: normalized(input.email),
        phone: clean(input.phone) || null,
        company_name: clean(input.company_name),
        requested_service: clean(input.requested_service),
        message: clean(input.message) || null,
        desired_timeline: clean(input.desired_timeline) || null,
        company_size: clean(input.company_size) || null,
        contact_key: keys.contactKey,
        dedupe_key: keys.dedupeKey,
        scan_context: input.scan_context || null,
        marketing_consent: input.marketing_consent === true,
        consent_timestamp: input.consent_timestamp,
        privacy_notice_version: input.privacy_notice_version,
        consent_source: input.consent_source,
        first_received_at: receivedAt,
        last_received_at: receivedAt,
        first_touch: firstTouch,
        latest_touch: currentTouch,
        attribution_history: attributionHistory
      })
      .select("*")
      .single();

    if (error) throw error;
    return { lead: data, created: true, matchMethod: "new" };
  }

  const existing = found.lead;
  const attributionHistory = mergeAttributionHistory(
    existing.attribution_history,
    input.attribution_history,
    currentTouch
  );

  const consentGrantedNow = input.marketing_consent === true;

  const { data, error } = await client
    .from("inbound_leads")
    .update({
      workspace_id: workspaceId,
      source_channel: input.source_channel,
      source_platform: input.source_platform,
      first_name: clean(input.first_name) || existing.first_name,
      last_name: clean(input.last_name) || existing.last_name,
      phone: clean(input.phone) || existing.phone,
      company_name: clean(input.company_name) || existing.company_name,
      message: clean(input.message) || existing.message,
      desired_timeline: clean(input.desired_timeline) || existing.desired_timeline,
      company_size: clean(input.company_size) || existing.company_size,
      scan_context: input.scan_context || existing.scan_context,
      marketing_consent: existing.marketing_consent || consentGrantedNow,
      consent_timestamp: consentGrantedNow
        ? input.consent_timestamp
        : existing.consent_timestamp,
      privacy_notice_version: consentGrantedNow
        ? input.privacy_notice_version
        : existing.privacy_notice_version,
      consent_source: consentGrantedNow
        ? input.consent_source
        : existing.consent_source,
      last_received_at: receivedAt,
      first_touch: existing.first_touch || input.first_touch || currentTouch,
      latest_touch: currentTouch,
      attribution_history: attributionHistory,
      updated_at: new Date().toISOString()
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) throw error;

  return {
    lead: data,
    created: false,
    matchMethod: found.matchMethod
  };
}

async function persistTouchpoint(client, leadId, input) {
  const touch = buildTouchpoint(input);

  const { error } = await client
    .from("inbound_lead_touchpoints")
    .insert({
      lead_id: leadId,
      occurred_at: input.received_at,
      ...touch,
      first_touch: input.first_touch || null,
      attribution_history: Array.isArray(input.attribution_history)
        ? input.attribution_history.slice(-MAX_ATTRIBUTION_HISTORY)
        : []
    });

  if (error) throw error;
}

async function persistEvidence(client, leadId, input) {
  const eventHash = hash(
    stableStringify({
      type: "lead_received",
      external_lead_id: input.external_lead_id,
      payload: input
    })
  );

  const { error } = await client
    .from("inbound_lead_events")
    .upsert(
      {
        lead_id: leadId,
        event_type: "lead_received",
        occurred_at: input.received_at,
        event_hash: eventHash,
        payload: input
      },
      { onConflict: "lead_id,event_hash", ignoreDuplicates: true }
    );

  if (error) throw error;
}

async function ensureWorkItem(client, lead) {
  if (!lead.workspace_id) {
    return { linked: false, reason: "default_workspace_not_configured" };
  }

  const { data, error } = await client
    .from("work_items")
    .upsert(
      {
        workspace_id: lead.workspace_id,
        item_type: "inbound_lead",
        item_id: lead.id,
        stage: "new",
        priority: "normal",
        next_action: nextActionForScan(lead.scan_context)
      },
      { onConflict: "workspace_id,item_type,item_id" }
    )
    .select("id,workspace_id,stage,next_action")
    .single();

  if (error) throw error;

  await client.from("activity_log").insert({
    workspace_id: lead.workspace_id,
    entity_type: "inbound_lead",
    entity_id: lead.id,
    action: "lead_received",
    metadata: {
      requested_service: lead.requested_service,
      source_channel: lead.source_channel,
      source_platform: lead.source_platform
    }
  });

  return { linked: true, workItem: data };
}

export async function ingestInboundLead(input) {
  const client = requireDatabase();
  const result = await createOrUpdateLead(client, input);

  await Promise.all([
    persistTouchpoint(client, result.lead.id, input),
    persistEvidence(client, result.lead.id, input)
  ]);

  const workItem = await ensureWorkItem(client, result.lead);

  return {
    accepted: true,
    lead_id: result.lead.id,
    created: result.created,
    match_method: result.matchMethod,
    workspace_linked: workItem.linked,
    work_item_id: workItem.workItem?.id || null
  };
}

export { DUPLICATE_WINDOW_DAYS, MAX_ATTRIBUTION_HISTORY };
