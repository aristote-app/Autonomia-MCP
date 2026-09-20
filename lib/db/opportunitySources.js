import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";

function requireDatabase() {
  if (!hasAutonomiaDatabase()) {
    throw new Error("Dedicated Autonomia Supabase is not configured");
  }
  return getAutonomiaServerClient();
}

function sourceTimestamp(row) {
  const raw = row?.raw_items;
  return new Date(raw?.published_at || raw?.fetched_at || row?.created_at || 0).getTime();
}

export async function attachPrimarySources(items = []) {
  if (!items.length) return [];
  const client = requireDatabase();
  const ids = items.map((item) => item.id).filter(Boolean);

  const { data, error } = await client
    .from("opportunity_sources")
    .select(
      "opportunity_id,created_at,raw_items(source_id,source_url,source_record_id,published_at,fetched_at)"
    )
    .in("opportunity_id", ids);

  if (error) throw error;

  const primaryByOpportunity = new Map();

  for (const row of data || []) {
    const current = primaryByOpportunity.get(row.opportunity_id);
    if (!current || sourceTimestamp(row) > sourceTimestamp(current)) {
      primaryByOpportunity.set(row.opportunity_id, row);
    }
  }

  return items.map((item) => {
    const primary = primaryByOpportunity.get(item.id)?.raw_items || null;
    return {
      ...item,
      primary_source_id: primary?.source_id || null,
      primary_source_url: primary?.source_url || null,
      primary_source_record_id: primary?.source_record_id || null
    };
  });
}

export async function getOpportunityDetail(id) {
  const client = requireDatabase();

  const [{ data: opportunity, error: opportunityError }, { data: sources, error: sourcesError }, { data: analyses, error: analysesError }] =
    await Promise.all([
      client
        .from("opportunities")
        .select(
          "id,opportunity_type,title,description,buyer_org_id,company_org_id,published_at,deadline_at,status,procedure,contract_type,location,remote_mode,currency,budget_min,budget_max,tjm_min,tjm_max,first_seen_at,last_seen_at,created_at,updated_at"
        )
        .eq("id", id)
        .maybeSingle(),
      client
        .from("opportunity_sources")
        .select(
          "id,match_method,match_confidence,created_at,raw_items(id,source_id,source_record_id,source_url,published_at,fetched_at,payload)"
        )
        .eq("opportunity_id", id),
      client
        .from("analyses")
        .select("analysis_type,payload,confidence,created_at")
        .eq("opportunity_id", id)
        .order("created_at", { ascending: false })
    ]);

  if (opportunityError) throw opportunityError;
  if (!opportunity) return null;
  if (sourcesError) throw sourcesError;
  if (analysesError) throw analysesError;

  const orgIds = [opportunity.buyer_org_id, opportunity.company_org_id].filter(Boolean);
  let organizations = [];
  if (orgIds.length) {
    const { data, error } = await client
      .from("organizations")
      .select("id,canonical_name,organization_type,siren,siret,website")
      .in("id", orgIds);
    if (error) throw error;
    organizations = data || [];
  }

  const orgById = new Map(organizations.map((org) => [org.id, org]));
  const latestAnalysis = new Map();
  for (const analysis of analyses || []) {
    if (!latestAnalysis.has(analysis.analysis_type)) {
      latestAnalysis.set(analysis.analysis_type, analysis);
    }
  }

  const sortedSources = [...(sources || [])].sort((a, b) => sourceTimestamp(b) - sourceTimestamp(a));

  return {
    ...opportunity,
    buyer: orgById.get(opportunity.buyer_org_id) || null,
    company: orgById.get(opportunity.company_org_id) || null,
    sources: sortedSources.map((row) => ({
      id: row.id,
      match_method: row.match_method,
      match_confidence: row.match_confidence,
      created_at: row.created_at,
      ...(row.raw_items || {})
    })),
    classification: latestAnalysis.get("market_classification_v2") || null,
    fit: latestAnalysis.get("autonomia_fit_v2") || null,
    staffing: latestAnalysis.get("staffing_requirements_v2") || null
  };
}
