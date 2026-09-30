import { DEFAULT_JOB_DISCOVERY_QUERIES } from "../lib/collectors/jobDiscovery.js";
import { WEB_DEMAND_QUERY_SPECS } from "../lib/collectors/webDemandDiscovery.js";

const coreRunsPerDay = 24 / 12;
const extendedRunsPerDay = 24 / 48;

const coreRequestsPerRun = DEFAULT_JOB_DISCOVERY_QUERIES.reduce(
  (sum, spec) => sum + Math.min(Math.max(Number(spec.maxPages) || 1, 1), 10),
  0
);

const opportunityHunterRequestsPerDay = 5;

const estimatedDailySearchRequests =
  coreRequestsPerRun * coreRunsPerDay +
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
  coreQueryFamilies: DEFAULT_JOB_DISCOVERY_QUERIES.length,
  coreRequestsPerRun,
  coreRunsPerDay,
  extendedQueries: WEB_DEMAND_QUERY_SPECS.length,
  extendedRunsPerDay,
  opportunityHunterRequestsPerDay,
  estimatedDailySearchRequests,
  estimatedMonthlySearchRequests,
  guardrailDailyMax: 70
});
