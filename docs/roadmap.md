# Autonomia V1 roadmap

## Phase 1 — Foundation
- [x] Repository and deployment scaffold
- [x] Source registry
- [x] Domain boundary: facts vs AI analysis
- [ ] Dedicated Supabase project (blocked temporarily by Supabase free-project quota sync)
- [x] Initial schema + RLS prepared
- [ ] Apply schema + RLS to Autonomia Supabase
- [x] Persistence layer prepared and conditionally wired

## Phase 2 — Public market data
- [x] BOAMP live collector
- [x] TED live collector + Expert Search
- [x] DECP latest-resource resolver
- [x] DECP historical import pipeline prepared
- [ ] Execute DECP historical import into Supabase
- [x] Canonical opportunity model prepared
- [x] Deterministic deduplication foundation
- [ ] Cross-source semantic deduplication

## Phase 3 — Freelance market
- [x] FreelanceMention API adapter
- [ ] FreelanceMention credentials + saved searches
- [x] LinkedIn/Data Sales authorized import normalizer
- [ ] LinkedIn/Data Sales live authorized connector
- [x] Indeed authorized import normalizer
- [ ] Indeed live permitted connector
- [x] Malt authorized import normalizer
- [ ] Malt live permitted connector
- [x] Upwork official API adapter
- [ ] Upwork OAuth credentials
- [ ] Free-Work
- [ ] LeHibou

## Phase 4 — Training market
- [x] OPCO registry + BOAMP/TED buyer-filtered live search
- [ ] Direct parsers for remaining useful OPCO pages where needed
- [x] Mon Compte Formation open-data resource resolver
- [ ] Mon Compte Formation historical import
- [ ] Training-specific taxonomy

## Phase 5 — Intelligence
- [x] Deterministic first-pass AI taxonomy
- [ ] LLM/embedding semantic classification
- [x] Autonomia fit rules engine
- [ ] Autonomia fit auto-enrichment from persisted evidence
- [x] Staffing match engine
- [x] Inverse staffing engine
- [ ] Staffing over persisted consultant pool
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
- [x] list_opco_sources
- [x] search_training_opportunities
- [x] search_upwork_jobs adapter
- [x] explain_data policy tool
- [x] search_opportunities over persisted database
- [x] Live refresh auto-persistence when DB configured
- [x] buyer_history
- [x] public_awards
- [ ] analyze_tender
- [x] normalize_authorized_import
- [x] score_autonomia_fit
- [x] go_no_go_public_tender
- [x] find_staffing
- [x] find_opportunities_for_consultant
- [ ] match_autonomia
