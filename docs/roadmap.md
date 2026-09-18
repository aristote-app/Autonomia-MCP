# Autonomia V1 roadmap

## Phase 1 — Foundation
- [x] Repository and deployment scaffold
- [x] Source registry
- [x] Domain boundary: facts vs AI analysis
- [ ] Dedicated Supabase project (blocked temporarily by Supabase free-project quota sync)
- [x] Initial schema + RLS prepared
- [ ] Apply schema + RLS to Autonomia Supabase

## Phase 2 — Public market data
- [x] BOAMP live collector
- [x] TED live collector + Expert Search
- [x] DECP latest-resource resolver
- [ ] DECP historical import into Supabase
- [x] Canonical opportunity model prepared
- [x] Deterministic deduplication foundation
- [ ] Cross-source semantic deduplication

## Phase 3 — Freelance market
- [x] FreelanceMention API adapter
- [ ] FreelanceMention credentials + saved searches
- [ ] LinkedIn authorized workflow
- [ ] Indeed
- [ ] Malt
- [ ] Upwork
- [ ] Free-Work
- [ ] LeHibou

## Phase 4 — Training market
- [ ] OPCO collectors
- [ ] Mon Compte Formation open data
- [ ] Training-specific taxonomy

## Phase 5 — Intelligence
- [ ] Semantic classification
- [ ] Autonomia fit
- [ ] Staffing score
- [ ] Buyer / supplier history
- [ ] Go/No-Go factual inputs
- [ ] Explainability / evidence links backed by persisted records

## Phase 6 — MCP
- [x] MCP Streamable HTTP endpoint
- [x] list_sources
- [x] search_public_tenders
- [x] refresh_market
- [x] market_stats
- [x] search_freelance_missions adapter
- [x] get_decp_status
- [x] explain_data policy tool
- [ ] search_opportunities over persisted database
- [ ] buyer_history
- [ ] public_awards
- [ ] analyze_tender
- [ ] match_autonomia
