import { getAllPages } from "@/lib/pages";
import { aiRoles } from "@/content/ai-roles";
import { academyTrainings } from "@/content/academy-trainings";
import { observatoryTopics } from "@/content/observatory-solutions";
import {
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";
import { territoryPillars } from "@/content/territory-editorial";
import {
  publishedExecutionArticles,
  publishedTrainingArticles,
  publishedTerritoryArticles
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
    { url: `${base}/territoires`, kind: "territories-offer", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-23" },
    { url: `${base}/territoires/guides`, kind: "territory-guides-hub", priority: 0.88, changeFrequency: "weekly", lastModified: "2026-09-23" },
    { url: `${base}/territoires/ia-agents-collectivite`, kind: "territories-guide", priority: 0.86, changeFrequency: "monthly", lastModified: "2026-09-22" },
    { url: `${base}/territoires/academy-ia-collectivites`, kind: "territories-guide", priority: 0.86, changeFrequency: "monthly", lastModified: "2026-09-22" },
    { url: `${base}/territoires/accelerateur-ia-tpe-pme`, kind: "territories-guide", priority: 0.86, changeFrequency: "monthly", lastModified: "2026-09-22" },
    { url: `${base}/territoires/urbanisme`, kind: "territory-campaign", priority: 0.82, changeFrequency: "monthly", lastModified: "2026-09-23" },
    { url: `${base}/territoires/conservatoire`, kind: "territory-campaign", priority: 0.82, changeFrequency: "monthly", lastModified: "2026-09-23" },
    { url: `${base}/observatoire-ia`, kind: "ai-needs-hub", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-09-23" },
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

  const aiRolePages = aiRoles.map((role) => ({
    url: `${base}/metiers-ia/${role.slug}`,
    kind: "ai-role-guide",
    priority: 0.86,
    changeFrequency: "monthly",
    lastModified: "2026-09-23"
  }));

  const academyTrainingPages = academyTrainings.map((training) => ({
    url: `${base}/formation-ia/${training.slug}`,
    kind: "academy-training-program",
    priority: 0.87,
    changeFrequency: "monthly",
    lastModified: "2026-09-23"
  }));

  const observatoryLandingPages = observatoryTopics
    .filter((topic) => !topic.href)
    .map((topic) => ({
      url: `${base}/observatoire-ia/${topic.slug}`,
      kind: "ai-needs-landing",
      priority: 0.82,
      changeFrequency: "monthly",
      lastModified: "2026-09-23"
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

  const territoryPillarPages = territoryPillars.map((pillar) => ({
    url: `${base}/territoires/guides/${pillar.slug}`,
    kind: "territory-pillar",
    priority: 0.84,
    changeFrequency: "weekly",
    lastModified: "2026-09-23"
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

  const territoryArticles = publishedTerritoryArticles.map((article) => ({
    url: `${base}/territoires/guides/${article.slug}`,
    kind: "territory-article",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: article.modifiedAt || article.publishedAt
  }));

  return [
    ...staticPages,
    ...commercialPages,
    ...aiRolePages,
    ...academyTrainingPages,
    ...observatoryLandingPages,
    ...executionPillarPages,
    ...trainingPillarPages,
    ...territoryPillarPages,
    ...executionArticles,
    ...trainingArticles,
    ...territoryArticles
  ];
}

export function getIndexableUrls(base) {
  return getIndexableUrlRecords(base).map((item) => item.url);
}
