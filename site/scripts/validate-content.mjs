import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { getAllPages } from "../lib/pages.js";
import {
  publishedExecutionArticles,
  publishedTrainingArticles,
  publishedTerritoryArticles
} from "../content/published-articles.js";
import {
  editorialCounts,
  executionBacklog,
  trainingBacklog,
  executionPillars,
  trainingPillars
} from "../content/editorial-backlog.js";
import { problemSolutions } from "../content/problem-solutions.js";
import { problemSalesCopy } from "../content/problem-sales-copy.js";
import { problemPaidSearch } from "../content/problem-paid-search.js";
import { problemPaidCreatives } from "../content/problem-paid-creatives.js";

const articles = [...publishedExecutionArticles, ...publishedTrainingArticles, ...publishedTerritoryArticles];
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
  "content/editorial-separations.js",
  "content/ai-glossary.js",
  "lib/clientTracking.js",
  "lib/clientAttribution.js",
  "lib/editorialGraph.js",
  "lib/editorialOpportunityEngine.js",
  "lib/organicUrls.js",
  "lib/organicDecisionEngine.js",
  "lib/organicWavePlanner.js",
  "lib/editorialBrief.js",
  "lib/googleSearchConsole.js",
  "content/territory-editorial.js",
  "content/article-packs/territory-wave-1.js",
  "app/territoires/guides/page.js",
  "app/territoires/guides/[slug]/page.js",
  "app/api/leads/route.js",
  "app/scan-ia/page.js",
  "app/methodologie/execution-matrix/page.js",
  "app/methodologie/learning-transfer/page.js",
  "app/glossaire-ia/page.js",
  "app/api/indexnow/route.js",
  "app/api/organic/manifest/route.js",
  "app/api/organic/insights/route.js",
  "app/api/organic/editorial-opportunities/route.js",
  "app/api/organic/media-manifest/route.js",
  "app/api/organic/recommendations/route.js",
  "app/api/organic/wave-plan/route.js",
  "app/api/organic/brief/route.js",
  "app/api/organic/backlog/route.js",
  "app/api/organic/google/sitemap/route.js",
  "app/api/internal/search-console-status/route.js",
  "app/api/internal/search-console-submit/route.js",
  "app/api/organic/google/search-demand/route.js",
  "app/feed.xml/route.js",
  "content/article-packs/market-demand-wave-3.js",
  "docs/tuesday-integration-runbook.md",
  "docs/paid-acquisition-map.md",
  "docs/organic-engine-v1.md",
  "app/a-propos/page.js",
  "app/methodologie/politique-editoriale/page.js",
  "app/observatoire-ia/page.js",
  "components/MarketObservatory.js",
  "components/ObservatoryLeadForm.js",
  "components/ProblemLeadForm.js",
  "components/ProblemLab.js",
  "components/ProblemLanding.js",
  "components/ProblemLink.js",
  "content/problem-solutions.js",
  "content/problem-sales-copy.js",
  "content/problem-paid-search.js",
  "content/problem-paid-creatives.js",
  "scripts/export-problem-google-ads.mjs",
  "app/solutions-ia/page.js",
  "app/solutions-ia/[slug]/page.js",
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

const observatoryLeadSource = readFileSync(resolve(siteRoot, "components/ObservatoryLeadForm.js"), "utf8");
const problemLeadSource = readFileSync(resolve(siteRoot, "components/ProblemLeadForm.js"), "utf8");

for (const [label, source] of [
  ["ObservatoryLeadForm", observatoryLeadSource],
  ["ProblemLeadForm", problemLeadSource]
]) {
  for (const requiredPattern of [
    "trackLeadConversion",
    "marketing_consent",
    "consent_timestamp",
    "privacy_notice_version",
    "consent_source"
  ]) {
    if (!source.includes(requiredPattern)) {
      errors.push(`${label} is missing required lead / consent marker: ${requiredPattern}.`);
    }
  }
}

const problemSlugs = problemSolutions.map((item) => item.slug);
if (problemSolutions.length < 25) {
  errors.push(`Precise problem registry must contain at least 25 LPs, found ${problemSolutions.length}.`);
}
if (new Set(problemSlugs).size !== problemSlugs.length) {
  errors.push("Precise problem registry contains duplicate slugs.");
}

const waveOneProblems = problemSolutions.filter((item) => item.wave === 1);
if (waveOneProblems.length < 10) {
  errors.push(`Wave 1 must contain at least 10 problem LPs, found ${waveOneProblems.length}.`);
}

