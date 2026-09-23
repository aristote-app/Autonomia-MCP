import { runTalentIntelligenceBatch } from "../lib/intelligence/talentIntelligence.js";

const result = await runTalentIntelligenceBatch({
  targetCandidates: 350,
  batchSize: 4,
  countPerSource: 20,
  maxPages: 2,
  maxPersist: 120
});

console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  skipped: result.skipped,
  reason: result.reason || null,
  target: result.target,
  usable_before: result.before?.usable_discovered || 0,
  usable_after: result.after?.usable_discovered || 0,
  families: (result.families || []).map((family) => family.id),
  found: result.found || 0,
  selected: result.selected || 0,
  created: result.created || 0,
  updated: result.updated || 0,
  search_calls: result.search_calls || 0,
  cache_hits: result.cache_hits || 0
}, null, 2));
