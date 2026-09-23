import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { getAllPages } from "../lib/pages.js";
import {
  executionPillars,
  trainingPillars
} from "../content/editorial-backlog.js";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "../content/published-articles.js";

const before = process.argv[2];
const after = process.argv[3] || "HEAD";
const base = (process.env.AUTONOMIA_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

if (!before || !base) {
  console.error("Usage: node scripts/changed-organic-urls.mjs <before-sha> [after-sha] with AUTONOMIA_SITE_URL");
  process.exit(1);
}

const changed = execFileSync("git", ["diff", "--name-only", before, after], {
  encoding: "utf8"
}).split("\n").map((line) => line.trim()).filter(Boolean);

const urls = new Set();

function add(path) {
  urls.add(`${base}${path}`);
}

function addAllArticles() {
  for (const article of publishedExecutionArticles) add(`/cas-usage-ia/${article.slug}`);
  for (const article of publishedTrainingArticles) add(`/formation-ia/cas-usage/${article.slug}`);
}

function addAllPillars() {
  for (const pillar of executionPillars) add(`/cas-usage-ia/${pillar.slug}`);
  for (const pillar of trainingPillars) add(`/formation-ia/cas-usage/${pillar.slug}`);
}

function addCommercial() {
  for (const page of getAllPages().filter((page) => page.mode !== "diagnostic")) {
    add(`/${page.slug}`);
  }
}

for (const file of changed) {
  if (file === "site/content/published-articles.js" || file.startsWith("site/content/article-packs/")) {
    addAllArticles();
    add("/cas-usage-ia");
    add("/formation-ia/cas-usage");
    add("/feed.xml");
    continue;
  }

  if (
    file === "site/components/EditorialArticle.js" ||
    file === "site/lib/editorialGraph.js"
  ) {
    addAllArticles();
    continue;
  }

  if (
    file === "site/content/editorial-backlog.js" ||
    file === "site/content/pillar-insights.js" ||
    file === "site/components/EditorialPillar.js"
  ) {
    addAllPillars();
    add("/cas-usage-ia");
    add("/formation-ia/cas-usage");
    continue;
  }

  if (
    file === "site/lib/pages.js" ||
    file === "site/components/IntentPage.js"
  ) {
    addCommercial();
    continue;
  }

  if (
    file === "site/components/MethodologyFramework.js" ||
    file.startsWith("site/app/methodologie/")
  ) {
    add("/methodologie/execution-matrix");
    add("/methodologie/learning-transfer");
    add("/methodologie/politique-editoriale");
    continue;
  }

  if (file === "site/app/observatoire-ia/page.js" || file === "site/components/MarketObservatory.js") {
    add("/observatoire-ia");
    continue;
  }

  if (file === "site/app/a-propos/page.js") {
    add("/a-propos");
    continue;
  }

  if (file === "site/app/page.js") add("/");
  if (file === "site/app/scan-ia/page.js" || file === "site/components/AutonomiaScan.js") add("/scan-ia");
}

const result = [...urls].sort();
console.log(JSON.stringify({ changed_files: changed, urls: result }, null, 2));

const output = process.env.GITHUB_OUTPUT;
if (output) {
  writeFileSync(output, `urls=${result.join(",")}\ncount=${result.length}\n`, { flag: "a" });
}
