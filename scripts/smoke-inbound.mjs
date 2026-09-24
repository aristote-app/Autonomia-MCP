import assert from "node:assert/strict";
import { normalizeInboundLead } from "../lib/inbound/normalize.js";

const base = {
  external_lead_id: "lead-001",
  source_channel: "website",
  source_platform: "build-autonomia.com",
  first_name: "Alice",
  last_name: "Martin",
  email: "ALICE@example.com",
  phone: "+33600000000",
  company_name: "Acme France",
  requested_service: "Automatisation IA des processus",
  message: "Nous voulons automatiser le traitement des demandes entrantes.",
  marketing_consent: false,
  consent_timestamp: "2026-09-23T05:00:00Z",
  privacy_notice_version: "2026-09",
  consent_source: "website_form",
  received_at: "2026-09-23T05:01:00Z",
  landing_page_url: "https://build-autonomia.com/automatisation-ia",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "automation-ia"
};

const baseWithSolution = {
  ...base,
  solution_context: {
    source: "solution_finder",
    original_query: "Nous voulons automatiser les comptes rendus et former les managers.",
    summary: "Le besoin combine exécution et transfert de compétences.",
    route: "hybrid",
    recommended_roles: [
      { id: "automation-engineer", label: "Automation / AI Engineer", slug: "automation-engineer" }
    ],
    recommended_training: [
      { id: "ia-dirigeants-managers", title: "Formation IA pour dirigeants et managers", slug: "ia-dirigeants-managers" }
    ],
    engine: "openai",
    generated_at: "2026-09-23T05:00:30Z"
  }
};

const lead = normalizeInboundLead(baseWithSolution);

assert.equal(lead.email, "alice@example.com");
assert.equal(lead.marketing_consent, false);
assert.equal(lead.scan_context.classification, "automation");
assert.ok(lead.scan_context.next_action.includes("processus"));
assert.equal(lead.attribution.utm_source, "google");
assert.equal(lead.external_lead_id, "lead-001");
assert.equal(lead.scan_context.solution_context.route, "hybrid");
assert.equal(lead.scan_context.solution_context.recommended_roles[0].slug, "automation-engineer");
assert.equal(lead.scan_context.solution_context.recommended_training[0].slug, "ia-dirigeants-managers");
assert.equal(lead.scan_context.solution_context.original_query, "Nous voulons automatiser les comptes rendus et former les managers.");
assert.ok(/^[a-f0-9]{64}$/.test(lead.event_hash));
assert.ok(/^[a-f0-9]{64}$/.test(lead.dedupe_key));

const duplicate = normalizeInboundLead(baseWithSolution);
assert.equal(duplicate.event_hash, lead.event_hash);
assert.equal(duplicate.dedupe_key, lead.dedupe_key);

const sameContactWithoutSolution = normalizeInboundLead(base);
assert.notEqual(sameContactWithoutSolution.event_hash, lead.event_hash);
assert.equal(sameContactWithoutSolution.dedupe_key, lead.dedupe_key);

const training = normalizeInboundLead({
  ...base,
  external_lead_id: "lead-002",
  requested_service: "Formation Copilot pour les équipes",
  message: "Former 60 collaborateurs"
});
assert.equal(training.scan_context.classification, "training");

assert.throws(
  () => normalizeInboundLead({ ...base, marketing_consent: undefined }),
  /explicitly true or false/
);

assert.throws(
  () => normalizeInboundLead({ ...base, email: "not-an-email" }),
  /valid first_name and email/
);

console.log("inbound smoke ok");
