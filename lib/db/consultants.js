import { getAutonomiaServerClient } from "./supabase.js";

export async function listConsultantsWithSkills({
  status = "active",
  limit = 300
} = {}) {
  const client = getAutonomiaServerClient();

  let query = client
    .from("consultants")
    .select(
      "id,external_ref,display_name,status,available_from,tjm,currency,remote,locations,years_experience,notes,metadata,updated_at,consultant_skills(proficiency,years_experience,evidence,skills(id,name,category))"
    )
    .order("available_from", { ascending: true, nullsFirst: false })
    .order("display_name", { ascending: true })
    .limit(Math.min(Math.max(Number(limit) || 300, 1), 500));

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((consultant) => ({
    ...consultant,
    skills: (consultant.consultant_skills || [])
      .map((row) => row.skills?.name)
      .filter(Boolean),
    skill_details: (consultant.consultant_skills || []).map((row) => ({
      name: row.skills?.name || null,
      category: row.skills?.category || null,
      proficiency: row.proficiency,
      years_experience: row.years_experience,
      evidence: row.evidence
    })).filter((row) => row.name)
  }));
}

export async function getConsultantPoolSummary() {
  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("consultants")
    .select("id,status,available_from,remote,tjm");

  if (error) throw error;
  const rows = data || [];
  const today = new Date().toISOString().slice(0, 10);

  return {
    total: rows.length,
    active: rows.filter((row) => row.status === "active").length,
    available_now: rows.filter((row) =>
      row.status === "active" &&
      row.available_from &&
      String(row.available_from).slice(0, 10) <= today
    ).length,
    remote: rows.filter((row) => row.status === "active" && row.remote).length,
    tjm_known: rows.filter((row) => row.tjm != null).length
  };
}
