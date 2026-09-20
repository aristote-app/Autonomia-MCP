import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function uniq(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function countValues(rows, field) {
  const counts = new Map();

  for (const row of rows) {
    for (const value of row[field] || []) {
      const label = String(value || "").trim();
      if (!label) continue;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
    .slice(0, 8)
    .map(([label, count]) => ({
      key: normalize(label).replace(/\s+/g, "_"),
      label,
      count
    }));
}

function rowMatchesTags(row, tags) {
  if (!tags.length) return true;

  const haystack = [
    ...(row.signal_keys || []),
    ...(row.roles || []),
    ...(row.skills || []),
    ...(row.tools || []),
    ...(row.use_cases || []),
    ...(row.keyword_seeds || [])
  ].map(normalize);

  return tags.some((tag) =>
    haystack.some((value) => value === tag || value.includes(tag) || tag.includes(value))
  );
}

export async function getPublicJobSignalSummary({
  tags = [],
  days = 90,
  limit = 1200
} = {}) {
  const client = requireDatabase();
  const safeDays = Math.min(Math.max(Number(days) || 90, 7), 365);
  const safeLimit = Math.min(Math.max(Number(limit) || 1200, 100), 2000);
  const cleanTags = uniq(tags.map(normalize)).slice(0, 12);
  const cutoff = new Date(Date.now() - safeDays * 86400000).toISOString();

  const { data, error } = await client
    .from("content_job_signals")
    .select(
      "source_id,source_record_id,title,company_name,location,contract_type,source_url,published_at,roles,skills,tools,use_cases,signal_keys,keyword_seeds,last_seen_at"
    )
    .gte("last_seen_at", cutoff)
    .order("last_seen_at", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(safeLimit);

  if (error) throw error;

  const rows = (data || []).filter((row) => rowMatchesTags(row, cleanTags));

  return {
    periodDays: safeDays,
    observedOffers: rows.length,
    lastObservedAt: rows[0]?.published_at || rows[0]?.last_seen_at || null,
    sources: uniq(rows.map((row) => row.source_id)),
    roles: countValues(rows, "roles"),
    tools: countValues(rows, "tools"),
    skills: countValues(rows, "skills"),
    useCases: countValues(rows, "use_cases"),
    recentExamples: rows.slice(0, 5).map((row) => ({
      title: row.title,
      company: row.company_name,
      location: row.location,
      publishedAt: row.published_at,
      source: row.source_id
    })),
    note:
      "Aggregated observations from collected public job/freelance signals. Counts describe the observed sample, not the total market."
  };
}
