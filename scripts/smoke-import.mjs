import { normalizeAuthorizedImport } from "../lib/import/authorized.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const result = normalizeAuthorizedImport({
  source: "linkedin",
  records: [{
    job_id: "li-123",
    job_title: "AI Product Manager",
    company_name: "Example Corp",
    job_description: "Pilotage d'un produit RAG et agents IA",
    location: "Paris",
    remote_mode: "hybride",
    publication_date: "2026-09-18",
    day_rate_min: "700 €",
    day_rate_max: "900 €",
    skills: "RAG;LLM;Product Management",
    job_url: "https://example.invalid/jobs/li-123"
  }]
});

assert(result.count === 1, "Expected one normalized record");
assert(result.items[0].title === "AI Product Manager", "Title mapping failed");
assert(result.items[0].tjmMin === 700, "TJM min parsing failed");
assert(result.items[0].skills.includes("RAG"), "Skills parsing failed");
assert(result.items[0].dedupe.confidence === 1, "Source ID should yield exact dedupe");

console.log("AUTHORIZED IMPORT", {
  count: result.count,
  completeness: result.averageCompleteness,
  item: {
    source: result.items[0].source,
    title: result.items[0].title,
    companyName: result.items[0].companyName,
    tjmMin: result.items[0].tjmMin,
    tjmMax: result.items[0].tjmMax
  }
});
