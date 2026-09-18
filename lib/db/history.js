import { createHash } from "node:crypto";
import { getAutonomiaServerClient, hasAutonomiaDatabase } from "./supabase.js";
import { stableStringify } from "./persist.js";
import { normalizeDecpAwardRecord } from "../decp/normalize.js";
import { compareRoleRecords } from "../taxonomy/roles.js";

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

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function findOrganizationIds(client, query) {
  const value = cleanSearch(query);
  if (!value) return [];

  const digits = value.replace(/\D/g, "");
  let request = client
    .from("organizations")
    .select("id,canonical_name,siren,siret")
    .limit(25);

  if (digits.length === 9) request = request.eq("siren", digits);
  else if (digits.length === 14) request = request.eq("siret", digits);
  else request = request.ilike("canonical_name", `%${value}%`);

  const { data, error } = await request;
  if (error) throw error;
  return data || [];
}

async function findOrCreateOrganization(client, entity, type) {
  if (!entity?.name && !entity?.siret && !entity?.siren) return null;

  let query = client
    .from("organizations")
    .select("id,canonical_name,siren,siret")
    .limit(1);

  if (entity.siret) query = query.eq("siret", entity.siret);
  else if (entity.siren) query = query.eq("siren", entity.siren);
  else query = query.ilike("canonical_name", entity.name);

  const { data: existing, error: lookupError } = await query.maybeSingle();
  if (lookupError) throw lookupError;
  if (existing?.id) return existing;

  const { data, error } = await client
    .from("organizations")
    .insert({
      canonical_name: entity.name || entity.siret || entity.siren,
      organization_type: type,
      siren: entity.siren || null,
      siret: entity.siret || null,
      country_code: "FR"
    })
    .select("id,canonical_name,siren,siret")
    .single();

  if (error) throw error;
  return data;
}

export async function searchPersistedOpportunities({
  query,
  opportunityType,
  deadlineAfter,
  publishedAfter,
  limit = 50,
  offset = 0
} = {}) {
  const client = requireDatabase();
  const safeLimit = clampLimit(limit);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  let request = client
    .from("opportunities")
    .select(
      `
      id,opportunity_type,title,description,published_at,deadline_at,status,
      procedure,contract_type,location,remote_mode,currency,
      budget_min,budget_max,tjm_min,tjm_max,first_seen_at,last_seen_at,
      buyer:organizations!opportunities_buyer_org_id_fkey(id,canonical_name,siren,siret),
      company:organizations!opportunities_company_org_id_fkey(id,canonical_name,siren,siret),
      opportunity_sources(
        match_method,match_confidence,
        raw:raw_items(source_id,source_record_id,source_url,published_at,fetched_at)
      )
      `,
      { count: "exact" }
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  if (opportunityType) request = request.eq("opportunity_type", opportunityType);
  if (deadlineAfter) request = request.gte("deadline_at", deadlineAfter);
  if (publishedAfter) request = request.gte("published_at", publishedAfter);

  const text = cleanSearch(query);
  if (text) {
    request = request.or(
      `title.ilike.%${text}%,description.ilike.%${text}%`
    );
  }

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    persisted: true,
    total: count ?? data?.length ?? 0,
    limit: safeLimit,
    offset: safeOffset,
    items: data || []
  };
}

