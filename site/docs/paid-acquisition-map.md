# Autonomia — paid acquisition map

Ce document relie les campagnes au site public et à Autonomia-MCP. Il ne remplace pas le pilotage média : il fixe le contrat entre intention, message, landing page et lead.

## Principe

Autonomia ne vend pas "du freelance" et "de la formation" comme deux catalogues séparés.

La promesse commune est :

**AUTONOMIA — La force d’exécution IA.**

- **Experts** = capacité externe immédiatement mobilisable.
- **Academy** = capacité interne à construire.
- **Autonomia Scan** = porte d’entrée lorsque le visiteur ne sait pas encore lequel des deux il lui faut.

## Google Ads — intention forte

| Intention | Landing page | Promesse principale | CTA primaire | Conversion |
|---|---|---|---|---|
| consultant IA | /consultant-ia | Traduire le besoin en compétences puis en profil | Décrire mon besoin | lead_expert |
| freelance IA | /freelance-ia | Ajouter rapidement la bonne compétence IA | Trouver un expert IA | lead_expert |
| expert IA | /expert-ia | Identifier l’expertise adaptée au projet | Cadrer le profil | lead_expert |
| consultant GenAI | /consultant-genai | Accélérer un projet IA générative | Décrire le projet | lead_expert |
| consultant RAG | /consultant-rag | Concevoir / fiabiliser un système RAG | Cadrer le besoin RAG | lead_expert |
| consultant agent IA | /consultant-agent-ia | Concevoir et industrialiser des workflows agentiques | Décrire le workflow | lead_expert |
| AI Project Manager | /ai-project-manager | Piloter le passage de l’idée au déploiement | Cadrer la mission | lead_expert |
| formation IA entreprise | /formation-ia-entreprise | Construire une capacité IA interne | Construire le parcours | lead_training |
| formation ChatGPT | /formation-chatgpt-entreprise | Transformer l’usage spontané en méthode de travail | Cadrer la formation | lead_training |
| formation Copilot | /formation-copilot | Faire adopter Copilot sur les tâches réelles | Construire le plan d’adoption | lead_training |
| formation IA générative | /formation-ia-generative | Donner une culture opérationnelle commune | Construire le parcours | lead_training |
| formation AI Act | /formation-ai-act | Rendre les règles compréhensibles et actionnables | Cadrer les publics | lead_training |
| formation agents IA | /formation-agents-ia | Comprendre, concevoir et superviser des agents | Cadrer la formation | lead_training |
| formation prompt engineering | /formation-prompt-engineering | Transformer les prompts en méthodes réutilisables | Construire le parcours | lead_training |

## Google Ads — problèmes précis

Les pages `/solutions-ia/[slug]` visent une intention différente des LP “consultant / formation” : le visiteur connaît déjà **la tâche ou le processus qu’il veut transformer**, sans nécessairement connaître le profil IA à acheter.

### Priorité 1 — à utiliser en premier pour les tests Search

| Groupe d’annonces | Landing page | Intention exprimée | Démo dominante | CTA / conversion |
|---|---|---|---|---|
| compte rendu réunion | /solutions-ia/automatiser-comptes-rendus-reunion | automatiser CR / PV / actions après réunion | transcription → décisions → actions | problem_lp_lead_submit → generate_lead |
| assistant documentaire / RAG | /solutions-ia/assistant-documentaire-ia-rag | retrouver une réponse dans des documents internes | question → réponse sourcée | problem_lp_lead_submit → generate_lead |
| qualification leads | /solutions-ia/qualification-automatique-leads | scorer / enrichir / router des leads | critères → score → routage | problem_lp_lead_submit → generate_lead |
| tri e-mails | /solutions-ia/trier-router-emails-ia | classer / prioriser / affecter une boîte entrante | mail → catégorie → service | problem_lp_lead_submit → generate_lead |
| extraction documents | /solutions-ia/extraction-donnees-documents | extraire des données depuis PDF / dossiers | document → champs → contrôle | problem_lp_lead_submit → generate_lead |
| contrôle dossiers | /solutions-ia/controler-dossiers-automatiquement | vérifier complétude et cohérence | checklist → anomalies → relance | problem_lp_lead_submit → generate_lead |
| reporting automatisé | /solutions-ia/automatiser-reporting | automatiser collecte / consolidation / commentaire | sources → KPI → anomalies | problem_lp_lead_submit → generate_lead |
| contrôle factures | /solutions-ia/controle-factures-ia | lire / rapprocher / contrôler les factures | facture → champs → écarts | problem_lp_lead_submit → generate_lead |
| réponse appel d’offres | /solutions-ia/reponse-appel-offres-ia | analyser DCE / préparer mémoire / conformité | DCE → exigences → preuves → trame | problem_lp_lead_submit → generate_lead |
| saisie CRM | /solutions-ia/automatiser-saisie-crm | automatiser compte rendu et champs CRM | notes → champs → next steps | problem_lp_lead_submit → generate_lead |

