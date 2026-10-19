/**
 * Shared commercial exclusion rules.
 *
 * These are not general business classifications: they are deliberate
 * AUTONOMIA end-client prospecting exclusions. A marketplace, staffing
 * intermediary, ESN or recruiting agency is not a direct client lead.
 */
const EXCLUDED_COMPANY = /(?:\bESN\b|\bSSII\b|cabinet de recrutement|agence de recrutement|recruitment agency|staffing agency|\bcapgemini\b|sopra\s*steria|\balten\b|\bdevoteam\b|\binetum\b|\batos\b|\beviden\b|\bonepoint\b|\baubay\b|\bextia\b|\bmeritis\b|\bdavidson\b|\bwavestone\b|\baccenture\b|\btalan\b|\bcognizant\b|\bcollective[.\s_-]*work\b)/i;

export function isExcludedCommercialCompany(name) {
  return EXCLUDED_COMPANY.test(String(name || ""));
}

/**
 * Only actual personal profile URLs may be labelled "Profil LinkedIn".
 * LinkedIn people searches, company pages, job ads and posts are NOT contacts.
 */
export function personalLinkedInProfileUrl(rawUrl) {
  try {
    const url = new URL(String(rawUrl || ""));
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (!/^(?:(?:www|[a-z]{2,3})\.)?linkedin\.com$/i.test(url.hostname)) return null;
    if (!/^\/in\/[^/\s?#]+\/?$/i.test(url.pathname)) return null;
    // Keep a clean profile path; drop all tracking/search/query parameters.
    return `https://www.linkedin.com${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}
