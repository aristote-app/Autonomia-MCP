import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

function requireDb() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function clampLimit(value, max = 250) {
  return Math.min(Math.max(Number(value) || 100, 1), max);
}

function normalizeSiren(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return /^\d{9}$/.test(digits) ? digits : null;
}

export async function upsertTerritories(items = [], { sourceUpdatedAt = null } = {}) {
  const client = requireDb();
  const now = new Date().toISOString();

  const rows = items
    .filter((item) => item?.siren && item?.name && ["CC", "CA"].includes(item?.territoryType))
    .map((item) => ({
      siren: String(item.siren).replace(/\D/g, "").padStart(9, "0"),
      name: String(item.name).trim(),
      territory_type: item.territoryType,
      department_code: item.departmentCode || null,
      arrondissement: item.arrondissement || null,
      seat_commune: item.seatCommune || null,
      population_total: item.populationTotal ?? null,
      member_count: item.memberCount ?? null,
      president_title: item.presidentTitle || null,
      president_last_name: item.presidentLastName || null,
      president_first_name: item.presidentFirstName || null,
      address_line1: item.addressLine1 || null,
      address_line2: item.addressLine2 || null,
      postal_code: item.postalCode || null,
      city: item.city || null,
      phone: item.phone || null,
      email: item.email || null,
      website: item.website || null,
      banatic_url:
        item.banaticUrl ||
        `https://www.banatic.interieur.gouv.fr/intercommunalite/${String(item.siren).replace(/\D/g, "")}`,
      source_updated_at: sourceUpdatedAt || item.sourceUpdatedAt || null,
      last_seen_at: now,
      active: true,
      source_payload: item.sourcePayload || {},
      updated_at: now
    }))
    .filter((row) => /^\d{9}$/.test(row.siren));

  if (!rows.length) return { persisted: true, count: 0, items: [] };

  const { data, error } = await client
    .from("territories")
    .upsert(rows, { onConflict: "siren" })
    .select("id,siren,name,territory_type");

  if (error) throw error;

  return { persisted: true, count: data?.length || 0, items: data || [] };
}

export async function finalizeTerritorySync(startedAt) {
  const client = requireDb();
  if (!startedAt) throw new Error("startedAt is required");

  const { error } = await client
    .from("territories")
    .update({ active: false, updated_at: new Date().toISOString() })
    .lt("last_seen_at", startedAt)
    .eq("active", true);

  if (error) throw error;

  const { count, error: countError } = await client
    .from("territories")
    .select("id", { count: "exact", head: true })
    .eq("active", true);

  if (countError) throw countError;
  return { activeTerritories: count || 0 };
}

export async function getTerritorySummary() {
  const client = requireDb();
  const { data, error } = await client.rpc("territory_summary_v2");

  if (error) {
    throw new Error(`territory_summary_v2 failed: ${error.code || "unknown"} ${error.message || ""} ${error.details || ""}`.trim());
  }

  const row = Array.isArray(data) ? data[0] : data;

  return {
    total: Number(row?.total || 0),
    communitiesOfCommunes: Number(row?.communities_of_communes || 0),
    communitiesOfAgglomeration: Number(row?.communities_of_agglomeration || 0),
    withSignal: Number(row?.with_signal || 0),
    withoutSignal: Number(row?.without_signal || 0),
    p1: Number(row?.p1 || 0),
    p2: Number(row?.p2 || 0),
    p3: Number(row?.p3 || 0),
    p4: Number(row?.p4 || 0)
  };
}

export async function searchTerritories({
  type = null,
  signal = null,
  priority = null,
  query = null,
  limit = 100,
  offset = 0
} = {}) {
  const client = requireDb();
  const pageLimit = clampLimit(limit);
  const start = Math.max(Number(offset) || 0, 0);

  const { data, error } = await client.rpc("territory_search_v2", {
    p_type: ["CC", "CA"].includes(type) ? type : null,
    p_signal: ["with", "without"].includes(signal) ? signal : null,
    p_priority: ["P1", "P2", "P3", "P4"].includes(priority) ? priority : null,
    p_query: query ? String(query).trim() : null,
    p_limit: pageLimit,
    p_offset: start
  });

  if (error) {
    throw new Error(`territory_search_v2 failed: ${error.code || "unknown"} ${error.message || ""} ${error.details || ""}`.trim());
  }

  const rows = Array.isArray(data) ? data : [];
  const count = rows.length ? Number(rows[0]?.total_count || 0) : 0;

  return {
    items: rows.map(({ total_count, ...row }) => row),
    count,
    limit: pageLimit,
    offset: start
  };
}

export async function getTerritoryBySiren(value) {
  const client = requireDb();
  const siren = normalizeSiren(value);
  if (!siren) return null;

  const { data, error } = await client
    .from("territory_priority_v1")
    .select("*")
    .eq("siren", siren)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function getTerritorySignalFeed(value) {
  const client = requireDb();
  const siren = normalizeSiren(value);
  if (!siren) return [];

  const { data, error } = await client.rpc("territory_signal_feed_v1", {
    p_siren: siren
  });

  if (error) {
    throw new Error(`territory_signal_feed_v1 failed: ${error.code || "unknown"} ${error.message || ""} ${error.details || ""}`.trim());
  }

  return Array.isArray(data) ? data : [];
}
