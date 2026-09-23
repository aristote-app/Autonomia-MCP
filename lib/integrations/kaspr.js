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
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
      version: "v2"
    },
    body: JSON.stringify(body || {})
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload
        ? payload.message || payload.detail || payload.error || JSON.stringify(payload)
        : String(payload || response.statusText);
    throw new Error("Kaspr API " + response.status + ": " + detail);
  }

  return payload;
}

export function hasKasprIntegration() {
  return Boolean(process.env.KASPR_API_KEY);
}

/**
 * Prepared from Kaspr's current official setup example:
 * POST /profile/linkedin with Authorization + JSON body containing name and id.
 *
 * dataToGet is deliberately caller-supplied. Autonomia does not guess chargeable
 * field identifiers because Kaspr consumes credits according to requested data.
 */
export async function enrichKasprLinkedInProfile({
  linkedinUrl,
  name,
  dataToGet,
  apiKey,
  baseUrl
} = {}) {
  const id = standardLinkedInProfileId(linkedinUrl);
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    throw new Error("Kaspr profile enrichment requires a verified contact name");
  }

  const body = {
    name: cleanName,
    id
  };

  if (dataToGet !== undefined && dataToGet !== null) {
    if (!Array.isArray(dataToGet) || dataToGet.some((value) => typeof value !== "string")) {
      throw new Error("Kaspr dataToGet must be an array of provider field identifiers");
    }
    body.dataToGet = [...new Set(dataToGet.map((value) => value.trim()).filter(Boolean))];
  }

  return request("/profile/linkedin", {
    method: "POST",
    body,
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
 * Kaspr response formats can evolve. Keep provider parsing deliberately tolerant
 * and only persist the minimum fields Autonomia actually needs.
 */
export function extractKasprContactData(payload = {}) {
  const b2bCandidates = collectByKey(
    payload,
    /(^|_)(b2b|work|professional|business).*email|email.*(b2b|work|professional|business)/i
  );
  const directCandidates = collectByKey(
    payload,
    /(^|_)(direct|personal|private).*email|email.*(direct|personal|private)/i
  );
  const anyEmailCandidates = collectByKey(payload, /email/i);
  const phoneCandidates = collectByKey(payload, /phone|mobile|tel/i);

  const emailB2b = firstEmail(b2bCandidates) || firstEmail(anyEmailCandidates);
  const emailDirect =
    firstEmail(directCandidates.filter((value) => value !== emailB2b)) || null;
  const phone = firstPhone(phoneCandidates);

  return {
    email_b2b: emailB2b,
    email_direct: emailDirect,
    phone,
    found: Boolean(emailB2b || emailDirect || phone)
  };
}

export function kasprRequestedFields(
  raw = process.env.KASPR_DATA_TO_GET
) {
  return [...new Set(
    String(raw || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  )];
}
