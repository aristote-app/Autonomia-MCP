import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { getAllPages } from "../lib/pages.js";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "../content/published-articles.js";
import {
  editorialCounts,
  executionBacklog,
  trainingBacklog,
  executionPillars,
  trainingPillars
} from "../content/editorial-backlog.js";

const articles = [...publishedExecutionArticles, ...publishedTrainingArticles];
const errors = [];

const requiredLandingSlugs = [
  "consultant-ia",
  "freelance-ia",
  "expert-ia",
  "consultant-genai",
  "consultant-rag",
  "consultant-agent-ia",
  "ai-project-manager",
  "formation-ia-entreprise",
  "formation-chatgpt-entreprise",
  "formation-copilot",
  "formation-ia-generative",
  "formation-ai-act",
  "formation-agents-ia",
  "formation-prompt-engineering",
  "diagnostic-maturite-ia",
  "diagnostic-competences-ia",
  "diagnostic-projet-ia",
  "audit-besoins-formation-ia",
  "quel-profil-ia",
  "diagnostic-copilot",
  "quiz-ia-entreprise"
];

const allPages = getAllPages();
const pageSlugs = allPages.map((page) => page.slug);
const googleAdsSlugs = requiredLandingSlugs.slice(0, 14);

if (new Set(pageSlugs).size !== pageSlugs.length) {
  errors.push("Landing-page registry contains duplicate slugs.");
}

for (const slug of requiredLandingSlugs) {
  if (!pageSlugs.includes(slug)) {
    errors.push(`Required acquisition landing page missing: ${slug}.`);
  }
}

for (const slug of googleAdsSlugs) {
  const page = allPages.find((item) => item.slug === slug);
  if (!page) continue;

  if (!page.translations || page.translations.length < 3) {
    errors.push(`${slug}: Google Ads LP must contain at least three problem-to-activation translations.`);
    continue;
  }

  for (const item of page.translations) {
    if (!item.need || !item.skills || !item.activation) {
      errors.push(`${slug}: each translation requires need, skills and activation.`);
      break;
    }
  }
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDir, "..");
const publicCopyFiles = [
  "app/page.js",
  "components/IntentPage.js",
  "components/Header.js"
];

const forbiddenPublicCopy = [
  "à reprendre exactement avant publication",
  "avant publication",
  "preuve prévue",
  "placeholder"
];

for (const relativePath of publicCopyFiles) {
  const source = readFileSync(resolve(siteRoot, relativePath), "utf8").toLowerCase();
  for (const forbidden of forbiddenPublicCopy) {
    if (source.includes(forbidden)) {
      errors.push(`${relativePath}: public-facing launch placeholder remains: "${forbidden}".`);
    }
  }
}



const requiredRuntimeFiles = [
  "components/AutonomiaScan.js",
  "components/LeadForm.js",
  "components/HomeLeadSwitch.js",
  "components/EditorialPillar.js",
  "components/MethodologyFramework.js",
  "content/pillar-insights.js",
  "lib/clientTracking.js",
  "lib/editorialGraph.js",
  "lib/organicUrls.js",
  "lib/organicDecisionEngine.js",
  "lib/organicWavePlanner.js",
  "lib/editorialBrief.js",
  "app/api/leads/route.js",
  "app/scan-ia/page.js",
  "app/methodologie/execution-matrix/page.js",
  "app/methodologie/learning-transfer/page.js",
  "app/api/indexnow/route.js",
  "app/api/organic/manifest/route.js",
  "app/api/organic/insights/route.js",
  "app/api/organic/media-manifest/route.js",
  "app/api/organic/recommendations/route.js",
  "app/api/organic/wave-plan/route.js",
  "app/api/organic/brief/route.js",
  "app/api/organic/backlog/route.js",
  "app/feed.xml/route.js",
  "content/article-packs/market-demand-wave-3.js",
  "docs/tuesday-integration-runbook.md",
  "docs/paid-acquisition-map.md",
  "docs/organic-engine-v1.md",
  "app/a-propos/page.js",
  "app/methodologie/politique-editoriale/page.js",
  "app/observatoire-ia/page.js",
  "components/MarketObservatory.js",
  "scripts/seo-audit.mjs",
  "scripts/test-organic-decision-engine.mjs"
];

for (const relativePath of requiredRuntimeFiles) {
  try {
    readFileSync(resolve(siteRoot, relativePath), "utf8");
  } catch {
    errors.push(`Required public-site runtime file missing: ${relativePath}.`);
  }
}

const scanSource = readFileSync(resolve(siteRoot, "components/AutonomiaScan.js"), "utf8");
for (const requiredField of ["execution", "roles", "capabilities", "academy", "orientation", "priority", "watchout", "next_steps", "commercial_handoff"]) {
  if (!scanSource.toLowerCase().includes(requiredField)) {
    errors.push(`Autonomia Scan execution blueprint is missing expected field: ${requiredField}.`);
  }
}

const leadSource = readFileSync(resolve(siteRoot, "components/LeadForm.js"), "utf8");
for (const requiredPattern of ["trackLeadConversion", "commercial_handoff"]) {
  if (!leadSource.includes(requiredPattern)) {
    errors.push(`LeadForm is missing conversion / qualification marker: ${requiredPattern}.`);
  }
}

