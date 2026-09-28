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

export async function listAcademyFundingRules({ opcoCode, idcc, limit = 50 } = {}) {
  const db = getAutonomiaServerClient();
  let query = db
    .from("academy_funding_rules")
    .select("id,opco_code,idcc,branch_label,company_size_min,company_size_max,scheme,training_category,annual_ceiling,hourly_ceiling,day_ceiling,coverage_percent,notes,source_url,source_title,valid_from,valid_to,verified_at,evidence_status")
    .order("verified_at", { ascending: false })
    .limit(limit);

  if (opcoCode) query = query.eq("opco_code", opcoCode);
  if (idcc) query = query.or(`idcc.eq.${idcc},idcc.is.null`);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
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
  const [opcos, sources, rules, siro, runs] = await Promise.all([
    db.from("academy_opcos").select("code", { count: "exact", head: true }),
    db.from("academy_funding_sources").select("id", { count: "exact", head: true }).eq("active", true),
    db.from("academy_funding_rules").select("id", { count: "exact", head: true }).eq("year", 2026),
    db.from("academy_siro").select("siret", { count: "exact", head: true }),
    db.from("academy_sync_runs")
      .select("id,status,file_name,source_updated_at,rows_seen,rows_upserted,started_at,finished_at,error_message")
      .eq("source", "SIRO")
      .order("started_at", { ascending: false })
      .limit(1)
  ]);

  for (const result of [opcos, sources, rules, siro, runs]) {
    if (result.error) throw result.error;
  }

  return {
    opcos: opcos.count || 0,
    fundingSources: sources.count || 0,
    fundingRules: rules.count || 0,
    siroRows: siro.count || 0,
    latestSiroRun: runs.data?.[0] || null
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
