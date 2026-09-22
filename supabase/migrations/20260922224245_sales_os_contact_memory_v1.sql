create table if not exists public.sales_contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null references public.workspaces(id) on delete cascade,
  organization_id uuid null references public.organizations(id) on delete set null,

  account_key text not null,
  account_name text not null,

  first_name text null,
  last_name text null,
  full_name text null,
  role_title text null,
  matched_role text null,

  linkedin_url text not null,
  source text not null default 'public_search_candidate',
  evidence_url text null,
  trigger_title text null,
  trigger_url text null,
  relevance_score smallint null check (relevance_score between 0 and 100),

  verification_status text not null default 'candidate'
    check (verification_status in ('candidate','verified','rejected')),

  email_b2b text null,
  email_direct text null,
  phone text null,
  enrichment_provider text null,
  enrichment_status text not null default 'not_requested'
    check (enrichment_status in ('not_requested','requested','enriched','not_found','error')),
  enrichment_requested_at timestamptz null,
  enriched_at timestamptz null,

  waalaxy_prospect_id text null,
  waalaxy_list_id text null,
  waalaxy_campaign_id text null,
  outreach_status text not null default 'not_started'
    check (outreach_status in ('not_started','queued','active','replied','meeting','proposal','won','lost','stopped')),
  last_contacted_at timestamptz null,
  next_action_at timestamptz null,

  do_not_contact boolean not null default false,
  notes text null,
  metadata jsonb not null default '{}'::jsonb,

  created_by uuid null references auth.users(id) on delete set null,
  updated_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sales_contacts_linkedin_url_key unique (linkedin_url)
);

comment on table public.sales_contacts is
  'Server-only commercial contact memory. Public-search candidates must be verified before enrichment or outreach. Contains personal data.';

create index if not exists sales_contacts_account_key_idx
  on public.sales_contacts (account_key, relevance_score desc);

create index if not exists sales_contacts_workspace_status_idx
  on public.sales_contacts (workspace_id, outreach_status, updated_at desc);

create index if not exists sales_contacts_next_action_idx
  on public.sales_contacts (next_action_at)
  where next_action_at is not null and do_not_contact = false;

alter table public.sales_contacts enable row level security;

revoke all on table public.sales_contacts from anon, authenticated;
grant select, insert, update, delete on table public.sales_contacts to service_role;

create table if not exists public.sales_contact_events (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.sales_contacts(id) on delete cascade,
  workspace_id uuid null references public.workspaces(id) on delete cascade,

  event_type text not null
    check (event_type in (
      'candidate_saved',
      'verified',
      'rejected',
      'enrichment_requested',
      'enriched',
      'enrichment_not_found',
      'waalaxy_queued',
      'waalaxy_imported',
      'outreach_started',
      'message_sent',
      'reply_received',
      'meeting_booked',
      'proposal_sent',
      'won',
      'lost',
      'stopped',
      'opt_out'
    )),
  channel text null,
  occurred_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.sales_contact_events is
  'Append-only commercial contact event ledger used for auditability and later outcome learning. Server-only while cockpit auth is not active.';

create index if not exists sales_contact_events_contact_time_idx
  on public.sales_contact_events (contact_id, occurred_at desc);

create index if not exists sales_contact_events_workspace_time_idx
  on public.sales_contact_events (workspace_id, occurred_at desc);

create index if not exists sales_contact_events_type_time_idx
  on public.sales_contact_events (event_type, occurred_at desc);

alter table public.sales_contact_events enable row level security;

revoke all on table public.sales_contact_events from anon, authenticated;
grant select, insert on table public.sales_contact_events to service_role;
