-- Historical bootstrap marker.
-- The one-time authorization digest used during the original bootstrap is intentionally
-- not committed. Fresh environments must not recreate bootstrap credentials.
insert into public.autonomia_config (config_key, config_value, description, updated_at)
values (
  'ingest_bootstrap_auth',
  '{"used":true,"disabled":true}'::jsonb,
  'Historical bootstrap marker; no reusable authorization material is stored.',
  current_timestamp
)
on conflict (config_key) do update set
  config_value = excluded.config_value,
  description = excluded.description,
  updated_at = current_timestamp;
