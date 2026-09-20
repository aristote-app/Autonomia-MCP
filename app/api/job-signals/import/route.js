import { requireInternalToken } from "../../../../lib/security.js";
import { upsertJobSignals } from "../../../../lib/db/jobSignals.js";

const ALLOWED_SOURCES = new Set(["linkedin", "indeed"]);

export async function POST(request) {
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;

  let body = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const invalid = items.filter((item) => !ALLOWED_SOURCES.has(item?.sourceId));

  if (invalid.length) {
    return Response.json(
      {
        error: "Unsupported source",
        supported: [...ALLOWED_SOURCES]
      },
      { status: 400 }
    );
  }

  try {
    return Response.json(await upsertJobSignals(items));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Job signal import failed" },
      { status: 500 }
    );
  }
}
