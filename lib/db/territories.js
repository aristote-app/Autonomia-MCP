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

  async function countRows(applyFilters = (query) => query) {
    let query = client
      .from("territory_priority_v1")
      .select("id", { count: "exact", head: true })
      .eq("active", true);
    query = applyFilters(query);
    const { count, error } = await query;
    if (error) throw error;
    return Number(count || 0);
  }

  const [
    total,
    communitiesOfCommunes,
    communitiesOfAgglomeration,
    withSignal,
    p1,
    p2,
    p3,
    p4
  ] = await Promise.all([
    countRows(),
    countRows((query) => query.eq("territory_type", "CC")),
    countRows((query) => query.eq("territory_type", "CA")),
    countRows((query) => query.gt("signal_count", 0)),
    countRows((query) => query.eq("priority_band", "P1")),
    countRows((query) => query.eq("priority_band", "P2")),
    countRows((query) => query.eq("priority_band", "P3")),
    countRows((query) => query.eq("priority_band", "P4"))
  ]);

  return {
    total,
    communitiesOfCommunes,
    communitiesOfAgglomeration,
    withSignal,
    withoutSignal: Math.max(total - withSignal, 0),
    p1,
    p2,
    p3,
    p4
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
  const end = start + pageLimit - 1;

  let request = client
    .from("territory_priority_v1")
    .select("*", { count: "exact" })
    .eq("active", true);

  if (["CC", "CA"].includes(type)) request = request.eq("territory_type", type);
  if (signal === "with") request = request.gt("signal_count", 0);
  if (signal === "without") request = request.eq("signal_count", 0);
  if (["P1", "P2", "P3", "P4"].includes(priority)) request = request.eq("priority_band", priority);

  const search = query
    ? String(query).trim().replace(/[(),]/g, " ").replace(/\s+/g, " ").trim()
    : "";

  if (search) {
    const digits = search.replace(/\D/g, "");
    const filters = [
      `name.ilike.%${search}%`,
      `department_code.ilike.${search}%`,
      `city.ilike.%${search}%`
    ];
    if (digits) filters.push(`siren.ilike.%${digits}%`);
    request = request.or(filters.join(","));
  }

  const { data, count, error } = await request
    .order("commercial_score", { ascending: false })
    .order("signal_count", { ascending: false })
    .order("population_total", { ascending: false, nullsFirst: false })
    .order("name", { ascending: true })
    .range(start, end);

  if (error) throw error;

  return {
    items: data || [],
    count: Number(count || 0),
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

  const { data: territory, error: territoryError } = await client
    .from("territories")
    .select("id")
    .eq("siren", siren)
    .eq("active", true)
    .maybeSingle();

  if (territoryError) throw territoryError;
  if (!territory?.id) return [];

  const { data, error } = await client
    .from("territory_signals")
    .select("signal_type,signal_source,title,evidence_url,detected_at,importance")
    .eq("territory_id", territory.id)
    .order("detected_at", { ascending: false })
    .order("importance", { ascending: false });

  if (error) throw error;
  return data || [];
}


export async function getActiveTerritoriesBySirens(values = []) {
  const client = requireDb();
  const sirens = [...new Set(values.map(normalizeSiren).filter(Boolean))];

  if (!sirens.length) return new Map();

  const { data, error } = await client
    .from("territories")
    .select("id,siren,name,territory_type")
    .eq("active", true)
    .in("siren", sirens);

  if (error) throw error;

  return new Map((data || []).map((row) => [row.siren, row]));
}

export async function insertTerritorySignals(items = []) {
  const client = requireDb();
  let inserted = 0;
  let duplicates = 0;

  for (const item of items) {
    const row = {
      territory_id: item.territoryId,
      signal_type: item.signalType,
      signal_source: item.signalSource,
      title: item.title,
      evidence_url: item.evidenceUrl || null,
      detected_at: item.detectedAt || new Date().toISOString(),
      importance: Math.min(Math.max(Number(item.importance) || 1, 1), 5),
      payload: item.payload || {}
    };

    const { error } = await client.from("territory_signals").insert(row);

    if (error?.code === "23505") {
      duplicates += 1;
      continue;
    }

    if (error) throw error;
    inserted += 1;
  }

  return {
    inserted,
    duplicates,
    total: items.length
  };
}


export async function listRecentTerritorySignals({
  days = 180,
  limit = 250
} = {}) {
  const client = requireDb();
  const safeDays = Math.min(Math.max(Number(days) || 180, 1), 730);
  const safeLimit = clampLimit(limit, 500);
  const since = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from("territory_signals")
    .select(
      "id,signal_type,signal_source,title,evidence_url,detected_at,importance,payload,territories!inner(id,siren,name,territory_type,active)"
    )
    .gte("detected_at", since)
    .eq("territories.active", true)
    .order("detected_at", { ascending: false })
    .order("importance", { ascending: false })
    .limit(safeLimit);

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    signal_type: row.signal_type,
    signal_source: row.signal_source,
    title: row.title,
    evidence_url: row.evidence_url,
    detected_at: row.detected_at,
    importance: Number(row.importance) || 1,
    payload: row.payload || {},
    territory_id: row.territories?.id || null,
    territory_siren: row.territories?.siren || null,
    territory_name: row.territories?.name || null,
    territory_type: row.territories?.territory_type || null
  }));
}
