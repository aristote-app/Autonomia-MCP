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
    .select("id,opco_code,opco_name,idcc,company_size_min,company_size_max,scheme,annual_ceiling,hourly_ceiling,day_ceiling,notes,source_url,valid_from,valid_to,verified_at")
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
