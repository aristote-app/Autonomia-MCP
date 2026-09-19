function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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
