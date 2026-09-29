import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "autonomia_integrations_access";
const ACCESS_CODE_HASH = "908f5cc4febece77f41c0b692dad7896488f8f460b085f96eb3e8c04dfd68dc4";

function digest(value) {
  return createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function signingSecret() {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.AUTONOMIA_INTERNAL_TOKEN ||
    process.env.AUTONOMIA_INBOUND_TOKEN ||
    null
  );
}

function expectedCookieValue() {
  const secret = signingSecret();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update("autonomia-integrations-access-v1", "utf8")
    .digest("hex");
}

function safeEqual(left, right) {
  if (!left || !right) return false;
  const a = Buffer.from(String(left), "utf8");
  const b = Buffer.from(String(right), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function validTemporaryIntegrationsCode(value) {
  return safeEqual(digest(value), ACCESS_CODE_HASH);
}

export async function hasTemporaryIntegrationsAccess() {
  const expected = expectedCookieValue();
  if (!expected) return false;

  const store = await cookies();
  return safeEqual(store.get(COOKIE_NAME)?.value, expected);
}

export async function grantTemporaryIntegrationsAccess() {
  const expected = expectedCookieValue();
  if (!expected) {
    throw new Error("Integrations access signing secret is unavailable");
  }

  const store = await cookies();
  store.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/integrations",
    maxAge: 60 * 60 * 24
  });
}
