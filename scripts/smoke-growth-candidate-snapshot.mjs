import assert from "node:assert/strict";
import { recommendDecisionMaker, enrichPublicSignalsWithDecisionMakers } from "../lib/intelligence/growthDecisionTargets.js";
const now=Date.parse("2026-10-19T12:00:00Z");
const snapshot={version:1,accounts:{"entreprise cible":{
 company:"Entreprise Cible",checkedAt:"2026-10-19T10:00:00Z",searchSucceeded:true,
 candidates:[{name_guess:"Marie Dupont",headline:"Marie Dupont - Responsable formation at Entreprise Cible",matched_role:"Responsable formation",linkedin_url:"https://fr.linkedin.com/in/marie-dupont",relevance_score:92}]
}}};
const target=recommendDecisionMaker({company:"Entreprise Cible",title:"Déploiement Copilot"}, {now,snapshot,lookup:()=>null});
assert.equal(target.kind,"search_candidate");
assert.equal(target.linkedinUrl,"https://www.linkedin.com/in/marie-dupont");
assert.match(target.status,/confirmer/);
assert.equal(recommendDecisionMaker({company:"Collective.work"},{now,snapshot,lookup:()=>null}).kind,"excluded_intermediary");
assert.equal(recommendDecisionMaker({company:"Autre entreprise"},{now,snapshot,lookup:()=>null}).kind,"no_identified_profile");
const bad={...snapshot,accounts:{"entreprise cible":{...snapshot.accounts["entreprise cible"],candidates:[{name_guess:"Inconnu",linkedin_url:"https://www.linkedin.com/search/results/people/?keywords=ia",relevance_score:100}]}}};
assert.equal(recommendDecisionMaker({company:"Entreprise Cible"},{now,snapshot:bad,lookup:()=>null}).kind,"no_identified_profile");
assert.equal(enrichPublicSignalsWithDecisionMakers([{company:"Entreprise Cible",title:"Copilot"},{company:"Collective.work",title:"IA"}],{now,snapshot,lookup:()=>null}).length,1);
console.log("Growth snapshot decision maker candidate rules OK");