import {
  editorialInventory,
  executionPillars,
  trainingPillars
} from "../content/editorial-backlog.js";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "../content/published-articles.js";
import { isIntentionalSeparation } from "../content/editorial-separations.js";

const published = [...publishedExecutionArticles, ...publishedTrainingArticles];
const warnings = [];
const errors = [];

const STOPWORDS = new Set([
  "avec","dans","pour","sans","une","des","les","aux","sur","par","du","de","la","le","et",
  "ia","ai","un","en","a","d","l","au","ou","plus","comment","creer","former","formation",
  "automatiser","apprendre","entreprise"
]);

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokens(value = "") {
  return new Set(
    normalize(value)
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
  );
}

function similarity(a, b) {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const token of left) if (right.has(token)) overlap += 1;
  return overlap / new Set([...left, ...right]).size;
}

for (const article of published) {
  if (!article.publishedAt || !article.modifiedAt) {
    errors.push(`${article.slug}: publication and modification dates are required.`);
  }

  if (!article.search?.primaryKeyword) {
    errors.push(`${article.slug}: primary keyword is required.`);
  }

  if (!article.sources?.length) {
    errors.push(`${article.slug}: at least one source is required.`);
  }

  const domains = new Set(
    (article.sources || []).map((source) => {
      try { return new URL(source.url).hostname; } catch { return "invalid"; }
    })
  );

  if (domains.has("invalid")) {
    errors.push(`${article.slug}: at least one source URL is invalid.`);
  }

  if (article.sources?.length >= 3 && domains.size === 1) {
    warnings.push(`${article.slug}: all verification sources come from one domain.`);
  }
}

for (let i = 0; i < editorialInventory.length; i += 1) {
  for (let j = i + 1; j < editorialInventory.length; j += 1) {
    const a = editorialInventory[i];
    const b = editorialInventory[j];
    if (a.type !== b.type) continue;

    const score = similarity(a.title, b.title);
    if (score >= 0.72 && !isIntentionalSeparation(a.slug, b.slug)) {
      warnings.push(
        `Potential backlog overlap (${score.toFixed(2)}): "${a.title}" <> "${b.title}".`
      );
    }
  }
}

const publishedKeywords = new Map();
for (const article of published) {
  const keyword = article.search?.primaryKeyword?.trim().toLowerCase();
  if (!keyword) continue;
  if (!publishedKeywords.has(keyword)) publishedKeywords.set(keyword, []);
  publishedKeywords.get(keyword).push(article.slug);
}

for (const [keyword, slugs] of publishedKeywords) {
  if (slugs.length > 1) {
    errors.push(`Published keyword collision "${keyword}": ${slugs.join(", ")}.`);
  }
}

for (const pillar of [...executionPillars, ...trainingPillars]) {
  const titleWords = normalize(pillar.title)
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1);

  if (titleWords.length < 3) {
    warnings.push(`${pillar.slug}: pillar title may be too generic.`);
  }
}

console.log(
  JSON.stringify(
    {
      published_guides: published.length,
      backlog_topics: editorialInventory.length,
      pillars: executionPillars.length + trainingPillars.length,
      warnings,
      errors
    },
    null,
    2
  )
);

if (errors.length) process.exit(1);
