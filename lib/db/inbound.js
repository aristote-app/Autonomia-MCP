import { createHash } from "node:crypto";
import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";
import { persistOpportunityItems } from "./persist.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
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

function hashPayload(value) {
  return createHash("sha256")
    .update(JSON.stringify(stable(value)))
    .digest("hex");
}

function numericBudget(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function opportunityTypeFor(service) {
  const value = String(service || "").toLowerCase();
  if (/academy|formation|training/.test(value)) return "training_ai";
  if (/expert|freelance|consultant|staff|talent/.test(value)) return "freelance_ai";
  return "private_ai";
}

function scanSummary(scanContext) {
  if (!scanContext || typeof scanContext !== "object") return null;

  const parts = [];
  if (scanContext.plan) parts.push(`Plan: ${scanContext.plan}`);
  if (scanContext.objective) parts.push(`Objectif: ${scanContext.objective}`);
  if (scanContext.stage) parts.push(`Stade: ${scanContext.stage}`);
  if (scanContext.gap) parts.push(`Blocage: ${scanContext.gap}`);

  const roles = Array.isArray(scanContext.recommended_roles)
    ? scanContext.recommended_roles.filter(Boolean)
    : [];
  if (roles.length) parts.push(`Profils probables: ${roles.join(", ")}`);

  return parts.length ? parts.join(" · ") : null;
}

function opportunityDescription(payload) {
  return [payload.message, scanSummary(payload.scan_context)]
    .filter(Boolean)
    .join("\n\n");
}

function leadDisplayName(payload) {
  const person = [payload.first_name, payload.last_name].filter(Boolean).join(" ").trim();
  return payload.company_name || person || payload.email || "Lead entrant";
}

export async function persistInboundLead(payload, rawPayload = payload) {
  const client = requireDatabase();
  const now = new Date().toISOString();

  const { data: existing, error: lookupError } = await client
    .from("inbound_leads")
    .select("id,first_touch,created_at")
    .eq("dedupe_key", payload.dedupe_key)
    .maybeSingle();

  if (lookupError) throw lookupError;

  const leadFields = {
    external_lead_id: payload.external_lead_id || null,
    source_channel: payload.source_channel,
    source_platform: payload.source_platform,
    first_name: payload.first_name || null,
    last_name: payload.last_name || null,
    email: payload.email || null,
    phone: payload.phone || null,
    job_title: payload.job_title || null,
    company_name: payload.company_name || null,
    company_domain: payload.company_domain || null,
    requested_service: payload.requested_service || null,
    message: payload.message || null,
    desired_timeline: payload.desired_timeline || null,
    company_size: payload.company_size || null,
    preferred_contact_channel: payload.preferred_contact_channel || null,
    marketing_consent: payload.marketing_consent ?? null,
    consent_timestamp: payload.consent_timestamp || null,
    privacy_notice_version: payload.privacy_notice_version || null,
    consent_source: payload.consent_source || null,
    latest_attribution: payload.attribution || {},
    scan_context: payload.scan_context || null,
    last_seen_at: now,
    updated_at: now
  };

  let lead;

  if (existing?.id) {
    const { data, error } = await client
      .from("inbound_leads")
      .update(leadFields)
      .eq("id", existing.id)
      .select("id,dedupe_key,status,first_touch,first_seen_at,last_seen_at")
      .single();

    if (error) throw error;
    lead = data;
  } else {
    const { data, error } = await client
      .from("inbound_leads")
      .insert({
        ...leadFields,
        dedupe_key: payload.dedupe_key,
        first_touch:
          payload.first_touch && typeof payload.first_touch === "object"
            ? payload.first_touch
            : payload.attribution || {},
        first_seen_at: payload.received_at || now
      })
      .select("id,dedupe_key,status,first_touch,first_seen_at,last_seen_at")
      .single();

    if (error) throw error;
    lead = data;
  }

  const touchpointHash = hashPayload(rawPayload);
  const { error: touchpointError } = await client
    .from("inbound_touchpoints")
    .upsert(
      {
        lead_id: lead.id,
        external_lead_id: payload.external_lead_id || null,
        received_at: payload.received_at || now,
        source_channel: payload.source_channel,
        source_platform: payload.source_platform,
        landing_page_url: payload.landing_page_url || null,
        landing_page_topic: payload.landing_page_topic || null,
        referrer_url: payload.referrer_url || null,
        form_id: payload.form_id || null,
        attribution: payload.attribution || {},
        consent: {
          marketing_consent: payload.marketing_consent ?? null,
          consent_timestamp: payload.consent_timestamp || null,
          privacy_notice_version: payload.privacy_notice_version || null,
          consent_source: payload.consent_source || null
        },
        raw_payload: rawPayload,
        payload_hash: touchpointHash
      },
      { onConflict: "lead_id,payload_hash" }
    );

  if (touchpointError) throw touchpointError;

  const opportunityItem = {
    source: "website_inbound",
    sourceId: payload.external_lead_id || lead.id,
    sourceUrl: payload.landing_page_url || null,
    opportunityType: opportunityTypeFor(payload.requested_service),
    title: `Inbound · ${payload.requested_service || "Besoin IA"} · ${leadDisplayName(payload)}`,
    description: opportunityDescription(payload) || null,
    companyName: payload.company_name || null,
    publishedAt: payload.received_at || now,
    budgetMin: numericBudget(payload.estimated_budget),
    budgetMax: numericBudget(payload.estimated_budget),
    contractType: "inbound_request",
    raw: rawPayload
  };

  const persisted = await persistOpportunityItems([opportunityItem]);
  const result = persisted.results?.[0] || null;

  if (result) {
    const { error: linkError } = await client
      .from("inbound_leads")
      .update({
        company_org_id: result.companyOrgId || null,
        opportunity_id: result.opportunityId || null,
        updated_at: now
      })
      .eq("id", lead.id);

    if (linkError) throw linkError;
  }

  return {
    leadId: lead.id,
    status: lead.status,
    created: !existing?.id,
    opportunityId: result?.opportunityId || null,
    companyOrgId: result?.companyOrgId || null,
    touchpointHash
  };
}
