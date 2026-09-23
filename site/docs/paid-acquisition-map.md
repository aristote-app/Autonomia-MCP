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

### Règle Google

Une campagne ne doit pas envoyer vers la home si une LP dédiée existe.

Chaîne cible :

**mot-clé → annonce → headline LP cohérente → formulaire court → Autonomia-MCP**

Les groupes de mots-clés, variantes de headline et négatifs sont stockés dans `site/lib/pages.js`.

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
