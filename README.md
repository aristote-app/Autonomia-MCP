# Autonomia Market Intelligence

Market intelligence platform and MCP for **Autonomia**.

## Scope
- AI freelance missions
- Private AI service demand
- Public AI tenders
- AI training tenders and opportunities
- Buyer / supplier / award history
- Autonomia fit, staffing and Go/No-Go analysis

## Architecture
Sources -> collectors -> normalization -> deduplication -> enrichment -> Supabase -> MCP / dashboard / alerts.

## Supabase
Dedicated project:
- Project: `Autonomia-MCP`
- Project ref: `haazpzbwcryaksgtormn`
- Region: `eu-west-1`
- Canonical data model: `opportunities`, `raw_items`, `public_awards`, `market_signals`, `organizations`, `analyses`, `consultants`, `staffing_matches`
- Migrations through `0009_source_registry_integrity` are applied.

The project also contains an older table family (`missions`, `trainings`, `public_tenders`, etc.). It is retained for now but is not the canonical V1 model.

## Principles
- Raw source evidence is kept separately from AI analysis.
- Official APIs and open data are preferred when available.
- Access controls, robots rules and platform terms must be respected.
- No CAPTCHA, login, rate-limit or anti-bot bypass.
- Analytical conclusions must remain traceable to source records.
- Secrets stay in environment variables and are never committed.

## Current status
Foundation, persistence model, public-market collectors, DECP history layer, private signals, staffing/scoring and MCP Streamable HTTP are implemented on the V1 branch. Production persistence still requires the server-side Supabase secret to be configured in the deployment environment.
