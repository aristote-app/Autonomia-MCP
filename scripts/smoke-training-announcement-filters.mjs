import assert from "node:assert/strict";
import {classifyTrainingFamily,classifyTrainingBuyer,rankTrainingLead} from "../lib/training/trainingLeadFilters.js";
import {WEB_DEMAND_QUERY_SPECS} from "../lib/collectors/webDemandDiscovery.js";
assert.equal(classifyTrainingFamily("Nous cherchons un formateur ChatGPT pour notre service RH"),"ia");
assert.equal(classifyTrainingFamily("Recherche formateur SST"),"securite");
assert.equal(classifyTrainingFamily("Formateur Excel"),"bureautique");
assert.equal(classifyTrainingBuyer({buyer:"Entreprise Alpha",description:"Former nos collaborateurs à l'IA"}),"direct");
assert.equal(classifyTrainingBuyer({buyer:"Organisme de formation XYZ",description:"Nous recherchons des formateurs"}),"of");
assert.equal(classifyTrainingBuyer({buyer:"Entreprise Alpha",description:"Recherche formateur"}),"inconnu");
assert.ok(rankTrainingLead({theme:"ia",buyerType:"direct",state:"nouveau"})>rankTrainingLead({theme:"securite",buyerType:"of",state:"historique"}));
assert.ok(WEB_DEMAND_QUERY_SPECS.filter(x=>x.kind==="training_general"&&x.query.includes("recherche formateur IA")).length>0);
const marketplace=WEB_DEMAND_QUERY_SPECS.find(x=>x.kind==="training_marketplace");
assert.ok(marketplace);
const {normalizeWebDemandResult}=await import("../lib/collectors/webDemandDiscovery.js");
const project=normalizeWebDemandResult(marketplace,{
 title:"Nous recherchons un formateur IA pour nos collaborateurs",
 description:"Formation Copilot pour nos équipes dans nos locaux",
 url:"https://www.codeur.com/projects/490235-formation-ia-sur-site-a-toulouse-pour-23-collaborateurs"
});
assert.ok(project);
assert.ok(project.signalKeys.includes("trainer_mission_demand"));
assert.equal(project.rawPayload.training_buyer_type,"direct");
assert.equal(project.rawPayload.target_country,"FR");
console.log("Training announcement filters and direct buyer prioritization OK");