export async function searchPublicAwards({
  query,
  buyer,
  supplier,
  from,
  to,
  limit = 100,
  offset = 0
} = {}) {
  const client = requireDatabase();
  const safeLimit = clampLimit(limit, 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const buyerMatches = buyer ? await findOrganizationIds(client, buyer) : [];
  const supplierMatches = supplier ? await findOrganizationIds(client, supplier) : [];

  if (buyer && !buyerMatches.length) return { total: 0, items: [] };
  if (supplier && !supplierMatches.length) return { total: 0, items: [] };

  let request = client
    .from("public_awards")
    .select(
      `
      id,source_record_id,contract_reference,lot_reference,object,cpv_code,
      award_date,contract_start_date,contract_end_date,duration_months,
      amount,currency,procedure,nature,created_at,
      buyer:organizations!public_awards_buyer_org_id_fkey(id,canonical_name,siren,siret),
      supplier:organizations!public_awards_supplier_org_id_fkey(id,canonical_name,siren,siret)
      `,
      { count: "exact" }
    )
    .order("award_date", { ascending: false, nullsFirst: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  const text = cleanSearch(query);
  if (text) request = request.ilike("object", `%${text}%`);
  if (buyerMatches.length) request = request.in("buyer_org_id", buyerMatches.map((x) => x.id));
  if (supplierMatches.length) request = request.in("supplier_org_id", supplierMatches.map((x) => x.id));
  if (from) request = request.gte("award_date", from);
  if (to) request = request.lte("award_date", to);

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    total: count ?? data?.length ?? 0,
    limit: safeLimit,
    offset: safeOffset,
    items: data || []
  };
}

function summarizeAwards(awards) {
  const amounts = awards
    .map((award) => Number(award.amount))
    .filter(Number.isFinite);

  return {
    awardRows: awards.length,
    totalAmount: amounts.length ? amounts.reduce((sum, x) => sum + x, 0) : null,
    averageAmount: amounts.length
      ? amounts.reduce((sum, x) => sum + x, 0) / amounts.length
      : null,
    firstAwardDate: awards
      .map((x) => x.award_date)
      .filter(Boolean)
      .sort()[0] || null,
    lastAwardDate: awards
      .map((x) => x.award_date)
      .filter(Boolean)
      .sort()
      .at(-1) || null
  };
}

export async function getBuyerHistory({ buyer, limit = 200 } = {}) {
  if (!buyer) throw new Error("buyer is required");
  const client = requireDatabase();
  const organizations = await findOrganizationIds(client, buyer);
  if (!organizations.length) {
    return { query: buyer, organizations: [], summary: summarizeAwards([]), awards: [] };
  }

  const { data, error } = await client
    .from("public_awards")
    .select(
      `
      id,contract_reference,lot_reference,object,cpv_code,award_date,
      amount,currency,duration_months,procedure,nature,
      buyer:organizations!public_awards_buyer_org_id_fkey(id,canonical_name,siren,siret),
      supplier:organizations!public_awards_supplier_org_id_fkey(id,canonical_name,siren,siret)
      `
    )
    .in("buyer_org_id", organizations.map((x) => x.id))
    .order("award_date", { ascending: false, nullsFirst: false })
    .limit(clampLimit(limit, 500));

  if (error) throw error;
  const awards = data || [];

  return {
    query: buyer,
    organizations,
    summary: summarizeAwards(awards),
    awards
  };
}

export async function getSupplierHistory({ supplier, limit = 200 } = {}) {
  if (!supplier) throw new Error("supplier is required");
  const client = requireDatabase();
  const organizations = await findOrganizationIds(client, supplier);
  if (!organizations.length) {
    return { query: supplier, organizations: [], summary: summarizeAwards([]), awards: [] };
  }

  const { data, error } = await client
    .from("public_awards")
    .select(
      `
      id,contract_reference,lot_reference,object,cpv_code,award_date,
      amount,currency,duration_months,procedure,nature,
      buyer:organizations!public_awards_buyer_org_id_fkey(id,canonical_name,siren,siret),
      supplier:organizations!public_awards_supplier_org_id_fkey(id,canonical_name,siren,siret)
      `
    )
    .in("supplier_org_id", organizations.map((x) => x.id))
    .order("award_date", { ascending: false, nullsFirst: false })
    .limit(clampLimit(limit, 500));

  if (error) throw error;
  const awards = data || [];

  return {
    query: supplier,
    organizations,
    summary: summarizeAwards(awards),
    awards
  };
}

export async function getSourceEvidence({ source, sourceId, limit = 25 } = {}) {
  const client = requireDatabase();
  let request = client
    .from("raw_items")
    .select("id,source_id,source_record_id,source_url,published_at,fetched_at,content_hash,payload")
    .order("fetched_at", { ascending: false })
    .limit(clampLimit(limit, 100));

  if (source) request = request.eq("source_id", source);
  if (sourceId) request = request.eq("source_record_id", sourceId);

  const { data, error } = await request;
  if (error) throw error;
  return { count: data?.length ?? 0, items: data || [] };
}

export async function persistDecpAwards(records, { collectorRunId = null } = {}) {
  const client = requireDatabase();
  const results = [];

  for (const input of records || []) {
    const award = normalizeDecpAwardRecord(input);
    if (!award.sourceRecordId) continue;

    const rawString = stableStringify(award.raw);
    const contentHash = sha256(rawString);

    let rawId = null;
    const { data: existingRaw, error: rawLookupError } = await client
      .from("raw_items")
      .select("id")
      .eq("source_id", "decp")
      .eq("source_record_id", award.sourceRecordId)
      .eq("content_hash", contentHash)
      .maybeSingle();

    if (rawLookupError) throw rawLookupError;

    if (existingRaw?.id) {
      rawId = existingRaw.id;
    } else {
      const { data: raw, error: rawError } = await client
        .from("raw_items")
        .insert({
          source_id: "decp",
          source_record_id: award.sourceRecordId,
          source_url: award.sourceUrl,
          published_at: award.publicationDate || award.awardDate || null,
          content_hash: contentHash,
          media_type: "application/json",
          payload: award.raw,
          collector_run_id: collectorRunId
        })
        .select("id")
        .single();

      if (rawError) throw rawError;
      rawId = raw.id;
    }

    const buyer = await findOrCreateOrganization(client, award.buyer, "buyer");

    const suppliers = award.suppliers.length ? award.suppliers : [null];
    for (const supplierEntity of suppliers) {
      const supplier = supplierEntity
        ? await findOrCreateOrganization(client, supplierEntity, "supplier")
        : null;

      const dedupeKey = sha256([
        award.sourceRecordId,
        award.contractReference,
        award.lotReference,
        supplier?.id,
        award.awardDate,
        award.amount
      ].map((x) => x ?? "").join("|"));

      const row = {
        buyer_org_id: buyer?.id || null,
        supplier_org_id: supplier?.id || null,
        contract_reference: award.contractReference,
        lot_reference: award.lotReference,
        source_record_id: award.sourceRecordId,
        dedupe_key: dedupeKey,
        object: award.object,
        cpv_code: award.cpvCode,
        award_date: award.awardDate,
        duration_months: award.durationMonths,
        amount: award.amount,
        currency: award.currency,
        procedure: award.procedure,
        nature: award.nature,
        source_raw_item_id: rawId
      };

      const { data, error } = await client
        .from("public_awards")
        .upsert(row, { onConflict: "dedupe_key" })
        .select("id")
        .single();

      if (error) throw error;
      results.push({
        awardId: data.id,
        sourceRecordId: award.sourceRecordId,
        buyerId: buyer?.id || null,
        supplierId: supplier?.id || null
      });
    }
  }

  return {
    persisted: true,
    inputRecords: records?.length ?? 0,
    awardRows: results.length,
    results
  };
}


export async function getExpiringContracts({
  from,
  to,
  query,
  buyer,
  limit = 200
} = {}) {
  const client = requireDatabase();
  if (!from || !to) throw new Error("from and to are required");

  const buyerMatches = buyer ? await findOrganizationIds(client, buyer) : [];
  if (buyer && !buyerMatches.length) {
    return { from, to, total: 0, items: [] };
  }

  let request = client
    .from("public_awards_enriched")
    .select(
      `
      id,source_record_id,contract_reference,lot_reference,object,cpv_code,
      award_date,contract_start_date,contract_end_date,duration_months,
      effective_end_date,end_date_kind,amount,currency,procedure,nature,
      buyer:organizations!public_awards_buyer_org_id_fkey(id,canonical_name,siren,siret),
      supplier:organizations!public_awards_supplier_org_id_fkey(id,canonical_name,siren,siret)
      `,
      { count: "exact" }
    )
    .not("effective_end_date", "is", null)
    .gte("effective_end_date", from)
    .lte("effective_end_date", to)
    .order("effective_end_date", { ascending: true })
    .limit(clampLimit(limit, 500));

  const text = cleanSearch(query);
  if (text) request = request.ilike("object", `%${text}%`);
  if (buyerMatches.length) {
    request = request.in("buyer_org_id", buyerMatches.map((x) => x.id));
  }

  const { data, error, count } = await request;
  if (error) throw error;

  return {
    from,
    to,
    total: count ?? data?.length ?? 0,
    evidenceNote:
      "end_date_kind=explicit is a stored contract end date; estimated_from_duration is calculated from start/award date plus duration_months.",
    items: data || []
  };
}

export async function findPublicMarketPartners({
  query,
  cpvCode,
  from,
  limit = 50
} = {}) {
  const client = requireDatabase();
  let request = client
    .from("public_awards")
    .select(
      `
      id,object,cpv_code,award_date,amount,currency,
      buyer:organizations!public_awards_buyer_org_id_fkey(id,canonical_name,siren,siret),
      supplier:organizations!public_awards_supplier_org_id_fkey(id,canonical_name,siren,siret)
      `
    )
    .not("supplier_org_id", "is", null)
    .order("award_date", { ascending: false })
    .limit(2000);

  const text = cleanSearch(query);
  if (text) request = request.ilike("object", `%${text}%`);
  if (cpvCode) request = request.eq("cpv_code", cpvCode);
  if (from) request = request.gte("award_date", from);

  const { data, error } = await request;
  if (error) throw error;

  const grouped = new Map();

  for (const award of data || []) {
    const supplier = award.supplier;
    if (!supplier?.id) continue;

    const current = grouped.get(supplier.id) || {
      supplier,
      awardRows: 0,
      knownAmountTotal: 0,
      amountRows: 0,
      lastAwardDate: null,
      buyers: new Map(),
      examples: []
    };

    current.awardRows += 1;

    const amount = Number(award.amount);
    if (Number.isFinite(amount)) {
      current.knownAmountTotal += amount;
      current.amountRows += 1;
    }

    if (award.award_date && (!current.lastAwardDate || award.award_date > current.lastAwardDate)) {
      current.lastAwardDate = award.award_date;
    }

    if (award.buyer?.id) {
      current.buyers.set(award.buyer.id, award.buyer);
    }

    if (current.examples.length < 5) {
      current.examples.push({
        object: award.object,
        cpvCode: award.cpv_code,
        awardDate: award.award_date,
        amount: award.amount,
        buyer: award.buyer
      });
    }

    grouped.set(supplier.id, current);
  }

  const items = [...grouped.values()]
    .map((item) => ({
      supplier: item.supplier,
      awardRows: item.awardRows,
      knownAmountTotal: item.amountRows ? item.knownAmountTotal : null,
      observedBuyers: [...item.buyers.values()],
      lastAwardDate: item.lastAwardDate,
      examples: item.examples
    }))
    .sort((a, b) => b.awardRows - a.awardRows)
    .slice(0, clampLimit(limit, 200));

  return {
    query: query || null,
    cpvCode: cpvCode || null,
    from: from || null,
    note:
      "This is a factual shortlist of suppliers observed on matching awards, ordered by matching award-row count. It is not a recommendation or win-probability estimate.",
    count: items.length,
    items
  };
}


export async function comparePersistedFreelanceRoles({
  days = 90,
  clusters,
  limit = 5000
} = {}) {
  const client = requireDatabase();
  const safeDays = Math.min(Math.max(Number(days) || 90, 1), 730);
  const cutoff = new Date(Date.now() - safeDays * 86400000).toISOString();

  const { data, error } = await client
    .from("opportunities")
    .select(
      `
      id,title,description,published_at,tjm_min,tjm_max,remote_mode,
      opportunity_sources(
        raw:raw_items(source_id)
      )
      `
    )
    .eq("opportunity_type", "freelance_ai")
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(Math.min(Math.max(Number(limit) || 5000, 1), 10000));

  if (error) throw error;

  const records = (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    publishedAt: item.published_at,
    tjmMin: item.tjm_min,
    tjmMax: item.tjm_max,
    remoteMode: item.remote_mode,
    source:
      item.opportunity_sources?.[0]?.raw?.source_id ||
      "persisted"
  }));

  return {
    windowDays: safeDays,
    cutoff,
    ...compareRoleRecords(records, clusters)
  };
}
