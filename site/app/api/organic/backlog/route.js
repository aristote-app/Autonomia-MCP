import { NextResponse } from "next/server";
import {
  executionBacklog,
  trainingBacklog
} from "@/content/editorial-backlog";
import { territoryBacklog } from "@/content/territory-editorial";
import {
  publishedExecutionArticles,
  publishedTrainingArticles,
  publishedTerritoryArticles
} from "@/content/published-articles";

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

function rows(family, backlog, published) {
  const publishedSlugs = new Set(published.map((article) => article.slug));
  const base = family === "training"
    ? "/formation-ia/cas-usage"
    : family === "territory"
      ? "/territoires/guides"
      : "/cas-usage-ia";

  return backlog.map((item) => ({
    family,
    slug: item.slug,
    title: item.title,
    cluster: item.cluster,
    pillar: item.pillar,
    pillar_url: `${base}/${item.clusterSlug}`,
    candidate_url: `${base}/${item.slug}`,
    status: publishedSlugs.has(item.slug) ? "published" : "backlog",
    min_words: item.minWords
  }));
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const items = [
    ...rows("execution", executionBacklog, publishedExecutionArticles),
    ...rows("training", trainingBacklog, publishedTrainingArticles),
    ...rows("territory", territoryBacklog, publishedTerritoryArticles)
  ];

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    total: items.length,
    published: items.filter((item) => item.status === "published").length,
    backlog: items.filter((item) => item.status === "backlog").length,
    items
  });
}
