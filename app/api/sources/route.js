import { SOURCES } from "../../../lib/sources.js";

export async function GET() {
  return Response.json({
    count: SOURCES.length,
    sources: SOURCES
  });
}
