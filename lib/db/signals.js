import { createHash } from "node:crypto";
import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";
import { stableStringify } from "./persist.js";
import { normalizePrivateDemandSignals } from "../signals/private.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function clean(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || null;
}

export const TERRITORY_PROGRAM_SIGNAL_TYPES = Object.freeze([
  "territory_call_for_projects",
  "territory_funding_program",
  "territory_support_program"
]);

const TERRITORY_PROGRAM_SOURCE_REGISTRY = Object.freeze({
  aides_territoires: "Aides Territoires",
  banque_territoires_programs: "Banque des Territoires - programmes",
  francenum_programs: "France Num - aides et programmes",
  anct_programs: "ANCT - programmes territoriaux"
});

async function ensureTerritoryProgramSource(client, sourceId) {
  const name = TERRITORY_PROGRAM_SOURCE_REGISTRY[sourceId];
  if (!name) return;

  const { error } = await client.from("sources").upsert({
    id: sourceId,
    name,
    source_group: "public",
    priority: "P1",
    access_mode: "public_web_index",
    status: "active"
  }, { onConflict: "id" });

  if (error) throw error;
}

async function findOrCreateOrganization(client, entity) {
  if (!entity?.name && !entity?.siret && !entity?.siren) return null;

  let request = client
    .from("organizations")
    .select("id,canonical_name,siren,siret,website")
    .limit(1);

  if (entity.siren) request = request.eq("siren", entity.siren);
  else if (entity.siret) request = request.eq("siret", entity.siret);
  else request = request.ilike("canonical_name", entity.name);

  const { data: existing, error: lookupError } = await request.maybeSingle();
  if (lookupError) throw lookupError;
  if (existing?.id) return existing;

  const { data, error } = await client
    .from("organizations")
    .insert({
      canonical_name: entity.name || entity.siret || entity.siren,
      organization_type: "company",
      siren: entity.siren || null,
      siret: entity.siret || null,
      country_code: "FR",
      website: entity.website || null
    })
    .select("id,canonical_name,siren,siret,website")
    .single();

  if (error) throw error;
  return data;
}

export async function persistPrivateSignals({
  source = "manual",
  records = [],
  collectorRunId = null
} = {}) {
  const client = requireDatabase();
  const normalized = normalizePrivateDemandSignals({ source, records });
  const results = [];

  for (const signal of normalized) {
    const rawString = stableStringify(signal.raw);
    const contentHash = sha256(rawString);

    let rawId = null;
    const { data: existingRaw, error: rawLookupError } = await client
      .from("raw_items")
      .select("id")
      .eq("source_id", source)
      .eq("source_record_id", signal.sourceRecordId)
      .eq("content_hash", contentHash)
      .maybeSingle();

    if (rawLookupError) throw rawLookupError;

    if (existingRaw?.id) {
      rawId = existingRaw.id;
    } else {
      const { data: raw, error: rawError } = await client
        .from("raw_items")
        .insert({
          source_id: source,
          source_record_id: signal.sourceRecordId,
          source_url: signal.sourceUrl,
          published_at: signal.occurredAt || null,
          content_hash: contentHash,
          media_type: "application/json",
          payload: signal.raw,
          collector_run_id: collectorRunId
        })
        .select("id")
        .single();

      if (rawError) throw rawError;
      rawId = raw.id;
    }

    const organization = await findOrCreateOrganization(client, signal.organization);

    const dedupeKey = sha256([
      source,
      signal.sourceRecordId,
      organization?.id,
      signal.signalType,
      signal.title
    ].map((x) => x ?? "").join("|"));

    const { data, error } = await client
      .from("market_signals")
      .upsert({
        organization_id: organization?.id || null,
        signal_type: signal.signalType,
        title: signal.title,
        description: signal.description,
        occurred_at: signal.occurredAt || null,
        evidence_kind: signal.evidenceKind,
        confidence: signal.confidence,
        source_raw_item_id: rawId,
        source_record_id: signal.sourceRecordId,
        source_url: signal.sourceUrl,
        dedupe_key: dedupeKey,
        signal_payload: {
          classification: signal.classification,
          source
        }
      }, { onConflict: "dedupe_key" })
      .select("id")
      .single();

    if (error) throw error;
    results.push({
      signalId: data.id,
      signalType: signal.signalType,
      organizationId: organization?.id || null,
      evidenceKind: signal.evidenceKind
    });
  }

  return {
    persisted: true,
    source,
    sourceRecords: records.length,
    signalRows: results.length,
    results
  };
}

