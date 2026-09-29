import {
  enrichKasprLinkedInProfile,
  extractKasprContactData
} from "../../../../lib/integrations/kaspr.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SMOKE_TOKEN = "ksp-9c6a31f74f5e4b7d8d62f1d3a0c2e9ab";

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("t") !== SMOKE_TOKEN) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const provider = await enrichKasprLinkedInProfile({
      linkedinUrl: "https://fr.linkedin.com/in/ebnou222",
      name: "Moustapha Ebnou",
      isPhoneRequired: true
    });
    const extracted = extractKasprContactData(provider);

    return Response.json(
      {
        ok: true,
        found: extracted.found,
        email_b2b: extracted.email_b2b,
        phone: extracted.phone
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 200 }
    );
  }
}
