import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  home: await readFile(new URL("../app/page.js", import.meta.url), "utf8"),
  consultants: await readFile(new URL("../app/consultants/page.js", import.meta.url), "utf8"),
  inbound: await readFile(new URL("../app/inbound/page.js", import.meta.url), "utf8"),
  contacts: await readFile(new URL("../app/contacts/page.js", import.meta.url), "utf8"),
  learning: await readFile(new URL("../app/learning/page.js", import.meta.url), "utf8"),
  admin: await readFile(new URL("../app/admin/page.js", import.meta.url), "utf8")
};

assert.equal(files.home.includes('href="/admin"'), false, "Admin must not appear in top navigation");
assert.equal(files.consultants.includes("Visible uniquement après authentification du workspace"), false);
assert.equal(files.inbound.includes("Inbox privée prête"), false);
assert.equal(files.contacts.includes("Zone sécurisée prête"), false);
assert.equal(files.learning.includes("Moteur d'apprentissage prêt"), false);
assert.equal(files.admin.includes('redirect("/")'), true, "Legacy /admin must redirect to cockpit");

console.log("no admin view gates smoke ok");
