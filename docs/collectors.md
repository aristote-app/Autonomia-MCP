# Collector policy

## V0 live collectors

### BOAMP
Uses the official BOAMP OpenDataSoft Explore API. Full-text filtering is performed server-side and results are normalized into the Autonomia opportunity shape.

### TED
Uses the official TED Search API v3. The collector uses TED expert-search syntax and requests only fields needed for the first normalization pass.

## Rules

1. Prefer an official API or open-data export over HTML scraping.
2. Never bypass login, CAPTCHA, access controls, robots restrictions or anti-bot protections.
3. Store source evidence and source IDs so every normalized fact can be traced back.
4. Rate limits and source terms belong in source-specific configuration.
5. A failed source refresh must not erase previously stored data.
