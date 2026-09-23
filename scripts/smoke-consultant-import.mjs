import assert from "node:assert/strict";
import {
  parseConsultantImportText,
  consultantImportTemplate
} from "../lib/consultants/import.js";

const rows = parseConsultantImportText(consultantImportTemplate());
assert.equal(rows.length, 2);
assert.equal(rows[0].display_name, "Jane Doe");
assert.equal(rows[0].tjm, 750);
assert.equal(rows[0].available_from, "2026-10-01");
assert.equal(rows[0].remote, true);
assert.deepEqual(rows[0].skills, ["LangGraph", "RAG", "Python"]);
assert.deepEqual(rows[0].locations, ["Paris", "Remote"]);
assert.equal(rows[0].years_experience, 8);
assert.equal(rows[1].available_from, "2026-09-25");

const tabs = parseConsultantImportText(
  "Nom\tCompétences\tTJM\tDisponible le\tRemote\tLocalisations\tExpérience\tNotes\n" +
  "Alice\tPython|MLOps\t700\t23/09/2026\tyes\tParis|Remote\t6\tData"
);
assert.equal(tabs.length, 1);
assert.equal(tabs[0].external_ref, "manual:alice");
assert.deepEqual(tabs[0].skills, ["Python", "MLOps"]);
assert.equal(tabs[0].remote, true);

console.log("consultant import smoke ok");
