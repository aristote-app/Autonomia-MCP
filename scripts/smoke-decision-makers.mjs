import assert from "node:assert/strict";
import { getReviewedDecisionMaker, getReviewedOpportunityDecisionMaker } from "../lib/intelligence/reviewedDecisionMakers.js";
import { decisionCompanyKey, getSnapshotCandidate } from "../lib/intelligence/decisionMakerSnapshot.js";

const now = Date.parse("2026-10-11");
assert.equal(getReviewedDecisionMaker("SARL LABORATOIRE L & M", { now }).name, "Fabrice Leroy");
assert.match(getReviewedDecisionMaker("Perform Academy", { now }).status, /opérationnel/);
assert.match(getReviewedDecisionMaker("G2F CONSEIL", { now }).status, /Intermédiaire/);
assert.equal(getReviewedDecisionMaker("Autre Laboratoire L&M", { now }), null);
assert.equal(getReviewedDecisionMaker("PerformAcademy", { now: now + 31 * 86400000 }), null);

for (const company of ["GROUPE SKILLSET", "Copylot Group", "BEFORMA", "ECORIS", "ELVATUS", "AGENCE FRANCAISE D'INFORMATIQUE", "WOOSPEAK", "SPL GAAM HDF", "Akanea", "Ville de Lyon", "ADALIA CONSULTING", "AXSENS"]) {
  const contact = getReviewedDecisionMaker(company, { now });
  assert.ok(contact, `Missing reviewed contact for ${company}`);
  assert.match(contact.linkedin, /^https:\/\/[a-z]{2,3}\.linkedin\.com\/in\//);
  assert.equal(getReviewedDecisionMaker(`Autre ${company}`, { now }), null);
}
assert.match(getReviewedDecisionMaker("Akanea", { now }).status, /RH/);
assert.match(getReviewedDecisionMaker("SPL GAAM HDF", { now }).status, /marché/);

const key = decisionCompanyKey("Société A");
const snapshot = { version: 1, accounts: { [key]: {
  checkedAt: "2026-10-11",
  candidates: [{ name_guess: "Test Person", linkedin_url: "https://fr.linkedin.com/in/test-person" }]
} } };
assert.ok(getSnapshotCandidate(snapshot, "Societe A", { now }));
assert.equal(getSnapshotCandidate(snapshot, "Societe AB", { now }), null);
assert.equal(getSnapshotCandidate(snapshot, "Societe A", { now: now + 15 * 86400000 }), null);
snapshot.accounts[key].candidates[0].linkedin_url = "https://evil.example/in/test-person";
assert.equal(getSnapshotCandidate(snapshot, "Societe A", { now }), null);
console.log("Decision-maker matching, contact status, freshness and URL checks passed.");

assert.equal(getReviewedOpportunityDecisionMaker("DIRECTEMPLOI", "65e482a2-7be2-428c-8f21-6c0dab3c85d9", { now }).name, "Gérard Réus");
assert.equal(getReviewedOpportunityDecisionMaker("DIRECTEMPLOI", "autre-annonce", { now }), null);
assert.equal(getReviewedOpportunityDecisionMaker("Autre entreprise", "65e482a2-7be2-428c-8f21-6c0dab3c85d9", { now }), null);
assert.equal(getReviewedOpportunityDecisionMaker("Entreprise non identifiée", "ab6f8fa9-3c1f-4099-8183-71627a7b8a21", { now }).name, "Jamal Mazaz");
assert.equal(getReviewedOpportunityDecisionMaker("DIRECTEMPLOI", "65e482a2-7be2-428c-8f21-6c0dab3c85d9", { now: now + 31 * 86400000 }), null);
