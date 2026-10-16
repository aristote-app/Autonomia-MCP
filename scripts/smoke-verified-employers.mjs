import assert from "node:assert/strict";
import { normalizeJobSearchResult } from "../lib/collectors/jobDiscovery.js";
import { employerFromJobTitle, plausibleEmployerName, evidenceMatchesStoredEmployer } from "../lib/collectors/employerEvidence.js";
import { isEligibleRecruitmentSignal, rankRecruitmentSignals, decisionRolesFor } from "../lib/market/opportunityHunter.js";

function normalized({sourceId="linkedin",title,url="https://fr.linkedin.com/jobs/view/test-9876543",description="Projets RAG IA France.",age="1 day"}={}) {
  return normalizeJobSearchResult({
    sourceId,
    query: '"AI Engineer" France',
    result: {title,url,description,age}
  });
}
function persisted(item,id) {
  return { id: id||item.sourceRecordId, source_id:item.sourceId,
    company_name:item.companyName, title:item.title, source_url:item.sourceUrl,
    published_at:item.publishedAt, last_seen_at:item.sourceUpdatedAt,
    signal_keys:item.signalKeys, raw_payload:item.rawPayload };
}
const linked=normalized({title:"Datadog recrute pour des postes de AI Engineer RAG | LinkedIn"});
assert.equal(linked.companyName,"Datadog");
assert.equal(linked.rawPayload.company_evidence_source,"title_employer");
assert.equal(linked.rawPayload.discovery_version,"verified_employer_v10");
assert.equal(linked.rawPayload.direct_employer_evidence,true);
assert.equal(isEligibleRecruitmentSignal(persisted(linked)),true);

const nonsense=normalized({title:"Data Scientist - Paris (75) | LinkedIn",
  description:"at help solve clients’ most pressing business challenges. RAG."});
assert.equal(nonsense.companyName,null);
assert.equal(nonsense.rawPayload.direct_employer_evidence,false);
assert.equal(isEligibleRecruitmentSignal(persisted(nonsense)),false);

const fakeDescription=normalized({title:"ML Engineer – France | LinkedIn",
  description:"At scale and with the level of trust our users require, we build AI tools."});
assert.equal(fakeDescription.companyName,null);

const indeed=normalized({sourceId:"indeed",url:"https://fr.indeed.com/viewjob?jk=123",
  title:"AI Engineer RAG - Bending Spoons - Paris (75) - Indeed.com"});
assert.equal(indeed.companyName,"Bending Spoons");
assert.equal(indeed.rawPayload.direct_employer_evidence,true);
assert.equal(isEligibleRecruitmentSignal(persisted(indeed)),true);

const justLocation=normalized({sourceId:"indeed",url:"https://fr.indeed.com/viewjob?jk=456",
  title:"AI Engineer RAG - Paris (75) - Indeed.com"});
assert.equal(justLocation.companyName,null);

const fromExplicit=normalized({sourceId:"hellowork",
  url:"https://www.hellowork.com/fr-fr/emplois/80450251.html",
  title:"Responsable formation IA",
  description:"Entreprise : Groupe Exemple. Équipes en France, programme Copilot."});
assert.equal(fromExplicit.companyName,"Groupe Exemple");
assert.equal(fromExplicit.rawPayload.company_evidence_source,"explicit_employer_label");
assert.equal(isEligibleRecruitmentSignal(persisted(fromExplicit)),true);
assert.deepEqual(decisionRolesFor(persisted(fromExplicit)),["Responsable formation","Learning and Development"]);

const wttj=normalized({sourceId:"welcome_to_the_jungle",
  url:"https://www.welcometothejungle.com/fr/companies/axa/jobs/data-engineer",
  title:"Data Engineer - Paris",description:"Poste Machine Learning à Paris, France."});
assert.equal(wttj.companyName,"axa");
assert.equal(wttj.rawPayload.company_evidence_source,"employer_career_slug");
assert.equal(isEligibleRecruitmentSignal(persisted(wttj)),true);

const legacy=persisted(linked);
legacy.raw_payload={...legacy.raw_payload,discovery_version:"multi_job_sources_v9",
  company_evidence_source:null};
assert.equal(evidenceMatchesStoredEmployer(legacy),true);
legacy.company_name="help solve clients’ most pressing business challenges";
assert.equal(isEligibleRecruitmentSignal(legacy),false);
legacy.company_name="Datadog";
legacy.raw_payload.search_title="AI Engineer à Paris"; // No historic title proof.
assert.equal(isEligibleRecruitmentSignal(legacy),false);

const esn=persisted(normalized({title:"Capgemini recrute pour des postes de AI Engineer | LinkedIn"}));
assert.equal(isEligibleRecruitmentSignal(esn),false);
const marked=persisted(linked);
marked.raw_payload={...linked.rawPayload,intermediary_risk:true};
assert.equal(isEligibleRecruitmentSignal(marked),false);
assert.equal(plausibleEmployerName("change how billions of users connect"),null);

const direct2=persisted(normalized({title:"Freyssinet recrute pour des postes de Data Scientist IA | LinkedIn",
  age:"1 day"}), "freyssinet");
const intern=persisted(normalized({title:"Freyssinet recrute pour des postes de Stage Data Scientist IA | LinkedIn",
  age:"1 day"}), "freyssinet-intern");
const prioritized=rankRecruitmentSignals([intern, direct2, persisted(nonsense), persisted(indeed), persisted(fromExplicit)], {limit:10});
assert.deepEqual(prioritized.map(x=>x.company_name),["Groupe Exemple","Freyssinet","Bending Spoons"]);
assert.equal(prioritized.find(x=>x.company_name==="Freyssinet").id,"freyssinet");
assert.equal(prioritized.every(isEligibleRecruitmentSignal),true);
console.log("End-client employer provenance, source filtering, decision-role matching and prioritization passed.");
