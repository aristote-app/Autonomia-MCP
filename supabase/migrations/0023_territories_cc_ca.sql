create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  siren text not null unique check (siren ~ '^[0-9]{9}$'),
  name text not null,
  territory_type text not null check (territory_type in ('CC','CA')),
  department_code text,
  arrondissement text,
  seat_commune text,
  population_total bigint,
  member_count integer,
  president_title text,
  president_last_name text,
  president_first_name text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  city text,
  phone text,
  email text,
  website text,
  banatic_url text,
  source_updated_at timestamptz,
  last_seen_at timestamptz not null default now(),
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists territories_type_idx on public.territories(territory_type);
create index if not exists territories_department_idx on public.territories(department_code);
create index if not exists territories_population_idx on public.territories(population_total desc);

create table if not exists public.territory_signals (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references public.territories(id) on delete cascade,
  signal_type text not null,
  signal_source text not null,
  title text not null,
  evidence_url text,
  detected_at timestamptz not null default now(),
  importance integer not null default 1 check (importance between 1 and 5),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists territory_signals_territory_idx
  on public.territory_signals(territory_id, detected_at desc);

create unique index if not exists territory_signals_dedupe_idx
  on public.territory_signals(
    territory_id,
    signal_type,
    coalesce(evidence_url,''),
    coalesce((payload->>'source_record_id'),'')
  );

alter table public.territories enable row level security;
alter table public.territory_signals enable row level security;

create or replace view public.territory_acquisition_v1 as
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

comment on table public.territories is
  'Prospecting universe restricted to French communautés de communes (CC) and communautés d''agglomération (CA), sourced from BANATIC/DGCL.';

comment on table public.territory_signals is
  'Acquisition trigger signals attached to CC/CA territories. Territories remain visible even without signals.';
