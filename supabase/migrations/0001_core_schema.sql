create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  siren text,
  siret text,
  sector text,
  website text,
  country text default 'FR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organizations_siren_uidx
  on public.organizations (siren)
  where siren is not null;

create table if not exists public.sources (
  id text primary key,
  name text not null,
  group_name text not null,
  mode text not null,
  priority text not null default 'P2',
  status text not null default 'planned',
  terms_url text,
  robots_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collector_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.sources(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  query jsonb not null default '{}'::jsonb,
  items_seen integer not null default 0,
  items_created integer not null default 0,
  items_updated integer not null default 0,
  error text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.raw_items (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.sources(id) on delete cascade,
  source_record_id text,
  source_url text,
  fetched_at timestamptz not null default now(),
  published_at timestamptz,
  content_hash text,
  payload jsonb not null,
  unique(source_id, source_record_id)
);

create index if not exists raw_items_source_idx on public.raw_items(source_id);
create index if not exists raw_items_fetched_idx on public.raw_items(fetched_at desc);
create index if not exists raw_items_hash_idx on public.raw_items(content_hash);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null unique,
  opportunity_type text not null check (
    opportunity_type in ('freelance_ai','public_ai','training_ai','private_ai')
  ),
  title text not null,
  description text,
  buyer_organization_id uuid references public.organizations(id) on delete set null,
  company_organization_id uuid references public.organizations(id) on delete set null,
  status text not null default 'open',
  published_at timestamptz,
  deadline_at timestamptz,
  city text,
  region text,
  country text default 'FR',
  remote_mode text,
  duration_text text,
  tjm_min numeric,
  tjm_max numeric,
  budget_min numeric,
  budget_max numeric,
  currency text default 'EUR',
  procedure text,
  contract_type text,
  cpv_codes text[] not null default '{}',
  ai_domains text[] not null default '{}',
  tech_stack text[] not null default '{}',
  training_topics text[] not null default '{}',
  source_count integer not null default 0,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  closed_at timestamptz,
  search_document tsvector generated always as (
    to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_type_idx on public.opportunities(opportunity_type);
create index if not exists opportunities_deadline_idx on public.opportunities(deadline_at);
create index if not exists opportunities_last_seen_idx on public.opportunities(last_seen_at desc);
create index if not exists opportunities_search_idx on public.opportunities using gin(search_document);
create index if not exists opportunities_ai_domains_idx on public.opportunities using gin(ai_domains);

create table if not exists public.opportunity_sources (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  raw_item_id uuid references public.raw_items(id) on delete set null,
  source_id text not null references public.sources(id) on delete cascade,
  source_record_id text,
  source_url text,
  evidence jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique(opportunity_id, source_id, source_record_id)
);

create index if not exists opportunity_sources_opp_idx on public.opportunity_sources(opportunity_id);
create index if not exists opportunity_sources_source_idx on public.opportunity_sources(source_id);

create table if not exists public.opportunity_versions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  observed_at timestamptz not null default now(),
  snapshot jsonb not null,
  source_id text references public.sources(id) on delete set null
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunity_skills (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  requirement_level text not null default 'mentioned',
  confidence numeric,
  evidence text,
  primary key(opportunity_id, skill_id)
);

create table if not exists public.public_awards (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  buyer_organization_id uuid references public.organizations(id) on delete set null,
  supplier_organization_id uuid references public.organizations(id) on delete set null,
  source_id text references public.sources(id) on delete set null,
  source_record_id text,
  awarded_at timestamptz,
  amount numeric,
  currency text default 'EUR',
  duration_months numeric,
  lot_number text,
  raw jsonb not null default '{}'::jsonb
);

create index if not exists public_awards_buyer_idx on public.public_awards(buyer_organization_id);
create index if not exists public_awards_supplier_idx on public.public_awards(supplier_organization_id);

create table if not exists public.market_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  source_id text references public.sources(id) on delete set null,
  source_url text,
  signal_type text not null,
  title text not null,
  summary text,
  signal_date timestamptz,
  importance integer check (importance between 1 and 5),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  analysis_type text not null,
  model text,
  prompt_version text,
  output jsonb not null,
  confidence numeric,
  evidence_refs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analyses_entity_idx on public.analyses(entity_type, entity_id);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  query jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  title text,
  city text,
  country text default 'FR',
  remote_ok boolean not null default true,
  tjm_min numeric,
  tjm_target numeric,
  available_from date,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultant_skills (
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level text,
  years_experience numeric,
  primary key(consultant_id, skill_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  consultant_id uuid references public.consultants(id) on delete cascade,
  match_type text not null default 'staffing',
  score numeric not null,
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists matches_opportunity_idx on public.matches(opportunity_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organizations_touch_updated_at on public.organizations;
create trigger organizations_touch_updated_at
before update on public.organizations
for each row execute function public.touch_updated_at();

drop trigger if exists opportunities_touch_updated_at on public.opportunities;
create trigger opportunities_touch_updated_at
before update on public.opportunities
for each row execute function public.touch_updated_at();

drop trigger if exists watchlists_touch_updated_at on public.watchlists;
create trigger watchlists_touch_updated_at
before update on public.watchlists
for each row execute function public.touch_updated_at();

drop trigger if exists consultants_touch_updated_at on public.consultants;
create trigger consultants_touch_updated_at
before update on public.consultants
for each row execute function public.touch_updated_at();
