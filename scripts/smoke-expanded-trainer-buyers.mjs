import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {EXPANDED_TRAINER_BUYERS} from "../lib/training/expandedTrainerBuyers.js";
assert.equal(EXPANDED_TRAINER_BUYERS.length,14);
assert.deepEqual([...new Set(EXPANDED_TRAINER_BUYERS.map(x=>x.country))].sort(),["BE","CA","CH","FR"]);
for(const x of EXPANDED_TRAINER_BUYERS){
 assert.ok(x.buyer&&x.need&&x.source&&x.evidence&&x.state);
 assert.match(x.source,/^https:\/\//);
 assert.ok(["a_qualifier","historique","pourvu","date_a_revalider"].includes(x.state));
 if(x.businessPhone) assert.ok(x.businessPhoneSource);
}
const page=readFileSync(new URL("../app/missions-formateurs/page.js",import.meta.url),"utf8");
assert.match(page,/EXPANDED_TRAINER_BUYERS/);
console.log("Expanded Academy buyers: 14 sourced leads in 4 countries, no invented missions.");
