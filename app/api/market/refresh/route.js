import { refreshPublicMarket } from "../../../../lib/market/refresh.js";
import { requireInternalToken } from "../../../../lib/security.js";

export async function POST(request) {
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;
  let body = {};
  try { body = await request.json(); } catch {}
  const query = body.query || "intelligence artificielle";
  const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 100);
  return Response.json(await refreshPublicMarket({ query, limit }));
}
