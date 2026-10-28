create table public.training_outreach_jobs (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 record_id uuid not null references public.training_prospect_records(id),
 channel text not null check(channel='waalaxy'),
 profile_url text not null,
 status text not null check(status in ('running','done','unknown')),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(workspace_id,channel,profile_url)
);
create index training_outreach_jobs_record on public.training_outreach_jobs(record_id);
create index training_outreach_jobs_actor on public.training_outreach_jobs(created_by);
alter table public.training_outreach_jobs enable row level security;
revoke all on public.training_outreach_jobs from anon,authenticated;
grant all on public.training_outreach_jobs to service_role;
