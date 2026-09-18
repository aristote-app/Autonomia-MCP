# Autonomia database bootstrap

The first migration is ready at `supabase/migrations/0001_autonomia_core.sql`.

It is intentionally **not** applied to Aristote Production.

## Security model

All ingestion and market-intelligence tables have RLS enabled with no browser policies by default. This makes them inaccessible from anon/authenticated API clients until explicit team policies are added. Server-side ingestion will use the dedicated Autonomia project's server secret.

Only `watchlists` currently has authenticated-user policies, restricted to the owning user.

## Data integrity rule

- `raw_items` = immutable source evidence.
- `opportunities` = normalized canonical records.
- `opportunity_sources` = evidence links and dedup matches.
- `opportunity_versions` = observed fact history.
- `analyses` = AI classifications, scores and recommendations.

AI-derived values must not overwrite source facts.
