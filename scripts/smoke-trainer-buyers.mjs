import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {TRAINER_BUYERS,trainerProposalDraft} from "../lib/training/trainerBuyerIntelligence.js";

assert.ok(TRAINER_BUYERS.length>=4);
for(const lead of TRAINER_BUYERS){
 assert.match(lead.source,/^https:\/\/fr\.linkedin\.com\/(?:posts|company|in)\//);
 assert.ok(lead.need&&lead.buyerStatus);
 assert.ok(["FR","CH","BE","CA"].includes(lead.country));
 assert.match(trainerProposalDraft(lead),/AUTONOMIA Academy/);
 assert.ok(!/\b1000 ?€|\b500 ?€/.test(trainerProposalDraft(lead)));
}
const verified=TRAINER_BUYERS.find(l=>l.id==="leones-sst-2026");
assert.equal(verified.contact,"Aurélia Pichon");
assert.match(verified.contactSource,/leones-formation\.fr/);
const thot=TRAINER_BUYERS.find(l=>l.id==="thot-disciplina-sst");
assert.match(thot.contactProfile,/linkedin\.com\/in\//);
const closed=TRAINER_BUYERS.find(l=>l.state==="pourvu");
const closedDraft=trainerProposalDraft(closed);
assert.match(closedDraft,/prochains besoins|prochaines missions/i);
assert.doesNotMatch(closedDraft,/Votre recherche est-elle toujours d’actualité/);
const open=TRAINER_BUYERS.find(l=>l.state==="a_qualifier");
assert.match(trainerProposalDraft(open,{dates:"12 janvier 2027",contact:"Camille"}),/Bonjour Camille/);
assert.match(trainerProposalDraft(open,{dates:"12 janvier 2027"}),/12 janvier 2027/);
const page=readFileSync(new URL("../app/missions-formateurs/page.js",import.meta.url),"utf8");
const ui=readFileSync(new URL("../app/missions-formateurs/BuyerWorkbench.js",import.meta.url),"utf8");
assert.match(page,/TRAINER_BUYERS/);
assert.match(page,/searchJobSignals/);
assert.match(page,/BuyerWorkbench/);
assert.match(ui,/Copier le message/);
assert.match(ui,/Copier la fiche acheteur/);
assert.match(ui,/pouvoir d’achat|Rôle décisionnaire|Rôle/);
console.log("Trainer buyers: sourced opportunities, buyer qualification, copy-only proposals OK");
