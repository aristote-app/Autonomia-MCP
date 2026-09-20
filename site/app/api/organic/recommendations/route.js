import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeOrganicRecords } from "@/lib/organicDecisionEngine";

const rowSchema = z.object({
  provider: z.string().min(1),
  observed_at: z.string().min(1),
  url: z.string().url(),
  query: z.string().nullable().optional(),
  impressions: z.number().nonnegative().nullable().optional(),
  clicks: z.number().nonnegative().nullable().optional(),
  citations: z.number().nonnegative().nullable().optional(),
  conversions: z.number().nonnegative().nullable().optional(),
  previous_impressions: z.number().nonnegative().nullable().optional(),
  published_at: z.string().nullable().optional(),
  modified_at: z.string().nullable().optional()
});

const payloadSchema = z.object({
  records: z.array(rowSchema).min(1).max(5000)
});

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = payloadSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "invalid_payload", detail: error?.issues || null },
      { status: 400 }
    );
  }

  const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr").host;
  const records = payload.records.filter((row) => new URL(row.url).host === siteHost);

  if (!records.length) {
    return NextResponse.json({ error: "no_site_records" }, { status: 400 });
  }

  const analysis = analyzeOrganicRecords(records);

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    records_analyzed: records.length,
    ...analysis,
    disclaimer:
      "Ces recommandations utilisent des règles opérationnelles Autonomia sur des métriques observées. Elles ne représentent pas des facteurs ni scores internes de Google, Bing ou OpenAI."
  });
}
