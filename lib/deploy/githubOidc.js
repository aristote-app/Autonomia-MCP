import { createPublicKey, verify } from "node:crypto";

const ISSUER = "https://token.actions.githubusercontent.com";
const JWKS_URL = ISSUER + "/.well-known/jwks";
const AUDIENCE = "autonomia-o2switch";
const REPOSITORY = "aristote-app/Autonomia-MCP";
const REF = "refs/heads/main";
const WORKFLOW_PREFIX =
  REPOSITORY + "/.github/workflows/deploy-o2switch-self.yml@";

const JWKS_CACHE = Symbol.for("autonomia.github.oidc.jwks");

function decodeJson(part) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

function audienceIncludes(value, expected) {
  if (Array.isArray(value)) return value.includes(expected);
  return value === expected;
}

export function validateGitHubDeploymentClaims(
  claims = {},
  { nowSeconds = Math.floor(Date.now() / 1000) } = {}
) {
  if (claims.iss !== ISSUER) return { ok: false, reason: "issuer" };
  if (!audienceIncludes(claims.aud, AUDIENCE)) return { ok: false, reason: "audience" };
  if (claims.repository !== REPOSITORY) return { ok: false, reason: "repository" };
  if (claims.ref !== REF) return { ok: false, reason: "ref" };
  if (
    typeof claims.workflow_ref !== "string" ||
    !claims.workflow_ref.startsWith(WORKFLOW_PREFIX)
  ) return { ok: false, reason: "workflow_ref" };
  if (claims.event_name !== "workflow_run") return { ok: false, reason: "event_name" };

  const exp = Number(claims.exp);
  const nbf = Number(claims.nbf || claims.iat || 0);
  if (!Number.isFinite(exp) || exp < nowSeconds - 30) {
    return { ok: false, reason: "expired" };
  }
  if (Number.isFinite(nbf) && nbf > nowSeconds + 30) {
    return { ok: false, reason: "not_before" };
  }

  return { ok: true, reason: null };
}

async function githubJwks() {
  const existing = globalThis[JWKS_CACHE];
  if (existing && existing.expiresAt > Date.now()) return existing.keys;

  const response = await fetch(JWKS_URL, {
    headers: { accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    throw new Error("GitHub OIDC JWKS returned HTTP " + response.status);
  }

  const payload = await response.json();
  const keys = Array.isArray(payload?.keys) ? payload.keys : [];
  if (!keys.length) throw new Error("GitHub OIDC JWKS is empty");

  globalThis[JWKS_CACHE] = {
    keys,
    expiresAt: Date.now() + 6 * 60 * 60 * 1000
  };
  return keys;
}

export async function verifyGitHubDeploymentToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) {
    return { ok: false, reason: "malformed", claims: null };
  }

  let header;
  let claims;
  try {
    header = decodeJson(parts[0]);
    claims = decodeJson(parts[1]);
  } catch {
    return { ok: false, reason: "decode", claims: null };
  }

  if (header.alg !== "RS256" || !header.kid) {
    return { ok: false, reason: "header", claims: null };
  }

  const keys = await githubJwks();
  const jwk = keys.find((item) => item.kid === header.kid);
  if (!jwk) return { ok: false, reason: "kid", claims: null };

  const publicKey = createPublicKey({ key: jwk, format: "jwk" });
  const signed = Buffer.from(parts[0] + "." + parts[1]);
  const signature = Buffer.from(parts[2], "base64url");
  const validSignature = verify("RSA-SHA256", signed, publicKey, signature);

  if (!validSignature) return { ok: false, reason: "signature", claims: null };

  const validation = validateGitHubDeploymentClaims(claims);
  return { ...validation, claims: validation.ok ? claims : null };
}

export function validDeploySha(value) {
  return /^[a-f0-9]{40}$/i.test(String(value || "").trim());
}

export const GITHUB_DEPLOY_AUDIENCE = AUDIENCE;
