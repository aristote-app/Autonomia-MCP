import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";
import { attachPrimarySources } from "./opportunitySources.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function cleanSearch(value) {
  return String(value || "")
    .replace(/[,%()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampLimit(limit, max = 200) {
  return Math.min(Math.max(Number(limit) || 50, 1), max);
}

export async function searchRankedOpportunities({
  query,
  opportunityType,
  tags = [],
  actionability = "open",
  aiRelatedOnly = true,
  minFitScore = 0,
  limit = 50,
  offset = 0
} = {}) {
  const client = requireDatabase();
  const safeLimit = clampLimit(limit, 200);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  let request = client
    .from("opportunity_intelligence_v2")
    .select(
      "id,opportunity_type,title,description,published_at,deadline_at,actionability_state,days_to_deadline,status,location,budget_min,budget_max,buyer_name,ai_tags,is_ai_related,autonomia_fit_score,fit_coverage_percent,inferred_staffing_roles,first_seen_at,last_seen_at",
      { count: "exact" }
    )
    .gte("autonomia_fit_score", Number(minFitScore) || 0)
    .order("autonomia_fit_score", { ascending: false, nullsFirst: false })
    .order("days_to_deadline", { ascending: true, nullsFirst: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  if (opportunityType) request = request.eq("opportunity_type", opportunityType);
  if (aiRelatedOnly) request = request.eq("is_ai_related", true);

  if (actionability === "open") {
    request = request.eq("actionability_state", "open_by_deadline");
  } else if (actionability === "active") {
    request = request.in("actionability_state", ["open_by_deadline", "unknown"]);
  } else if (actionability === "closed") {
    request = request.eq("actionability_state", "closed_by_deadline");
  } else if (actionability === "unknown") {
    request = request.eq("actionability_state", "unknown");
  }

  const text = cleanSearch(query);
  if (text) {
    request = request.or(
      `title.ilike.%${text}%,description.ilike.%${text}%,buyer_name.ilike.%${text}%`
    );
  }

  if (Array.isArray(tags) && tags.length) {
    request = request.contains("ai_tags", tags);
  }

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    persisted: true,
    total: count ?? data?.length ?? 0,
    limit: safeLimit,
    offset: safeOffset,
    filters: {
      query: query || null,
      opportunityType: opportunityType || null,
      tags,
      actionability,
      aiRelatedOnly,
      minFitScore: Number(minFitScore) || 0
    },
    methodology: {
      fitScore:
        "Rules-based Autonomia fit normalized over criteria with available evidence. It is not a probability of winning.",
      actionability:
        "active includes open_by_deadline plus unknown, so freelance/private needs without a stored deadline are not discarded.",
      classification:
        "V2 deterministic taxonomy using title, description and linked raw source payloads."
    },
    items: await attachPrimarySources(data || [])
  };
}

export async function getBuyerMarketIntelligence({
  buyer,
  minAiAwardRows = 0,
  limit = 50,
  offset = 0
} = {}) {
  const client = requireDatabase();
  const safeLimit = clampLimit(limit, 200);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  let request = client
    .from("buyer_market_intelligence_v1")
    .select(
      "buyer_org_id,buyer_name,siren,siret,award_rows,observed_suppliers,known_amount_total,known_amount_average,first_award_date,last_award_date,ai_related_award_rows",
      { count: "exact" }
    )
    .gte("ai_related_award_rows", Number(minAiAwardRows) || 0)
    .order("ai_related_award_rows", { ascending: false })
    .order("award_rows", { ascending: false })
    .order("known_amount_total", { ascending: false, nullsFirst: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  const text = cleanSearch(buyer);
  if (text) request = request.ilike("buyer_name", `%${text}%`);

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    persisted: true,
    total: count ?? data?.length ?? 0,
    limit: safeLimit,
    offset: safeOffset,
    note:
      "This is a factual aggregation of observed award rows. It is not a recommendation, ranking of political actors, or prediction of future procurement.",
    items: data || []
  };
}


export async function getIntelligenceDashboardSummary() {
  const client = requireDatabase();

  const [
    totalOpportunities,
    aiRelated,
    openAi,
    activeAi,
    activeFreelance,
    urgentAi,
    totalJobSignals,
    freelanceJobSignals,
    freeworkRows,
    awards,
    organizations,
    sources
  ] = await Promise.all([
    client.from("opportunity_intelligence_v2").select("id", { count: "exact", head: true }),
    client.from("opportunity_intelligence_v2").select("id", { count: "exact", head: true }).eq("is_ai_related", true),
    client.from("opportunity_intelligence_v2").select("id", { count: "exact", head: true }).eq("is_ai_related", true).eq("actionability_state", "open_by_deadline"),
    client.from("opportunity_intelligence_v2").select("id", { count: "exact", head: true }).eq("is_ai_related", true).in("actionability_state", ["open_by_deadline", "unknown"]),
    client.from("opportunity_intelligence_v2").select("id", { count: "exact", head: true }).eq("is_ai_related", true).eq("opportunity_type", "freelance_ai").in("actionability_state", ["open_by_deadline", "unknown"]),
    client.from("opportunity_intelligence_v2").select("id", { count: "exact", head: true }).eq("is_ai_related", true).in("actionability_state", ["open_by_deadline", "unknown"]).gte("days_to_deadline", 0).lte("days_to_deadline", 3),
    client.from("content_job_signals").select("id", { count: "exact", head: true }),
    client.from("content_job_signals").select("id", { count: "exact", head: true }).contains("signal_keys", ["freelance"]),
    client.from("raw_items").select("id", { count: "exact", head: true }).eq("source_id", "freework"),
    client.from("public_awards").select("id", { count: "exact", head: true }),
    client.from("organizations").select("id", { count: "exact", head: true }),
    client.from("sources").select("id", { count: "exact", head: true })
  ]);

  const errors = [
    totalOpportunities.error,
    aiRelated.error,
    openAi.error,
    activeAi.error,
    activeFreelance.error,
    urgentAi.error,
    totalJobSignals.error,
    freelanceJobSignals.error,
    freeworkRows.error,
    awards.error,
    organizations.error,
    sources.error
  ].filter(Boolean);

  if (errors.length) throw errors[0];

  const jobSignalCount = totalJobSignals.count || 0;
  const freelanceSignalCount = freelanceJobSignals.count || 0;

  return {
    totalOpportunities: totalOpportunities.count || 0,
    aiRelatedOpportunities: aiRelated.count || 0,
    openAiOpportunities: openAi.count || 0,
    activeAiOpportunities: activeAi.count || 0,
    activeFreelanceOpportunities: activeFreelance.count || 0,
    urgentAiOpportunities: urgentAi.count || 0,
    totalJobSignals: jobSignalCount,
    freelanceJobSignals: freelanceSignalCount,
    companyJobSignals: Math.max(0, jobSignalCount - freelanceSignalCount),
    freeworkRows: freeworkRows.count || 0,
    publicAwards: awards.count || 0,
    organizations: organizations.count || 0,
    sources: sources.count || 0
  };
}
