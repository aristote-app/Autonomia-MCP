import {
  editorialCounts,
  executionBacklog,
  trainingBacklog,
  executionPillars,
  trainingPillars
} from "../content/editorial-backlog.js";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "../content/published-articles.js";

const published = publishedExecutionArticles.length + publishedTrainingArticles.length;
const pillars = executionPillars.length + trainingPillars.length;
const pending = editorialCounts.total - published;

function coverageByCluster(backlog, publishedArticles) {
  const publishedSlugs = new Set(publishedArticles.map((article) => article.slug));
  const clusters = new Map();

  for (const item of backlog) {
    const current = clusters.get(item.cluster) || {
      cluster: item.cluster,
      total: 0,
      published: 0,
      pending: 0
    };
    current.total += 1;
    if (publishedSlugs.has(item.slug)) current.published += 1;
    else current.pending += 1;
    clusters.set(item.cluster, current);
  }

  return [...clusters.values()]
    .map((item) => ({
      ...item,
      coverage_percent: Math.round((item.published / item.total) * 100)
    }))
    .sort((a, b) => b.pending - a.pending || a.cluster.localeCompare(b.cluster));
}

const executionCoverage = coverageByCluster(
  executionBacklog,
  publishedExecutionArticles
);
const trainingCoverage = coverageByCluster(
  trainingBacklog,
  publishedTrainingArticles
);

const report = {
  backlog: {
    total: editorialCounts.total,
    execution: editorialCounts.execution,
    training: editorialCounts.training
  },
  pillars: {
    total: pillars,
    execution: executionPillars.length,
    training: trainingPillars.length
  },
  published_guides: {
    total: published,
    execution: publishedExecutionArticles.length,
    training: publishedTrainingArticles.length
  },
  pending_long_form_guides: pending,
  coverage: {
    execution: executionCoverage,
    training: trainingCoverage,
    next_execution_clusters: executionCoverage
      .filter((item) => item.pending > 0)
      .slice(0, 8),
    next_training_clusters: trainingCoverage
      .filter((item) => item.pending > 0)
      .slice(0, 8)
  },
  policy: "Backlog topics remain non-indexable until promoted to published-articles and validated."
};

console.log(JSON.stringify(report, null, 2));

if (editorialCounts.total !== 400 || pillars !== 40) {
  process.exitCode = 1;
}
