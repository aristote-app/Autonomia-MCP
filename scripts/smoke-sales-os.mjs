
import assert from "node:assert/strict";
import { buildAccountOutreachPlan } from "../lib/intelligence/outreach.js";
import { buildAccountBattlecard } from "../lib/intelligence/battlecard.js";
import {
  importWaalaxyProspects,
  assertSuccessfulWaalaxyImport
} from "../lib/integrations/waalaxy.js";
import {
  extractWaalaxyReplyIdentifiers
} from "../lib/integrations/waalaxyWebhook.js";
import {
  enrichKasprLinkedInProfile,
  standardLinkedInProfileId,
  extractKasprContactData,
  kasprRequestedFields
} from "../lib/integrations/kaspr.js";
import { discoverDecisionMakers } from "../lib/collectors/decisionMakers.js";
import { researchAccountPublicContext } from "../lib/collectors/accountResearch.js";
import { buildSalesLearningSnapshot } from "../lib/intelligence/salesLearning.js";
import { buildRevenueActions } from "../lib/intelligence/revenueOrchestrator.js";
import {
  evaluateKasprGuard,
  evaluateWaalaxyGuard
} from "../lib/intelligence/outreachGuard.js";
import {
  inferOutreachTrack,
  rankWaalaxyCampaigns,
  rankWaalaxyLists
} from "../lib/intelligence/campaignRouter.js";

const account = {
  name: "Acme",
  offers: ["Prestation / automatisation IA"],
  timeline: [{ title: "Déploiement Copilot" }]
};

const plan = buildAccountOutreachPlan(account);
assert.equal(plan.sequence.length, 4);
assert.ok(plan.sequence[0].content.includes("Acme"));
assert.ok(plan.sequence[1].content.includes("Déploiement Copilot"));
assert.equal(plan.target_role, "décideur du sujet");
assert.equal(plan.evidence.length, 1);
assert.equal(plan.stacked_signals, false);

const stackedPlan = buildAccountOutreachPlan({
  name: "Stacked Acme",
  source_count: 2,
  recommended_offer: "Formation & adoption IA",
  primary_decision_role: { label: "Responsable formation / L&D" },
  timeline: [
    { title: "Déploiement Copilot", source_id: "linkedin", source_url: "https://example.test/1" },
    { title: "Recherche formateur IA", source_id: "france_travail_jobs", source_url: "https://example.test/2" }
  ]
});
assert.equal(stackedPlan.stacked_signals, true);
assert.equal(stackedPlan.target_role, "Responsable formation / L&D");
assert.ok(stackedPlan.sequence[2].subject.includes("plusieurs signaux"));
assert.ok(stackedPlan.sequence[2].content.includes("Recherche formateur IA"));

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
assert.equal(revenueActions[0].channel, "LinkedIn");
assert.ok(revenueActions.some((item) => item.kind === "find_contact" && item.account_key === "acme"));

const outreachActions = buildRevenueActions({
  accounts: [{
    slug: "acme",
    name: "Acme",
    heat_score: 80,
    intermediary_risk: false,
    recommended_offer: "Prestation / automatisation IA",
    playbook: { trigger: "Déploiement Copilot" }
  }],
  contacts: [{
    id: "contact-2",
    account_key: "acme",
    account_name: "Acme",
    full_name: "Jean Martin",
    first_name: "Jean",
    verification_status: "verified",
    outreach_status: "not_started",
    enrichment_status: "enriched",
    waalaxy_list_id: null,
    do_not_contact: false,
    trigger_title: "Déploiement Copilot"
  }],
  waalaxyReady: true
});

assert.equal(outreachActions[0].kind, "prepare_outreach");
assert.equal(outreachActions[0].channel, "LinkedIn / Waalaxy");
assert.ok(outreachActions[0].message.includes("Déploiement Copilot"));
assert.ok(outreachActions[0].message.includes("Acme"));

const inboundRevenueActions = buildRevenueActions({
  accounts: [],
  contacts: [{
    id: "cold-contact",
    account_key: "cold-account",
    account_name: "Cold Account",
    full_name: "Cold Contact",
    verification_status: "candidate",
    outreach_status: "not_started",
    enrichment_status: "not_requested",
    do_not_contact: false
  }],
  inboundLeads: [{
    id: "lead-hot",
    status: "new",
    first_name: "Alice",
    last_name: "Martin",
    company_name: "Inbound Acme",
    requested_service: "Automatisation IA",
    scan_context: {
      classification: "automation",
      next_action: "Qualifier le processus et proposer un échange."
    }
  }]
});

assert.equal(inboundRevenueActions[0].kind, "inbound_lead");
assert.equal(inboundRevenueActions[0].account_name, "Inbound Acme");
assert.equal(inboundRevenueActions[0].href, "/inbound");
assert.ok(inboundRevenueActions[0].priority > inboundRevenueActions[1].priority);


const consultantRevenueActions = buildRevenueActions({
  accounts: [{
    slug: "agentic-bank",
    name: "Agentic Bank",
    heat_score: 84,
    recent_7d: 2,
    recent_30d: 4,
    intermediary_risk: false,
    offers: ["Prestation / automatisation IA", "Staffing / freelance IA"],
    recommended_offer: "Prestation / automatisation IA",
    decision_roles: [{ label: "Head of AI / Data", reason: "Signal IA" }],
    timeline: [{
      title: "Industrialisation Agentic AI avec LangGraph",
      kind: "freelance",
      signal_keys: ["agentic_llm"],
      tags: ["LangGraph", "RAG"],
      source_url: "https://example.test/agentic-bank"
    }]
  }],
  contacts: [],
  inboundLeads: [],
  consultants: [{
    id: "consultant-agentic",
    display_name: "Consultant Agentic",
    status: "active",
    available_from: "2020-01-01",
    skills: ["LangGraph", "RAG", "Python"]
  }]
});

