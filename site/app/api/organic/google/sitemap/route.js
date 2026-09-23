import { requireOrganicAuth } from "../../../../../lib/organic/auth.js";
import {
  searchConsoleStatus,
  submitSitemap
} from "../../../../../lib/organic/searchConsole.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sitemapUrl() {
  const base = String(
    process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com"
  ).replace(/\/$/, "");
  return `${base}/sitemap.xml`;
}

export async function GET(request) {
  const auth = requireOrganicAuth(request);
  if (!auth.ok) return auth.response;

  return Response.json({
    ok: true,
    ...searchConsoleStatus(),
    sitemap_url: sitemapUrl(),
    last_submitted: null
  });
}

export async function POST(request) {
  const auth = requireOrganicAuth(request);
  if (!auth.ok) return auth.response;

  const status = searchConsoleStatus();

  if (!status.configured) {
    return Response.json(
      {
        ok: false,
        configured: false,
        error: "search_console_not_configured"
      },
      { status: 503 }
    );
  }

  try {
    const result = await submitSitemap(sitemapUrl());

    return Response.json({
      ok: true,
      configured: true,
      sitemap_url: result.sitemap_url,
      last_submitted: result.submitted_at
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        configured: true,
        error: error?.message || "sitemap_submit_failed"
      },
      { status: 502 }
    );
  }
}
