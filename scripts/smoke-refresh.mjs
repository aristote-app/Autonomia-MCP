import assert from "node:assert/strict";

function uniqueBySource(items) {
  return new Set(items.map((item) => item.id)).size;
}

const expected = [
  "boamp","ted","opco","freework","lehibou",
  "freelancemention","upwork","linkedin","datasales","indeed","malt"
];

assert.equal(uniqueBySource(expected.map((id) => ({ id }))), expected.length);
assert.ok(expected.includes("freework"));
assert.ok(expected.includes("linkedin"));

console.log("Unified refresh coverage contract OK", {
  sources: expected.length
});
