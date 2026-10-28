create table public.email_campaigns (
 id uuid primary key, workspace_id uuid not null references public.workspaces(id),
 created_by uuid not null references auth.users(id), name text not null,
 subject text not null, body text not null,
 status text not null default 'queued' check(status in ('queued','paused','done','cancelled')),
 created_at timestamptz not null default now(), approved_at timestamptz not null default now()
);
create table public.email_campaign_recipients (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null references public.email_campaigns(id),
 workspace_id uuid not null references public.workspaces(id), email text not null,
 first_name text not null default '', company text not null default '', source text not null default '',
 subject text not null, body text not null,
 status text not null default 'queued' check(status in ('queued','sending','sent','failed','unknown','suppressed','replied','bounced')),
 unsubscribe_token uuid not null default gen_random_uuid() unique,
 attempted_at timestamptz, sent_at timestamptz, message_id text, error_code text,
 unique(campaign_id,email)
);
create index email_dispatch_idx on public.email_campaign_recipients(workspace_id,status,attempted_at);
create index email_recipient_lookup_idx on public.email_campaign_recipients(workspace_id,email);
create table public.email_suppressions (
 workspace_id uuid not null references public.workspaces(id), email text not null,
 reason text not null, created_at timestamptz not null default now(), primary key(workspace_id,email)
);
alter table public.email_campaigns enable row level security;
alter table public.email_campaign_recipients enable row level security;
alter table public.email_suppressions enable row level security;
revoke all on public.email_campaigns,public.email_campaign_recipients,public.email_suppressions from public,anon,authenticated;
grant all on public.email_campaigns,public.email_campaign_recipients,public.email_suppressions to service_role;

-- A repeated browser request with the same UUID returns the existing batch.
create or replace function public.enqueue_email_campaign(p_workspace uuid,p_actor uuid,p_id uuid,p_name text,p_subject text,p_body text,p_recipients jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare c jsonb; n integer := 0;
begin
 if not exists(select 1 from public.workspace_members where workspace_id=p_workspace and user_id=p_actor and active and role in ('admin','direction')) then raise exception 'not_authorized'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_workspace::text||':email',0));
 if exists(select 1 from public.email_campaigns where id=p_id and workspace_id=p_workspace) then
  return jsonb_build_object('id',p_id,'accepted',(select count(*) from public.email_campaign_recipients where campaign_id=p_id),'existing',true);
 end if;
 if jsonb_array_length(p_recipients) not between 1 and 1000 then raise exception 'invalid_contacts'; end if;
 insert into public.email_campaigns(id,workspace_id,created_by,name,subject,body) values(p_id,p_workspace,p_actor,p_name,p_subject,p_body);
 for c in select value from jsonb_array_elements(p_recipients) loop
  if exists(select 1 from public.email_suppressions where workspace_id=p_workspace and email=c->>'email') then continue; end if;
  if exists(select 1 from public.training_prospect_records where workspace_id=p_workspace and lower(draft->>'email')=c->>'email' and draft->>'doNotContact'='true') then continue; end if;
  if exists(select 1 from public.email_campaign_recipients where workspace_id=p_workspace and email=c->>'email' and (status in ('queued','sending','unknown','replied','bounced') or attempted_at>now()-interval '7 days')) then continue; end if;
  insert into public.email_campaign_recipients(campaign_id,workspace_id,email,first_name,company,source,subject,body)
  values(p_id,p_workspace,c->>'email',coalesce(c->>'firstName',''),coalesce(c->>'company',''),coalesce(c->>'source',''),c->>'subject',c->>'body') on conflict do nothing;
  n := n+1;
 end loop;
 if n=0 then update public.email_campaigns set status='done' where id=p_id; end if;
 return jsonb_build_object('id',p_id,'accepted',n,'excluded',jsonb_array_length(p_recipients)-n);
end $$;

