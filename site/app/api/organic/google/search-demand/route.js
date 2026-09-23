import { requireOrganicAuth } from "../../../../../lib/organic/auth.js";
import {
  getSearchDemand,
  searchConsoleStatus
} from "../../../../../lib/organic/searchConsole.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = requireOrganicAuth(request);
  if (!auth.ok) return auth.response;

  const status = searchConsoleStatus();

  if (!status.configured) {
    return Response.json(
      {
        ok: false,
        configured: false,
        error: "search_console_not_configured",
        rows: []
      },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const days = Math.min(
    Math.max(Number(url.searchParams.get("days") || 28), 1),
    90
  );
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") || 500), 1),
    25000
  );

  try {
    const demand = await getSearchDemand({ days, limit });

    return Response.json({
      ok: true,
      configured: true,
      site_url: status.site_url,
      ...demand
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        configured: true,
        error: error?.message || "search_console_query_failed",
        rows: []
      },
      { status: 502 }
    );
  }
}
