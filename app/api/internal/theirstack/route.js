import { requireInternalToken } from "../../../../lib/security.js";
import { searchTheirStack } from "../../../../lib/collectors/theirStack.js";
import { upsertJobSignals } from "../../../../lib/db/jobSignals.js";

// Local staging only until an explicit deployment.
export async function POST(request) {
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;
  let body;
  try { body = await request.json(); } catch { body = {}; }
  if (body?.persist === true && process.env.AUTONOMIA_THEIRSTACK_PERSIST_ENABLED !== "true") {
    return Response.json({ error: "Persistence is disabled" }, { status: 403 });
  }
  try {
    const result = await searchTheirStack({ limit: 5, postedAtMaxAgeDays: 7 });
    if (body?.persist === true) {
      const saved = await upsertJobSignals(result.items);
      return Response.json({ fetched: result.fetched, saved: saved.count, errors: saved.errors || [] });
    }
    return Response.json({ fetched: result.fetched, preview: result.items.map(({sourceRecordId,title,companyName,sourceUrl,rawPayload}) => ({sourceRecordId,title,companyName,sourceUrl,buyerClassification:rawPayload.buyer_classification})) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "TheirStack request failed" }, { status: 502 });
  }
}
