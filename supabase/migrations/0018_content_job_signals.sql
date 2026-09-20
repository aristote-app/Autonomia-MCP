-- Mirrors the content_job_signals table already present in the dedicated Autonomia database.
-- This file exists to remove schema drift for fresh environments.

create table if not exists public.content_job_signals (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.sources(id) on delete restrict,
  source_record_id text not null,
  title text not null,
  company_name text,
  location text,
  contract_type text,
  source_url text,
  published_at timestamptz,
  source_updated_at timestamptz,
  roles text[] not null default '{}',
  skills text[] not null default '{}',
  tools text[] not null default '{}',
  use_cases text[] not null default '{}',
  signal_keys text[] not null default '{}',
  keyword_seeds text[] not null default '{}',
  description_hash text,
  raw_payload jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (source_id, source_record_id)
);

create index if not exists content_job_signals_published_idx
  on public.content_job_signals(published_at desc);
create index if not exists content_job_signals_signal_keys_gin
  on public.content_job_signals using gin(signal_keys);
create index if not exists content_job_signals_skills_gin
  on public.content_job_signals using gin(skills);
create index if not exists content_job_signals_tools_gin
  on public.content_job_signals using gin(tools);
create index if not exists content_job_signals_keyword_seeds_gin
  on public.content_job_signals using gin(keyword_seeds);

alter table public.content_job_signals enable row level security;
