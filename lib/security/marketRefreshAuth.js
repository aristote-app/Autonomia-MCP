import { createHmac, timingSafeEqual } from "node:crypto";

const MARKET_REFRESH_CONTEXT = "autonomia-market-refresh-v1";

export function deriveMarketRefreshToken(
  secret = process.env.SUPABASE_SECRET_KEY
) {
  if (!secret) return null;

  return createHmac("sha256", secret)
    .update(MARKET_REFRESH_CONTEXT)
    .digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""), "utf8");
  const b = Buffer.from(String(right || ""), "utf8");

  if (!a.length || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAuthorizedMarketRefreshRequest(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;

  const provided = auth.slice(7).trim();
  if (!provided) return false;

  const candidates = [
    process.env.CRON_SECRET,
    process.env.AUTONOMIA_INTERNAL_TOKEN,
    deriveMarketRefreshToken()
  ].filter(Boolean);

  return candidates.some((candidate) => safeEqual(provided, candidate));
}
