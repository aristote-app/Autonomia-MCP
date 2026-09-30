import { DEFAULT_JOB_DISCOVERY_QUERIES } from "../lib/collectors/jobDiscovery.js";
import { WEB_DEMAND_QUERY_SPECS } from "../lib/collectors/webDemandDiscovery.js";

const recentRunsPerDay = 24 / 12;
const backfillRunsPerDay = 24 / 168;
const extendedRunsPerDay = 24 / 48;

const recentRequestsPerRun = DEFAULT_JOB_DISCOVERY_QUERIES.length * 1;
const backfillRequestsPerRun = DEFAULT_JOB_DISCOVERY_QUERIES.length * 2;

// Opportunity Hunter resolves at most 6 direct-client accounts every 24h and searches one
// decision-maker role per account.
const opportunityHunterRequestsPerDay = (24 / 24) * 6;

const estimatedDailySearchRequests =
  recentRequestsPerRun * recentRunsPerDay +
  backfillRequestsPerRun * backfillRunsPerDay +
  WEB_DEMAND_QUERY_SPECS.length * extendedRunsPerDay +
  opportunityHunterRequestsPerDay;

const estimatedMonthlySearchRequests = Math.ceil(estimatedDailySearchRequests * 30);

if (estimatedDailySearchRequests > 70) {
  throw new Error(
    "Automatic Brave search budget exceeded: " +
      estimatedDailySearchRequests +
      " requests/day. Keep it <= 70/day unless the commercial budget is explicitly changed."
  );
}

console.log("SEARCH_BUDGET", {
  jobQueries: DEFAULT_JOB_DISCOVERY_QUERIES.length,
  recentRequestsPerRun,
  recentRunsPerDay,
  backfillRequestsPerRun,
  backfillRunsPerDay,
  extendedQueries: WEB_DEMAND_QUERY_SPECS.length,
  extendedRunsPerDay,
  opportunityHunterRequestsPerDay,
  estimatedDailySearchRequests,
  estimatedMonthlySearchRequests,
  guardrailDailyMax: 70
});
