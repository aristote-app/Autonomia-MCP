// Explicit, one-shot preview. Never persists to production automatically.
import { searchTheirStack } from "../lib/collectors/theirStack.js";
const result = await searchTheirStack({ limit: 5, postedAtMaxAgeDays: 7 });
for (const job of result.items) console.log(JSON.stringify({
  id: job.sourceRecordId, title: job.title, company: job.companyName,
  url: job.sourceUrl, classification: job.rawPayload.buyer_classification
}));
console.log(`Fetched ${result.fetched} jobs; expected credits: ${result.fetched}`);
