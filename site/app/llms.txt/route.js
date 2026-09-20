import {
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr").replace(/\/$/, "");

  const lines = [
    "# Autonomia",
    "",
    "> AI Execution Partner. Autonomia relie besoins métier, expertise IA externe, montée en compétences et exécution.",
    "",
    "## Core",
    `- Home: ${base}`,
    `- About: ${base}/a-propos`,
    `- Editorial policy: ${base}/methodologie/politique-editoriale`,
    `- AI Execution Matrix: ${base}/methodologie/execution-matrix`,
    `- Learning Transfer Matrix: ${base}/methodologie/learning-transfer`,
    `- AI Demand Observatory: ${base}/observatoire-ia`,
    `- Observatory JSON dataset: ${base}/api/public/observatoire-ia`,
    "",
    "## Commercial",
    `- Experts: ${base}/experts`,
    `- Academy: ${base}/academy`,
    `- Autonomia Scan: ${base}/scan-ia`,
    "",
    "## Execution pillars",
    ...executionPillars.map((pillar) => `- ${pillar.title}: ${base}/cas-usage-ia/${pillar.slug}`),
    "",
    "## Training pillars",
    ...trainingPillars.map((pillar) => `- ${pillar.title}: ${base}/formation-ia/cas-usage/${pillar.slug}`),
    "",
    "## Published execution guides",
    ...publishedExecutionArticles.map((article) => `- ${article.title}: ${base}/cas-usage-ia/${article.slug}`),
    "",
    "## Published training guides",
    ...publishedTrainingArticles.map((article) => `- ${article.title}: ${base}/formation-ia/cas-usage/${article.slug}`),
    "",
    "## Discovery",
    `- Sitemap: ${base}/sitemap.xml`,
    `- RSS: ${base}/feed.xml`,
    "",
    "This file is a navigation aid for systems that choose to use llms.txt. Google Search does not require llms.txt for ranking or AI-feature visibility."
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=21600"
    }
  });
}
