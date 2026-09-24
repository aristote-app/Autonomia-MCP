import assert from "node:assert/strict";
import { normalizeJobSearchResult } from "../lib/collectors/jobDiscovery.js";
import { normalizeFranceTravailOffer } from "../lib/collectors/franceTravail.js";
import { normalizeWebDemandResult } from "../lib/collectors/webDemandDiscovery.js";

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

const territory = normalizeFranceTravailOffer(
  {
    id: "FT-TERRITORY-1",
    intitule: "Chef de projet intelligence artificielle",
    description:
      "La collectivité recherche un chef de projet IA pour automatiser des processus et accompagner les agents territoriaux.",
    entreprise: { nom: "Communauté d'agglomération Exemple" },
    lieuTravail: { libelle: "France" },
    dateCreation: "2026-09-24T08:00:00Z",
    dateActualisation: "2026-09-24T09:00:00Z",
    competences: [{ libelle: "Intelligence artificielle" }]
  },
  { kind: "territory", query: "chef de projet IA collectivité" }
);

assert.ok(territory);
assert.equal(territory.contractType, "Signal recrutement collectivité IA");
assert.ok(territory.signalKeys.includes("territorial"));
assert.ok(territory.signalKeys.includes("territory_ai_job"));
assert.ok(territory.signalKeys.includes("territory_automation"));

const falseTerritory = normalizeFranceTravailOffer(
  {
    id: "FT-PRIVATE-1",
    intitule: "Chef de projet intelligence artificielle",
    description: "Entreprise privée recherchant un chef de projet IA.",
    entreprise: { nom: "Entreprise privée Exemple" }
  },
  { kind: "territory", query: "chef de projet IA collectivité" }
);

assert.equal(falseTerritory, null);

const emploiTerritorial = normalizeWebDemandResult(
  {
    sourceId: "emploi_territorial",
    kind: "territory",
    query: 'site:emploi-territorial.fr/offre "intelligence artificielle"',
    urlPattern: /emploi-territorial\.fr\/offre\//i
  },
  {
    title: "Chef de projet Intelligence Artificielle - Conseil départemental",
    url: "https://www.emploi-territorial.fr/offre/o070260609001070-chef-projet-intelligence-artificielle",
    description:
      "La collectivité pilote sa stratégie IA, automatise certains processus, forme les agents et structure la gouvernance."
  }
);

assert.ok(emploiTerritorial);
assert.equal(emploiTerritorial.contractType, "Signal recrutement collectivité IA");
assert.ok(emploiTerritorial.signalKeys.includes("territorial"));
assert.ok(emploiTerritorial.signalKeys.includes("territory_automation"));
assert.ok(emploiTerritorial.signalKeys.includes("territory_ai_governance"));
assert.ok(emploiTerritorial.signalKeys.includes("territory_ai_training"));

console.log("job discovery smoke test passed");
