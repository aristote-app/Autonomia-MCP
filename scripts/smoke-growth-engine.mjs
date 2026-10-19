import assert from "node:assert/strict";
import { buildGrowthPlays, growthStats, weeklyCapacity } from "../lib/intelligence/growthEngine.js";

const now=new Date("2026-10-16T12:00:00Z");
const sample=(name,extra={})=>({
  name,slug:name.toLowerCase().replace(/\s+/g,"-"),account_type:"end_client_candidate",
  offers:["Prestation / automatisation IA"],
  timeline:[],
  ...extra
});
const accounts=[
  sample("Client Direct",{
    offers:["Formation & adoption IA","Prestation / automatisation IA"],
    timeline:[{title:"Déploiement Copilot auprès des équipes",source_id:"linkedin",source_url:"https://example.org/signal/copilot",date:"2026-10-13T08:00:00Z",signal_keys:["training_need","copilot"]}]
  }),
  sample("Entreprise Industrie"),
  sample("Capgemini",{
    timeline:[{title:"Ingénieur IA",date:"2026-10-15T12:00:00Z",source_url:"https://example.org/a"}]
  }),
  sample("Cabinet en recrutement",{intermediary_risk:true})
];
const contacts=[
 {id:"c1",account_key:"client-direct",account_name:"Client Direct",full_name:"Camille Exemple",
  matched_role:"Responsable formation / L&D",linkedin_url:"https://www.linkedin.com/in/camille-exemple",
  verification_status:"verified",outreach_status:"not_started",do_not_contact:false},
 {id:"c2",account_key:"entreprise-industrie",account_name:"Entreprise Industrie",full_name:"Louis Exemple",
  matched_role:"DSI",linkedin_url:"https://www.linkedin.com/in/louis-exemple",
  verification_status:"candidate",outreach_status:"not_started",do_not_contact:false},
 {id:"c3",account_key:"client-direct",account_name:"Client Direct",full_name:"Hugo Stop",
  matched_role:"CTO",verification_status:"verified",outreach_status:"stopped",do_not_contact:true}
];
const plays=buildGrowthPlays({accounts,contacts,now,waalaxyReady:true});
assert.ok(plays.length>0);
assert.equal(plays.some(p=>/capgemini|cabinet en recrutement/i.test(p.company)),false);
const training=plays.find(p=>p.company==="Client Direct"&&p.offer==="ACADEMY");
assert.ok(training,"Un signal formation + L&D doit produire une piste ACADEMY");
assert.equal(training.contactId,"c1");
assert.equal(training.evidence?.title,"Déploiement Copilot auprès des équipes");
assert.ok(training.message.includes("Copilot"));
assert.ok(training.message.includes("Camille"));
assert.ok(training.message.includes("AUTONOMIA"));
assert.equal(training.noAutoSend,true);
assert.equal(training.clientStatus,"Client final candidat — à confirmer");
assert.equal(training.messageStatus,"Brouillon à valider");
assert.match(training.evidenceType,/besoin à qualifier/);
assert.equal(plays.some(p=>p.contactName==="Hugo Stop"),false);
const proactive=plays.find(p=>p.company==="Entreprise Industrie");
assert.ok(proactive);
assert.equal(proactive.evidence,null);
assert.match(proactive.messageStatus,/vérification nécessaire/);
assert.ok(proactive.message.includes("dans le cadre de vos responsabilités"));
assert.equal(proactive.action.id,"verify");
const invalidLinkedIn=buildGrowthPlays({accounts:[sample("Client LinkedIn invalide")],contacts:[{id:"bad",account_key:"client-linkedin-invalide",account_name:"Client LinkedIn invalide",full_name:"Marie Test",matched_role:"Responsable formation",linkedin_url:"https://www.linkedin.com/search/results/people/?keywords=test",verification_status:"verified",outreach_status:"not_started",do_not_contact:false}],now,waalaxyReady:true});
assert.ok(invalidLinkedIn.some(p=>p.contactId==="bad" && p.action.id==="find_linkedin"));
assert.ok(invalidLinkedIn.every(p=>p.linkedIn===null));
assert.equal(plays.some(p=>p.company==="Collective.work"),false);
const noEvidence=buildGrowthPlays({accounts:[sample("Entreprise sans signal")],contacts:[],now})[0];
assert.equal(noEvidence.action.id,"find_decider");
assert.ok(noEvidence.message.includes("vos responsabilités"));
const proactiveOnly=buildGrowthPlays({
  accounts:[],
  contacts:[{id:"orphan",account_key:"societe-inconnue",account_name:"Société Inconnue",
    matched_role:"Responsable formation",full_name:"Claire Exemple",
    linkedin_url:"https://www.linkedin.com/in/claire-exemple",
    verification_status:"verified",outreach_status:"not_started",do_not_contact:false}],
  now
});
assert.ok(proactiveOnly.some(p=>p.company==="Société Inconnue"&&p.offer==="ACADEMY"));
assert.ok(proactiveOnly.every(p=>p.evidence===null),"Aucun signal ne doit être inventé");
const uniqueContacts=new Set(plays.filter(p=>p.contactId).map(p=>p.contactId));
assert.equal(uniqueContacts.size,plays.filter(p=>p.contactId).length,"Un contact ne doit pas être sollicité deux fois");
const stats=growthStats({accounts,contacts,inbound:[{id:"lead1",status:"meeting"}]});
assert.equal(stats.excluded,2);
assert.equal(stats.pipelineMeetings,1);
assert.equal(stats.contacts,2);
const capacity=weeklyCapacity();
assert.equal(capacity.target,40);
assert.equal(capacity.meetingsPerWorkingDay,8);
assert.ok(capacity.linkedinTheoretical<10);
assert.ok(capacity.otherChannelsRequired>30);
console.log("Growth Engine: tests de sécurité, ciblage, personnalisation et capacité OK");