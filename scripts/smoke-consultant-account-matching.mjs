import assert from "node:assert/strict";
import {
  matchConsultantToAccount,
  rankAccountsForConsultant
} from "../lib/intelligence/consultantAccounts.js";

const consultant = {
  id: "c-1",
  display_name: "Consultant Agentic",
  skills: ["LangGraph", "RAG", "Python"]
};

const hotAccount = {
  slug: "acme",
  name: "ACME",
  heat_score: 82,
  recent_7d: 2,
  recent_30d: 3,
  intermediary_risk: false,
  offers: ["Prestation / automatisation IA"],
  recommended_offer: "Prestation / automatisation IA",
  decision_roles: [{ label: "Head of AI / Data", reason: "Signal IA" }],
  timeline: [
    {
      title: "Industrialisation d'une solution Agentic AI avec LangGraph",
      kind: "freelance",
      signal_keys: ["agentic_llm"],
      tags: ["LangGraph", "RAG"],
      source_url: "https://example.test/acme"
    }
  ]
};

const coldTrainingAccount = {
  slug: "training-co",
  name: "Training Co",
  heat_score: 70,
  recent_7d: 1,
  recent_30d: 2,
  intermediary_risk: false,
  offers: ["Formation & adoption IA"],
  recommended_offer: "Formation & adoption IA",
  decision_roles: [],
  timeline: [
    {
      title: "Programme d'acculturation Copilot",
      kind: "training",
      signal_keys: ["training_need"],
      tags: ["formation"],
      source_url: "https://example.test/training"
    }
  ]
};

const intermediary = {
  ...hotAccount,
  slug: "collective",
  name: "Collective.work",
  intermediary_risk: true,
  heat_score: 58
};

const direct = matchConsultantToAccount({ consultant, account: hotAccount });
assert.equal(direct.suitable_for_proactive_outreach, true);
assert.ok(direct.matched_skills.includes("LangGraph"));
assert.ok(direct.score >= 55);
assert.equal(direct.proof_url, "https://example.test/acme");

const ranked = rankAccountsForConsultant({
  consultant,
  accounts: [coldTrainingAccount, intermediary, hotAccount],
  limit: 5
});

assert.equal(ranked.matches[0].account_slug, "acme");
assert.equal(ranked.matches.some((item) => item.account_slug === "training-co"), false);
assert.ok(
  ranked.matches.find((item) => item.account_slug === "collective").score <
    ranked.matches.find((item) => item.account_slug === "acme").score
);

console.log("consultant account matching smoke ok");
