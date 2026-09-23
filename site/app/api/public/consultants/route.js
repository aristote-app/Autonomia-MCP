import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const limit = url.searchParams.get("limit") || "6";

  if (!role) {
    return NextResponse.json({ ok: false, error: "role_required" }, { status: 400 });
  }

  const base =
    process.env.AUTONOMIA_CONSULTANTS_URL ||
    "https://cockpit.build-autonomia.com/api/public/consultants";

  try {
    const endpoint = new URL(base);
    endpoint.searchParams.set("role", role);
    endpoint.searchParams.set("limit", limit);

    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        accept: "application/json"
      }
    });

    const payload = await response.json().catch(() => ({
      ok: false,
      error: "invalid_consultant_feed"
    }));

    return NextResponse.json(payload, {
      status: response.ok ? 200 : response.status,
      headers: {
        "cache-control": "no-store"
      }
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "consultant_feed_unavailable", profiles: [] },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }
}
