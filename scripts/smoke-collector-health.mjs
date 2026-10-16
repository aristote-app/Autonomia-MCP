import assert from "node:assert/strict";
import { summarizeCollectorRuns } from "../lib/db/collectorHealth.js";

const rows = [
  { id: "abc", query_payload: { kind: "job_signals", secret: "do-not-leak" }, status: "failed", started_at: "2026-10-16T10:00:00Z", stats: {}, error_message: "sensitive error" },
  { id: "def", query_payload: { kind: "extended_demand" }, status: "success", started_at: "2026-10-16T08:00:00Z", stats: { persisted: 7 } },
  { id: "ghi", query_payload: { kind: "job_signals" }, status: "success", started_at: "2026-10-15T10:00:00Z", stats: { persisted: 11 } }
];
const result = summarizeCollectorRuns(rows);
assert.equal(result.length, 2);
assert.equal(result[0].status, "failed");
assert.equal(result[1].count, 7);
assert.ok(!JSON.stringify(result).includes("sensitive error"));
assert.ok(!JSON.stringify(result).includes("do-not-leak"));
console.log("Collector health smoke test passed");
