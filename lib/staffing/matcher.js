function cleanSkill(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
}

function skillSet(values) {
  return new Set((values || []).map(cleanSkill).filter(Boolean));
}

function intersect(a, b) {
  return [...a].filter((value) => b.has(value));
}

function difference(a, b) {
  return [...a].filter((value) => !b.has(value));
}

function normalizeRate(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function matchConsultantToOpportunity({
  consultant,
  opportunity,
  weights = {
    requiredSkills: 55,
    preferredSkills: 15,
    availability: 15,
    rate: 10,
    location: 5
  }
}) {
  const consultantSkills = skillSet(consultant?.skills);
  const required = skillSet(opportunity?.requiredSkills);
  const preferred = skillSet(opportunity?.preferredSkills);

  const requiredMatched = intersect(required, consultantSkills);
  const requiredMissing = difference(required, consultantSkills);
  const preferredMatched = intersect(preferred, consultantSkills);

  const requiredScore = required.size
    ? (requiredMatched.length / required.size) * 100
    : 100;
  const preferredScore = preferred.size
    ? (preferredMatched.length / preferred.size) * 100
    : 100;

  const availabilityScore = opportunity?.startDate && consultant?.availableFrom
    ? new Date(consultant.availableFrom) <= new Date(opportunity.startDate) ? 100 : 0
    : null;

  const consultantRate = normalizeRate(consultant?.tjm);
  const maxRate = normalizeRate(opportunity?.tjmMax);
  const rateScore = consultantRate != null && maxRate != null
    ? consultantRate <= maxRate
      ? 100
      : Math.max(0, 100 - ((consultantRate - maxRate) / maxRate) * 100)
    : null;

  const desiredLocation = String(opportunity?.location || "").toLowerCase();
  const consultantLocations = (consultant?.locations || []).map((item) => String(item).toLowerCase());
  const remoteAccepted = Boolean(opportunity?.remoteAllowed && consultant?.remote);
  const locationScore = desiredLocation
    ? consultantLocations.some((item) => desiredLocation.includes(item) || item.includes(desiredLocation)) || remoteAccepted
      ? 100
      : 0
    : null;

  const components = {
    requiredSkills: { score: requiredScore, weight: weights.requiredSkills },
    preferredSkills: { score: preferredScore, weight: weights.preferredSkills },
    availability: { score: availabilityScore, weight: weights.availability },
    rate: { score: rateScore, weight: weights.rate },
    location: { score: locationScore, weight: weights.location }
  };

  let total = 0;
  let availableWeight = 0;
  let totalWeight = 0;

  for (const component of Object.values(components)) {
    totalWeight += component.weight;
    if (component.score != null) {
      total += component.score * component.weight;
      availableWeight += component.weight;
    }
  }

  const score = availableWeight
    ? Math.round((total / availableWeight) * 10) / 10
    : null;

  const coverage = totalWeight
    ? Math.round((availableWeight / totalWeight) * 1000) / 10
    : 0;

  return {
    consultantId: consultant?.id || null,
    consultantName: consultant?.name || null,
    score,
    coverage,
    hardSkillGap: requiredMissing.length > 0,
    required: {
      requested: [...required],
      matched: requiredMatched,
      missing: requiredMissing,
      score: Math.round(requiredScore * 10) / 10
    },
    preferred: {
      requested: [...preferred],
      matched: preferredMatched,
      score: Math.round(preferredScore * 10) / 10
    },
    components,
    explanation: {
      suitable: requiredMissing.length === 0 && (score == null || score >= 70),
      note: "This is a rules-based staffing match, not a guarantee of consultant suitability or mission award."
    }
  };
}

export function rankConsultantsForOpportunity({ consultants, opportunity, limit = 20 }) {
  const matches = (consultants || []).map((consultant) =>
    matchConsultantToOpportunity({ consultant, opportunity })
  );

  matches.sort((a, b) => {
    if (a.hardSkillGap !== b.hardSkillGap) return a.hardSkillGap ? 1 : -1;
    return (b.score ?? -1) - (a.score ?? -1);
  });

  return {
    opportunity: {
      id: opportunity?.id || null,
      title: opportunity?.title || null
    },
    count: matches.length,
    matches: matches.slice(0, Math.min(Math.max(Number(limit) || 20, 1), 100))
  };
}

export function rankOpportunitiesForConsultant({ consultant, opportunities, limit = 20 }) {
  const matches = (opportunities || []).map((opportunity) => ({
    opportunityId: opportunity?.id || null,
    opportunityTitle: opportunity?.title || null,
    ...matchConsultantToOpportunity({ consultant, opportunity })
  }));

  matches.sort((a, b) => {
    if (a.hardSkillGap !== b.hardSkillGap) return a.hardSkillGap ? 1 : -1;
    return (b.score ?? -1) - (a.score ?? -1);
  });

  return {
    consultant: {
      id: consultant?.id || null,
      name: consultant?.name || null
    },
    count: matches.length,
    matches: matches.slice(0, Math.min(Math.max(Number(limit) || 20, 1), 100))
  };
}
