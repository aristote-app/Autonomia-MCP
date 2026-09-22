function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ageInDays(value) {
  if (!value) return null;
  const ts = new Date(value).getTime();
  if (!Number.isFinite(ts)) return null;
  return Math.max(0, Math.floor((Date.now() - ts) / 86400000));
}

export function buildTodayQueue(items = [], { limit = 12 } = {}) {
  return [...items]
    .map((item) => {
      const days = item.days_to_deadline == null ? null : number(item.days_to_deadline, null);
      const fit = number(item.autonomia_fit_score, 0);
      const coverage = number(item.fit_coverage_percent, 0);
      const staffingCount = Array.isArray(item.inferred_staffing_roles)
        ? item.inferred_staffing_roles.length
        : 0;

      let urgencyPoints = 0;
      let bucket = "À analyser";

      if (days != null && days <= 3) {
        urgencyPoints = 40;
        bucket = "Urgent";
      } else if (days != null && days <= 10) {
        urgencyPoints = 28;
        bucket = "Cette semaine";
      } else if (days != null && days <= 21) {
        urgencyPoints = 16;
        bucket = "À préparer";
      }

      const evidencePoints = Math.min(coverage, 100) * 0.15;
      const fitPoints = Math.min(fit, 100) * 0.45;
      const staffingPoints = staffingCount > 0 ? 6 : 0;
      const triageScore = Math.round(
        Math.min(100, urgencyPoints + evidencePoints + fitPoints + staffingPoints)
      );

      let nextAction = "Analyser le besoin et vérifier les preuves.";
      if (days != null && days <= 3) {
        nextAction = "Décision immédiate : analyser puis GO / NO-GO.";
      } else if (staffingCount > 0 && fit >= 70) {
        nextAction = "Valider l'intérêt puis vérifier l'équipe disponible.";
      } else if (fit >= 70) {
        nextAction = "Ouvrir le dossier et compléter les critères manquants.";
      } else if (days != null && days <= 10) {
        nextAction = "Qualifier rapidement avant l'échéance.";
      }

      return {
        ...item,
        triage_score: triageScore,
        attention_bucket: bucket,
        next_action: nextAction
      };
    })
    .sort((a, b) => {
      if (b.triage_score !== a.triage_score) return b.triage_score - a.triage_score;
      const aDays = a.days_to_deadline == null ? Number.POSITIVE_INFINITY : Number(a.days_to_deadline);
      const bDays = b.days_to_deadline == null ? Number.POSITIVE_INFINITY : Number(b.days_to_deadline);
      return aDays - bDays;
    })
    .slice(0, Math.max(1, Number(limit) || 12));
}

function opportunityLabel(type) {
  if (type === "freelance_ai") return "Mission freelance";
  if (type === "training_ai") return "Formation IA";
  if (type === "private_ai") return "Opportunité privée";
  if (type === "public_ai") return "Marché public";
  return "Opportunité";
}

function normalizeOpportunityForUnifiedQueue(item) {
  return {
    queue_id: `opportunity:${item.id}`,
    queue_kind: "opportunity",
    entity_id: item.id,
    type_label: opportunityLabel(item.opportunity_type),
    source_id: item.primary_source_id || null,
    source_label: item.primary_source_id || "Autonomia",
    source_url: item.primary_source_url || null,
    internal_href: `/opportunities/${item.id}`,
    company_name: item.buyer_name || "Organisation non identifiée",
    title: item.title,
    location: item.location || null,
    tags: item.ai_tags || [],
    fit_score: item.autonomia_fit_score ?? null,
    coverage_percent: item.fit_coverage_percent ?? null,
    deadline_at: item.deadline_at || null,
    days_to_deadline: item.days_to_deadline ?? null,
    staffing_roles: item.inferred_staffing_roles || [],
    triage_score: item.triage_score,
    attention_bucket: item.attention_bucket,
    next_action: item.next_action,
    budget_min: item.budget_min ?? null,
    budget_max: item.budget_max ?? null
  };
}

const SIGNAL_SOURCE_LABELS = Object.freeze({
  linkedin: "LinkedIn Jobs",
  indeed: "Indeed",
  linkedin_post: "LinkedIn Posts",
  freelancerepublik: "FreelanceRepublik",
  lehibou: "LeHibou",
  france_travail_jobs: "France Travail",
  linkedin_training: "LinkedIn Jobs",
  linkedin_training_post: "LinkedIn Posts",
  indeed_training: "Indeed"
});

