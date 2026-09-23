const TERRITORY_TERMS = [
  "collectivite",
  "collectivité",
  "collectivites",
  "collectivités",
  "communaute de communes",
  "communauté de communes",
  "communaute d'agglomeration",
  "communauté d'agglomération",
  "communaute urbaine",
  "communauté urbaine",
  "metropole",
  "métropole",
  "agglomeration",
  "agglomération",
  "epci",
  "intercommunalite",
  "intercommunalité",
  "intercommunal",
  "syndicat mixte",
  "petr",
  "pole d'equilibre territorial",
  "pôle d'équilibre territorial",
  "territoire",
  "territorial",
  "territoriaux",
  "mairie",
  "commune",
  "service public",
  "services publics",
  "agent public",
  "agents publics",
  "agent territorial",
  "agents territoriaux",
  "developpement economique local",
  "développement économique local"
];

const TRAINING_TERMS = [
  "formation",
  "former",
  "montée en compétences",
  "montee en competences",
  "academy",
  "acculturation",
  "sensibilisation"
];

const CLUSTERS = [
  ["Collectivités & territoires", TERRITORY_TERMS],
  ["Automatisation métier", ["automatisation", "automatiser", "workflow", "n8n", "make", "power automate", "agent ia", "agents ia"]],
  ["Copilot & productivité", ["copilot", "microsoft 365", "m365", "productivite", "productivité"]],
  ["Data & connaissance", ["rag", "base de connaissances", "knowledge", "document", "drive", "data"]],
  ["Support & relation usager", ["support", "usager", "administré", "administre", "service client", "ticket"]],
  ["RH & compétences", ["recrutement", "rh", "ressources humaines", "competence", "compétence"]],
  ["Conformité & gouvernance", ["ai act", "conformite", "conformité", "gouvernance", "securite", "sécurité"]]
];

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(text, terms) {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

function clusterFor(text) {
  return CLUSTERS.find(([, terms]) => includesAny(text, terms))?.[0] || "IA métier";
}

function familyFor(text) {
  if (includesAny(text, TERRITORY_TERMS)) return "territory-use-case";
  if (includesAny(text, TRAINING_TERMS)) return "training-use-case";
  return "execution-use-case";
}

function signalFromOpportunity(item) {
  const text = [item?.title, item?.summary, item?.buyer_name, item?.company_name].filter(Boolean).join(" ");
  const territory = includesAny(text, TERRITORY_TERMS);
  return {
    query: item?.title || item?.summary || "Besoin IA marché public",
    cluster: territory ? "Collectivités & territoires" : clusterFor(text),
    family: familyFor(text),
    public_procurement_mentions: 1,
    territory_mentions: territory ? 1 : 0,
    inbound_mentions: 0,
    job_mentions: 0,
    revenue: Number(item?.estimated_value_eur || item?.value_eur || 0) || 0
  };
}

function signalFromInboundLead(item) {
  const text = [item?.requested_service, item?.message, item?.company_name, item?.latest_touch?.landing_page_topic, item?.latest_touch?.utm_term].filter(Boolean).join(" ");
  const territory = includesAny(text, TERRITORY_TERMS);
  const training = includesAny(text, TRAINING_TERMS);
  return {
    query: item?.requested_service || item?.latest_touch?.landing_page_topic || item?.message || "Besoin entrant Autonomia",
    cluster: territory ? "Collectivités & territoires" : clusterFor(text),
    family: territory ? "territory-use-case" : training ? "training-use-case" : "execution-use-case",
    public_procurement_mentions: 0,
    territory_mentions: territory ? 1 : 0,
    inbound_mentions: 1,
    job_mentions: 0,
    revenue: 0
  };
}

function signalFromJob(item) {
  const text = [item?.title, item?.company_name, item?.signal_key, item?.summary].filter(Boolean).join(" ");
  const training = includesAny(text, TRAINING_TERMS);
  const territory = includesAny(text, TERRITORY_TERMS);
  return {
    query: item?.title || item?.signal_key || "Besoin IA emploi",
    cluster: territory ? "Collectivités & territoires" : clusterFor(text),
    family: territory ? "territory-use-case" : training ? "training-use-case" : "execution-use-case",
    public_procurement_mentions: 0,
    territory_mentions: territory ? 1 : 0,
    inbound_mentions: 0,
    job_mentions: 1,
    revenue: 0
  };
}

function signalFromTerritorySignal(item) {
  const territoryLabel = [
    item?.territory_name,
    item?.territory_type === "CC" ? "communauté de communes" : null,
    item?.territory_type === "CA" ? "communauté d'agglomération" : null
  ].filter(Boolean).join(" ");

  const text = [
    item?.title,
    item?.signal_type,
    item?.payload?.query,
    item?.payload?.buyer_name,
    territoryLabel
  ].filter(Boolean).join(" ");

  return {
    query: item?.title || `Besoin IA territorial · ${item?.territory_name || "collectivité"}`,
    cluster: "Collectivités & territoires",
    family: "territory-use-case",
    public_procurement_mentions: item?.signal_source === "boamp" ? 1 : 0,
    territory_mentions: Math.max(1, Number(item?.importance) || 1),
    inbound_mentions: 0,
    job_mentions: 0,
    revenue: 0,
    territory_name: item?.territory_name || null,
    territory_type: item?.territory_type || null,
    evidence_url: item?.evidence_url || null,
    source: item?.signal_source || "territory_signal",
    source_text: text
  };
}

export function buildSeoGeoSignals({
  opportunities = [],
  jobs = [],
  inboundLeads = [],
  territorySignals = []
} = {}) {
  return [
    ...opportunities.map(signalFromOpportunity),
    ...jobs.map(signalFromJob),
    ...inboundLeads.map(signalFromInboundLead),
    ...territorySignals.map(signalFromTerritorySignal)
  ].filter((signal) => signal.query);
}

export function summarizeSeoGeoSignals(signals = []) {
  const territory = signals.filter((signal) => signal.territory_mentions > 0).length;
  const procurement = signals.filter((signal) => signal.public_procurement_mentions > 0).length;
  const jobs = signals.filter((signal) => signal.job_mentions > 0).length;
  const inbound = signals.filter((signal) => signal.inbound_mentions > 0).length;
  const clusters = new Map();

  for (const signal of signals) {
    clusters.set(signal.cluster, (clusters.get(signal.cluster) || 0) + 1);
  }

  return {
    total: signals.length,
    territory,
    procurement,
    jobs,
    inbound,
    topClusters: [...clusters.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cluster, count]) => ({ cluster, count }))
  };
}
