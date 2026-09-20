import { NextResponse } from "next/server";
import { z } from "zod";

const insightSchema = z.object({
  provider: z.enum([
    "google_search_console",
    "google_generative_ai",
    "bing_webmaster",
    "bing_ai",
    "chatgpt_search",
    "manual_observation"
  ]),
  observed_at: z.string().min(1),
  period_start: z.string().nullable().optional(),
  period_end: z.string().nullable().optional(),
  url: z.string().url(),
  query: z.string().nullable().optional(),
  impressions: z.number().nonnegative().nullable().optional(),
  clicks: z.number().nonnegative().nullable().optional(),
  citations: z.number().nonnegative().nullable().optional(),
  position: z.number().nullable().optional(),
  conversions: z.number().nonnegative().nullable().optional(),
  previous_impressions: z.number().nonnegative().nullable().optional(),
  published_at: z.string().nullable().optional(),
  modified_at: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional()
});

const payloadSchema = z.object({
  records: z.array(insightSchema).min(1).max(1000)
});

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const target = process.env.AUTONOMIA_ORGANIC_INSIGHTS_URL;
  const targetToken = process.env.AUTONOMIA_ORGANIC_INSIGHTS_TOKEN;
  if (!target || !targetToken) {
    return NextResponse.json({ error: "organic_insights_not_configured" }, { status: 503 });
  }

  let data;
  try {
    data = payloadSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "invalid_payload", detail: error?.issues || null },
      { status: 400 }
    );
  }

  const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr").host;
  const records = data.records.filter((record) => new URL(record.url).host === siteHost);

  if (!records.length) {
    return NextResponse.json({ error: "no_site_records" }, { status: 400 });
  }

  const response = await fetch(target, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${targetToken}`
    },
    body: JSON.stringify({
      source: "autonomia_public_site",
      records
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "forward_failed", status: response.status }, { status: 502 });
  }

  return NextResponse.json({ ok: true, accepted: records.length });
}
