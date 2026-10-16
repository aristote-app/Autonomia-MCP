/**
 * Evidence-backed employer extraction for public job-search snippets.
 * Deliberately conservative: unknown is preferable to a fictional company.
 * A search snippet is not proof that a company itself is hiring.
 */
const PUBLISHER = /\s*(?:[|–—-]\s*)?(?:LinkedIn|Indeed(?:\.com|\.fr)?|Welcome to the Jungle|HelloWork|Apec)(?:\s+Jobs)?\s*$/i;
const FAKE_NAMES = /\b(?:help solve|most pressing|business challenges|billions of users|level of trust|our users|you will|what we|join us|work with|jobgether|jobright|recruteur anonyme|client confidentiel|entreprise confidentielle|organisation non identifi[eé]e|employeur inconnu|soci[eé]t[eé] confidentielle)\b/i;
const JOB_WORDS = /\b(?:engineer|scientist|developer|d[eé]veloppeur|ing[eé]nieur|responsable|directeur|recrutement|stage|internship|alternance|freelance|mission|hiring|jobs|emploi|remote|t[eé]l[eé]travail)\b/i;
const LOCATION_WORDS = /^(?:Paris|France|Lyon|Lille|Nantes|Bordeaux|Marseille|Nice|Rennes|Toulouse|Grenoble|Strasbourg|Montpellier|Île.de.France|Ile.de.France|Remote|France remote|Hybrid|Télétravail|France métropolitaine|[0-9]{2,5})(?:\s*\(\d{2,5}\))?$/i;
const GRAMMAR = /\b(?:and|with|how|our|their|you|your|we|they|clients|users|billions|most|pressing|solve|require|looking|recruiting|hiring|recherche|recrute|pour|des|postes|qui|vous|nous|notre)\b/i;

export function plausibleEmployerName(value) {
  const name = String(value || "").replace(/[\u200b\u200c\u200d]/g, "").replace(/\s+/g, " ").replace(/^[|·,;:.\s-]+|[|·,;:.\s-]+$/g, "").trim();
  if (!name || name.length < 2 || name.length > 67 || name.split(/\s+/).length > 6) return null;
  if (FAKE_NAMES.test(name) || GRAMMAR.test(name) || LOCATION_WORDS.test(name)) return null;
  if (JOB_WORDS.test(name) || /^(?:N\/A|Confidential|Anonyme|Entreprise|Company|Unknown|Jobboard|INDEED|LinkedIn)$/i.test(name)) return null;
  if (!/[a-zÀ-ÿ]/i.test(name)) return null;
  // Reject sentence fragments, including "help solve clients' most pressing ..." from SERP snippets.
  if (/^[a-zà-ÿ]{3,}\s+[a-zà-ÿ]/.test(name) && name.split(" ").length >= 4) return null;
  return name;
}
function cleanTitle(title) {
  return String(title || "").trim().replace(PUBLISHER, "").trim();
}
export function employerFromJobTitle(sourceId, rawTitle) {
  const title = cleanTitle(rawTitle);
  if (!title) return { companyName: null, jobTitle: "", evidence: null };
  let m;
  if (sourceId === "linkedin") {
    m = title.match(/^(.+?)\s+recrute pour des postes de\s+(.+)$/i)
      || title.match(/^(.+?)\s+hiring\s+(.+?)(?:\s+in\s+.+)?$/i);
    if (m) {
      const companyName = plausibleEmployerName(m[1]);
      return { companyName, jobTitle: m[2].trim(), evidence: companyName ? "title_employer" : null };
    }
  }
  m = title.match(/^(.+?)\s+(?:at|chez)\s+(.+?)(?:\s+[–—]\s+.+)?$/i);
  if (m) {
    const companyName = plausibleEmployerName(m[2]);
    return { companyName, jobTitle: m[1].trim(), evidence: companyName ? "title_employer" : null };
  }
  // Job title - Employer - City (postal code). Keep only if the second part is
  // plausibly a company; "Data Scientist - Paris (75)" must not become a company.
  const segments = title.split(/\s+[–—-]\s+/).map((s) => s.trim()).filter(Boolean);
  if (segments.length >= 3) {
    const candidate = plausibleEmployerName(segments[1]);
    const rest = segments.slice(2).join(" ");
    if (candidate && (LOCATION_WORDS.test(segments[2]) || /\b(?:Paris|France|Lyon|Remote|\d{2,5})\b/i.test(rest))) {
      return { companyName: candidate, jobTitle: segments[0], evidence: "title_employer" };
    }
  }
  return { companyName: null, jobTitle: title, evidence: null };
}

export function extractEmployerEvidence({sourceId, rawTitle, description, sourceUrl} = {}) {
  const parsed = employerFromJobTitle(sourceId, rawTitle);
  if (parsed.companyName) return parsed;

  // Only accept an explicitly *labelled* employer, not arbitrary "at/chez"
  // text: Brave snippets often quote generic marketing sentences.
  const snippet = String(description || "");
  const explicit = snippet.match(/(?:^|[\n|·;])\s*(?:Entreprise|Soci[eé]t[eé]|Employeur|Company|Employer)\s*[:：]\s*([^\n|·;,.:]{2,67})/i);
  const labelCandidate = plausibleEmployerName(explicit?.[1]);
  if (labelCandidate) return {companyName:labelCandidate, jobTitle:parsed.jobTitle, evidence:"explicit_employer_label"};

  if (sourceId === "welcome_to_the_jungle") {
    const m = String(sourceUrl || "").match(/\/fr\/companies\/([a-z0-9-]+)\/jobs\//i);
    const candidate = plausibleEmployerName(m?.[1]?.replace(/-/g, " "));
    if (candidate) return {companyName:candidate, jobTitle:parsed.jobTitle, evidence:"employer_career_slug"};
  }
  return parsed;
}

function canonicalName(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
export function evidenceMatchesStoredEmployer(signal) {
  const raw = signal?.raw_payload || {};
  const company = plausibleEmployerName(signal?.company_name);
  if (!company) return false;
  if (["title_employer","explicit_employer_label","employer_career_slug"].includes(raw.company_evidence_source)) {
    return raw.direct_employer_evidence === true;
  }
  // Legacy v8/v9: reparse the SOURCE title. Never trust search description's
  // broad "at/chez ..." inference or a boolean flag without provenance.
  if (!["linkedin_indeed_ai_terms_v8","multi_job_sources_v9"].includes(raw.discovery_version)) return false;
  const fromTitle = employerFromJobTitle(signal?.source_id, raw.search_title);
  return Boolean(fromTitle.companyName && canonicalName(fromTitle.companyName) === canonicalName(company));
}
