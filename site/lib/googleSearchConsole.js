import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters";

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function serviceAccountJson() {
  const raw = String(process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON || "").trim();
  const b64 = String(process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_B64 || "").trim();

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }

  if (b64) {
    try {
      return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    } catch {}
  }

  return null;
}

function credentials() {
  const json = serviceAccountJson();
  return {
    email:
      json?.client_email ||
      process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_EMAIL ||
      "",
    privateKeyId:
      json?.private_key_id ||
      process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY_ID ||
      "",
    privateKey: String(
      json?.private_key ||
      process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY ||
      ""
    ).replace(/\\n/g, "\n")
  };
}

function privateKey() {
  return credentials().privateKey;
}

export function getSearchConsoleConfig() {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "";
  const sitemapUrl =
    process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL ||
    `${String(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")}/sitemap.xml`;
  const auth = credentials();

  const configured = Boolean(
    siteUrl &&
    sitemapUrl &&
    auth.email &&
    auth.privateKey
  );

  return {
    configured,
    siteUrl,
    sitemapUrl,
    serviceAccountEmail: auth.email,
    privateKeyId: auth.privateKeyId
  };
}

async function accessToken() {
  const config = getSearchConsoleConfig();
  if (!config.configured) {
    throw new Error("google_search_console_not_configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
    ...(config.privateKeyId ? { kid: config.privateKeyId } : {})
  };
  const claims = {
    iss: config.serviceAccountEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now - 30,
    exp: now + 3600
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey());
  const assertion = `${unsigned}.${base64url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    }),
    cache: "no-store"
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.access_token) {
    const error = new Error(body?.error_description || body?.error || "google_oauth_failed");
    error.status = response.status;
    throw error;
  }

  return body.access_token;
}

function sitemapEndpoint(config) {
  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    config.siteUrl
  )}/sitemaps/${encodeURIComponent(config.sitemapUrl)}`;
}

export async function submitSearchConsoleSitemap() {
  const config = getSearchConsoleConfig();
  const token = await accessToken();
  const response = await fetch(sitemapEndpoint(config), {
    method: "PUT",
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(body || "search_console_sitemap_submit_failed");
    error.status = response.status;
    throw error;
  }

  return {
    ok: true,
    site_url: config.siteUrl,
    sitemap_url: config.sitemapUrl,
    submitted_at: new Date().toISOString()
  };
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function querySearchConsoleDemand({ days = 28, rowLimit = 500 } = {}) {
  const config = getSearchConsoleConfig();
  if (!config.configured) {
    return {
      configured: false,
      site_url: config.siteUrl || null,
      rows: []
    };
  }

  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - Math.max(1, Math.min(Number(days) || 28, 90)) + 1);

  const token = await accessToken();
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    config.siteUrl
  )}/searchAnalytics/query`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      startDate: isoDate(start),
      endDate: isoDate(end),
      dimensions: ["query"],
      rowLimit: Math.max(1, Math.min(Number(rowLimit) || 500, 25000)),
      type: "web"
    }),
    cache: "no-store"
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error?.message || "search_console_query_failed");
    error.status = response.status;
    throw error;
  }

  return {
    configured: true,
    site_url: config.siteUrl,
    period_start: isoDate(start),
    period_end: isoDate(end),
    rows: (body?.rows || []).map((row) => ({
      query: row?.keys?.[0] || "",
      clicks: Number(row?.clicks) || 0,
      impressions: Number(row?.impressions) || 0,
      ctr: Number(row?.ctr) || 0,
      position: Number(row?.position) || 0
    })).filter((row) => row.query)
  };
}

export async function getSearchConsoleSitemapStatus() {
  const config = getSearchConsoleConfig();
  if (!config.configured) {
    return {
      configured: false,
      site_url: config.siteUrl || null,
      sitemap_url: config.sitemapUrl || null,
      service_account_email: config.serviceAccountEmail || null
    };
  }

  const token = await accessToken();
  const response = await fetch(sitemapEndpoint(config), {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store"
  });

  if (response.status === 404) {
    return {
      configured: true,
      submitted: false,
      site_url: config.siteUrl,
      sitemap_url: config.sitemapUrl,
      service_account_email: config.serviceAccountEmail
    };
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error?.message || "search_console_sitemap_status_failed");
    error.status = response.status;
    throw error;
  }

  return {
    configured: true,
    submitted: true,
    site_url: config.siteUrl,
    sitemap_url: config.sitemapUrl,
    service_account_email: config.serviceAccountEmail,
    last_submitted: body?.lastSubmitted || null,
    last_downloaded: body?.lastDownloaded || null,
    is_pending: body?.isPending ?? null,
    is_sitemaps_index: body?.isSitemapsIndex ?? null,
    errors: body?.errors ?? null,
    warnings: body?.warnings ?? null,
    contents: Array.isArray(body?.contents)
      ? body.contents.map((item) => ({
          type: item?.type || null,
          submitted: Number(item?.submitted) || 0,
          indexed: Number(item?.indexed) || 0
        }))
      : []
  };
}
