import { NextResponse } from "next/server";

const ALLOWED_ROLES = new Set([
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

export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const role = String(url.searchParams.get("role") || "").trim();
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 6), 1), 12);

  if (!ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ error: "unknown_role", profiles: [] }, { status: 400 });
  }

  const base = (process.env.AUTONOMIA_COCKPIT_PUBLIC_URL || "https://cockpit.build-autonomia.com").replace(/\/$/, "");

  try {
    const response = await fetch(
      `${base}/api/public/consultants?role=${encodeURIComponent(role)}&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("consultant_feed_unavailable");
    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: { "cache-control": "no-store" }
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "consultant_feed_unavailable", profiles: [] },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }
}
