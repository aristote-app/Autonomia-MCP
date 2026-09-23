import { NextResponse } from "next/server";
import { z } from "zod";
import { buildEditorialBrief } from "@/lib/editorialBrief";

const payloadSchema = z.object({
  family: z.enum(["execution", "training", "territory"]),
  slug: z.string().min(1)
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

  const brief = buildEditorialBrief(payload.family, payload.slug);
  if (!brief) {
    return NextResponse.json({ error: "topic_not_found" }, { status: 404 });
  }

  return NextResponse.json(brief);
}
