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


function skillSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function upsertSkillRows(client, names = []) {
  const rows = [...new Set((names || []).map((name) => String(name || "").trim()).filter(Boolean))]
    .map((name) => ({
      slug: skillSlug(name),
      name,
      category: null,
      aliases: []
    }))
    .filter((row) => row.slug);

  if (!rows.length) return [];

  const { data, error } = await client
    .from("skills")
    .upsert(rows, { onConflict: "slug" })
    .select("id,slug,name");

  if (error) throw error;
  return data || [];
}

export async function bulkUpsertConsultants(rows = [], { actorUserId = null } = {}) {
  const client = getAutonomiaServerClient();
  const imported = [];
  let skillLinks = 0;

  for (const row of rows || []) {
    const externalRef = String(row.external_ref || "").trim();
    const displayName = String(row.display_name || "").trim();
    if (!externalRef || !displayName) continue;

    const payload = {
      external_ref: externalRef,
      display_name: displayName,
      status: row.status || "active",
      available_from: row.available_from || null,
      tjm: row.tjm ?? null,
      currency: row.currency || "EUR",
      remote: Boolean(row.remote),
      locations: Array.isArray(row.locations) ? row.locations : [],
      years_experience: row.years_experience ?? null,
      notes: row.notes || null,
      metadata: {
        import_source: "cockpit_text_import",
        imported_at: new Date().toISOString(),
        ...(actorUserId ? { imported_by: actorUserId } : {})
      },
      updated_at: new Date().toISOString()
    };

    const existing = await client
      .from("consultants")
      .select("id")
      .eq("external_ref", externalRef)
      .maybeSingle();

    if (existing.error) throw existing.error;

    let consultant;
    if (existing.data?.id) {
      const updated = await client
        .from("consultants")
        .update(payload)
        .eq("id", existing.data.id)
        .select("id,external_ref,display_name")
        .single();
      if (updated.error) throw updated.error;
      consultant = updated.data;
    } else {
      const inserted = await client
        .from("consultants")
        .insert(payload)
        .select("id,external_ref,display_name")
        .single();
      if (inserted.error) throw inserted.error;
      consultant = inserted.data;
    }

    const skills = await upsertSkillRows(client, row.skills || []);
    if (skills.length) {
      const links = skills.map((skill) => ({
        consultant_id: consultant.id,
        skill_id: skill.id,
        updated_at: new Date().toISOString()
      }));
      const linked = await client
        .from("consultant_skills")
        .upsert(links, { onConflict: "consultant_id,skill_id" });
      if (linked.error) throw linked.error;
      skillLinks += links.length;
    }

    imported.push(consultant);
  }

  return {
    imported: imported.length,
    skill_links: skillLinks,
    consultants: imported
  };
}
