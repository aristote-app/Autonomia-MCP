
import assert from "node:assert/strict";
import { buildAccountOutreachPlan } from "../lib/intelligence/outreach.js";
import { buildAccountBattlecard } from "../lib/intelligence/battlecard.js";
import { importWaalaxyProspects } from "../lib/integrations/waalaxy.js";
import {
  enrichKasprLinkedInProfile,
  standardLinkedInProfileId
} from "../lib/integrations/kaspr.js";
import { discoverDecisionMakers } from "../lib/collectors/decisionMakers.js";
import { researchAccountPublicContext } from "../lib/collectors/accountResearch.js";
import { buildSalesLearningSnapshot } from "../lib/intelligence/salesLearning.js";
import { buildRevenueActions } from "../lib/intelligence/revenueOrchestrator.js";

const account = {
  name: "Acme",
  offers: ["Prestation / automatisation IA"],
  timeline: [{ title: "Déploiement Copilot" }]
};

const plan = buildAccountOutreachPlan(account);
assert.equal(plan.sequence.length, 4);
assert.ok(plan.sequence[0].content.includes("Acme"));
assert.ok(plan.sequence[1].content.includes("Déploiement Copilot"));

const battlecard = buildAccountBattlecard({
  name: "Acme",
  recommended_offer: "Prestation / automatisation IA",
  primary_decision_role: { label: "Head of AI / Data" },
  playbook: { trigger: "Déploiement Copilot" },
  timeline: [{
    title: "Déploiement Copilot",
    source_id: "linkedin",
    source_url: "https://example.test/acme"
  }]
});

assert.equal(battlecard.kind, "delivery");
assert.equal(battlecard.target_role, "Head of AI / Data");
assert.equal(battlecard.questions.length, 5);
assert.ok(battlecard.evidence[0].source_url);

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

const revenueActions = buildRevenueActions({
  accounts: [{
    slug: "acme",
    name: "Acme",
    heat_score: 82,
    intermediary_risk: false,
    playbook: { trigger: "Déploiement Copilot" }
  }],
  contacts: [{
    id: "contact-1",
    account_key: "beta",
    account_name: "Beta",
    full_name: "Jane Doe",
    verification_status: "candidate",
    outreach_status: "not_started",
    enrichment_status: "not_requested",
    do_not_contact: false,
    trigger_title: "Mission IA"
  }]
});

assert.equal(revenueActions[0].kind, "verify_contact");
assert.ok(revenueActions.some((item) => item.kind === "find_contact" && item.account_key === "acme"));

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

  if (String(url).includes("api.developers.kaspr.io")) {
    return new Response(JSON.stringify({
      profile: {
        name: "Jane Doe",
        email: "jane@example.test"
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
  const research = await researchAccountPublicContext({
    company: "Acme",
    apiKey: "test-brave",
    countPerQuery: 5
  });
  assert.equal(research.available, true);
  assert.ok(research.searches.length === 2);
  assert.ok(research.evidence.length >= 1);

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

  assert.equal(
    standardLinkedInProfileId("https://www.linkedin.com/in/jane-doe-ai/"),
    "jane-doe-ai"
  );

  const kaspr = await enrichKasprLinkedInProfile({
    apiKey: "test-kaspr",
    linkedinUrl: "https://www.linkedin.com/in/jane-doe-ai",
    name: "Jane Doe",
    dataToGet: ["provider-field-id"]
  });
  assert.equal(kaspr.profile.name, "Jane Doe");

  const kasprCall = calls.find((call) =>
    call.url.includes("api.developers.kaspr.io/profile/linkedin")
  );
  assert.ok(kasprCall);
  const kasprBody = JSON.parse(kasprCall.options.body);
  assert.equal(kasprBody.name, "Jane Doe");
  assert.equal(kasprBody.id, "jane-doe-ai");
  assert.deepEqual(kasprBody.dataToGet, ["provider-field-id"]);
  assert.equal(kasprCall.options.headers.Authorization, "test-kaspr");

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
