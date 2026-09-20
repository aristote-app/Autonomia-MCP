import { getAllPages } from "@/lib/pages";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const staticPages = [
    { url: base, priority: 1, changeFrequency: "weekly" },
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

  return [...staticPages, ...pages, ...executionArticles, ...trainingArticles];
}
