import assert from "node:assert/strict";
import {
  classifyTerritoryMarketSignal,
  normalizeTerritoryMarketSignal,
  TERRITORY_SIGNAL_QUERIES
} from "../lib/signals/territory.js";

assert.ok(TERRITORY_SIGNAL_QUERIES.includes("intelligence artificielle"));
assert.ok(TERRITORY_SIGNAL_QUERIES.includes("TPE PME numérique"));

const training = classifyTerritoryMarketSignal({
  title: "Formation des agents à l'intelligence artificielle générative"
});
assert.equal(training.signalType, "territory_ai_training");
assert.equal(training.importance, 5);

const copilot = classifyTerritoryMarketSignal({
  title: "Accompagnement au déploiement de Microsoft Copilot M365"
});
assert.equal(copilot.signalType, "territory_copilot_m365");

const digital = classifyTerritoryMarketSignal({
  title: "Accompagnement à la transformation numérique et à la dématérialisation"
});
assert.equal(digital.signalType, "territory_digital_transformation");

const irrelevant = classifyTerritoryMarketSignal({
  title: "Entretien des espaces verts communautaires"
});
assert.equal(irrelevant, null);

const normalized = normalizeTerritoryMarketSignal(
  {
    source: "boamp",
    sourceId: "24-TEST",
    sourceUrl: "https://example.test/notice",
    title: "Automatisation de processus administratifs",
    buyerName: "Communauté test",
    buyerSiren: "123456789",
    publishedAt: "2026-09-22T00:00:00Z"
  },
  { id: "territory-id", siren: "123456789" },
  "automatisation"
);

assert.equal(normalized.territoryId, "territory-id");
assert.equal(normalized.signalType, "territory_automation");
assert.equal(normalized.payload.source_record_id, "24-TEST");
assert.equal(normalized.evidenceUrl, "https://example.test/notice");

console.log("territory signal smoke ok");
