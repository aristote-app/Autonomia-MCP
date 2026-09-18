-- Bootstrap is complete: remove the stored authorization digest and mark
-- the public-market sources used during bootstrap as active.
update public.autonomia_config
set config_value = '{"used":true,"disabled":true}'::jsonb,
    description = 'Historical bootstrap completed; bootstrap authorization removed.',
    updated_at = current_timestamp
where config_key = 'ingest_bootstrap_auth';

update public.sources
set status = 'active',
    updated_at = now()
where id in ('boamp','ted','decp');