### Architecture de campagne

Ne pas mélanger les 10 problèmes dans un même groupe d’annonces. Le contrat est :

**1 problème précis → 1 groupe d’intention → 1 LP dédiée → 1 événement de conversion**

Les mots-clés doivent reprendre le vocabulaire de la tâche, puis l’annonce doit réutiliser la même formulation dans le titre et la description. La LP ne doit pas rediriger vers un catalogue avant d’avoir montré le flux correspondant.

Les autres LP restent indexables et prêtes techniquement. Leur ordre d’activation média est piloté par le registre paid-search et les données réellement observées.

### Événements spécifiques aux LP problème

- `problem_hub_click` : entrée vers le hub depuis Home / Observatoire / autre surface.
- `problem_lp_click` : clic vers une LP précise avec `problem_slug`, `problem_cluster`, `source_surface`.
- `problem_lab_demo_open` : ouverture d’une micro-app de la LP.
- `problem_lab_interaction` : clic à l’intérieur d’une micro-app problème avec action, slug, cluster et démo.
- `problem_lab_control_change` : modification d’un contrôle d’une micro-app problème.
- `autonomia_lab_module_open` : ouverture d’un module AUTONOMIA LAB sur les LP métier/secteur.
- `autonomia_lab_interaction` : clic dans une micro-app AUTONOMIA LAB.
- `autonomia_lab_control_change` : modification d’un slider, champ, select ou contrôle AUTONOMIA LAB.
- `autonomia_lab_cta_click` : passage d’une micro-app métier/secteur vers le formulaire contextualisé.
- `problem_lead_prefill` / `observatory_lead_prefill` : contexte de démo transféré au champ besoin sans écraser une saisie existante.
- `problem_demo_cta_click` : clic vers la zone de démonstration depuis le hero.
- `problem_cta_click` : clic vers le formulaire depuis le flux ou le CTA final.
- `problem_lp_lead_submit` : tentative d’envoi du formulaire.
- `generate_lead` : lead accepté, événement de conversion principal après consentement analytics.
- Les UTM, `gclid`, `fbclid` et identifiants de campagne continuent d’être transmis au pipeline lead.

### Règle Google

Une campagne ne doit pas envoyer vers la home si une LP dédiée existe.

Chaîne cible :

**mot-clé → annonce → headline LP cohérente → formulaire court → Autonomia-MCP**

Les LP consultant / Academy conservent leur configuration Ads dans `site/lib/pages.js`. Les 27 LP problèmes utilisent le registre dédié `site/content/problem-paid-search.js` : intention principale, requêtes secondaires, négatifs, angle d’annonce et score interne sur douleur, démonstrabilité, valeur économique, intention paid et capacité de delivery. Les 10 LP Priorité 1 disposent en plus de créations RSA vérifiées dans `site/content/problem-paid-creatives.js`. Le script `npm run ads:problem-export` produit les CSV de lancement dans `site/generated/google-ads/` (annonces responsives, mots-clés exact/phrase et négatifs). Ces scores sont des heuristiques de priorisation, pas des volumes Google Ads.

## Meta — trafic froid

Meta ne part pas d’une recherche explicite. Le premier produit vendu est donc le **diagnostic**, pas la prestation.