-- Global per-workspace rate limit under a transaction lock. A claimed send is
-- never automatically retried: a process crash can mean SMTP already accepted it.
create or replace function public.claim_email_recipient(p_workspace uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.email_campaign_recipients; n integer;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_workspace::text||':email',0));
 if exists(select 1 from public.email_campaign_recipients where workspace_id=p_workspace and attempted_at>now()-interval '5 minutes') then return null; end if;
 select count(*) into n from public.email_campaign_recipients where workspace_id=p_workspace and attempted_at>now()-interval '24 hours';
 if n>=100 then return null; end if;
 update public.email_campaigns c set status='done' where c.workspace_id=p_workspace and c.status='queued' and not exists(select 1 from public.email_campaign_recipients er where er.campaign_id=c.id and er.status in ('queued','sending'));
 update public.email_campaign_recipients er set status='suppressed' where er.workspace_id=p_workspace and er.status='queued' and (
  exists(select 1 from public.email_suppressions s where s.workspace_id=p_workspace and s.email=er.email) or
  exists(select 1 from public.training_prospect_records t where t.workspace_id=p_workspace and lower(t.draft->>'email')=er.email and t.draft->>'doNotContact'='true') or
  exists(select 1 from public.email_campaign_recipients previous where previous.workspace_id=p_workspace and previous.email=er.email and previous.id<>er.id and (previous.status in ('sending','unknown','replied','bounced') or previous.attempted_at>now()-interval '7 days'))
 );
 select er.* into r from public.email_campaign_recipients er join public.email_campaigns c on c.id=er.campaign_id
 where er.workspace_id=p_workspace and er.status='queued' and c.status='queued' order by c.created_at,er.id limit 1 for update of er skip locked;
 if not found then return null; end if;
 update public.email_campaign_recipients set status='sending',attempted_at=now() where id=r.id returning * into r;
 return to_jsonb(r);
end $$;
create or replace function public.unsubscribe_email(p_token uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare r public.email_campaign_recipients;
begin
 select * into r from public.email_campaign_recipients where unsubscribe_token=p_token;
 if not found then return; end if;
 perform pg_advisory_xact_lock(hashtextextended(r.workspace_id::text||':email',0));
 insert into public.email_suppressions(workspace_id,email,reason) values(r.workspace_id,r.email,'unsubscribe') on conflict do nothing;
 update public.email_campaign_recipients set status='suppressed' where workspace_id=r.workspace_id and email=r.email and status='queued';
end $$;
revoke all on function public.enqueue_email_campaign(uuid,uuid,uuid,text,text,text,jsonb),public.claim_email_recipient(uuid),public.unsubscribe_email(uuid) from public,anon,authenticated;
grant execute on function public.enqueue_email_campaign(uuid,uuid,uuid,text,text,text,jsonb),public.claim_email_recipient(uuid),public.unsubscribe_email(uuid) to service_role;

create or replace function public.email_campaign_summary(p_workspace uuid)
returns jsonb language sql security invoker set search_path='' as $$
 select jsonb_build_object('usage',(select count(*) from public.email_campaign_recipients where workspace_id=p_workspace and attempted_at>now()-interval '24 hours'),
 'campaigns',coalesce((select jsonb_agg(to_jsonb(c)||jsonb_build_object('counts',coalesce((select jsonb_object_agg(s.status,s.n) from (select status,count(*) n from public.email_campaign_recipients where campaign_id=c.id group by status) s),'{}'::jsonb))) from (select id,name,subject,status,created_at from public.email_campaigns where workspace_id=p_workspace order by created_at desc limit 50)c),'[]'::jsonb))
$$;
revoke all on function public.email_campaign_summary(uuid) from public,anon,authenticated;
grant execute on function public.email_campaign_summary(uuid) to service_role;

create or replace function public.set_email_campaign_status(p_workspace uuid,p_actor uuid,p_id uuid,p_status text)
returns void language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from public.workspace_members where workspace_id=p_workspace and user_id=p_actor and active and role in ('admin','direction')) then raise exception 'not_authorized'; end if;
 if p_status not in ('queued','paused','cancelled') then raise exception 'invalid_status'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_workspace::text||':email',0));
 update public.email_campaigns set status=p_status where id=p_id and workspace_id=p_workspace and status in ('queued','paused');
 if not found then raise exception 'campaign_closed'; end if;
 if p_status='cancelled' then update public.email_campaign_recipients set status='suppressed' where campaign_id=p_id and workspace_id=p_workspace and status='queued'; end if;
end $$;
revoke all on function public.set_email_campaign_status(uuid,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.set_email_campaign_status(uuid,uuid,uuid,text) to service_role;
