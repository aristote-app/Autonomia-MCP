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

const equans = recommendDecisionMaker({company:"EQUANS",title:"Automatisation IA agentique",offer:"BUILD"},{now});
assert.equal(equans.kind,"named_public_contact");
assert.equal(equans.name,"Philippe Kerignard");
assert.equal(equans.linkedinUrl,"https://www.linkedin.com/in/kerignard");
assert.match(equans.status,/confirmer/);
const intermediary = recommendDecisionMaker({company:"G2F Conseil",title:"AI Engineer"},{now});
assert.equal(intermediary.kind,"no_identified_profile");
assert.equal(intermediary.name,undefined);
assert.equal(intermediary.searchUrl,undefined);

const noEvidence = recommendDecisionMaker({company:"Une PME inconnue",title:"Copilot formation"},{now});
assert.equal(noEvidence.kind,"no_identified_profile");
assert.equal(noEvidence.targetRole,"Responsable formation / L&D");
assert.equal(noEvidence.searchUrl,undefined);
assert.equal(intentForSignal({title:"Automatisation des processus RPA"}),"BUILD");
assert.equal(wantedRoleForIntent("BUILD"),"DSI / Responsable transformation");

const stale = recommendDecisionMaker({company:"BEFORMA",title:"Formation IA"},{now:Date.parse("2026-12-20T12:00:00Z")});
assert.equal(stale.kind,"no_identified_profile","stale professional roles must not be advertised as confirmed contacts");

const malicious = recommendDecisionMaker({company:"Entreprise",title:"AI Engineer"},{
  now,
  lookup:()=>({
    name:"A Person",role:"Head of AI",linkedin:"https://linkedin.com.evil.org/in/a",
    source:"https://example.org/role", reviewedAt:"2026-10-18",
    email:"person@example.org",phone:"0600000000",password:"secret"
  })
});
assert.equal(malicious.kind,"no_identified_profile");
assert.ok(!JSON.stringify(malicious).includes("example.org/role"));
assert.ok(!JSON.stringify(malicious).includes("0600000000"));

const sourceBacked = enrichPublicSignalsWithDecisionMakers([{company:"Akanea",title:"Data Engineer",id:"foo"}],{now});
assert.equal(sourceBacked[0].decisionMaker.name,"Natalia Bekaley");
assert.equal(sourceBacked[0].id,"foo");
const privateCards = enrichPrivateGrowthPlays([{company:"BEFORMA",offer:"ACADEMY",evidence:{title:"Copilot formation"}}],{now});
assert.equal(privateCards[0].reviewedDecisionMaker.name,"Marine Roche");

const accountView = readFileSync(new URL("../app/accounts/page.js",import.meta.url),"utf8");
const contactView = readFileSync(new URL("../lib/ui/AccountContacts.js",import.meta.url),"utf8");
assert.match(accountView,/decisionSnapshot=\{decisionSnapshot\}/);
assert.match(accountView,/getSnapshotCandidate\(decisionSnapshot, account.name\)/);
assert.match(contactView,/personalLinkedInProfileUrl\(candidate\?\.linkedin_url\)/);
assert.match(contactView,/Profil candidat issu d'une recherche publique/);
assert.match(contactView,/relevance_score \|\| 0\) >= 85/);
const growthPage = readFileSync(new URL("../app/growth/page.js",import.meta.url),"utf8");
const publicView = readFileSync(new URL("../app/growth/PublicOverview.js",import.meta.url),"utf8");
const privateView = readFileSync(new URL("../app/growth/ControlTower.js",import.meta.url),"utf8");
const indexPublic = growthPage.indexOf("if (!authorized || !hasAutonomiaDatabase())");
const indexPrivate = growthPage.indexOf("const workspaceId");
assert.ok(indexPublic>0 && indexPublic<indexPrivate);
assert.match(growthPage,/signals=\{enrichPublicSignalsWithDecisionMakers\(publicHiringSignals/);
assert.match(growthPage,/plays=\{enrichPrivateGrowthPlays\(plays, \{snapshot:decisionSnapshot\}\)\}/);
assert.match(publicView,/DecisionMakerInJob recommendation=\{s\.decisionMaker\}/);
assert.match(publicView,/recommendation\.linkedinUrl/);
assert.ok(!publicView.includes("recommendation.searchUrl"));
assert.ok(!privateView.includes("source?.searchUrl"));
assert.match(privateView,/DecisionMakerForPlay play=\{play\}/);

assert.equal(recommendDecisionMaker({company:"Collective.work",title:"AI Engineer"},{now}).kind,"excluded_intermediary");
assert.deepEqual(enrichPublicSignalsWithDecisionMakers([
  {company:"Collective.work",title:"AI Engineer",sourceUrl:"https://fr.linkedin.com/jobs/view/123"},
  {company:"Akanea",title:"AI Engineer"}
],{now}).map(s=>s.company),["Akanea"]);
assert.deepEqual(enrichPrivateGrowthPlays([
  {company:"Collective.work",offer:"EXPERTS"}, {company:"BEFORMA",offer:"ACADEMY"}
],{now}).map(p=>p.company),["BEFORMA"]);
assert.equal(JSON.stringify(noEvidence).includes("search/results/people"),false);
const snapshot={version:1,accounts:{"entreprise cible":{company:"Entreprise Cible",checkedAt:"2026-10-19T10:00:00Z",searchSucceeded:true,candidates:[{name_guess:"Marie Dupont",headline:"Marie Dupont - Responsable formation chez Entreprise Cible",matched_role:"Responsable formation",linkedin_url:"https://fr.linkedin.com/in/marie-dupont",relevance_score:92}]}}};
const candidate=recommendDecisionMaker({company:"Entreprise Cible",title:"Formation Copilot"},{now,snapshot,lookup:()=>null});
assert.equal(candidate.kind,"search_candidate");
assert.equal(candidate.linkedinUrl,"https://www.linkedin.com/in/marie-dupont");
assert.match(candidate.status,/confirmer/);
assert.equal(recommendDecisionMaker({company:"Collective.work"},{now,snapshot,lookup:()=>null}).kind,"excluded_intermediary");
const invalidSnapshot={version:1,accounts:{"entreprise cible":{...snapshot.accounts["entreprise cible"],candidates:[{name_guess:"Someone",linkedin_url:"https://www.linkedin.com/search/results/people/?keywords=ia",relevance_score:100}]}}};
assert.equal(recommendDecisionMaker({company:"Entreprise Cible"},{now,snapshot:invalidSnapshot,lookup:()=>null}).kind,"no_identified_profile");
console.log("Growth buyer panels: personal LinkedIn only; intermediary suppression; safe missing-person state.");
