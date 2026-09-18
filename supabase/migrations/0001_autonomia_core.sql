-- Autonomia Market Intelligence core schema
-- Facts from sources and AI analyses are deliberately separated.

create extension if not exists pgcrypto;
create extension if not exists vector with schema extensions;

create table if not exists public.sources (
  id text primary key,
  name text not null,
  source_group text not null check (source_group in ('freelance','public','training','private')),
  priority text not null check (priority in ('P0','P1','P2','P3')),
  access_mode text not null,
  base_url text,
  status text not null default 'planned',
  terms_url text,
  robots_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collector_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text references public.sources(id) on delete set null,
  trigger_mode text not null default 'on_demand',
  query_payload jsonb not null default '{}'::jsonb,
  status text not null check (status in ('running','success','partial','failed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  stats jsonb not null default '{}'::jsonb,
  error_message text
);

create table if not exists public.raw_items (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.sources(id) on delete restrict,
  source_record_id text,
  source_url text,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  content_hash text not null,
  media_type text,
  payload jsonb not null,
  collector_run_id uuid references public.collector_runs(id) on delete set null,
  unique (source_id, source_record_id, content_hash)
);

create index if not exists raw_items_source_fetched_idx
  on public.raw_items(source_id, fetched_at desc);
create index if not exists raw_items_source_record_idx
  on public.raw_items(source_id, source_record_id);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  organization_type text,
  siren text,
  siret text,
  country_code text,
  website text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organizations_siren_unique
  on public.organizations(siren) where siren is not null;
create unique index if not exists organizations_siret_unique
  on public.organizations(siret) where siret is not null;
create index if not exists organizations_name_idx
  on public.organizations using gin (to_tsvector('simple', canonical_name));

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  opportunity_type text not null check (
    opportunity_type in ('freelance_ai','public_ai','training_ai','private_ai')
  ),
  title text not null,
  description text,
  buyer_org_id uuid references public.organizations(id) on delete set null,
  company_org_id uuid references public.organizations(id) on delete set null,
  published_at timestamptz,
  deadline_at timestamptz,
  status text not null default 'observed',
  procedure text,
  contract_type text,
  location text,
  remote_mode text,
  currency text default 'EUR',
  budget_min numeric,
  budget_max numeric,
  tjm_min numeric,
  tjm_max numeric,
  dedupe_key text unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_type_date_idx
  on public.opportunities(opportunity_type, published_at desc);
create index if not exists opportunities_deadline_idx
  on public.opportunities(deadline_at) where deadline_at is not null;
create index if not exists opportunities_title_search_idx
  on public.opportunities using gin (to_tsvector('simple', title || ' ' || coalesce(description,'')));

create table if not exists public.opportunity_sources (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  raw_item_id uuid not null references public.raw_items(id) on delete cascade,
  match_method text not null default 'exact',
  match_confidence numeric check (match_confidence is null or (match_confidence >= 0 and match_confidence <= 1)),
  created_at timestamptz not null default now(),
  unique (opportunity_id, raw_item_id)
);

create table if not exists public.opportunity_versions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  raw_item_id uuid references public.raw_items(id) on delete set null,
  observed_at timestamptz not null default now(),
  facts jsonb not null,
  facts_hash text not null,
  unique (opportunity_id, facts_hash)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  aliases text[] not null default '{}'
);

create table if not exists public.opportunity_skills (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  evidence_type text not null check (evidence_type in ('explicit','inferred')),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  source_raw_item_id uuid references public.raw_items(id) on delete set null,
  primary key (opportunity_id, skill_id, evidence_type)
);

create table if not exists public.public_awards (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  buyer_org_id uuid references public.organizations(id) on delete set null,
  supplier_org_id uuid references public.organizations(id) on delete set null,
  contract_reference text,
  lot_reference text,
  award_date date,
  contract_start_date date,
  contract_end_date date,
  amount numeric,
  currency text default 'EUR',
  source_raw_item_id uuid references public.raw_items(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists public_awards_buyer_date_idx
  on public.public_awards(buyer_org_id, award_date desc);
create index if not exists public_awards_supplier_date_idx
  on public.public_awards(supplier_org_id, award_date desc);

create table if not exists public.market_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  signal_type text not null,
  title text not null,
  description text,
  occurred_at timestamptz,
  evidence_kind text not null default 'source_fact' check (evidence_kind in ('source_fact','inferred')),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  source_raw_item_id uuid references public.raw_items(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  analysis_type text not null,
  model_provider text,
  model_name text,
  model_version text,
  input_hash text,
  payload jsonb not null,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  created_at timestamptz not null default now()
);

create index if not exists analyses_opportunity_idx
  on public.analyses(opportunity_id, analysis_type, created_at desc);

create table if not exists public.opportunity_embeddings (
  opportunity_id uuid primary key references public.opportunities(id) on delete cascade,
  model text not null,
  dimensions integer,
  embedding extensions.vector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  query jsonb not null,
  enabled boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now()
);

-- Secure-by-default: browser clients get no table access until explicit team policies are added.
alter table public.sources enable row level security;
alter table public.collector_runs enable row level security;
alter table public.raw_items enable row level security;
alter table public.organizations enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_sources enable row level security;
alter table public.opportunity_versions enable row level security;
alter table public.skills enable row level security;
alter table public.opportunity_skills enable row level security;
alter table public.public_awards enable row level security;
alter table public.market_signals enable row level security;
alter table public.analyses enable row level security;
alter table public.opportunity_embeddings enable row level security;
alter table public.watchlists enable row level security;

-- Watchlists are private to their authenticated owner.
create policy "watchlists_select_own"
  on public.watchlists for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "watchlists_insert_own"
  on public.watchlists for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "watchlists_update_own"
  on public.watchlists for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "watchlists_delete_own"
  on public.watchlists for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

insert into public.sources (id, name, source_group, priority, access_mode, status)
values
  ('boamp','BOAMP','public','P0','official_api','active'),
  ('ted','TED / JOUE','public','P0','official_api','active'),
  ('decp','DECP','public','P0','open_data','planned'),
  ('place','PLACE','public','P0','public_portal','planned'),
  ('freelancemention','FreelanceMention','freelance','P0','official_api','ready_for_credentials'),
  ('linkedin','LinkedIn / Data Sales','freelance','P0','authorized_access_only','planned'),
  ('indeed','Indeed.fr','freelance','P1','public_or_authorized_access','planned'),
  ('malt','Malt','freelance','P1','public_or_authorized_access','planned'),
  ('upwork','Upwork','freelance','P1','official_or_authorized_api','planned'),
  ('freework','Free-Work','freelance','P1','public_pages','planned'),
  ('lehibou','LeHibou','freelance','P1','public_pages','planned'),
  ('opco','11 OPCO','training','P0','public_portals','planned'),
  ('mcf_offer','Mon Compte Formation - offre','training','P1','open_data','planned'),
  ('mcf_usage','Mon Compte Formation - usages','training','P1','open_data','planned')
on conflict (id) do update set
  name = excluded.name,
  source_group = excluded.source_group,
  priority = excluded.priority,
  access_mode = excluded.access_mode,
  status = excluded.status,
  updated_at = now();
