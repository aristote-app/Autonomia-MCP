import { timingSafeEqual } from "node:crypto";
import { normalizeInboundLead } from "../../../../lib/inbound/normalize.js";
import { persistInboundLead } from "../../../../lib/db/inboundLeads.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secureEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(request) {
  const expected = process.env.AUTONOMIA_INBOUND_TOKEN;
  if (!expected) return false;

  const supplied =
    request.headers.get("x-autonomia-inbound-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  return secureEqual(supplied, expected);
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

  // Website forms can use a hidden honeypot. Bots receive a neutral response
  // without creating CRM noise.
  if (String(payload?._hp || "").trim()) {
    return Response.json({ ok: true, accepted: true }, { status: 202 });
  }

  try {
    const normalized = normalizeInboundLead(payload);
    const persisted = await persistInboundLead(normalized);

    return Response.json(
      {
        ok: true,
        accepted: true,
        lead_id: persisted.lead.id,
        created: persisted.created,
        duplicate_event: persisted.duplicate_event,
        classification: persisted.lead.scan_context?.classification || null,
        next_action: persisted.lead.scan_context?.next_action || null
      },
      { status: persisted.created ? 201 : 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inbound lead processing failed";
    const badRequest = /required|valid|must be explicitly/i.test(message);

    return Response.json(
      { error: badRequest ? message : "Inbound lead processing failed" },
      { status: badRequest ? 400 : 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      service: "autonomia-inbound-leads",
      method: "POST",
      configured: Boolean(process.env.AUTONOMIA_INBOUND_TOKEN)
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}
