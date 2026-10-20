/**
 * Server-side, source-backed decision-maker recommendations for the Growth
 * homepage. The anonymous page must NEVER read or serialize workspace CRM.
 *
 * This module only enriches public job postings with historically reviewed
 * professional references from reviewedDecisionMakers. An inferred role is
 * explicitly a SEARCH TARGET, not an identified person or a verified buyer.
 */
import { getReviewedDecisionMaker } from "./reviewedDecisionMakers.js";
import { getSnapshotCandidate } from "./decisionMakerSnapshot.js";
import { isExcludedCommercialCompany, personalLinkedInProfileUrl } from "./commercialLeadPolicy.js";
import { isOutsideFranceTarget } from "./franceCommercialScope.js";

const INTERMEDIARY = /(?:\bESN\b|\bSSII\b|interm[eé]diaire|\bcabinet\b|agence de recrutement|prestataire pour (?:un|son) client)/i;
const LEADERSHIP = /(?:dirigeant|dirigeante|pr[eé]sident|pr[eé]sidente|fondateur|fondatrice|directeur g[eé]n[eé]ral|directrice g[eé]n[eé]rale|CEO|g[eé]rant)/i;
const ACADEMY_ROLE = /(?:formation|learning|L&D|RH|ressources humaines|DRH|talent|comp[eé]tences|p[eé]dagogique|campus)/i;
const EXPERTS_ROLE = /(?:IA|artificielle|data|digital|num[eé]rique|DSI|CTO|IT|tech|informatique|recrutement|talent acquisition|RH|ressources humaines)/i;
const BUILD_ROLE = /(?:IA|artificielle|data|digital|num[eé]rique|DSI|CTO|IT|tech|informatique|transformation|op[eé]ration|innovation|produit)/i;

function safePublicSource(url) {
  try {
    const parsed = new URL(String(url || ""));
    return parsed.protocol === "https:" && !parsed.username && !parsed.password
      ? parsed.origin + parsed.pathname : null;
  } catch { return null; }
}
function compact(value,max=150) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0,max);
}
export function intentForSignal({title="", offer=""}={}) {
  if (offer === "ACADEMY" || /(?:formation|learning|L&D|acculturation|adoption|comp[eé]tences|upskilling|copilot)/i.test(title)) return "ACADEMY";
  if (offer === "BUILD" || /(?:automatisation|orchestration|workflow|agents? IA|agentic)/i.test(title)) return "BUILD";
  return "EXPERTS";
}
export function wantedRoleForIntent(intent) {
  switch (intent) {
    case "ACADEMY": return "Responsable formation / L&D";
    case "BUILD": return "DSI / Responsable transformation";
    default: return "Head of AI / Head of Data";
  }
}
function relevantReviewedRole(role, intent) {
  if (LEADERSHIP.test(role)) return true; // Direction identified; mandate on this need remains unconfirmed.
  if (intent === "ACADEMY") return ACADEMY_ROLE.test(role);
  if (intent === "BUILD") return BUILD_ROLE.test(role);
  return EXPERTS_ROLE.test(role);
}
export function recommendDecisionMaker({company, title="", offer=""}={}, {now=Date.now(), lookup=getReviewedDecisionMaker, snapshot=null}={}) {
  const intent = intentForSignal({title,offer});
  const targetRole = wantedRoleForIntent(intent);
  const base = {intent, targetRole, status:"Décideur à identifier"};
  if (isExcludedCommercialCompany(company) || isOutsideFranceTarget(company)) return { ...base, kind:"excluded_intermediary" };
  const person = lookup(company,{now});
  if (!person || !person.name || !person.role) {
    const candidate = getSnapshotCandidate(snapshot, company, { now });
    const profileUrl = personalLinkedInProfileUrl(candidate?.linkedin_url);
    if (candidate && profileUrl && Number(candidate.relevance_score || 0) >= 85) {
      return {
        ...base,
        kind:"search_candidate",
        name:compact(candidate.name_guess,100),
        role:compact(candidate.headline || candidate.matched_role,160),
        linkedinUrl:profileUrl,
        sourceUrl:profileUrl,
        status:"Profil à confirmer · fonction et employeur non vérifiés"
      };
    }
    return { ...base, kind:"no_identified_profile" };
  }
  if (INTERMEDIARY.test([person.status,person.role].join(" "))) return { ...base, kind:"no_identified_profile" };
  if (!relevantReviewedRole(String(person.role),intent)) return { ...base, kind:"no_identified_profile" };
  const linkedin = personalLinkedInProfileUrl(person.linkedin);
  const source = safePublicSource(person.source);
  if (!linkedin || !source) return { ...base, kind:"no_identified_profile" };
  const reviewedAt = /^\d{4}-\d{2}-\d{2}$/.test(String(person.reviewedAt || "")) ? person.reviewedAt : null;
  if (!reviewedAt || now < Date.parse(reviewedAt) || now - Date.parse(reviewedAt) > 30 * 86400000) return { ...base, kind:"no_identified_profile" };
  return {
    ...base,
    kind:"named_public_contact",
    name:compact(person.name,100),
    role:compact(person.role,160),
    linkedinUrl:linkedin,
    sourceUrl:source,
    reviewedAt,
    status:"Fonction documentée · rôle dans ce besoin à confirmer"
  };
}
export function enrichPublicSignalsWithDecisionMakers(signals=[], options={}) {
  return signals.filter(signal=>!isExcludedCommercialCompany(signal.company) && !isOutsideFranceTarget(signal.company)).map(signal=>({
    ...signal,
    decisionMaker:recommendDecisionMaker({
      company:signal.company,
      title:signal.title
    },options)
  }));
}
export function enrichPrivateGrowthPlays(plays=[], options={}) {
  return plays.filter(play=>!isExcludedCommercialCompany(play.company) && !isOutsideFranceTarget(play.company)).map(play=>({
    ...play,
    reviewedDecisionMaker:recommendDecisionMaker({
      company:play.company,
      title:play.evidence?.title || "",
      offer:play.offer
    },options)
  }));
}
