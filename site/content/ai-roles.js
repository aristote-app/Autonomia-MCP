export const aiRoles = [
  {
    slug: "ai-project-manager",
    title: "AI Project Manager",
    frenchTitle: "Chef de projet IA",
    dek: "Le rôle qui transforme une ambition IA en programme exécutable : cadrage, parties prenantes, jalons, arbitrages, risques et passage du pilote au déploiement.",
    angle: "L’AI Project Manager n’est pas seulement un chef de projet qui ajoute « IA » à son intitulé. Il doit comprendre assez bien la donnée, les modèles, la GenAI et les contraintes de production pour organiser le travail sans confondre démonstration, expérimentation et solution exploitable. Son travail consiste surtout à réduire l’ambiguïté : quel problème faut-il résoudre, quel résultat est attendu, quelles dépendances existent, qui décide, quelles validations sont nécessaires et à quel moment le projet peut réellement être considéré comme livré.",
    market: [
      "Les offres observées en septembre 2026 demandent régulièrement de tenir les jalons, le budget et le périmètre tout en produisant des livrables de cadrage comme l’étude d’opportunité ou le business case.",
      "Le rôle se situe à l’interface des métiers, de la data, de l’IT, de la sécurité, du juridique et parfois des achats. La compétence clé n’est donc pas uniquement la planification : c’est la capacité à faire converger des contraintes hétérogènes.",
      "Sur les projets GenAI, l’AI Project Manager doit savoir distinguer ce qui relève du choix produit, de l’architecture, de l’évaluation, de la gouvernance et du delivery pour mobiliser les bons profils."
    ],
    responsibilities: [
      "Reformuler le besoin métier en objectif mesurable et vérifier que le problème mérite réellement une solution IA.",
      "Construire le plan de travail : discovery, cadrage, expérimentation, pilote, industrialisation, adoption et run.",
      "Définir les jalons, les dépendances et les critères de passage d’une étape à l’autre.",
      "Coordonner métier, Data Science, engineering, sécurité, juridique, infrastructure, produit et sponsors.",
      "Organiser les arbitrages lorsqu’un choix de modèle, de données ou de périmètre modifie coût, délai ou risque.",
      "Suivre la qualité des livrables et rendre visibles les blocages plutôt que les masquer derrière un statut projet.",
      "Préparer la gouvernance de décision : qui valide une donnée, une réponse IA, un accès, un changement de modèle ou une mise en production.",
      "Accompagner le passage du prototype à un usage réellement adopté par les équipes."
    ],
    deliverables: ["note de cadrage", "business case", "roadmap", "RACI et gouvernance", "registre des risques", "plan de déploiement et d’adoption", "tableau de décisions", "critères de go/no-go"],
    stack: ["Jira / Linear", "Notion / Confluence", "Miro", "outils BI", "documentation d’architecture", "backlog produit", "tableaux de risques", "indicateurs d’usage", "bases de tests et d’évaluation IA"],
    lifecycle: [
      ["Cadrer", "Il part d’un irritant ou d’une ambition et cherche le bon niveau de formulation. « Nous voulons un chatbot » n’est pas encore un besoin ; « réduire le temps passé à rechercher une procédure tout en conservant une réponse sourcée et contrôlable » commence à l’être."],
      ["Prioriser", "Il confronte valeur métier, faisabilité, disponibilité des données, intégration, risques et capacité de l’organisation à changer ses pratiques. Cette étape permet d’éviter qu’un POC séduisant monopolise l’équipe alors qu’un autre cas d’usage est beaucoup plus utile."],
      ["Orchestrer", "Il découpe le projet en chantiers et attribue les responsabilités. Les données peuvent être prêtes alors que les droits d’accès ne le sont pas ; l’agent peut fonctionner alors que le protocole de validation humaine reste absent. Son rôle est de rendre ces dépendances explicites."],
      ["Sécuriser le passage en production", "Il organise les critères de qualité, les tests, l’observabilité, les mécanismes d’escalade et les engagements de run. Il doit savoir demander aux équipes techniques des preuves compréhensibles par le sponsor."],
      ["Faire adopter", "Un projet IA n’est pas terminé le jour où l’API répond. L’AI Project Manager suit les utilisateurs, la fréquence d’usage, les contournements, les erreurs observées et les besoins de formation ou d’évolution du workflow."]
    ],
    cases: [
      { title: "Assistant documentaire pour une direction métier", context: "Les équipes passent du temps à rechercher procédures, contrats et notes internes.", action: "Le Project Manager cadre le corpus, les propriétaires des sources, les droits d’accès, les critères de réponse, les tests de citations et la responsabilité de validation.", result: "Le projet devient une chaîne claire allant de l’ingestion documentaire à l’adoption, au lieu d’un simple prototype de chat." },
      { title: "Automatisation du traitement de demandes entrantes", context: "Des e-mails doivent être lus, qualifiés puis recopiés dans plusieurs outils.", action: "Il cartographie le processus, identifie les exceptions, décide où conserver une validation humaine et coordonne intégration, sécurité et métiers.", result: "Le périmètre d’automatisation est défini par le risque et la valeur, pas par ce que le modèle peut techniquement faire." },
      { title: "Programme IA multi-directions", context: "Plusieurs équipes lancent des expérimentations en parallèle sans priorisation commune.", action: "Il met en place un portefeuille de cas d’usage, un langage commun de qualification, des critères d’investissement et un rythme d’arbitrage.", result: "L’entreprise passe d’initiatives dispersées à une trajectoire pilotable." }
    ],
    boundaries: "L’AI Project Manager ne remplace ni l’AI Product Manager, qui porte davantage la valeur et l’expérience produit, ni l’architecte ou l’engineer qui décide et construit les choix techniques. Il doit en revanche comprendre suffisamment leurs contraintes pour éviter des roadmaps irréalistes. Il devient particulièrement utile quand plusieurs fonctions doivent travailler ensemble, quand un projet est déjà techniquement prometteur mais organisationnellement bloqué, ou quand le passage du POC à la production impose un niveau de coordination supérieur.",
    questions: ["Quel problème métier veut-on réduire ?", "Quel indicateur prouvera que le projet crée de la valeur ?", "Qui possède les données et qui peut les autoriser ?", "Quelles erreurs sont acceptables ou non ?", "Où une validation humaine est-elle obligatoire ?", "Quel est le critère de sortie du pilote ?", "Qui prendra le run après le déploiement ?", "Quelles équipes doivent changer leur manière de travailler ?", "Quels coûts doivent être surveillés ?", "Quelles décisions doivent être documentées ?"],
    sources: [
      ["Indeed — AI Project Manager Île-de-France", "https://fr.indeed.com/q-ai-project-manager-l-%C3%8Ele-de-france-emplois.html"],
      ["Hubvisory — AI Product Manager", "https://hubvisory.recruitee.com/o/ai-product-manager-fh-1"]
    ],
    faq: [
      ["Faut-il être développeur pour être AI Project Manager ?", "Non, mais une culture technique suffisante est indispensable pour comprendre les dépendances d’un système IA, challenger les estimations et savoir quand une question doit être arbitrée par un engineer, un architecte ou un expert sécurité."],
      ["Quelle différence avec un chef de projet IT classique ?", "Les projets IA introduisent davantage d’incertitude sur les données, les sorties des modèles, l’évaluation et la performance dans le temps. La gestion de projet doit donc intégrer expérimentation, protocoles de qualité, gouvernance des données et supervision."],
      ["Quand faire appel à ce profil ?", "Dès que le projet implique plusieurs équipes, plusieurs risques ou une trajectoire allant du cadrage au déploiement. Il est aussi utile pour remettre en ordre un portefeuille de POC dispersés."],
      ["Quels résultats attendre ?", "Une vision claire du problème, des rôles, des jalons, des dépendances, des décisions, des critères de qualité et de la trajectoire de déploiement. Le rôle ne garantit pas la valeur du projet ; il rend l’exécution pilotable."]
    ]
  },
  {
    slug: "genai-engineer",
    title: "GenAI Engineer",
    frenchTitle: "Ingénieur IA générative",
    dek: "Le profil qui assemble modèles, prompts, données, outils et logiciel pour transformer un cas d’usage GenAI en application exploitable.",
    angle: "Le GenAI Engineer se trouve au croisement du software engineering et des modèles génératifs. Il ne travaille pas seulement sur le choix d’un LLM : il construit tout ce qui permet à ce modèle de devenir une fonctionnalité fiable dans un produit ou un workflow. Les offres récentes insistent sur la capacité à passer de la conception à la production, à comprendre un besoin métier, à intégrer des API, à orchestrer des chaînes de traitement, à mesurer qualité, latence et coût, puis à faire évoluer le système à partir des données réelles.",
    market: [
      "Les annonces françaises récentes demandent de maintenir des solutions déjà en production et de traduire des besoins métier en solutions concrètes, signe que le métier se déplace du POC vers le run.",
      "RAG, orchestration agentique, choix de modèles, prompt systems, sécurité et observabilité se retrouvent de plus en plus dans une même fiche de poste.",
      "Le profil est attendu sur le logiciel autant que sur l’IA : Python, APIs, cloud, tests et architecture applicative deviennent aussi importants que la connaissance des LLM."
    ],
    responsibilities: [
      "Choisir ou comparer les modèles en fonction du cas d’usage, des coûts, de la latence, de la confidentialité et de la qualité attendue.",
      "Concevoir les system prompts, outils, sorties structurées et stratégies de contexte.",
      "Développer les composants backend qui appellent les modèles et les intègrent au produit.",
      "Mettre en œuvre RAG, recherche hybride, mémoire ou orchestration agentique lorsque le besoin le justifie.",
      "Définir des jeux d’évaluation et mesurer qualité, erreurs, hallucinations, temps de réponse et coût.",
      "Implémenter fallbacks, garde-fous, contrôles d’accès et validations humaines.",
      "Instrumenter le système avec logs, traces et métriques compréhensibles.",
      "Faire évoluer l’application en fonction des usages réels et non uniquement des tests de démonstration."
    ],
    deliverables: ["architecture GenAI", "API ou service IA", "prompt system versionné", "pipeline RAG ou agentique", "jeu d’évaluation", "monitoring coût/latence/qualité", "documentation technique", "tests de régression"],
    stack: ["Python", "FastAPI", "OpenAI / Azure OpenAI", "Anthropic / Gemini", "LangGraph / LangChain", "LlamaIndex", "Postgres / pgvector", "bases vectorielles", "Langfuse / observabilité", "Docker", "cloud AWS/GCP/Azure"],
    lifecycle: [
      ["Comprendre l’usage", "Le GenAI Engineer part du comportement attendu : répondre, résumer, extraire, décider, chercher, appeler un outil ou produire un document. Ce choix détermine si un simple appel de modèle suffit ou s’il faut un système plus structuré."],
      ["Construire une première boucle mesurable", "Avant de multiplier frameworks et agents, il cherche une architecture minimale et un jeu de cas de test. Cette discipline permet de savoir si une modification améliore réellement le système."],
      ["Ajouter contexte et outils", "Lorsque le modèle doit utiliser des connaissances internes ou agir sur un système, l’engineer construit la couche de retrieval, de tool calling, de permissions et de validation nécessaire."],
      ["Industrialiser", "Il transforme le prototype en service : gestion des erreurs, secrets, quotas, versioning, observabilité, performance, sécurité, files de traitement et stratégie de fallback."],
      ["Améliorer avec les données de production", "Les vraies défaillances apparaissent souvent après lancement. Le GenAI Engineer analyse traces et retours utilisateurs pour améliorer prompts, retrieval, choix de modèle ou logique applicative."]
    ],
    cases: [
      { title: "Réponses assistées pour un service client", context: "Les conseillers doivent répondre à partir d’un corpus interne et conserver un ton et des règles précises.", action: "L’engineer construit le retrieval, les sources citées, la génération de brouillons, les garde-fous et les métriques d’évaluation.", result: "L’IA prépare une réponse contrôlable plutôt que de remplacer aveuglément le conseiller." },
      { title: "Extraction intelligente de dossiers", context: "Des pièces hétérogènes doivent être lues pour alimenter un workflow.", action: "Il combine modèles multimodaux, sorties structurées, règles de validation et gestion des cas incertains.", result: "Le workflow automatise les cas simples et remonte les cas ambigus à un humain." },
      { title: "Assistant connecté à des outils internes", context: "Un utilisateur doit pouvoir rechercher une information puis déclencher une action.", action: "Il conçoit les outils disponibles, les permissions, la logique de confirmation et les traces d’exécution.", result: "L’assistant devient une interface vers le SI avec un niveau d’autonomie maîtrisé." }
    ],
    boundaries: "Le GenAI Engineer est plus large qu’un LLM Engineer spécialisé sur la qualité et le comportement des systèmes de modèles, et plus applicatif qu’un Data Scientist orienté expérimentation ou modélisation. Il peut construire un RAG ou un agent, mais un contexte exigeant peut nécessiter un RAG Engineer ou un Agent Engineer dédié. Sa valeur apparaît quand l’entreprise veut livrer une fonctionnalité GenAI de bout en bout plutôt que simplement tester un modèle.",
    questions: ["Quel comportement utilisateur voulons-nous améliorer ?", "Quelle qualité minimale est acceptable ?", "Quelles données internes sont nécessaires ?", "Le modèle doit-il seulement répondre ou aussi agir ?", "Quels accès faut-il limiter ?", "Comment mesure-t-on les hallucinations ?", "Quel budget d’inférence est soutenable ?", "Quelle latence l’utilisateur tolère-t-il ?", "Quel fallback existe en cas d’échec ?", "Comment versionner prompts et modèles ?"],
    sources: [
      ["France Travail — Expert & Trainer GenAI", "https://candidat.francetravail.fr/offres/recherche/detail/213XFZN"],
      ["Indeed — Gen AI Engineer", "https://fr.indeed.com/q-gen-ai-engineer-emplois.html"],
      ["Free-Work — IA générative", "https://www.free-work.com/fr/tech-it/jobs/ia-generative"]
    ],
    faq: [
      ["GenAI Engineer et LLM Engineer, est-ce la même chose ?", "Les frontières varient selon les entreprises. Le GenAI Engineer couvre souvent l’application complète autour du modèle ; le LLM Engineer peut être davantage centré sur évaluation, retrieval, prompting système, fine-tuning et comportement du modèle."],
      ["Le poste est-il uniquement Python ?", "Python est très présent, mais les contraintes de production peuvent nécessiter TypeScript, services backend, cloud, conteneurs, bases de données et pratiques DevOps."],
      ["Doit-il savoir entraîner un modèle ?", "Pas nécessairement. Beaucoup de projets créent de la valeur avec des modèles existants. Il doit surtout savoir choisir, intégrer, évaluer et contrôler la solution adaptée."],
      ["Quand ce profil est-il pertinent ?", "Quand une entreprise veut transformer une idée GenAI en fonctionnalité intégrée, mesurable et maintenable : assistant, recherche, extraction, génération documentaire, copilote métier ou workflow agentique."]
    ]
  },
  {
    slug: "llm-engineer",
    title: "LLM Engineer",
    frenchTitle: "Ingénieur LLM",
    dek: "Le spécialiste de la qualité des systèmes fondés sur les grands modèles de langage : évaluation, contexte, retrieval, raisonnement, tool use, fiabilité et boucle d’amélioration.",
    angle: "Le LLM Engineer travaille sur le comportement mesurable d’un système fondé sur des modèles de langage. Les offres les plus exigeantes insistent moins sur le fait d’avoir testé beaucoup de frameworks que sur la capacité à définir ce qu’est une bonne sortie, construire des évaluations, déboguer les échecs, améliorer retrieval et tool use, puis itérer rapidement à partir des données de production. Ce métier existe précisément parce qu’un LLM peut produire une réponse plausible sans qu’elle soit suffisamment fiable pour l’usage réel.",
    market: [
      "Des offres parisiennes récentes mettent l’evaluation-driven development au cœur du rôle et attendent une amélioration quantitative de la qualité des sorties.",
      "Les stacks observées combinent souvent Python/FastAPI, cloud, LangGraph ou LangChain, outils de tracing comme Langfuse et accès multi-provider aux modèles.",
      "La capacité à réduire hallucinations, latence et failure modes est décrite comme un résultat attendu, pas comme un sujet de recherche annexe."
    ],
    responsibilities: [
      "Définir ce qu’est une réponse correcte, utile et suffisamment sûre pour le cas d’usage.",
      "Construire datasets d’évaluation, juges automatiques encadrés et revues humaines.",
      "Analyser les échecs par catégorie : retrieval, instruction, contexte, modèle, outil, format ou orchestration.",
      "Optimiser prompts système, structured outputs, stratégies de contexte et choix de modèles.",
      "Améliorer retrieval, reranking et grounding quand le modèle travaille sur des connaissances externes.",
      "Concevoir et tester tool calling, planification ou raisonnement quand l’application agit sur plusieurs étapes.",
      "Mesurer coût, latence, taux d’échec et robustesse sur des cas représentatifs.",
      "Mettre en place une boucle d’amélioration continue basée sur les traces de production."
    ],
    deliverables: ["golden dataset", "harness d’évaluation", "matrice de failure modes", "prompt system", "comparatif de modèles", "protocoles de tests", "dashboards qualité/coût", "plan d’amélioration"],
    stack: ["Python", "FastAPI", "OpenAI / Azure OpenAI", "Anthropic / Gemini", "LangGraph", "LangChain", "Langfuse", "Postgres", "vector search", "notebooks d’évaluation", "CI de tests IA"],
    lifecycle: [
      ["Définir la qualité", "Le premier travail est de traduire un jugement humain vague en critères observables. Une bonne réponse peut devoir être fidèle aux sources, complète, concise, conforme à une politique et capable de dire qu’elle ne sait pas."],
      ["Construire un benchmark interne", "Le LLM Engineer rassemble des cas représentatifs, y compris des cas difficiles. Ce jeu devient le référentiel de comparaison entre prompts, modèles, retrievals ou architectures."],
      ["Déboguer par cause", "Il évite d’optimiser au hasard. Chaque échec est classé : mauvais document récupéré, instruction ambiguë, outil non appelé, sortie mal structurée, modèle trop faible ou contexte trop long."],
      ["Optimiser sans surconstruire", "Il teste d’abord les leviers simples : prompt, contexte, modèle, retrieval et logique. L’agentification ou le fine-tuning ne sont ajoutés que lorsque les évaluations montrent qu’ils répondent à un problème réel."],
      ["Fermer la boucle production-évaluation", "Les traces et feedbacks réels enrichissent le dataset. Chaque correction importante doit pouvoir être testée pour éviter qu’une amélioration locale dégrade un autre scénario."]
    ],
    cases: [
      { title: "Copilote de rédaction réglementée", context: "Les réponses doivent respecter une politique précise et ne pas inventer d’information.", action: "Le LLM Engineer construit un corpus de cas tests, mesure fidélité et conformité, puis optimise modèle, prompt et retrieval.", result: "L’équipe obtient une qualité mesurable et une capacité à détecter les régressions." },
      { title: "Assistant commercial multi-outils", context: "Le modèle doit résumer un compte, retrouver des données puis préparer une action.", action: "Il évalue chaque étape : récupération, tool calling, synthèse et comportement en cas de données manquantes.", result: "Le système n’est plus jugé sur une démo globale mais sur des étapes testables." },
      { title: "Migration vers un autre modèle", context: "L’entreprise veut réduire ses coûts ou diversifier ses fournisseurs.", action: "Il exécute le benchmark interne sur plusieurs modèles, compare qualité, latence et coût, puis mesure les régressions.", result: "La décision de modèle devient factuelle et liée au cas d’usage." }
    ],
    boundaries: "Le LLM Engineer peut recouvrir le GenAI Engineer, mais son centre de gravité est souvent l’évaluation et l’amélioration du système de modèles. Il collabore étroitement avec le RAG Engineer lorsque la qualité dépend du retrieval, avec l’Agent Engineer lorsque la complexité vient de l’orchestration et avec MLOps/LLMOps pour industrialiser le cycle de vie. Ce rôle devient critique quand l’entreprise ne peut plus se contenter de réponses « plutôt bonnes » et doit expliquer, mesurer et améliorer la fiabilité.",
    questions: ["Comment définit-on une bonne sortie ?", "Quels cas difficiles doivent absolument passer ?", "Quel taux d’abstention est acceptable ?", "Quelles sources doivent être citées ?", "Quelle part de la qualité dépend du retrieval ?", "Quel modèle est le bon baseline ?", "Quels prompts sont versionnés ?", "Quelles traces sont conservées ?", "Quel juge automatique peut être utilisé sans masquer les erreurs ?", "Quels scénarios doivent déclencher un humain ?"],
    sources: [
      ["LinkedIn — LLM Engineer Leonar", "https://fr.linkedin.com/jobs/view/llm-engineer-at-leonar-4456847970"],
      ["France Travail — GenAI / RAG / agents", "https://candidat.francetravail.fr/offres/recherche/detail/213XFZN"]
    ],
    faq: [
      ["Pourquoi l’évaluation est-elle centrale ?", "Parce qu’un système LLM peut sembler convaincant tout en échouant sur des cas importants. Sans dataset et métriques, l’équipe ne sait pas si une modification améliore réellement le produit."],
      ["Le LLM Engineer fait-il du fine-tuning ?", "Il peut en faire, mais ce n’est qu’un levier parmi d’autres. Dans beaucoup de cas, retrieval, prompts, outils ou choix de modèle produisent plus de valeur pour moins de complexité."],
      ["Quelle différence avec un Data Scientist ?", "Le Data Scientist peut couvrir modélisation, statistiques et ML au sens large. Le LLM Engineer est généralement plus proche du produit logiciel et du comportement des systèmes de modèles de langage en production."],
      ["Quand recruter ou staffer ce profil ?", "Quand la qualité du système devient un enjeu mesurable : hallucinations, réponses instables, tool calling fragile, migration de modèles, coûts élevés ou absence de protocole d’évaluation."]
    ]
  },
  {
    slug: "rag-engineer",
    title: "RAG Engineer",
    frenchTitle: "Ingénieur RAG / recherche augmentée",
    dek: "Le spécialiste qui relie les modèles à la connaissance de l’entreprise : ingestion, chunking, métadonnées, recherche hybride, reranking, citations et évaluation du retrieval.",
    angle: "Le RAG Engineer construit la chaîne qui permet à une application IA de retrouver la bonne information avant de demander au modèle de répondre. C’est un métier de recherche, de data engineering et de LLM engineering à la fois. Un mauvais RAG peut donner une réponse éloquente à partir d’un mauvais document ; un bon RAG sait gérer la fraîcheur, les droits d’accès, les structures documentaires, les métadonnées, le no-answer et l’évaluation séparée de la récupération et de la génération.",
    market: [
      "Les offres françaises autour du RAG mentionnent désormais bases vectorielles, architectures de données, APIs, observabilité et parfois GraphRAG ou recherche hybride.",
      "Des postes Data Engineer demandent une expérience de plateformes alimentant des produits IA/RAG, signe que la qualité du retrieval dépend autant de la donnée que du modèle.",
      "Les missions GenAI actuelles combinent fréquemment chunking, vector stores, hybrid retrieval, reranking et orchestration."
    ],
    responsibilities: [
      "Inventorier les sources documentaires et comprendre leur structure, fréquence de mise à jour et niveau de confidentialité.",
      "Construire les pipelines de parsing, nettoyage, chunking et enrichissement de métadonnées.",
      "Choisir embeddings, index vectoriels et stratégies de recherche lexicale ou hybride.",
      "Concevoir filtres, règles d’accès, reranking et stratégies multi-index.",
      "Définir les mécanismes de citation, provenance et comportement quand aucune source fiable n’est trouvée.",
      "Évaluer recall, précision, pertinence des passages récupérés et qualité finale de la réponse.",
      "Optimiser fraîcheur, coûts d’indexation, temps de réponse et robustesse.",
      "Collaborer avec sécurité et métiers sur les droits documentaires et la gouvernance du corpus."
    ],
    deliverables: ["pipeline d’ingestion", "schéma de métadonnées", "index de recherche", "stratégie de chunking", "retrieval hybride", "reranker", "dataset d’évaluation", "mécanisme de citations"],
    stack: ["Python", "OpenSearch / Elasticsearch", "pgvector", "Pinecone / Weaviate / Qdrant", "embeddings", "BM25", "rerankers", "LangChain / LlamaIndex", "parsers PDF/Office", "OCR", "object storage"],
    lifecycle: [
      ["Comprendre le corpus", "La première difficulté n’est pas le vector store mais la réalité documentaire : doublons, versions, scans, tableaux, pièces jointes, droits, documents obsolètes et conventions métier."],
      ["Préparer la connaissance", "Le RAG Engineer choisit comment extraire, segmenter et enrichir les documents. Le bon chunking dépend du sens du contenu : une procédure, un contrat et un tableau technique ne se découpent pas de la même façon."],
      ["Construire le retrieval", "Il combine recherche sémantique, lexicale, filtres et reranking pour augmenter la probabilité de récupérer les passages réellement utiles."],
      ["Évaluer séparément", "Il mesure d’abord la récupération avant la génération. Si le bon passage n’est jamais présent dans le contexte, changer le prompt du LLM ne résout pas le problème."],
      ["Opérer dans le temps", "Il gère réindexation, fraîcheur, suppression, permissions et dérives du corpus. Un RAG de production est un système vivant, pas une ingestion unique."]
    ],
    cases: [
      { title: "Assistant procédures internes", context: "Des milliers de documents sont répartis entre SharePoint, PDF et espaces métier.", action: "Le RAG Engineer définit connecteurs, métadonnées, filtres par droits, chunking par type de document et benchmark de questions réelles.", result: "L’assistant fournit des réponses sourcées avec un comportement clair lorsque la connaissance manque." },
      { title: "Recherche dans des contrats", context: "Les utilisateurs doivent retrouver rapidement clauses, exceptions et dates dans des contrats longs.", action: "Il adapte parsing et segmentation à la structure juridique, combine recherche lexicale et sémantique, puis ajoute reranking et citations.", result: "Le système retrouve des passages précis plutôt que des documents vaguement similaires." },
      { title: "Base de connaissances support", context: "Les réponses doivent refléter des procédures qui changent souvent.", action: "Il met en place incrémentalité, détection des versions et contrôle de fraîcheur.", result: "Le modèle travaille sur la version valide du contenu et l’équipe peut auditer la source utilisée." }
    ],
    boundaries: "Le RAG Engineer se distingue du LLM Engineer par son focus sur la chaîne de connaissance et de recherche. Il travaille souvent avec des Data Engineers pour l’ingestion à grande échelle, des LLM Engineers pour la génération et l’évaluation, et des MLOps/LLMOps Engineers pour le run. Il est particulièrement utile lorsque les utilisateurs se plaignent de réponses non sourcées, de documents non retrouvés, de connaissances obsolètes ou de permissions difficiles à gérer.",
    questions: ["Quelles sources sont réellement autoritatives ?", "Qui gère les versions ?", "Quels droits d’accès existent ?", "Quel niveau de citation est requis ?", "Quelle fraîcheur faut-il garantir ?", "Le corpus contient-il tableaux, scans ou images ?", "Quelle question doit produire un no-answer ?", "Comment mesurer le recall ?", "Quelle latence est acceptable ?", "Quelles suppressions doivent être propagées à l’index ?"],
    sources: [
      ["Indeed — RAG Engineer", "https://fr.indeed.com/q-rag-engineer-emplois.html"],
      ["France Travail — GenAI avancée, RAG et GraphRAG", "https://candidat.francetravail.fr/offres/recherche/detail/213XFZN"]
    ],
    faq: [
      ["Une base vectorielle suffit-elle pour faire du RAG ?", "Non. La qualité dépend de l’ingestion, du chunking, des métadonnées, du retrieval, du reranking, des droits, de l’évaluation et de la manière dont le contexte est utilisé par le modèle."],
      ["Quand utiliser de la recherche hybride ?", "Quand la sémantique seule ne suffit pas, par exemple pour des références précises, des codes produits, des acronymes ou des formulations métier où la recherche lexicale apporte un signal complémentaire."],
      ["Le RAG supprime-t-il les hallucinations ?", "Non. Il peut mieux ancrer les réponses dans des sources, mais il faut encore évaluer la fidélité, les citations, les cas sans réponse et le comportement du modèle."],
      ["Quand ce rôle devient-il indispensable ?", "Quand le corpus est volumineux, hétérogène, soumis à des droits complexes ou lorsque la qualité du retrieval est devenue le principal frein à l’usage."]
    ]
  },
  {
    slug: "ai-agent-engineer",
    title: "AI Agent Engineer",
    frenchTitle: "Ingénieur agents IA",
    dek: "Le profil qui conçoit des systèmes capables d’agir avec des outils : orchestration, état, mémoire, permissions, confirmations, évaluation et observabilité.",
    angle: "L’AI Agent Engineer transforme un modèle génératif en système capable d’enchaîner des actions sur des outils réels. Les offres récentes parlent explicitement d’agents de production connectés à des APIs, bases de données, messageries ou CRM, avec gestion de l’état, mémoire, tests et monitoring. Son enjeu n’est pas de maximiser l’autonomie : c’est de choisir le bon niveau d’autonomie et de rendre chaque action contrôlable, observable et réversible lorsque le risque l’exige.",
    market: [
      "Les missions agentiques demandent Python, intégration d’API, LangGraph/LangChain ou Semantic Kernel, vector databases, structured outputs et tool calling.",
      "Les annonces attendent une capacité à identifier des cas d’usage à ROI élevé, pas seulement à construire des démonstrateurs multi-agents.",
      "Évaluation, monitoring, reliability et cost efficiency apparaissent comme des responsabilités de production."
    ],
    responsibilities: [
      "Cartographier le workflow métier et distinguer étapes déterministes, décisions et exceptions.",
      "Définir les outils que l’agent peut appeler et les permissions associées.",
      "Concevoir l’état, la mémoire et les transitions du workflow agentique.",
      "Implémenter structured outputs, retries, timeouts, confirmations et fallbacks.",
      "Définir human-in-the-loop et niveaux d’approbation pour les actions sensibles.",
      "Tester les trajectoires d’exécution, erreurs de tool calling et boucles indésirables.",
      "Instrumenter chaque étape pour comprendre ce que l’agent a décidé et pourquoi il a échoué.",
      "Optimiser coût, latence, robustesse et nombre d’étapes nécessaires."
    ],
    deliverables: ["graphe d’orchestration", "catalogue de tools", "matrice de permissions", "politique human-in-the-loop", "tests de trajectoires", "monitoring d’exécution", "gestion des fallbacks", "journal d’audit"],
    stack: ["Python", "LangGraph", "LangChain", "Semantic Kernel", "OpenAI tools / function calling", "MCP", "APIs REST", "queues", "Postgres / Redis", "vector stores", "observabilité LLM"],
    lifecycle: [
      ["Cartographier avant d’agentifier", "Le bon point de départ est le processus réel. Beaucoup de workflows peuvent être automatisés sans agent ; l’Agent Engineer réserve le raisonnement dynamique aux étapes où il apporte une vraie valeur."],
      ["Limiter les capacités", "Chaque outil est décrit avec des entrées, sorties, permissions et règles d’usage. Plus l’agent peut agir, plus l’architecture doit expliciter confirmations et garde-fous."],
      ["Gérer l’état", "Un agent de production doit savoir où il en est, ce qui a déjà été tenté et ce qui doit être repris. L’état et l’idempotence sont essentiels lorsque des actions ont des effets réels."],
      ["Évaluer des trajectoires", "On ne juge pas seulement la réponse finale : on teste les outils choisis, l’ordre des actions, les erreurs intermédiaires, les boucles et les chemins d’escalade."],
      ["Superviser le run", "Le monitoring doit permettre de comprendre le coût par exécution, le taux de succès, les actions refusées, les erreurs d’API et la fréquence d’intervention humaine."]
    ],
    cases: [
      { title: "Agent de qualification de leads", context: "Une demande entrante doit être enrichie, classée puis préparée pour un commercial.", action: "L’engineer connecte recherche, CRM et messagerie, limite les écritures, impose validation avant envoi et trace les décisions.", result: "L’agent prépare un dossier exploitable sans pouvoir modifier silencieusement le CRM ou contacter un prospect sans contrôle." },
      { title: "Agent de traitement d’incidents", context: "Des incidents suivent des procédures différentes selon leur nature.", action: "Il construit un graphe d’actions, des outils de diagnostic, des règles d’escalade et une mémoire d’exécution.", result: "Les cas simples sont accélérés tandis que les situations sensibles remontent à l’équipe." },
      { title: "Assistant opérationnel multi-systèmes", context: "Un collaborateur doit consulter plusieurs outils pour exécuter une tâche.", action: "L’agent unifie lecture, recherche et préparation des actions avec confirmations explicites.", result: "L’utilisateur pilote un workflow complet depuis une interface, sans perdre le contrôle sur les actions irréversibles." }
    ],
    boundaries: "L’AI Agent Engineer est plus spécialisé que le GenAI Engineer sur les systèmes d’action et d’orchestration. Il doit savoir dire non à une architecture agentique lorsque des règles déterministes sont plus simples et plus fiables. Il travaille avec Product pour choisir les bons usages, avec sécurité pour les permissions, avec LLM Engineers pour la qualité des décisions et avec backend/DevOps pour l’intégration aux systèmes réels.",
    questions: ["Quel est le workflow actuel ?", "Quelles étapes peuvent être déterministes ?", "Quelles actions ont un effet réel ?", "Qui doit confirmer une action ?", "Quel outil peut être appelé avec quel droit ?", "Comment éviter les doubles actions ?", "Que se passe-t-il si une API échoue ?", "Quelle mémoire est nécessaire ?", "Comment mesurer un succès d’exécution ?", "Quand l’agent doit-il abandonner et escalader ?"],
    sources: [
      ["LinkedIn — AI Agent Engineer", "https://fr.linkedin.com/jobs/view/ai-agent-engineer-at-joblet-ai-4407877502"],
      ["France Travail — workflows agentiques", "https://candidat.francetravail.fr/offres/recherche/detail/213XFZN"]
    ],
    faq: [
      ["Un agent IA est-il simplement un chatbot avec des outils ?", "Pas vraiment. La difficulté vient de l’orchestration, de l’état, des permissions, des effets de bord, des erreurs intermédiaires et de la supervision."],
      ["Faut-il utiliser plusieurs agents ?", "Pas par défaut. Un workflow simple ou un seul agent bien contraint est souvent plus fiable. Le multi-agent se justifie lorsqu’il clarifie réellement la séparation des responsabilités."],
      ["Comment sécuriser les actions ?", "En limitant les tools, les scopes d’accès, les paramètres autorisés, les confirmations humaines, les journaux d’audit et les fallbacks. La sécurité doit être conçue dans le workflow."],
      ["Quand ce profil est-il utile ?", "Quand le besoin va au-delà de répondre ou générer du texte et exige de lire, décider puis agir sur plusieurs systèmes avec une supervision explicite."]
    ]
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    frenchTitle: "Data Scientist IA",
    dek: "Le profil qui transforme des données en modèles, signaux et décisions : exploration, expérimentation, ML, IA générative, validation et mise en production avec les équipes engineering.",
    angle: "Le Data Scientist de 2026 ne se limite plus à entraîner un modèle prédictif dans un notebook. Les offres récentes combinent données structurées et non structurées, machine learning, NLP, LLM, RAG, agents, cloud et collaboration avec les Data Engineers pour industrialiser les solutions. La valeur du rôle reste la même : formuler une question mesurable, comprendre les données, construire une approche, évaluer sa performance et expliquer les limites avant de pousser vers la production.",
    market: [
      "Des offres françaises récentes demandent de concevoir et optimiser des modèles GenAI et ML, travailler avec Bedrock, Spark, RAG et agents, puis participer au déploiement industriel.",
      "Les rôles Data Scientist peuvent couvrir extraction documentaire, prévision, optimisation, assistants conversationnels et systèmes multi-agents selon le secteur.",
      "Python, SQL, ML/DL, cloud, big data et MLOps apparaissent ensemble, ce qui renforce l’importance du lien avec les équipes de plateforme."
    ],
    responsibilities: [
      "Traduire une question métier en problème analytique ou de machine learning testable.",
      "Explorer qualité, biais, couverture et signal disponible dans les données.",
      "Construire baselines, features, modèles statistiques, ML, deep learning ou GenAI selon le besoin.",
      "Définir protocoles d’évaluation et comparer les approches.",
      "Interpréter résultats, incertitudes et limites pour les parties prenantes.",
      "Prototyper des cas d’usage sur données structurées et non structurées.",
      "Collaborer avec Data Engineering et MLOps pour industrialiser les pipelines.",
      "Surveiller performance, dérive et valeur après déploiement."
    ],
    deliverables: ["analyse exploratoire", "baseline", "modèle évalué", "notebook reproductible", "features / pipeline", "rapport de performance", "prototype", "documentation de limites"],
    stack: ["Python", "SQL", "pandas", "scikit-learn", "PyTorch / TensorFlow", "Spark", "Jupyter", "AWS/GCP/Azure", "MLflow", "LLM / RAG", "visualisation"],
    lifecycle: [
      ["Formuler l’hypothèse", "Le Data Scientist commence par une question que les données peuvent réellement aider à résoudre. Cette discipline permet d’éviter de construire un modèle sophistiqué sur une cible mal définie."],
      ["Comprendre les données", "Il mesure manque, bruit, biais, représentativité et stabilité. Beaucoup de projets échouent non pas faute d’algorithme mais parce que les données disponibles ne correspondent pas à la décision visée."],
      ["Construire une baseline", "Une approche simple fournit un point de comparaison. Le Data Scientist justifie ensuite la complexité supplémentaire par un gain mesurable."],
      ["Valider", "Il choisit les métriques, sépare entraînement et test, vérifie robustesse et analyse les segments où le modèle échoue. Pour la GenAI, cela implique souvent une combinaison d’évaluation automatique et humaine."],
      ["Transférer vers la production", "Il travaille avec engineering et MLOps pour rendre le modèle reproductible, observable et compatible avec les contraintes de coût, performance et maintenance."]
    ],
    cases: [
      { title: "Prévision de demande", context: "Une activité doit anticiper volumes et ressources.", action: "Le Data Scientist construit les variables, baselines, modèles et protocoles de validation temporelle.", result: "L’entreprise obtient une prévision accompagnée d’incertitudes et de segments de performance, pas seulement un score global." },
      { title: "Analyse documentaire GenAI", context: "Des volumes de documents doivent être classés, extraits ou résumés.", action: "Il compare règles, modèles classiques et LLM, construit un dataset d’évaluation et détermine quand chaque approche est pertinente.", result: "Le choix technologique repose sur qualité, coût et robustesse." },
      { title: "Détection de signaux métier", context: "L’entreprise veut identifier anomalies, risques ou opportunités dans des données hétérogènes.", action: "Il explore la donnée, définit la cible, construit le modèle et explique les faux positifs/faux négatifs.", result: "Le signal devient un outil d’aide à la décision avec un niveau de confiance explicite." }
    ],
    boundaries: "Le Data Scientist est centré sur la modélisation et l’évaluation du signal. Le ML Engineer prend davantage en charge la robustesse logicielle et l’intégration du modèle ; le Data Engineer construit les pipelines de données ; le MLOps Engineer industrialise le cycle de vie. Dans certaines organisations, ces frontières se chevauchent fortement. Ce profil est pertinent lorsqu’il existe une question quantitative ou un usage IA dont la valeur dépend d’une expérimentation rigoureuse.",
    questions: ["Quelle décision veut-on améliorer ?", "Quelle est la cible mesurable ?", "Quelles données existent réellement ?", "Quel biais de sélection peut fausser le modèle ?", "Quelle baseline simple faut-il battre ?", "Quelle erreur coûte le plus cher ?", "Comment découper train/test ?", "Quelle dérive faut-il surveiller ?", "Quelle explication doit être fournie ?", "Quel est le chemin vers la production ?"],
    sources: [
      ["France Travail — Data Scientist & IA", "https://candidat.francetravail.fr/offres/recherche/detail/214CRWD"],
      ["Air Liquide — R&D Data Scientist IA générative & agentique", "https://airliquidehr.wd3.myworkdayjobs.com/en-CA/AirLiquideExternalCareer/job/R-D-Data-Scientist--IA-Gnrative---agentique-H-F_R10086515"],
      ["VINCI — Data Scientist IA", "https://jobs.vinci.com/fr/emploi/-/-/1440/41945659392"]
    ],
    faq: [
      ["Le Data Scientist fait-il encore du ML classique ?", "Oui. La GenAI n’a pas remplacé prévision, classification, optimisation, détection d’anomalies ou causalité. Le bon outil dépend du problème."],
      ["Quelle différence avec un AI Engineer ?", "Le Data Scientist est souvent plus centré sur l’expérimentation, la modélisation et l’évaluation ; l’AI Engineer davantage sur la construction d’un système logiciel de production. Les frontières varient selon les équipes."],
      ["Doit-il connaître le cloud ?", "De plus en plus. Les offres demandent souvent AWS, GCP ou Azure parce que données, entraînement, déploiement et monitoring vivent dans ces environnements."],
      ["Quand ce profil est-il indispensable ?", "Quand il faut comprendre les données, formuler une cible, comparer plusieurs approches et produire une preuve quantitative avant d’industrialiser."]
    ]
  },
  {
    slug: "ml-engineer",
    title: "ML Engineer",
    frenchTitle: "Machine Learning Engineer",
    dek: "Le profil qui transforme des modèles en composants logiciels robustes : pipelines, serving, performance, tests, intégration et collaboration étroite avec Data Science et plateforme.",
    angle: "Le ML Engineer se situe entre Data Science et software engineering. Il reprend un modèle ou une approche expérimentale et la transforme en composant fiable, testable et performant dans un produit. Son métier inclut la préparation des données en production, le packaging, le serving, les APIs, l’optimisation de performance, les tests et la collaboration avec MLOps. Avec la GenAI, le rôle peut aussi couvrir LLM, embeddings, RAG et services d’inférence.",
    market: [
      "Les offres ML/AI récentes mélangent de plus en plus modèles classiques, GenAI, cloud, intégration et industrialisation.",
      "La maîtrise de Python, conteneurs, APIs, services cloud et CI/CD complète la compréhension des modèles.",
      "Dans les grandes organisations, le ML Engineer travaille à l’interface Data Scientist, Data Engineer et MLOps plutôt que seul."
    ],
    responsibilities: [
      "Transformer prototypes et modèles en code maintenable et testable.",
      "Construire pipelines de préparation et d’inférence compatibles production.",
      "Définir les APIs ou services permettant aux produits de consommer le modèle.",
      "Optimiser latence, mémoire, débit et coût d’inférence.",
      "Écrire tests unitaires, intégration et non-régression sur données/modèles.",
      "Gérer packaging, dépendances et environnements d’exécution.",
      "Collaborer avec MLOps pour déploiement, monitoring et versioning.",
      "Analyser les incidents techniques et améliorer la robustesse."
    ],
    deliverables: ["service d’inférence", "pipeline ML", "API", "tests automatisés", "package modèle", "benchmarks de performance", "documentation d’intégration", "profiling"],
    stack: ["Python", "FastAPI", "PyTorch / TensorFlow", "scikit-learn", "Docker", "Kubernetes", "cloud", "Git", "CI/CD", "feature stores", "model serving"],
    lifecycle: [
      ["Prendre le relais du prototype", "Le ML Engineer clarifie les hypothèses cachées du notebook : dépendances, transformations, ordre des étapes, gestion des erreurs et ressources nécessaires."],
      ["Rendre le code déterministe", "Il élimine les manipulations manuelles, versionne les artefacts et transforme les étapes en pipelines reproductibles."],
      ["Servir le modèle", "Il choisit batch, streaming ou API temps réel, puis conçoit l’interface stable entre le modèle et le produit."],
      ["Tester la robustesse", "Il ajoute tests fonctionnels et techniques, mesure performances, gère valeurs inattendues et scénarios de dégradation."],
      ["Préparer le run", "Il expose les métriques utiles à MLOps et aux équipes produit afin que l’application puisse détecter incidents et régressions."]
    ],
    cases: [
      { title: "Modèle de scoring intégré au SI", context: "Un notebook fonctionne mais doit répondre en temps réel depuis une application.", action: "Le ML Engineer package le modèle, construit l’API, gère les transformations et mesure la latence.", result: "Le score devient un service stable consommable par le produit." },
      { title: "Vision industrielle", context: "Un modèle doit analyser des images dans un environnement contraint.", action: "Il optimise le modèle, gère les formats d’entrée, le matériel, les tests et le déploiement edge/cloud.", result: "Le modèle devient compatible avec les contraintes réelles de débit et de fiabilité." },
      { title: "Brique ML dans un produit GenAI", context: "Un produit combine classification, retrieval et LLM.", action: "Il intègre plusieurs composants, standardise interfaces et gère la performance du pipeline complet.", result: "L’application ne dépend plus d’un assemblage fragile de notebooks et scripts." }
    ],
    boundaries: "Le ML Engineer n’est pas le MLOps Engineer : il est généralement plus proche du code du modèle et de son intégration applicative, alors que MLOps construit les plateformes, pipelines de déploiement, observabilité et gouvernance du cycle de vie. Il n’est pas non plus le Data Scientist, même s’il doit comprendre le modèle. Il devient essentiel lorsque le défi principal n’est plus de prouver qu’un modèle fonctionne, mais de le faire fonctionner correctement dans un système logiciel.",
    questions: ["Quel mode d’inférence faut-il ?", "Quelle latence maximale ?", "Quel débit ?", "Comment versionner les artefacts ?", "Quelles transformations doivent être identiques train/inference ?", "Quel hardware est nécessaire ?", "Quelles erreurs faut-il gérer ?", "Comment tester le service ?", "Quel fallback existe ?", "Quelles métriques exposer au monitoring ?"],
    sources: [
      ["Indeed — MLOps / ML Engineering", "https://fr.indeed.com/q-mlops-engineer-jobs.html"],
      ["France Travail — Data Scientist & IA", "https://candidat.francetravail.fr/offres/recherche/detail/214CRWD"]
    ],
    faq: [
      ["ML Engineer et Data Scientist, quelle différence ?", "Le Data Scientist cherche et valide une approche ; le ML Engineer transforme cette approche en composant logiciel robuste, performant et intégrable. Dans les petites équipes, une personne peut couvrir les deux."],
      ["Doit-il connaître Kubernetes ?", "Pas toujours, mais Docker, cloud et pratiques de déploiement sont fréquents. Kubernetes devient surtout important dans des plateformes à grande échelle."],
      ["Travaille-t-il sur les LLM ?", "Oui, de plus en plus. Le métier peut inclure serving de modèles, embeddings, pipelines RAG ou optimisation d’inférence."],
      ["Quand faire appel à ce profil ?", "Quand le prototype existe mais que l’intégration, la performance, la maintenabilité ou le passage en production constituent le principal risque."]
    ]
  },
  {
    slug: "mlops-llmops-engineer",
    title: "MLOps / LLMOps Engineer",
    frenchTitle: "Ingénieur MLOps / LLMOps",
    dek: "Le profil qui rend le cycle de vie des modèles industrialisable : CI/CD, registry, déploiement, monitoring, dérive, observabilité, sécurité, coûts et résilience.",
    angle: "Le MLOps / LLMOps Engineer construit les mécanismes qui permettent aux équipes de déployer, versionner, surveiller et faire évoluer des systèmes IA sans bricolage manuel. Les offres de septembre 2026 insistent sur Docker, Kubernetes, MLflow/Kubeflow, cloud, CI/CD, monitoring, drift et sécurité. Avec les LLM, le périmètre s’étend au versioning des prompts, modèles, bases vectorielles, jeux d’évaluation, coûts d’inférence et traces de conversations.",
    market: [
      "Des offres récentes décrivent explicitement l’industrialisation des modèles ML et GenAI, pipelines MLOps, CI/CD, supervision, versioning modèles/données et détection de dérive.",
      "Safran recrute un MLOps Engineer dans une IA Factory qui couvre autant le build et le run que les applications SaaS et Agents IA.",
      "Les besoins LLMOps incluent souvent prompts, vector stores, fine-tuning, observabilité, sécurité et maîtrise des coûts."
    ],
    responsibilities: [
      "Construire pipelines CI/CD pour code, modèles et configurations IA.",
      "Gérer registries, versioning et promotion entre environnements.",
      "Automatiser déploiements batch, API ou services d’inférence.",
      "Mettre en place monitoring de performance, drift, disponibilité et coûts.",
      "Standardiser secrets, permissions, isolation et conformité de plateforme.",
      "Tracer prompts, modèles, datasets et évaluations pour les applications LLM.",
      "Construire mécanismes de rollback, canary ou A/B lorsque nécessaire.",
      "Fournir aux équipes Data/AI une plateforme simple sans masquer les contrôles."
    ],
    deliverables: ["pipeline CI/CD", "model registry", "environnements dev/stage/prod", "dashboards", "alerting", "rollback", "observabilité LLM", "politiques de déploiement"],
    stack: ["Docker", "Kubernetes", "MLflow", "Kubeflow", "GitLab CI / GitHub Actions", "Terraform", "AWS/GCP/Azure", "Prometheus / Grafana", "Langfuse", "OpenTelemetry", "feature/model stores"],
    lifecycle: [
      ["Standardiser", "MLOps remplace les manipulations manuelles par des conventions : où sont les artefacts, comment ils sont versionnés, qui peut les promouvoir et quelles vérifications sont obligatoires."],
      ["Automatiser", "Build, tests, packaging et déploiement deviennent des pipelines reproductibles. L’objectif est de réduire les écarts entre l’environnement du Data Scientist et la production."],
      ["Observer", "Le système expose disponibilité, latence, erreurs, dérive et métriques de modèle. Pour les LLM, cela ajoute tokens, coûts, traces, évaluation et comportements de sécurité."],
      ["Réagir", "Une plateforme utile prévoit rollback, incident response, alertes et procédures lorsque la qualité ou l’infrastructure se dégrade."],
      ["Gouverner", "Versioning, provenance et droits rendent le cycle de vie auditable. L’équipe peut savoir quel modèle, quel prompt et quelle donnée ont produit une sortie donnée."]
    ],
    cases: [
      { title: "Industrialisation de plusieurs modèles", context: "Chaque équipe déploie ses modèles différemment.", action: "Le MLOps Engineer construit registry, templates CI/CD, standards de monitoring et processus de promotion.", result: "Le passage en production devient répétable et auditable." },
      { title: "LLMOps pour une plateforme GenAI", context: "Plusieurs applications utilisent des modèles et prompts différents sans visibilité sur les coûts ni la qualité.", action: "Il centralise traces, versions, évaluations, coûts et politiques de déploiement.", result: "Les équipes peuvent comparer versions et revenir en arrière en cas de régression." },
      { title: "Run dans un environnement réglementé", context: "L’entreprise doit prouver qui a déployé quoi et surveiller les dérives.", action: "Il renforce permissions, journaux, contrôles et alertes.", result: "Le cycle de vie devient compatible avec les exigences de contrôle interne." }
    ],
    boundaries: "Le MLOps Engineer n’a pas pour mission première de choisir la meilleure architecture de modèle ou de concevoir l’expérience produit. Il fournit la plateforme et les mécanismes de run qui permettent aux autres rôles d’opérer proprement. LLMOps est une extension adaptée aux applications fondées sur LLM : prompts, retrieval, évaluations, traces, coûts et fournisseurs deviennent des artefacts à gérer au même titre que le modèle.",
    questions: ["Quels artefacts faut-il versionner ?", "Comment promouvoir vers la production ?", "Quels tests bloquent un déploiement ?", "Quelles métriques signalent une dérive ?", "Quel rollback est possible ?", "Qui peut déployer ?", "Quelle observabilité LLM est requise ?", "Comment suivre les coûts ?", "Quelles données doivent être tracées ?", "Quelle politique de rétention des logs ?"],
    sources: [
      ["Safran — MLOps Engineer", "https://www.safran-group.com/fr/offres/france/chateaufort/mlops-engineer-fh-175325"],
      ["Indeed — MLOps Engineer", "https://fr.indeed.com/q-mlops-engineer-cdi-l-%C3%8Ele-de-france-emplois.html"],
      ["HelloWork — MLOps Engineer", "https://www.hellowork.com/fr-fr/emploi/metier_mlops-engineer.html"]
    ],
    faq: [
      ["MLOps et DevOps, est-ce la même chose ?", "MLOps reprend beaucoup de pratiques DevOps mais ajoute données, modèles, expérimentations, drift, registries et métriques de qualité propres au ML."],
      ["Qu’ajoute LLMOps ?", "Le suivi des prompts, modèles fournisseurs, vector stores, datasets d’évaluation, traces de conversations, coûts de tokens, sécurité et changements fréquents de modèles."],
      ["Quand la plateforme devient-elle nécessaire ?", "Dès que plusieurs modèles ou équipes doivent passer régulièrement en production, ou lorsque le coût d’incidents et de manipulations manuelles devient important."],
      ["Ce profil construit-il le modèle ?", "Il peut contribuer, mais sa responsabilité principale est l’industrialisation et le run. Le Data Scientist ou ML/LLM Engineer reste généralement propriétaire de la logique modèle."]
    ]
  },
  {
    slug: "ai-product-manager",
    title: "AI Product Manager",
    frenchTitle: "Product Manager IA",
    dek: "Le rôle qui choisit les bons problèmes, transforme des capacités IA en produit et mesure si les utilisateurs obtiennent réellement plus de valeur.",
    angle: "L’AI Product Manager est au croisement de l’ambition métier, de l’expérience utilisateur et de la réalité technique de l’IA. Les offres de septembre 2026 demandent de traduire des problématiques métier en roadmap IA, cadrer faisabilité et ROI, travailler avec Data/ML Ops/Tech, prototyper rapidement et mesurer l’impact. Son rôle n’est pas de mettre de l’IA partout mais de décider où elle apporte assez de valeur pour justifier ses coûts, ses risques et sa complexité.",
    market: [
      "Les annonces actuelles insistent sur vision produit, discovery, roadmap, OKRs, recherche utilisateur, backlog et mesure d’impact.",
      "Les AI Product Managers sont attendus sur la compréhension des architectures LLM, RAG et agents afin de dialoguer crédiblement avec les équipes techniques.",
      "Le prototypage rapide avec outils IA/no-code devient une compétence fréquente pour tester une hypothèse avant d’engager un build complet."
    ],
    responsibilities: [
      "Identifier les problèmes utilisateurs et métier qui méritent un investissement IA.",
      "Définir vision, proposition de valeur, roadmap et métriques d’impact.",
      "Conduire discovery, entretiens, tests, analytics et benchmark.",
      "Arbitrer qualité, coût, latence, risque et expérience utilisateur.",
      "Prioriser backlog avec Engineering, Data, Design et parties prenantes.",
      "Définir l’expérience lorsque le système est incertain ou peut se tromper.",
      "Piloter pilotes et expérimentations avec critères de succès explicites.",
      "Mesurer adoption, valeur et comportements réels après lancement."
    ],
    deliverables: ["vision produit", "problem statements", "roadmap", "backlog", "user stories", "prototypes", "KPIs / OKRs", "protocoles d’expérimentation"],
    stack: ["Jira", "Notion", "Figma", "Miro", "analytics produit", "SQL basique", "prototypage IA", "LLM/RAG/agents", "dashboards business"],
    lifecycle: [
      ["Discovery", "Le Product Manager cherche d’abord le problème, pas la technologie. Il observe le travail réel, mesure fréquence et coût de l’irritant et identifie ce qui changerait concrètement pour l’utilisateur."],
      ["Qualifier l’IA", "Il vérifie si l’IA apporte un avantage par rapport à une règle, un moteur de recherche ou une automatisation classique. Il intègre incertitude, coût et supervision dans le choix produit."],
      ["Prototyper", "Il teste rapidement l’expérience et les hypothèses. Sur un produit IA, il doit aussi tester la variabilité des sorties et la réaction des utilisateurs face à l’erreur."],
      ["Piloter le delivery", "Il travaille avec engineers et data pour prioriser les capacités techniques qui servent réellement l’expérience : retrieval, latence, feedback, validation, historique ou contrôles."],
      ["Mesurer la valeur", "Après lancement, il suit adoption, temps gagné, taux d’acceptation, qualité perçue et effets inattendus. Les métriques de modèle sont reliées aux métriques produit."]
    ],
    cases: [
      { title: "Copilote de conseillers", context: "Une organisation veut assister ses équipes sans dégrader la relation client.", action: "Le PM définit les moments où l’IA prépare, suggère ou doit se taire, puis mesure acceptation, temps gagné et qualité.", result: "Le produit est conçu autour du travail du conseiller plutôt qu’autour d’une démo de génération." },
      { title: "Recherche IA dans une base métier", context: "Les utilisateurs ne trouvent pas rapidement l’information.", action: "Il teste besoins, formulations, tolérance aux erreurs, citations et parcours de correction.", result: "La roadmap priorise les situations où la recherche améliore réellement le travail." },
      { title: "Plateforme IA interne", context: "Plusieurs équipes veulent lancer leurs propres cas d’usage.", action: "Le PM définit personas, capacités communes, règles de priorité et expérience développeur/utilisateur.", result: "La plateforme devient un produit avec clients internes plutôt qu’un projet technique abstrait." }
    ],
    boundaries: "L’AI Product Manager se distingue de l’AI Project Manager : le premier porte la valeur, les utilisateurs et la roadmap produit ; le second porte davantage l’orchestration du programme, les jalons et la coordination. Il ne remplace pas non plus les engineers mais doit comprendre les architectures assez bien pour arbitrer. Ce rôle est particulièrement important lorsque le risque est de construire une solution techniquement impressionnante qui ne change pas vraiment le travail utilisateur.",
    questions: ["Quel utilisateur souffre du problème ?", "À quelle fréquence ?", "Quelle valeur crée l’amélioration ?", "Pourquoi l’IA plutôt qu’une règle ?", "Quelle erreur l’utilisateur peut-il tolérer ?", "Comment montrer l’incertitude ?", "Quelle métrique produit est prioritaire ?", "Quel prototype peut tester l’hypothèse ?", "Quel feedback doit être capturé ?", "Quand faut-il arrêter le cas d’usage ?"],
    sources: [
      ["Hubvisory — AI Product Manager", "https://hubvisory.recruitee.com/o/ai-product-manager-fh-1"],
      ["Hymaïa — Product Manager AI", "https://www.hymaia.com/nous-recrutons/product-manager-ai/"],
      ["Indeed — AI Product Manager", "https://fr.indeed.com/q-ai-product-manager-emplois.html"]
    ],
    faq: [
      ["Quelle différence avec Product Manager classique ?", "Les fondamentaux restent discovery, valeur, priorisation et adoption. L’IA ajoute incertitude, évaluation, qualité variable, dépendance aux données, coûts d’inférence et besoin de supervision."],
      ["Doit-il savoir coder ?", "Pas nécessairement, mais il doit comprendre les concepts techniques et parfois prototyper suffisamment pour tester une hypothèse sans attendre un cycle complet de développement."],
      ["Comment mesure-t-on un produit IA ?", "Avec des métriques produit et métier reliées à des métriques de qualité IA : adoption, temps gagné, taux d’acceptation, erreurs critiques, coût, latence et satisfaction."],
      ["Quand ce rôle est-il prioritaire ?", "Quand le principal risque n’est pas de coder la solution mais de choisir le bon problème, concevoir l’expérience et prouver la valeur avant de passer à l’échelle."]
    ]
  },
  {
    slug: "ai-governance",
    title: "AI Governance",
    frenchTitle: "Consultant / Responsable gouvernance IA",
    dek: "Le rôle qui transforme principes, risques et réglementation en règles opérationnelles : portefeuille de cas d’usage, AI Act, RGPD, sécurité, fournisseurs, supervision et responsabilités.",
    angle: "La gouvernance IA devient une fonction d’exécution à mesure que les usages se multiplient. Les missions observées en 2026 ne se limitent pas à rédiger une charte : elles couvrent un cadre de gouvernance durable, la conformité AI Act/RGPD, la cybersécurité, la propriété intellectuelle, le portefeuille de cas d’usage, les fournisseurs, la supervision continue, l’adoption et la coordination avec DSI, métiers, juridique, DPO, RH, achats et équipes produit.",
    market: [
      "Des missions françaises récentes demandent explicitement de définir, déployer et animer un cadre de gouvernance IA responsable et opérationnel.",
      "Le périmètre combine AI Act, RGPD, cybersécurité, propriété intellectuelle, droit du travail et gestion du portefeuille de cas d’usage.",
      "La supervision continue de qualité, dérive, incidents, coûts et adoption montre que la gouvernance se prolonge après la mise en production."
    ],
    responsibilities: [
      "Définir les rôles, responsabilités et circuits de décision pour les systèmes IA.",
      "Classer les cas d’usage selon risque, exposition réglementaire et niveau de contrôle nécessaire.",
      "Construire inventaire et portefeuille des systèmes IA utilisés ou développés.",
      "Définir exigences de documentation, supervision humaine, traçabilité et validation.",
      "Coordonner conformité AI Act, RGPD, sécurité, achats et propriété intellectuelle.",
      "Évaluer fournisseurs, modèles et outils selon les politiques internes.",
      "Mettre en place suivi d’incidents, dérive, qualité, coûts et adoption.",
      "Former et acculturer les populations qui conçoivent, achètent ou utilisent des systèmes IA."
    ],
    deliverables: ["AI policy", "inventaire des systèmes IA", "matrice de risques", "processus d’approbation", "templates de documentation", "cadre fournisseurs", "registre d’incidents", "plan d’AI literacy"],
    stack: ["référentiels de risques", "AI Act", "RGPD", "NIS2/cybersécurité selon contexte", "inventaire applicatif", "GRC", "workflow d’approbation", "documentation modèle", "contrôles d’accès"],
    lifecycle: [
      ["Inventorier", "On ne gouverne pas ce qu’on ne voit pas. Le responsable identifie systèmes achetés, développés, expérimentés et usages shadow AI afin d’avoir une vision du périmètre réel."],
      ["Classifier", "Chaque cas d’usage est évalué selon impact, données, utilisateurs, décisions concernées et cadre réglementaire. Le niveau de contrôle doit être proportionné au risque."],
      ["Définir les règles", "La gouvernance traduit les principes en étapes : documentation attendue, parties prenantes à consulter, tests, validation humaine, sécurité et conditions de mise en production."],
      ["Opérer", "Les équipes produit et techniques doivent pouvoir appliquer le cadre sans immobiliser chaque projet. Le rôle cherche donc des contrôles réutilisables et des circuits d’escalade clairs."],
      ["Surveiller", "Une fois le système déployé, incidents, dérive, changements de fournisseur, coûts et usages réels alimentent la gouvernance et peuvent déclencher réévaluation ou retrait."]
    ],
    cases: [
      { title: "Déploiement de copilotes bureautiques", context: "Des milliers de collaborateurs accèdent à des fonctions génératives.", action: "La gouvernance définit règles d’usage, données interdites, populations, sensibilisation, monitoring et processus d’exception.", result: "L’adoption s’accompagne d’un cadre compréhensible plutôt que d’une interdiction générique." },
      { title: "Portefeuille de cas d’usage IA", context: "Plusieurs directions expérimentent assistants, agents et automatisations.", action: "Le responsable crée inventaire, critères de risque, comité, documentation minimale et revue périodique.", result: "L’entreprise sait quels systèmes existent, qui en est responsable et quelles validations ont été réalisées." },
      { title: "Achat d’une solution IA métier", context: "Un fournisseur propose une solution manipulant des données sensibles.", action: "La gouvernance coordonne achats, sécurité, DPO, juridique et métier pour évaluer données, sous-traitants, modèle, droits et supervision.", result: "La décision d’achat intègre le cycle de vie du risque, pas seulement une fiche fonctionnelle." }
    ],
    boundaries: "AI Governance n’est pas du conseil juridique déguisé. Le rôle travaille avec les juristes et fonctions de contrôle mais doit rendre les exigences actionnables dans les projets. Il ne doit pas non plus devenir un comité qui bloque toute expérimentation : la valeur vient d’un cadre proportionné, reproductible et compréhensible. Il est particulièrement utile quand les usages IA se diffusent plus vite que les responsabilités, lorsque plusieurs fournisseurs sont utilisés ou quand la conformité doit être intégrée au cycle de delivery.",
    questions: ["Quels systèmes IA utilisons-nous déjà ?", "Qui en est propriétaire ?", "Quelles données traitent-ils ?", "Quel risque métier ou humain existe ?", "Quel cadre réglementaire s’applique ?", "Quelle supervision humaine est nécessaire ?", "Quels fournisseurs interviennent ?", "Quelle documentation est obligatoire ?", "Comment signaler un incident ?", "Quand réévaluer un système ?"],
    sources: [
      ["Free-Work — Consultant Senior Gouvernance IA", "https://www.free-work.com/fr/tech-it/job-mission/consultant-decisionnel-bi-powerbi-sas-tableau/consultant-senior-gouvernance-de-lintelligence-artificielle"],
      ["Collective.work — Gouvernance IA", "https://www.collective.work/jobs/fr/consultant-senior-gouvernance-de-lintelligence-artificielle-hfba"],
      ["Indeed — AI Governance", "https://fr.indeed.com/q-ai-governance-emplois.html"]
    ],
    faq: [
      ["AI Governance est-il un poste juridique ?", "Pas nécessairement. Le rôle peut venir de la data, du SI, du risque, de la conformité ou du numérique. Il doit toutefois travailler étroitement avec les juristes pour interpréter correctement les obligations."],
      ["Faut-il attendre l’AI Act pour agir ?", "Non. Inventaire, rôles, politiques d’usage, sécurité, documentation et supervision sont déjà nécessaires pour opérer des systèmes IA de manière responsable."],
      ["Comment éviter une gouvernance trop lourde ?", "En appliquant des exigences proportionnées au risque, en standardisant les contrôles et en donnant aux équipes des templates, outils et critères clairs."],
      ["Quand ce rôle devient-il critique ?", "Quand plusieurs directions utilisent ou achètent de l’IA, lorsque des données sensibles sont impliquées ou quand l’organisation doit prouver ses responsabilités et contrôles."]
    ]
  },
  {
    slug: "automation-engineer",
    title: "Automation Engineer",
    frenchTitle: "Ingénieur automatisation IA",
    dek: "Le profil qui transforme les tâches répétitives en workflows fiables : APIs, orchestration, règles, IA lorsque nécessaire, gestion d’erreurs et supervision humaine.",
    angle: "L’Automation Engineer part du processus plutôt que du modèle. Il cherche à supprimer les doubles saisies, les transferts manuels, les relances, les consolidations et les tâches répétitives en connectant les outils existants. L’IA n’est ajoutée que lorsque le workflow doit comprendre du texte, extraire une information, classer une demande ou produire un brouillon. Les offres actuelles mêlent intégration d’API, automatisation, orchestration de workflows et outils IA.",
    market: [
      "Les annonces AI Automation demandent souvent intégration d’API, orchestration, outils métiers et capacité à identifier de nouvelles opportunités d’automatisation.",
      "Les fonctions finance, opérations et support cherchent des profils capables d’associer automatisation classique, Copilot/LLM et gouvernance.",
      "Le rôle peut être très software ou très no-code selon le SI, mais la robustesse, la gestion des erreurs et l’observabilité restent communes."
    ],
    responsibilities: [
      "Cartographier tâches, acteurs, systèmes, entrées, sorties et exceptions.",
      "Identifier les étapes automatisables sans IA et celles qui nécessitent compréhension ou génération.",
      "Connecter APIs, webhooks, bases, CRM, messageries et outils métier.",
      "Construire règles, transformations et orchestrations robustes.",
      "Ajouter extraction, classification ou génération IA avec validation lorsque nécessaire.",
      "Gérer erreurs, retries, files d’attente, idempotence et reprise.",
      "Créer logs, alertes et tableaux de suivi des workflows.",
      "Mesurer temps gagné, taux d’automatisation et volume d’exceptions."
    ],
    deliverables: ["cartographie du processus", "workflow automatisé", "connecteurs APIs", "règles d’orchestration", "gestion d’erreurs", "monitoring", "documentation opératoire", "plan de reprise manuelle"],
    stack: ["APIs REST", "webhooks", "Python / Node.js", "n8n / Make / Power Automate", "queues", "databases", "CRM", "Microsoft 365", "LLM APIs", "OCR", "observabilité"],
    lifecycle: [
      ["Observer le processus", "L’automatisation commence par la réalité : qui reçoit quoi, où l’information est recopiée, quelles décisions sont simples et quelles exceptions nécessitent un humain."],
      ["Simplifier", "Avant d’automatiser un mauvais processus, l’engineer cherche les étapes inutiles et les données manquantes. Supprimer une étape peut créer plus de valeur que l’agentifier."],
      ["Connecter", "Il choisit APIs, webhooks, fichiers ou RPA selon ce que les outils permettent. Les interfaces stables sont préférées aux automatisations fragiles sur l’UI."],
      ["Ajouter l’IA avec parcimonie", "Un LLM est utile pour texte non structuré, classification ou génération. Les étapes déterministes restent des règles afin de garder coût et fiabilité sous contrôle."],
      ["Opérer", "Le workflow doit résister aux erreurs de réseau, données incomplètes et changements de systèmes. Logs, alertes et reprise humaine sont conçus dès le départ."]
    ],
    cases: [
      { title: "Traitement d’e-mails entrants", context: "Une boîte générique reçoit des demandes qui doivent être lues, classées et saisies ailleurs.", action: "L’engineer récupère les messages, extrait les champs, classe la demande, prépare une réponse et alimente le CRM après validation.", result: "Les équipes se concentrent sur les cas complexes au lieu de recopier chaque demande." },
      { title: "Reporting mensuel", context: "Des données sont extraites manuellement de plusieurs outils avant consolidation.", action: "Il automatise collecte, contrôles, calculs et génération d’un premier commentaire, puis laisse validation finale à l’équipe.", result: "Le reporting devient reproductible et traçable." },
      { title: "Onboarding collaborateurs", context: "RH et managers répètent les mêmes actions et relances à chaque arrivée.", action: "Il orchestre formulaires, création de tâches, notifications, collecte de pièces et rappels.", result: "Le processus devient visible, standardisé et moins dépendant des relances manuelles." }
    ],
    boundaries: "L’Automation Engineer n’est pas nécessairement un Agent Engineer. Beaucoup d’automatisations gagnent à rester déterministes. Il se distingue aussi du RPA pur lorsqu’il privilégie APIs, événements et intégrations structurées. Le rôle devient particulièrement rentable sur des processus fréquents, stables et chronophages, surtout lorsque plusieurs outils ne communiquent pas entre eux.",
    questions: ["Combien de fois le processus se répète-t-il ?", "Quelles données entrent ?", "Quelles exceptions existent ?", "Quels systèmes disposent d’APIs ?", "Où une validation humaine est-elle nécessaire ?", "Quelle action est irréversible ?", "Quel temps est perdu aujourd’hui ?", "Quel taux d’automatisation est réaliste ?", "Comment reprendre en cas d’échec ?", "Quel changement d’outil pourrait casser le workflow ?"],
    sources: [
      ["Indeed — AI Automation", "https://fr.indeed.com/q-ai-automation-emplois.html"],
      ["Free-Work — missions IA générative", "https://www.free-work.com/fr/tech-it/jobs/ia-generative"]
    ],
    faq: [
      ["Faut-il toujours utiliser de l’IA ?", "Non. Une bonne automatisation utilise d’abord règles, APIs et événements. L’IA intervient lorsque l’information est non structurée ou qu’une interprétation apporte une valeur réelle."],
      ["No-code ou code ?", "Les deux. Le choix dépend du volume, de la criticité, de la complexité, des exigences de sécurité et de la maintenabilité. Un workflow critique peut commencer en no-code puis être renforcé."],
      ["Quelle différence avec un Agent Engineer ?", "L’Automation Engineer privilégie un workflow maîtrisé et souvent déterministe. L’Agent Engineer traite davantage les étapes dynamiques où le système doit choisir outils ou trajectoires."],
      ["Quels processus cibler d’abord ?", "Ceux qui sont fréquents, répétitifs, suffisamment standardisés et coûteux en temps, avec des entrées et sorties identifiables. Les exceptions doivent être connues avant d’automatiser."]
    ]
  }
];

export function getAiRole(slug) {
  return aiRoles.find((role) => role.slug === slug) || null;
}

export function getAiRoleStaticParams() {
  return aiRoles.map((role) => ({ slug: role.slug }));
}
