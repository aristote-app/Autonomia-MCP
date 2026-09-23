import { NextResponse } from "next/server";
import {
  getSearchConsoleConfig,
  getSearchConsoleSitemapStatus,
  submitSearchConsoleSitemap
} from "@/lib/googleSearchConsole";

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const config = getSearchConsoleConfig();
  if (!config.configured) {
    return NextResponse.json({
      configured: false,
      site_url: config.siteUrl || null,
      sitemap_url: config.sitemapUrl || null,
      service_account_email: config.serviceAccountEmail || null
    });
  }

  try {
    return NextResponse.json(await getSearchConsoleSitemapStatus(), {
      headers: { "cache-control": "no-store" }
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        error: error?.message || "search_console_status_failed"
      },
      { status: error?.status || 502 }
    );
  }
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const submitted = await submitSearchConsoleSitemap();
    const status = await getSearchConsoleSitemapStatus().catch(() => null);
    return NextResponse.json({ ...submitted, status }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "search_console_submit_failed" },
      { status: error?.status || 502 }
    );
  }
}
