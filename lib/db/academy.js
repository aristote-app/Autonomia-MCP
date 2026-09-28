import { getAutonomiaServerClient } from "./supabase.js";

function normalizeSiret(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 14);
}

export async function lookupAcademyCompanyBySiret(siret) {
  const normalized = normalizeSiret(siret);
  if (normalized.length !== 14) return null;

  const db = getAutonomiaServerClient();
  const { data, error } = await db
    .from("academy_siro")
    .select("siret,siren,opco_code,opco_name,idcc,source_updated_at")
    .eq("siret", normalized)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function lookupAcademyCompaniesBySiren(siren, { limit = 20 } = {}) {
  const normalized = String(siren || "").replace(/\D/g, "").slice(0, 9);
  if (normalized.length !== 9) return [];

  const db = getAutonomiaServerClient();
  const { data, error } = await db
    .from("academy_siro")
    .select("siret,siren,opco_code,opco_name,idcc,source_updated_at")
    .eq("siren", normalized)
    .limit(limit);

  if (error) throw error;
  return data || [];
}
export async function lookupAcademyOpcoByIdcc(idcc) {
  const normalized = String(idcc || "").replace(/\D/g, "").padStart(4, "0");
  if (!normalized || normalized === "0000") return null;

  const db = getAutonomiaServerClient();
  const { data, error } = await db
    .from("academy_siro")
    .select("opco_code,opco_name,idcc")
    .eq("idcc", normalized)
    .not("opco_code", "is", null)
    .limit(25);

  if (error) throw error;

  const rows = data || [];
  if (!rows.length) return null;

  const counts = new Map();
  for (const row of rows) {
    const key = String(row.opco_code || "").trim();
    if (!key) continue;
    const current = counts.get(key) || { count: 0, row };
    current.count += 1;
    counts.set(key, current);
  }

  const best = [...counts.values()].sort((a, b) => b.count - a.count)[0]?.row || rows[0];
  return {
    opco_code: best.opco_code || null,
    opco_name: best.opco_name || best.opco_code || null,
    idcc: normalized
  };
}

export async function listAcademyFundingRules({ opcoCode, idcc, limit = 50 } = {}) {
  const db = getAutonomiaServerClient();
  let query = db
    .from("academy_funding_rules")
    .select("id,opco_code,idcc,branch_label,branch_code,company_size_min,company_size_max,scheme,training_category,annual_ceiling,hourly_ceiling,day_ceiling,coverage_percent,notes,source_url,source_title,valid_from,valid_to,verified_at,evidence_status")
    .order("verified_at", { ascending: false })
    .limit(limit);

  if (opcoCode) query = query.eq("opco_code", opcoCode);

  const { data, error } = await query;
  if (error) throw error;

  const rows = data || [];
  if (!idcc) return rows.filter((row) => !row.idcc && !row.branch_code);

  const exact = rows.filter((row) => String(row.idcc || "") === String(idcc));
  if (exact.length) return exact;

  return rows.filter((row) => !row.idcc && !row.branch_code);
}

export async function listAcademyCourses({ limit = 100 } = {}) {
  const db = getAutonomiaServerClient();
  const { data, error } = await db
    .from("academy_courses")
    .select("id,title,slug,family,duration_hours,duration_days,price_intra_day,price_inter_day,active")
    .eq("active", true)
    .order("family", { ascending: true })
    .order("title", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export function cleanSiret(value) {
  return normalizeSiret(value);
}


export async function getAcademySummary() {
  const db = getAutonomiaServerClient();
  const [opcos, sources, rules, runs] = await Promise.all([
    db.from("academy_opcos").select("code", { count: "exact", head: true }),
    db.from("academy_funding_sources").select("id", { count: "exact", head: true }).eq("active", true),
    db.from("academy_funding_rules").select("id", { count: "exact", head: true }).eq("year", 2026),
    db.from("academy_sync_runs")
      .select("id,status,file_name,source_updated_at,rows_seen,rows_upserted,started_at,finished_at,error_message")
      .eq("source", "SIRO")
      .order("started_at", { ascending: false })
      .limit(20)
  ]);

  for (const result of [opcos, sources, rules, runs]) {
    if (result.error) throw result.error;
  }

  const runRows = runs.data || [];
  const siroRows = runRows.reduce(
    (max, run) => Math.max(max, Number(run.rows_upserted) || 0),
    0
  );

  const preferredRun =
    runRows.find((run) => run.status === "running") ||
    runRows.find((run) => run.status === "completed") ||
    runRows[0] ||
    null;

  return {
    opcos: opcos.count || 0,
    fundingSources: sources.count || 0,
    fundingRules: rules.count || 0,
    siroRows,
    latestSiroRun: preferredRun
  };
}

export async function listAcademyOpcoCoverage() {
  const db = getAutonomiaServerClient();
  const [{ data: opcos, error: opcoError }, { data: sources, error: sourceError }, { data: rules, error: ruleError }] =
    await Promise.all([
      db.from("academy_opcos")
        .select("code,name,short_name,website_url,financing_url,verified_at")
        .eq("active", true)
        .order("short_name"),
      db.from("academy_funding_sources")
        .select("id,opco_code,title,source_url,source_type,scope,checked_at")
        .eq("year", 2026)
        .eq("active", true)
        .order("opco_code"),
      db.from("academy_funding_rules")
        .select("id,opco_code,evidence_status")
        .eq("year", 2026)
    ]);

  if (opcoError) throw opcoError;
  if (sourceError) throw sourceError;
  if (ruleError) throw ruleError;

  return (opcos || []).map((opco) => {
    const opcoSources = (sources || []).filter((item) => item.opco_code === opco.code);
    const opcoRules = (rules || []).filter((item) => item.opco_code === opco.code);
    return {
      ...opco,
      funding_sources: opcoSources,
      funding_source_count: opcoSources.length,
      verified_rule_count: opcoRules.filter((item) => item.evidence_status === "verified").length,
      rule_count: opcoRules.length
    };
  });
}
