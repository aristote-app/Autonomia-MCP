import { NextResponse } from "next/server";
import { z } from "zod";
import { prioritizeEditorialBacklog } from "@/lib/editorialOpportunityEngine";

const signalSchema = z.object({
  query: z.string().optional(),
  term: z.string().optional(),
  cluster: z.string().optional(),
  family: z.enum(["execution-use-case", "training-use-case", "territory-use-case"]).optional(),
  search_impressions: z.number().nonnegative().optional(),
  impressions: z.number().nonnegative().optional(),
  search_clicks: z.number().nonnegative().optional(),
  clicks: z.number().nonnegative().optional(),
  paid_search_conversions: z.number().nonnegative().optional(),
  inbound_mentions: z.number().nonnegative().optional(),
  job_mentions: z.number().nonnegative().optional(),
  public_procurement_mentions: z.number().nonnegative().optional(),
  territory_mentions: z.number().nonnegative().optional(),
  ai_citations: z.number().nonnegative().optional(),
  citations: z.number().nonnegative().optional(),
  revenue: z.number().nonnegative().optional()
});

const requestSchema = z.object({
  signals: z.array(signalSchema).max(5000).default([]),
  max_results: z.number().int().min(1).max(100).optional()
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
    payload = requestSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "invalid_payload", detail: error?.issues || null },
      { status: 400 }
    );
  }

  return NextResponse.json(
    prioritizeEditorialBacklog(payload.signals, { max_results: payload.max_results }),
    { headers: { "cache-control": "no-store" } }
  );
}
