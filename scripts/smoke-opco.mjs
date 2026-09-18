import assert from "node:assert/strict";
import { OPCOS, matchOpco } from "../lib/training/opco.js";

assert.equal(OPCOS.length, 11);

const atlas = matchOpco({
  buyerName: "OPCO ATLAS",
  title: "Actions de formation Data et Intelligence artificielle"
});
assert.equal(atlas[0]?.id, "atlas");

const constructys = matchOpco({
  buyerName: "Constructys Siège",
  title: "Formation maîtrise de chantier"
});
assert.equal(constructys[0]?.id, "constructys");

const none = matchOpco({
  buyerName: "Ville de Paris",
  title: "Formation intelligence artificielle"
});
assert.equal(none.length, 0);

console.log("OPCO training registry OK", {
  opcos: OPCOS.length,
  atlas: atlas[0]?.name,
  constructys: constructys[0]?.name
});
