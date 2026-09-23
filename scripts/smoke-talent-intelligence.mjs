import assert from "node:assert/strict";
import {
  TALENT_INTELLIGENCE_FAMILIES,
  TALENT_INTELLIGENCE_TARGET,
  selectTalentFamilies
} from "../lib/intelligence/talentIntelligence.js";

assert.equal(TALENT_INTELLIGENCE_TARGET, 350);
assert.ok(TALENT_INTELLIGENCE_FAMILIES.length >= 16);

const date = new Date("2026-09-23T00:00:00Z");
const first = selectTalentFamilies({ date, batchSize: 4 });
const second = selectTalentFamilies({ date, batchSize: 4 });
assert.deepEqual(first, second, "Daily family selection must be deterministic");
assert.equal(first.length, 4);
assert.equal(new Set(first.map((item) => item.id)).size, 4);

const nextDay = selectTalentFamilies({
  date: new Date("2026-09-24T00:00:00Z"),
  batchSize: 4
});
assert.equal(nextDay.length, 4);
assert.notDeepEqual(
  first.map((item) => item.id),
  nextDay.map((item) => item.id),
  "Daily rotation must advance"
);

console.log("talent intelligence smoke ok");
