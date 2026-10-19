import { mkdir, open, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { loadAccountIntelligence } from "../lib/db/accountIntelligence.js";
import { discoverDecisionMakers } from "../lib/collectors/decisionMakers.js";
import { getReviewedDecisionMaker } from "../lib/intelligence/reviewedDecisionMakers.js";
import { isExcludedCommercialCompany } from "../lib/intelligence/commercialLeadPolicy.js";
import { decisionCompanyKey, readDecisionMakerSnapshot, writeDecisionMakerSnapshot } from "../lib/intelligence/decisionMakerSnapshot.js";

// Runs only on the server cron. Visiting a public page never spends search quota.
// Thirty accounts / sixty queries at most each day, including deployment runs.
async function refresh() {
  if (!process.env.BRAVE_SEARCH_API_KEY) return console.log('[decision-makers] skipped: search provider not configured');
  const snapshot = await readDecisionMakerSnapshot();
  const today = new Date().toISOString().slice(0, 10);
  if (snapshot.budgetDay !== today) {
    snapshot.budgetDay = today;
    snapshot.accountsSearched = 0;
  }
  const { accounts } = await loadAccountIntelligence({ limit: 500 });
  const eligible = accounts.filter((account) => {
    if (account.intermediary_risk || account.account_type === "intermediary" || isExcludedCommercialCompany(account.name) || getReviewedDecisionMaker(account.name)) return false;
    const key = decisionCompanyKey(account.name);
    if (!key || /non identifie|a identifier/.test(key)) return false;
    const previous = snapshot.accounts[key];
    return !previous || Date.now() - Date.parse(previous.checkedAt) > (previous.searchSucceeded ? 14 : 1) * 86400000;
  });
  let searched = 0;
  for (const account of eligible.slice(0, Math.max(0, 30 - (snapshot.accountsSearched || 0)))) {
    // Reserve before contacting the provider, so crashes/redeploys do not reset quota.
    snapshot.accountsSearched = (snapshot.accountsSearched || 0) + 1;
    await writeDecisionMakerSnapshot(snapshot);
    const role = account.primary_decision_role?.label?.split('/')[0]?.trim() || 'directeur';
    const result = await discoverDecisionMakers({ company: account.name, roles: [role, 'directeur'], maxRoles: 2, countPerRole: 5 });
    snapshot.accounts[decisionCompanyKey(account.name)] = {
      company: account.name,
      checkedAt: new Date().toISOString(),
      candidates: result.candidates.slice(0, 3),
      searchSucceeded: result.searches.some((search) => search.ok)
    };
    snapshot.generatedAt = new Date().toISOString();
    await writeDecisionMakerSnapshot(snapshot);
    searched += 1;
  }
  console.log(JSON.stringify({ module: 'decision-makers', searched, remaining: Math.max(0, eligible.length - searched), budgetDay: today, accountsSearched: snapshot.accountsSearched }));
}

await mkdir(join(process.cwd(), '.runtime'), { recursive: true });
const lockPath = join(process.cwd(), '.runtime', 'decision-makers-refresh.lock');
// Recover a lock left behind by a terminated process; the bounded batch takes
// minutes, so a two-hour-old lock cannot belong to a healthy refresh.
try {
  if (Date.now() - (await stat(lockPath)).mtimeMs > 2 * 60 * 60 * 1000) await unlink(lockPath);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
let lock;
try {
  lock = await open(lockPath, 'wx');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('[decision-makers] skipped: refresh already running');
}
if (lock) {
  try { await refresh(); }
  finally { await lock.close(); await unlink(lockPath); }
}
