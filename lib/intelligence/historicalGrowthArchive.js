import { reviewedResearchContacts } from "./reviewedOpportunityContacts.js";
import { listReviewedCompanyContacts } from "./reviewedDecisionMakers.js";
import { isExcludedCommercialCompany, personalLinkedInProfileUrl } from "./commercialLeadPolicy.js";

// These six employers were explicitly excluded from French commercial outreach.
// The archive remains intact; exclusions affect only ACTIVE targeting.
const OUTSIDE_FRANCE = [
  /bending spoons/i,
  /wko inhouse/i,
  /sikt.*kunnskaps/i,
  /iarnr.d.*ireann|irish rail/i,
  /eurojust|coop.ration judiciaire en mati.re p.nale/i,
  /as vinmonopolet/i
];
export function isOutsideFranceTarget(company) {
  return OUTSIDE_FRANCE.some(pattern => pattern.test(String(company || "")));
}
function clean(value, length=260) { return String(value || "").replace(/\s+/g," ").trim().slice(0,length); }
function publicUrl(raw) {
  try {
    const url = new URL(String(raw || ""));
    return url.protocol === "https:" && !url.username && !url.password ? url.origin + url.pathname : null;
  } catch { return null; }
}
function normalize(value) { return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function scope(company, originCompany, status) {
  if (isOutsideFranceTarget(company) || isOutsideFranceTarget(originCompany)) return "hors_france";
  if (isExcludedCommercialCompany(company) || isExcludedCommercialCompany(originCompany) ||
    /interm[eé]diaire|cabinet|client final (?:non|à)|portage|recrutement pour|prestataire/i.test(status || "")) return "intermediaire";
  return "a_qualifier"; // Historic evidence is not proof of an active opportunity.
}

export function buildHistoricalGrowthArchive() {
  const records = [];
  // Source ids are scoped to their specific job post; never map a platform's
  // contact to all the platform's end clients.
  for (const entry of reviewedResearchContacts) {
    records.push({
      origin: "annonce_historique",
      company: clean(entry.resolvedCompany || entry.company),
      sourceCompany: clean(entry.company),
      name: clean(entry.name,100),
      role: clean(entry.role,200),
      status: clean(entry.status,240),
      linkedinUrl: personalLinkedInProfileUrl(entry.linkedin),
      evidenceUrl: publicUrl(entry.additionalSource || entry.source),
      originalUrl: publicUrl(entry.source),
      reviewedAt: clean(entry.reviewedAt,12),
      opportunityIds: (entry.ids || []).filter(id => typeof id === "string"),
      scope: scope(entry.resolvedCompany || entry.company, entry.company, entry.status)
    });
  }
  for (const entry of listReviewedCompanyContacts()) {
    records.push({
      origin: "entreprise_historique",
      company: clean(entry.aliases?.[0] || ""),
      sourceCompany: clean(entry.aliases?.[0] || ""),
      name: clean(entry.name,100),
      role: clean(entry.role,200),
      status: clean(entry.status,240),
      linkedinUrl: personalLinkedInProfileUrl(entry.linkedin),
      evidenceUrl: publicUrl(entry.source),
      originalUrl: publicUrl(entry.source),
      reviewedAt: clean(entry.reviewedAt,12),
      opportunityIds: [],
      scope: scope(entry.aliases?.[0],entry.aliases?.[0],entry.status)
    });
  }
  // Deduplicate people by their canonical personal LinkedIn URL. Do not merge
  // separate people with the same name or anonymous opportunities.
  const groups = new Map();
  for (const record of records) {
    const key = record.linkedinUrl || (record.name ? "without-url:"+normalize(record.company)+":"+normalize(record.name) : "anonymous:"+records.indexOf(record));
    const current = groups.get(key);
    if (!current) { groups.set(key,{...record, references:[record]}); continue; }
    current.references.push(record);
    current.opportunityIds=[...new Set([...current.opportunityIds,...record.opportunityIds])];
    if (current.scope === "intermediaire" && record.scope === "a_qualifier") current.scope = "a_qualifier";
    if (!current.evidenceUrl && record.evidenceUrl) current.evidenceUrl=record.evidenceUrl;
    if (!current.role && record.role) current.role=record.role;
  }
  const people = [...groups.values()].map(({references,...person}) => ({
    ...person,
    referenceCount:references.length,
    companies:[...new Set(references.map(x=>x.company).filter(Boolean))],
    opportunityIds:[...new Set(references.flatMap(x=>x.opportunityIds))]
  }));
  const located = people.filter(p=>p.name && p.linkedinUrl);
  return {
    records: records.length,
    opportunityLinks:records.reduce((sum,p)=>sum+p.opportunityIds.length,0),
    uniqueProfiles:located.length,
    missingLinkedin:people.filter(p=>p.name && !p.linkedinUrl).length,
    candidates:people.filter(p=>p.scope==="a_qualifier" && p.name && p.linkedinUrl).length,
    foreign:people.filter(p=>p.scope==="hors_france").length,
    intermediary:people.filter(p=>p.scope==="intermediaire").length,
    people
  };
}
