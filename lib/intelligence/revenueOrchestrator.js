function text(value) {
  return String(value || "").trim();
}

function dueNow(value) {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function preferredChannel(contact = {}) {
  const status = contact.outreach_status || "not_started";

  if (contact.waalaxy_list_id || ["queued", "active"].includes(status)) {
    return "LinkedIn / Waalaxy";
  }
  if (contact.email_b2b || contact.email_direct) {
    return "Email";
  }
  if (contact.phone) {
    return "Téléphone";
  }
  return "LinkedIn";
}

function contactPriority(contact) {
  const status = contact.outreach_status || "not_started";
  if (dueNow(contact.next_action_at)) return 100;
  if (status === "replied") return 96;
  if (status === "meeting") return 94;
  if (status === "proposal") return 92;
  if (contact.verification_status === "candidate") return 88;
  if (
    contact.verification_status === "verified" &&
    contact.enrichment_status !== "enriched" &&
    !contact.email_b2b &&
    !contact.phone
  ) return 84;
  if (
    contact.verification_status === "verified" &&
    !contact.waalaxy_list_id &&
    ["not_started", null, undefined].includes(status)
  ) return 80;
  if (["queued", "active"].includes(status)) return 65;
  return 20;
}

function actionForContact(contact, { kasprReady = false, waalaxyReady = false } = {}) {
  const status = contact.outreach_status || "not_started";

  if (contact.do_not_contact || ["won", "lost", "stopped"].includes(status)) return null;

  if (dueNow(contact.next_action_at)) {
    return {
      kind: "follow_up_due",
      label: "Relance due",
      action: "Traiter la prochaine action commerciale maintenant.",
      channel: preferredChannel(contact)
    };
  }

  if (status === "replied") {
    return {
      kind: "reply_received",
      label: "Réponse reçue",
      action: "Lire la réponse, qualifier l'intérêt et proposer la prochaine étape.",
      channel: preferredChannel(contact)
    };
  }

  if (status === "meeting") {
    return {
      kind: "meeting",
      label: "RDV à préparer",
      action: "Préparer le rendez-vous avec le signal déclencheur, l'offre et les preuves du compte.",
      channel: "Rendez-vous"
    };
  }

  if (status === "proposal") {
    return {
      kind: "proposal",
      label: "Proposition en cours",
      action: "Planifier la relance de proposition et documenter les objections.",
      channel: preferredChannel(contact)
    };
  }

  if (contact.verification_status === "candidate") {
    return {
      kind: "verify_contact",
      label: "Contact à vérifier",
      action: "Vérifier le rôle LinkedIn avant tout enrichissement ou prospection.",
      channel: "LinkedIn"
    };
  }

  if (
    contact.verification_status === "verified" &&
    contact.enrichment_status !== "enriched" &&
    !contact.email_b2b &&
    !contact.phone
  ) {
    return {
      kind: "enrich_contact",
      label: kasprReady ? "Enrichir avec Kaspr" : "Kaspr à brancher",
      action: kasprReady
        ? "Enrichir uniquement ce contact vérifié selon le besoin de canal."
        : "Le contact est prêt à être enrichi dès que Kaspr est configuré.",
      channel: "Kaspr"
    };
  }

  if (
    contact.verification_status === "verified" &&
    !contact.waalaxy_list_id &&
    ["not_started", null, undefined].includes(status)
  ) {
    return {
      kind: "prepare_outreach",
      label: waalaxyReady ? "Préparer Waalaxy" : "Waalaxy à brancher",
      action: waalaxyReady
        ? "Choisir la liste et la campagne puis valider l'envoi vers Waalaxy."
        : "Le contact est prêt pour la séquence dès que Waalaxy est configuré.",
      channel: waalaxyReady ? "LinkedIn / Waalaxy" : preferredChannel(contact)
    };
  }

  if (["queued", "active"].includes(status)) {
    return {
      kind: "monitor_outreach",
      label: "Prospection active",
      action: "Surveiller la réponse et ne pas ajouter de nouvelle relance hors séquence.",
      channel: preferredChannel(contact)
    };
  }

  return null;
}

export function buildRevenueActions({
  accounts = [],
  contacts = [],
  kasprReady = false,
  waalaxyReady = false,
  limit = 12
} = {}) {
  const actions = [];

  for (const contact of contacts || []) {
    const next = actionForContact(contact, { kasprReady, waalaxyReady });
    if (!next) continue;

    actions.push({
      id: `contact:${contact.id}:${next.kind}`,
      priority: contactPriority(contact),
      entity_type: "contact",
      entity_id: contact.id,
      account_key: contact.account_key || null,
      account_name: contact.account_name || "Compte non renseigné",
      contact_name: contact.full_name || contact.role_title || "Contact LinkedIn",
      trigger: contact.trigger_title || null,
      ...next
    });
  }

  const contactAccountKeys = new Set(
    (contacts || []).map((contact) => text(contact.account_key)).filter(Boolean)
  );

  for (const account of accounts || []) {
    if (account.intermediary_risk) continue;
    if (contactAccountKeys.has(text(account.slug))) continue;

    const score = Number(account.heat_score) || 0;
    if (score < 55) continue;

    actions.push({
      id: `account:${account.slug}:find-contact`,
      priority: Math.min(86, 50 + Math.round(score * 0.4)),
      entity_type: "account",
      entity_id: account.slug,
      account_key: account.slug,
      account_name: account.name,
      contact_name: null,
      trigger: account.playbook?.trigger || account.timeline?.[0]?.title || null,
      kind: "find_contact",
      label: "Décideur à trouver",
      action:
        "Ouvrir Account 360°, vérifier le contexte puis identifier 1 à 3 décideurs pertinents.",
      channel: "Recherche décideur"
    });
  }

  return actions
    .sort((a, b) => b.priority - a.priority || a.account_name.localeCompare(b.account_name, "fr"))
    .slice(0, Math.max(1, Number(limit) || 12));
}
