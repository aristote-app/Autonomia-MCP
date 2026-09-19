import assert from "node:assert/strict";
import { buildTodayQueue, summarizeTodayQueue } from "../lib/intelligence/today.js";

const items = [
  {
    id: "urgent",
    title: "Mission GenAI",
    days_to_deadline: 2,
    autonomia_fit_score: 80,
    fit_coverage_percent: 90,
    inferred_staffing_roles: ["LLM Engineer"]
  },
  {
    id: "later",
    title: "Formation IA",
    days_to_deadline: 20,
    autonomia_fit_score: 70,
    fit_coverage_percent: 80,
    inferred_staffing_roles: []
  }
];

const queue = buildTodayQueue(items);
assert.equal(queue.length, 2);
assert.equal(queue[0].id, "urgent");
assert.equal(queue[0].attention_bucket, "Urgent");
assert.match(queue[0].next_action, /GO \/ NO-GO/);

const summary = summarizeTodayQueue(queue);
assert.equal(summary.urgent, 1);
assert.equal(summary.prepare, 1);

console.log("today triage smoke test passed");
