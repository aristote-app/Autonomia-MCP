import { NextResponse } from "next/server";
import { z } from "zod";

const metricSchema = z.object({
  name: z.enum(["LCP", "INP", "CLS", "FCP", "TTFB"]),
  id: z.string().max(200),
  value: z.number().finite().nonnegative(),
  delta: z.number().finite(),
  rating: z.enum(["good", "needs-improvement", "poor"]).nullable().optional(),
  navigation_type: z.string().max(100).nullable().optional(),
  pathname: z.string().startsWith("/").max(500),
  viewport_width: z.number().int().nonnegative().max(10000).optional(),
  connection_type: z.string().max(50).nullable().optional()
});

function isSameSite(request) {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return true;

  const expectedHost = new URL(site).host;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  try {
    if (origin) return new URL(origin).host === expectedHost;
    if (referer) return new URL(referer).host === expectedHost;
  } catch {
    return false;
  }

  return false;
}

export async function POST(request) {
  if (!isSameSite(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  let metric;
  try {
    metric = metricSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_metric" }, { status: 400 });
  }

  const target = process.env.AUTONOMIA_ORGANIC_INSIGHTS_URL;
  const token = process.env.AUTONOMIA_ORGANIC_INSIGHTS_TOKEN;

  if (!target || !token) {
    return new NextResponse(null, { status: 204 });
  }

  const url = new URL(metric.pathname, process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr").toString();

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        source: "autonomia_public_site",
        records: [
          {
            provider: "real_user_web_vitals",
            observed_at: new Date().toISOString(),
            url,
            metric_name: metric.name,
            metric_value: metric.value,
            metric_rating: metric.rating,
            navigation_type: metric.navigation_type,
            viewport_width: metric.viewport_width,
            connection_type: metric.connection_type
          }
        ]
      })
    });

    if (!response.ok) {
      return new NextResponse(null, { status: 204 });
    }
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  return new NextResponse(null, { status: 204 });
}
