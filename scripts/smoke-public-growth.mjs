import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { publicHiringSignals } from "../lib/intelligence/publicGrowth.js";

function job(overrides={}) {
  return {
    id: "PRIVATE-UUID-1234",
    source_id: "linkedin",
    company_name: "Atelier Industriel",
    title: "AI Engineer RAG",
    source_url: "https://fr.linkedin.com/jobs/view/ai-engineer-12345",
    published_at: "2026-10-16T08:00:00Z",
    raw_payload: { direct_employer_evidence: true, intermediary_risk: false, company_evidence_source: "title_employer", discovery_version: "verified_employer_v10" },
    signal_keys: ["recruitment_signal"],
    private_contact_email: "secret@example.org",
    ...overrides
  };
}

const items=[
  job(),
  job({id:"OTHER-UUID",source_id:"indeed",source_url:"https://fr.indeed.com/viewjob?jk=aaa"}),
  job({company_name:"Capgemini",title:"AI Engineer",source_url:"https://fr.linkedin.com/jobs/view/ai-engineer-12"}),
  job({company_name:"Cabinet de recrutement",title:"Data Scientist"}),
  job({company_name:"Agence Innovante",title:"LLM Engineer",source_url:"https://evil.example.com/bad"}),
  job({company_name:"Entreprise Sans Preuve",title:"Data scientist",raw_payload:{direct_employer_evidence:false}}),
  job({company_name:"Agence ESN",title:"Data Architect",signal_keys:["intermediary_risk"]}),
  job({source_id:"welcome_to_the_jungle",company_name:"Fabrique Durable",title:"ML Engineer",source_url:"https://www.welcometothejungle.com/fr/companies/fabrique/jobs/ml-engineer"}),
];
const result=publicHiringSignals(items);
assert.equal(result.length,2,"duplicate sources should merge, ESN and unverified should be excluded");
assert.equal(result[0].company,"Atelier Industriel");
assert.equal(result[1].company,"Fabrique Durable");
assert.deepEqual(Object.keys(result[0]).sort(),["company","employerStatus","id","publishedAt","sourceId","sourceUrl","title"].sort());
assert.equal(JSON.stringify(result).includes("secret@example.org"),false);
const proxy=readFileSync(new URL("../proxy.js",import.meta.url),"utf8");
assert.match(proxy,/pathname === "\/growth"/);
assert.doesNotMatch(proxy,/pathname\.startsWith\("\/accounts"\)/);
const page=readFileSync(new URL("../app/growth/page.js",import.meta.url),"utf8");
assert.ok(page.indexOf("if (!authorized || !hasAutonomiaDatabase())") < page.indexOf("const workspaceId"));
assert.match(page,/publicHiringSignals\(publicRows/);
console.log("Public growth access: redaction, filtering and anonymous routing checks passed");
