import {
  getSearchConsoleConfig,
  getSearchConsoleSitemapStatus,
  submitSearchConsoleSitemap
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

async function submit(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const config = getSearchConsoleConfig();
  if (!config.configured) {
    return Response.json({
      ok: false,
      configured: false,
      site_url: config.siteUrl || null,
      sitemap_url: config.sitemapUrl || null
    }, { status: 200 });
  }

  try {
    const submitted = await submitSearchConsoleSitemap();
    const status = await getSearchConsoleSitemapStatus().catch(() => null);
    return Response.json({
      ok: true,
      configured: true,
      submitted_at: submitted.submitted_at,
      sitemap_url: submitted.sitemap_url,
      status
    }, {
      headers: { "cache-control": "no-store, no-cache, must-revalidate" }
    });
  } catch (error) {
    return Response.json({
      ok: false,
      configured: true,
      error: error?.message || String(error),
      status: error?.status || null
    }, { status: 200 });
  }
}

export async function POST(request) {
  return submit(request);
}

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("action") !== "submit") {
    return Response.json({ error: "missing_submit_action" }, { status: 400 });
  }
  return submit(request);
}
