import assert from "node:assert/strict";
import {
  extractJobContentSignals,
  labelsFor
} from "../lib/content/jobSignals.js";

const sample = {
  title: "AI & Automation Engineer",
  description: `
    Concevoir des workflows automatisés reliant modèles IA, API, bases de données,
    fichiers et messageries. Utiliser n8n ou Microsoft Power Platform.
    Mettre en place supervision, journalisation, gestion des exceptions,
    guardrails contre hallucinations et prompt injection, avec validation humaine.
  `
};

const result = extractJobContentSignals(sample);

assert.equal(result.isAiRelevant, true);
assert.ok(result.tools.includes("n8n"));
assert.ok(result.tools.includes("power_platform"));
assert.ok(result.skills.includes("automation"));
assert.ok(result.skills.includes("workflow_orchestration"));
assert.ok(result.skills.includes("api_integration"));
assert.ok(result.skills.includes("observability"));
assert.ok(result.skills.includes("guardrails"));
assert.ok(result.skills.includes("human_in_loop"));
assert.ok(result.keywordSeeds.includes("automatisation n8n entreprise"));
assert.ok(result.keywordSeeds.includes("Power Automate IA entreprise"));
assert.equal(labelsFor(["n8n"])[0].label, "n8n");

console.log("job signal taxonomy smoke test passed");
