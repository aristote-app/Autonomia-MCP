# Supabase deployment

Dedicated project:
- Name: Autonomia-MCP
- Ref: haazpzbwcryaksgtormn
- URL: https://haazpzbwcryaksgtormn.supabase.co
- Region: eu-west-1

## Production environment variables

Set these in the server deployment environment (for example Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://haazpzbwcryaksgtormn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
SUPABASE_SECRET_KEY=<server-only secret key>
AUTONOMIA_INTERNAL_TOKEN=<strong random token>
```

Rules:
- Never reuse Aristote Production credentials.
- Never commit `SUPABASE_SECRET_KEY` or `AUTONOMIA_INTERNAL_TOKEN`.
- The secret key bypasses RLS and must remain server-side.
- Browser/public code must use only the publishable key.

## Canonical migrations

Apply only:
`0001_autonomia_core` ->
`0002_staffing` ->
`0003_history_search` ->
`0004_award_intelligence` ->
`0005_opco_sources` ->
`0006_private_signals` ->
`0007_security_hardening` ->
`0008_canonical_fk_indexes` ->
`0009_source_registry_integrity` ->
`0010_legacy_fk_indexes` ->
`0011_enable_http_extension` ->
`0012_ingest_bootstrap_auth` ->
`0013_fix_upsert_dedupe_constraints` ->
`0014_backfill_ted_publication_dates` ->
`0015_complete_bootstrap_cleanup`.

The one-time bootstrap authorization is closed. Fresh environments do not recreate a usable bootstrap credential, and the deployed bootstrap Edge Function is disabled.

The older alternate migration set was removed to prevent schema divergence.


## Initial real-data bootstrap

Verified database state after the first bootstrap:
- BOAMP: 77 raw source records / 61 linked opportunities
- TED: 80 raw source records / 80 linked opportunities
- DECP: 60 raw source records / 61 award rows
- Total canonical opportunities: 141
- Organizations: 184
- Public awards: 61

The temporary bootstrap Edge Function was disabled after ingestion and redeployed with JWT verification enabled.
