create table public.training_prospect_records (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 source_key text not null check (length(source_key) between 1 and 2000),
 source_url text not null,
 snapshot jsonb not null default '{}'::jsonb,
 draft jsonb not null default '{}'::jsonb,
 revision integer not null default 1 check(revision>0),
 updated_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(workspace_id,source_key)
);
create table public.training_prospect_events (
 id uuid primary key default gen_random_uuid(),
 record_id uuid not null references public.training_prospect_records(id),
 workspace_id uuid not null references public.workspaces(id),
 actor_user_id uuid not null references auth.users(id),
 event_type text not null,
 payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index training_prospect_events_record_time on public.training_prospect_events(record_id,created_at desc);
create index training_prospect_records_actor on public.training_prospect_records(updated_by);
create index training_prospect_events_actor on public.training_prospect_events(actor_user_id);
create index training_prospect_events_workspace on public.training_prospect_events(workspace_id);
alter table public.training_prospect_records enable row level security;
alter table public.training_prospect_events enable row level security;
revoke all on public.training_prospect_records,public.training_prospect_events from anon,authenticated;
grant all on public.training_prospect_records,public.training_prospect_events to service_role;
create function public.save_training_prospect(
 p_workspace_id uuid,p_actor_user_id uuid,p_source_key text,p_source_url text,
 p_snapshot jsonb,p_draft jsonb,p_expected_revision integer
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare existing public.training_prospect_records; saved public.training_prospect_records;
begin
 if not exists(select 1 from public.workspace_members m where m.workspace_id=p_workspace_id and m.user_id=p_actor_user_id and m.active and m.role<>'viewer') then raise exception 'workspace_write_denied'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_workspace_id::text||':'||p_source_key,0));
 select * into existing from public.training_prospect_records where workspace_id=p_workspace_id and source_key=p_source_key for update;
 if coalesce(existing.revision,0)<>p_expected_revision then raise exception 'revision_conflict'; end if;
 insert into public.training_prospect_records(workspace_id,source_key,source_url,snapshot,draft,updated_by)
 values(p_workspace_id,p_source_key,p_source_url,p_snapshot,p_draft,p_actor_user_id)
 on conflict(workspace_id,source_key) do update set draft=excluded.draft,snapshot=excluded.snapshot,source_url=excluded.source_url,updated_by=excluded.updated_by,revision=training_prospect_records.revision+1,updated_at=now()
 returning * into saved;
 insert into public.training_prospect_events(record_id,workspace_id,actor_user_id,event_type,payload)
 values(saved.id,p_workspace_id,p_actor_user_id,case when existing.id is null then 'created' else 'saved' end,
 jsonb_build_object('revision',saved.revision,'from_stage',existing.draft->>'stage','to_stage',p_draft->>'stage','next_followup',p_draft->>'nextFollowup','do_not_contact',p_draft->'doNotContact'));
 return to_jsonb(saved);
end; $$;
revoke all on function public.save_training_prospect(uuid,uuid,text,text,jsonb,jsonb,integer) from public,anon,authenticated;
grant execute on function public.save_training_prospect(uuid,uuid,text,text,jsonb,jsonb,integer) to service_role;
