-- Expose primary source link and company name in the V2 opportunity read model.
-- Existing columns keep their order; new columns are appended for compatibility.

create or replace view public.opportunity_intelligence_v2
with (security_invoker=true)
as
select
  o.id,
  o.opportunity_type,
  o.title,
  o.description,
  o.published_at,
  o.deadline_at,
  case
    when o.deadline_at is null then 'unknown'
    when o.deadline_at < now() then 'closed_by_deadline'
    else 'open_by_deadline'
  end as actionability_state,
  case
    when o.deadline_at is null then null
    else floor(extract(epoch from (o.deadline_at-now()))/86400)::int
  end as days_to_deadline,
  o.status,
  o.location,
  o.budget_min,
  o.budget_max,
  org.canonical_name as buyer_name,
  classif.payload->'tags' as ai_tags,
  (classif.payload->>'is_ai_related')::boolean as is_ai_related,
  nullif(fit.payload->>'score','')::numeric as autonomia_fit_score,
  nullif(fit.payload->>'coverage_percent','')::numeric as fit_coverage_percent,
  staffing.payload->'roles' as inferred_staffing_roles,
  o.first_seen_at,
  o.last_seen_at,
  company.canonical_name as company_name,
  src.source_id as primary_source_id,
  src.source_url as primary_source_url,
  src.source_record_id as primary_source_record_id
from public.opportunities o
left join public.organizations org on org.id=o.buyer_org_id
left join public.organizations company on company.id=o.company_org_id
left join lateral (
  select a.payload
  from public.analyses a
  where a.opportunity_id=o.id and a.analysis_type='market_classification_v2'
  order by a.created_at desc
  limit 1
) classif on true
left join lateral (
  select a.payload
  from public.analyses a
  where a.opportunity_id=o.id and a.analysis_type='autonomia_fit_v2'
  order by a.created_at desc
  limit 1
) fit on true
left join lateral (
  select a.payload
  from public.analyses a
  where a.opportunity_id=o.id and a.analysis_type='staffing_requirements_v2'
  order by a.created_at desc
  limit 1
) staffing on true
left join lateral (
  select
    r.source_id,
    r.source_url,
    r.source_record_id
  from public.opportunity_sources os
  join public.raw_items r on r.id=os.raw_item_id
  where os.opportunity_id=o.id
  order by r.published_at desc nulls last, r.fetched_at desc
  limit 1
) src on true;

comment on view public.opportunity_intelligence_v2 is
  'Preferred V2 decision-support view. Tags, fit and staffing are inferred; company/source facts come from canonical organizations and raw evidence.';
