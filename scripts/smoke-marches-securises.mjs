import assert from "node:assert/strict";
import { parseMarchesSecurisesHtml, searchMarchesSecurises } from "../lib/collectors/marchesSecurises.js";

const fixture = `
<html><body>
<div>
Acheteur Demo (75)
SYSTÈME D'ACQUISITION DYNAMIQUE DE PRESTATIONS EN INTELLIGENCE ARTIFICIELLE
Référence | DEMO_75_A_20260901W2_1
Type de marché / Type de prestation | Public / Services
Référence interne | IA-2026-01
Procédure | Appel d'Offres Ouvert
Zone(s) géo. de la prestation | 75 Paris
Date de publication sur le serveur | 01 septembre 2026
Date de clôture | vendredi 30 octobre 2026 - 12:00
</div>
</body></html>`;

const parsed = parseMarchesSecurisesHtml(fixture);
assert.equal(parsed.length, 1);
assert.ok(parsed[0].sourceId.includes("DEMO"));
assert.equal(parsed[0].publishedAt?.slice(0,10), "2026-09-01");

const live = await searchMarchesSecurises({
  query: "SICTIAM_06_A_20250825W2_1",
  page: 1,
  limit: 5
});

assert.ok(live.count > 0, "Marchés-Sécurisés returned no public consultation rows");
console.log("Marchés-Sécurisés collector OK", {
  count: live.count,
  sample: live.items[0]?.title || null,
  robots: live.robots.allowed
});
