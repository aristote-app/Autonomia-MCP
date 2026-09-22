import {
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh
} from "../lib/market/automatedRefresh.js";

async function main() {
  const startedAt = new Date().toISOString();
  const result = { startedAt };

  try {
    result.freelance = await runAutomatedFreelanceRefresh({
      category: "ia",
      limit: 50,
      triggerMode: "scheduled"
    });
  } catch (error) {
    result.freelance = {
      available: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  try {
    result.linkedinIndeed = await runAutomatedJobSignalRefresh({
      triggerMode: "scheduled"
    });
  } catch (error) {
    result.linkedinIndeed = {
      available: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  result.completedAt = new Date().toISOString();
  console.log(JSON.stringify(result, null, 2));

  if (!result.freelance?.available && !result.linkedinIndeed?.available) {
    process.exitCode = 1;
  }
}

main();