function normalizeJobSignalForUnifiedQueue(signal) {
  const keys = signal.signal_keys || [];
  const trainingNeed = keys.includes("training_need");
  const adoptionSignal = keys.includes("ai_adoption_signal");
  const freelance =
    /freelance|ind[eé]pendant/i.test(signal.contract_type || "") ||
    keys.includes("freelance");

  const skillCount = Array.isArray(signal.skills) ? signal.skills.length : 0;
  const roleCount = Array.isArray(signal.roles) ? signal.roles.length : 0;
  const age = ageInDays(signal.published_at || signal.last_seen_at);

  let score = trainingNeed ? 70 : freelance ? 64 : 48;
  if (keys.includes("training_subcontracting")) score += 8;
  if (adoptionSignal) score += 4;
  score += Math.min(skillCount * 2, 12);
  score += Math.min(roleCount * 3, 9);
  if (signal.source_url) score += 5;
  if (age != null && age <= 7) score += 10;
  else if (age != null && age <= 30) score += 5;
  score = Math.min(100, Math.round(score));

  return {
    queue_id: `job_signal:${signal.id}`,
    queue_kind: "job_signal",
    entity_id: signal.id,
    type_label: trainingNeed ? "Besoin formation IA" : freelance ? "Mission freelance" : "Signal entreprise",
    source_id: signal.source_id || null,
    source_label: SIGNAL_SOURCE_LABELS[signal.source_id] || signal.source_id || "source",
    source_url: signal.source_url || null,
    internal_href: `/signals/${signal.id}`,
    company_name: signal.company_name || "Entreprise non identifiée",
    title: signal.title,
    location: signal.location || null,
    tags: [...new Set([...(signal.skills || []), ...(signal.roles || [])])].slice(0, 8),
    fit_score: null,
    coverage_percent: null,
    deadline_at: null,
    days_to_deadline: null,
    staffing_roles: signal.roles || [],
    triage_score: score,
    attention_bucket: trainingNeed
      ? keys.includes("training_subcontracting")
        ? "Sous-traitance formation"
        : adoptionSignal
          ? "Adoption IA"
          : "Besoin formation"
      : freelance
        ? "Mission directe"
        : "Signal à exploiter",
    next_action: trainingNeed
      ? "Ouvrir la source, identifier le décideur formation/IA et proposer le parcours adapté."
      : freelance
        ? "Ouvrir la mission, qualifier TJM/démarrage puis chercher un consultant correspondant."
        : "Analyser l'entreprise, identifier le décideur et le besoin commercial derrière ce recrutement.",
    budget_min: null,
    budget_max: null,
    detected_at: signal.last_seen_at || signal.first_seen_at || null
  };
}

export function buildUnifiedTodayQueue({
  opportunities = [],
  jobSignals = [],
  limit = 20
} = {}) {
  const normalizedOpportunities = buildTodayQueue(opportunities, {
    limit: Math.max(opportunities.length, 1)
  }).map(normalizeOpportunityForUnifiedQueue);

  const normalizedSignals = [
    ...new Map(
      (jobSignals || []).map((signal) => [signal.id, signal])
    ).values()
  ].map(normalizeJobSignalForUnifiedQueue);

  return [...normalizedOpportunities, ...normalizedSignals]
    .sort((a, b) => {
      if (b.triage_score !== a.triage_score) return b.triage_score - a.triage_score;
      if (a.days_to_deadline != null && b.days_to_deadline == null) return -1;
      if (a.days_to_deadline == null && b.days_to_deadline != null) return 1;
      return 0;
    })
    .slice(0, Math.max(1, Number(limit) || 20));
}

export function summarizeTodayQueue(items = []) {
  const counts = {
    urgent: 0,
    thisWeek: 0,
    prepare: 0,
    analyze: 0
  };

  for (const item of items) {
    if (item.attention_bucket === "Urgent") counts.urgent += 1;
    else if (item.attention_bucket === "Cette semaine") counts.thisWeek += 1;
    else if (item.attention_bucket === "À préparer") counts.prepare += 1;
    else counts.analyze += 1;
  }

  return counts;
}

export function summarizeUnifiedTodayQueue(items = []) {
  return {
    total: items.length,
    urgent: items.filter((item) => item.attention_bucket === "Urgent").length,
    directMissions: items.filter((item) => item.type_label === "Mission freelance").length,
    companySignals: items.filter((item) => item.type_label === "Signal entreprise").length
  };
}
