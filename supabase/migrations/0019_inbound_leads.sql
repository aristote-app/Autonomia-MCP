-- Canonical inbound acquisition storage for website / LP / paid-media leads.
-- Browser clients receive no direct table policies; ingestion is server-side only.

insert into public.sources (id, name, source_group, priority, access_mode, status)
values (
  'website_inbound',
  'Autonomia Website / Landing Pages',
  'private',
  'P0',
  'server_ingest',
  'active'
)
on conflict (id) do update set
  name = excluded.name,
  source_group = excluded.source_group,
  priority = excluded.priority,
  access_mode = excluded.access_mode,
  status = excluded.status,
  updated_at = now();

create table if not exists public.inbound_leads (
  id uuid primary key default gen_random_uuid(),
  external_lead_id text,
  source_channel text not null,
  source_platform text not null,
  first_name text,
  last_name text,
  email text,
  phone text,
  job_title text,
  company_name text,
  company_domain text,
  company_org_id uuid references public.organizations(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  requested_service text,
  message text,
  desired_timeline text,
  company_size text,
  preferred_contact_channel text,
  status text not null default 'new' check (
    status in (
      'new','enriched','qualified','needs_review','contacted',
      'meeting','proposal','negotiation','won','lost','disqualified'
    )
  ),
  marketing_consent boolean,
  consent_timestamp timestamptz,
  privacy_notice_version text,
  consent_source text,
  first_touch jsonb not null default '{}'::jsonb,
  latest_attribution jsonb not null default '{}'::jsonb,
  scan_context jsonb,
  dedupe_key text not null unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inbound_touchpoints (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.inbound_leads(id) on delete cascade,
  external_lead_id text,
  received_at timestamptz,
  source_channel text not null,
  source_platform text not null,
  landing_page_url text,
  landing_page_topic text,
  referrer_url text,
  form_id text,
  attribution jsonb not null default '{}'::jsonb,
  consent jsonb not null default '{}'::jsonb,
  raw_payload jsonb not null,
  payload_hash text not null,
  created_at timestamptz not null default now(),
  unique (lead_id, payload_hash)
);

create index if not exists inbound_leads_status_seen_idx
  on public.inbound_leads(status, last_seen_at desc);
create index if not exists inbound_leads_company_idx
  on public.inbound_leads(company_org_id, last_seen_at desc);
create index if not exists inbound_leads_opportunity_idx
  on public.inbound_leads(opportunity_id)
  where opportunity_id is not null;
create index if not exists inbound_leads_email_lower_idx
  on public.inbound_leads(lower(email))
  where email is not null;
create index if not exists inbound_touchpoints_lead_created_idx
  on public.inbound_touchpoints(lead_id, created_at desc);

alter table public.inbound_leads enable row level security;
alter table public.inbound_touchpoints enable row level security;

comment on table public.inbound_leads is
  'Canonical inbound commercial leads. No browser policies: writes and reads are server-side until team auth/RLS is explicitly added.';

comment on table public.inbound_touchpoints is
  'Immutable-ish source evidence for each inbound submission/touchpoint, preserving raw payload and attribution history.';
