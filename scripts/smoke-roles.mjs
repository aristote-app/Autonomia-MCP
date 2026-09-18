import assert from "node:assert/strict";
import { classifyAiRole, compareRoleRecords } from "../lib/taxonomy/roles.js";

const pm = classifyAiRole({
  title: "Product Manager IA Générative",
  description: "Pilotage d'un produit LLM"
});
assert.ok(pm.matches.some((match) => match.id === "ai_product"));
assert.ok(pm.matches.some((match) => match.id === "agentic_llm"));

const comparison = compareRoleRecords([
  {
    title: "Product Manager IA",
    description: "GenAI",
    tjmMin: 700,
    tjmMax: 900,
    remoteMode: "Télétravail partiel",
    source: "freework"
  },
  {
    title: "Forward Deployment Engineer AI",
    description: "AI solutions engineer",
    tjmAmount: 1000,
    remoteMode: "On-site",
    source: "upwork"
  }
]);

assert.equal(
  comparison.items.find((item) => item.id === "ai_product")?.tjm.median,
  800
);
assert.equal(
  comparison.items.find((item) => item.id === "forward_deployment")?.missions,
  1
);

console.log("AI role taxonomy OK", {
  product: pm.matches.map((x) => x.id),
  records: comparison.recordCount
});
