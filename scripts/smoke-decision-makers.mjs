import assert from "node:assert/strict";
import { getReviewedDecisionMaker } from "../lib/intelligence/reviewedDecisionMakers.js";
import { decisionCompanyKey, getSnapshotCandidate } from "../lib/intelligence/decisionMakerSnapshot.js";

const now = Date.parse("2026-10-11");
assert.equal(getReviewedDecisionMaker("SARL LABORATOIRE L & M", { now }).name, "Fabrice Leroy");
assert.match(getReviewedDecisionMaker("Perform Academy", { now }).status, /opérationnel/);
assert.match(getReviewedDecisionMaker("G2F CONSEIL", { now }).status, /Intermédiaire/);
assert.equal(getReviewedDecisionMaker("Autre Laboratoire L&M", { now }), null);
assert.equal(getReviewedDecisionMaker("PerformAcademy", { now: now + 31 * 86400000 }), null);

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
