-- Private-demand signals and authorized-import sources.

insert into public.sources (id, name, source_group, priority, access_mode, status)
values
  ('datasales','Data Sales','freelance','P0','authorized_import','active'),
  ('manual','Manual / authorized import','private','P1','authorized_import','active'),
  ('company_careers','Company careers','private','P1','public_or_authorized_import','planned'),
  ('company_news','Company news / press releases','private','P1','public_or_authorized_import','planned')
on conflict (id) do update set
  name = excluded.name,
  source_group = excluded.source_group,
  priority = excluded.priority,
  access_mode = excluded.access_mode,
  status = excluded.status,
  updated_at = now();

alter table public.market_signals
  add column if not exists dedupe_key text,
  add column if not exists source_record_id text,
  add column if not exists source_url text,
  add column if not exists signal_payload jsonb not null default '{}'::jsonb;

create unique index if not exists market_signals_dedupe_key_unique
  on public.market_signals(dedupe_key)
  where dedupe_key is not null;

create index if not exists market_signals_org_occurred_idx
  on public.market_signals(organization_id, occurred_at desc);

create index if not exists market_signals_type_occurred_idx
  on public.market_signals(signal_type, occurred_at desc);
