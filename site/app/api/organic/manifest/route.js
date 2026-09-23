import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "../../../../content/published-articles.js";
import {
  editorialCounts,
  executionBacklog,
  trainingBacklog
} from "../../../../content/editorial-backlog.js";
import { getAllPages } from "../../../../lib/pages.js";
import { requireOrganicAuth } from "../../../../lib/organic/auth.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = requireOrganicAuth(request);
  if (!auth.ok) return auth.response;

  const staticCount = 4;
  const commercialPages = getAllPages().filter(
    (page) => page.mode !== "diagnostic"
  ).length;
  const publishedArticles =
    publishedExecutionArticles.length +
    publishedTrainingArticles.length;

  return Response.json({
    ok: true,
    indexable: {
      total: staticCount + commercialPages + publishedArticles,
      static_pages: staticCount,
      commercial_pages: commercialPages,
      editorial_pages: publishedArticles
    },
    editorial: {
      published_articles_total: publishedArticles,
      published_execution_total:
        publishedExecutionArticles.length,
      published_training_total:
        publishedTrainingArticles.length,
      backlog_total:
        executionBacklog.length + trainingBacklog.length,
      execution_backlog_total: editorialCounts.execution,
      training_backlog_total: editorialCounts.training
    },
    generated_at: new Date().toISOString()
  });
}
