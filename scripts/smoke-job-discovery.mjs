import assert from "node:assert/strict";
import { normalizeJobSearchResult } from "../lib/collectors/jobDiscovery.js";

const linkedin = normalizeJobSearchResult({
  sourceId: "linkedin",
  query: "test",
  result: {
    title: "ECARIS recrute pour des postes de Freelance - Generative AI Engineer (AWS) | LinkedIn",
    url: "https://fr.linkedin.com/jobs/view/freelance-generative-ai-engineer-aws-at-ecaris-4456923700",
    description: "Mission freelance GenAI LLM AWS en production."
  }
});

assert.equal(linkedin.sourceRecordId, "4456923700");
assert.equal(linkedin.companyName, "ECARIS");
assert.match(linkedin.title, /Generative AI Engineer/);
assert.equal(linkedin.contractType, "Freelance / indépendant");
assert.ok(linkedin.skills.includes("GenAI"));

const indeed = normalizeJobSearchResult({
  sourceId: "indeed",
  query: "test",
  result: {
    title: "Agentic AI Engineer (IT) / Freelance - Paris (75) - Indeed.com",
    url: "https://fr.indeed.com/viewjob?jk=1aca39d46ad89084",
    description: "Agentic AI industrialisation et déploiement."
  }
});

assert.equal(indeed.sourceRecordId, "1aca39d46ad89084");
assert.equal(indeed.contractType, "Freelance / indépendant");
assert.ok(indeed.signalKeys.includes("freelance"));

console.log("job discovery smoke test passed");
