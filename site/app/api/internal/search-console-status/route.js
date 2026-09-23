import {
  getSearchConsoleConfig,
  getSearchConsoleSitemapStatus,
  querySearchConsoleDemand
} from "@/lib/googleSearchConsole";
import { verifyGitHubDeploymentToken } from "@/lib/deploy/githubOidc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const oidc = await verifyGitHubDeploymentToken(token);
    if (oidc.ok) return { ok: true };
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized", reason: oidc.reason }, { status: 401 })
    };
  } catch (error) {
    return {
      ok: false,
      response: Response.json(
        { error: "OIDC verification failed", reason: error?.message || String(error) },
        { status: 401 }
      )
    };
  }
}

export async function GET(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const config = getSearchConsoleConfig();
  if (!config.configured) {
    return Response.json({
      ok: false,
      configured: false,
      site_url: config.siteUrl || null,
      sitemap_url: config.sitemapUrl || null,
      has_service_account_email: Boolean(config.serviceAccountEmail),
      has_private_key_id: Boolean(config.privateKeyId)
    }, { status: 200 });
  }

  try {
    const [sitemap, demand] = await Promise.all([
      getSearchConsoleSitemapStatus(),
      querySearchConsoleDemand({ days: 7, rowLimit: 10 })
    ]);

    return Response.json({
      ok: true,
      configured: true,
      sitemap: {
        submitted: sitemap.submitted ?? null,
        last_submitted: sitemap.last_submitted ?? null,
        last_downloaded: sitemap.last_downloaded ?? null,
        errors: sitemap.errors ?? null,
        warnings: sitemap.warnings ?? null,
        contents: sitemap.contents ?? []
      },
      demand: {
        configured: demand.configured,
        row_count: Array.isArray(demand.rows) ? demand.rows.length : 0,
        period_start: demand.period_start || null,
        period_end: demand.period_end || null
      }
    }, {
      headers: { "cache-control": "no-store, no-cache, must-revalidate" }
    });
  } catch (error) {
    return Response.json({
      ok: false,
      configured: true,
      google_api_reachable: false,
      error: error?.message || String(error),
      status: error?.status || null
    }, { status: 200 });
  }
}
