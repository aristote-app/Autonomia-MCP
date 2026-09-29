import { validTemporaryIntegrationsCode } from "../../../../../lib/integrations/access.js";
import {
  enrichKasprLinkedInProfile,
  extractKasprContactData
} from "../../../../../lib/integrations/kaspr.js";

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const code = clean(body?.code, 120);

  if (!validTemporaryIntegrationsCode(code)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const linkedinUrl = clean(body?.linkedin_url, 500);
  const name = clean(body?.name, 200);

  if (!linkedinUrl || !name) {
    return Response.json(
      { ok: false, error: "linkedin_url_and_name_required" },
      { status: 400 }
    );
  }

  try {
    const provider = await enrichKasprLinkedInProfile({
      linkedinUrl,
      name,
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
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 502 }
    );
  }
}
