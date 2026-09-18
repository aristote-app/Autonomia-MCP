import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

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

  if (actionability === "open") {
    request = request.eq("actionability_state", "open_by_deadline");
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
      minFitScore: Number(minFitScore) || 0
    },
    methodology: {
      fitScore:
        "Rules-based Autonomia fit normalized over criteria with available evidence. It is not a probability of winning.",
      actionability:
        "open_by_deadline means a stored deadline is in the future; unknown means no usable deadline is stored.",
      classification:
        "V2 deterministic taxonomy using title, description and linked raw source payloads."
    },
    items: data || []
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
