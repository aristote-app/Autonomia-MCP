import {
  enrichKasprLinkedInProfile,
  extractKasprContactData,
  getKasprRemainingCredits
} from "../../../../lib/integrations/kaspr.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "ksmoke-4d3e99c2a71f4b85";

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("t") !== TOKEN) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const out = { ok: true, credits: null, email: null };

  try {
    out.credits = await getKasprRemainingCredits();
  } catch (error) {
    out.credits = { error: error instanceof Error ? error.message : String(error) };
  }

  try {
    const provider = await enrichKasprLinkedInProfile({
      linkedinUrl: "https://fr.linkedin.com/in/ebnou222",
      name: "Moustapha Ebnou",
      dataToGet: ["workEmail"],
      requiredData: ["workEmail"]
    });
    const extracted = extractKasprContactData(provider);
    out.email = {
      ok: true,
      found: extracted.found,
      email_b2b: extracted.email_b2b
    };
  } catch (error) {
    out.email = { ok: false, error: error instanceof Error ? error.message : String(error) };
  }

  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}
