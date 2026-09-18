import assert from "node:assert/strict";
import { evaluateRobots } from "../lib/collectors/robots.js";
import { parseFreeWorkHtml, searchFreeWork } from "../lib/collectors/freework.js";

const verdict = evaluateRobots(
  "User-agent: *\nDisallow: /private\nAllow: /private/public",
  "/private/public/example"
);
assert.equal(verdict.allowed, true);

const fixture = `
<html><body>
<article>
  <a href="/fr/tech-it/job-mission/data-engineer/data-engineer-ia-7">
    <h2>Data engineer IA</h2>
  </a>
  <p>Mission GenIA et produits data.</p>
  <div>Freelance Publiée le 09/18/2026 Durée 6 mois TJM 700-800 €/j Télétravail partiel Lieu Lyon, France</div>
</article>
</body></html>`;

const parsed = parseFreeWorkHtml(
  fixture,
  "https://www.free-work.com/fr/tech-it/jobs/ia?page=1"
);
assert.equal(parsed.length, 1);
assert.equal(parsed[0].title, "Data engineer IA");
assert.equal(parsed[0].tjmMin, 700);
assert.equal(parsed[0].tjmMax, 800);
assert.equal(parsed[0].publishedAt?.slice(0,10), "2026-09-18");

const live = await searchFreeWork({ category: "ia", page: 1, limit: 5 });
assert.ok(live.count > 0, "Free-Work live page returned no mission links");
assert.ok(live.items.some((item) => item.sourceUrl?.includes("/job-mission/")));

console.log("Free-Work collector OK", {
  count: live.count,
  sample: live.items[0]?.title || null,
  robots: live.robots.allowed
});
