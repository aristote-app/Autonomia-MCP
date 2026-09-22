import { getAllPages } from "@/lib/pages";
import {
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

const ORGANIC_RELEASE_DATE = "2026-09-20";

export function getIndexableUrlRecords(base) {
  const staticPages = [
    { url: base, kind: "home", priority: 1, changeFrequency: "weekly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/scan-ia`, kind: "scan", priority: 0.95, changeFrequency: "monthly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/cas-usage-ia`, kind: "execution-hub", priority: 0.9, changeFrequency: "weekly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/formation-ia/cas-usage`, kind: "training-hub", priority: 0.9, changeFrequency: "weekly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/methodologie/execution-matrix`, kind: "methodology", priority: 0.88, changeFrequency: "monthly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/methodologie/learning-transfer`, kind: "methodology", priority: 0.88, changeFrequency: "monthly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/methodologie/politique-editoriale`, kind: "editorial-policy", priority: 0.82, changeFrequency: "monthly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/a-propos`, kind: "entity", priority: 0.82, changeFrequency: "monthly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/territoires`, kind: "territories-offer", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-22" },
    { url: `${base}/observatoire-ia`, kind: "original-dataset", priority: 0.9, changeFrequency: "weekly", lastModified: ORGANIC_RELEASE_DATE },
    { url: `${base}/glossaire-ia`, kind: "defined-term-set", priority: 0.86, changeFrequency: "monthly", lastModified: ORGANIC_RELEASE_DATE }
  ];

  const commercialPages = getAllPages()
    .filter((page) => page.mode !== "diagnostic")
    .map((page) => ({
      url: `${base}/${page.slug}`,
      kind: page.mode === "academy" ? "academy-landing" : "expert-landing",
      priority: page.slug === "experts" || page.slug === "academy" ? 0.9 : 0.8,
      changeFrequency: "monthly"
    }));

  const executionPillarPages = executionPillars.map((pillar) => ({
    url: `${base}/cas-usage-ia/${pillar.slug}`,
    kind: "execution-pillar",
    priority: 0.84,
    changeFrequency: "weekly",
    lastModified: ORGANIC_RELEASE_DATE
  }));

  const trainingPillarPages = trainingPillars.map((pillar) => ({
    url: `${base}/formation-ia/cas-usage/${pillar.slug}`,
    kind: "training-pillar",
    priority: 0.84,
    changeFrequency: "weekly",
    lastModified: ORGANIC_RELEASE_DATE
  }));

  const executionArticles = publishedExecutionArticles.map((article) => ({
    url: `${base}/cas-usage-ia/${article.slug}`,
    kind: "execution-article",
    priority: 0.78,
    changeFrequency: "monthly",
    lastModified: article.modifiedAt || article.publishedAt
  }));

  const trainingArticles = publishedTrainingArticles.map((article) => ({
    url: `${base}/formation-ia/cas-usage/${article.slug}`,
    kind: "training-article",
    priority: 0.78,
    changeFrequency: "monthly",
    lastModified: article.modifiedAt || article.publishedAt
  }));

  return [
    ...staticPages,
    ...commercialPages,
    ...executionPillarPages,
    ...trainingPillarPages,
    ...executionArticles,
    ...trainingArticles
  ];
}

export function getIndexableUrls(base) {
  return getIndexableUrlRecords(base).map((item) => item.url);
}
