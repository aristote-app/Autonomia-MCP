# Live demand loop — Search + Employment

Autonomia's editorial system uses two different demand signals and never confuses them.

## 1. Search demand

Purpose: understand what people are actually asking Google and which pages are already receiving impressions.

Preferred evidence, strongest first:
- Google Search Console impressions / clicks / queries;
- Google Ads search-term and keyword data when available;
- Google Keyword Planner or another verified keyword database;
- current SERP observation;
- real inbound language from forms and sales conversations.

Windsor.ai is the preferred connected analytics layer for Search Console and Google Ads data when the connector is available to the working session.

Search data answers:
**“Are people searching for this?”**

## 2. Employment demand

Purpose: understand what companies are actively trying to build, operate or staff.

Primary recurring source:
- France Travail official job-offer API.

Complementary observation:
- publicly accessible job pages and authorized sources;
- LinkedIn / Indeed only through public or authorized access; no bypass of technical protections.

Job data answers:
**“Are companies asking people to know or build this?”**

## 3. Why both signals matter

Examples:

- Many jobs mention n8n + agentic workflows, but search demand may still use the wording “automatisation IA entreprise”.
- Search demand may be high for “formation Copilot”, while job descriptions reveal the newer operational combination “Copilot Studio + Power Automate + agents IA”.
- “LLMOps” can be a strong hiring term while decision-makers search for “mettre une IA générative en production”.

Therefore Autonomia stores canonical concepts separately from SEO wording.

## 4. Automatic job loop

The existing Autonomia market cron also refreshes editorial employment signals.

Flow:

France Travail API
→ fresh job offers
→ deduplication by source ID
→ deterministic extraction
→ role tags
→ tool tags
→ skill tags
→ use-case tags
→ keyword candidates
→ private Supabase table
→ aggregate public endpoint
→ editorial pages via ISR / revalidation.

The public site never receives the full job description from this pipeline.

## 5. Extracted concepts

Current taxonomy includes, among others:
- AI Project Manager;
- AI Product Manager;
- GenAI / LLM / RAG;
- Agentic AI;
- AI Automation Engineer;
- MLOps / LLMOps;
- AI governance;
- n8n;
- Make;
- Power Platform / Power Automate;
- Microsoft Copilot;
- LangChain / LangGraph;
- Databricks / Dataiku;
- evaluation;
- guardrails;
- observability;
- human-in-the-loop;
- knowledge management;
- document processing;
- customer support;
- sales automation;
- messaging / collaboration;
- files / document management;
- business-process integration.

## 6. Keyword candidates

Job signals can suggest candidate queries such as:
- automatisation n8n entreprise;
- formation n8n entreprise;
- Power Automate IA entreprise;
- Copilot Studio agents IA;
- agents IA entreprise;
- assistant IA base de connaissances;
- automatiser support client avec IA;
- automatiser emails avec IA;
- automatiser Google Drive avec IA;
- automatiser processus métier avec IA;
- supervision agents IA;
- sécurité LLM entreprise.

A candidate does **not** become a target keyword merely because it appeared in jobs.

It must then be confirmed by search evidence or deliberately treated as an emerging-topic bet.

## 7. Page enrichment

Each published article declares job-signal tags.

Example:
Gmail + Drive article:
- automation
- workflow_orchestration
- n8n
- power_platform
- api_integration
- messaging_collaboration
- files_documents
- process_integration

The page can then show a rolling block:
**“Ce que les entreprises demandent en ce moment”**

The block may include:
- number of relevant offers in the collected sample;
- most observed roles;
- most observed tools;
- most observed skills;
- most observed use cases;
- a few recent titles;
- observation period and disclaimer.

It is refreshed without rewriting the evergreen article.

## 8. Publication rule

Employment signals can:
- reprioritize an editorial backlog;
- suggest a new use case;
- enrich an existing article;
- trigger a content refresh;
- suggest a new training scenario.

They must never:
- invent search volume;
- become an invented customer case study;
- be quoted as if representative of the whole market;
- cause automatic publication of a thin page.

## 9. Frequency

The job refresh is attached to Autonomia's existing protected market cron.

Current repository schedule is daily. The pipeline is designed so this cadence can be increased later if the hosting plan and source limits allow it.

Editorial pages cache the aggregate signal for six hours and can refresh independently from the evergreen text.

## 10. Deployment note

France Travail credentials are read at deployment time by Vercel. After adding or rotating `FRANCE_TRAVAIL_CLIENT_ID` or `FRANCE_TRAVAIL_CLIENT_SECRET`, create a fresh deployment before testing the collector.
