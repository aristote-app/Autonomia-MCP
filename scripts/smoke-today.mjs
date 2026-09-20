import assert from "node:assert/strict";
import {
  buildTodayQueue,
  summarizeTodayQueue,
  buildUnifiedTodayQueue,
  summarizeUnifiedTodayQueue
} from "../lib/intelligence/today.js";

const opportunities = [
  {
    id: "urgent",
    opportunity_type: "public_ai",
    title: "Marché GenAI",
    buyer_name: "Acheteur A",
    days_to_deadline: 2,
    deadline_at: "2026-09-22T12:00:00Z",
    autonomia_fit_score: 80,
    fit_coverage_percent: 90,
    inferred_staffing_roles: ["LLM Engineer"],
    ai_tags: ["genai"],
    primary_source_id: "boamp",
    primary_source_url: "https://example.com/boamp"
  },
  {
    id: "later",
    opportunity_type: "training_ai",
    title: "Formation IA",
    buyer_name: "Acheteur B",
    days_to_deadline: 20,
    deadline_at: "2026-10-10T12:00:00Z",
    autonomia_fit_score: 70,
    fit_coverage_percent: 80,
    inferred_staffing_roles: [],
    ai_tags: ["training"],
    primary_source_id: "ted",
    primary_source_url: "https://example.com/ted"
  }
];

const queue = buildTodayQueue(opportunities);
assert.equal(queue.length, 2);
assert.equal(queue[0].id, "urgent");
assert.equal(queue[0].attention_bucket, "Urgent");
assert.match(queue[0].next_action, /GO \/ NO-GO/);

const summary = summarizeTodayQueue(queue);
assert.equal(summary.urgent, 1);
assert.equal(summary.prepare, 1);

const unified = buildUnifiedTodayQueue({
  opportunities,
  jobSignals: [
    {
      id: "freelance-1",
      source_id: "indeed",
      title: "Agentic AI Engineer freelance",
      company_name: "Client X",
      contract_type: "Freelance",
      source_url: "https://example.com/indeed",
      skills: ["Agentic AI", "LLM"],
      roles: ["Agentic / LLM / RAG"],
      signal_keys: ["freelance"],
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    },
    {
      id: "signal-1",
      source_id: "linkedin",
      title: "AI Engineer",
      company_name: "Entreprise Y",
      contract_type: "CDI",
      source_url: "https://example.com/linkedin",
      skills: ["RAG"],
      roles: ["Data / ML"],
      signal_keys: ["recruitment_signal"],
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    }
  ],
  limit: 10
});

assert.equal(unified.length, 4);
assert.ok(unified.some((item) => item.type_label === "Marché public"));
assert.ok(unified.some((item) => item.type_label === "Mission freelance"));
assert.ok(unified.some((item) => item.type_label === "Signal entreprise"));
assert.ok(unified.every((item) => item.internal_href));

const unifiedSummary = summarizeUnifiedTodayQueue(unified);
assert.equal(unifiedSummary.total, 4);
assert.equal(unifiedSummary.directMissions, 1);
assert.equal(unifiedSummary.companySignals, 1);

console.log("today unified triage smoke test passed");
