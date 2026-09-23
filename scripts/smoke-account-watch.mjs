import assert from "node:assert/strict";
import {
  acknowledgeAccountWatchState,
  createAccountWatchState,
  refreshAccountWatchState
} from "../lib/intelligence/accountWatch.js";

const initial = createAccountWatchState({
  slug: "acme",
  name: "Acme",
  signal_count: 3,
  heat_score: 70,
  heat_label: "Chaud",
  timeline: [{ title: "Signal 3", source_url: "https://example.test/3", date: "2026-09-23" }]
});
assert.equal(initial.unseen_signal_delta, 0);
assert.equal(initial.acknowledged_signal_count, 3);

const changed = refreshAccountWatchState(initial, {
  slug: "acme",
  name: "Acme",
  signal_count: 5,
  heat_score: 82,
  heat_label: "Très chaud",
  timeline: [{ title: "Signal 5", source_url: "https://example.test/5", date: "2026-09-24" }]
}, "2026-09-24T08:00:00Z");
assert.equal(changed.unseen_signal_delta, 2);
assert.equal(changed.current_heat, 82);
assert.equal(changed.latest_signal_title, "Signal 5");
assert.equal(changed.last_changed_at, "2026-09-24T08:00:00Z");

const acknowledged = acknowledgeAccountWatchState(changed, "2026-09-24T09:00:00Z");
assert.equal(acknowledged.unseen_signal_delta, 0);
assert.equal(acknowledged.acknowledged_signal_count, 5);

const later = refreshAccountWatchState(acknowledged, {
  slug: "acme",
  name: "Acme",
  signal_count: 6,
  heat_score: 85,
  heat_label: "Très chaud",
  timeline: [{ title: "Signal 6" }]
});
assert.equal(later.unseen_signal_delta, 1);

console.log("account watch smoke ok");
