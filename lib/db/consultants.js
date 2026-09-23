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


export async function listConsultantCandidates({ limit = 100 } = {}) {
  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("consultants")
    .select(
      "id,external_ref,display_name,status,available_from,tjm,currency,remote,locations,years_experience,notes,metadata,created_at,updated_at,consultant_skills(proficiency,years_experience,evidence,skills(id,name,category))"
    )
    .eq("status", "candidate")
    .order("updated_at", { ascending: false })
    .limit(Math.min(Math.max(Number(limit) || 100, 1), 250));

  if (error) throw error;

  return (data || []).map((consultant) => ({
    ...consultant,
    skills: (consultant.consultant_skills || [])
      .map((row) => row.skills?.name)
      .filter(Boolean)
  }));
}

export async function getConsultantDiscoverySummary() {
  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("consultants")
    .select("status,metadata");

  if (error) throw error;
  const rows = data || [];

  return {
    candidates: rows.filter((row) => row.status === "candidate").length,
    rejected: rows.filter((row) => row.status === "rejected").length,
    malt: rows.filter((row) => row.metadata?.source_platform === "malt").length,
    freelance_com: rows.filter((row) => row.metadata?.source_platform === "freelance_com").length,
    linkedin: rows.filter((row) => row.metadata?.source_platform === "linkedin").length
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


function discoveredExternalRef(candidate = {}) {
  const platform = String(candidate.source_platform || "web").trim().toLowerCase();
  const profileUrl = String(candidate.profile_url || "").trim().toLowerCase().replace(/\/$/, "");
  if (!profileUrl) return null;

  const encoded = Buffer.from(profileUrl, "utf8")
    .toString("base64url")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 120);

  return "talent:" + platform + ":" + encoded;
}

export async function upsertDiscoveredConsultantCandidates(
  candidates = [],
  { actorUserId = null } = {}
) {
  const client = getAutonomiaServerClient();
  let created = 0;
  let updated = 0;
  let activePreserved = 0;
  let skillLinks = 0;
  const saved = [];

  for (const candidate of candidates || []) {
    const externalRef = discoveredExternalRef(candidate);
    const displayName = String(candidate.display_name || "").trim();
    if (!externalRef || !displayName || !candidate.profile_url) continue;

    const existing = await client
      .from("consultants")
      .select("id,external_ref,display_name,status,tjm,currency,remote,locations,years_experience,notes,metadata")
      .eq("external_ref", externalRef)
      .maybeSingle();

    if (existing.error) throw existing.error;

    const now = new Date().toISOString();
    const existingRow = existing.data || null;
    const discoveryMetadata = {
      ...(existingRow?.metadata || {}),
      discovery_source: "talent_hunter_v1",
      source_platform: candidate.source_platform || null,
      source_label: candidate.source_label || null,
      profile_url: candidate.profile_url,
      headline: candidate.headline || null,
      snippet: candidate.snippet || null,
      relevance_score: Number(candidate.relevance_score) || 0,
      evidence_kind: candidate.evidence_kind || "public_professional_profile_candidate",
      search_query: candidate.search_query || null,
      search_age: candidate.search_age || null,
      discovered_skills: candidate.skills || [],
      last_discovered_at: now,
      ...(actorUserId ? { last_discovered_by: actorUserId } : {})
    };

    const payload = {
      display_name: existingRow?.status === "active" ? existingRow.display_name : displayName,
      status: existingRow?.status === "active" ? "active" : "candidate",
      tjm: candidate.tjm ?? existingRow?.tjm ?? null,
      currency: candidate.currency || existingRow?.currency || "EUR",
      remote: Boolean(candidate.remote || existingRow?.remote),
      locations:
        Array.isArray(candidate.locations) && candidate.locations.length
          ? candidate.locations
          : existingRow?.locations || [],
      years_experience: existingRow?.years_experience ?? null,
      notes: existingRow?.notes || candidate.headline || null,
      metadata: discoveryMetadata,
      updated_at: now
    };

    let consultant;
    if (existingRow?.id) {
      const result = await client
        .from("consultants")
        .update(payload)
        .eq("id", existingRow.id)
        .select("id,external_ref,display_name,status")
        .single();
      if (result.error) throw result.error;
      consultant = result.data;
      updated += 1;
      if (existingRow.status === "active") activePreserved += 1;
    } else {
      const result = await client
        .from("consultants")
        .insert({
          external_ref: externalRef,
          ...payload,
          metadata: {
            ...discoveryMetadata,
            first_discovered_at: now
          }
        })
        .select("id,external_ref,display_name,status")
        .single();
      if (result.error) throw result.error;
      consultant = result.data;
      created += 1;
    }

    const skills = await upsertSkillRows(client, candidate.skills || []);
    if (skills.length) {
      const links = skills.map((skill) => ({
        consultant_id: consultant.id,
        skill_id: skill.id,
        evidence: {
          kind: "public_profile_index_result",
          profile_url: candidate.profile_url,
          source_platform: candidate.source_platform || null
        },
        updated_at: now
      }));
      const linked = await client
        .from("consultant_skills")
        .upsert(links, { onConflict: "consultant_id,skill_id" });
      if (linked.error) throw linked.error;
      skillLinks += links.length;
    }

    saved.push(consultant);
  }

  return {
    created,
    updated,
    active_preserved: activePreserved,
    skill_links: skillLinks,
    saved
  };
}

export async function setConsultantCandidateStatus({
  consultantId,
  status,
  actorUserId = null
} = {}) {
  if (!consultantId || !["active", "rejected"].includes(status)) {
    throw new Error("Valid consultant candidate status is required");
  }

  const client = getAutonomiaServerClient();
  const existing = await client
    .from("consultants")
    .select("id,status,metadata")
    .eq("id", consultantId)
    .single();

  if (existing.error) throw existing.error;
  if (existing.data.status !== "candidate") {
    throw new Error("Only candidate consultants can be reviewed");
  }

  const now = new Date().toISOString();
  const metadata = {
    ...(existing.data.metadata || {}),
    review_status: status,
    reviewed_at: now,
    ...(actorUserId ? { reviewed_by: actorUserId } : {})
  };

  const result = await client
    .from("consultants")
    .update({
      status,
      metadata,
      updated_at: now
    })
    .eq("id", consultantId)
    .eq("status", "candidate")
    .select("id,display_name,status,metadata")
    .single();

  if (result.error) throw result.error;
  return result.data;
}
