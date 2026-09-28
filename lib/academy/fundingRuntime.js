import { ACADEMY_FUNDING_RULES_2026 } from "./funding2026.js";

export function getStaticFundingRulesForCompany({ opcoCode, idcc, limit = 50 } = {}) {
  const normalizedOpco = String(opcoCode || "").trim().toUpperCase();
  const normalizedIdcc = String(idcc || "").replace(/\D/g, "").padStart(4, "0");

  return ACADEMY_FUNDING_RULES_2026
    .filter((rule) => String(rule.opco_code || "").toUpperCase() === normalizedOpco)
    .filter((rule) => {
      const ruleIdcc = rule.idcc ? String(rule.idcc).replace(/\D/g, "").padStart(4, "0") : "";
      return !ruleIdcc || ruleIdcc === normalizedIdcc;
    })
    .slice(0, limit)
    .map((rule, index) => ({
      id: `static-${normalizedOpco}-${normalizedIdcc || "all"}-${index}`,
      ...rule,
      runtime_fallback: true
    }));
}
