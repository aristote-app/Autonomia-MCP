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
`0009_source_registry_integrity`.

The older alternate migration set was removed to prevent schema divergence.
