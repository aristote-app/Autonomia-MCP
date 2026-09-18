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
- [x] Upwork official API adapter
- [ ] Upwork OAuth credentials
- [ ] Free-Work
- [ ] LeHibou

## Phase 4 — Training market
- [ ] OPCO collectors
- [x] Mon Compte Formation open-data resource resolver
- [ ] Mon Compte Formation historical import
- [ ] Training-specific taxonomy

## Phase 5 — Intelligence
- [x] Deterministic first-pass AI taxonomy
- [ ] LLM/embedding semantic classification
- [x] Autonomia fit rules engine
- [ ] Autonomia fit auto-enrichment from persisted evidence
- [ ] Staffing score
- [ ] Buyer / supplier history
- [x] Go/No-Go rules engine
- [ ] Go/No-Go DCE auto-extraction
- [ ] Explainability / evidence links backed by persisted records

## Phase 6 — MCP
- [x] MCP Streamable HTTP endpoint
- [x] list_sources
- [x] search_public_tenders
- [x] search_ai_public_market
- [x] refresh_market
- [x] market_stats
- [x] search_freelance_missions adapter
- [x] get_decp_status
- [x] get_training_market_status
- [x] search_upwork_jobs adapter
- [x] explain_data policy tool
- [ ] search_opportunities over persisted database
- [ ] buyer_history
- [ ] public_awards
- [ ] analyze_tender
- [x] score_autonomia_fit
- [x] go_no_go_public_tender
- [ ] match_autonomia
