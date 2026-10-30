# AUTONOMIA — TheirStack staging integration

Status: local development only. No production deploy or cron.

## Setup
Create `.env.local` in the cockpit project root and add `THEIRSTACK_API_KEY=<your-secret-key>`. Do not paste the key in chat, Git, logs, or client-side code.

## Validate
- `node scripts/smoke-theirstack.mjs` — mocked test, zero credits.
- To use a real key in PowerShell without saving it:
  `$env:THEIRSTACK_API_KEY = (Read-Host 'TheirStack API key')`
  `node scripts/theirstack-preview.mjs`
  `Remove-Item Env:THEIRSTACK_API_KEY`
- The real preview consumes up to five API credits and never writes to Supabase.
- POST `/api/internal/theirstack` requires `AUTONOMIA_INTERNAL_TOKEN` and defaults to preview.
- Persisting requires `AUTONOMIA_THEIRSTACK_PERSIST_ENABLED=true` *and* `{"persist":true}`; leave disabled until validation.

## Notes
TheirStack is not a LinkedIn-only feed. Jobs may originate from multiple sites. Keep original URL; verify employer/intermediary classification before outreach.
Repeated preview requests may consume credits again.
