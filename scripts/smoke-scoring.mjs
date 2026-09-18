import {
  scoreAutonomiaFit,
  evaluatePublicTenderGoNoGo
} from "../lib/scoring/autonomia.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const strong = scoreAutonomiaFit({
  capabilityFit: { score: 90, evidence: ["RAG skills available"] },
  economicValue: 80,
  staffingReadiness: 75,
  recurrencePotential: 70,
  commercialAccess: 75,
  buyerKnowledge: 70,
  competitionPosition: 65,
  deadlineReadiness: 80,
  strategicValue: 90
});

assert(strong.score >= 70, "Strong opportunity should score >=70");
assert(strong.coverage === 100, "Strong opportunity should have full coverage");

const go = evaluatePublicTenderGoNoGo({
  fit: {
    capabilityFit: 90,
    economicValue: 80,
    staffingReadiness: 80,
    recurrencePotential: 75,
    commercialAccess: 75,
    buyerKnowledge: 70,
    competitionPosition: 70,
    deadlineReadiness: 85,
    strategicValue: 85
  },
  mandatory: {
    eligibleLegalForm: true,
    requiredReferences: true,
    deadlineFeasible: true
  }
});
assert(go.decision === "GO", "Expected GO");

const blocked = evaluatePublicTenderGoNoGo({
  fit: { capabilityFit: 95, economicValue: 90 },
  blockers: ["mandatory_certification_missing"],
  mandatory: { requiredCertification: false }
});
assert(blocked.decision === "NO_GO", "Hard blocker must force NO_GO");

const review = evaluatePublicTenderGoNoGo({
  fit: { capabilityFit: 95 },
  mandatory: { requiredReferences: "unknown" }
});
assert(review.decision === "REVIEW", "Incomplete mandatory data must require review");

console.log("AUTONOMIA SCORING", {
  strongScore: strong.score,
  coverage: strong.coverage,
  decisions: [go.decision, blocked.decision, review.decision]
});
