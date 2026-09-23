import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { key } = await params;
  const expected = process.env.INDEXNOW_KEY;

  if (!expected || key !== expected) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(expected, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400"
    }
  });
}
