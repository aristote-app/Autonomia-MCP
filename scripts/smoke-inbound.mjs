import assert from "node:assert/strict";
import {
  inboundLeadSchema,
  normalizeInboundLead,
  inboundLeadDedupeKey,
  attributionSnapshot
} from "../lib/inbound/contract.js";

const raw = {
  external_lead_id: "lead-123",
  source_channel: "website",
  source_platform: "autonomia_public_site",
  received_at: "2026-09-20T12:00:00.000Z",
  first_name: "Déborah",
  email: " TEST@EXAMPLE.COM ",
  company_name: "Example Corp",
  requested_service: "scan_experts",
  message: "Besoin de cadrer un projet RAG",
  landing_page_url: "https://autonomia.fr/consultant-rag?utm_source=google",
  landing_page_topic: "/consultant-rag",
  form_id: "lp-consultant-rag",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "rag",
  gclid: "test-gclid",
  marketing_consent: false,
  consent_timestamp: "2026-09-20T12:00:00.000Z",
  privacy_notice_version: "2026-09-20-v1",
  consent_source: "lp-consultant-rag",
  scan_context: {
    plan: "experts",
    objective: "build",
    stage: "scoped",
    gap: "expertise",
    recommended_roles: ["RAG Engineer"]
  }
};

const parsed = inboundLeadSchema.parse(raw);
const normalized = normalizeInboundLead(parsed);

assert.equal(normalized.email, "test@example.com");
assert.equal(
  inboundLeadDedupeKey(parsed),
  "autonomia_public_site:external:lead-123"
);
assert.equal(normalized.dedupe_key, "autonomia_public_site:external:lead-123");

const attribution = attributionSnapshot(parsed);
assert.equal(attribution.utm_source, "google");
assert.equal(attribution.gclid, "test-gclid");
assert.equal(parsed.marketing_consent, false);
assert.equal(normalized.scan_context.plan, "experts");

assert.throws(() =>
  inboundLeadSchema.parse({
    source_channel: "website",
    source_platform: "autonomia_public_site",
    email: "not-an-email"
  })
);

console.log("inbound lead contract smoke test passed");
