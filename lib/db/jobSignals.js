import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function clampLimit(limit, max = 500) {
  return Math.min(Math.max(Number(limit) || 20, 1), max);
}

const CANONICAL_SOURCE_IDS = Object.freeze({
  linkedin_post: "linkedin",
  linkedin_training: "linkedin",
  linkedin_training_post: "linkedin",
  indeed_training: "indeed",
  francetravail: "france_travail_jobs",
  francetravail_web: "france_travail_jobs",
  francetravail_training_web: "france_travail_jobs"
});

function canonicalSourceId(sourceId) {
  return CANONICAL_SOURCE_IDS[sourceId] || sourceId;
}

const SOURCE_BOOTSTRAP = Object.freeze({
  freelancerepublik: {
    id: "freelancerepublik",
    name: "FreelanceRepublik",
    source_group: "freelance",
    priority: "P1",
    access_mode: "public_web_index",
    status: "active",
    base_url: "https://www.freelancerepublik.com/",
    notes: "Discovered through public web indexing; source URLs remain clickable."
  },
  emploi_territorial: {
    id: "emploi_territorial",
    name: "Emploi Territorial",
    source_group: "public",
    priority: "P0",
    access_mode: "public_web_index",
    status: "active",
    base_url: "https://www.emploi-territorial.fr/",
    notes: "Collectivity hiring demand discovered through public indexed offer pages."
  }
});

async function ensureSignalSources(client, sourceIds = []) {
  const wanted = [...new Set(sourceIds)].filter((id) => SOURCE_BOOTSTRAP[id]);
  if (!wanted.length) return;

  const { data, error } = await client
    .from("sources")
    .select("id")
    .in("id", wanted);

  if (error) throw error;

  const existing = new Set((data || []).map((row) => row.id));
  const missing = wanted
    .filter((id) => !existing.has(id))
    .map((id) => SOURCE_BOOTSTRAP[id]);

  if (!missing.length) return;

  const inserted = await client.from("sources").insert(missing);
  if (inserted.error) throw inserted.error;
}

export async function searchJobSignals({
  sources = ["linkedin", "indeed"],
  contractType,
  freelanceOnly = false,
  signalKey,
  franceOnly = true,
  limit = 20
} = {}) {
  const client = requireDatabase();
  let request = client
    .from("content_job_signals")
    .select(
      "id,source_id,source_record_id,title,company_name,location,contract_type,source_url,published_at,source_updated_at,roles,skills,tools,use_cases,signal_keys,keyword_seeds,first_seen_at,last_seen_at"
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("last_seen_at", { ascending: false })
    .limit(clampLimit(franceOnly ? limit * 3 : limit));

  if (Array.isArray(sources) && sources.length) {
    request = request.in("source_id", sources);
  }

  if (contractType) {
    request = request.ilike("contract_type", `%${contractType}%`);
  }

  if (freelanceOnly) {
    request = request.contains("signal_keys", ["freelance"]);
  }

  if (signalKey) {
    request = request.contains("signal_keys", [signalKey]);
  }

  const { data, error } = await request;
  if (error) throw error;

  let items = data || [];

  if (franceOnly) {
    items = items.filter((item) => {
      const source = String(item.source_id || "").toLowerCase();
      const url = String(item.source_url || "");
      const location = String(item.location || "");

      if (source === "linkedin") {
        return (
          /https?:\/\/fr\.linkedin\.com\/jobs\/view/i.test(url) ||
          /https?:\/\/(?:www\.)?linkedin\.com\/posts\//i.test(url) ||
          /https?:\/\/fr\.linkedin\.com\/posts\//i.test(url)
        );
      }

      if (source === "indeed") {
        return /https?:\/\/fr\.indeed\.com\/viewjob/i.test(url);
      }

      if (source === "francetravail" || source === "france_travail_jobs") return true;
      if (source === "freelancerepublik") return true;
      if (source === "lehibou") return true;
      if (source === "emploi_territorial") return true;
      if (source.includes("linkedin_training") || source === "linkedin_post") return true;
      if (source === "indeed_training") return true;

      return /France|Paris|Lyon|Marseille|Toulouse|Lille|Nantes|Bordeaux|Île-de-France|Saint-Denis|Saint-Ouen/i.test(
        location
      );
    });
  }

  return {
    persisted: true,
    sources,
    items: items.slice(0, clampLimit(limit))
  };
}

function describeSupabaseError(error) {
  if (!error) return null;
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name
    };
  }

  if (typeof error === "object") {
    return {
      code: error.code || null,
      message: error.message || null,
      details: error.details || null,
      hint: error.hint || null
    };
  }

  return { message: String(error) };
}

