import assert from "node:assert/strict";
import {
  classifyPrivateDemandSignal,
  normalizePrivateDemandSignals
} from "../lib/signals/private.js";

const classified = classifyPrivateDemandSignal({
  title: "Le groupe déploie Copilot",
  description: "Un programme d'acculturation IA accompagnera 2 000 salariés."
});

assert.ok(classified.matches.some((x) => x.signalType === "ai_transformation"));
assert.ok(classified.matches.some((x) => x.signalType === "ai_training_intent"));

const normalized = normalizePrivateDemandSignals({
  source: "manual",
  records: [{
    id: "press-1",
    company: "Entreprise Démo",
    title: "Programme IA",
    text: "Déploiement d'agents IA à l'échelle du groupe.",
    publishedAt: "2026-09-01T10:00:00Z"
  }]
});

assert.equal(normalized[0].organization.name, "Entreprise Démo");
assert.equal(normalized[0].evidenceKind, "inferred");
assert.equal(normalized[0].sourceRecordId, "press-1");

console.log("Private AI signal taxonomy OK", {
  matches: classified.matches.map((x) => x.signalType),
  rows: normalized.length
});
