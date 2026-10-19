/**
 * Server-side, source-backed decision-maker recommendations for the Growth
 * homepage. The anonymous page must NEVER read or serialize workspace CRM.
 *
 * This module only enriches public job postings with historically reviewed
 * professional references from reviewedDecisionMakers. An inferred role is
 * explicitly a SEARCH TARGET, not an identified person or a verified buyer.
 */
import { getReviewedDecisionMaker } from "./reviewedDecisionMakers.js";

const INTERMEDIARY = /(?:\bESN\b|\bSSII\b|interm[eé]diaire|cabinet de recrutement|cabinet de conseil|agence de recrutement|prestataire pour (?:un|son) client)/i;
const LEADERSHIP = /(?:dirigeant|dirigeante|pr[eé]sident|pr[eé]sidente|fondateur|fondatrice|directeur g[eé]n[eé]ral|directrice g[eé]n[eé]rale|CEO|g[eé]rant)/i;
const ACADEMY_ROLE = /(?:formation|learning|L&D|RH|ressources humaines|DRH|talent|comp[eé]tences|p[eé]dagogique|campus)/i;
const EXPERTS_ROLE = /(?:IA|artificielle|data|digital|num[eé]rique|DSI|CTO|IT|tech|informatique|recrutement|talent acquisition|RH|ressources humaines)/i;
const BUILD_ROLE = /(?:IA|artificielle|data|digital|num[eé]rique|DSI|CTO|IT|tech|informatique|transformation|op[eé]ration|innovation|produit)/i;

function safeLinkedIn(url) {
  try {
    const parsed = new URL(String(url || ""));
    if (parsed.protocol !== "https:" || !/^(?:[a-z]{2,3}\.)?linkedin\.com$/i.test(parsed.hostname)) return null;
    if (!/^\/in\/[^/\s]+(?:\/[^/\s]+)?\/?$/i.test(parsed.pathname)) return null;
    return parsed.origin + parsed.pathname;
  } catch { return null; }
}
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
function linkedInSearch(company, role) {
  // A LinkedIn people search is a discovery shortcut, never an identified
  // decision-maker. Use the company + business function; no private data.
  const terms = [compact(company,90),compact(role,90)].filter(Boolean).join(" ");
  return "https://www.linkedin.com/search/results/people/?keywords=" + encodeURIComponent(terms);
}
export function recommendDecisionMaker({company, title="", offer=""}={}, {now=Date.now(), lookup=getReviewedDecisionMaker}={}) {
  const intent = intentForSignal({title,offer});
  const targetRole = wantedRoleForIntent(intent);
  const base = {intent, targetRole, status:"À identifier", searchUrl:linkedInSearch(company,targetRole)};
  const person = lookup(company,{now});
  if (!person || !person.name || !person.role) return { ...base, kind:"role_search" };
  if (INTERMEDIARY.test([person.status,person.role].join(" "))) return { ...base, kind:"role_search" };
  if (!relevantReviewedRole(String(person.role),intent)) return { ...base, kind:"role_search" };
  const linkedin = safeLinkedIn(person.linkedin);
  const source = safePublicSource(person.source);
  if (!linkedin || !source) return { ...base, kind:"role_search" };
  const reviewedAt = /^\d{4}-\d{2}-\d{2}$/.test(String(person.reviewedAt || "")) ? person.reviewedAt : null;
  if (!reviewedAt || now - Date.parse(reviewedAt) > 30 * 86400000) return { ...base, kind:"role_search" };
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
  return signals.map(signal=>({
    ...signal,
    decisionMaker:recommendDecisionMaker({
      company:signal.company,
      title:signal.title
    },options)
  }));
}
export function enrichPrivateGrowthPlays(plays=[], options={}) {
  return plays.map(play=>({
    ...play,
    reviewedDecisionMaker:recommendDecisionMaker({
      company:play.company,
      title:play.evidence?.title || "",
      offer:play.offer
    },options)
  }));
}
