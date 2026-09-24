import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

async function resolveInboundToken() {
  if (process.env.AUTONOMIA_INBOUND_TOKEN) {
    return process.env.AUTONOMIA_INBOUND_TOKEN;
  }

  const candidates = [
    join(process.cwd(), ".runtime", "integration-settings.json"),
    join(process.cwd(), "..", ".runtime", "integration-settings.json"),
    "/home/dide4169/autonomia-cockpit-app/.runtime/integration-settings.json"
  ];

  for (const runtimeFile of candidates) {
    try {
      const parsed = JSON.parse(await readFile(runtimeFile, "utf8"));
      const token = parsed?.values?.AUTONOMIA_INBOUND_TOKEN;
      if (typeof token === "string" && token) {
        process.env.AUTONOMIA_INBOUND_TOKEN = token;
        return token;
      }
    } catch {}
  }

  return null;
}

const Lead = z.object({
  external_lead_id: z.string().min(1),
  source_channel: z.string().min(1),
  source_platform: z.string().min(1),
  received_at: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().nullable().optional(),
  email: z.string().email(),
  phone: z.union([
    z.string().regex(/^\d{10}$/, "phone_must_have_10_digits"),
    z.null()
  ]).optional(),
  company_name: z.string().min(1),
  requested_service: z.string().min(1),
  message: z.string().nullable().optional(),
  desired_timeline: z.string().nullable().optional(),
  company_size: z.string().nullable().optional(),
  landing_page_url: z.string().nullable().optional(),
  landing_page_topic: z.string().nullable().optional(),
  referrer_url: z.string().nullable().optional(),
  form_id: z.string().min(1),
  campaign_id: z.string().nullable().optional(),
  adset_id: z.string().nullable().optional(),
  ad_id: z.string().nullable().optional(),
  creative_id: z.string().nullable().optional(),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
  gclid: z.string().nullable().optional(),
  fbclid: z.string().nullable().optional(),
  marketing_consent: z.boolean(),
  consent_timestamp: z.string().min(1),
  privacy_notice_version: z.string().min(1),
  consent_source: z.string().min(1)
}).passthrough();

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Lead.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const endpoint =
    process.env.AUTONOMIA_INBOUND_URL ||
    "https://cockpit.build-autonomia.com/api/inbound/leads";
  const token = await resolveInboundToken();

  if (!token) {
    return NextResponse.json(
      { error: "inbound_integration_not_configured" },
      { status: 503 }
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${token}`
    },
    body: JSON.stringify(parsed.data),
    cache: "no-store"
  });

  if (!response.ok) {
    const upstream = await response.json().catch(() => null);
    console.error("Autonomia inbound rejected public lead", {
      status: response.status,
      error: upstream?.error || null
    });
    return NextResponse.json(
      { error: "inbound_rejected" },
      { status: 502 }
    );
  }

  return NextResponse.json({ accepted: true }, { status: 202 });
}
