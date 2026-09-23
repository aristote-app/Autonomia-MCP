import {
  editorialCounts,
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
  policy: "Backlog topics remain non-indexable until promoted to published-articles and validated."
};

console.log(JSON.stringify(report, null, 2));

if (editorialCounts.total !== 400 || pillars !== 40) {
  process.exitCode = 1;
}
