
import assert from "node:assert/strict";
import { buildAccountOutreachPlan } from "../lib/intelligence/outreach.js";
import { importWaalaxyProspects } from "../lib/integrations/waalaxy.js";
import { discoverDecisionMakers } from "../lib/collectors/decisionMakers.js";
import { buildSalesLearningSnapshot } from "../lib/intelligence/salesLearning.js";

const account = {
  name: "Acme",
  offers: ["Prestation / automatisation IA"],
  timeline: [{ title: "Déploiement Copilot" }]
};

const plan = buildAccountOutreachPlan(account);
assert.equal(plan.sequence.length, 4);
assert.ok(plan.sequence[0].content.includes("Acme"));
assert.ok(plan.sequence[1].content.includes("Déploiement Copilot"));

const learning = buildSalesLearningSnapshot([
  {
    verification_status: "verified",
    outreach_status: "won",
    matched_role: "Head of AI / Data",
    enrichment_status: "enriched",
    metadata: { offer_track: "Prestation / automatisation IA", trigger_source: "linkedin" }
  },
  {
    verification_status: "verified",
    outreach_status: "replied",
    matched_role: "Head of AI / Data",
    enrichment_status: "not_requested",
    metadata: { offer_track: "Prestation / automatisation IA", trigger_source: "france_travail_jobs" }
  },
  {
    verification_status: "candidate",
    outreach_status: "not_started",
    matched_role: "DRH / Talent",
    enrichment_status: "not_requested",
    metadata: { offer_track: "Formation & adoption IA", trigger_source: "indeed" }
  }
]);

assert.equal(learning.funnel.contacts, 3);
assert.equal(learning.funnel.verified, 2);
assert.equal(learning.funnel.replies, 2);
assert.equal(learning.funnel.won, 1);
assert.equal(learning.learning_ready, false);
assert.ok(learning.by_offer.some((item) => item.key === "Prestation / automatisation IA"));

const originalFetch = globalThis.fetch;
const calls = [];

globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });

  if (String(url).includes("api.search.brave.com")) {
    return new Response(JSON.stringify({
      web: {
        results: [
          {
            title: "Jane Doe - Head of AI chez Acme | LinkedIn",
            url: "https://www.linkedin.com/in/jane-doe-ai",
            description: "Head of AI chez Acme, Paris, France"
          }
        ]
      }
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  if (String(url).includes("developers.waalaxy.com")) {
    return new Response(JSON.stringify({
      result: [{ importCode: "success" }]
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  throw new Error("Unexpected fetch " + url);
};

try {
  const dm = await discoverDecisionMakers({
    company: "Acme",
    roles: [{ label: "Head of AI" }],
    apiKey: "test-brave",
    maxRoles: 1,
    countPerRole: 5
  });

  assert.equal(dm.available, true);
  assert.equal(dm.candidates.length, 1);
  assert.equal(dm.candidates[0].linkedin_url, "https://www.linkedin.com/in/jane-doe-ai");

  const imported = await importWaalaxyProspects({
    apiKey: "test-waalaxy",
    prospects: [{
      linkedin_url: "https://www.linkedin.com/in/jane-doe-ai",
      company: "Acme",
      matchedRole: "Head of AI",
      trigger: "Déploiement Copilot"
    }],
    prospectListId: "list-123"
  });

  assert.equal(imported.result[0].importCode, "success");

  const waalaxyCall = calls.find((call) =>
    call.url.includes("/prospects/addProspectFromIntegration")
  );
  assert.ok(waalaxyCall);

  const body = JSON.parse(waalaxyCall.options.body);
  assert.equal(body.origin.name, "autonomia");
  assert.equal(body.prospects[0].url, "https://www.linkedin.com/in/jane-doe-ai");
  assert.equal(body.prospects[0].customVariables[0].label, "Autonomia account");
} finally {
  globalThis.fetch = originalFetch;
}

console.log("sales os smoke ok");
