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

console.log("DECP history normalization OK", {
  sourceRecordId: normalized.sourceRecordId,
  buyer: normalized.buyer.name,
  supplier: normalized.suppliers[0].name,
  amount: normalized.amount
});
