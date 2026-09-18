import assert from "node:assert/strict";
import { parseLeHibouMarketHtml, getLeHibouMarketSignal } from "../lib/collectors/lehibou.js";

const fixture = `
<html><body>
500+ missions actives
18 mois durée moyenne
140 000+ freelances inscrits
900+ entreprises partenaires
Les TJM pour un consultant indépendant Data & IA varient de 500€ à 1 000€ selon le profil.
</body></html>`;

const parsed = parseLeHibouMarketHtml(fixture);
assert.equal(parsed.metrics.activeMissions, 500);
assert.equal(parsed.metrics.averageDurationMonths, 18);
assert.equal(parsed.metrics.registeredFreelancers, 140000);
assert.equal(parsed.metrics.partnerCompanies, 900);
assert.equal(parsed.metrics.tjmMinClaim, 500);
assert.equal(parsed.metrics.tjmMaxClaim, 1000);

const live = await getLeHibouMarketSignal();
assert.equal(live.source, "lehibou");
assert.ok(live.sourceUrl.includes("lehibou.com"));
assert.ok(
  ["available", "blocked_by_technical_protection"].includes(live.automatedAccess)
);

console.log("LeHibou access policy OK", {
  automatedAccess: live.automatedAccess,
  metricsAvailable: Boolean(live.metrics)
});
