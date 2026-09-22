
const DEFAULT_BASE_URL = "https://developers.waalaxy.com";

function requireApiKey(apiKey = process.env.WAALAXY_API_KEY) {
  if (!apiKey) throw new Error("WAALAXY_API_KEY is not configured");
  return apiKey;
}

async function request(path, { method = "GET", body, apiKey, baseUrl } = {}) {
  const key = requireApiKey(apiKey);
  const root = baseUrl || process.env.WAALAXY_API_BASE_URL || DEFAULT_BASE_URL;
  const response = await fetch(root + path, {
    method,
    headers: {
      Authorization: "Bearer " + key,
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload
        ? payload.detail || payload.title || JSON.stringify(payload)
        : String(payload || response.statusText);
    throw new Error("Waalaxy API " + response.status + ": " + detail);
  }

  return payload;
}

export function hasWaalaxyIntegration() {
  return Boolean(process.env.WAALAXY_API_KEY);
}

export async function testWaalaxyConnection(options = {}) {
  return request("/integrations/test", options);
}

export async function getWaalaxyProspectLists(options = {}) {
  return request("/prospectLists/getProspectLists", options);
}

export async function getWaalaxyCampaigns(options = {}) {
  return request("/campaigns/getAll", options);
}

export async function importWaalaxyProspects({
  prospects,
  prospectListId,
  campaignId,
  addExistingProspectInCampaign = false,
  apiKey,
  baseUrl
} = {}) {
  if (!Array.isArray(prospects) || !prospects.length) {
    throw new Error("At least one prospect is required");
  }
  if (!prospectListId) throw new Error("prospectListId is required");

  const normalized = prospects.map((prospect) => {
    const url = String(prospect?.url || prospect?.linkedin_url || "").trim();
    if (!/^https:\/\/(?:www\.)?linkedin\.com\/in\//i.test(url)) {
      throw new Error("Each Waalaxy prospect must have a standard LinkedIn profile URL");
    }

    const customProfile = {};
    if (prospect.firstName) customProfile.firstName = prospect.firstName;
    if (prospect.lastName) customProfile.lastName = prospect.lastName;
    if (prospect.email) customProfile.email = prospect.email;

    const customVariables = [
      prospect.company ? { label: "Autonomia account", value: String(prospect.company) } : null,
      prospect.matchedRole ? { label: "Autonomia role", value: String(prospect.matchedRole) } : null,
      prospect.trigger ? { label: "Autonomia signal", value: String(prospect.trigger).slice(0, 250) } : null
    ].filter(Boolean);

    return {
      url,
      ...(Object.keys(customProfile).length ? { customProfile } : {}),
      ...(customVariables.length ? { customVariables } : {})
    };
  });

  return request("/prospects/addProspectFromIntegration", {
    method: "POST",
    apiKey,
    baseUrl,
    body: {
      prospects: normalized,
      prospectListId,
      ...(campaignId ? { campaignId } : {}),
      origin: { name: "autonomia" },
      canCreateDuplicates: false,
      moveDuplicatesToOtherList: false,
      shouldOverwriteCustomProfileData: false,
      addExistingProspectInCampaign: Boolean(addExistingProspectInCampaign)
    }
  });
}
