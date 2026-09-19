# Acquisition map — Autonomia public site

## Brand territory

**AUTONOMIA — La force d’exécution IA.**

Support line:
**Les experts pour construire. Les compétences pour déployer.**

Category:
**AI Execution Partner** — orchestration of external AI expertise and internal AI capability.

## Google Ads: high-intent LPs

### Experts
- `/consultant-ia`
- `/freelance-ia`
- `/expert-ia`
- `/consultant-genai`
- `/consultant-rag`
- `/consultant-agent-ia`
- `/ai-project-manager`

Each page has its own:
- intent,
- keyword cluster,
- negative keyword seed list,
- headline variants,
- primary conversion,
- secondary conversion,
- problem framing,
- capability vocabulary,
- FAQ.

Core negative keyword families for B2B staffing campaigns:
- job-seeking: emploi, salaire, stage, alternance, CV;
- education when targeting staffing: formation, cours, école;
- informational-only: définition, gratuit, tuto, PDF;
- irrelevant homonyms where needed, e.g. agent immobilier.

### Academy
- `/formation-ia-entreprise`
- `/formation-chatgpt-entreprise`
- `/formation-copilot`
- `/formation-ia-generative`
- `/formation-ai-act`
- `/formation-agents-ia`
- `/formation-prompt-engineering`

Core negative keyword families:
- consumer / free: gratuit, particulier, PDF, YouTube;
- degree-seeking: master, école, étudiant, alternance;
- job-seeking: emploi, salaire;
- product confusion where relevant, e.g. GitHub Copilot on Microsoft 365 Copilot campaigns.

Primary conversion:
- staffing pages: `lead_expert`;
- academy pages: `lead_training`.

Secondary conversion:
- `form_start`;
- specialist diagnostic where applicable.

## Meta: demand-generation funnels

Cold traffic should not be forced directly into a consultant / training purchase intent.

Funnels:
- `/diagnostic-maturite-ia`
- `/diagnostic-competences-ia`
- `/diagnostic-projet-ia`
- `/audit-besoins-formation-ia`
- `/quel-profil-ia`
- `/diagnostic-copilot`
- `/quiz-ia-entreprise`

Angles:
- “Votre entreprise est-elle réellement prête pour l’IA ?”
- “Quelles compétences IA manquent réellement à votre organisation ?”
- “Votre projet IA a-t-il le bon problème, les bonnes données et les bonnes compétences ?”
- “Qui former à quoi — et pour quel changement concret ?”
- “De quel profil IA votre projet a-t-il réellement besoin ?”
- “Vos licences Copilot ont-elles un plan d’adoption derrière elles ?”
- “7 questions pour voir si votre IA avance… ou si elle s’accumule en pilotes.”

These diagnostic pages should be campaign destinations first. They are excluded from the XML sitemap and should be `noindex` unless an SEO strategy later justifies indexing a specific diagnostic.

## Form design

Progressive profiling:
1. need / expertise / objective;
2. timing / team size / maturity;
3. minimal contact fields.

No long 14-field form.

## Measurement event model

Browser / acquisition events:
- `form_start`
- `form_step`
- `generate_lead`
- future: `calendar_open`, `meeting_booked`, `phone_click`

Autonomia / CRM downstream events:
- `qualified_lead`
- `meeting`
- `proposal`
- `won`
- revenue
- gross margin

Downstream events should be joined to acquisition identifiers in Autonomia rather than guessed client-side.

## Attribution

Never overwrite first-touch data.

Lead payload contains current landing context plus:
- first-touch snapshot,
- attribution history,
- UTM fields,
- Meta IDs when present,
- Google / Meta click IDs when present,
- form ID,
- expressed need,
- consent facts actually collected.

## Proof rule

No fake logos, testimonials, customer names, case studies, certification claims, metrics, speed promises or performance claims.

The UI has reserved proof slots, but production content must be sourced and authorized.
