# Data model v0

## Core rule

Facts extracted from sources and AI-generated analysis are stored separately.

## Main entities

- `organizations`: buyers, companies, suppliers and training bodies.
- `opportunities`: canonical opportunity record.
- `opportunity_sources`: every source URL / source identifier attached to one canonical opportunity.
- `opportunity_versions`: history of observed source changes.
- `raw_pages`: raw evidence used for extraction.
- `skills` and `opportunity_skills`: normalized skill taxonomy.
- `public_awards`: award records, amounts and suppliers.
- `market_signals`: pre-opportunity commercial signals.
- `analyses`: AI-produced classifications and explanations.
- `collector_runs`: observability of each refresh.

## Deduplication

A canonical opportunity is linked to many source records. Exact identifiers are preferred. Fuzzy / semantic matching is used only when exact identifiers are unavailable and must retain a confidence score.
