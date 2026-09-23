const ACTIVE_OUTREACH = new Set(["queued", "active"]);
const TERMINAL_OUTREACH = new Set(["won", "lost", "stopped"]);

function ageHours(value, now = Date.now()) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, (now - timestamp) / 3600000);
}

export function evaluateWaalaxyGuard({
  contact = {},
  accountContacts = [],
  campaignId = null
} = {}) {
  if (contact.do_not_contact) {
    return { allowed: false, code: "do_not_contact", reason: "Contact marqué ne plus contacter." };
  }

  if (contact.verification_status !== "verified") {
    return { allowed: false, code: "not_verified", reason: "Le contact doit être vérifié." };
  }

  if (TERMINAL_OUTREACH.has(contact.outreach_status)) {
    return {
      allowed: false,
      code: "terminal_status",
      reason: "Le contact est déjà dans un état commercial terminal."
    };
  }

  if (ACTIVE_OUTREACH.has(contact.outreach_status)) {
    return {
      allowed: false,
      code: "already_active",
      reason: "Une prospection est déjà active pour ce contact."
    };
  }

  if (
    campaignId &&
    contact.waalaxy_campaign_id &&
    String(contact.waalaxy_campaign_id) === String(campaignId)
  ) {
    return {
      allowed: false,
      code: "same_campaign",
      reason: "Ce contact est déjà rattaché à cette campagne Waalaxy."
    };
  }

  const otherActive = (accountContacts || []).filter(
    (item) =>
      item.id !== contact.id &&
      !item.do_not_contact &&
      ACTIVE_OUTREACH.has(item.outreach_status)
  );

  if (otherActive.length >= 2) {
    return {
      allowed: false,
      code: "account_saturation",
      reason:
        "Deux contacts de ce compte sont déjà en prospection. Attendre une réponse avant d'élargir."
    };
  }

  const recentlyContactedHours = ageHours(contact.last_contacted_at);
  if (
    recentlyContactedHours != null &&
    recentlyContactedHours < 96 &&
    contact.outreach_status !== "replied"
  ) {
    return {
      allowed: false,
      code: "contact_cooldown",
      reason: "Ce contact a déjà été sollicité il y a moins de 4 jours."
    };
  }

  return { allowed: true, code: "ok", reason: "Prospection autorisée." };
}

export function evaluateKasprGuard({ contact = {}, now = Date.now() } = {}) {
  if (contact.do_not_contact) {
    return { allowed: false, code: "do_not_contact", reason: "Contact marqué ne plus contacter." };
  }

  if (contact.verification_status !== "verified") {
    return { allowed: false, code: "not_verified", reason: "Le contact doit être vérifié." };
  }

  if (contact.enrichment_status === "enriched") {
    return { allowed: false, code: "already_enriched", reason: "Le contact est déjà enrichi." };
  }

  const sinceUpdate = ageHours(contact.updated_at, now);

  if (contact.enrichment_status === "requested" && sinceUpdate != null && sinceUpdate < 1) {
    return {
      allowed: false,
      code: "request_in_flight",
      reason: "Une demande Kaspr récente est déjà en cours."
    };
  }

  if (contact.enrichment_status === "not_found" && sinceUpdate != null && sinceUpdate < 24 * 30) {
    return {
      allowed: false,
      code: "not_found_cooldown",
      reason: "Kaspr n'a rien trouvé récemment. Nouveau crédit bloqué pendant 30 jours."
    };
  }

  if (contact.enrichment_status === "error" && sinceUpdate != null && sinceUpdate < 24) {
    return {
      allowed: false,
      code: "error_cooldown",
      reason: "Dernier appel Kaspr en erreur. Nouvelle tentative bloquée pendant 24 h."
    };
  }

  return { allowed: true, code: "ok", reason: "Enrichissement autorisé." };
}
