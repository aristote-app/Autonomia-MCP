# Autonomia scoring and public-tender Go/No-Go

## Purpose

The scoring layer is a **decision-support system**, not a prediction engine.

It never estimates a probability of winning a tender.

## Autonomia Fit

Default weights:

| Criterion | Weight |
| --- | ---: |
| Capability fit | 30 |
| Economic value | 15 |
| Staffing readiness | 10 |
| Recurrence potential | 10 |
| Commercial access | 10 |
| Buyer knowledge | 10 |
| Competition position | 5 |
| Deadline readiness | 5 |
| Strategic value | 5 |

Each criterion is scored from 0 to 100 only when evidence is available.

The output returns:
- weighted score;
- data coverage percentage;
- missing criteria;
- evidence per criterion;
- the exact weights used.

Unknown values are not silently converted to zero.

## Public tender Go/No-Go

The rules produce one of three states:

- `GO`
- `NO_GO`
- `REVIEW`

Hard blockers or failed mandatory requirements force `NO_GO`.

A high score is not enough when mandatory eligibility data is missing.

The initial hard-blocker vocabulary includes:
- impossible deadline;
- missing mandatory certification;
- missing mandatory reference;
- insufficient financial capacity;
- missing required authorization;
- conflict of interest;
- scope outside capabilities.

These rules are designed to be refined with Sylvain / Odexis.
