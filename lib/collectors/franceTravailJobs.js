let cachedToken = null;
let tokenExpiresAt = 0;

const TOKEN_URL =
  process.env.FRANCE_TRAVAIL_TOKEN_URL ||
  "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire";

const SEARCH_URL =
  process.env.FRANCE_TRAVAIL_JOBS_SEARCH_URL ||
  "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";

const SCOPE =
  process.env.FRANCE_TRAVAIL_SCOPE ||
  "api_offresdemploiv2 o2dsoffre";

export function hasFranceTravailJobCredentials() {
  return Boolean(
    process.env.FRANCE_TRAVAIL_CLIENT_ID &&
    process.env.FRANCE_TRAVAIL_CLIENT_SECRET
  );
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  if (!hasFranceTravailJobCredentials()) {
    throw new Error("France Travail API credentials are not configured");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.FRANCE_TRAVAIL_CLIENT_ID,
    client_secret: process.env.FRANCE_TRAVAIL_CLIENT_SECRET,
    scope: SCOPE
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    let detail = "";
    try {
      const errorPayload = await response.json();
      const code = String(errorPayload?.error || "").trim();
      const description = String(
        errorPayload?.error_description ||
        errorPayload?.errorDescription ||
        ""
      ).replace(/\s+/g, " ").trim();

      detail = [code, description].filter(Boolean).join(": ");
    } catch {
      // Keep the failure message generic if France Travail does not return JSON.
    }

    throw new Error(
      `France Travail token request failed (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }

  const payload = await response.json();
  if (!payload?.access_token) {
    throw new Error("France Travail token response did not include access_token");
  }

  cachedToken = payload.access_token;
  tokenExpiresAt = Date.now() + Math.max(Number(payload.expires_in) || 1200, 60) * 1000;
  return cachedToken;
}

function normalizeOffer(offer) {
  return {
    id: offer.id,
    title: offer.intitule || null,
    description: offer.description || null,
    companyName: offer.entreprise?.nom || null,
    location:
      offer.lieuTravail?.libelle ||
      offer.lieuTravail?.commune ||
      null,
    contractType:
      offer.typeContratLibelle ||
      offer.typeContrat ||
      null,
    publishedAt: offer.dateCreation || null,
    sourceUpdatedAt: offer.dateActualisation || null,
    sourceUrl:
      offer.origineOffre?.urlOrigine ||
      offer.contact?.urlPostulation ||
      null,
    competences: offer.competences || [],
    raw: offer
  };
}

export async function searchFranceTravailJobs({
  query = "intelligence artificielle",
  limit = 50,
  publishedWithinDays = 2
} = {}) {
  const token = await getAccessToken();
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 150);

  const url = new URL(SEARCH_URL);
  url.searchParams.set("motsCles", query);
  url.searchParams.set("range", `0-${safeLimit - 1}`);
  url.searchParams.set("sort", "1");

  if (publishedWithinDays) {
    url.searchParams.set(
      "publieeDepuis",
      String(Math.min(Math.max(Math.ceil(Number(publishedWithinDays) || 1), 1), 31))
    );
  }

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`France Travail jobs search failed (${response.status})`);
  }

  const payload = await response.json();
  const rows = Array.isArray(payload?.resultats) ? payload.resultats : [];

  return {
    source: "france_travail_jobs",
    query,
    count: rows.length,
    jobs: rows.map(normalizeOffer)
  };
}
