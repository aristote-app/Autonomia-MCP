import { ACADEMY_FUNDING_RULES_2026 } from "./funding2026.js";

export function getStaticFundingRulesForCompany({ opcoCode, idcc, limit = 50 } = {}) {
  const normalizedOpco = String(opcoCode || "").trim().toUpperCase();
  const normalizedIdcc = String(idcc || "").replace(/\D/g, "").padStart(4, "0");

  const opcoRules = ACADEMY_FUNDING_RULES_2026
    .filter((rule) => String(rule.opco_code || "").toUpperCase() === normalizedOpco);

  const exact = opcoRules.filter((rule) => {
    const ruleIdcc = rule.idcc ? String(rule.idcc).replace(/\D/g, "").padStart(4, "0") : "";
    return Boolean(normalizedIdcc && ruleIdcc === normalizedIdcc);
  });

  const generic = opcoRules.filter((rule) => !rule.idcc && !rule.branch_code);
  const selected = exact.length ? exact : generic;

  return selected
    .slice(0, limit)
    .map((rule, index) => ({
      id: `static-${normalizedOpco}-${normalizedIdcc || "all"}-${index}`,
      ...rule,
      idcc: exact.length ? rule.idcc : (normalizedIdcc || rule.idcc || null),
      branch_label: exact.length
        ? rule.branch_label
        : (normalizedIdcc
            ? `IDCC ${normalizedIdcc} – règle générique ${normalizedOpco}`
            : rule.branch_label),
      notes: exact.length
        ? rule.notes
        : `IDCC ${normalizedIdcc || "non précisé"} reconnu. Le barème exact de cette branche n'est pas encore normalisé ; la règle générale de l'OPCO est affichée en attendant la normalisation chiffrée. ${rule.notes || ""}`.trim(),
      evidence_status: exact.length ? rule.evidence_status : "partial",
      runtime_fallback: true
    }));
}
