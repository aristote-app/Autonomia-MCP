import {
  hasFranceTravailJobCredentials,
  searchFranceTravailJobs
} from "../collectors/franceTravailJobs.js";
import { persistJobContentSignals } from "../db/contentSignals.js";

export const DEFAULT_JOB_SIGNAL_QUERIES = [
  "intelligence artificielle",
  "IA générative",
  "GenAI",
  "LLM",
  "RAG",
  "agent IA",
  "automatisation IA",
  "n8n",
  "Microsoft Copilot",
  "AI Project Manager"
];

export async function refreshEditorialJobSignals({
  queries = DEFAULT_JOB_SIGNAL_QUERIES,
  limitPerQuery = 40,
  publishedWithinDays = 2
} = {}) {
  if (!hasFranceTravailJobCredentials()) {
    return {
      ok: true,
      skipped: true,
      reason: "france_travail_credentials_missing",
      queries: queries.length
    };
  }

  const deduped = new Map();
  const queryRuns = [];

  const batchSize = 4;
  for (let index = 0; index < queries.length; index += batchSize) {
    const batch = queries.slice(index, index + batchSize);

    const results = await Promise.allSettled(
      batch.map((query) =>
        searchFranceTravailJobs({
          query,
          limit: limitPerQuery,
          publishedWithinDays
        })
      )
    );

    results.forEach((result, offset) => {
      const query = batch[offset];

      if (result.status === "fulfilled") {
        for (const job of result.value.jobs) {
          if (job?.id) deduped.set(String(job.id), job);
        }

        queryRuns.push({
          query,
          ok: true,
          count: result.value.count
        });
      } else {
        queryRuns.push({
          query,
          ok: false,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason)
        });
      }
    });
  }

  const jobs = [...deduped.values()];
  const persistence = await persistJobContentSignals({
    source: "france_travail_jobs",
    jobs
  });

  return {
    ok: queryRuns.some((run) => run.ok),
    skipped: false,
    collected: jobs.length,
    persisted: persistence.persisted,
    queryRuns,
    completedAt: new Date().toISOString()
  };
}
