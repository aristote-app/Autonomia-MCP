import { DEFAULT_JOB_DISCOVERY_QUERIES } from "../lib/collectors/jobDiscovery.js";
import { WEB_DEMAND_QUERY_SPECS } from "../lib/collectors/webDemandDiscovery.js";

const coreRunsPerDay = 24 / 8;
const extendedRunsPerDay = 1;

const estimatedDailySearchRequests =
  DEFAULT_JOB_DISCOVERY_QUERIES.length * coreRunsPerDay +
  WEB_DEMAND_QUERY_SPECS.length * extendedRunsPerDay;

const estimatedMonthlySearchRequests = estimatedDailySearchRequests * 30;

if (estimatedDailySearchRequests > 30) {
  throw new Error(
    "Automatic Brave search budget exceeded: " +
      estimatedDailySearchRequests +
      " requests/day. Keep it <= 30/day unless the commercial budget is explicitly changed."
  );
}

console.log("SEARCH_BUDGET", {
  coreQueries: DEFAULT_JOB_DISCOVERY_QUERIES.length,
  extendedQueries: WEB_DEMAND_QUERY_SPECS.length,
  estimatedDailySearchRequests,
  estimatedMonthlySearchRequests,
  guardrailDailyMax: 30
});
