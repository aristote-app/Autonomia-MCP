import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  recommendDecisionMaker, intentForSignal, enrichPublicSignalsWithDecisionMakers,
  enrichPrivateGrowthPlays, wantedRoleForIntent
} from "../lib/intelligence/growthDecisionTargets.js";

const now = Date.parse("2026-10-19T12:00:00Z");
const training = recommendDecisionMaker({company:"BEFORMA", title:"Responsable formation IA"}, {now});
assert.equal(training.kind,"named_public_contact");
assert.equal(training.name,"Marine Roche");
assert.equal(training.intent,"ACADEMY");
assert.match(training.linkedinUrl,/linkedin\.com\/in\//);
assert.ok(training.sourceUrl.startsWith("https://"));
assert.ok(!JSON.stringify(training).includes("email_b2b"));
assert.ok(!JSON.stringify(training).includes("phone"));

const jobs = recommendDecisionMaker({company:"Akanea",title:"AI Engineer IA générative"},{now});
assert.equal(jobs.kind,"named_public_contact");
assert.equal(jobs.name,"Natalia Bekaley");
assert.equal(jobs.intent,"EXPERTS");

const intermediary = recommendDecisionMaker({company:"G2F Conseil",title:"AI Engineer"},{now});
assert.equal(intermediary.kind,"role_search");
assert.equal(intermediary.name,undefined);
assert.ok(intermediary.searchUrl.includes("linkedin.com/search/results/people/"));

const noEvidence = recommendDecisionMaker({company:"Une PME inconnue",title:"Copilot formation"},{now});
assert.equal(noEvidence.kind,"role_search");
assert.equal(noEvidence.targetRole,"Responsable formation / L&D");
assert.ok(decodeURIComponent(noEvidence.searchUrl).includes("Une PME inconnue"));
assert.equal(intentForSignal({title:"Automatisation des processus RPA"}),"BUILD");
assert.equal(wantedRoleForIntent("BUILD"),"DSI / Responsable transformation");

const stale = recommendDecisionMaker({company:"BEFORMA",title:"Formation IA"},{now:Date.parse("2026-12-20T12:00:00Z")});
assert.equal(stale.kind,"role_search","stale professional roles must not be advertised as confirmed contacts");

const malicious = recommendDecisionMaker({company:"Entreprise",title:"AI Engineer"},{
  now,
  lookup:()=>({
    name:"A Person",role:"Head of AI",linkedin:"https://linkedin.com.evil.org/in/a",
    source:"https://example.org/role", reviewedAt:"2026-10-18",
    email:"person@example.org",phone:"0600000000",password:"secret"
  })
});
assert.equal(malicious.kind,"role_search");
assert.ok(!JSON.stringify(malicious).includes("example.org/role"));
assert.ok(!JSON.stringify(malicious).includes("0600000000"));

const sourceBacked = enrichPublicSignalsWithDecisionMakers([{company:"Akanea",title:"Data Engineer",id:"foo"}],{now});
assert.equal(sourceBacked[0].decisionMaker.name,"Natalia Bekaley");
assert.equal(sourceBacked[0].id,"foo");
const privateCards = enrichPrivateGrowthPlays([{company:"BEFORMA",offer:"ACADEMY",evidence:{title:"Copilot formation"}}],{now});
assert.equal(privateCards[0].reviewedDecisionMaker.name,"Marine Roche");

const growthPage = readFileSync(new URL("../app/growth/page.js",import.meta.url),"utf8");
const publicView = readFileSync(new URL("../app/growth/PublicOverview.js",import.meta.url),"utf8");
const privateView = readFileSync(new URL("../app/growth/ControlTower.js",import.meta.url),"utf8");
const indexPublic = growthPage.indexOf("if (!authorized || !hasAutonomiaDatabase())");
const indexPrivate = growthPage.indexOf("const workspaceId");
assert.ok(indexPublic>0 && indexPublic<indexPrivate);
assert.match(growthPage,/signals=\{enrichPublicSignalsWithDecisionMakers\(publicHiringSignals/);
assert.match(growthPage,/plays=\{enrichPrivateGrowthPlays\(plays\)\}/);
assert.match(publicView,/DecisionMakerInJob recommendation=\{s\.decisionMaker\}/);
assert.match(publicView,/recommendation\.linkedinUrl/);
assert.match(privateView,/DecisionMakerForPlay play=\{play\}/);

console.log("Growth Home buyer panels: exact employer aliases, public profiles, intermediary exclusion, role fallback, and access separation passed.");
