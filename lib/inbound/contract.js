import { z } from "zod";

const nullableText = z.string().trim().max(4000).optional().nullable();
const shortText = z.string().trim().max(320).optional().nullable();

export const inboundLeadSchema = z.object({
  external_lead_id: shortText,
  source_channel: z.string().trim().min(1).max(80),
  source_platform: z.string().trim().min(1).max(120),
  received_at: z.string().datetime().optional().nullable(),

  first_name: shortText,
  last_name: shortText,
  email: z.string().trim().email().max(320).optional().nullable(),
  phone: shortText,
  job_title: shortText,

  company_name: shortText,
  company_domain: shortText,
  company_siren: shortText,
  company_siret: shortText,

  requested_service: shortText,
  message: nullableText,
  estimated_budget: z.union([z.string(), z.number()]).optional().nullable(),
  desired_timeline: shortText,
  company_size: shortText,
  preferred_contact_channel: shortText,

  landing_page_url: z.string().url().max(3000).optional().nullable(),
  landing_page_topic: shortText,
  referrer_url: z.string().url().max(3000).optional().nullable(),
  form_id: shortText,

  campaign_id: shortText,
  campaign_name: shortText,
  adset_id: shortText,
  adset_name: shortText,
  ad_id: shortText,
  ad_name: shortText,
  creative_id: shortText,
  creative_name: shortText,

  utm_source: shortText,
  utm_medium: shortText,
  utm_campaign: shortText,
  utm_content: shortText,
  utm_term: shortText,
  gclid: shortText,
  fbclid: shortText,

  first_touch: z.unknown().optional().nullable(),
  attribution_history: z.array(z.unknown()).max(100).optional().default([]),

  marketing_consent: z.boolean().optional().nullable(),
  consent_timestamp: z.string().datetime().optional().nullable(),
  privacy_notice_version: shortText,
  consent_source: shortText,

  scan_context: z.unknown().optional().nullable()
}).strict();

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  const clean = normalizeText(value).toLowerCase();
  return clean || null;
}

function normalizeDomain(value) {
  const clean = normalizeText(value).toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
  return clean || null;
}

export function inboundLeadDedupeKey(payload) {
  const platform = normalizeText(payload.source_platform).toLowerCase() || "unknown";
  const external = normalizeText(payload.external_lead_id);

  if (external) return `${platform}:external:${external}`;

  const email = normalizeEmail(payload.email) || "no-email";
  const company = normalizeDomain(payload.company_domain)
    || normalizeText(payload.company_name).toLowerCase()
    || "no-company";
  const service = normalizeText(payload.requested_service).toLowerCase() || "general";

  return `${platform}:identity:${email}:${company}:${service}`;
}

export function attributionSnapshot(payload) {
  return {
    landing_page_url: payload.landing_page_url || null,
    landing_page_topic: payload.landing_page_topic || null,
    referrer_url: payload.referrer_url || null,
    form_id: payload.form_id || null,
    campaign_id: payload.campaign_id || null,
    campaign_name: payload.campaign_name || null,
    adset_id: payload.adset_id || null,
    adset_name: payload.adset_name || null,
    ad_id: payload.ad_id || null,
    ad_name: payload.ad_name || null,
    creative_id: payload.creative_id || null,
    creative_name: payload.creative_name || null,
    utm_source: payload.utm_source || null,
    utm_medium: payload.utm_medium || null,
    utm_campaign: payload.utm_campaign || null,
    utm_content: payload.utm_content || null,
    utm_term: payload.utm_term || null,
    gclid: payload.gclid || null,
    fbclid: payload.fbclid || null
  };
}

export function normalizeInboundLead(payload) {
  return {
    ...payload,
    email: normalizeEmail(payload.email),
    company_domain: normalizeDomain(payload.company_domain),
    dedupe_key: inboundLeadDedupeKey(payload),
    attribution: attributionSnapshot(payload)
  };
}
