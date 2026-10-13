import assert from "node:assert/strict";
import { getReviewedDecisionMaker, getReviewedOpportunityDecisionMaker } from "../lib/intelligence/reviewedDecisionMakers.js";
import { decisionCompanyKey, getSnapshotCandidate } from "../lib/intelligence/decisionMakerSnapshot.js";
import { reviewedResearchContacts } from "../lib/intelligence/reviewedOpportunityContacts.js";

const now = Date.parse("2026-10-13");
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

for (const entry of reviewedResearchContacts) {
  for (const id of entry.ids) {
    const matched = getReviewedOpportunityDecisionMaker(entry.company, id, { now });
    assert.equal(matched.resolvedCompany, entry.resolvedCompany);
    assert.equal(matched.linkedin, entry.linkedin);
    assert.equal(getReviewedOpportunityDecisionMaker("Autre entreprise", id, { now }), null);
    assert.equal(getReviewedOpportunityDecisionMaker(entry.company, "autre-annonce", { now }), null);
    assert.equal(getReviewedOpportunityDecisionMaker(entry.company, id, { now: now + 31 * 86400000 }), null);
    if (entry.linkedin) {
      const url = new URL(entry.linkedin);
      assert.match(url.hostname, /(^|\.)linkedin\.com$/);
      assert.ok(url.pathname.startsWith("/in/"));
      assert.ok(entry.name && entry.role && entry.reason && entry.additionalSource);
    } else assert.equal(entry.name, undefined);
  }
}
assert.equal(getReviewedDecisionMaker("Organisation non identifiée", { now }), null);
assert.equal(getReviewedDecisionMaker("EQUANS", { now }), null);
assert.equal(getReviewedOpportunityDecisionMaker("EQUANS", "16470b9e-7068-46ef-9d8b-0bd33a3c01aa", { now }).linkedin, "https://fr.linkedin.com/in/%C3%A9ric-b-b4a496a2");
assert.match(getReviewedOpportunityDecisionMaker("Collective.work", "bb479586-fb5c-41d6-b26f-196fb799b77c", { now }).status, /Intermédiaire/);
assert.equal(getReviewedOpportunityDecisionMaker("Collective.work", "05fe21cd-e476-436d-bc44-6838b15d7931", { now }).resolvedCompany, "Bloomays");
assert.equal(getReviewedOpportunityDecisionMaker("Collective.work", "65f91f46-f171-44c6-a125-901225b23b94", { now }).name, "Alicia Pilon");
assert.match(getReviewedOpportunityDecisionMaker("Organisation non identifiée", "b694a967-c4ad-4fff-8e68-5ca36ef282ae", { now }).status, /pourvu/);
assert.equal(getReviewedOpportunityDecisionMaker("INDEED", "6e19f3cb-f3f7-4cd1-9de2-98e6af9b6d17", { now }).resolvedCompany, "ASCOR");
assert.equal(getReviewedOpportunityDecisionMaker("Agence Nationale de la Recherche (ANR)", "52549486-7835-423e-b230-881f003ff76b", { now }).name, "Claire Giry");
assert.match(getReviewedOpportunityDecisionMaker("Organisation non identifiée", "656b42ee-32cb-4046-9dcf-9012aac01505", { now }).status, /expirée/);
console.log("Reviewed ad provenance, personal-profile coverage and scoped matching checks passed.");
