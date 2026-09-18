-- Performance indexes for canonical Autonomia foreign-key lookups.

create index if not exists collector_runs_source_id_idx
  on public.collector_runs(source_id);

create index if not exists raw_items_collector_run_id_idx
  on public.raw_items(collector_run_id);

create index if not exists opportunities_buyer_org_id_idx
  on public.opportunities(buyer_org_id);

create index if not exists opportunities_company_org_id_idx
  on public.opportunities(company_org_id);

create index if not exists opportunity_sources_raw_item_id_idx
  on public.opportunity_sources(raw_item_id);

create index if not exists opportunity_versions_raw_item_id_idx
  on public.opportunity_versions(raw_item_id);

create index if not exists opportunity_skills_skill_id_idx
  on public.opportunity_skills(skill_id);

create index if not exists opportunity_skills_source_raw_item_id_idx
  on public.opportunity_skills(source_raw_item_id);

create index if not exists public_awards_opportunity_id_idx
  on public.public_awards(opportunity_id);

create index if not exists public_awards_source_raw_item_id_idx
  on public.public_awards(source_raw_item_id);

create index if not exists analyses_organization_id_idx
  on public.analyses(organization_id);

create index if not exists consultant_skills_skill_id_idx
  on public.consultant_skills(skill_id);

create index if not exists watchlists_owner_id_idx
  on public.watchlists(owner_id);

create index if not exists market_signals_source_raw_item_id_idx
  on public.market_signals(source_raw_item_id);
