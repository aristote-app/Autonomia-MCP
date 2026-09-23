import assert from "node:assert/strict";
import {
  classifyTerritoryMarketSignal,
  normalizeTerritoryMarketSignal,
  TERRITORY_SIGNAL_QUERIES
} from "../lib/signals/territory.js";
import { buildSeoGeoSignals, summarizeSeoGeoSignals } from "../lib/seo-geo/demandSignals.js";
import {
  buildTerritoryNameIndex,
  matchTerritoryByName
} from "../lib/market/territorySignals.js";

assert.ok(TERRITORY_SIGNAL_QUERIES.includes("intelligence artificielle"));
assert.ok(TERRITORY_SIGNAL_QUERIES.includes("TPE PME numérique"));
assert.ok(TERRITORY_SIGNAL_QUERIES.includes("communauté de communes intelligence artificielle"));
assert.ok(TERRITORY_SIGNAL_QUERIES.includes("communauté d'agglomération intelligence artificielle"));

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

const sme = classifyTerritoryMarketSignal({
  title: "Programme d'accompagnement des TPE PME à l'intelligence artificielle"
});
assert.equal(sme.signalType, "territory_sme_ai_program");

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


const directTerritorySignals = buildSeoGeoSignals({
  territorySignals: [
    {
      signal_type: "territory_ai_training",
      signal_source: "boamp",
      title: "Formation des agents à l'IA générative",
      importance: 5,
      detected_at: new Date().toISOString(),
      evidence_url: "https://example.test/territory-ai",
      territory_name: "Communauté de communes Exemple",
      territory_type: "CC",
      payload: {
        buyer_name: "Communauté de communes Exemple",
        query: "formation intelligence artificielle"
      }
    }
  ]
});

assert.equal(directTerritorySignals.length, 1);
assert.equal(directTerritorySignals[0].family, "territory-use-case");
assert.equal(directTerritorySignals[0].cluster, "Collectivités & territoires");
assert.equal(directTerritorySignals[0].public_procurement_mentions, 1);
assert.equal(directTerritorySignals[0].territory_mentions, 5);

const summary = summarizeSeoGeoSignals(directTerritorySignals);
assert.equal(summary.territory, 1);
assert.equal(summary.procurement, 1);


const directoryMatchedSignals = buildSeoGeoSignals({
  opportunities: [
    {
      title: "Déploiement d'un assistant IA documentaire",
      buyer_name: "CA Grand Test",
      estimated_value_eur: 120000
    }
  ],
  territoryDirectory: [
    {
      id: "territory-ca",
      siren: "987654321",
      name: "CA Grand Test",
      territory_type: "CA"
    }
  ]
});

assert.equal(directoryMatchedSignals.length, 1);
assert.equal(directoryMatchedSignals[0].family, "territory-use-case");
assert.equal(directoryMatchedSignals[0].territory_mentions, 1);
assert.equal(directoryMatchedSignals[0].territory_name, "CA Grand Test");


const abbreviatedBuyerSignals = buildSeoGeoSignals({
  opportunities: [
    {
      title: "Audit et feuille de route IA",
      buyer_name: "CA Plaine Exemple",
      estimated_value_eur: 90000
    },
    {
      title: "Automatisation des processus internes",
      buyer_name: "CC Vallée Exemple",
      estimated_value_eur: 75000
    }
  ]
});

assert.equal(abbreviatedBuyerSignals.length, 2);
assert.ok(abbreviatedBuyerSignals.every((item) => item.family === "territory-use-case"));
assert.ok(abbreviatedBuyerSignals.every((item) => item.territory_mentions === 1));


const territoryIndex = buildTerritoryNameIndex([
  {
    id: "cc-test",
    siren: "111111111",
    name: "Communauté de communes du Pays Exemple",
    territory_type: "CC"
  },
  {
    id: "ca-test",
    siren: "222222222",
    name: "Communauté d'agglomération Grand Exemple",
    territory_type: "CA"
  }
]);

assert.equal(
  matchTerritoryByName("CC du Pays Exemple", territoryIndex)?.id,
  "cc-test"
);
assert.equal(
  matchTerritoryByName("CA Grand Exemple", territoryIndex)?.id,
  "ca-test"
);
