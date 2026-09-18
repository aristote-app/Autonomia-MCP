import { createHash } from "node:crypto";
import { canonicalOpportunityKey } from "../dedupe.js";
import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stable(value[key])])
    );
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stable(value));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function opportunityFacts(item) {
  return {
    opportunity_type: item.opportunityType || "public_ai",
    title: item.title || "(sans titre)",
    description: item.description || null,
    published_at: item.publishedAt || item.detectedAt || null,
    deadline_at: item.deadlineAt || null,
    procedure: item.procedure || null,
    contract_type: item.contractType || null,
    location: item.location || item.city || null,
    remote_mode: item.remoteMode || item.workMode || null,
    currency: item.currency || "EUR",
    budget_min: item.budgetMin ?? null,
    budget_max: item.budgetMax ?? null,
    tjm_min: item.tjmMin ?? item.tjmAmount ?? null,
    tjm_max: item.tjmMax ?? item.tjmAmount ?? null
  };
}

export async function startCollectorRun({
  sourceId = null,
  queryPayload = {},
  triggerMode = "on_demand"
}) {
  if (!hasAutonomiaDatabase()) return null;
  const supabase = getAutonomiaServerClient();

  const { data, error } = await supabase
    .from("collector_runs")
    .insert({
      source_id: sourceId,
      trigger_mode: triggerMode,
      query_payload: queryPayload,
      status: "running"
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function finishCollectorRun(id, {
  status = "success",
  stats = {},
  errorMessage = null
} = {}) {
  if (!id || !hasAutonomiaDatabase()) return;
  const supabase = getAutonomiaServerClient();

  const { error } = await supabase
    .from("collector_runs")
    .update({
      status,
      completed_at: new Date().toISOString(),
      stats,
      error_message: errorMessage
    })
    .eq("id", id);

  if (error) throw error;
}

export async function persistOpportunityItems(items, { collectorRunId = null } = {}) {
  if (!hasAutonomiaDatabase()) {
    return {
      persisted: false,
      reason: "Dedicated Autonomia Supabase is not configured",
      count: 0
    };
  }

  const supabase = getAutonomiaServerClient();
  const results = [];

  for (const item of items || []) {
    if (!item?.source) continue;

    const rawPayload = item.raw ?? item;
    const rawString = stableStringify(rawPayload);
    const contentHash = sha256(rawString);

    const rawInsert = {
      source_id: item.source,
      source_record_id: item.sourceId || null,
      source_url: item.sourceUrl || null,
      published_at: item.publishedAt || item.detectedAt || null,
      content_hash: contentHash,
      media_type: "application/json",
      payload: rawPayload,
      collector_run_id: collectorRunId
    };

    let rawId = null;

    const { data: existingRaw, error: rawLookupError } = await supabase
      .from("raw_items")
      .select("id")
      .eq("source_id", rawInsert.source_id)
      .eq("content_hash", rawInsert.content_hash)
      .eq("source_record_id", rawInsert.source_record_id)
      .maybeSingle();

    if (rawLookupError) throw rawLookupError;

    if (existingRaw?.id) {
      rawId = existingRaw.id;
    } else {
      const { data: rawData, error: rawError } = await supabase
        .from("raw_items")
        .insert(rawInsert)
        .select("id")
        .single();

      if (rawError) throw rawError;
      rawId = rawData.id;
    }

    const dedupe = canonicalOpportunityKey(item);
    const facts = opportunityFacts(item);

    const { data: opportunity, error: opportunityError } = await supabase
      .from("opportunities")
      .upsert(
        {
          ...facts,
          dedupe_key: dedupe.key,
          last_seen_at: new Date().toISOString()
        },
        { onConflict: "dedupe_key" }
      )
      .select("id")
      .single();

    if (opportunityError) throw opportunityError;

    const { error: linkError } = await supabase
      .from("opportunity_sources")
      .upsert(
        {
          opportunity_id: opportunity.id,
          raw_item_id: rawId,
          match_method: dedupe.method,
          match_confidence: dedupe.confidence
        },
        { onConflict: "opportunity_id,raw_item_id" }
      );

    if (linkError) throw linkError;

    const factsHash = sha256(stableStringify(facts));
    const { error: versionError } = await supabase
      .from("opportunity_versions")
      .upsert(
        {
          opportunity_id: opportunity.id,
          raw_item_id: rawId,
          facts,
          facts_hash: factsHash
        },
        { onConflict: "opportunity_id,facts_hash" }
      );

    if (versionError) throw versionError;

    results.push({
      opportunityId: opportunity.id,
      rawItemId: rawId,
      dedupe
    });
  }

  return {
    persisted: true,
    count: results.length,
    results
  };
}

export { stableStringify, opportunityFacts };
