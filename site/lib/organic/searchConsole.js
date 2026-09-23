import crypto from "node:crypto";

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function serviceAccountConfig() {
  const email = String(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL || ""
  ).trim();
  const privateKey = String(
    process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY || ""
  )
    .replace(/\\n/g, "\n")
    .trim();
  const siteUrl = String(
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      ""
  ).trim();

  return { email, privateKey, siteUrl };
}

export function searchConsoleStatus() {
  const config = serviceAccountConfig();

  return {
    configured: Boolean(config.email && config.privateKey && config.siteUrl),
    site_url: config.siteUrl || null
  };
}

async function getAccessToken() {
  const { email, privateKey } = serviceAccountConfig();

  if (!email || !privateKey) {
    throw new Error("search_console_credentials_missing");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/webmasters",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600
    })
  );

  const unsigned = `${header}.${payload}`;
  const signature = crypto.sign(
    "RSA-SHA256",
    Buffer.from(unsigned),
    privateKey
  );
  const assertion = `${unsigned}.${base64url(signature)}`;

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth2:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body,
    cache: "no-store"
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json.access_token) {
    throw new Error(
      json.error_description || json.error || "google_oauth_failed"
    );
  }

  return json.access_token;
}

export async function submitSitemap(sitemapUrl) {
  const { siteUrl } = serviceAccountConfig();

  if (!siteUrl) {
    throw new Error("search_console_site_url_missing");
  }

  const token = await getAccessToken();
  const endpoint =
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl
    )}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `sitemap_submit_failed_${response.status}:${body.slice(0, 300)}`
    );
  }

  return {
    ok: true,
    sitemap_url: sitemapUrl,
    submitted_at: new Date().toISOString()
  };
}

export async function getSearchDemand({ days = 28, limit = 500 } = {}) {
  const { siteUrl } = serviceAccountConfig();

  if (!siteUrl) {
    throw new Error("search_console_site_url_missing");
  }

  const token = await getAccessToken();

  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);

  const start = new Date(end);
  start.setUTCDate(
    start.getUTCDate() - Math.max(1, Number(days) - 1)
  );

  const formatDate = (value) => value.toISOString().slice(0, 10);

  const endpoint =
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl
    )}/searchAnalytics/query`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      startDate: formatDate(start),
      endDate: formatDate(end),
      dimensions: ["query"],
      rowLimit: Math.min(
        Math.max(Number(limit) || 500, 1),
        25000
      ),
      dataState: "final"
    }),
    cache: "no-store"
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body?.error?.message || "search_console_query_failed"
    );
  }

  return {
    rows: (body.rows || []).map((row) => ({
      query: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0
    })),
    start_date: formatDate(start),
    end_date: formatDate(end)
  };
}
