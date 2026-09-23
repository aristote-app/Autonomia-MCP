import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "ai-project-manager",
  "genai-engineer",
  "llm-engineer",
  "rag-engineer",
  "ai-agent-engineer",
  "data-scientist",
  "ml-engineer",
  "mlops-llmops-engineer",
  "ai-product-manager",
  "ai-governance",
  "automation-engineer"
]);

export async function GET(request) {
  const url = new URL(request.url);
  const role = String(url.searchParams.get("role") || "").trim();
  if (!ALLOWED.has(role)) {
    return NextResponse.json({ ok: false, error: "unknown_role", profiles: [] }, { status: 400 });
  }

  const base =
    process.env.AUTONOMIA_COCKPIT_URL ||
    process.env.NEXT_PUBLIC_COCKPIT_URL ||
    "https://cockpit.build-autonomia.com";

  try {
    const response = await fetch(
      `${base.replace(/\/$/, "")}/api/public/consultants?role=${encodeURIComponent(role)}&limit=6`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "consultant_feed_unavailable", profiles: [] }, { status: 503 });
    }

    const payload = await response.json();
    return NextResponse.json(
      {
        ok: true,
        role,
        profiles: payload.profiles || [],
        availability_note: payload.availability_note || null,
        pricing_note: payload.pricing_note || null,
        data_updated_at: payload.data_updated_at || null
      },
      { headers: { "cache-control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "consultant_feed_unavailable", profiles: [] }, { status: 503 });
  }
}
