import { createHash } from "node:crypto";
import { canonicalOpportunityKey } from "../dedupe.js";
import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";
import { buildOpportunityIntelligence } from "../intelligence/opportunity.js";

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

async function findOrCreateOrganization(client, name, type, cache, siren = null) {
  const cleanName = String(name || "").trim();
  const cleanSiren = /^\d{9}$/.test(String(siren || "")) ? String(siren) : null;
  if (!cleanName && !cleanSiren) return null;

  const key = cleanSiren
    ? `${type}|siren:${cleanSiren}`
    : `${type}|name:${cleanName.toLowerCase()}`;
  if (cache.has(key)) return cache.get(key);

  if (cleanSiren) {
    const { data: bySiren, error: sirenError } = await client
      .from("organizations")
      .select("id,canonical_name,siren")
      .eq("siren", cleanSiren)
      .limit(1)
      .maybeSingle();

    if (sirenError) throw sirenError;
    if (bySiren?.id) {
      cache.set(key, bySiren.id);
      return bySiren.id;
    }
  }

  let existing = null;
  if (cleanName) {
    const { data, error: lookupError } = await client
      .from("organizations")
      .select("id,canonical_name,siren")
      .ilike("canonical_name", cleanName)
      .limit(1)
      .maybeSingle();

    if (lookupError) throw lookupError;
    existing = data || null;
  }

  if (existing?.id) {
    if (cleanSiren && !existing.siren) {
      const { error: updateError } = await client
        .from("organizations")
        .update({ siren: cleanSiren })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    }
    cache.set(key, existing.id);
    return existing.id;
  }

  const { data, error } = await client
    .from("organizations")
    .insert({
      canonical_name: cleanName || cleanSiren,
      organization_type: type,
      country_code: "FR",
      siren: cleanSiren
    })
    .select("id")
    .single();

  if (error) throw error;
  cache.set(key, data.id);
  return data.id;
}

async function buyerAwardRows(client, buyerOrgId, cache) {
  if (!buyerOrgId) return 0;
  if (cache.has(buyerOrgId)) return cache.get(buyerOrgId);

  const { count, error } = await client
    .from("public_awards")
    .select("id", { count: "exact", head: true })
    .eq("buyer_org_id", buyerOrgId);

  if (error) throw error;
  const value = count || 0;
  cache.set(buyerOrgId, value);
  return value;
}

async function persistOpportunityAnalyses(client, {
  opportunityId,
  item,
  rawPayload,
  contentHash,
  factsHash,
  buyerAwardRowsObserved
}) {
  const intelligence = buildOpportunityIntelligence({
    item,
    rawPayload,
    buyerAwardRows: buyerAwardRowsObserved
  });

  const analyses = [
    {
      opportunity_id: opportunityId,
      analysis_type: "market_classification_v2",
      model_provider: "rules",
      model_name: "autonomia-deterministic-taxonomy",
      model_version: "2",
      input_hash: sha256(`${contentHash}|${factsHash}|classification-v2`),
      payload: {
        kind: intelligence.classification.kind,
        is_ai_related: intelligence.classification.isAiRelated,
        tags: intelligence.classification.tags,
        evidence_scope: intelligence.classification.evidenceScope,
        methodology: intelligence.classification.methodology
      },
      confidence: intelligence.classification.tags.length >= 2
        ? 0.95
        : intelligence.classification.tags.length === 1 ? 0.9 : 0.35
    },
    {
      opportunity_id: opportunityId,
      analysis_type: "autonomia_fit_v2",
      model_provider: "rules",
      model_name: "autonomia-fit-engine",
      model_version: "2",
      input_hash: sha256(`${contentHash}|${factsHash}|fit-v2`),
      payload: {
        kind: "rules_based_decision_support",
        score: intelligence.fit.score,
        coverage_percent: intelligence.fit.coverage,
        criteria: intelligence.fit.criteria,
        missing_criteria: intelligence.fit.missingCriteria,
        buyer_award_rows_observed: intelligence.fit.buyerAwardRowsObserved,
        actionability: intelligence.fit.actionability,
        methodology: intelligence.fit.methodology,
        safeguards: intelligence.fit.safeguards
      },
      confidence: intelligence.fit.coverage / 100
    },
    {
      opportunity_id: opportunityId,
      analysis_type: "staffing_requirements_v2",
      model_provider: "rules",
      model_name: "autonomia-staffing-inference",
      model_version: "2",
      input_hash: sha256(`${contentHash}|${factsHash}|staffing-v2`),
      payload: {
        kind: intelligence.staffing.kind,
        roles: intelligence.staffing.roles,
        role_count: intelligence.staffing.roleCount,
        methodology: intelligence.staffing.methodology,
        requires_human_validation: intelligence.staffing.requiresHumanValidation
      },
      confidence: intelligence.staffing.roleCount >= 2
        ? 0.88
        : intelligence.staffing.roleCount === 1 ? 0.7 : 0.35
    }
  ];

  const { error } = await client
    .from("analyses")
    .upsert(analyses, {
      onConflict: "opportunity_id,analysis_type,input_hash"
    });

  if (error) throw error;
  return intelligence;
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
  const organizationCache = new Map();
  const buyerAwardCache = new Map();

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

    const buyerOrgId = await findOrCreateOrganization(
      supabase,
      item.buyerName,
      "buyer",
      organizationCache,
      item.buyerSiren
    );
    const companyOrgId = await findOrCreateOrganization(
      supabase,
      item.companyName,
      "company",
      organizationCache
    );

    const { data: opportunity, error: opportunityError } = await supabase
      .from("opportunities")
      .upsert(
        {
          ...facts,
          buyer_org_id: buyerOrgId,
          company_org_id: companyOrgId,
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

    const factsHash = sha256(stableStringify({
      ...facts,
      buyer_org_id: buyerOrgId,
      company_org_id: companyOrgId
    }));
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

    const observedBuyerAwards = await buyerAwardRows(
      supabase,
      buyerOrgId,
      buyerAwardCache
    );

    const intelligence = await persistOpportunityAnalyses(supabase, {
      opportunityId: opportunity.id,
      item,
      rawPayload,
      contentHash,
      factsHash,
      buyerAwardRowsObserved: observedBuyerAwards
    });

    results.push({
      opportunityId: opportunity.id,
      rawItemId: rawId,
      buyerOrgId,
      companyOrgId,
      dedupe,
      intelligence: {
        tags: intelligence.classification.tags,
        fitScore: intelligence.fit.score,
        fitCoverage: intelligence.fit.coverage,
        staffingRoles: intelligence.staffing.roles
      }
    });
  }

  return {
    persisted: true,
    count: results.length,
    results
  };
}

export { stableStringify, opportunityFacts };
