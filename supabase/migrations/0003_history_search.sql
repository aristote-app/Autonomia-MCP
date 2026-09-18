-- Autonomia Market Intelligence
-- Historical public-award enrichment and query indexes.

alter table public.public_awards
  add column if not exists source_record_id text,
  add column if not exists dedupe_key text,
  add column if not exists object text,
  add column if not exists cpv_code text,
  add column if not exists duration_months integer,
  add column if not exists procedure text,
  add column if not exists nature text;

create unique index if not exists public_awards_dedupe_key_unique
  on public.public_awards(dedupe_key)
  where dedupe_key is not null;

create index if not exists public_awards_contract_reference_idx
  on public.public_awards(contract_reference);

create index if not exists public_awards_cpv_idx
  on public.public_awards(cpv_code);

create index if not exists public_awards_object_search_idx
  on public.public_awards
  using gin (to_tsvector('simple', coalesce(object,'')));

create index if not exists public_awards_award_date_idx
  on public.public_awards(award_date desc);

create index if not exists public_awards_source_record_idx
  on public.public_awards(source_record_id);

-- Useful for efficient persisted opportunity search.
create index if not exists opportunities_description_search_idx
  on public.opportunities
  using gin (to_tsvector('simple', coalesce(description,'')));
