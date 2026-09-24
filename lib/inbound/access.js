import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "autonomia_inbound_access";
const ACCESS_CODE_HASH = "3f7a080b45f2c4d3c32e8f02118b71619f3b68c159c980694a147d4215b4862d";

function digest(value) {
  return createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function signingSecret() {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.AUTONOMIA_INBOUND_TOKEN ||
    null
  );
}

function expectedCookieValue() {
  const secret = signingSecret();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update("autonomia-inbound-access-v1", "utf8")
    .digest("hex");
}

function safeEqual(left, right) {
  if (!left || !right) return false;
  const a = Buffer.from(String(left), "utf8");
  const b = Buffer.from(String(right), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function validTemporaryInboundCode(value) {
  return safeEqual(digest(value), ACCESS_CODE_HASH);
}

export async function hasTemporaryInboundAccess() {
  const expected = expectedCookieValue();
  if (!expected) return false;

  const store = await cookies();
  return safeEqual(store.get(COOKIE_NAME)?.value, expected);
}

export async function grantTemporaryInboundAccess() {
  const expected = expectedCookieValue();
  if (!expected) {
    throw new Error("Inbound access signing secret is unavailable");
  }

  const store = await cookies();
  store.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/inbound",
    maxAge: 60 * 60 * 24 * 30
  });
}
