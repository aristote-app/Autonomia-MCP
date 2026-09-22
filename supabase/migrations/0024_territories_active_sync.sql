alter table public.territories
  add column if not exists active boolean not null default true;

drop view if exists public.territory_acquisition_v1;

create view public.territory_acquisition_v1 as
with explicit_signals as (
  select territory_id, count(*)::integer as signal_count, max(detected_at) as last_signal_at
  from public.territory_signals
  group by territory_id
),
opportunity_signals as (
  select t.id as territory_id,
         count(distinct o.id)::integer as signal_count,
         max(coalesce(o.published_at,o.first_seen_at)) as last_signal_at
  from public.territories t
  join public.organizations org on org.siren = t.siren
  join public.opportunities o on o.buyer_org_id = org.id
  group by t.id
)
select t.*,
       coalesce(es.signal_count,0) + coalesce(os.signal_count,0) as signal_count,
       greatest(es.last_signal_at, os.last_signal_at) as last_signal_at,
       (coalesce(es.signal_count,0) + coalesce(os.signal_count,0) > 0) as has_signal
from public.territories t
left join explicit_signals es on es.territory_id = t.id
left join opportunity_signals os on os.territory_id = t.id;
