import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let deployedSha = null;
  try {
    deployedSha = (await readFile(join(process.cwd(), ".runtime", "deployed-sha"), "utf8")).trim() || null;
  } catch {}

  return Response.json({
    ok: true,
    service: "autonomia-public-site",
    deployedSha,
    timestamp: new Date().toISOString()
  }, {
    headers: { "cache-control": "no-store, no-cache, must-revalidate" }
  });
}
