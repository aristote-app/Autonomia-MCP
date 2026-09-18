import assert from "node:assert/strict";
import { normalizeDecpAwardRecord, normalizeDecpPayload } from "../lib/decp/normalize.js";

const sample = {
  uid: "12345678901234|M-2026-001|72000000",
  id: "M-2026-001",
  objet: "Accompagnement en intelligence artificielle",
  codeCPV: "72000000",
  montant: 125000,
  dureeMois: 24,
  dateNotification: "2026-06-12",
  procedure: "Procédure adaptée",
  nature: "Marché",
  acheteur: {
    id: "12345678901234",
    nom: "Acheteur Démo"
  },
  titulaires: [
    {
      id: "98765432100011",
      denominationSociale: "Prestataire Démo",
      typeIdentifiant: "SIRET"
    }
  ]
};

const normalized = normalizeDecpAwardRecord(sample);
assert.equal(normalized.sourceRecordId, sample.uid);
assert.equal(normalized.buyer.siret, "12345678901234");
assert.equal(normalized.suppliers[0].siret, "98765432100011");
assert.equal(normalized.amount, 125000);
assert.equal(normalized.durationMonths, 24);
assert.equal(normalizeDecpPayload({ marches: [sample] }).length, 1);


const flattened = {
  id: "20250002M25",
  nature: "Marché",
  objet: "Formations INTELLIGENCE ARTIFICIELLE",
  codecpv: "80500000-9",
  procedure: "Marché passé sans publicité ni mise en concurrence préalable",
  titulaire_id_1: "97783492800011",
  titulaire_typeidentifiant_1: "SIRET",
  titulaire_id_2: "CDL",
  titulaire_typeidentifiant_2: "CDL",
  acheteur_id: "97814323800019",
  dureemois: 12,
  datenotification: "2025-03-27",
  datepublicationdonnees: "2025-03-28",
  montant: 4500,
  lieuexecution_code: "34080"
};

const normalizedFlat = normalizeDecpAwardRecord(flattened);
assert.equal(normalizedFlat.contractReference, "20250002M25");
assert.equal(normalizedFlat.cpvCode, "80500000-9");
assert.equal(normalizedFlat.durationMonths, 12);
assert.equal(normalizedFlat.awardDate, "2025-03-27");
assert.equal(normalizedFlat.publicationDate, "2025-03-28");
assert.equal(normalizedFlat.buyer.siret, "97814323800019");
assert.equal(normalizedFlat.suppliers[0].siret, "97783492800011");
assert.equal(normalizedFlat.location, "34080");

console.log("DECP history normalization OK", {
  sourceRecordId: normalized.sourceRecordId,
  buyer: normalized.buyer.name,
  supplier: normalized.suppliers[0].name,
  amount: normalized.amount
});
