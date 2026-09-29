const DEFAULT_BASE_URL = "https://api.developers.kaspr.io";

function requireApiKey(apiKey = process.env.KASPR_API_KEY) {
  if (!apiKey) throw new Error("KASPR_API_KEY is not configured");
  return apiKey;
}

export function standardLinkedInProfileId(value) {
  const url = String(value || "").trim();
  const match = url.match(/^https:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([^?#/]+)\/?/i);
  if (!match) {
    throw new Error("Kaspr requires a standard LinkedIn profile URL, not a Sales Navigator URL");
  }
  return decodeURIComponent(match[1]);
}

function normalizeRequestedFields(values, fallback = ["workEmail"]) {
  const allowed = new Set(["workEmail", "phone", "directEmail"]);
  const source = Array.isArray(values) && values.length ? values : fallback;
  return [...new Set(source.map((value) => String(value || "").trim()).filter((value) => allowed.has(value)))];
}

async function request(path, {
  method = "POST",
  body,
  apiKey,
  baseUrl
} = {}) {
  const key = requireApiKey(apiKey);
  const root = String(baseUrl || process.env.KASPR_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const response = await fetch(root + path, {
    method,
    signal: AbortSignal.timeout(12000),
    headers: {
      Authorization: `Bearer ${key}`,
      "accept-version": "v2.0",
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let detail = String(payload || response.statusText);
    if (typeof payload === "object" && payload) {
      const parts = [
        payload.message,
        payload.reason,
        payload.detail,
        typeof payload.error === "string" ? payload.error : null
      ].filter(Boolean);
      detail = parts.length ? parts.join(" · ") : JSON.stringify(payload);
    }
    throw new Error("Kaspr API " + response.status + ": " + detail);
  }

  return payload;
}

export function hasKasprIntegration() {
  return Boolean(process.env.KASPR_API_KEY);
}

/**
 * Kaspr API v2 contract:
 * POST /profile/linkedin with the standard LinkedIn slug, full name,
 * dataToGet and requiredData. Autonomia deliberately excludes directEmail.
 */
export async function enrichKasprLinkedInProfile({
  linkedinUrl,
  name,
  dataToGet = ["workEmail"],
  requiredData = ["workEmail"],
  apiKey,
  baseUrl
} = {}) {
  const id = standardLinkedInProfileId(linkedinUrl);
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    throw new Error("Kaspr profile enrichment requires a verified contact name");
  }

  const requested = normalizeRequestedFields(dataToGet, ["workEmail"]);
  const required = normalizeRequestedFields(requiredData, ["workEmail"])
    .filter((field) => requested.includes(field));

  if (!requested.length) {
    throw new Error("Kaspr enrichment requires at least one requested field");
  }

  return request("/profile/linkedin", {
    method: "POST",
    body: {
      id,
      name: cleanName,
      dataToGet: requested,
      requiredData: required
    },
    apiKey,
    baseUrl
  });
}

export async function getKasprRemainingCredits({
  apiKey,
  baseUrl
} = {}) {
  return request("/keys/remainingCredits", {
    method: "GET",
    apiKey,
    baseUrl
  });
}

function scalarStrings(value) {
  if (typeof value === "string") return [value.trim()].filter(Boolean);
  if (Array.isArray(value)) return value.flatMap(scalarStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(scalarStrings);
  }
  return [];
}

function collectByKey(value, matcher, out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (const item of value) collectByKey(item, matcher, out);
    return out;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (matcher.test(key)) out.push(...scalarStrings(nested));
    if (nested && typeof nested === "object") collectByKey(nested, matcher, out);
  }
  return out;
}

function firstEmail(values = []) {
  return values.find((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) || null;
}

function firstPhone(values = []) {
  return values.find((value) => /\+?[0-9][0-9 .()\/-]{6,}/.test(value)) || null;
}

/**
 * Persist only business coordinates. Personal/direct emails are intentionally ignored.
 */
export function extractKasprContactData(payload = {}) {
  const profile = payload?.profile && typeof payload.profile === "object"
    ? payload.profile
    : payload;

  const professionalEmails = [
    profile?.workEmail,
    profile?.starryWorkEmail,
    ...(Array.isArray(profile?.workEmails) ? profile.workEmails : []),
    profile?.professionalEmail,
    profile?.starryProfessionalEmail,
    ...(Array.isArray(profile?.professionalEmails) ? profile.professionalEmails : [])
  ].flatMap(scalarStrings);

  const phones = [
    profile?.phone,
    profile?.starryPhone,
    ...(Array.isArray(profile?.phones) ? profile.phones : [])
  ].flatMap(scalarStrings);

  const emailB2b =
    firstEmail(professionalEmails) ||
    firstEmail(collectByKey(profile, /work.*email|email.*work|professional.*email|email.*professional/i));
  const phone =
    firstPhone(phones) ||
    firstPhone(collectByKey(profile, /phone|mobile|tel/i));

  return {
    email_b2b: emailB2b,
    email_direct: null,
    phone,
    found: Boolean(emailB2b || phone)
  };
}
