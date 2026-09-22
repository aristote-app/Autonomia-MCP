import { runAutomatedMarketRefresh } from "../lib/market/automatedRefresh.js";

const queries = [
  "intelligence artificielle",
  "IA générative",
  "LLM",
  "agent IA"
];

async function main() {
  const result = {
    startedAt: new Date().toISOString(),
    runs: []
  };

  for (const query of queries) {
    try {
      result.runs.push({
        ok: true,
        ...(await runAutomatedMarketRefresh({
          query,
          scopes: ["public", "training"],
          limitPerQuery: 8
        }))
      });
    } catch (error) {
      result.runs.push({
        ok: false,
        query,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  result.completedAt = new Date().toISOString();
  console.log(JSON.stringify(result, null, 2));

  if (!result.runs.some((run) => run.ok)) {
    process.exitCode = 1;
  }
}

main();