for (const item of problemSolutions) {
  if (!item.title || !item.headline || !item.intro || !item.cluster) {
    errors.push(`${item.slug}: problem LP is missing required positioning copy.`);
  }
  if (!Array.isArray(item.demos) || item.demos.length !== 4) {
    errors.push(`${item.slug}: problem LP must expose exactly 4 interactive demos.`);
  }
  if (!Array.isArray(item.deliverables) || item.deliverables.length !== 4) {
    errors.push(`${item.slug}: problem LP must expose exactly 4 project deliverables.`);
  }

  const paidSearch = problemPaidSearch[item.slug];
  if (!paidSearch) {
    errors.push(`${item.slug}: problem LP is missing paid-search configuration.`);
  } else {
    if (!paidSearch.primaryKeyword || !paidSearch.adAngle) {
      errors.push(`${item.slug}: paid-search config requires primaryKeyword and adAngle.`);
    }
    if (!Array.isArray(paidSearch.secondaryKeywords) || paidSearch.secondaryKeywords.length < 3) {
      errors.push(`${item.slug}: paid-search config requires at least three secondary keywords.`);
    }
    if (!Array.isArray(paidSearch.negativeKeywords) || paidSearch.negativeKeywords.length < 3) {
      errors.push(`${item.slug}: paid-search config requires at least three negative keywords.`);
    }
    for (const criterion of ["pain","demo","economicValue","paidIntent","deliverability"]) {
      const value = paidSearch.scores?.[criterion];
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        errors.push(`${item.slug}: paid-search score ${criterion} must be an integer from 1 to 5.`);
      }
    }
  }
}

for (const slug of Object.keys(problemPaidSearch)) {
  if (!problemSlugs.includes(slug)) {
    errors.push(`${slug}: paid-search config has no corresponding problem LP.`);
  }
}

for (const item of waveOneProblems) {
  const creative = problemPaidCreatives[item.slug];
  if (!creative) {
    errors.push(`${item.slug}: Priority 1 LP is missing curated responsive-search assets.`);
  } else {
    if (!Array.isArray(creative.headlines) || creative.headlines.length < 6) {
      errors.push(`${item.slug}: responsive-search creative requires at least six headlines.`);
    }
    if (!Array.isArray(creative.descriptions) || creative.descriptions.length < 2) {
      errors.push(`${item.slug}: responsive-search creative requires at least two descriptions.`);
    }
    for (const headline of creative.headlines || []) {
      if (headline.length > 30) {
        errors.push(`${item.slug}: Google Ads headline exceeds 30 characters: "${headline}".`);
      }
    }
    for (const description of creative.descriptions || []) {
      if (description.length > 90) {
        errors.push(`${item.slug}: Google Ads description exceeds 90 characters.`);
      }
    }
    for (const pathValue of [creative.path1, creative.path2]) {
      if (!pathValue || pathValue.length > 15) {
        errors.push(`${item.slug}: Google Ads path must contain 1-15 characters.`);
      }
    }
  }

  const sales = problemSalesCopy[item.slug];
  if (!sales) {
    errors.push(`${item.slug}: Wave 1 LP is missing buying-context content.`);
    continue;
  }
  for (const field of ["inputs", "outputs", "systems"]) {
    if (!Array.isArray(sales[field]) || sales[field].length < 4) {
      errors.push(`${item.slug}: Wave 1 buying-context field ${field} must contain at least 4 items.`);
    }
  }
  if (!sales.trigger || !sales.human) {
    errors.push(`${item.slug}: Wave 1 buying-context copy must include trigger and human gate.`);
  }
}

const attributionSource = readFileSync(resolve(siteRoot, "lib/clientAttribution.js"), "utf8");
for (const requiredPattern of [
  "campaign_id",
  "adset_id",
  "ad_id",
  "creative_id",
  "gclid",
  "fbclid",
  "autonomia_first_touch",
  "autonomia_attribution_history"
]) {
  if (!attributionSource.includes(requiredPattern)) {
    errors.push(`Shared client attribution is missing marker: ${requiredPattern}.`);
  }
}

for (const formPath of [
  "components/LeadForm.js",
  "components/ObservatoryLeadForm.js",
  "components/ProblemLeadForm.js"
]) {
  const source = readFileSync(resolve(siteRoot, formPath), "utf8");
  if (!source.includes("getClientAttribution")) {
    errors.push(`${formPath}: form must use shared client attribution.`);
  }
}

