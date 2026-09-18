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
