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

## Principles
- Raw source evidence is kept separately from AI analysis.
- Official APIs and open data are preferred when available.
- Access controls, robots rules and platform terms must be respected.
- No CAPTCHA, login, rate-limit or anti-bot bypass.
- Analytical conclusions must remain traceable to source records.
- Secrets stay in environment variables and are never committed.

## Status
Initial foundation in progress.
