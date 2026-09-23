import { timingSafeEqual } from "node:crypto";
import { getAutonomiaServerClient } from "../../../../../lib/db/supabase.js";
import { recordWaalaxyReply } from "../../../../../lib/db/salesContacts.js";
import {
  extractWaalaxyReplyIdentifiers,
  safeReplyEvidence
} from "../../../../../lib/integrations/waalaxyWebhook.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request) {
  const expected = process.env.AUTONOMIA_WAALAXY_WEBHOOK_TOKEN;
  if (!expected) return false;

  const url = new URL(request.url);
  const supplied =
    request.headers.get("x-autonomia-waalaxy-token") ||
    url.searchParams.get("token") ||
    "";

  const left = Buffer.from(String(supplied));
  const right = Buffer.from(String(expected));
  return left.length === right.length && timingSafeEqual(left, right);
}

async function logWebhook({ evidence, match, status = 200, response = "accepted" }) {
  try {
    const client = getAutonomiaServerClient();
    await client.from("webhook_logs").insert({
      event_type: "waalaxy_reply",
      http_status: status,
      payload: {
        evidence,
        matched: Boolean(match?.matched),
        ambiguous: Boolean(match?.ambiguous),
        status_changed: Boolean(match?.statusChanged)
      },
      response,
      webhook_url: "waalaxy:reply"
    });
  } catch {
    // Webhook processing must not fail because audit logging is unavailable.
  }
}

export async function POST(request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const identifiers = extractWaalaxyReplyIdentifiers(payload);
  const evidence = safeReplyEvidence(payload);

  if (
    !identifiers.linkedinUrls.length &&
    !identifiers.emails.length &&
    !identifiers.prospectIds.length
  ) {
    await logWebhook({
      evidence,
      match: { matched: false, ambiguous: false },
      status: 202,
      response: "accepted_without_identifier"
    });

    return Response.json({
      ok: true,
      matched: false,
      reason: "No exact contact identifier found in payload"
    });
  }

  try {
    const match = await recordWaalaxyReply({ identifiers, safeEvidence: evidence });
    await logWebhook({ evidence, match });

    return Response.json({
      ok: true,
      matched: Boolean(match.matched),
      ambiguous: Boolean(match.ambiguous),
      status_changed: Boolean(match.statusChanged)
    });
  } catch (error) {
    await logWebhook({
      evidence,
      match: null,
      status: 500,
      response: error instanceof Error ? error.message : "processing_error"
    });

    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      service: "autonomia-waalaxy-reply-webhook",
      method: "POST",
      configured: Boolean(process.env.AUTONOMIA_WAALAXY_WEBHOOK_TOKEN)
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}
