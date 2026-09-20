import { createHash } from "node:crypto";
import {
  getAutonomiaServerClient,
  hasAutonomiaDatabase
} from "./supabase.js";
import {
  extractJobContentSignals,
  labelsFor
} from "../content/jobSignals.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function hash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function uniq(values = []) {
  return [...new Set(values.filter(Boolean))];
}

export async function persistJobContentSignals({
  source = "france_travail_jobs",
  jobs = []
} = {}) {
  const client = requireDatabase();
  const rows = jobs
    .map((job) => {
      const extracted = extractJobContentSignals(job);
      if (!extracted.isAiRelevant) return null;

      return {
        source_id: source,
        source_record_id: String(job.id),
        title: job.title || "Offre IA",
        company_name: job.companyName || null,
        location: job.location || null,
        contract_type: job.contractType || null,
        source_url: job.sourceUrl || null,
        published_at: job.publishedAt || null,
        source_updated_at: job.sourceUpdatedAt || null,
        roles: extracted.roles,
        skills: extracted.skills,
        tools: extracted.tools,
        use_cases: extracted.useCases,
        signal_keys: extracted.signalKeys,
        keyword_seeds: extracted.keywordSeeds,
        description_hash: hash(job.description),
        raw_payload: job.raw || {},
        last_seen_at: new Date().toISOString()
      };
    })
    .filter(Boolean);

  if (!rows.length) {
    return { persisted: 0, received: jobs.length };
  }

  const { data, error } = await client
    .from("content_job_signals")
    .upsert(rows, { onConflict: "source_id,source_record_id" })
    .select("id");

  if (error) throw error;

  return {
    persisted: data?.length || rows.length,
    received: jobs.length
  };
}

function countKeys(rows, field) {
  const counts = new Map();

  for (const row of rows) {
    for (const key of row[field] || []) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([key, count]) => ({
      ...labelsFor([key])[0],
      count
    }));
}

export async function getPublicJobSignalSummary({
  tags = [],
  days = 90,
  limit = 1200
} = {}) {
  const client = requireDatabase();
  const safeDays = Math.min(Math.max(Number(days) || 90, 7), 365);
  const safeLimit = Math.min(Math.max(Number(limit) || 1200, 100), 2000);
  const cutoff = new Date(Date.now() - safeDays * 86400000).toISOString();

  const { data, error } = await client
    .from("content_job_signals")
    .select(
      "source_id,source_record_id,title,company_name,location,contract_type,source_url,published_at,roles,skills,tools,use_cases,signal_keys,keyword_seeds"
    )
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(safeLimit);

  if (error) throw error;

  const cleanTags = uniq(
    tags
      .map((tag) => String(tag || "").trim().toLowerCase())
      .filter(Boolean)
  );

  const rows = (data || []).filter((row) => {
    if (!cleanTags.length) return true;
    const keys = new Set((row.signal_keys || []).map((key) => key.toLowerCase()));
    return cleanTags.some((tag) => keys.has(tag));
  });

  const recentExamples = rows.slice(0, 5).map((row) => ({
    title: row.title,
    company: row.company_name,
    location: row.location,
    publishedAt: row.published_at,
    sourceUrl: row.source_url,
    source: row.source_id
  }));

  return {
    periodDays: safeDays,
    observedOffers: rows.length,
    lastObservedAt: rows[0]?.published_at || null,
    sources: uniq(rows.map((row) => row.source_id)),
    roles: countKeys(rows, "roles"),
    tools: countKeys(rows, "tools"),
    skills: countKeys(rows, "skills"),
    useCases: countKeys(rows, "use_cases"),
    keywordCandidates: (() => {
      const counts = new Map();
      for (const row of rows) {
        for (const keyword of row.keyword_seeds || []) {
          counts.set(keyword, (counts.get(keyword) || 0) + 1);
        }
      }
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 12)
        .map(([keyword, count]) => ({ keyword, count }));
    })(),
    recentExamples,
    note:
      "Aggregated editorial signal from job postings. Counts are observations in the collected sample, not total market volumes."
  };
}