const trackingSource = readFileSync(resolve(siteRoot, "lib/clientTracking.js"), "utf8");
for (const requiredPattern of ["autonomia_cookie_consent", "NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL", "fbq"]) {
  if (!trackingSource.includes(requiredPattern)) {
    errors.push(`Consent-aware tracking bridge is missing marker: ${requiredPattern}.`);
  }
}

const llmsSource = readFileSync(resolve(siteRoot, "app/llms.txt/route.js"), "utf8");
for (const requiredPattern of ["Observatory JSON dataset", "Sitemap", "Google Search does not require llms.txt"]) {
  if (!llmsSource.includes(requiredPattern)) {
    errors.push(`llms.txt route is missing machine-navigation marker: ${requiredPattern}.`);
  }
}

const observatoryRouteSource = readFileSync(resolve(siteRoot, "app/api/public/observatoire-ia/route.js"), "utf8");
for (const requiredPattern of ["observed_offers", "roles", "tools", "skills", "use_cases", "limitations"]) {
  if (!observatoryRouteSource.includes(requiredPattern)) {
    errors.push(`Public Observatory dataset is missing field marker: ${requiredPattern}.`);
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

for (const requiredPattern of [
  'import { problemSolutions } from "@/content/problem-solutions"',
  'const problemLandingPages = problemSolutions.map',
  '/solutions-ia/${problem.slug}',
  '...problemLandingPages'
]) {
  if (!organicUrlsSource.includes(requiredPattern)) {
    errors.push(`Organic URL manifest is missing problem-LP sitemap marker: ${requiredPattern}.`);
  }
}

const sitemapSource = readFileSync(resolve(siteRoot, "app/sitemap.js"), "utf8");
for (const requiredPattern of ["getIndexableUrlRecords", "lastModified", "changeFrequency", "priority"]) {
  if (!sitemapSource.includes(requiredPattern)) {
    errors.push(`sitemap.js is missing metadata marker: ${requiredPattern}.`);
  }
}

const intentSource = readFileSync(resolve(siteRoot, "components/IntentPage.js"), "utf8");
for (const requiredPattern of ["captureLead", "requestedService={page.slug}", "scanSecondaryLink"]) {
  if (!intentSource.includes(requiredPattern)) {
    errors.push(`IntentPage is missing paid-funnel integration marker: ${requiredPattern}.`);
  }
}

function articleFingerprintTokens(article) {
  // Compare the intent-specific editorial payload, not the shared methodological
  // scaffold used by long-form factories. This catches thin variants while
  // allowing a consistent Autonomia article structure.
  const text = [
    article.title,
    article.dek,
    article.summary,
    ...(article.quickFacts || []).flatMap(([label, value]) => [label, value]),
    ...(article.sections || []).map((section) => section.heading),
    ...(article.faq || []).flatMap(([question, answer]) => [question, answer]),
    article.cta?.title || "",
    article.cta?.text || ""
  ]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ");

  const words = text
    .split(/\s+/)
    .filter((word) => word.length >= 5);

  const shingles = new Set();
  for (let i = 0; i < words.length - 3; i += 1) {
    shingles.add(words.slice(i, i + 4).join(" "));
  }
  return shingles;
}

function jaccardSimilarity(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  const smaller = a.size <= b.size ? a : b;
  const larger = a.size <= b.size ? b : a;
  for (const value of smaller) {
    if (larger.has(value)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
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
const territoryArticleSlugs = publishedTerritoryArticles.map((article) => article.slug);

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

const territorySource = readFileSync(resolve(siteRoot, "content/territory-editorial.js"), "utf8");
if (!territorySource.includes("territoryBacklog")) errors.push("Territory editorial backlog is missing.");

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

const fingerprintedArticles = articles.map((article) => ({
  slug: article.slug,
  type: article.type,
  tokens: articleFingerprintTokens(article)
}));

for (let i = 0; i < fingerprintedArticles.length; i += 1) {
  for (let j = i + 1; j < fingerprintedArticles.length; j += 1) {
    const a = fingerprintedArticles[i];
    const b = fingerprintedArticles[j];
    if (a.type !== b.type) continue;

    const similarity = jaccardSimilarity(a.tokens, b.tokens);
    if (similarity >= 0.72) {
      errors.push(
        `Editorial intent duplication risk: ${a.slug} and ${b.slug} share ${Math.round(similarity * 100)}% intent-payload similarity.`
      );
    }
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