assert.equal(consultantRevenueActions[0].kind, "consultant_to_account");
assert.equal(consultantRevenueActions[0].account_key, "agentic-bank");
assert.equal(consultantRevenueActions[0].contact_name, "Consultant Agentic");
assert.ok(consultantRevenueActions[0].staffing_match_score >= 60);
assert.ok(consultantRevenueActions[0].matched_skills.includes("LangGraph"));


const waalaxyGuard = evaluateWaalaxyGuard({
  contact: {
    id: "c-main",
    verification_status: "verified",
    outreach_status: "not_started",
    do_not_contact: false
  },
  accountContacts: [
    { id: "c-1", outreach_status: "active", do_not_contact: false },
    { id: "c-2", outreach_status: "queued", do_not_contact: false }
  ]
});
assert.equal(waalaxyGuard.allowed, false);
assert.equal(waalaxyGuard.code, "account_saturation");

const duplicateCampaignGuard = evaluateWaalaxyGuard({
  contact: {
    id: "c-main",
    verification_status: "verified",
    outreach_status: "not_started",
    do_not_contact: false,
    waalaxy_campaign_id: "campaign-1"
  },
  accountContacts: [],
  campaignId: "campaign-1"
});
assert.equal(duplicateCampaignGuard.code, "same_campaign");

const kasprNotFoundGuard = evaluateKasprGuard({
  contact: {
    verification_status: "verified",
    enrichment_status: "not_found",
    do_not_contact: false,
    updated_at: new Date().toISOString()
  }
});
assert.equal(kasprNotFoundGuard.allowed, false);
assert.equal(kasprNotFoundGuard.code, "not_found_cooldown");

const kasprFresh = evaluateKasprGuard({
  contact: {
    verification_status: "verified",
    enrichment_status: "not_requested",
    do_not_contact: false
  }
});
assert.equal(kasprFresh.allowed, true);


const trainingTrack = inferOutreachTrack({
  recommended_offer: "Formation & adoption IA",
  primary_decision_role: { label: "Responsable formation / L&D" },
  playbook: { trigger: "Déploiement Copilot" }
});
assert.equal(trainingTrack.id, "training");

const routedCampaigns = rankWaalaxyCampaigns({
  account: {
    recommended_offer: "Formation & adoption IA",
    primary_decision_role: { label: "Responsable formation / L&D" },
    playbook: { trigger: "Déploiement Copilot" }
  },
  campaigns: [
    { _id: "c1", name: "Waalaxy Formation IA" },
    { _id: "c2", name: "Prospection générale" },
    { _id: "c3", name: "Staffing freelance" }
  ]
});
assert.equal(routedCampaigns.recommended?._id, "c1");
assert.ok(routedCampaigns.recommended.autonomia_score >= 3);

const routedLists = rankWaalaxyLists({
  account: {
    recommended_offer: "Staffing / freelance IA",
    primary_decision_role: { label: "Head of AI / Data" }
  },
  lists: [
    { _id: "l1", name: "Autonomia Staffing IA" },
    { _id: "l2", name: "Prospection générale" }
  ]
});
assert.equal(routedLists.recommended?._id, "l1");

const replyIds = extractWaalaxyReplyIdentifiers({
  prospect: {
    linkedinUrl: "https://fr.linkedin.com/in/jane-doe-ai/",
    email: "Jane@example.test"
  },
  metadata: { prospectId: "waalaxy-prospect-1" }
});
assert.deepEqual(replyIds.linkedinUrls, ["https://www.linkedin.com/in/jane-doe-ai"]);
assert.deepEqual(replyIds.emails, ["jane@example.test"]);
assert.deepEqual(replyIds.prospectIds, ["waalaxy-prospect-1"]);

const replyFromProfile = extractWaalaxyReplyIdentifiers({
  prospect: {
    _id: "waalaxy-prospect-2",
    profile: { publicIdentifier: "john-doe" }
  }
});
assert.ok(replyFromProfile.linkedinUrls.includes("https://www.linkedin.com/in/john-doe"));
assert.ok(replyFromProfile.prospectIds.includes("waalaxy-prospect-2"));

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

  const parsedKaspr = extractKasprContactData({
    profile: {
      workEmail: "jane@acme.test",
      directEmail: "jane.private@example.test",
      mobilePhone: "+33601020304"
    }
  });
  assert.equal(parsedKaspr.email_b2b, "jane@acme.test");
  assert.equal(parsedKaspr.email_direct, "jane.private@example.test");
  assert.equal(parsedKaspr.phone, "+33601020304");
  assert.equal(parsedKaspr.found, true);
  assert.deepEqual(
    kasprRequestedFields("work-email, phone, work-email"),
    ["work-email", "phone"]
  );

  const kasprCall = calls.find((call) =>
    call.url.includes("api.developers.kaspr.io/profile/linkedin")
  );
  assert.ok(kasprCall);
  const kasprBody = JSON.parse(kasprCall.options.body);
  assert.equal(kasprBody.name, "Jane Doe");
  assert.equal(kasprBody.id, "jane-doe-ai");
  assert.deepEqual(kasprBody.dataToGet, ["provider-field-id"]);
  assert.equal(kasprCall.options.headers.Authorization, "test-kaspr");
  assert.equal(kasprCall.options.headers.version, "v2");

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
  assert.equal(assertSuccessfulWaalaxyImport(imported).importCode, "success");
  assert.throws(
    () => assertSuccessfulWaalaxyImport({
      result: [{ importCode: "duplicated_prospect", message: "already elsewhere" }]
    }),
    /did not succeed/
  );

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
