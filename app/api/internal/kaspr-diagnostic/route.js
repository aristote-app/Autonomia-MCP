import {
  enrichKasprLinkedInProfile,
  extractKasprContactData,
  getKasprRemainingCredits
} from "../../../../lib/integrations/kaspr.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "diag-7f8e51c1e2bb4a6c9f102f0c5c4d8a31";

async function enrichBusinessContact({ linkedinUrl, name }) {
  const primary = await enrichKasprLinkedInProfile({
    linkedinUrl,
    name,
    dataToGet: ["workEmail", "phone"],
    requiredData: ["workEmail"]
  });

  let extracted = extractKasprContactData(primary);
  let fallbackUsed = false;

  if (!extracted.found) {
    fallbackUsed = true;
    const phoneOnly = await enrichKasprLinkedInProfile({
      linkedinUrl,
      name,
      dataToGet: ["phone"],
      requiredData: ["phone"]
    });
    extracted = extractKasprContactData(phoneOnly);
  }

  return { extracted, fallbackUsed };
}

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("t") !== TOKEN) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const creditsBefore = await getKasprRemainingCredits().catch((error) => ({
    error: error instanceof Error ? error.message : String(error)
  }));

  const candidates = [
    {
      name: "Moustapha Ebnou",
      linkedinUrl: "https://fr.linkedin.com/in/ebnou222"
    },
    {
      name: "Fariha Shah",
      linkedinUrl: "https://fr.linkedin.com/in/farihashahfr"
    }
  ];

  const attempts = [];
  let hit = null;

  for (const candidate of candidates) {
    try {
      const { extracted, fallbackUsed } = await enrichBusinessContact(candidate);
      const safeAttempt = {
        name: candidate.name,
        ok: true,
        found: extracted.found,
        has_email_b2b: Boolean(extracted.email_b2b),
        has_phone: Boolean(extracted.phone),
        fallback_used: fallbackUsed
      };
      attempts.push(safeAttempt);
      if (extracted.found) {
        hit = safeAttempt;
        break;
      }
    } catch (error) {
      attempts.push({
        name: candidate.name,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const creditsAfter = await getKasprRemainingCredits().catch((error) => ({
    error: error instanceof Error ? error.message : String(error)
  }));

  return Response.json({
    ok: true,
    connected: true,
    hit,
    attempts,
    credits_before: creditsBefore,
    credits_after: creditsAfter
  }, {
    headers: { "Cache-Control": "no-store" }
  });
}
