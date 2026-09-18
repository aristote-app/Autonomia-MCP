-- Autonomia consultant pool and staffing matches

create table if not exists public.consultants (
  id uuid primary key default gen_random_uuid(),
  external_ref text,
  display_name text not null,
  status text not null default 'active',
  available_from date,
  tjm numeric,
  currency text default 'EUR',
  remote boolean not null default false,
  locations text[] not null default '{}',
  years_experience numeric,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists consultants_external_ref_unique
  on public.consultants(external_ref) where external_ref is not null;

create table if not exists public.consultant_skills (
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  proficiency numeric check (proficiency is null or (proficiency >= 0 and proficiency <= 100)),
  years_experience numeric,
  evidence text,
  updated_at timestamptz not null default now(),
  primary key (consultant_id, skill_id)
);

create table if not exists public.staffing_matches (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  score numeric check (score is null or (score >= 0 and score <= 100)),
  coverage numeric check (coverage is null or (coverage >= 0 and coverage <= 100)),
  hard_skill_gap boolean not null default false,
  explanation jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now(),
  unique (opportunity_id, consultant_id)
);

create index if not exists staffing_matches_opportunity_score_idx
  on public.staffing_matches(opportunity_id, hard_skill_gap, score desc);

create index if not exists staffing_matches_consultant_score_idx
  on public.staffing_matches(consultant_id, hard_skill_gap, score desc);

alter table public.consultants enable row level security;
alter table public.consultant_skills enable row level security;
alter table public.staffing_matches enable row level security;

-- No browser policies yet: consultant pool is server-side/private by default.
