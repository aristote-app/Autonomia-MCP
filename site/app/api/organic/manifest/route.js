import { NextResponse } from "next/server";
import { editorialCounts, executionPillars, trainingPillars } from "@/content/editorial-backlog";
import { publishedExecutionArticles, publishedTrainingArticles } from "@/content/published-articles";
import { territoryEditorialCounts, territoryPillars } from "@/content/territory-editorial";
import { getIndexableUrlRecords } from "@/lib/organicUrls";

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const urls = getIndexableUrlRecords(base);

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    editorial: {
      backlog_total: editorialCounts.total + territoryEditorialCounts.backlog,
      backlog_execution: editorialCounts.execution,
      backlog_training: editorialCounts.training,
      backlog_territory: territoryEditorialCounts.backlog,
      pillars_total: executionPillars.length + trainingPillars.length + territoryPillars.length,
      pillars_execution: executionPillars.length,
      pillars_training: trainingPillars.length,
      pillars_territory: territoryPillars.length,
      published_articles_total: publishedExecutionArticles.length + publishedTrainingArticles.length,
      published_execution: publishedExecutionArticles.length,
      published_training: publishedTrainingArticles.length
    },
    indexable: {
      total: urls.length,
      by_kind: urls.reduce((acc, item) => {
        acc[item.kind] = (acc[item.kind] || 0) + 1;
        return acc;
      }, {}),
      urls
    }
  });
}
