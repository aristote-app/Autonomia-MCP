import { searchBoamp } from "../../../../lib/collectors/boamp.js";
import { searchTed } from "../../../../lib/collectors/ted.js";
import { requireInternalToken } from "../../../../lib/security.js";

export async function GET(request) {
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const source = url.searchParams.get("source") || "boamp";
  const query = url.searchParams.get("q") || "intelligence artificielle";
  const limit = Number(url.searchParams.get("limit") || 10);

  try {
    if (source === "boamp") {
      return Response.json(await searchBoamp({ query, limit }));
    }

    if (source === "ted") {
      return Response.json(await searchTed({ query, limit }));
    }

    return Response.json(
      { error: "Unsupported source", supported: ["boamp", "ted"] },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Collector failure" },
      { status: 502 }
    );
  }
}
