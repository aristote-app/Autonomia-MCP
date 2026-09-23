import assert from "node:assert/strict";
import {
  matchConsultantToAccount,
  rankAccountsForConsultant,
  rankConsultantsForAccount
} from "../lib/intelligence/consultantAccounts.js";

const consultant = {
  id: "c-1",
  display_name: "Consultant Agentic",
  skills: ["LangGraph", "RAG", "Python"],
  available_from: "2026-09-25",
  tjm: 850,
  currency: "EUR",
  remote: true,
  locations: ["Paris", "Remote"],
  years_experience: 8
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
assert.equal(direct.available_from, "2026-09-25");
assert.equal(direct.tjm, 850);
assert.deepEqual(direct.locations, ["Paris", "Remote"]);
assert.equal(direct.years_experience, 8);

const trainer = {
  id: "c-2",
  display_name: "Formatrice Copilot",
  skills: ["Formation IA", "Copilot adoption"],
  available_from: "2026-10-01",
  tjm: 700,
  currency: "EUR",
  remote: true,
  locations: ["France"]
};

const accountToConsultants = rankConsultantsForAccount({
  account: coldTrainingAccount,
  consultants: [consultant, trainer],
  limit: 5
});
assert.equal(accountToConsultants.matches[0].consultant_id, "c-2");
assert.equal(accountToConsultants.matches[0].suitable_for_proactive_outreach, true);
assert.ok(accountToConsultants.matches[0].matched_skills.length > 0);

const dormantAccount = { ...hotAccount, dormant: true, heat_score: 45, recent_7d: 0, recent_30d: 0 };
const dormantMatch = matchConsultantToAccount({ consultant, account: dormantAccount });
assert.equal(dormantMatch.suitable_for_proactive_outreach, false);

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
