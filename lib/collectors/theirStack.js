// Authorized TheirStack Jobs API. One credit is consumed per returned job.
// Keep credentials exclusively in server environment variables.
const API_URL = "https://api.theirstack.com/v1/jobs/search";
const DEFAULT_TITLES = ["AI Engineer", "Data Engineer", "Data Scientist", "Machine Learning", "LLM", "AI Product", "IA"];
const INTERMEDIARY = /\b(ESN|cabinet de recrutement|recruitment agency|staffing|conseil en recrutement|pour le compte de notre client)\b/i;
// Explicit ESN indicators and recruitment intermediaries are excluded from prospect results.
const ESN_NAMES = /\b(?:capgemini|alten|sopra\s*steria|inetum|devoteam|atos|eviden|aubay|extia|meritis|cgi|onepoint|davidson|talan|akkk?odis|sii|open\s*group|econocom)\b/i;
const ESN_ACTIVITY = /\b(?:entreprise de services du num[eé]rique|\bESN\b|digital engineering consulting|IT services and IT consulting)\b/i;
export function isEsnEmployer(job) {
  const company = job?.company_object || {};
  const name = String(job?.company || company.name || "");
  const employerDescription = String(company.description || company.about || company.industry || company.industry_name || "");
  return ESN_NAMES.test(name) || ESN_ACTIVITY.test(employerDescription);
}

const INTERMEDIARY_NAMES = /(?:free[- ]?work|hellowork|jobgether|jobright|hays|michael\s*page|robert\s*half|randstad|manpower|adecco|expectra|talent\.io|lehibou|mon\s*consultant\s*ind[eé]pendant)/i;
const INTERMEDIARY_ACTIVITY = /(?:cabinet\s+de\s+recrutement|agence\s+de\s+recrutement|recruitment\s+agency|recruiting\s+agency|staffing\s+(?:agency|services)|recruitment\s+(?:consultancy|firm)|interm[eé]diaire\s+de\s+recrutement|placement\s+de\s+(?:candidats|freelances)|plateforme\s+de\s+(?:recrutement|missions\s+freelance))/i;
const ON_BEHALF = /(?:pour\s+le\s+compte\s+de\s+(?:notre|son|un)\s+client|chez\s+notre\s+client|mission\s+chez\s+(?:notre|un)\s+client|on\s+behalf\s+of\s+(?:our|a)\s+client)/i;
export function isExcludedIntermediary(job) {
  if (isEsnEmployer(job)) return true;
  const company = job?.company_object || {};
  if (company.is_recruiting_agency === true) return true;
  const name = String(job?.company || company.name || "");
  const activity = [company.description, company.about, company.industry, company.industry_name].filter(Boolean).join(" ");
  const description = String(job?.description || "");
  return INTERMEDIARY_NAMES.test(name) || INTERMEDIARY_ACTIVITY.test(name) ||
    INTERMEDIARY_ACTIVITY.test(activity) || ON_BEHALF.test(description);
}

export function normalizeTheirStackJob(job) {
  const id = String(job?.id ?? job?.job_id ?? "").trim();
  if (!id || !job?.job_title && !job?.title) return null;
  const company = job.company_object || {};
  const title = String(job.job_title || job.title).trim();
  const companyName = String(job.company || company.name || "").trim() || null;
  const description = String(job.description || "");
  const recruitingAgency = company.is_recruiting_agency === true;
  const intermediary = isExcludedIntermediary(job);
  const sourceUrl = job.url || job.final_url || job.source_url || null;
  const linkedinMatch = String(sourceUrl || "").match(/linkedin\.com\/jobs\/view\/(\d+)/);
  return {
    sourceId: "theirstack",
    sourceRecordId: id,
    title,
    companyName,
    location: job.location || (Array.isArray(job.cities) ? job.cities.join(", ") : null),
    contractType: Array.isArray(job.employment_statuses) ? job.employment_statuses.join(", ") : null,
    sourceUrl,
    publishedAt: job.date_posted || null,
    signalKeys: ["ai_demand", intermediary ? "intermediary_review" : "direct_buyer_review"],
    rawPayload: {
      provider: "theirstack",
      source_url: sourceUrl,
      linkedin_job_id: linkedinMatch?.[1] || null,
      company_domain: job.company_domain || company.domain || null,
      company_linkedin_url: company.linkedin_url || null,
      company_is_recruiting_agency: company.is_recruiting_agency ?? null,
      buyer_classification: intermediary ? "intermediary_excluded" : "unverified_direct_buyer",
      job_description: description.slice(0, 12000)
    }
  };
}

export async function searchTheirStack({
  apiKey = process.env.THEIRSTACK_API_KEY,
  limit = 5,
  postedAtMaxAgeDays = 7,
  titles = DEFAULT_TITLES,
  fetchImpl = fetch
} = {}) {
  if (!apiKey || !String(apiKey).trim()) throw new Error("THEIRSTACK_API_KEY is missing");
  const safeLimit = Math.min(Math.max(Math.trunc(Number(limit) || 5), 1), 5);
  const days = Math.min(Math.max(Math.trunc(Number(postedAtMaxAgeDays) || 7), 1), 30);
  const payload = {
    limit: safeLimit,
    page: 0,
    posted_at_max_age_days: days,
    job_title_or: titles,
    job_country_code_or: ["FR"]
  };
  const response = await fetchImpl(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`TheirStack API returned HTTP ${response.status}`);
  const result = await response.json();
  if (!Array.isArray(result?.data)) throw new Error("Unexpected TheirStack response");
  return {
    source: "theirstack",
    fetched: result.data.length,
    items: result.data.filter((job) => !isExcludedIntermediary(job)).map(normalizeTheirStackJob).filter(Boolean),
    excludedEsn: result.data.filter(isEsnEmployer).length,
    excludedIntermediaries: result.data.filter(isExcludedIntermediary).length,
    query: { limit: safeLimit, postedAtMaxAgeDays: days, titles },
    metadata: result.metadata || null
  };
}
