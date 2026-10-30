import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  runAutomatedFreelanceRefresh,
  runAutomatedJobSignalRefresh,
  runAutomatedExtendedDemandRefresh
} from "../lib/market/automatedRefresh.js";
import { refreshAllAccountWatches } from "../lib/db/accountWatches.js";
import { searchTheirStack } from "../lib/collectors/theirStack.js";
import { upsertJobSignals } from "../lib/db/jobSignals.js";
import { runOpportunityHunter } from "../lib/market/opportunityHunter.js";

const STATE_FILE = resolve(process.cwd(), ".runtime", "job-refresh-state.json");
const HOUR = 60 * 60 * 1000;

const INTERVALS = Object.freeze({
  theirstack: 24 * HOUR,
  freework: 1 * HOUR,
  franceTravail: 0.5 * HOUR,
  linkedinIndeed: 24 * HOUR,
  linkedinIndeedBackfill: 168 * HOUR,
  extendedWeb: 48 * HOUR,
  opportunityHunter: 24 * HOUR
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

  // TheirStack is optional: no credential means no API call and no credits used.
  // The daily cap is five jobs (maximum ~155 results/month).
  if (process.env.THEIRSTACK_API_KEY && due(state, "theirstack", INTERVALS.theirstack, false)) {
    try {
      const preview = await searchTheirStack({ limit: 5, postedAtMaxAgeDays: 7 });
      const saved = await upsertJobSignals(preview.items);
      if (!saved.persisted || saved.errors?.length) throw new Error("TheirStack persistence incomplete");
      result.theirstack = { available: true, fetched: preview.fetched, excludedIntermediaries: preview.excludedIntermediaries, saved: saved.count };
      state.theirstack = new Date().toISOString();
    } catch (error) {
      result.theirstack = { available: false, error: error instanceof Error ? error.message : String(error) };
    }
  } else {
    result.theirstack = { skipped: true, reason: process.env.THEIRSTACK_API_KEY ? "daily_throttle" : "api_key_missing" };
  }

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
        triggerMode: "scheduled",
        freshness: "pw",
        maxPages: 1
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


  if (due(state, "linkedinIndeedBackfill", INTERVALS.linkedinIndeedBackfill, force)) {
    try {
      result.linkedinIndeedBackfill = await runAutomatedJobSignalRefresh({
        triggerMode: "scheduled_backfill",
        freshness: "pm",
        maxPages: 2
      });
      state.linkedinIndeedBackfill = new Date().toISOString();
    } catch (error) {
      result.linkedinIndeedBackfill = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    result.linkedinIndeedBackfill = { available: true, skipped: true, reason: "throttled" };
  }

  if (due(state, "extendedWeb", INTERVALS.extendedWeb, force)) {
    try {
      result.extendedWeb = await runAutomatedExtendedDemandRefresh({
        triggerMode: "scheduled",
        includeWeb: true,
        includeFranceTravail: false,
        webKinds: ["freelance", "training", "training_general", "training_international", "training_marketplace", "adoption", "territory", "territory_program"]
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


  if (due(state, "opportunityHunter", INTERVALS.opportunityHunter, force)) {
    try {
      result.opportunityHunter = await runOpportunityHunter({
        maxAccounts: 6,
        maxPhoneFallbacks: 2
      });
      state.opportunityHunter = new Date().toISOString();
    } catch (error) {
      result.opportunityHunter = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    result.opportunityHunter = { available: true, skipped: true, reason: "throttled" };
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
    linkedinIndeedHours: 24,
    linkedinIndeedBackfillHours: 168,
    extendedWebHours: 48,
    opportunityHunterHours: 24,
    forceFullRefresh: force
  };
  result.completedAt = new Date().toISOString();
  console.log(JSON.stringify(result, null, 2));

  const attempted = [
    result.freelance,
    result.franceTravail,
    result.linkedinIndeed,
    result.linkedinIndeedBackfill,
    result.extendedWeb,
    result.opportunityHunter
  ].filter((item) => !item?.skipped);

  if (attempted.length && attempted.every((item) => item?.available === false)) {
    process.exitCode = 1;
  }
}

main();
