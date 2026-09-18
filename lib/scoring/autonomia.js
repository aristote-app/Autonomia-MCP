const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(Number(value) || 0, min), max);

const DEFAULT_WEIGHTS = Object.freeze({
  capabilityFit: 30,
  economicValue: 15,
  staffingReadiness: 10,
  recurrencePotential: 10,
  commercialAccess: 10,
  buyerKnowledge: 10,
  competitionPosition: 5,
  deadlineReadiness: 5,
  strategicValue: 5
});

const LABELS = Object.freeze({
  capabilityFit: "Adéquation compétences",
  economicValue: "Valeur économique",
  staffingReadiness: "Capacité de staffing",
  recurrencePotential: "Potentiel de récurrence",
  commercialAccess: "Accessibilité commerciale",
  buyerKnowledge: "Connaissance acheteur",
  competitionPosition: "Position concurrentielle",
  deadlineReadiness: "Préparation au délai",
  strategicValue: "Valeur stratégique"
});

function normalizeCriterion(value) {
  if (value == null) return null;

  if (typeof value === "number") {
    return { score: clamp(value), evidence: [], note: null };
  }

  return {
    score: value.score == null ? null : clamp(value.score),
    evidence: Array.isArray(value.evidence) ? value.evidence : [],
    note: value.note || null
  };
}

export function scoreAutonomiaFit(input, weights = DEFAULT_WEIGHTS) {
  const criteria = {};
  let weightedTotal = 0;
  let availableWeight = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    totalWeight += weight;
    const criterion = normalizeCriterion(input?.[key]);
    criteria[key] = {
      label: LABELS[key] || key,
      weight,
      ...criterion
    };

    if (criterion?.score != null) {
      weightedTotal += criterion.score * weight;
      availableWeight += weight;
    }
  }

  const score = availableWeight
    ? Math.round((weightedTotal / availableWeight) * 10) / 10
    : null;

  const coverage = totalWeight
    ? Math.round((availableWeight / totalWeight) * 1000) / 10
    : 0;

  return {
    score,
    coverage,
    criteria,
    missingCriteria: Object.entries(criteria)
      .filter(([, item]) => item.score == null)
      .map(([key]) => key),
    methodology: {
      scale: "0-100",
      interpretation:
        "Decision-support fit score based only on supplied criterion values. It is not a probability of winning.",
      weights
    }
  };
}

const HARD_BLOCKERS = Object.freeze([
  "deadline_impossible",
  "mandatory_certification_missing",
  "mandatory_reference_missing",
  "financial_capacity_insufficient",
  "required_authorization_missing",
  "conflict_of_interest",
  "scope_outside_capabilities"
]);

export function evaluatePublicTenderGoNoGo({
  fit,
  blockers = [],
  mandatory = {},
  notes = []
}) {
  const normalizedBlockers = blockers
    .map((item) => typeof item === "string" ? { code: item, note: null } : item)
    .filter(Boolean);

  const hard = normalizedBlockers.filter((item) =>
    HARD_BLOCKERS.includes(item.code)
  );

  const mandatoryEntries = Object.entries(mandatory || {});
  const mandatoryUnknown = mandatoryEntries
    .filter(([, value]) => value == null || value === "unknown")
    .map(([key]) => key);

  const mandatoryFailed = mandatoryEntries
    .filter(([, value]) => value === false || value === "no")
    .map(([key]) => key);

  const fitResult = scoreAutonomiaFit(fit || {});

  let decision = "REVIEW";
  const reasons = [];

  if (hard.length || mandatoryFailed.length) {
    decision = "NO_GO";
    if (hard.length) {
      reasons.push("At least one declared hard blocker is present.");
    }
    if (mandatoryFailed.length) {
      reasons.push("At least one declared mandatory requirement is not met.");
    }
  } else if (
    fitResult.score != null &&
    fitResult.coverage >= 70 &&
    fitResult.score >= 70 &&
    mandatoryUnknown.length === 0
  ) {
    decision = "GO";
    reasons.push("Fit score is at least 70/100 with at least 70% criterion coverage and no unknown mandatory requirement.");
  } else {
    reasons.push("More review is required because score, coverage or mandatory information is incomplete.");
  }

  return {
    decision,
    fit: fitResult,
    hardBlockers: hard,
    otherBlockers: normalizedBlockers.filter((item) => !HARD_BLOCKERS.includes(item.code)),
    mandatory: {
      values: mandatory,
      failed: mandatoryFailed,
      unknown: mandatoryUnknown
    },
    reasons,
    notes,
    safeguards: [
      "GO/NO_GO is a rules-based decision aid, not a forecast of tender outcome.",
      "Unknown data stays unknown and reduces decision confidence.",
      "Mandatory eligibility failures override a high fit score."
    ]
  };
}

export { DEFAULT_WEIGHTS, HARD_BLOCKERS };