export async function searchPrivateSignals({
  query,
  organization,
  signalTypes,
  from,
  to,
  evidenceKind,
  limit = 100,
  offset = 0
} = {}) {
  const client = requireDatabase();
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  let organizationIds = [];
  const orgQuery = clean(organization);

  if (orgQuery) {
    const digits = orgQuery.replace(/\D/g, "");
    let request = client
      .from("organizations")
      .select("id,canonical_name,siren,siret")
      .limit(50);

    if (digits.length === 9) request = request.eq("siren", digits);
    else if (digits.length === 14) request = request.eq("siret", digits);
    else request = request.ilike("canonical_name", `%${orgQuery}%`);

    const { data, error } = await request;
    if (error) throw error;
    organizationIds = (data || []).map((row) => row.id);

    if (!organizationIds.length) {
      return { total: 0, items: [] };
    }
  }

  let request = client
    .from("market_signals")
    .select(
      `
      id,signal_type,title,description,occurred_at,evidence_kind,confidence,
      source_record_id,source_url,signal_payload,created_at,
      organization:organizations(id,canonical_name,siren,siret,website),
      evidence:raw_items(source_id,source_record_id,source_url,published_at,fetched_at)
      `,
      { count: "exact" }
    )
    .order("occurred_at", { ascending: false, nullsFirst: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  const text = clean(query);
  if (text) {
    request = request.or(`title.ilike.%${text}%,description.ilike.%${text}%`);
  }
  if (organizationIds.length) request = request.in("organization_id", organizationIds);
  if (signalTypes?.length) request = request.in("signal_type", signalTypes);
  if (from) request = request.gte("occurred_at", from);
  if (to) request = request.lte("occurred_at", to);
  if (evidenceKind) request = request.eq("evidence_kind", evidenceKind);

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    total: count ?? data?.length ?? 0,
    limit: safeLimit,
    offset: safeOffset,
    items: data || [],
    note:
      "evidence_kind=source_fact means the signal row was retained without inferred categorization; evidence_kind=inferred means the signal category was derived by Autonomia from source text."
  };
}


export async function persistTerritoryProgramSignals(
  records = [],
  { collectorRunId = null } = {}
) {
  const client = requireDatabase();
  const results = [];

  for (const record of records || []) {
    const source = clean(record?.sourceId);
    if (!source || !TERRITORY_PROGRAM_SOURCE_REGISTRY[source]) continue;

    await ensureTerritoryProgramSource(client, source);

    const sourceRecordId =
      clean(record?.sourceRecordId) ||
      sha256([source, record?.sourceUrl, record?.title].map((value) => value || "").join("|"));
    const requestedType = clean(record?.marketSignalType || record?.rawPayload?.market_signal_type);
    const signalType = TERRITORY_PROGRAM_SIGNAL_TYPES.includes(requestedType)
      ? requestedType
      : "territory_support_program";
    const rawPayload = {
      ...(record?.rawPayload || {}),
      source,
      market_signal_type: signalType,
      discovered_at: clean(record?.sourceUpdatedAt) || new Date().toISOString()
    };
    const rawString = stableStringify(rawPayload);
    const contentHash = sha256(rawString);

    let rawId = null;
    const { data: existingRaw, error: rawLookupError } = await client
      .from("raw_items")
      .select("id")
      .eq("source_id", source)
      .eq("source_record_id", sourceRecordId)
      .eq("content_hash", contentHash)
      .maybeSingle();

    if (rawLookupError) throw rawLookupError;

    if (existingRaw?.id) {
      rawId = existingRaw.id;
    } else {
      const { data: raw, error: rawError } = await client
        .from("raw_items")
        .insert({
          source_id: source,
          source_record_id: sourceRecordId,
          source_url: clean(record?.sourceUrl),
          published_at: clean(record?.publishedAt),
          content_hash: contentHash,
          media_type: "application/json",
          payload: rawPayload,
          collector_run_id: collectorRunId
        })
        .select("id")
        .single();

      if (rawError) throw rawError;
      rawId = raw.id;
    }

    const title = clean(record?.title) || "Programme territorial IA";
    const description = clean(
      record?.rawPayload?.search_description ||
      record?.description
    );
    const dedupeKey = sha256([
      source,
      sourceRecordId,
      signalType,
      title
    ].join("|"));

    const { data, error } = await client
      .from("market_signals")
      .upsert({
        organization_id: null,
        signal_type: signalType,
        title,
        description,
        occurred_at: clean(record?.publishedAt),
        evidence_kind: "inferred",
        confidence: 0.92,
        source_raw_item_id: rawId,
        source_record_id: sourceRecordId,
        source_url: clean(record?.sourceUrl),
        dedupe_key: dedupeKey,
        signal_payload: rawPayload
      }, { onConflict: "dedupe_key" })
      .select("id")
      .single();

    if (error) throw error;
    results.push({
      signalId: data.id,
      signalType,
      source,
      sourceRecordId
    });
  }

  return {
    persisted: true,
    sourceRecords: records?.length || 0,
    signalRows: results.length,
    results
  };
}

export async function listRecentTerritoryProgramSignals({
  days = 365,
  limit = 300
} = {}) {
  const client = requireDatabase();
  const safeLimit = Math.min(Math.max(Number(limit) || 300, 1), 1000);
  const safeDays = Math.min(Math.max(Number(days) || 365, 1), 730);

  const { data, error } = await client
    .from("market_signals")
    .select(
      "id,signal_type,title,description,occurred_at,evidence_kind,confidence,source_record_id,source_url,signal_payload,created_at"
    )
    .in("signal_type", [...TERRITORY_PROGRAM_SIGNAL_TYPES])
    .order("created_at", { ascending: false })
    .limit(Math.min(safeLimit * 3, 1000));

  if (error) throw error;

  const cutoff = Date.now() - safeDays * 24 * 60 * 60 * 1000;
  return (data || [])
    .filter((row) => {
      const timestamp = Date.parse(row?.occurred_at || row?.created_at || "");
      return Number.isFinite(timestamp) && timestamp >= cutoff;
    })
    .slice(0, safeLimit);
}
