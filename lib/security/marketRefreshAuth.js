import {
  createHmac,
  createPublicKey,
  timingSafeEqual,
  verify as verifySignature
} from "node:crypto";

const MARKET_REFRESH_CONTEXT = "autonomia-market-refresh-v1";
const GITHUB_OIDC_ISSUER = "https://token.actions.githubusercontent.com";
const GITHUB_OIDC_AUDIENCE = "autonomia-market-refresh";
const GITHUB_REPOSITORY = "aristote-app/Autonomia-MCP";
const GITHUB_MAIN_REF = "refs/heads/main";
const GITHUB_WORKFLOW_REF =
  "aristote-app/Autonomia-MCP/.github/workflows/refresh-market-on-marker.yml@refs/heads/main";

let cachedJwks = null;
let cachedJwksAt = 0;
const JWKS_TTL_MS = 60 * 60 * 1000;

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

function decodeJsonPart(part) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

async function githubJwks() {
  if (cachedJwks && Date.now() - cachedJwksAt < JWKS_TTL_MS) {
    return cachedJwks;
  }

  const response = await fetch(
    "https://token.actions.githubusercontent.com/.well-known/jwks",
    {
      headers: { accept: "application/json" },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to fetch GitHub OIDC JWKS: HTTP ${response.status}`);
  }

  const payload = await response.json();
  cachedJwks = Array.isArray(payload?.keys) ? payload.keys : [];
  cachedJwksAt = Date.now();
  return cachedJwks;
}

function validAudience(aud) {
  if (Array.isArray(aud)) return aud.includes(GITHUB_OIDC_AUDIENCE);
  return aud === GITHUB_OIDC_AUDIENCE;
}

async function verifyGithubActionsOidc(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return false;

  let header;
  let claims;

  try {
    header = decodeJsonPart(parts[0]);
    claims = decodeJsonPart(parts[1]);
  } catch {
    return false;
  }

  if (header?.alg !== "RS256" || !header?.kid) return false;
  if (claims?.iss !== GITHUB_OIDC_ISSUER) return false;
  if (!validAudience(claims?.aud)) return false;
  if (claims?.repository !== GITHUB_REPOSITORY) return false;
  if (claims?.ref !== GITHUB_MAIN_REF) return false;
  if (claims?.workflow_ref !== GITHUB_WORKFLOW_REF) return false;

  const allowedEvents = new Set(["schedule", "workflow_dispatch", "push"]);
  if (!allowedEvents.has(claims?.event_name)) return false;

  const now = Math.floor(Date.now() / 1000);
  const exp = Number(claims?.exp || 0);
  const nbf = Number(claims?.nbf || 0);
  const iat = Number(claims?.iat || 0);

  if (!exp || exp <= now) return false;
  if (nbf && nbf > now + 30) return false;
  if (!iat || iat < now - 600 || iat > now + 60) return false;

  let jwk;
  try {
    const keys = await githubJwks();
    jwk = keys.find((candidate) => candidate?.kid === header.kid);
  } catch {
    return false;
  }

  if (!jwk) return false;

  try {
    const publicKey = createPublicKey({ key: jwk, format: "jwk" });
    const signingInput = Buffer.from(`${parts[0]}.${parts[1]}`, "utf8");
    const signature = Buffer.from(parts[2], "base64url");

    return verifySignature(
      "RSA-SHA256",
      signingInput,
      publicKey,
      signature
    );
  } catch {
    return false;
  }
}

export async function isAuthorizedMarketRefreshRequest(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;

  const provided = auth.slice(7).trim();
  if (!provided) return false;

  const sharedCandidates = [
    process.env.CRON_SECRET,
    process.env.AUTONOMIA_INTERNAL_TOKEN,
    deriveMarketRefreshToken()
  ].filter(Boolean);

  if (sharedCandidates.some((candidate) => safeEqual(provided, candidate))) {
    return true;
  }

  return verifyGithubActionsOidc(provided);
}
