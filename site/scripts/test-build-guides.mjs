import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildGuides, buildGuideLinks } from "../content/buildGuides.js";

const slugs = Object.keys(buildGuides);
assert.equal(slugs.length, 4);
assert.equal(buildGuideLinks.length, 4);
assert.equal(new Set(slugs).size, slugs.length);

const sitemap = await readFile(new URL("../lib/organicUrls.js", import.meta.url),"utf8");
const offers = await readFile(new URL("../app/solutions-ia/page.js", import.meta.url),"utf8");
const template = await readFile(new URL("../components/BuildGuide.js", import.meta.url),"utf8");
assert.match(template,/application\/ld\+json/);
assert.match(template,/FAQPage/);
assert.match(template,/href="\/start"/);

for (const slug of slugs) {
  const data = buildGuides[slug];
  assert.ok(data.title.length > 45, slug+" has a meaningful title");
  assert.ok(data.intro.length > 120, slug+" should have an explanatory introduction");
  assert.ok(data.metaDescription.length > 100 && data.metaDescription.length < 180, slug+" meta description length");
  assert.ok(data.sections.length >= 3, slug+" should cover substantive guidance");
  assert.ok(data.sections.every(s => s.items.length >= 3),slug+" sections need detailed items");
  assert.ok(data.scenario.before.length >= 3 && data.scenario.after.length >= 3, slug+" needs before/after");
  assert.ok(data.faq.length >= 2, slug+" needs FAQ");
  assert.ok(data.deliverables.length >= 4, slug+" needs actionable deliverables");
  assert.ok(data.related.every(x => slugs.includes(x)), slug+" has broken related links");
  assert.ok(sitemap.includes("/"+slug+"`"),slug+" missing from sitemap");
  const route = await readFile(new URL("../app/"+slug+"/page.js", import.meta.url),"utf8");
  assert.ok(route.includes('const slug = "'+slug+'"'),slug+" route mismatch");
}
assert.match(offers,/buildGuideLinks/);
console.log("build guide content and internal navigation smoke: 4 guides valid");
