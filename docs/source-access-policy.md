# Source access and ingestion policy

Autonomia uses the most reliable permitted access route available for each source.

## Priority order

1. Official API
2. Official open data / bulk export
3. User-authorized export or connector
4. Public pages when access terms allow automated retrieval
5. Manual import

## Prohibited implementation shortcuts

The codebase must not:
- bypass authentication;
- bypass CAPTCHA;
- evade anti-bot or rate-limit controls;
- use hidden credentials belonging to another person;
- pretend a source is live when only an adapter is ready.

## Sources requiring credentials / authorized access

- FreelanceMention: official Premium API key.
- Upwork: official OAuth2 / GraphQL API.
- LinkedIn / Data Sales: authorized export, connector or other permitted access.
- Indeed: permitted public/partner access or authorized export.
- Malt: permitted public/partner access or authorized export.

For the last three sources, `normalize_authorized_import` provides a common ingestion path for CSV/JSON/exported records after they are converted to record objects.

## Public / open-data sources

- BOAMP: official API.
- TED: official Search API.
- DECP: official national open-data resources.
- Mon Compte Formation: official open-data resources.

Every ingested record must retain source identity and evidence sufficient for audit.
