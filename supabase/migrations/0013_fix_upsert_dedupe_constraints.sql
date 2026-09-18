-- Supabase/PostgREST upsert on dedupe_key requires an inferable UNIQUE constraint.
drop index if exists public.public_awards_dedupe_key_unique;
alter table public.public_awards
  add constraint public_awards_dedupe_key_key unique (dedupe_key);

drop index if exists public.market_signals_dedupe_key_unique;
alter table public.market_signals
  add constraint market_signals_dedupe_key_key unique (dedupe_key);
