import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isExcludedCommercialCompany,personalLinkedInProfileUrl} from "../lib/intelligence/commercialLeadPolicy.js";
import {normalizeJobSearchResult} from "../lib/collectors/jobDiscovery.js";
import {isEligibleRecruitmentSignal} from "../lib/market/opportunityHunter.js";
import {publicHiringSignals} from "../lib/intelligence/publicGrowth.js";
import {buildGrowthPlays} from "../lib/intelligence/growthEngine.js";
import {recommendDecisionMaker,enrichPublicSignalsWithDecisionMakers} from "../lib/intelligence/growthDecisionTargets.js";

for(const company of ["Collective.work","Collective Work","COLLECTIVE-WORK","collective_work","Collective.work SAS"]) {
  assert.equal(isExcludedCommercialCompany(company),true,company+" should be excluded");
}
assert.equal(isExcludedCommercialCompany("Collective Studio"),false);
assert.equal(isExcludedCommercialCompany("Atelier Industriel"),false);

const normalized=normalizeJobSearchResult({
  sourceId:"linkedin",query:'site:linkedin.com/jobs/view "AI Engineer" France',
  result:{
    title:"Collective.work recrute pour des postes de AI Engineer | LinkedIn",
    url:"https://fr.linkedin.com/jobs/view/ai-engineer-9988123",
    description:"Recrutement intelligence artificielle à Paris."
  }
});
assert.equal(normalized.companyName,"Collective.work");
assert.equal(normalized.rawPayload.intermediary_risk,true);
assert.ok(normalized.signalKeys.includes("intermediary_risk"));
const persisted={
  id:"signal-1",source_id:"linkedin",company_name:"Collective.work",
  title:normalized.title,source_url:normalized.sourceUrl,signal_keys:normalized.signalKeys,
  raw_payload:{...normalized.rawPayload,intermediary_risk:false}
};
assert.equal(isEligibleRecruitmentSignal(persisted),false,"old records must be excluded too");
const oldRecord={...persisted,raw_payload:{...persisted.raw_payload,discovery_version:"multi_job_sources_v9"}};
assert.equal(publicHiringSignals([persisted,oldRecord]).length,0);
assert.equal(enrichPublicSignalsWithDecisionMakers([{company:"Collective.work",title:"AI Engineer"}]).length,0);
assert.equal(buildGrowthPlays({
  accounts:[{name:"Collective.work",slug:"collective-work",account_type:"end_client_candidate",timeline:[],offers:[]}],
  contacts:[],limit:20
}).length,0);
assert.equal(recommendDecisionMaker({company:"Collective.work",title:"AI Engineer"}).kind,"excluded_intermediary");

for(const bad of [
 "https://www.linkedin.com/search/results/people/?keywords=Collective.work%20Head%20of%20AI",
 "https://www.linkedin.com/company/collective-work",
 "https://www.linkedin.com/jobs/view/123456",
 "https://linkedin.com.evil.example/in/fake",
 "https://www.linkedin.com/in/",
 "http://www.linkedin.com/in/test"
]) assert.equal(personalLinkedInProfileUrl(bad),null,bad);
assert.equal(personalLinkedInProfileUrl("https://fr.linkedin.com/in/prenom-nom-aabb1122/?trk=public_profile"),
  "https://www.linkedin.com/in/prenom-nom-aabb1122");
assert.equal(personalLinkedInProfileUrl("https://re.linkedin.com/in/rochemarine/en"),
  "https://www.linkedin.com/in/rochemarine");

const homepage=readFileSync(new URL("../app/growth/PublicOverview.js",import.meta.url),"utf8");
const cockpit=readFileSync(new URL("../app/growth/ControlTower.js",import.meta.url),"utf8");
const targets=readFileSync(new URL("../lib/intelligence/growthDecisionTargets.js",import.meta.url),"utf8");
for(const [label,contents] of [["public Home",homepage],["private Home",cockpit],["targets",targets]]) {
  assert.ok(!contents.includes("/search/results/people"),label+" has a fake LinkedIn link");
  assert.ok(!contents.includes("recommendation.searchUrl")&&!contents.includes("source?.searchUrl"),
    label+" has an unverified search fallback");
}
assert.match(homepage,/identified && <div className=\{styles\.decisionLinks\}>/);
assert.match(cockpit,/const linkedin = crmProfile \? play\.linkEdIn : namedSource \? source\.linkedinUrl : null;/);
console.log("Collective.work exclusion and direct personal LinkedIn links: PASS");
