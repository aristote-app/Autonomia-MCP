export const roleEnhancements = {
  "ai-project-manager": {
    questions: [
      "Quel résultat métier doit être obtenu, et comment le mesurera-t-on ?",
      "Quel est le périmètre exact du projet IA : expérimentation, pilote ou production ?",
      "Qui porte la décision finale côté métier, IT, data, sécurité et juridique ?",
      "Quelles dépendances peuvent bloquer le projet : données, accès, fournisseurs, architecture ou conduite du changement ?",
      "Quels critères déclenchent un go, un no-go ou un retour en cadrage ?",
      "Quelles erreurs ou situations exigent une validation humaine ?",
      "Qui prendra la responsabilité du run après le déploiement ?",
      "Quels indicateurs d’usage, de qualité, de coût et de risque seront suivis ?"
    ],
    deliverables: [
      ["Note de cadrage", "Problème, résultat attendu, périmètre, hypothèses, contraintes et critères de succès."],
      ["Roadmap IA", "Étapes du cadrage au run, dépendances, responsables, jalons et décisions attendues."],
      ["RACI & gouvernance", "Qui décide, qui construit, qui valide et qui est informé à chaque étape."],
      ["Registre des risques", "Risques data, sécurité, conformité, qualité, adoption, coûts et dépendances externes."],
      ["Critères de go / no-go", "Seuils explicites pour passer du POC au pilote puis à la production."],
      ["Plan de déploiement", "Adoption, formation, communication, support, mesure d’usage et organisation du run."]
    ],
    neighbors: [
      ["ai-product-manager", "Porte la valeur produit, l’expérience utilisateur et la roadmap fonctionnelle."],
      ["genai-engineer", "Transforme le cadrage en application GenAI réellement exploitable."],
      ["ai-governance", "Cadre risques, conformité, responsabilités et règles d’usage."],
      ["mlops-llmops-engineer", "Sécurise industrialisation, observabilité et exploitation en production."],
      ["automation-engineer", "Conçoit les workflows et intégrations quand le projet relève d’automatisation."]
    ]
  },
  "genai-engineer": {
    questions: [
      "Quel comportement utilisateur doit être amélioré ou automatisé ?",
      "Quelle sortie doit être considérée comme correcte, utile et suffisamment sûre ?",
      "Quelles données ou connaissances internes doivent être utilisées par le système ?",
      "Faut-il seulement générer une réponse, rechercher de l’information ou aussi déclencher des actions ?",
      "Quels accès, secrets et permissions doivent être contrôlés ?",
      "Comment mesurer hallucinations, erreurs de format, latence et coût ?",
      "Quel fallback doit exister lorsque le modèle ou un outil échoue ?",
      "Quelles traces faut-il conserver pour diagnostiquer les erreurs en production ?"
    ],
    deliverables: [
      ["Architecture GenAI", "Modèles, APIs, données, orchestration, stockage, sécurité et points de contrôle."],
      ["Service ou API IA", "Composant backend testable et intégrable dans un produit ou un workflow."],
      ["Prompt system versionné", "Instructions, variables, exemples, formats de sortie et règles de versioning."],
      ["Pipeline RAG ou agentique", "Retrieval, outils, mémoire, permissions et logique d’orchestration."],
      ["Jeu d’évaluation", "Cas représentatifs, critères qualité et seuils de régression."],
      ["Observabilité", "Suivi qualité, coûts, latence, erreurs, traces et comportements inattendus."]
    ],
    neighbors: [
      ["llm-engineer", "Approfondit évaluation, qualité des sorties, prompting système et comportement du modèle."],
      ["rag-engineer", "Spécialise la recherche documentaire, le retrieval et le grounding."],
      ["ai-agent-engineer", "Conçoit des systèmes multi-étapes qui utilisent outils et actions."],
      ["mlops-llmops-engineer", "Industrialise, observe et fiabilise les services GenAI en production."],
      ["ai-product-manager", "Relie l’architecture aux besoins utilisateurs et aux priorités produit."]
    ]
  },
  "llm-engineer": {
    questions: [
      "Qu’est-ce qu’une bonne réponse pour cet usage, au-delà d’une réponse plausible ?",
      "Quels cas difficiles ou erreurs doivent absolument entrer dans le benchmark ?",
      "Quelle part de l’erreur vient du modèle, du contexte, du retrieval, du prompt ou des outils ?",
      "Quelles métriques qualité sont réellement corrélées au jugement métier ?",
      "Quel niveau d’hallucination ou de non-réponse est acceptable ?",
      "Quel compromis coût / latence / qualité faut-il viser ?",
      "Comment versionner modèles, prompts, datasets et évaluations ?",
      "Quelles traces de production doivent alimenter la boucle d’amélioration ?"
    ],
    deliverables: [
      ["Golden dataset", "Cas représentatifs et cas limites servant de référence pour comparer les versions."],
      ["Harness d’évaluation", "Pipeline reproductible qui mesure qualité, robustesse et régressions."],
      ["Matrice de failure modes", "Typologie des erreurs par cause pour éviter les optimisations au hasard."],
      ["Prompt system", "Instructions système, formats, exemples et stratégies de contexte versionnés."],
      ["Comparatif de modèles", "Résultats qualité, coût, latence et contraintes sur un benchmark interne."],
      ["Plan d’amélioration", "Priorités basées sur les erreurs observées et les gains mesurables attendus."]
    ],
    neighbors: [
      ["genai-engineer", "Construit l’application complète autour du modèle."],
      ["rag-engineer", "Optimise la qualité des sources, du retrieval et du grounding."],
      ["ai-agent-engineer", "Ajoute orchestration, outils et décisions multi-étapes."],
      ["mlops-llmops-engineer", "Met en production les évaluations, versions et observabilité LLM."],
      ["data-scientist", "Apporte expérimentation, statistiques et protocoles d’analyse sur les données."]
    ]
  },
  "rag-engineer": {
    questions: [
      "Quelles sources doivent faire autorité pour répondre à l’utilisateur ?",
      "Quel niveau de fraîcheur et de synchronisation des documents est nécessaire ?",
      "Comment gérer versions, doublons, métadonnées et droits d’accès ?",
      "Quel niveau de citation ou de traçabilité doit accompagner chaque réponse ?",
      "Quels types de questions nécessitent recherche lexicale, sémantique ou hybride ?",
      "Comment mesurer séparément qualité du retrieval et qualité de la génération ?",
      "Quand le système doit-il dire qu’il ne sait pas plutôt que répondre ?",
      "Quels corpus ou permissions doivent rester strictement séparés ?"
    ],
    deliverables: [
      ["Pipeline d’ingestion", "Collecte, parsing, nettoyage, versioning, métadonnées et indexation des sources."],
      ["Stratégie de chunking", "Découpage adapté à la structure documentaire et aux types de questions."],
      ["Moteur de retrieval", "Recherche vectorielle, lexicale ou hybride avec filtres et reranking."],
      ["Réponse sourcée", "Construction du contexte, citations, règles de no-answer et limites explicites."],
      ["Benchmark RAG", "Questions de référence et mesures retrieval / génération pour comparer les versions."],
      ["Plan de run", "Réindexation, fraîcheur, observabilité, erreurs, permissions et coûts."]
    ],
    neighbors: [
      ["llm-engineer", "Mesure et améliore la qualité globale des réponses LLM."],
      ["genai-engineer", "Intègre le RAG dans une application ou un produit complet."],
      ["mlops-llmops-engineer", "Industrialise ingestion, index, observabilité et déploiements."],
      ["ai-agent-engineer", "Ajoute des outils et des actions au-delà de la simple recherche documentaire."],
      ["data-scientist", "Aide à construire protocoles d’évaluation et analyses de qualité."]
    ]
  },
  "ai-agent-engineer": {
    questions: [
      "Quelle tâche nécessite réellement plusieurs étapes ou l’usage d’outils ?",
      "Quelles actions l’agent peut-il exécuter sans validation humaine ?",
      "Quelles actions doivent toujours être confirmées avant exécution ?",
      "Quels outils, APIs et systèmes l’agent doit-il pouvoir appeler ?",
      "Comment gérer erreurs, boucles, timeouts et comportements non prévus ?",
      "Quelles permissions doivent être accordées à chaque outil ?",
      "Comment tracer chaque décision et chaque action réalisée ?",
      "Quel scénario simple permettrait de prouver la valeur avant d’augmenter l’autonomie ?"
    ],
    deliverables: [
      ["Architecture agentique", "États, étapes, outils, permissions, mémoire et mécanismes de validation."],
      ["Catalogue d’outils", "APIs et actions autorisées avec paramètres, règles d’accès et confirmations."],
      ["Workflow d’orchestration", "Transitions, erreurs, boucles, timeouts et comportements de repli."],
      ["Human-in-the-loop", "Points de validation humaine explicites avant les actions sensibles."],
      ["Jeu de scénarios", "Parcours normaux, cas limites et scénarios de panne pour tester l’agent."],
      ["Traçabilité", "Logs et traces permettant de comprendre pourquoi une action a été exécutée."]
    ],
    neighbors: [
      ["genai-engineer", "Construit l’application IA autour de l’agent et ses interfaces."],
      ["llm-engineer", "Évalue et fiabilise les décisions prises par le modèle."],
      ["automation-engineer", "Détermine ce qui doit rester déterministe plutôt qu’agentique."],
      ["mlops-llmops-engineer", "Assure monitoring, sécurité et run des agents en production."],
      ["ai-governance", "Cadre autonomie, responsabilités, risques et supervision humaine."]
    ]
  },
  "data-scientist": {
    questions: [
      "Quelle décision veut-on améliorer grâce au modèle ?",
      "Quel résultat métier veut-on influencer : conversion, churn, fraude, prévision, recommandation, délai ou coût ?",
      "Quelle cible mesurable permettra de dire que le modèle est utile ?",
      "Quelles données existent réellement aujourd’hui, sur quelle période et avec quelle qualité ?",
      "Quelle baseline simple le modèle doit-il battre pour justifier sa complexité ?",
      "Quel type d’erreur coûte le plus cher : faux positif, faux négatif ou mauvaise estimation ?",
      "Quelle granularité et quelle fraîcheur sont nécessaires : temps réel, quotidien, hebdomadaire ?",
      "Comment découper train, validation et test sans fuite de données ?",
      "Quels biais ou dérives faut-il surveiller une fois le modèle utilisé ?",
      "Quel livrable final est attendu : score, API, recommandation, notebook ou dashboard ?"
    ],
    deliverables: [
      ["Analyse exploratoire", "Qualité, valeurs manquantes, biais, distributions, signaux utiles et premières hypothèses métier."],
      ["Baseline", "Modèle simple de référence permettant de mesurer si la complexité supplémentaire apporte réellement quelque chose."],
      ["Modèle évalué", "Performance mesurée sur un protocole clair avec métriques adaptées au coût réel des erreurs."],
      ["Notebook reproductible", "Préparation, entraînement, évaluation et résultats exécutables de bout en bout."],
      ["Recommandations métier", "Interprétation des résultats, limites, usages possibles et décisions à ne pas automatiser."],
      ["Passation technique", "Hypothèses, dépendances, données, monitoring attendu et conditions d’industrialisation."]
    ],
    neighbors: [
      ["ml-engineer", "Transforme le modèle en service performant et intégrable en production."],
      ["mlops-llmops-engineer", "Industrialise déploiement, versioning, monitoring et retraining."],
      ["ai-project-manager", "Cadre le besoin, les parties prenantes et les critères de succès."],
      ["ai-product-manager", "Relie le modèle à l’expérience utilisateur et à la valeur produit."],
      ["genai-engineer", "Prend le relais lorsque le besoin porte surtout sur LLM, GenAI ou systèmes applicatifs."]
    ]
  },
  "ml-engineer": {
    questions: [
      "Quel modèle doit être servi, à quelle fréquence et pour quel volume d’appels ?",
      "Quelle latence maximale est acceptable pour le produit ou le workflow ?",
      "Quelles transformations doivent être identiques entre entraînement et production ?",
      "Quel format d’API ou de batch attend le système consommateur ?",
      "Comment gérer versions de modèles, features et dépendances ?",
      "Quels tests doivent bloquer un déploiement ?",
      "Comment détecter une dérive de performance ou de données ?",
      "Quel mécanisme de rollback est prévu si une nouvelle version se dégrade ?"
    ],
    deliverables: [
      ["Service d’inférence", "API ou traitement batch robuste exposant le modèle au système consommateur."],
      ["Pipeline de features", "Transformations reproductibles et cohérentes entre entraînement et production."],
      ["Packaging modèle", "Artefacts, dépendances, versions et configuration nécessaires au déploiement."],
      ["Tests techniques", "Tests de contrat, performance, charge, non-régression et cas limites."],
      ["Monitoring modèle", "Latence, erreurs, dérive, distributions et métriques de performance disponibles."],
      ["Plan de rollback", "Procédure pour revenir rapidement à une version stable en cas de problème."]
    ],
    neighbors: [
      ["data-scientist", "Conçoit et évalue les modèles et hypothèses statistiques."],
      ["mlops-llmops-engineer", "Automatise déploiement, monitoring, versioning et pipelines de run."],
      ["genai-engineer", "Intervient lorsque l’application s’appuie principalement sur des LLM."],
      ["ai-project-manager", "Coordonne les dépendances métier, data, IT et sécurité."],
      ["ai-product-manager", "Cadre la valeur utilisateur et les critères produit du système ML."]
    ]
  },
  "mlops-llmops-engineer": {
    questions: [
      "Quels modèles, prompts, datasets ou artefacts doivent être versionnés ?",
      "Comment passe-t-on d’une version testée à une version de production ?",
      "Quels signaux doivent déclencher une alerte ou un rollback ?",
      "Quels coûts d’infrastructure et d’inférence faut-il suivre ?",
      "Comment séparer environnements, secrets, données et permissions ?",
      "Quelles traces faut-il conserver pour expliquer un incident ?",
      "Quel SLA ou niveau de disponibilité l’usage exige-t-il ?",
      "Comment gérer changement de modèle fournisseur, retraining ou migration d’index ?"
    ],
    deliverables: [
      ["Pipeline CI/CD", "Tests, packaging, validation et déploiement automatisés des composants IA."],
      ["Registry & versioning", "Traçabilité des modèles, prompts, datasets, artefacts et configurations."],
      ["Observabilité", "Logs, traces, coûts, latence, erreurs, qualité et dérive regroupés dans des tableaux exploitables."],
      ["Environnements sécurisés", "Séparation dev / test / prod, secrets, droits et politiques d’accès."],
      ["Runbook", "Procédures incident, rollback, changement de modèle, réindexation et reprise."],
      ["SLO / alerting", "Seuils opérationnels qui déclenchent alerte, investigation ou rollback."]
    ],
    neighbors: [
      ["ml-engineer", "Construit les services d’inférence et composants ML à déployer."],
      ["llm-engineer", "Définit qualité et évaluations des systèmes LLM."],
      ["rag-engineer", "Gère ingestion, index et retrieval qui doivent ensuite être opérés."],
      ["genai-engineer", "Construit les services GenAI dont le LLMOps assure le run."],
      ["ai-governance", "Relie contrôles techniques, traçabilité et exigences de gouvernance."]
    ]
  },
  "ai-product-manager": {
    questions: [
      "Quel problème utilisateur justifie réellement l’usage de l’IA ?",
      "Quel comportement utilisateur doit changer si la fonctionnalité fonctionne ?",
      "Quelle erreur l’utilisateur est-il prêt à tolérer et laquelle détruit la confiance ?",
      "Quelle partie de l’expérience doit rester déterministe ou humaine ?",
      "Comment mesurer valeur, adoption et qualité séparément ?",
      "Quel est le coût marginal de l’usage à l’échelle ?",
      "Quel périmètre de MVP permet d’apprendre sans sur-construire ?",
      "Quelles données ou feedbacks permettront d’améliorer le produit après lancement ?"
    ],
    deliverables: [
      ["AI Product Brief", "Problème utilisateur, valeur, contraintes IA et hypothèses à valider."],
      ["Roadmap", "Priorités produit reliées à la valeur, au risque et aux dépendances techniques."],
      ["Parcours & garde-fous", "Expérience utilisateur, confirmations, erreurs, feedbacks et limites visibles."],
      ["Scorecard produit", "Adoption, qualité, coût, latence et résultats métier suivis séparément."],
      ["Plan d’expérimentation", "Hypothèses, prototypes, tests utilisateurs et critères de décision."],
      ["Backlog IA", "Arbitrage entre besoins utilisateurs, dette technique, évaluation et industrialisation."]
    ],
    neighbors: [
      ["ai-project-manager", "Orchestre delivery, dépendances, planning, risques et parties prenantes."],
      ["genai-engineer", "Construit l’expérience GenAI et les services derrière le produit."],
      ["data-scientist", "Évalue faisabilité data et modèles prédictifs quand ils sont nécessaires."],
      ["ai-governance", "Cadre les usages sensibles, responsabilités et obligations."],
      ["automation-engineer", "Propose un workflow déterministe quand l’IA n’est pas le bon choix."]
    ]
  },
  "ai-governance": {
    questions: [
      "Quels systèmes ou usages IA sont réellement déployés aujourd’hui dans l’organisation ?",
      "Qui est propriétaire de chaque usage, de ses données et de ses décisions ?",
      "Quel niveau de risque doit être attribué à chaque cas d’usage ?",
      "Quelles validations sont requises avant achat, expérimentation puis mise en production ?",
      "Quelles preuves faut-il conserver : documentation, tests, supervision, incidents ?",
      "Quels usages nécessitent une information ou une validation humaine explicite ?",
      "Comment suivre les changements de modèles ou fournisseurs dans le temps ?",
      "Quel dispositif d’AI literacy et de formation doit accompagner la gouvernance ?"
    ],
    deliverables: [
      ["Registre IA", "Inventaire des systèmes, propriétaires, finalités, données, fournisseurs et niveaux de risque."],
      ["Matrice de risques", "Critères permettant de proportionner validation, documentation et supervision."],
      ["Workflow d’approbation", "Étapes et responsabilités avant achat, pilote, production et changement majeur."],
      ["Politique d’usage", "Règles concrètes pour les utilisateurs, managers, IT, data et fonctions de contrôle."],
      ["Dossier de preuves", "Tests, documentation, décisions, incidents, supervision et mesures conservés dans le temps."],
      ["Plan AI literacy", "Population cible, compétences minimales, sensibilisation et formation adaptées aux usages."]
    ],
    neighbors: [
      ["ai-project-manager", "Transforme les exigences de gouvernance en décisions et jalons projet."],
      ["ai-product-manager", "Intègre les contraintes de risque dans la conception produit."],
      ["mlops-llmops-engineer", "Fournit traçabilité, monitoring et contrôles techniques nécessaires."],
      ["genai-engineer", "Implémente garde-fous, permissions et mécanismes de supervision."],
      ["ai-agent-engineer", "Traite les risques spécifiques liés à l’autonomie et aux actions."]
    ]
  },
  "automation-engineer": {
    questions: [
      "Quel processus manuel veut-on réduire ou fiabiliser ?",
      "Quelles étapes sont parfaitement déterministes et lesquelles nécessitent de l’IA ?",
      "Quels outils doivent être connectés et avec quelles permissions ?",
      "Quelles exceptions doivent interrompre le workflow ou revenir à un humain ?",
      "Quel volume et quelle fréquence d’exécution sont attendus ?",
      "Comment détecter une étape échouée ou une donnée incohérente ?",
      "Quelles informations doivent être journalisées pour pouvoir rejouer ou auditer le processus ?",
      "Quel gain réel justifie l’automatisation : temps, délai, fiabilité, traçabilité ou capacité ?"
    ],
    deliverables: [
      ["Cartographie du workflow", "Étapes, déclencheurs, règles, exceptions, validations et systèmes concernés."],
      ["Automatisation connectée", "Workflow n8n, Make, Power Automate ou code reliant les outils réels."],
      ["Brique IA contrôlée", "Extraction, classification ou génération utilisée uniquement là où elle apporte une valeur utile."],
      ["Gestion des erreurs", "Retries, alertes, files d’échec, validations humaines et reprise."],
      ["Journalisation", "Traçabilité des exécutions, données transformées et décisions prises."],
      ["Documentation run", "Dépendances, secrets, propriétaires, monitoring et procédure de maintenance."]
    ],
    neighbors: [
      ["ai-agent-engineer", "Intervient lorsque le workflow doit raisonner ou choisir dynamiquement des outils."],
      ["genai-engineer", "Ajoute génération, extraction ou compréhension avancée au workflow."],
      ["ai-project-manager", "Cadre les dépendances organisationnelles et l’adoption."],
      ["ai-product-manager", "Relie l’automatisation à une expérience utilisateur ou un produit."],
      ["ai-governance", "Cadre données, permissions et responsabilités sur les automatisations sensibles."]
    ]
  }
};

export function getRoleEnhancement(slug) {
  return roleEnhancements[slug] || { questions: [], deliverables: [], neighbors: [] };
}
