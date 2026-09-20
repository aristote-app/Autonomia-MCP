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
  trainingBacklog
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

if (new Set(pageSlugs).size !== pageSlugs.length) {
  errors.push("Landing-page registry contains duplicate slugs.");
}

for (const slug of requiredLandingSlugs) {
  if (!pageSlugs.includes(slug)) {
    errors.push(`Required acquisition landing page missing: ${slug}.`);
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
  "app/api/leads/route.js",
  "app/scan-ia/page.js",
  "docs/tuesday-integration-runbook.md",
  "docs/paid-acquisition-map.md"
];

for (const relativePath of requiredRuntimeFiles) {
  try {
    readFileSync(resolve(siteRoot, relativePath), "utf8");
  } catch {
    errors.push(`Required public-site runtime file missing: ${relativePath}.`);
  }
}

const scanSource = readFileSync(resolve(siteRoot, "components/AutonomiaScan.js"), "utf8");
for (const requiredField of ["recommended", "execution", "roles", "capabilities", "academy"]) {
  if (!scanSource.toLowerCase().includes(requiredField)) {
    errors.push(`Autonomia Scan execution blueprint is missing expected field: ${requiredField}.`);
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
