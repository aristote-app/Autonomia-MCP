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

## Next data layer

When authentication is active, persist:
- verified account contacts;
- enrichment status and source;
- Waalaxy list/campaign IDs;
- outreach state;
- reply/meeting/proposal/won/lost outcomes.

Only then should Autonomia learn from conversion outcomes.
