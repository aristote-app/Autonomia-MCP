import { isAuthorizedMarketRefreshRequest } from "../../../../lib/security/marketRefreshAuth.js";
import { upsertTerritories, finalizeTerritorySync } from "../../../../lib/db/territories.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request) {
  if (!(await isAuthorizedMarketRefreshRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    if (body?.action === "finalize") {
      const result = await finalizeTerritorySync(body.startedAt);
      return Response.json({ ok: true, action: "finalize", ...result });
    }

    const items = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) {
      return Response.json({ error: "items is required" }, { status: 400 });
    }

    const invalidTypes = items.filter((item) => !["CC", "CA"].includes(item?.territoryType));
    if (invalidTypes.length) {
      return Response.json(
        { error: "Only CC and CA territories are accepted" },
        { status: 400 }
      );
    }

    const result = await upsertTerritories(items, {
      sourceUpdatedAt: body?.sourceUpdatedAt || null
    });

    return Response.json({ ok: true, action: "upsert", ...result });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Territory import failed" },
      { status: 500 }
    );
  }
}
