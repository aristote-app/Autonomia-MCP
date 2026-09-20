import { getAllPages } from "@/lib/pages";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";
import {
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const staticPages = [
    { url: base, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/scan-ia`, priority: 0.95, changeFrequency: "monthly" },
    { url: `${base}/cas-usage-ia`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/formation-ia/cas-usage`, priority: 0.9, changeFrequency: "weekly" }
  ];

  const pages = getAllPages()
    .filter((page) => page.mode !== "diagnostic")
    .map((page) => ({
      url: `${base}/${page.slug}`,
      priority: page.slug === "experts" || page.slug === "academy" ? 0.9 : 0.8,
      changeFrequency: "monthly"
    }));

  const executionPillarPages = executionPillars.map((pillar) => ({
    url: `${base}/cas-usage-ia/${pillar.slug}`,
    priority: 0.84,
    changeFrequency: "weekly"
  }));

  const trainingPillarPages = trainingPillars.map((pillar) => ({
    url: `${base}/formation-ia/cas-usage/${pillar.slug}`,
    priority: 0.84,
    changeFrequency: "weekly"
  }));

  const executionArticles = publishedExecutionArticles.map((article) => ({
    url: `${base}/cas-usage-ia/${article.slug}`,
    priority: 0.78,
    changeFrequency: "monthly"
  }));

  const trainingArticles = publishedTrainingArticles.map((article) => ({
    url: `${base}/formation-ia/cas-usage/${article.slug}`,
    priority: 0.78,
    changeFrequency: "monthly"
  }));

  return [
    ...staticPages,
    ...pages,
    ...executionPillarPages,
    ...trainingPillarPages,
    ...executionArticles,
    ...trainingArticles
  ];
}
