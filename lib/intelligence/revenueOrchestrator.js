import { rankAccountsForConsultant } from "./consultantAccounts.js";

function text(value) {
  return String(value || "").trim();
}

function dueNow(value) {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function availabilityWindowDays(value) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
  return Math.ceil((timestamp - Date.now()) / 86400000);
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

function inboundPriority(lead) {
  const status = lead.status || "new";
  const classification = lead.scan_context?.classification || "ai_consulting";

  const base = {
    new: 99,
    enriched: 97,
    qualified: 98,
    needs_review: 92,
    contacted: 87,
    meeting: 96,
    proposal: 94,
    negotiation: 95,
    won: 10,
    lost: 5,
    disqualified: 0
  }[status] ?? 80;

  const highIntentBonus =
    ["staffing", "training", "genai_delivery", "automation"].includes(classification)
      ? 2
      : 0;

  return Math.min(100, base + highIntentBonus);
}

function inboundAction(lead) {
  const status = lead.status || "new";
  if (["won", "lost", "disqualified"].includes(status)) return null;

  const classification = lead.scan_context?.classification || "ai_consulting";
  const next =
    lead.scan_context?.next_action ||
    "Qualifier le besoin entrant et fixer la prochaine étape.";

  const labels = {
    new: "Lead entrant",
    enriched: "Lead enrichi",
    qualified: "Lead qualifié",
    needs_review: "Lead à vérifier",
    contacted: "Lead contacté",
    meeting: "RDV entrant",
    proposal: "Proposition entrante",
    negotiation: "Négociation"
  };

  const channels = {
    staffing: "Staffing",
    training: "Formation",
    genai_delivery: "Prestation IA",
    automation: "Automatisation",
    governance: "Gouvernance IA",
    partnership: "Partenariat",
    ai_consulting: "Conseil IA"
  };

  return {
    kind: "inbound_lead",
    label: labels[status] || "Lead entrant",
    action: next,
    channel: channels[classification] || "Inbound",
    href: "/inbound"
  };
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

function outreachMessage(contact, account = null) {
  const company = contact.account_name || account?.name || "votre organisation";
  const trigger =
    contact.trigger_title ||
    account?.playbook?.trigger ||
    account?.timeline?.[0]?.title ||
    "un sujet IA récent";
  const offer =
    account?.recommended_offer ||
    account?.offers?.[0] ||
    "des projets IA et d'automatisation";

  const firstName = String(contact.first_name || contact.full_name || "")
    .trim()
    .split(/\s+/)[0];
  const greeting = firstName ? "Bonjour " + firstName + "," : "Bonjour,";

  return (
    greeting +
    " j'ai repéré chez " +
    company +
    " le signal suivant : « " +
    trigger +
    " ». Nous intervenons sur " +
    String(offer).toLowerCase() +
    ". Est-ce un sujet réellement prioritaire en ce moment ?"
  );
}

function actionForContact(contact, {
  kasprReady = false,
  waalaxyReady = false,
  account = null
} = {}) {
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
      channel: waalaxyReady ? "LinkedIn / Waalaxy" : preferredChannel(contact),
      message: outreachMessage(contact, account)
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
  inboundLeads = [],
  consultants = [],
  accountWatchAlerts = [],
  kasprReady = false,
  waalaxyReady = false,
  limit = 12
} = {}) {
  const actions = [];

  for (const lead of inboundLeads || []) {
    const next = inboundAction(lead);
    if (!next) continue;

    actions.push({
      id: `inbound:${lead.id}:${lead.status || "new"}`,
      priority: inboundPriority(lead),
      entity_type: "inbound_lead",
      entity_id: lead.id,
      account_key: null,
      account_name: lead.company_name || "Entreprise non renseignée",
      contact_name:
        [lead.first_name, lead.last_name].filter(Boolean).join(" ").trim() ||
        lead.email ||
        "Lead entrant",
      trigger: lead.requested_service || lead.message || null,
      ...next
    });
  }
  for (const watch of accountWatchAlerts || []) {
    const state = watch.query || {};
    const delta = Number(state.unseen_signal_delta || 0);
    if (delta <= 0) continue;

    actions.push({
      id: `watch:${watch.id}`,
      priority: Math.min(95, 88 + delta),
      entity_type: "account_watch",
      entity_id: watch.id,
      account_key: state.account_slug || null,
      account_name: state.account_name || "Compte surveillé",
      contact_name: null,
      trigger: state.latest_signal_title || null,
      kind: "watched_account_signal",
      label: delta + " nouveau" + (delta > 1 ? "x" : "") + " signal" + (delta > 1 ? "s" : ""),
      action: "Ouvrir le compte surveillé, lire le nouveau signal et décider s'il change la priorité commerciale.",
      channel: "Veille compte",
      href: state.account_slug ? `/accounts/${state.account_slug}` : "/accounts"
    });
  }

  const accountBySlug = new Map(
    (accounts || []).map((account) => [text(account.slug), account])
  );

  for (const contact of contacts || []) {
    const next = actionForContact(contact, {
      kasprReady,
      waalaxyReady,
      account: accountBySlug.get(text(contact.account_key)) || null
    });
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

  for (const consultant of consultants || []) {
    if (consultant.status && consultant.status !== "active") continue;
    const days = availabilityWindowDays(consultant.available_from);
    if (days == null || days > 30) continue;

    const best = rankAccountsForConsultant({
      consultant,
      accounts: (accounts || []).filter((account) => !account.intermediary_risk),
      limit: 1
    }).matches[0];

    if (!best || !best.suitable_for_proactive_outreach || best.score < 60) continue;

    actions.push({
      id: `consultant:${consultant.id || consultant.display_name}:${best.account_slug}`,
      priority: Math.min(
        91,
        58 + Math.round(best.score * 0.32) + (days <= 0 ? 5 : 0)
      ),
      entity_type: "consultant_account_match",
      entity_id: consultant.id || null,
      account_key: best.account_slug,
      account_name: best.account_name,
      contact_name: consultant.display_name || consultant.name || "Consultant",
      trigger: best.trigger,
      kind: "consultant_to_account",
      label: days <= 0 ? "Consultant disponible" : `Consultant dispo J+${days}`,
      action:
        "Ouvrir le compte, confirmer le besoin puis identifier le décideur avant de pousser le profil.",
      channel: "Staffing proactif",
      href: `/accounts/${best.account_slug}`,
      staffing_match_score: best.score,
      matched_skills: best.matched_skills
    });
  }

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
