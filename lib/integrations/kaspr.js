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
      "Content-Type": "application/json"
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
