import { getPublicJobSignalSummary } from "../../../../lib/db/publicJobSignals.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

export async function GET(request) {
  const url = new URL(request.url);
  const tags = safeTags(url.searchParams.get("tags"));
  const days = Number(url.searchParams.get("days") || 90);

  try {
    const summary = await getPublicJobSignalSummary({ tags, days });

    return Response.json(
      {
        ok: true,
        tags,
        ...summary
      },
      {
        headers: {
          "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=21600"
        }
      }
    );
  } catch {
    return Response.json(
      {
        ok: false,
        error: "job_signal_summary_unavailable"
      },
      { status: 503 }
    );
  }
}
