-- Canonical inbound acquisition leads.
-- Personal data remains closed by RLS; writes are server-side only until explicit workspace policies are added.

create table if not exists public.inbound_leads (
  id uuid primary key default gen_random_uuid(),
  external_lead_id text not null unique,
  workspace_id uuid references public.workspaces(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete set null,

  source_channel text not null,
  source_platform text not null,

  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  company_name text not null,

  requested_service text not null,
  message text,
  desired_timeline text,
  company_size text,

  status text not null default 'new' check (
    status in (
      'new','enriched','qualified','needs_review','contacted',
      'meeting','proposal','negotiation','won','lost','disqualified'
    )
  ),

  contact_key text not null,
  dedupe_key text not null,
  scan_context jsonb,

  marketing_consent boolean not null default false,
  consent_timestamp timestamptz not null,
  privacy_notice_version text not null,
  consent_source text not null,

  first_received_at timestamptz not null,
  last_received_at timestamptz not null,

  first_touch jsonb,
  latest_touch jsonb,
  attribution_history jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inbound_leads_status_idx
  on public.inbound_leads(status, last_received_at desc);

create index if not exists inbound_leads_workspace_idx
  on public.inbound_leads(workspace_id, last_received_at desc)
  where workspace_id is not null;

create index if not exists inbound_leads_owner_idx
  on public.inbound_leads(owner_user_id, status, last_received_at desc)
  where owner_user_id is not null;

create index if not exists inbound_leads_contact_key_idx
  on public.inbound_leads(contact_key, last_received_at desc);

create index if not exists inbound_leads_dedupe_key_idx
  on public.inbound_leads(dedupe_key, last_received_at desc);

create index if not exists inbound_leads_company_name_idx
  on public.inbound_leads using gin (to_tsvector('simple', company_name));

create table if not exists public.inbound_lead_touchpoints (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.inbound_leads(id) on delete cascade,
  occurred_at timestamptz not null,

  source_channel text not null,
  source_platform text not null,
  landing_page_url text,
  landing_page_topic text,
  referrer_url text,
  form_id text,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  campaign_id text,
  adset_id text,
  ad_id text,
  creative_id text,

  gclid text,
  fbclid text,

  first_touch jsonb,
  attribution_history jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists inbound_lead_touchpoints_lead_idx
  on public.inbound_lead_touchpoints(lead_id, occurred_at desc);

create index if not exists inbound_lead_touchpoints_campaign_idx
  on public.inbound_lead_touchpoints(utm_source, utm_campaign, occurred_at desc);

create table if not exists public.inbound_lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.inbound_leads(id) on delete cascade,
  event_type text not null,
  occurred_at timestamptz not null default now(),
  event_hash text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (lead_id, event_hash)
);

create index if not exists inbound_lead_events_lead_idx
  on public.inbound_lead_events(lead_id, occurred_at desc);

alter table public.inbound_leads enable row level security;
alter table public.inbound_lead_touchpoints enable row level security;
alter table public.inbound_lead_events enable row level security;

comment on table public.inbound_leads is
  'Canonical inbound commercial leads. Contains personal data; closed by RLS and intended for server-side access until explicit workspace policies are added.';

comment on table public.inbound_lead_touchpoints is
  'Normalized acquisition touchpoints linked to inbound leads for attribution and downstream business analytics.';

comment on table public.inbound_lead_events is
  'Immutable evidence of inbound lead events. Payload preserves the exact normalized contract received by the server.';
