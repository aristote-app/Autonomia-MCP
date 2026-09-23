import { buildAccountOpportunityGraph } from "../lib/intelligence/accountGraph.js";
import assert from "node:assert/strict";
import { buildAccountIntelligence, findAccountBySlug } from "../lib/intelligence/accounts.js";

const now = new Date();
const iso = (daysAgo) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

const accounts = buildAccountIntelligence({
  jobSignals: [
    {
      id: "j1",
      source_id: "france_travail_jobs",
      title: "AI Engineer - Freelance",
      company_name: "Acme France",
      location: "75 - Paris",
      contract_type: "Freelance / indépendant",
      source_url: "https://example.test/1",
      published_at: iso(2),
      signal_keys: ["freelance", "agentic_llm"],
      skills: ["LLM"]
    },
    {
      id: "j2",
      source_id: "linkedin",
      title: "Formateur Copilot",
      company_name: "ACME",
      location: "Paris",
      contract_type: "Mission",
      source_url: "https://example.test/2",
      published_at: iso(4),
      signal_keys: ["training_need", "ai_adoption_signal"],
      skills: ["Copilot"]
    }
  ],
  opportunities: []
});

assert.equal(accounts.length, 1);
assert.equal(accounts[0].signal_count, 2);
assert.ok(accounts[0].source_count >= 2);
assert.ok(accounts[0].offers.includes("Staffing / freelance IA"));
assert.ok(accounts[0].offers.includes("Formation & adoption IA"));
assert.ok(accounts[0].decision_roles.some((role) => role.label.includes("Head of AI")));
assert.ok(accounts[0].why_now.length > 0);
assert.equal(findAccountBySlug(accounts, accounts[0].slug)?.name, accounts[0].name);

const concentrationSignals = Array.from({ length: 9 }, (_, index) => ({
  id: "hub-" + index,
  source_id: "france_travail_jobs",
  title: "Mission IA " + index,
  company_name: "Recruiting Hub",
  location: "Paris",
  contract_type: "Freelance / indépendant",
  source_url: "https://example.test/hub/" + index,
  published_at: iso(index % 3),
  signal_keys: ["freelance", "agentic_llm"]
}));

const ordered = buildAccountIntelligence({
  jobSignals: [
    ...concentrationSignals,
    {
      id: "client-1",
      source_id: "linkedin",
      title: "AI Product Manager",
      company_name: "Client Direct",
      location: "Paris",
      source_url: "https://example.test/client/1",
      published_at: iso(1),
      signal_keys: ["ai_product"]
    },
    {
      id: "client-2",
      source_id: "indeed",
      title: "Formateur Copilot",
      company_name: "Client Direct",
      location: "Paris",
      source_url: "https://example.test/client/2",
      published_at: iso(2),
      signal_keys: ["training_need"]
    }
  ]
});

const hub = ordered.find((item) => item.name === "Recruiting Hub");
const direct = ordered.find((item) => item.name === "Client Direct");
assert.equal(hub?.intermediary_risk, true);
assert.equal(hub?.heat_label, "À qualifier");
assert.ok(ordered.indexOf(direct) < ordered.indexOf(hub), "Credible end-client should rank ahead of intermediary-risk hub");

const knownMarketplace = buildAccountIntelligence({
  jobSignals: [{
    id: "marketplace-1",
    source_id: "france_travail_jobs",
    title: "Mission IA",
    company_name: "Collective.work",
    location: "Paris",
    contract_type: "Freelance / indépendant",
    source_url: "https://example.test/marketplace/1",
    published_at: iso(1),
    signal_keys: ["freelance", "agentic_llm"]
  }]
})[0];

assert.equal(knownMarketplace?.intermediary_risk, true);
assert.equal(knownMarketplace?.account_type, "intermediary");
assert.ok(knownMarketplace?.heat_score <= 58);

const staleSignals = Array.from({ length: 8 }, (_, index) => ({
  id: "stale-" + index,
  source_id: index % 2 ? "linkedin" : "indeed",
  title: "Ancien programme IA " + index,
  company_name: "Old Corp",
  location: "Paris",
  source_url: "https://example.test/old/" + index,
  published_at: iso(95 + index),
  signal_keys: ["ai_product", "agentic_llm"]
}));
const stale = buildAccountIntelligence({ jobSignals: staleSignals })[0];
assert.equal(stale?.dormant, true);
assert.equal(stale?.heat_label, "Dormant");
assert.ok(stale?.heat_score <= 45);
assert.ok(stale?.why_now.some((reason) => reason.includes("Dernier signal exploitable")));

assert.equal(direct?.account_type, "end_client_candidate");
assert.ok(direct?.recommended_offer);
assert.ok(direct?.playbook?.target_role);
assert.ok(direct?.playbook?.trigger);

console.log("account intelligence smoke ok");


const graph = buildAccountOpportunityGraph({
  slug: "acme",
  name: "Acme",
  recommended_offer: "Prestation / automatisation IA",
  offers: ["Prestation / automatisation IA", "Formation & adoption IA"],
  decision_roles: [
    { label: "Head of AI / Data", reason: "Signal IA détecté." },
    { label: "Responsable formation / L&D", reason: "Adoption détectée." }
  ],
  timeline: [
    {
      id: "signal-1",
      kind: "private",
      title: "Déploiement Agentic AI",
      source_id: "linkedin",
      source_url: "https://example.test/signal-1"
    },
    {
      id: "signal-2",
      kind: "training",
      title: "Programme Copilot",
      source_id: "indeed",
      source_url: "https://example.test/signal-2"
    }
  ]
}, {
  consultantMatches: [
    {
      consultant_id: "c-1",
      consultant_name: "Consultant Agentic",
      score: 84,
      matched_skills: ["LangGraph", "RAG"],
      available_from: "2026-09-25",
      tjm: 850,
      currency: "EUR",
      locations: ["Paris"],
      gaps: ["Gouvernance / conformité IA"],
      proof_url: "https://example.test/signal-1",
      suitable_for_proactive_outreach: true
    }
  ]
});

assert.equal(graph.stats.signals, 2);
assert.equal(graph.stats.needs, 2);
assert.equal(graph.stats.decision_roles, 2);
assert.equal(graph.stats.offers, 2);
assert.equal(graph.stats.resources, 1);
assert.ok(graph.nodes.some((node) => node.type === "resource" && node.label === "Consultant Agentic"));
assert.ok(graph.edges.some((edge) => edge.relation === "oriente vers"));
assert.ok(graph.edges.some((edge) => edge.relation === "peut être servi par"));
