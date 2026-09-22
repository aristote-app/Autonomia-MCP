const DAY_MS = 86400000;

function text(value) {
  return String(value || "").trim();
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function daysSince(value) {
  if (!value) return null;
  const ts = new Date(value).getTime();
  if (!Number.isFinite(ts)) return null;
  return Math.max(0, Math.floor((Date.now() - ts) / DAY_MS));
}

export function slugifyAccountName(value) {
  return text(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizedIdentity(value) {
  return text(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(sas|sasu|sa|sarl|eurl|groupe|group|france)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validAccountName(value) {
  const name = text(value);
  if (!name) return false;
  return !/^(entreprise|organisation|acheteur) non identifi[eé]e$/i.test(name);
}

function offerTracks(event) {
  const keys = unique([...(event.signal_keys || []), ...(event.tags || [])]);
  const joined = keys.join(" ").toLowerCase();
  const out = [];

  if (
    event.kind === "freelance" ||
    /freelance|staffing|ai_program_project|agentic_llm|data_ml|ai_product/.test(joined)
  ) {
    out.push("Staffing / freelance IA");
  }

  if (
    event.kind === "training" ||
    /training|formation|adoption|copilot|ai_act|governance/.test(joined)
  ) {
    out.push("Formation & adoption IA");
  }

  if (
    /agentic|automation|rag|llm|copilot|ai_product|data_ml/.test(joined) ||
    event.kind === "private"
  ) {
    out.push("Prestation / automatisation IA");
  }

  if (event.kind === "public") out.push("Marché public / réponse AO");

  return unique(out);
}

function decisionRoles(events = []) {
  const roles = new Map();
  const add = (label, reason, weight) => {
    const current = roles.get(label);
    if (!current || weight > current.weight) roles.set(label, { label, reason, weight });
  };

  for (const event of events) {
    const keys = unique([...(event.signal_keys || []), ...(event.tags || [])]).join(" ").toLowerCase();

    if (/training|formation|adoption|copilot/.test(keys) || event.kind === "training") {
      add("Responsable formation / L&D", "Signal de formation, adoption ou montée en compétences.", 95);
      add("DRH / Talent", "Peut porter le budget et le déploiement des compétences.", 82);
      add("DSI / Direction digitale", "À cibler lorsque la formation accompagne un déploiement technologique.", 78);
    }

    if (/agentic|llm|rag|data_ml|ai_product|ai_program_project/.test(keys) || event.kind === "freelance") {
      add("Head of AI / Data", "Responsable probable du besoin IA ou des équipes concernées.", 98);
      add("CTO / DSI", "Sponsor technique ou budgétaire probable.", 90);
      add("Direction transformation / innovation", "Pertinent pour les projets d'industrialisation et d'adoption.", 80);
    }

    if (event.kind === "public") {
      add("Achats / commande publique", "Point d'entrée opérationnel pour la procédure et le dossier.", 88);
      add("Direction métier porteuse du marché", "À identifier pour comprendre le besoin fonctionnel réel.", 84);
    }
  }

  if (!roles.size) {
    add("DSI / Direction digitale", "Point d'entrée général pour qualifier un besoin IA.", 70);
    add("Direction métier concernée", "À identifier à partir du signal source.", 65);
  }

  return [...roles.values()]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map(({ label, reason }) => ({ label, reason }));
}

function computeHeat(events = []) {
  const sources = new Set(events.map((e) => e.source_id).filter(Boolean));
  const recent7 = events.filter((e) => {
    const age = daysSince(e.date);
    return age != null && age <= 7;
  }).length;
  const recent30 = events.filter((e) => {
    const age = daysSince(e.date);
    return age != null && age <= 30;
  }).length;
  const kinds = new Set(events.map((e) => e.kind));
  const tracks = new Set(events.flatMap(offerTracks));

  let score = 20;
  score += Math.min(events.length * 8, 32);
  score += Math.min(sources.size * 7, 21);
  score += Math.min(recent7 * 6, 18);
  score += Math.min(recent30 * 2, 10);
  score += Math.max(0, kinds.size - 1) * 6;
  score += Math.max(0, tracks.size - 1) * 5;
  score = Math.min(100, Math.round(score));

  const label = score >= 80 ? "Très chaud" : score >= 65 ? "Chaud" : score >= 45 ? "Actif" : "À surveiller";
  return { score, label, recent7, recent30, sourceCount: sources.size };
}

function whyNow(events, heat) {
  const reasons = [];
  if (heat.recent7 >= 2) reasons.push(`${heat.recent7} signaux détectés sur les 7 derniers jours.`);
  else if (heat.recent7 === 1) reasons.push("Un nouveau signal détecté cette semaine.");
  if (heat.sourceCount >= 2) reasons.push(`${heat.sourceCount} sources différentes convergent sur ce compte.`);

  const kinds = new Set(events.map((e) => e.kind));
  if (kinds.size >= 2) reasons.push("Plusieurs types de besoins sont visibles simultanément.");

  const tracks = unique(events.flatMap(offerTracks));
  if (tracks.length >= 2) reasons.push(`Potentiel multi-offres : ${tracks.slice(0, 3).join(" + ")}.`);

  const top = [...events].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  if (top?.title) reasons.push(`Dernier signal : ${top.title}.`);

  return reasons.slice(0, 4);
}

function normalizeJobSignal(signal) {
  const keys = signal.signal_keys || [];
  const training = keys.includes("training_need");
  const freelance =
    keys.includes("freelance") ||
    /freelance|ind[eé]pendant/i.test(signal.contract_type || "");

  return {
    id: signal.id,
    kind: training ? "training" : freelance ? "freelance" : "private",
    title: signal.title,
    company_name: signal.company_name,
    location: signal.location || null,
    source_id: signal.source_id || null,
    source_url: signal.source_url || null,
    date: signal.published_at || signal.last_seen_at || signal.first_seen_at || null,
    signal_keys: signal.signal_keys || [],
    tags: unique([...(signal.skills || []), ...(signal.roles || []), ...(signal.tools || [])]),
    raw: signal
  };
}

function normalizeOpportunity(item) {
  let kind = "private";
  if (item.opportunity_type === "public_ai") kind = "public";
  else if (item.opportunity_type === "training_ai") kind = "training";
  else if (item.opportunity_type === "freelance_ai") kind = "freelance";

  return {
    id: item.id,
    kind,
    title: item.title,
    company_name: item.buyer_name,
    location: item.location || null,
    source_id: item.primary_source_id || null,
    source_url: item.primary_source_url || null,
    date: item.published_at || item.last_seen_at || item.first_seen_at || null,
    signal_keys: [],
    tags: item.ai_tags || [],
    raw: item
  };
}

export function buildAccountIntelligence({ opportunities = [], jobSignals = [] } = {}) {
  const events = [
    ...opportunities.map(normalizeOpportunity),
    ...jobSignals.map(normalizeJobSignal)
  ].filter((event) => validAccountName(event.company_name));

  const groups = new Map();

  for (const event of events) {
    const identity = normalizedIdentity(event.company_name);
    if (!identity) continue;

    const current = groups.get(identity) || {
      identity,
      name: event.company_name,
      events: []
    };

    current.events.push(event);

    // Prefer the most explicit / longest observed display name.
    if (text(event.company_name).length > text(current.name).length) {
      current.name = event.company_name;
    }

    groups.set(identity, current);
  }

  return [...groups.values()]
    .map((account) => {
      const timeline = [...account.events].sort(
        (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
      const heat = computeHeat(timeline);
      const offers = unique(timeline.flatMap(offerTracks));
      const locations = unique(timeline.map((event) => event.location));
      const sources = unique(timeline.map((event) => event.source_id));

      return {
        slug: slugifyAccountName(account.name),
        name: account.name,
        heat_score: heat.score,
        heat_label: heat.label,
        signal_count: timeline.length,
        source_count: heat.sourceCount,
        recent_7d: heat.recent7,
        recent_30d: heat.recent30,
        locations,
        sources,
        offers,
        decision_roles: decisionRoles(timeline),
        why_now: whyNow(timeline, heat),
        next_action:
          heat.score >= 80
            ? "Identifier 1 à 3 décideurs, enrichir uniquement les meilleurs contacts puis préparer l'approche."
            : heat.score >= 65
              ? "Qualifier le besoin, choisir l'offre Autonomia la plus crédible et trouver le décideur."
              : "Surveiller les nouveaux signaux et enrichir le compte avant prospection.",
        timeline
      };
    })
    .sort((a, b) => b.heat_score - a.heat_score || b.signal_count - a.signal_count);
}

export function findAccountBySlug(accounts = [], slug) {
  return accounts.find((account) => account.slug === slug) || null;
}
