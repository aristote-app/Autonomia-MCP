# Autonomia Sales OS

## Goal

Turn sourced market signals into a practical commercial operating system:

Signal -> Account -> Need -> Decision maker -> Contact -> Offer -> Outreach -> Follow-up -> Outcome.

The system must remain explainable, source-grounded and economical. It must not invent buyers, budgets, contacts or outcomes.

## V1 components

### Account Intelligence
- groups opportunities and job/training signals by observed company name;
- deduplicates repeated events;
- computes an internal commercial heat score from recency, signal count, source diversity and multi-offer convergence;
- caps confidence when many signals are concentrated on a single source, because the named company may be an intermediary rather than the end client;
- derives likely Autonomia offer tracks and target functions;
- exposes a source-linked account timeline.

### Decision Maker Finder
- public web-index discovery only;
- runs on demand, never as a background loop;
- searches only the first target roles proposed by the deterministic engine;
- returns candidates, not verified contacts;
- disabled by default until cockpit access control is active.

### Outreach Planner
- deterministic templates built from the account's verified signal;
- invitation, first message, email and final follow-up;
- stops on reply;
- requires human validation before outreach.

### Waalaxy
- official public API adapter;
- can list prospect lists and campaigns;
- can import a standard LinkedIn profile URL into a selected list and optionally enrol it into a campaign;
- no automated outreach is exposed until cockpit authentication is active.

### Kaspr
- integration readiness flag only in V1;
- enrichment must occur only after a person and role have been verified;
- do not enrich entire account lists by default because Kaspr uses credits per requested data type/successful call.

## Scheduled collection budget

The o2switch job script persists its throttle state in .runtime/job-refresh-state.json.

Normal cadence:
- Free-Work: every 1 hour
- France Travail official API: every 30 minutes
- LinkedIn/Indeed via Brave: every 8 hours
- Extended Brave web demand: every 24 hours

A manual full run can be forced with AUTONOMIA_FORCE_FULL_REFRESH=true.

This keeps paid/indexed web discovery intentionally slower than official/free sources and reserves quota for high-value on-demand research.

## Security

Never expose API keys to browser code.

Decision-maker discovery requires:
AUTONOMIA_DECISION_DISCOVERY_ENABLED=true

Keep it false while the cockpit is publicly reachable.

Kaspr and Waalaxy keys are server-side only:
KASPR_API_KEY
WAALAXY_API_KEY

## Commercial memory

Implemented in Supabase:

- `sales_contacts`: candidate/verified/rejected contact state, account link, LinkedIn evidence,
  enrichment state, Waalaxy identifiers, outreach state, next action and do-not-contact flag.
- `sales_contact_events`: append-only commercial event ledger covering candidate save,
  verification, enrichment, Waalaxy handoff, outreach, reply, meeting, proposal, won/lost,
  stop and opt-out.

Both tables have RLS enabled. `anon` and `authenticated` have no table privileges;
the server service role is the only direct data path until cockpit authentication is activated.

The Account 360 page only loads contact data when a valid workspace session exists.

## Waalaxy handoff

Implemented server-side:
- load Waalaxy lists and active campaigns on demand;
- only verified, non-do-not-contact contacts can be sent;
- user selects list and optional campaign;
- provider result is written back to commercial memory;
- no automatic campaign launch from an unverified candidate.

## Kaspr

The product architecture and readiness flag are implemented, but live Kaspr enrichment is intentionally
not wired until the current official request/response contract is verified. Do not guess the API payload.
When connected, enrichment must remain a deliberate action on a verified contact to preserve credits.

## Learning loop

The database can now record reply / meeting / proposal / won / lost events.
Do not modify ranking weights from outcomes until enough real history exists to avoid overfitting
to a tiny sample.
