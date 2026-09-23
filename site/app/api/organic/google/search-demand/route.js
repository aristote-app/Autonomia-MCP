import { NextResponse } from "next/server";
import { querySearchConsoleDemand } from "@/lib/googleSearchConsole";

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = Number(url.searchParams.get("days") || 28);
  const rowLimit = Number(url.searchParams.get("limit") || 500);

  try {
    return NextResponse.json(
      await querySearchConsoleDemand({ days, rowLimit }),
      { headers: { "cache-control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "search_console_query_failed" },
      { status: error?.status || 502 }
    );
  }
}
