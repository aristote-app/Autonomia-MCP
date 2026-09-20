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
  `Content validation passed: ${editorialCounts.execution} execution topics, ${editorialCounts.training} training topics, ${articles.length} published long-form articles.`
);
