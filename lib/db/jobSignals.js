import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function clampLimit(limit, max = 100) {
  return Math.min(Math.max(Number(limit) || 20, 1), max);
}

export async function searchJobSignals({
  sources = ["linkedin", "indeed"],
  contractType,
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
    .limit(clampLimit(limit));

  if (Array.isArray(sources) && sources.length) {
    request = request.in("source_id", sources);
  }

  if (contractType) {
    request = request.ilike("contract_type", `%${contractType}%`);
  }

  const { data, error } = await request;
  if (error) throw error;

  return {
    persisted: true,
    sources,
    items: data || []
  };
}

export async function upsertJobSignals(items = []) {
  const client = requireDatabase();

  const rows = items
    .filter((item) => item?.sourceId && item?.sourceRecordId && item?.title)
    .map((item) => ({
      source_id: item.sourceId,
      source_record_id: String(item.sourceRecordId),
      title: item.title,
      company_name: item.companyName || null,
      location: item.location || null,
      contract_type: item.contractType || null,
      source_url: item.sourceUrl || null,
      published_at: item.publishedAt || null,
      source_updated_at: item.sourceUpdatedAt || null,
      roles: item.roles || [],
      skills: item.skills || [],
      tools: item.tools || [],
      use_cases: item.useCases || [],
      signal_keys: item.signalKeys || [],
      keyword_seeds: item.keywordSeeds || [],
      description_hash: item.descriptionHash || null,
      raw_payload: item.rawPayload || {},
      last_seen_at: new Date().toISOString()
    }));

  if (!rows.length) {
    return { persisted: true, count: 0, items: [] };
  }

  const { data, error } = await client
    .from("content_job_signals")
    .upsert(rows, { onConflict: "source_id,source_record_id" })
    .select("id,source_id,source_record_id,title,company_name,source_url,last_seen_at");

  if (error) throw error;

  return {
    persisted: true,
    count: data?.length || 0,
    items: data || []
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
