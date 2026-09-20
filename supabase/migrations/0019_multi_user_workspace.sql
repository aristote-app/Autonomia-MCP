-- Multi-user Autonomia workspace foundation.
-- Browser roles remain closed by default; application access is mediated by authenticated server routes.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (
    role in (
      'admin',
      'direction',
      'public_markets',
      'sales',
      'staffing',
      'contributor',
      'viewer'
    )
  ),
  active boolean not null default true,
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  item_type text not null check (
    item_type in ('opportunity','job_signal','inbound_lead')
  ),
  item_id uuid not null,
  owner_user_id uuid references auth.users(id) on delete set null,
  stage text not null default 'new' check (
    stage in (
      'new',
      'review',
      'go',
      'no_go',
      'in_progress',
      'proposal',
      'submitted',
      'won',
      'lost',
      'archived'
    )
  ),
  priority text not null default 'normal' check (
    priority in ('low','normal','high','urgent')
  ),
  next_action text,
  due_at timestamptz,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, item_type, item_id)
);

create table if not exists public.work_item_comments (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references public.work_items(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workspace_members_user_idx
  on public.workspace_members(user_id, active);
create index if not exists workspace_members_invited_by_idx
  on public.workspace_members(invited_by) where invited_by is not null;
create index if not exists workspaces_created_by_idx
  on public.workspaces(created_by) where created_by is not null;
create index if not exists work_items_workspace_stage_idx
  on public.work_items(workspace_id, stage, updated_at desc);
create index if not exists work_items_owner_idx
  on public.work_items(owner_user_id, stage, due_at);
create index if not exists work_items_updated_by_idx
  on public.work_items(updated_by) where updated_by is not null;
create index if not exists activity_log_workspace_created_idx
  on public.activity_log(workspace_id, created_at desc);
create index if not exists activity_log_actor_idx
  on public.activity_log(actor_user_id) where actor_user_id is not null;
create index if not exists work_item_comments_item_created_idx
  on public.work_item_comments(work_item_id, created_at);
create index if not exists work_item_comments_author_idx
  on public.work_item_comments(author_user_id) where author_user_id is not null;

alter table public.user_profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.work_items enable row level security;
alter table public.work_item_comments enable row level security;
alter table public.activity_log enable row level security;

comment on table public.work_items is
  'Generic collaborative workflow for canonical opportunities, job signals and future inbound leads.';
comment on table public.activity_log is
  'Append-only application audit trail for meaningful workspace actions.';
