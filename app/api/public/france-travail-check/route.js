import {
  hasFranceTravailJobCredentials,
  searchFranceTravailJobs
} from "../../../../lib/collectors/franceTravailJobs.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasFranceTravailJobCredentials()) {
    return Response.json({
      ok: false,
      configured: false,
      reason: "credentials_missing"
    }, { status: 503 });
  }

  try {
    const result = await searchFranceTravailJobs({
      query: "intelligence artificielle",
      limit: 1,
      publishedWithinDays: 7
    });

    return Response.json({
      ok: true,
      configured: true,
      source: result.source,
      received: result.count
    }, {
      headers: {
        "cache-control": "no-store"
      }
    });
  } catch (error) {
    return Response.json({
      ok: false,
      configured: true,
      reason: "credential_or_api_test_failed",
      message: error instanceof Error ? error.message : String(error)
    }, { status: 502 });
  }
}
