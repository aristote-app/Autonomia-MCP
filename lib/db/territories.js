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

  const [total, cc, ca, withSignal, withoutSignal] = await Promise.all([
    client.from("territory_acquisition_v1").select("id", { count: "exact", head: true }).eq("active", true),
    client.from("territory_acquisition_v1").select("id", { count: "exact", head: true }).eq("active", true).eq("territory_type", "CC"),
    client.from("territory_acquisition_v1").select("id", { count: "exact", head: true }).eq("active", true).eq("territory_type", "CA"),
    client.from("territory_acquisition_v1").select("id", { count: "exact", head: true }).eq("active", true).eq("has_signal", true),
    client.from("territory_acquisition_v1").select("id", { count: "exact", head: true }).eq("active", true).eq("has_signal", false)
  ]);

  const error = [total.error, cc.error, ca.error, withSignal.error, withoutSignal.error].find(Boolean);
  if (error) throw error;

  return {
    total: total.count || 0,
    communitiesOfCommunes: cc.count || 0,
    communitiesOfAgglomeration: ca.count || 0,
    withSignal: withSignal.count || 0,
    withoutSignal: withoutSignal.count || 0
  };
}

export async function searchTerritories({
  type = null,
  signal = null,
  query = null,
  limit = 100,
  offset = 0
} = {}) {
  const client = requireDb();
  const pageLimit = clampLimit(limit);
  const start = Math.max(Number(offset) || 0, 0);

  let request = client
    .from("territory_acquisition_v1")
    .select(
      "id,siren,name,territory_type,department_code,seat_commune,population_total,member_count,president_title,president_last_name,president_first_name,city,email,phone,website,banatic_url,signal_count,last_signal_at,has_signal,active",
      { count: "exact" }
    )
    .eq("active", true)
    .order("has_signal", { ascending: false })
    .order("population_total", { ascending: false, nullsFirst: false })
    .range(start, start + pageLimit - 1);

  if (["CC", "CA"].includes(type)) request = request.eq("territory_type", type);
  if (signal === "with") request = request.eq("has_signal", true);
  if (signal === "without") request = request.eq("has_signal", false);
  if (query) request = request.ilike("name", `%${String(query).trim()}%`);

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    items: data || [],
    count: count || 0,
    limit: pageLimit,
    offset: start
  };
}
