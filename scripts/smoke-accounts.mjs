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

console.log("account intelligence smoke ok");
