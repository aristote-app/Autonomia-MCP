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

const {fromSignal}=await import("../lib/training/trainingSignals.js");
const ft={id:"test",source_id:"france_travail_jobs",title:"Formateur Copilot freelance",company_name:"Organisme X",source_url:"https://candidat.francetravail.fr/offres/recherche/detail/TEST",raw_payload:{description:"Formation pour nos clients",type_contrat:"LIB"},published_at:"2026-10-14T12:00:00Z"};
assert.equal(fromSignal(ft).country,"FR");
assert.equal(fromSignal(ft).theme,"ia");
assert.equal(fromSignal(ft).buyerType,"inconnu");
assert.equal(fromSignal({...ft,raw_payload:{...ft.raw_payload,type_contrat:"CDI"}}),null);
assert.equal(fromSignal({...ft,title:"Business developer IA",raw_payload:{description:"vente de formation freelance"}}),null);
assert.equal(fromSignal({...ft,source_url:"https://evil.example/annonce"}),null);
console.log("Training signals: France Travail freelance admitted, salaried and non-trainer roles excluded");
