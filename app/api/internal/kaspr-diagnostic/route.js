import {
  enrichKasprLinkedInProfile,
  extractKasprContactData,
  getKasprRemainingCredits
} from "../../../../lib/integrations/kaspr.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "diag-7f8e51c1e2bb4a6c9f102f0c5c4d8a31";

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("t") !== TOKEN) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const result = {
    ok: true,
    credits: null,
    workEmailTest: null
  };

  try {
    result.credits = await getKasprRemainingCredits();
  } catch (error) {
    result.credits = {
      error: error instanceof Error ? error.message : String(error)
    };
  }

  try {
    const provider = await enrichKasprLinkedInProfile({
      linkedinUrl: "https://fr.linkedin.com/in/ebnou222",
      name: "Moustapha Ebnou",
      dataToGet: ["workEmail"],
      requiredData: ["workEmail"]
    });

    const extracted = extractKasprContactData(provider);
    result.workEmailTest = {
      ok: true,
      found: extracted.found,
      email_b2b: extracted.email_b2b
    };
  } catch (error) {
    result.workEmailTest = {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  return Response.json(result, {
    headers: { "Cache-Control": "no-store" }
  });
}
