import { NextResponse } from "next/server";

async function loadSignals() {
  const endpoint = process.env.AUTONOMIA_CONTENT_SIGNALS_URL;
  if (!endpoint) return null;

  try {
    const url = new URL(endpoint);
    url.searchParams.set("days", "90");
    const response = await fetch(url, { next: { revalidate: 21600 } });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.ok ? data : null;
  } catch {
    return null;
  }
}

function normalizeRanking(items = []) {
  return items.slice(0, 25).map((item) => ({
    key: String(item.key || ""),
    label: String(item.label || ""),
    count: Number(item.count || 0)
  }));
}

export async function GET() {
  const data = await loadSignals();

  if (!data || !data.observedOffers) {
    return NextResponse.json(
      {
        ok: false,
        status: "unavailable",
        methodology_url: "/observatoire-ia"
      },
      {
        status: 503,
        headers: { "cache-control": "public, max-age=300" }
      }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      dataset: "Autonomia AI Demand Observatory",
      methodology_url: "/observatoire-ia",
      generated_at: data.generatedAt || data.updatedAt || data.observedAt || new Date().toISOString(),
      observation_window_days: Number(data.periodDays || 90),
      observed_offers: Number(data.observedOffers || 0),
      roles: normalizeRanking(data.roles),
      tools: normalizeRanking(data.tools),
      skills: normalizeRanking(data.skills),
      use_cases: normalizeRanking(data.useCases),
      limitations: [
        "The dataset describes only the collected sample.",
        "Counts are not exhaustive labour-market statistics.",
        "Counts are not Google search volume.",
        "Full job descriptions are not redistributed by this endpoint."
      ]
    },
    {
      headers: {
        "cache-control": "public, max-age=3600, s-maxage=21600",
        "access-control-allow-origin": "*"
      }
    }
  );
}
