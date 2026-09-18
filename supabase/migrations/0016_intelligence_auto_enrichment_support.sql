-- Support idempotent automatic intelligence enrichment from application persistence.
drop index if exists public.analyses_opportunity_type_hash_uidx;

create unique index if not exists analyses_opportunity_type_hash_uidx
  on public.analyses(opportunity_id, analysis_type, input_hash);
