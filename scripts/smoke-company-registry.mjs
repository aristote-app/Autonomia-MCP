import assert from "node:assert/strict";
import { rankCompanyRegistryCandidates } from "../lib/collectors/companyRegistry.js";

const ranked = rankCompanyRegistryCandidates("ACME France", [
  {
    siren: "123456789",
    nom_complet: "ACME FRANCE",
    nom_raison_sociale: "ACME FRANCE SAS",
    etat_administratif: "A",
    activite_principale: "62.20A",
    tranche_effectif_salarie: "32",
    nombre_etablissements_ouverts: 3,
    siege: {
      siret: "12345678900011",
      code_postal: "75008",
      libelle_commune: "PARIS"
    }
  },
  {
    siren: "987654321",
    nom_complet: "ACME BATIMENT",
    etat_administratif: "A",
    activite_principale: "43.99C"
  }
]);

assert.equal(ranked[0].siren, "123456789");
assert.equal(ranked[0].match_status, "exact");
assert.equal(ranked[0].employee_bracket, "250 à 499 salariés");
assert.equal(ranked[0].city, "PARIS");
assert.ok(ranked[0].score > ranked[1].score);

const weak = rankCompanyRegistryCandidates("Totally Different", [
  { siren: "111111111", nom_complet: "AUTRE SOCIETE", etat_administratif: "A" }
]);
assert.ok(weak[0].score < 80);

console.log("company registry smoke ok");
