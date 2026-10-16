import { plausibleEmployerName, evidenceMatchesStoredEmployer } from "../collectors/employerEvidence.js";
/**
 * Anonymous-safe projection for the public Growth Intelligence landing page.
 *
 * Do NOT send contacts, workspace account intelligence, messages, statuses,
 * private collector logs, CRM activities, secrets or auth metadata here.
 */
const SOURCES = new Map([
  ["linkedin", ["linkedin.com"]],
  ["indeed", ["indeed.com", "indeed.fr"]],
  ["france_travail_jobs", ["francetravail.fr", "pole-emploi.fr"]],
  ["welcome_to_the_jungle", ["welcometothejungle.com"]],
  ["apec", ["apec.fr"]],
  ["hellowork", ["hellowork.com"]]
]);

const EXCLUDED = /(?:\bESN\b|\bSSII\b|cabinet de recrutement|agence de recrutement|recruitment agency|staffing agency|interim|int[eé]rim|capgemini|sopra\s*steria|alten|devoteam|inetum|atos|eviden|onepoint|aubay|extia|meritis|davidson|wavestone|accenture|talan|cognizant)/i;

function safePublicJobUrl(rawUrl, sourceId) {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== "https:" || u.username || u.password) return null;
    const domains = SOURCES.get(sourceId) || [];
    if (!domains.some(domain => u.hostname === domain || u.hostname.endsWith("." + domain))) return null;
    return u.toString();
  } catch {
    return null;
  }
}
function clean(value, max=180) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, max);
}
function dateTime(value) {
  const stamp = new Date(value || "").getTime();
  return Number.isFinite(stamp) ? stamp : 0;
}
/**
 * Job records are public on their respective source, but this is NOT an
 * end-client verification or an authorization to outreach.
 */
export function publicHiringSignals(items = [], {limit=16}={}) {
  const found=new Map();
  for(const item of items) {
    const sourceId=String(item?.source_id || "");
    const sourceUrl=safePublicJobUrl(item?.source_url, sourceId);
    const company=plausibleEmployerName(clean(item?.company_name, 100));
    const title=clean(item?.title, 180);
    const description=clean(item?.raw_payload?.search_description, 200);
    if(!sourceUrl || !company || !title) continue;
    if (sourceId !== "france_travail_jobs" && !evidenceMatchesStoredEmployer(item)) continue;
    const companyLower=company.toLowerCase();
    if(["(sans titre)","inconnu","confidentiel","anonyme","entreprise confidentielle"].includes(companyLower)) continue;
    if(EXCLUDED.test([company,description].join(" ")) || item?.raw_payload?.intermediary_risk === true ||
        (item?.signal_keys || []).includes("intermediary_risk")) continue;
    // For LinkedIn/Indeed, a known direct employer signal is required.
    // Other platforms remain only hiring leads, not validated final clients.
    if(["linkedin","indeed"].includes(sourceId) && item?.raw_payload?.direct_employer_evidence !== true) continue;
    const key = [company, title].map(s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"")).join(":");
    if(!key || found.has(key)) continue;
    found.set(key, {
      id: clean(item?.id || key, 100),
      company,
      title,
      sourceId,
      sourceUrl,
      publishedAt: dateTime(item?.published_at) ? new Date(item.published_at).toISOString() : null,
      employerStatus: "à vérifier"
    });
  }
  return [...found.values()]
    .sort((a,b)=>dateTime(b.publishedAt)-dateTime(a.publishedAt))
    .slice(0,Math.min(30,Math.max(1, Number(limit)||16)));
}
export const PUBLIC_HIRING_SOURCE_IDS = [...SOURCES.keys()];
