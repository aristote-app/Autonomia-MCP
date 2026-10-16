import assert from "node:assert/strict";
import { DEFAULT_JOB_DISCOVERY_QUERIES, normalizeJobSearchResult } from "../lib/collectors/jobDiscovery.js";

const scenarios = [
  {
    sourceId: "welcome_to_the_jungle",
    query: "AI Engineer France",
    result: {
      url: "https://www.welcometothejungle.com/fr/companies/axa/jobs/data-scientist_nanterre_AXA_VmlmX1N",
      title: "Data scientist - AXA - CDD à Nanterre",
      description: "Entreprise : AXA. Equipe Data à Nanterre, France, projets IA."
    }
  },
  {
    sourceId: "apec",
    query: "Data Scientist France",
    result: {
      url: "https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/179475565W",
      title: "Data scientist F/H",
      description: "Entreprise : DIRISI. Paris, France. Data Scientist IA et pipelines."
    }
  },
  {
    sourceId: "hellowork",
    query: "AI Engineer France",
    result: {
      url: "https://www.hellowork.com/fr-fr/emplois/80450251.html",
      title: "Senior AI Engineer IA générative",
      description: "Entreprise : Groupe exemple. Paris, France, projet RAG."
    }
  }
];

for (const scenario of scenarios) {
  assert.ok(DEFAULT_JOB_DISCOVERY_QUERIES.some(q => q.sourceId === scenario.sourceId));
  const item = normalizeJobSearchResult(scenario);
  assert.equal(item.sourceId, scenario.sourceId);
  assert.ok(item.sourceRecordId);
  assert.equal(item.rawPayload.discovery_version, "verified_employer_v10");
  assert.equal(item.rawPayload.direct_employer_evidence, true);
  assert.ok(item.rawPayload.company_evidence_source);
  assert.ok(item.roles.length || item.skills.length || item.signalKeys.length);
}

const intermediary = normalizeJobSearchResult({
  sourceId: "hellowork",
  query: "AI Engineer France",
  result: {
    url: "https://www.hellowork.com/fr-fr/emplois/99999999.html",
    title: "AI Engineer chez Capgemini",
    description: "ESN. Mission chez notre client à Paris, France."
  }
});
assert.equal(intermediary.rawPayload.intermediary_risk, true);
assert.ok(intermediary.signalKeys.includes("intermediary_risk"));

console.log("Extended public job signal sources: smoke tests passed");
