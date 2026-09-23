# Autonomia MCP tools

Autonomia exposes a token-protected Streamable HTTP MCP endpoint at `/api/mcp`.

The MCP is designed as the agent layer for the cockpit: it can search markets, inspect persisted
intelligence, rank opportunities and now operate over Account Intelligence without requiring a
separate paid "agent" platform.

## Market intelligence

- `list_sources`
- `search_public_tenders`
- `search_ai_public_market`
- `refresh_market`
- `market_stats`
- `search_freework_missions`
- `search_upwork_jobs`
- `search_training_opportunities`
- `search_opportunities`
- `search_ranked_opportunities`
- `search_private_signals`
- `buyer_market_intelligence`
- `public_awards`
- `buyer_history`
- `supplier_history`
- `expiring_contracts`
- `find_public_market_partners`

## Account / revenue intelligence

- `list_accounts`: ranked Account Intelligence records, with optional heat threshold.
- `get_account_360`: one complete account, including source-linked timeline and playbook.
- `get_account_next_actions`: deterministic next-best account actions.
- `research_account_public_context`: guarded on-demand public account research.
- `discover_account_decision_makers`: guarded public decision-maker candidate discovery.

The last two tools are disabled unless their explicit production switches are enabled. They use
Brave Search and therefore preserve the same quota guardrails as the cockpit.

## Staffing / scoring

- `find_staffing`
- `find_opportunities_for_consultant`
- `classify_ai_role`
- `compare_freelance_roles`
- `score_autonomia_fit`
- `go_no_go_public_tender`

## Evidence policy

- Missing buyer, budget, TJM, deadline or contact facts remain missing.
- Account heat and next actions are deterministic prioritization aids, not probabilities.
- Public decision-maker results are candidates until a human verifies the role and identity.
- Public Account Researcher results never modify scoring automatically.
- Private commercial contact memory remains in the authenticated cockpit and is not exposed by
  the public account MCP tools.
- Every externally observed fact should remain traceable to its source URL or raw persisted evidence.