| Angle | Page | Hook | Valeur immédiate | Conversion |
|---|---|---|---|---|
| maturité | /diagnostic-maturite-ia | Votre entreprise est-elle réellement prête pour l’IA ? | friction principale | diagnostic_complete |
| compétences | /diagnostic-competences-ia | Quelles compétences IA vous manquent vraiment ? | gap externe / interne | diagnostic_complete |
| projet | /diagnostic-projet-ia | Votre projet a-t-il le bon problème et les bonnes compétences ? | dépendances critiques | diagnostic_complete |
| formation | /audit-besoins-formation-ia | Qui former à quoi ? | architecture de parcours | diagnostic_complete |
| staffing | /quel-profil-ia | De quel profil IA avez-vous réellement besoin ? | rôle probable | diagnostic_complete |
| Copilot | /diagnostic-copilot | Vos licences ont-elles un plan d’adoption ? | usages / populations | diagnostic_complete |
| exécution | /quiz-ia-entreprise | Votre IA avance-t-elle ou s’accumule-t-elle en pilotes ? | goulot d’étranglement | diagnostic_complete |

### Autonomia Scan

Le Scan de la home et `/scan-ia` sert de funnel transversal. Les LP Google le proposent aussi comme conversion secondaire lorsque le visiteur ne sait pas encore précisément quoi demander.

Entrée :
- objectif ;
- stade ;
- blocage.

Sortie :
- orientation Experts / Academy / hybride ;
- lecture du besoin ;
- priorité immédiate ;
- profils à examiner ;
- compétences à mobiliser ;
- pistes de montée en compétences ;
- prochaines étapes ;
- point de vigilance.

Le contexte complet est ensuite repris dans le formulaire sans ressaisie.

Sur les pages diagnostic Meta, cette valeur est livrée avant la collecte des coordonnées. Le formulaire de contact n'apparaît qu'après le premier plan d'exécution.

## Matrice créative

### Angle 1 — Execution gap

**Hook**
"L’IA ne manque pas de promesses. Elle manque d’exécution."

Visuel :
- grille Autonomia ;
- passage Ambition → Experts → Build → Academy → Adoption ;
- aucune image de robot / cerveau numérique.

Destination :
- home / Scan.

### Angle 2 — Wrong hire

**Hook**
"AI Engineer, RAG Engineer, AI Product Manager… êtes-vous sûr de chercher le bon rôle ?"

Visuel :
- plusieurs rôles qui convergent vers un besoin ;
- le besoin reste au centre.

Destination :
- /quel-profil-ia.

### Angle 3 — Copilot adoption

**Hook**
"Une licence Copilot n’est pas un plan d’adoption."

Visuel :
- licence → usages → règles → formation → adoption.

Destination :
- /diagnostic-copilot.

### Angle 4 — AI skills gap

**Hook**
"Votre prochain projet IA manque-t-il d’un expert… ou de compétences internes ?"

Visuel :
- bifurcation Experts / Academy ;
- Autonomia Scan au centre.

Destination :
- /diagnostic-competences-ia.

### Angle 5 — Agentic AI

**Hook**
"Avant de déployer un agent IA, décidez ce qu’il a le droit de faire."

Visuel :
- agent → outils → permissions → validation humaine.

Destination :
- /formation-agents-ia ou /consultant-agent-ia selon audience.

## Règle de preuve

Ne jamais utiliser dans une campagne :
- faux logos ;
- faux témoignages ;
- volume d’experts non vérifié ;
- taux de succès non mesuré ;
- promesse de délai non démontrée ;
- badge Qualiopi sans formulation / entité vérifiée.

La puissance perçue doit venir de la clarté du système Autonomia et non de preuves inventées.

## Mesure

Événements site :
- autonomia_scan_answer
- autonomia_scan_cta
- form_start
- form_step
- problem_hub_click
- problem_lp_click
- problem_lab_demo_open
- problem_lab_interaction
- problem_lab_control_change
- problem_lp_lead_submit
- autonomia_lab_module_open
- autonomia_lab_interaction
- autonomia_lab_control_change
- autonomia_lab_cta_click
- problem_lead_prefill
- observatory_lead_prefill
- observatory_lead_submit
- generate_lead

Attribution conservée :
- UTM ;
- gclid ;
- fbclid ;
- campaign_id ;
- adset_id ;
- ad_id ;
- creative_id ;
- first-touch ;
- historique des touchpoints.

Objectif analytique final :

**campaign → lead → qualified lead → meeting → proposal → won → revenue → margin**