const trackingSource = readFileSync(resolve(siteRoot, "lib/clientTracking.js"), "utf8");
for (const requiredPattern of ["autonomia_cookie_consent", "NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL", "fbq"]) {
  if (!trackingSource.includes(requiredPattern)) {
    errors.push(`Consent-aware tracking bridge is missing marker: ${requiredPattern}.`);
  }
}

const robotsSource = readFileSync(resolve(siteRoot, "app/robots.js"), "utf8");
for (const crawler of ["OAI-SearchBot", "OAI-AdsBot"]) {
  if (!robotsSource.includes(crawler)) {
    errors.push(`robots.js must explicitly allow OpenAI crawler: ${crawler}.`);
  }
}

const organicUrlsSource = readFileSync(resolve(siteRoot, "lib/organicUrls.js"), "utf8");
for (const requiredPath of ["/methodologie/execution-matrix", "/methodologie/learning-transfer"]) {
  if (!organicUrlsSource.includes(requiredPath)) {
    errors.push(`Organic URL manifest is missing methodology path: ${requiredPath}.`);
  }
}

const intentSource = readFileSync(resolve(siteRoot, "components/IntentPage.js"), "utf8");
for (const requiredPattern of ["captureLead", "requestedService={page.slug}", "scanSecondaryLink"]) {
  if (!intentSource.includes(requiredPattern)) {
    errors.push(`IntentPage is missing paid-funnel integration marker: ${requiredPattern}.`);
  }
}

function wordCount(article) {
  const text = [
    article.title,
    article.dek,
    article.summary,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs || []),
      ...(section.steps || []).flatMap((step) => [step.title, step.text]),
      section.callout?.title || "",
      section.callout?.text || ""
    ]),
    ...article.faq.flatMap(([question, answer]) => [question, answer])
  ].join(" ");

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

if (editorialCounts.execution !== 200) {
  errors.push(`Execution backlog must contain 200 topics, found ${editorialCounts.execution}.`);
}

if (editorialCounts.training !== 200) {
  errors.push(`Training backlog must contain 200 topics, found ${editorialCounts.training}.`);
}

if (executionPillars.length !== 20) {
  errors.push(`Execution pillar registry must contain 20 pillars, found ${executionPillars.length}.`);
}

if (trainingPillars.length !== 20) {
  errors.push(`Training pillar registry must contain 20 pillars, found ${trainingPillars.length}.`);
}

for (const pillar of [...executionPillars, ...trainingPillars]) {
  if (pillar.topics.length !== 10) {
    errors.push(`${pillar.slug}: pillar must contain exactly 10 scenarios, found ${pillar.topics.length}.`);
  }
}

const executionPillarSlugs = executionPillars.map((pillar) => pillar.slug);
const trainingPillarSlugs = trainingPillars.map((pillar) => pillar.slug);

if (new Set(executionPillarSlugs).size !== executionPillarSlugs.length) {
  errors.push("Execution pillar registry contains duplicate slugs.");
}

if (new Set(trainingPillarSlugs).size !== trainingPillarSlugs.length) {
  errors.push("Training pillar registry contains duplicate slugs.");
}

const executionArticleSlugs = publishedExecutionArticles.map((article) => article.slug);
const trainingArticleSlugs = publishedTrainingArticles.map((article) => article.slug);

for (const slug of executionPillarSlugs) {
  if (executionArticleSlugs.includes(slug)) {
    errors.push(`Execution pillar slug collides with published article slug: ${slug}.`);
  }
}

for (const slug of trainingPillarSlugs) {
  if (trainingArticleSlugs.includes(slug)) {
    errors.push(`Training pillar slug collides with published article slug: ${slug}.`);
  }
}

const backlogSlugs = [...executionBacklog, ...trainingBacklog].map((item) => item.slug);
if (new Set(backlogSlugs).size !== backlogSlugs.length) {
  errors.push("Editorial backlog contains duplicate slugs.");
}

for (const article of articles) {
  const words = wordCount(article);

  if (words < 2000) {
    errors.push(`${article.slug}: ${words} words; minimum is 2000.`);
  }

  if (!article.sources || article.sources.length < 1) {
    errors.push(`${article.slug}: at least one verification source is required.`);
  }

  if (!article.search?.primaryKeyword || !article.search?.demandEvidence?.length) {
    errors.push(`${article.slug}: keyword strategy and demand evidence are required.`);
  }

  if (!article.jobSignalTags || article.jobSignalTags.length < 2) {
    errors.push(`${article.slug}: at least two job-market signal tags are required.`);
  }

  if (!article.sections || article.sections.length < 6) {
    errors.push(`${article.slug}: at least six substantial sections are required.`);
  }

  if (!article.faq || article.faq.length < 3) {
    errors.push(`${article.slug}: at least three useful FAQ answers are required.`);
  }
}

if (errors.length) {
  console.error("\nContent validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Content validation passed: ${editorialCounts.execution} execution topics, ${editorialCounts.training} training topics, ${articles.length} published long-form articles, ${allPages.length} acquisition pages.`
);
