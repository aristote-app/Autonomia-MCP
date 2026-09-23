import { createHash } from "node:crypto";

function clean(value, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizeEmail(value) {
  return clean(value, 320).toLowerCase();
}

function normalizedCompany(value) {
  return clean(value, 300)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(sas|sasu|sa|sarl|eurl|groupe|group|france)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sha(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function validIso(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function serviceClassification(payload) {
  const haystack = [
    payload.requested_service,
    payload.message,
    payload.landing_page_topic
  ].map((value) => clean(value).toLowerCase()).join(" ");

  if (/formation|former|copilot|chatgpt|acculturation|comp[eé]tence/.test(haystack)) {
    return "training";
  }
  if (/freelance|consultant|mission|staffing|renfort|profil/.test(haystack)) {
    return "staffing";
  }
  if (/agent|rag|llm|genai|g[eé]n[eé]rative/.test(haystack)) {
    return "genai_delivery";
  }
  if (/automatisation|automation|workflow|process/.test(haystack)) {
    return "automation";
  }
  if (/gouvernance|ai act|conformit[eé]|risque/.test(haystack)) {
    return "governance";
  }
  if (/partenariat|partner|apporteur|co-?traitance/.test(haystack)) {
    return "partnership";
  }
  return "ai_consulting";
}

function normalizeSolutionContext(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const roleSource = Array.isArray(value.recommended_roles)
    ? value.recommended_roles
    : Array.isArray(value.roles)
      ? value.roles
      : [];
  const trainingSource = Array.isArray(value.recommended_training)
    ? value.recommended_training
    : Array.isArray(value.trainings)
      ? value.trainings
      : [];

  const recommendedRoles = roleSource.slice(0, 10).map((item) => ({
    id: clean(item?.id, 120) || null,
    label: clean(item?.label, 240) || null,
    slug: clean(item?.slug, 180) || null
  })).filter((item) => item.id || item.label || item.slug);

  const recommendedTraining = trainingSource.slice(0, 10).map((item) => ({
    id: clean(item?.id, 120) || null,
    title: clean(item?.title, 300) || null,
    slug: clean(item?.slug, 180) || null
  })).filter((item) => item.id || item.title || item.slug);

  const route = clean(value.route, 40).toLowerCase();
  const allowedRoute = new Set(["experts", "academy", "hybrid"]);

  return {
    source: clean(value.source, 120) || "solution_finder",
    original_query: clean(value.original_query, 5000) || null,
    summary: clean(value.summary, 3000) || null,
    route: allowedRoute.has(route) ? route : null,
    recommended_roles: recommendedRoles,
    recommended_training: recommendedTraining,
    engine: clean(value.engine, 80) || null,
    generated_at: validIso(value.generated_at) || validIso(value.completed_at) || null
  };
}

function nextAction(classification) {
  const actions = {
    training: "Qualifier le public, les usages, le format et proposer un échange de cadrage.",
    staffing: "Qualifier mission, compétences bloquantes, démarrage, durée et budget/TJM s'il est fourni.",
    genai_delivery: "Qualifier le cas d'usage, les données, les contraintes de sécurité et le résultat attendu.",
    automation: "Cartographier le processus actuel, les systèmes impliqués et le résultat opérationnel attendu.",
    governance: "Qualifier le périmètre, les obligations, les parties prenantes et le niveau de maturité.",
    partnership: "Qualifier la complémentarité, le modèle de collaboration et l'opportunité concernée.",
    ai_consulting: "Qualifier le besoin, le sponsor, le résultat attendu et la prochaine étape."
  };
  return actions[classification] || actions.ai_consulting;
}

export function normalizeInboundLead(input = {}, { receivedAt = new Date().toISOString() } = {}) {
  const sourceChannel = clean(input.source_channel, 80);
  const sourcePlatform = clean(input.source_platform, 80);
  const firstName = clean(input.first_name, 160);
  const lastName = clean(input.last_name, 160) || null;
  const email = normalizeEmail(input.email);
  const phone = clean(input.phone, 80) || null;
  const companyName = clean(input.company_name, 300);
  const requestedService = clean(input.requested_service, 300);
  const message = clean(input.message, 5000) || null;

  const consentTimestamp = validIso(input.consent_timestamp);
  const privacyNoticeVersion = clean(input.privacy_notice_version, 120);
  const consentSource = clean(input.consent_source, 180);

  if (!sourceChannel || !sourcePlatform) {
    throw new Error("source_channel and source_platform are required");
  }
  if (!firstName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid first_name and email are required");
  }
  if (!companyName || !requestedService) {
    throw new Error("company_name and requested_service are required");
  }
  if (typeof input.marketing_consent !== "boolean") {
    throw new Error("marketing_consent must be explicitly true or false");
  }
  if (!consentTimestamp || !privacyNoticeVersion || !consentSource) {
    throw new Error("consent_timestamp, privacy_notice_version and consent_source are required");
  }

  const received = validIso(input.received_at) || validIso(receivedAt) || new Date().toISOString();
  const classification = serviceClassification(input);
  const solutionContext = normalizeSolutionContext(input.solution_context);

  const attribution = {
    landing_page_url: clean(input.landing_page_url, 1200) || null,
    landing_page_topic: clean(input.landing_page_topic, 300) || null,
    referrer_url: clean(input.referrer_url, 1200) || null,
    form_id: clean(input.form_id, 200) || null,
    utm_source: clean(input.utm_source, 300) || null,
    utm_medium: clean(input.utm_medium, 300) || null,
    utm_campaign: clean(input.utm_campaign, 500) || null,
    utm_content: clean(input.utm_content, 500) || null,
    utm_term: clean(input.utm_term, 500) || null,
    campaign_id: clean(input.campaign_id, 300) || null,
    adset_id: clean(input.adset_id, 300) || null,
    ad_id: clean(input.ad_id, 300) || null,
    creative_id: clean(input.creative_id, 300) || null,
    gclid: clean(input.gclid, 500) || null,
    fbclid: clean(input.fbclid, 500) || null
  };

  const companyIdentity =
    clean(input.company_domain, 300).toLowerCase() ||
    normalizedCompany(companyName);

  const contactKey = email;
  const dedupeKey = sha(contactKey + "|" + companyIdentity);
  const externalLeadId =
    clean(input.external_lead_id, 500) ||
    "autonomia-" + sha(
      [sourcePlatform, sourceChannel, email, companyIdentity, requestedService, received]
        .join("|")
    ).slice(0, 32);

  const normalized = {
    external_lead_id: externalLeadId,
    workspace_id: clean(input.workspace_id, 80) || null,
    source_channel: sourceChannel,
    source_platform: sourcePlatform,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    company_name: companyName,
    requested_service: requestedService,
    message,
    desired_timeline: clean(input.desired_timeline, 300) || null,
    company_size: clean(input.company_size, 120) || null,
    contact_key: contactKey,
    dedupe_key: dedupeKey,
    marketing_consent: input.marketing_consent,
    consent_timestamp: consentTimestamp,
    privacy_notice_version: privacyNoticeVersion,
    consent_source: consentSource,
    received_at: received,
    attribution,
    scan_context: {
      classification,
      next_action: nextAction(classification),
      estimated_budget: input.estimated_budget ?? null,
      preferred_contact_channel: clean(input.preferred_contact_channel, 80) || null,
      company_domain: clean(input.company_domain, 300) || null,
      solution_context: solutionContext
    }
  };

  return {
    ...normalized,
    event_hash: sha(JSON.stringify(normalized))
  };
}
