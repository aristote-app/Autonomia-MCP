import { classifyAiRole } from "../taxonomy/roles.js";

const TOKEN_URL =
  "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire";
const SEARCH_URL =
  "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";

const SEARCH_SPECS = Object.freeze([
  { kind: "freelance", query: "freelance intelligence artificielle" },
  { kind: "freelance", query: "freelance IA" },
  { kind: "freelance", query: "consultant intelligence artificielle freelance" },
  { kind: "training", query: "formateur intelligence artificielle" },
  { kind: "training", query: "formateur IA" },
  { kind: "training", query: "formateur ChatGPT" },
  { kind: "training", query: "formateur Copilot" }
]);

function uniq(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function textOf(offer) {
  return [
    offer?.intitule,
    offer?.description,
    offer?.typeContratLibelle,
    offer?.natureContrat,
    offer?.romeLibelle,
    offer?.appellationlibelle
  ]
    .filter(Boolean)
    .join(" ");
}

function isAiRelevant(text) {
  return /\bIA\b|\bAI\b|intelligence artificielle|GenAI|g[eé]n[eé]rative|LLM|RAG|Agentic|Copilot|ChatGPT|Machine Learning|MLOps/i.test(
    text
  );
}

function isFreelanceEvidence(text) {
  return /freelance|ind[eé]pendant|mission\s+(?:de\s+)?(?:consultant|expert|ing[eé]nieur|architecte)/i.test(
    text
  );
}

function isTrainingEvidence(text) {
  return /formateur|formatrice|formation|acculturation|sensibilisation|adoption|conduite du changement|change management/i.test(
    text
  );
}

async function getAccessToken({
  clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID,
  clientSecret = process.env.FRANCE_TRAVAIL_CLIENT_SECRET,
  scope = process.env.FRANCE_TRAVAIL_SCOPE || "api_offresdemploiv2 o2dsoffre"
} = {}) {
  if (!clientId || !clientSecret) {
    return {
      available: false,
      reason:
        "FRANCE_TRAVAIL_CLIENT_ID / FRANCE_TRAVAIL_CLIENT_SECRET are not configured"
    };
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json"
    },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `France Travail OAuth HTTP ${response.status}: ${text.slice(0, 500)}`
    );
  }

  const payload = await response.json();
  return {
    available: true,
    token: payload.access_token,
    expiresIn: payload.expires_in || null
  };
}

async function searchOffers(token, query, { limit = 50, publishedSinceDays = 31 } = {}) {
  const url = new URL(SEARCH_URL);
  url.searchParams.set("motsCles", query);
  url.searchParams.set("range", `0-${Math.min(Math.max(limit, 1), 149)}`);
  url.searchParams.set("sort", "1");
  url.searchParams.set("publieeDepuis", String(publishedSinceDays));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json"
    }
  });

  if (response.status === 204) return [];
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `France Travail search HTTP ${response.status}: ${text.slice(0, 500)}`
    );
  }

  const payload = await response.json();
  return payload?.resultats || [];
}

function normalizeOffer(offer, spec) {
  const text = textOf(offer);
  const classification = classifyAiRole({
    title: offer?.intitule,
    description: offer?.description
  });

  const competenceLabels = (offer?.competences || [])
    .map((item) => item?.libelle)
    .filter(Boolean);

  const freelance =
    spec.kind === "freelance" && isFreelanceEvidence(text);
  const training =
    spec.kind === "training" && isTrainingEvidence(text);

  if (!isAiRelevant(text)) return null;
  if (spec.kind === "freelance" && !freelance) return null;
  if (spec.kind === "training" && !training) return null;

  const companyName =
    offer?.entreprise?.nom ||
    offer?.origineOffre?.partenaires?.[0]?.nom ||
    null;

  const originUrl =
    offer?.origineOffre?.urlOrigine ||
    `https://candidat.francetravail.fr/offres/recherche/detail/${encodeURIComponent(
      offer.id
    )}`;

  const signalKeys = [
    ...classification.matches.map((match) => match.id),
    ...(freelance ? ["freelance"] : []),
    ...(training ? ["training_need"] : [])
  ];

  return {
    sourceId: "francetravail",
    sourceRecordId: String(offer.id),
    title: offer.intitule || "(sans titre)",
    companyName,
    location: offer?.lieuTravail?.libelle || null,
    contractType: training
      ? "Besoin formation IA"
      : freelance
        ? "Freelance / indépendant"
        : offer?.typeContratLibelle || null,
    sourceUrl: originUrl,
    publishedAt: offer?.dateCreation || null,
    sourceUpdatedAt: offer?.dateActualisation || new Date().toISOString(),
    roles: classification.matches.map((match) => match.label),
    skills: uniq(competenceLabels),
    tools: [],
    useCases: [],
    signalKeys: uniq(signalKeys),
    keywordSeeds: uniq([
      ...classification.matches.map((match) => match.label),
      ...competenceLabels
    ]),
    rawPayload: {
      discovery: "france_travail_offres_v2",
      search_kind: spec.kind,
      search_query: spec.query,
      type_contrat: offer?.typeContrat || null,
      type_contrat_libelle: offer?.typeContratLibelle || null,
      nature_contrat: offer?.natureContrat || null,
      rome_code: offer?.romeCode || null,
      rome_libelle: offer?.romeLibelle || null,
      description: offer?.description || null,
      difficult_to_fill: Boolean(offer?.offresManqueCandidats)
    }
  };
}

export async function discoverFranceTravailDemand({
  specs = SEARCH_SPECS,
  limitPerQuery = 50,
  publishedSinceDays = 31
} = {}) {
  const auth = await getAccessToken();
  if (!auth.available) {
    return {
      available: false,
      reason: auth.reason,
      provider: "france_travail_offres_v2",
      items: [],
      searches: []
    };
  }

  const items = [];
  const searches = [];

  for (const spec of specs) {
    try {
      const offers = await searchOffers(auth.token, spec.query, {
        limit: limitPerQuery,
        publishedSinceDays
      });
      const normalized = offers
        .map((offer) => normalizeOffer(offer, spec))
        .filter(Boolean);

      items.push(...normalized);
      searches.push({
        kind: spec.kind,
        query: spec.query,
        ok: true,
        rawResults: offers.length,
        results: normalized.length
      });
    } catch (error) {
      searches.push({
        kind: spec.kind,
        query: spec.query,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const deduped = new Map();
  for (const item of items) {
    const key = `${item.sourceId}:${item.sourceRecordId}`;
    const current = deduped.get(key);
    if (!current) {
      deduped.set(key, item);
      continue;
    }
    current.signalKeys = uniq([...current.signalKeys, ...item.signalKeys]);
    current.keywordSeeds = uniq([
      ...current.keywordSeeds,
      ...item.keywordSeeds
    ]);
  }

  return {
    available: true,
    provider: "france_travail_offres_v2",
    items: [...deduped.values()],
    searches
  };
}

export { SEARCH_SPECS as FRANCE_TRAVAIL_SEARCH_SPECS };
