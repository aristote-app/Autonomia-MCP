import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh,
  runAutomatedExtendedDemandRefresh
} from "../lib/market/automatedRefresh.js";
import { refreshAllAccountWatches } from "../lib/db/accountWatches.js";

const STATE_FILE = resolve(process.cwd(), ".runtime", "job-refresh-state.json");
const HOUR = 60 * 60 * 1000;

const INTERVALS = Object.freeze({
  freework: 1 * HOUR,
  franceTravail: 0.5 * HOUR,
  linkedinIndeed: 8 * HOUR,
  extendedWeb: 24 * HOUR
});

async function readState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function saveState(state) {
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

function due(state, key, intervalMs, force) {
  if (force) return true;
  const previous = new Date(state[key] || 0).getTime();
  return !Number.isFinite(previous) || Date.now() - previous >= intervalMs;
}

async function main() {
  const startedAt = new Date().toISOString();
  const result = { startedAt };
  const state = await readState();
  const force = process.env.AUTONOMIA_FORCE_FULL_REFRESH === "true";

  if (due(state, "freework", INTERVALS.freework, force)) {
    try {
      result.freelance = await runAutomatedFreelanceRefresh({
        category: "ia",
        limit: 50,
        triggerMode: "scheduled"
      });
      state.freework = new Date().toISOString();
    } catch (error) {
      result.freelance = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    result.freelance = { available: true, skipped: true, reason: "throttled" };
  }

  if (due(state, "franceTravail", INTERVALS.franceTravail, force)) {
    try {
      result.franceTravail = await runAutomatedExtendedDemandRefresh({
        triggerMode: "scheduled",
        includeWeb: false,
        includeFranceTravail: true
      });
      state.franceTravail = new Date().toISOString();
    } catch (error) {
      result.franceTravail = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    result.franceTravail = { available: true, skipped: true, reason: "throttled" };
  }

  if (due(state, "linkedinIndeed", INTERVALS.linkedinIndeed, force)) {
    try {
      result.linkedinIndeed = await runAutomatedJobSignalRefresh({
        triggerMode: "scheduled"
      });
      state.linkedinIndeed = new Date().toISOString();
    } catch (error) {
      result.linkedinIndeed = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    result.linkedinIndeed = { available: true, skipped: true, reason: "throttled" };
  }

  if (due(state, "extendedWeb", INTERVALS.extendedWeb, force)) {
    try {
      result.extendedWeb = await runAutomatedExtendedDemandRefresh({
        triggerMode: "scheduled",
        includeWeb: true,
        includeFranceTravail: false,
        webKinds: ["freelance", "training", "adoption", "territory", "territory_program"]
      });
      state.extendedWeb = new Date().toISOString();
    } catch (error) {
      result.extendedWeb = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    result.extendedWeb = { available: true, skipped: true, reason: "throttled" };
  }

  try {
    result.accountWatches = await refreshAllAccountWatches();
  } catch (error) {
    result.accountWatches = {
      available: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  await saveState(state);

  result.schedule = {
    freeworkHours: 1,
    franceTravailHours: 0.5,
    linkedinIndeedHours: 8,
    extendedWebHours: 24,
    forceFullRefresh: force
  };
  result.completedAt = new Date().toISOString();
  console.log(JSON.stringify(result, null, 2));

  const attempted = [
    result.freelance,
    result.franceTravail,
    result.linkedinIndeed,
    result.extendedWeb
  ].filter((item) => !item?.skipped);

  if (attempted.length && attempted.every((item) => item?.available === false)) {
    process.exitCode = 1;
  }
}

main();