export async function upsertJobSignals(items = []) {
  const client = requireDatabase();

  const deduped = new Map();
  for (const item of items) {
    if (!item?.sourceId || !item?.sourceRecordId || !item?.title) continue;
    const key = `${canonicalSourceId(item.sourceId)}:${String(item.sourceRecordId)}`;
    deduped.set(key, item);
  }

  const rows = [...deduped.values()].map((item) => ({
    source_id: canonicalSourceId(item.sourceId),
    source_record_id: String(item.sourceRecordId),
    title: String(item.title),
    company_name: item.companyName || null,
    location: item.location || null,
    contract_type: item.contractType || null,
    source_url: item.sourceUrl || null,
    published_at: item.publishedAt || null,
    source_updated_at: item.sourceUpdatedAt || null,
    roles: Array.isArray(item.roles) ? item.roles.filter(Boolean).map(String) : [],
    skills: Array.isArray(item.skills) ? item.skills.filter(Boolean).map(String) : [],
    tools: Array.isArray(item.tools) ? item.tools.filter(Boolean).map(String) : [],
    use_cases: Array.isArray(item.useCases) ? item.useCases.filter(Boolean).map(String) : [],
    signal_keys: Array.isArray(item.signalKeys) ? item.signalKeys.filter(Boolean).map(String) : [],
    keyword_seeds: Array.isArray(item.keywordSeeds) ? item.keywordSeeds.filter(Boolean).map(String) : [],
    description_hash: item.descriptionHash || null,
    raw_payload: item.rawPayload || {},
    last_seen_at: new Date().toISOString()
  }));

  if (!rows.length) {
    return { persisted: true, count: 0, items: [], errors: [] };
  }

  await ensureSignalSources(
    client,
    rows.map((row) => row.source_id)
  );

  const bulk = await client
    .from("content_job_signals")
    .upsert(rows, { onConflict: "source_id,source_record_id" })
    .select("id,source_id,source_record_id,title,company_name,source_url,last_seen_at");

  if (!bulk.error) {
    return {
      persisted: true,
      count: bulk.data?.length || 0,
      items: bulk.data || [],
      errors: []
    };
  }

  const persisted = [];
  const errors = [];

  for (const row of rows) {
    const result = await client
      .from("content_job_signals")
      .upsert(row, { onConflict: "source_id,source_record_id" })
      .select("id,source_id,source_record_id,title,company_name,source_url,last_seen_at")
      .maybeSingle();

    if (result.error) {
      errors.push({
        sourceId: row.source_id,
        sourceRecordId: row.source_record_id,
        title: row.title,
        error: describeSupabaseError(result.error)
      });
    } else if (result.data) {
      persisted.push(result.data);
    }
  }

  return {
    persisted: persisted.length > 0 || errors.length === 0,
    count: persisted.length,
    items: persisted,
    errors,
    bulkError: describeSupabaseError(bulk.error)
  };
}


export async function getJobSignalDetail(id) {
  const client = requireDatabase();
  const { data, error } = await client
    .from("content_job_signals")
    .select(
      "id,source_id,source_record_id,title,company_name,location,contract_type,source_url,published_at,source_updated_at,roles,skills,tools,use_cases,signal_keys,keyword_seeds,raw_payload,first_seen_at,last_seen_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}
