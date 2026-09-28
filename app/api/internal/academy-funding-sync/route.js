import { getAutonomiaServerClient } from "../../../../lib/db/supabase.js";
import { verifyGitHubDeploymentToken } from "../../../../lib/deploy/githubOidc.js";
import {
  ACADEMY_FUNDING_SOURCES_2026,
  ACADEMY_FUNDING_RULES_2026
} from "../../../../lib/academy/funding2026.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+/i.test(authorization)) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const oidc = await verifyGitHubDeploymentToken(token);
    if (oidc.ok) return { ok: true };
    return { ok: false, response: Response.json({ error: "Unauthorized", reason: oidc.reason }, { status: 401 }) };
  } catch (error) {
    return {
      ok: false,
      response: Response.json(
        { error: "OIDC verification failed", reason: error?.message || String(error) },
        { status: 401 }
      )
    };
  }
}

function identity(rule) {
  return [
    rule.opco_code,
    rule.year,
    rule.idcc || "",
    rule.branch_code || "",
    rule.company_size_min ?? "",
    rule.company_size_max ?? "",
    rule.scheme || "",
    rule.source_url || ""
  ].join("|");
}

export async function GET(request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  try {
    const db = getAutonomiaServerClient();
    const checkedAt = new Date().toISOString();

    const sourceRows = ACADEMY_FUNDING_SOURCES_2026.map((source) => ({
      ...source,
      checked_at: checkedAt,
      active: true
    }));

    const { error: sourceError } = await db
      .from("academy_funding_sources")
      .upsert(sourceRows, { onConflict: "opco_code,year,source_url", ignoreDuplicates: false });
    if (sourceError) throw sourceError;

    const { data: existing, error: existingError } = await db
      .from("academy_funding_rules")
      .select("id,opco_code,year,idcc,branch_code,company_size_min,company_size_max,scheme,source_url")
      .eq("year", 2026);
    if (existingError) throw existingError;

    const existingByKey = new Map((existing || []).map((row) => [identity(row), row]));
    let inserted = 0;
    let updated = 0;

    for (const rule of ACADEMY_FUNDING_RULES_2026) {
      const current = existingByKey.get(identity(rule));
      if (current?.id) {
        const { error } = await db.from("academy_funding_rules").update(rule).eq("id", current.id);
        if (error) throw error;
        updated += 1;
      } else {
        const { error } = await db.from("academy_funding_rules").insert(rule);
        if (error) throw error;
        inserted += 1;
      }
    }

    return Response.json({
      ok: true,
      year: 2026,
      funding_sources: sourceRows.length,
      verified_rules: ACADEMY_FUNDING_RULES_2026.length,
      inserted,
      updated
    }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json(
      { ok: false, error: error?.message || String(error) },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
