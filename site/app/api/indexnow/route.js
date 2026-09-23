import { NextResponse } from "next/server";

function authorized(request) {
  const token = process.env.AUTONOMIA_INDEXING_TOKEN;
  const header = request.headers.get("authorization");
  return Boolean(token && header === `Bearer ${token}`);
}

function sameHost(url, base) {
  try {
    return new URL(url).host === new URL(base).host;
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.INDEXNOW_KEY;
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!key || !base) {
    return NextResponse.json({ error: "indexnow_not_configured" }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const urls = Array.isArray(body?.urls)
    ? [...new Set(body.urls.filter((url) => typeof url === "string" && sameHost(url, base)))].slice(0, 10000)
    : [];

  if (!urls.length) {
    return NextResponse.json({ error: "urls_required" }, { status: 400 });
  }

  const host = new URL(base).host;
  const keyLocation = `${base.replace(/\/$/, "")}/indexnow/${key}`;

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: urls
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "indexnow_failed", status: response.status },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    submitted: urls.length,
    host
  });
}
