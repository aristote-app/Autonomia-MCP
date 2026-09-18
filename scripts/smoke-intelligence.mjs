import assert from "node:assert/strict";
import { buildOpportunityIntelligence } from "../lib/intelligence/opportunity.js";

const good = buildOpportunityIntelligence({
  item: {
    opportunityType: "public_ai",
    title: "Déploiement d'une plateforme RAG agentique avec LLM",
    description: "Assistant IA avec base vectorielle",
    deadlineAt: "2026-12-20T12:00:00Z",
    budgetMax: 500000
  },
  rawPayload: { object: "RAG LLM agentic AI" },
  buyerAwardRows: 4,
  now: new Date("2026-09-18T12:00:00Z")
});

assert.ok(good.classification.tags.includes("rag"));
assert.ok(good.classification.tags.includes("genai"));
assert.ok(good.classification.tags.includes("agents"));
assert.ok(good.fit.score > 0);
assert.ok(good.fit.coverage > 0);
assert.ok(good.staffing.roles.includes("Engineer RAG / LLM"));

const drainage = buildOpportunityIntelligence({
  item: {
    opportunityType: "public_ai",
    title: "Drainage, monitorage et matériel hospitalier",
    description: "Fourniture de dispositifs médicaux"
  },
  rawPayload: { object: "drainage monitorage" },
  buyerAwardRows: 0
});
assert.equal(drainage.classification.tags.includes("rag"), false);

const materiaux = buildOpportunityIntelligence({
  item: {
    opportunityType: "public_ai",
    title: "Matériaux à fibres optiques",
    description: "Fourniture de matériaux techniques"
  },
  rawPayload: { object: "matériaux" },
  buyerAwardRows: 0
});
assert.equal(materiaux.classification.tags.includes("ai_act"), false);

console.log("Opportunity intelligence enrichment OK", {
  tags: good.classification.tags,
  score: good.fit.score,
  coverage: good.fit.coverage,
  roles: good.staffing.roles
});
