import { stableStringify, opportunityFacts } from "../lib/db/persist.js";
import { hasAutonomiaDatabase } from "../lib/db/supabase.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const a = stableStringify({ b: 2, a: { z: 3, y: 1 } });
const b = stableStringify({ a: { y: 1, z: 3 }, b: 2 });
assert(a === b, "Stable stringify must ignore object key order");

const facts = opportunityFacts({
  opportunityType: "freelance_ai",
  title: "AI Product Manager",
  detectedAt: "2026-09-18T10:00:00Z",
  tjmAmount: 850,
  workMode: "hybrid"
});

assert(facts.title === "AI Product Manager", "Opportunity facts title failed");
assert(facts.tjm_min === 850 && facts.tjm_max === 850, "TJM normalization failed");
assert(hasAutonomiaDatabase() === false, "CI must not have production Supabase secrets");

console.log("PERSISTENCE LAYER", {
  stableJson: a,
  facts,
  databaseConfigured: hasAutonomiaDatabase()
});
