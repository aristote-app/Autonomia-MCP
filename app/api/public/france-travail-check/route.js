import {
  hasFranceTravailJobCredentials,
  searchFranceTravailJobs
} from "../../../../lib/collectors/franceTravailJobs.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasFranceTravailJobCredentials()) {
    return Response.json({ ok:false, configured:false, reason:"credentials_missing" }, { status:503 });
  }

  try {
    const result = await searchFranceTravailJobs({
      query: "intelligence artificielle",
      limit: 3,
      publishedWithinDays: 7
    });

    return Response.json({
      ok: true,
      configured: true,
      source: result.source,
      received: result.count,
      sample: result.jobs.slice(0,3).map((job)=>({
        id: job.id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        publishedAt: job.publishedAt
      }))
    }, { headers: { "cache-control":"no-store" }});
  } catch (error) {
    return Response.json({
      ok:false,
      configured:true,
      reason:"credential_or_api_test_failed",
      message:error instanceof Error ? error.message : String(error)
    }, { status:502 });
  }
}
