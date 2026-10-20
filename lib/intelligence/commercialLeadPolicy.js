/**
 * Shared commercial exclusion rules.
 *
 * These are not general business classifications: they are deliberate
 * AUTONOMIA end-client prospecting exclusions. A marketplace, staffing
 * intermediary, ESN or recruiting agency is not a direct client lead.
 */
const EXCLUDED_COMPANY = /(?:\bESN\b|\bSSII\b|cabinet de recrutement|agence de recrutement|recruitment agency|staffing agency|\bcapgemini\b|sopra\s*steria|\balten\b|\bdevoteam\b|\binetum\b|\batos\b|\beviden\b|\bonepoint\b|\baubay\b|\bextia\b|\bmeritis\b|\bdavidson\b|\bwavestone\b|\baccenture\b|\btalan\b|\bcognizant\b|\bcollective[.\s_-]*work\b)/i;

const EXCLUDED_AGGREGATORS = /^(?:directemploi|indeed|talents[ _-]?handicap)$/i;
export function isExcludedCommercialCompany(name) {
  const cleaned = String(name || "").trim();
  return EXCLUDED_COMPANY.test(cleaned) || EXCLUDED_AGGREGATORS.test(cleaned);
}

/**
 * France-only end-client commercial scope.
 * These accounts were inspected in the current pipeline and are outside
 * AUTONOMIA's French sales territory. A foreign company with an evidenced
 * French establishment can be considered separately after qualification;
 * don't discard French accounts merely because their company is international.
 */
const OUTSIDE_FRANCE_ACCOUNTS = new Set([
  "bending spoons",
  "wko inhouse gmbh der wirtschaftskammern osterreichs bereich wko it",
  "sikt kunnskapssektorens tjenesteleverandor",
  "iarnrod eireann irish rail",
  "agence de l union europeenne pour la cooperation judiciaire en matiere penale eurojust",
  "as vinmonopolet"
]);
const OUTSIDE_FRANCE_LOCATION = /\b(?:norway|norge|norv[eè]ge|oslo|austria|autriche|osterreich|wien|vienna|ireland|irlande|dublin|den haag|the hague|la haye|pays.bas|netherlands|norvege)\b/i;

function normalizedCommercialIdentity(name) {
  return String(name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, " et ").replace(/[^a-z0-9]+/g, " ").trim();
}
export function isOutsideFranceCommercialAccount(account) {
  const name = typeof account === "string" ? account : account?.name;
  if (OUTSIDE_FRANCE_ACCOUNTS.has(normalizedCommercialIdentity(name))) return true;
  if (!account || typeof account === "string") return false;
  const locations = (account.locations || []).filter(Boolean);
  // Only exclude by geography if *every* documented location is abroad.
  // An empty or ambiguous location is not proof that an account is abroad.
  return locations.length > 0 && locations.every(location => OUTSIDE_FRANCE_LOCATION.test(String(location)));
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
    if (!/^\/in\/[^/\s?#]+(?:\/(?:fr|en))?\/?$/i.test(url.pathname)) return null;
    // Keep a clean profile path; drop all tracking/search/query parameters.
    const profileSlug = url.pathname.match(/^\/in\/([^/]+)/i)?.[1];
    return profileSlug ? `https://www.linkedin.com/in/${profileSlug}` : null;
  } catch {
    return null;
  }
}
