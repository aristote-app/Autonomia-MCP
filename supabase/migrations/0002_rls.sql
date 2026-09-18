alter table public.organizations enable row level security;
alter table public.sources enable row level security;
alter table public.collector_runs enable row level security;
alter table public.raw_items enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_sources enable row level security;
alter table public.opportunity_versions enable row level security;
alter table public.skills enable row level security;
alter table public.opportunity_skills enable row level security;
alter table public.public_awards enable row level security;
alter table public.market_signals enable row level security;
alter table public.analyses enable row level security;
alter table public.watchlists enable row level security;
alter table public.consultants enable row level security;
alter table public.consultant_skills enable row level security;
alter table public.matches enable row level security;

create policy "authenticated read organizations"
on public.organizations for select to authenticated using (true);

create policy "authenticated read sources"
on public.sources for select to authenticated using (true);

create policy "authenticated read opportunities"
on public.opportunities for select to authenticated using (true);

create policy "authenticated read opportunity sources"
on public.opportunity_sources for select to authenticated using (true);

create policy "authenticated read opportunity versions"
on public.opportunity_versions for select to authenticated using (true);

create policy "authenticated read skills"
on public.skills for select to authenticated using (true);

create policy "authenticated read opportunity skills"
on public.opportunity_skills for select to authenticated using (true);

create policy "authenticated read public awards"
on public.public_awards for select to authenticated using (true);

create policy "authenticated read market signals"
on public.market_signals for select to authenticated using (true);

create policy "authenticated read analyses"
on public.analyses for select to authenticated using (true);

create policy "owners manage watchlists"
on public.watchlists
for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "owners manage consultants"
on public.consultants
for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "owners read consultant skills"
on public.consultant_skills
for select to authenticated
using (
  consultant_id in (
    select id from public.consultants
    where owner_id = (select auth.uid())
  )
);

create policy "owners manage consultant skills"
on public.consultant_skills
for all to authenticated
using (
  consultant_id in (
    select id from public.consultants
    where owner_id = (select auth.uid())
  )
)
with check (
  consultant_id in (
    select id from public.consultants
    where owner_id = (select auth.uid())
  )
);

create policy "owners read matches"
on public.matches
for select to authenticated
using (
  consultant_id is null or
  consultant_id in (
    select id from public.consultants
    where owner_id = (select auth.uid())
  )
);

revoke all on public.collector_runs from anon, authenticated;
revoke all on public.raw_items from anon, authenticated;

grant select on public.organizations to authenticated;
grant select on public.sources to authenticated;
grant select on public.opportunities to authenticated;
grant select on public.opportunity_sources to authenticated;
grant select on public.opportunity_versions to authenticated;
grant select on public.skills to authenticated;
grant select on public.opportunity_skills to authenticated;
grant select on public.public_awards to authenticated;
grant select on public.market_signals to authenticated;
grant select on public.analyses to authenticated;
grant select, insert, update, delete on public.watchlists to authenticated;
grant select, insert, update, delete on public.consultants to authenticated;
grant select, insert, update, delete on public.consultant_skills to authenticated;
grant select on public.matches to authenticated;
