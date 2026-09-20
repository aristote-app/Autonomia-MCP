const expertDefaults = {
  universe: "AUTONOMIA EXPERTS",
  mode: "experts",
  theme: "dark",
  cta: "Décrire mon besoin",
  proofTitle: "Une mission se staffe sur le besoin réel.",
  proofText:
    "Autonomia part du contexte, du niveau d’autonomie attendu et des compétences nécessaires avant de sélectionner les profils à présenter."
};

const academyDefaults = {
  universe: "AUTONOMIA ACADEMY",
  mode: "academy",
  theme: "light",
  cta: "Construire mon plan de formation",
  proofTitle: "Former pour rendre les équipes capables d’agir.",
  proofText:
    "Le contenu, les cas d’usage et le niveau sont adaptés au public visé, puis reliés à des pratiques que les équipes doivent pouvoir réutiliser dans leur travail."
};

const diagnosticDefaults = {
  universe: "AUTONOMIA DIAGNOSTIC",
  mode: "diagnostic",
  theme: "signal",
  cta: "Commencer le diagnostic",
  proofTitle: "Un diagnostic doit déboucher sur une décision.",
  proofText:
    "Le résultat attendu n’est pas un score décoratif : il sert à clarifier le besoin, la compétence manquante ou la prochaine action utile."
};

const pages = {
  experts: {
    ...expertDefaults,
    slug: "experts",
    title: "Ajoutez la bonne compétence IA au bon moment.",
    subtitle:
      "Du cadrage au déploiement, Autonomia identifie les compétences nécessaires, sélectionne les profils adaptés et organise le staffing.",
    contextTitle: "Pas une base de CV. Une capacité d’exécution.",
    contextText:
      "Un besoin IA se résume rarement à un intitulé de poste. Nous partons du problème à résoudre, du niveau de séniorité, de l’environnement technique et du rôle attendu dans l’équipe.",
    outcomes: ["Besoin clarifié", "Compétences identifiées", "Profils sélectionnés"],
    capabilities: ["GenAI / LLM", "RAG", "Agents IA", "AI Product", "Data / ML", "MLOps / LLMOps", "Automatisation", "Gouvernance IA"],
    translationTitle: "Un problème concret devient une combinaison de compétences — puis une mission.",
    translations: [
      {
        need: "Notre pilote RAG répond mal sur les documents internes.",
        skills: "Retrieval · évaluation · observabilité · intégration",
        activation: "RAG / LLM Engineer — rôle à confirmer après cadrage"
      },
      {
        need: "Nous voulons automatiser un processus avec des agents IA.",
        skills: "Orchestration · tools · permissions · human-in-the-loop",
        activation: "AI Agent / Automation Engineer"
      },
      {
        need: "Le projet IA implique métier, data, sécurité et juridique mais n’avance pas.",
        skills: "Roadmap · arbitrage · dépendances · critères de réussite",
        activation: "AI Project Manager"
      }
    ],
    faq: [
      ["Autonomia est-il une marketplace ?", "Non. Le positionnement repose sur la compréhension du besoin, la sélection et le staffing, pas sur l’accès à un catalogue de profils."],
      ["Quels types de missions ?", "Renfort d’équipe, expertise ciblée, pilotage de projet, conception ou déploiement de solutions IA selon le besoin exprimé."],
      ["Peut-on partir d’un besoin encore flou ?", "Oui. Le premier travail consiste précisément à transformer un besoin métier en compétences et rôles nécessaires."]
    ]
  },
  academy: {
    ...academyDefaults,
    slug: "academy",
    title: "Faites monter toute votre organisation en puissance sur l’IA.",
    subtitle:
      "Des formations IA conçues pour les usages réels de l’entreprise : dirigeants, managers, métiers, fonctions support et équipes techniques.",
    contextTitle: "L’adoption ne se décrète pas. Elle se construit.",
    contextText:
      "Une formation utile relie les outils aux tâches, aux risques, aux règles internes et aux décisions que les collaborateurs doivent réellement prendre.",
    outcomes: ["Usages cadrés", "Compétences transférées", "Adoption structurée"],
    capabilities: ["IA générative", "ChatGPT", "Microsoft Copilot", "Prompt", "Agents IA", "Automatisation", "AI Act", "Conduite du changement"],
    translationTitle: "Un besoin d’adoption devient un parcours ciblé — pas un catalogue de cours.",
    translations: [
      {
        need: "Copilot est déployé mais les usages restent faibles.",
        skills: "Cas d’usage · méthodes · vérification · routines métier",
        activation: "Parcours Copilot segmenté par population"
      },
      {
        need: "Les managers utilisent l’IA sans cadre commun.",
        skills: "AI literacy · gouvernance · décisions · règles d’usage",
        activation: "Parcours managers + gouvernance opérationnelle"
      },
      {
        need: "Les équipes veulent automatiser des tâches récurrentes.",
        skills: "Process mapping · no-code · agents · supervision",
        activation: "Parcours automatisation avec ateliers métier"
      }
    ],
    faq: [
      ["Les formations sont-elles sur mesure ?", "Les parcours peuvent être adaptés aux métiers, aux niveaux, aux outils et aux cas d’usage réellement retenus par l’entreprise."],
      ["Peut-on partir de nos propres tâches ?", "Oui. Le cadrage peut partir des situations de travail afin de relier chaque apprentissage à un usage concret."],
      ["Peut-on former plusieurs populations ?", "Oui. Une même trajectoire peut être structurée par rôle : direction, managers, métiers, fonctions support ou équipes techniques."]
    ]
  },

  "consultant-ia": {
    ...expertDefaults,
    slug: "consultant-ia",
    title: "Un consultant IA adapté à votre projet — pas à un mot-clé.",
    subtitle:
      "Cadrage, choix technologiques, pilotage, GenAI, automatisation, gouvernance : décrivez le résultat attendu, Autonomia traduit le besoin en compétences.",
    contextTitle: "Le bon consultant dépend du problème à résoudre.",
    contextText:
      "Une entreprise qui veut cadrer une feuille de route IA n’a pas besoin du même profil qu’une équipe qui doit industrialiser un RAG ou automatiser un processus métier.",
    outcomes: ["Cadrage du besoin", "Profil-type défini", "Sélection ciblée"],
    capabilities: ["Conseil IA", "GenAI", "RAG", "Agents", "Automatisation", "Gouvernance", "Pilotage"],
    ads: {
      intent: "Recherche active d’un consultant IA pour une mission B2B",
      keywordGroups: ["consultant ia", "consultant intelligence artificielle", "consultant ai entreprise"],
      negativeKeywords: ["emploi", "salaire", "formation", "stage", "alternance", "cv", "définition"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["Trouvez le consultant IA adapté à votre projet", "Votre besoin IA, traduit en compétence opérationnelle"]
    },
    faq: [
      ["Comment choisissez-vous le profil ?", "À partir du contexte, du résultat attendu, des contraintes techniques et du rôle que la personne devra réellement tenir."],
      ["Pouvez-vous intervenir sur un besoin non technique ?", "Oui. Les rôles peuvent couvrir le pilotage, le produit, l’adoption, la gouvernance ou la conduite du changement."],
      ["Le formulaire demande-t-il un cahier des charges complet ?", "Non. Quelques éléments suffisent au départ ; le besoin est ensuite qualifié."]
    ]
  },

  "freelance-ia": {
    ...expertDefaults,
    slug: "freelance-ia",
    title: "Renforcez votre équipe avec une compétence IA ciblée.",
    subtitle:
      "Pour une mission, un renfort ou une expertise ponctuelle : partez du travail à accomplir, pas d’une CVthèque.",
    contextTitle: "Le freelance n’est pas le produit. La compétence disponible au bon moment l’est.",
    contextText:
      "Autonomia structure le besoin de mission, identifie les compétences critiques et concentre la sélection sur les profils capables de s’intégrer au contexte de l’entreprise.",
    outcomes: ["Mission cadrée", "Expertise ciblée", "Staffing organisé"],
    capabilities: ["LLM", "RAG", "Agents", "Data Science", "ML Engineering", "MLOps", "AI Product", "Automatisation"],
    ads: {
      intent: "Entreprise recherchant un freelance IA",
      keywordGroups: ["freelance ia", "freelance intelligence artificielle", "freelance ai"],
      negativeKeywords: ["devenir freelance", "tarif freelance débutant", "emploi", "mission freelance cherche", "formation"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["La compétence IA qu’il manque à votre équipe", "Trouvez un freelance IA pour votre mission"]
    },
    faq: [
      ["Est-ce une plateforme d’inscription libre ?", "Non. L’expérience client est organisée autour du besoin de mission et de la sélection de compétences pertinentes."],
      ["Quels niveaux de séniorité ?", "Le niveau doit être défini selon le degré d’autonomie, de conception, de pilotage ou d’industrialisation attendu."],
      ["Peut-on demander plusieurs compétences ?", "Oui. Certains projets nécessitent plusieurs rôles ou une combinaison produit, data, engineering et adoption."]
    ]
  },

  "expert-ia": {
    ...expertDefaults,
    slug: "expert-ia",
    title: "Trouvez l’expertise IA que votre équipe n’a pas encore.",
    subtitle:
      "Autonomia transforme un objectif métier ou technique en besoin de compétences, puis organise la sélection des profils.",
    contextTitle: "Un projet IA échoue rarement faute d’outils.",
    contextText:
      "Il bloque plus souvent sur une compétence absente : architecture, data, évaluation, produit, orchestration, adoption ou gouvernance.",
    outcomes: ["Compétence manquante identifiée", "Rôle défini", "Profils ciblés"],
    capabilities: ["GenAI Engineer", "LLM Engineer", "RAG Engineer", "AI Agent Engineer", "Data Scientist", "ML Engineer", "AI Product Manager", "AI Governance"],
    ads: {
      intent: "Recherche d’un expert IA spécialisé",
      keywordGroups: ["expert ia", "expert intelligence artificielle", "expert ai entreprise"],
      negativeKeywords: ["emploi", "devenir expert", "cours", "gratuit", "actualité"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["Trouvez l’expertise IA qu’il vous manque", "Experts IA sélectionnés selon votre besoin"]
    },
    faq: [
      ["Qu’entendez-vous par expert IA ?", "Un rôle défini par des compétences et un niveau d’autonomie liés à une mission précise, pas un intitulé générique."],
      ["Pouvez-vous couvrir les fonctions produit ?", "Oui, notamment AI Product Manager ou AI Project Manager lorsque le besoin est de piloter plutôt que de coder."],
      ["Et la gouvernance ?", "Les besoins de gouvernance, Responsible AI et sensibilisation réglementaire peuvent faire partie du cadrage."]
    ]
  },

  "consultant-genai": {
    ...expertDefaults,
    slug: "consultant-genai",
    title: "Passez du prototype GenAI à un usage qui tient en production.",
    subtitle:
      "Architecture, choix de modèles, évaluation, sécurité, intégration métier : trouvez le profil adapté au niveau de maturité de votre projet.",
    contextTitle: "Une démo GenAI et un produit exploitable sont deux choses différentes.",
    contextText:
      "Le besoin peut porter sur la conception, l’intégration, l’évaluation des sorties, la maîtrise des coûts, les garde-fous ou l’industrialisation.",
    outcomes: ["Architecture clarifiée", "Risques identifiés", "Compétence de delivery ciblée"],
    capabilities: ["LLM", "Evaluation", "Guardrails", "Prompt systems", "RAG", "Agents", "LLMOps"],
    ads: {
      intent: "Projet GenAI en cadrage ou déploiement",
      keywordGroups: ["consultant genai", "consultant generative ai", "expert genai"],
      negativeKeywords: ["emploi", "formation", "cours", "définition", "générateur image"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["Un expert GenAI pour passer du POC au déploiement", "Construisez une GenAI exploitable, pas une simple démo"]
    },
    faq: [
      ["Le besoin doit-il être déjà architecturalement défini ?", "Non. Le cadrage peut précisément servir à déterminer l’architecture et les compétences nécessaires."],
      ["RAG ou fine-tuning ?", "Le choix dépend du cas d’usage, des données, des exigences de mise à jour et du niveau de contrôle recherché ; il ne doit pas être présupposé."],
      ["Pouvez-vous couvrir l’évaluation ?", "Oui, l’évaluation des réponses et la qualité opérationnelle font partie des compétences possibles à cibler."]
    ]
  },

  "consultant-rag": {
    ...expertDefaults,
    slug: "consultant-rag",
    title: "Construisez un RAG qui retrouve la bonne information — et sait quand il ne sait pas.",
    subtitle:
      "Ingestion, chunking, retrieval, reranking, évaluation et intégration : ciblez l’expertise RAG réellement nécessaire.",
    contextTitle: "Un RAG n’est pas un moteur de recherche avec un chatbot par-dessus.",
    contextText:
      "La qualité dépend de la chaîne complète : sources, préparation documentaire, stratégie de récupération, contexte envoyé au modèle, évaluation et observabilité.",
    outcomes: ["Chaîne RAG cadrée", "Points de qualité identifiés", "Expertise ciblée"],
    capabilities: ["Ingestion", "Embeddings", "Vector search", "Hybrid search", "Reranking", "Evaluation", "Observabilité"],
    ads: {
      intent: "Entreprise construisant ou corrigeant un système RAG",
      keywordGroups: ["consultant rag", "expert rag", "rag engineer freelance"],
      negativeKeywords: ["définition", "tutoriel", "github", "emploi", "formation gratuite"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["Trouvez un expert RAG pour votre architecture", "Votre RAG doit retrouver, citer et être évalué"]
    },
    faq: [
      ["Pouvez-vous intervenir sur un RAG existant ?", "Le besoin peut concerner une construction, une revue d’architecture ou l’amélioration d’un système dont la qualité n’est pas satisfaisante."],
      ["Quels sujets faut-il évaluer ?", "La récupération, la pertinence du contexte, la fidélité des réponses, les citations et le comportement sur les cas sans réponse."],
      ["Le profil doit-il être uniquement LLM ?", "Pas forcément : selon l’architecture, des compétences search, data engineering, backend ou MLOps peuvent être déterminantes."]
    ]
  },

  "consultant-agent-ia": {
    ...expertDefaults,
    slug: "consultant-agent-ia",
    title: "Transformez un workflow en système agentique maîtrisé.",
    subtitle:
      "Outils, orchestration, mémoire, permissions, validation humaine, observabilité : trouvez l’expertise pour construire des agents utiles et contrôlables.",
    contextTitle: "Un agent utile ne se résume pas à laisser un modèle agir.",
    contextText:
      "Il faut définir ce qu’il peut faire, avec quels outils, sous quelles permissions, avec quels contrôles et comment mesurer ses erreurs.",
    outcomes: ["Workflow cartographié", "Niveau d’autonomie défini", "Expertise agentique ciblée"],
    capabilities: ["Tool use", "Orchestration", "Human-in-the-loop", "Memory", "Permissions", "Evaluation", "Observabilité"],
    ads: {
      intent: "Projet d’agents IA ou automatisation agentique",
      keywordGroups: ["consultant agent ia", "expert agent ia", "ai agent engineer freelance"],
      negativeKeywords: ["agent immobilier", "agent commercial", "emploi", "formation gratuite", "jeu"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["Un expert pour construire vos agents IA", "Automatisez des workflows avec des agents contrôlables"]
    },
    faq: [
      ["Agent IA ou automatisation classique ?", "Le diagnostic doit d’abord déterminer si le besoin justifie réellement de l’autonomie agentique ou si un workflow déterministe est préférable."],
      ["Peut-on garder une validation humaine ?", "Oui. Le niveau d’autonomie et les points de contrôle doivent être conçus selon le risque et le processus."],
      ["Quels outils ?", "Le choix d’outils dépend de l’écosystème, des intégrations et des contraintes ; le site ne présuppose pas une stack unique."]
    ]
  },

  "ai-project-manager": {
    ...expertDefaults,
    slug: "ai-project-manager",
    title: "Un AI Project Manager pour faire avancer le projet, pas seulement le suivre.",
    subtitle:
      "Coordonnez métier, data, sécurité, juridique, produit et engineering autour d’un delivery IA structuré.",
    contextTitle: "Les projets IA croisent plus de dépendances qu’un projet logiciel classique.",
    contextText:
      "Données, modèles, évaluation, risques, adoption et métiers doivent avancer ensemble. Le rôle de pilotage devient une compétence centrale.",
    outcomes: ["Gouvernance projet posée", "Dépendances organisées", "Delivery piloté"],
    capabilities: ["Roadmap", "Use cases", "Delivery", "Evaluation", "Risk", "Stakeholders", "Adoption"],
    ads: {
      intent: "Recherche d’un chef de projet IA / AI Project Manager",
      keywordGroups: ["ai project manager freelance", "chef de projet ia freelance", "consultant chef de projet ia"],
      negativeKeywords: ["emploi", "salaire", "fiche métier", "formation", "alternance"],
      primaryConversion: "lead_expert",
      secondaryConversion: "form_start",
      headlineVariants: ["Pilotez votre projet IA avec le bon rôle", "Un AI Project Manager pour aligner métier et technique"]
    },
    faq: [
      ["Quelle différence avec un chef de projet IT ?", "Le rôle doit intégrer les spécificités des systèmes IA : données, évaluation, incertitude des sorties, risques et adoption."],
      ["Le profil doit-il être très technique ?", "Le niveau technique dépend du projet. L’enjeu est surtout de pouvoir arbitrer et coordonner les bons interlocuteurs."],
      ["Peut-il intervenir en amont ?", "Oui, notamment pour structurer les cas d’usage, la roadmap, les dépendances et les critères de réussite."]
    ]
  },

  "formation-ia-entreprise": {
    ...academyDefaults,
    slug: "formation-ia-entreprise",
    title: "Formez votre entreprise à l’IA avec un plan qui part des usages.",
    subtitle:
      "Direction, managers, métiers ou fonctions support : structurez une montée en compétences adaptée aux tâches, aux risques et au niveau de maturité.",
    contextTitle: "Une formation IA générique crée rarement une adoption durable.",
    contextText:
      "L’enjeu est de relier les capacités de l’IA au travail réel : ce que les équipes font aujourd’hui, ce qu’elles peuvent améliorer et ce qu’elles doivent encadrer.",
    outcomes: ["Publics segmentés", "Compétences ciblées", "Parcours construit"],
    capabilities: ["Direction", "Managers", "RH", "Marketing", "Commercial", "Administratif", "Métiers", "Technique"],
    ads: {
      intent: "Entreprise cherchant une formation IA B2B",
      keywordGroups: ["formation ia entreprise", "formation intelligence artificielle entreprise", "formation ia salariés"],
      negativeKeywords: ["gratuit", "cpf particulier", "étudiant", "cours en ligne gratuit", "master", "école"],
      primaryConversion: "lead_training",
      secondaryConversion: "form_start",
      headlineVariants: ["Construisez votre plan de formation IA entreprise", "Une formation IA pensée pour vos usages réels"]
    },
    faq: [
      ["Pouvez-vous construire un parcours multi-publics ?", "Oui. Le programme peut être segmenté selon les rôles, les niveaux et les cas d’usage."],
      ["Présentiel ou distanciel ?", "Les modalités seront affichées selon l’offre effectivement disponible et validée."],
      ["Comment est traitée la conformité ?", "Les contenus peuvent intégrer gouvernance, confidentialité, usages autorisés et sensibilisation réglementaire selon le besoin."]
    ]
  },

  "formation-chatgpt-entreprise": {
    ...academyDefaults,
    slug: "formation-chatgpt-entreprise",
    title: "Faites de ChatGPT un outil de travail — pas un onglet ouvert de plus.",
    subtitle:
      "Apprenez aux équipes à cadrer une demande, vérifier une réponse, créer des méthodes réutilisables et travailler dans les limites fixées par l’entreprise.",
    contextTitle: "Savoir écrire un prompt n’est qu’une petite partie du sujet.",
    contextText:
      "La vraie compétence consiste à choisir les bonnes tâches, structurer le contexte, contrôler la qualité, réutiliser les méthodes et respecter les règles internes.",
    outcomes: ["Cas d’usage identifiés", "Méthodes réutilisables", "Usage mieux encadré"],
    capabilities: ["Prompt", "Recherche", "Synthèse", "Rédaction", "Analyse", "Méthodes", "Contrôle qualité"],
    ads: {
      intent: "Formation ChatGPT pour salariés / entreprise",
      keywordGroups: ["formation chatgpt entreprise", "formation chatgpt salariés", "formation chatgpt professionnel"],
      negativeKeywords: ["gratuit", "particulier", "étudiant", "youtube", "pdf"],
      primaryConversion: "lead_training",
      secondaryConversion: "form_start",
      headlineVariants: ["Formez vos équipes à un usage professionnel de ChatGPT", "ChatGPT en entreprise : des usages utiles et maîtrisés"]
    },
    faq: [
      ["Est-ce une initiation ?", "Le niveau peut aller de la prise en main aux méthodes avancées, selon le public et les usages."],
      ["Travaillez-vous sur des cas métier ?", "Le format entreprise est précisément pensé pour relier les méthodes aux tâches réelles des participants."],
      ["La sécurité des données est-elle abordée ?", "Elle doit l’être dès que l’outil est utilisé dans un contexte professionnel, selon les règles et configurations retenues par l’entreprise."]
    ]
  },

  "formation-copilot": {
    ...academyDefaults,
    slug: "formation-copilot",
    title: "Microsoft Copilot : formez sur le travail réel, pas sur une visite guidée des boutons.",
    subtitle:
      "Word, Excel, PowerPoint, Outlook, Teams et usages transverses : construisez une adoption adaptée à votre environnement Microsoft.",
    contextTitle: "Le ROI de Copilot dépend moins de la licence que des usages.",
    contextText:
      "Les collaborateurs doivent savoir quelles tâches déléguer, comment donner du contexte, comment vérifier les résultats et comment intégrer Copilot dans leurs routines.",
    outcomes: ["Usages prioritaires définis", "Populations ciblées", "Adoption structurée"],
    capabilities: ["Word", "Excel", "PowerPoint", "Outlook", "Teams", "Prompt", "Gouvernance"],
    ads: {
      intent: "Entreprise ayant ou prévoyant Microsoft Copilot",
      keywordGroups: ["formation copilot entreprise", "formation microsoft copilot", "formation copilot 365"],
      negativeKeywords: ["github copilot", "gratuit", "particulier", "emploi", "certification examen"],
      primaryConversion: "lead_training",
      secondaryConversion: "diagnostic_copilot",
      headlineVariants: ["Faites adopter Microsoft Copilot par vos équipes", "Copilot 365 : formez sur vos usages métier"]
    },
    faq: [
      ["Microsoft 365 Copilot ou GitHub Copilot ?", "Cette page vise Microsoft 365 Copilot pour les usages de productivité en entreprise."],
      ["Faut-il déjà avoir déployé les licences ?", "Non. Un diagnostic en amont peut aider à cibler les populations, les usages et le plan d’adoption."],
      ["Peut-on segmenter par métier ?", "Oui, car les gains et les pratiques utiles diffèrent fortement entre fonctions."]
    ]
  },

  "formation-ia-generative": {
    ...academyDefaults,
    slug: "formation-ia-generative",
    title: "Donnez à vos équipes une vraie culture opérationnelle de l’IA générative.",
    subtitle:
      "Comprendre ce qu’elle sait faire, ses limites, les bons cas d’usage et les méthodes pour l’utiliser avec exigence.",
    contextTitle: "L’IA générative change les façons de produire, analyser et décider.",
    contextText:
      "Une formation utile doit aller au-delà de l’effet démonstration : fonctionnement, limites, qualité des entrées, contrôle des sorties, sécurité et intégration métier.",
    outcomes: ["Compréhension commune", "Cas d’usage cadrés", "Pratiques transférables"],
    capabilities: ["LLM", "Multimodal", "Prompt", "Evaluation", "Risques", "Usages métier"],
    ads: {
      intent: "Formation IA générative entreprise",
      keywordGroups: ["formation ia générative entreprise", "formation generative ai entreprise", "formation intelligence artificielle générative"],
      negativeKeywords: ["gratuit", "étudiant", "master", "école", "cours pdf"],
      primaryConversion: "lead_training",
      secondaryConversion: "form_start",
      headlineVariants: ["Formez vos équipes à l’IA générative", "Une culture IA générative utile au travail réel"]
    },
    faq: [
      ["Quels outils sont couverts ?", "Le choix doit être adapté à l’environnement réellement utilisé par l’entreprise et au programme retenu."],
      ["Faut-il un niveau technique ?", "Non pour les formations métier ou management ; des parcours techniques peuvent être distincts."],
      ["Peut-on travailler les limites ?", "Oui. Comprendre l’incertitude, les erreurs et les conditions de vérification est essentiel."]
    ]
  },

  "formation-ai-act": {
    ...academyDefaults,
    slug: "formation-ai-act",
    title: "AI Act : donnez aux équipes les bons réflexes avant que les usages se multiplient.",
    subtitle:
      "Sensibilisation, rôles, risques et responsabilités : construisez une culture de conformité adaptée aux usages IA de l’entreprise.",
    contextTitle: "La conformité IA n’est pas uniquement un sujet juridique.",
    contextText:
      "Les collaborateurs qui choisissent, configurent ou utilisent des systèmes IA doivent comprendre les règles internes, les niveaux de risque et les bons circuits de validation.",
    outcomes: ["Populations à sensibiliser", "Risques mieux compris", "Règles rendues actionnables"],
    capabilities: ["AI literacy", "Risk", "Governance", "Usage policy", "Human oversight", "Traceability"],
    ads: {
      intent: "Formation / sensibilisation AI Act entreprise",
      keywordGroups: ["formation ai act entreprise", "formation règlement ia", "sensibilisation ai act"],
      negativeKeywords: ["texte complet", "pdf gratuit", "emploi", "actualité uniquement"],
      primaryConversion: "lead_training",
      secondaryConversion: "form_start",
      headlineVariants: ["Sensibilisez vos équipes à l’AI Act", "AI Act : transformez les obligations en réflexes opérationnels"]
    },
    faq: [
      ["Est-ce un conseil juridique ?", "La formation vise la compréhension opérationnelle et la sensibilisation. Les besoins de conseil juridique doivent être distingués et traités par les professionnels compétents."],
      ["Qui former ?", "Cela dépend des usages : direction, équipes produit, métiers, RH, achats, IT, sécurité ou fonctions de contrôle peuvent être concernés."],
      ["Peut-on partir de nos cas d’usage ?", "Oui, c’est la meilleure façon de relier les concepts de risque aux situations réellement rencontrées."]
    ]
  },

  "formation-agents-ia": {
    ...academyDefaults,
    slug: "formation-agents-ia",
    title: "Comprenez où les agents IA créent de la valeur — et où ils ajoutent du risque.",
    subtitle:
      "Former les équipes à concevoir, superviser ou décider des workflows agentiques sans confondre autonomie et magie.",
    contextTitle: "Les agents déplacent la frontière entre assistance et action.",
    contextText:
      "Il faut comprendre les outils, les boucles de décision, les permissions, les validations humaines et les mécanismes de contrôle avant de déléguer des tâches.",
    outcomes: ["Cas d’usage qualifiés", "Niveau d’autonomie compris", "Risques mieux cadrés"],
    capabilities: ["Agents", "Tools", "Workflow", "Human oversight", "Evaluation", "Automation"],
    ads: {
      intent: "Formation agents IA entreprise",
      keywordGroups: ["formation agents ia", "formation agentic ai", "formation ai agents entreprise"],
      negativeKeywords: ["agent immobilier", "emploi", "jeu", "gratuit"],
      primaryConversion: "lead_training",
      secondaryConversion: "form_start",
      headlineVariants: ["Formez vos équipes aux agents IA", "Agents IA : comprendre, concevoir, superviser"]
    },
    faq: [
      ["Est-ce une formation technique ?", "Elle peut être décisionnelle, métier ou technique selon le public."],
      ["Faut-il savoir coder ?", "Pas pour comprendre les cas d’usage, les risques et les principes ; un parcours de construction technique peut être distinct."],
      ["Agents et automatisation, est-ce pareil ?", "Non. Une partie du travail consiste justement à savoir quand un workflow déterministe suffit."]
    ]
  },

  "formation-prompt-engineering": {
    ...academyDefaults,
    slug: "formation-prompt-engineering",
    title: "Le prompt engineering utile : obtenir un travail vérifiable et réutilisable.",
    subtitle:
      "Apprenez à structurer objectifs, contexte, contraintes, formats et critères de qualité pour transformer les prompts en méthodes de travail.",
    contextTitle: "Un bon prompt n’est pas une formule magique.",
    contextText:
      "La compétence vient de la structuration du problème, de la qualité du contexte, des critères d’évaluation et de la capacité à itérer de façon reproductible.",
    outcomes: ["Prompts structurés", "Méthodes réutilisables", "Qualité mieux contrôlée"],
    capabilities: ["Context", "Constraints", "Few-shot", "Evaluation", "Templates", "Workflows"],
    ads: {
      intent: "Formation prompt engineering professionnelle",
      keywordGroups: ["formation prompt engineering entreprise", "formation prompt chatgpt entreprise", "formation prompts professionnels"],
      negativeKeywords: ["gratuit", "pdf", "prompt liste", "emploi", "étudiant"],
      primaryConversion: "lead_training",
      secondaryConversion: "form_start",
      headlineVariants: ["Formez vos équipes au prompt engineering utile", "Transformez les prompts en méthodes de travail"]
    },
    faq: [
      ["Est-ce réservé aux équipes techniques ?", "Non. La structuration d’une demande et le contrôle qualité sont utiles à de nombreux métiers."],
      ["Travaillez-vous avec des modèles de prompts ?", "Oui, mais l’objectif est surtout d’apprendre à construire et adapter une méthode plutôt que recopier des recettes."],
      ["Comment éviter les réponses fausses ?", "Aucun prompt ne les élimine. La formation doit intégrer les méthodes de vérification, de cadrage et d’évaluation."]
    ]
  },

  "diagnostic-maturite-ia": {
    ...diagnosticDefaults,
    slug: "diagnostic-maturite-ia",
    title: "Votre entreprise est-elle réellement prête à exécuter avec l’IA ?",
    subtitle:
      "En quelques questions, clarifiez où se trouvent les vrais blocages : cas d’usage, compétences, données, gouvernance ou adoption.",
    contextTitle: "La maturité IA n’est pas le nombre d’outils testés.",
    contextText:
      "Elle se voit dans la capacité à choisir les bons usages, les faire avancer, mesurer la qualité, gérer les risques et diffuser les compétences.",
    outcomes: ["Blocage principal identifié", "Priorité clarifiée", "Prochaine action orientée"],
    capabilities: ["Use cases", "Skills", "Data", "Governance", "Delivery", "Adoption"],
    ads: {
      intent: "Cold traffic / prise de conscience",
      keywordGroups: [],
      negativeKeywords: [],
      primaryConversion: "diagnostic_complete",
      secondaryConversion: "diagnostic_start",
      headlineVariants: ["Votre entreprise est-elle vraiment prête pour l’IA ?", "Testez votre capacité d’exécution IA"]
    },
    faq: [
      ["Est-ce un audit complet ?", "Non. C’est une porte d’entrée courte pour identifier le sujet qui mérite d’être approfondi."],
      ["Y a-t-il un score automatique ?", "La V1 privilégie une orientation utile plutôt qu’un score décoratif non validé."],
      ["Que se passe-t-il ensuite ?", "Le besoin peut être orienté vers expertise, formation ou cadrage selon les réponses."]
    ]
  },

  "diagnostic-competences-ia": {
    ...diagnosticDefaults,
    slug: "diagnostic-competences-ia",
    title: "Quelles compétences IA manquent réellement à votre organisation ?",
    subtitle:
      "Distinguez ce qui doit être recruté, staffé, transmis ou simplement mieux organisé.",
    contextTitle: "Tous les écarts de compétence ne se traitent pas de la même manière.",
    contextText:
      "Certaines expertises sont ponctuelles et spécialisées ; d’autres doivent devenir une capacité interne durable.",
    outcomes: ["Gap de compétence clarifié", "Build / staff / train orienté", "Priorité définie"],
    capabilities: ["Engineering", "Product", "Project", "Data", "Governance", "Adoption"],
    faq: [
      ["Le diagnostic recommande-t-il automatiquement un freelance ?", "Non. Il sert d’abord à distinguer expertise externe, montée en compétences interne et besoin d’organisation."],
      ["Peut-il couvrir les fonctions métier ?", "Oui. Les compétences IA ne sont pas uniquement techniques."],
      ["Faut-il déjà avoir une équipe IA ?", "Non. Le diagnostic peut justement aider à structurer les premiers rôles."]
    ]
  },

  "diagnostic-projet-ia": {
    ...diagnosticDefaults,
    slug: "diagnostic-projet-ia",
    title: "Votre projet IA a-t-il le bon problème, les bonnes données et les bonnes compétences ?",
    subtitle:
      "Clarifiez les trois points qui conditionnent le passage d’une idée à une exécution crédible.",
    contextTitle: "Un projet IA peut être techniquement faisable et rester mauvais pour l’entreprise.",
    contextText:
      "Avant de staffer ou d’acheter un outil, il faut vérifier la valeur attendue, les données disponibles, le niveau de risque et la capacité de delivery.",
    outcomes: ["Problème reformulé", "Dépendances identifiées", "Besoin de compétences orienté"],
    capabilities: ["Value", "Data", "Delivery", "Risk", "Skills", "Adoption"],
    faq: [
      ["Est-ce un cadrage technique complet ?", "Non. Le funnel identifie les points à approfondir avant un cadrage détaillé."],
      ["Peut-on arriver avec une simple idée ?", "Oui. Le diagnostic sert précisément à éviter de transformer trop tôt une idée en solution imposée."],
      ["Et si le projet n’a pas besoin d’IA ?", "Le bon résultat peut être de conclure qu’une automatisation plus simple répond mieux au besoin."]
    ]
  },

  "audit-besoins-formation-ia": {
    ...diagnosticDefaults,
    slug: "audit-besoins-formation-ia",
    title: "Qui former à quoi — et pour quel changement concret ?",
    subtitle:
      "Identifiez les populations, les usages et les niveaux avant de construire un programme de formation IA.",
    contextTitle: "Former tout le monde au même contenu est rarement la bonne réponse.",
    contextText:
      "Direction, managers, métiers et fonctions support n’ont ni les mêmes décisions, ni les mêmes risques, ni les mêmes usages.",
    outcomes: ["Populations segmentées", "Objectifs définis", "Parcours orienté"],
    capabilities: ["Direction", "Managers", "Métiers", "Support", "Technical", "Governance"],
    faq: [
      ["Est-ce un catalogue ?", "Non. Le diagnostic vise à construire une architecture de formation adaptée à l’organisation."],
      ["Peut-on mixer sensibilisation et pratique ?", "Oui. Les parcours peuvent combiner culture commune, méthodes opérationnelles et spécialisation métier."],
      ["Combien de questions ?", "Le funnel reste volontairement court ; l’approfondissement vient après le premier signal d’intérêt."]
    ]
  },

  "quel-profil-ia": {
    ...diagnosticDefaults,
    slug: "quel-profil-ia",
    title: "De quel profil IA votre projet a-t-il réellement besoin ?",
    subtitle:
      "AI Project Manager, GenAI Engineer, RAG Engineer, Automation expert… partez du travail à accomplir pour identifier le rôle.",
    contextTitle: "Les intitulés IA se multiplient plus vite que les équipes ne peuvent les décoder.",
    contextText:
      "Le bon rôle dépend du problème, du niveau de maturité, de la stack et de ce que la personne devra décider ou produire.",
    outcomes: ["Mission reformulée", "Rôle probable", "Compétences prioritaires"],
    capabilities: ["Project", "Product", "LLM", "RAG", "Agents", "Data", "MLOps", "Governance"],
    faq: [
      ["Le résultat est-il définitif ?", "Non. C’est une première orientation qui doit être confrontée au contexte réel de la mission."],
      ["Peut-il y avoir plusieurs rôles ?", "Oui. Certains projets nécessitent un binôme ou une équipe plutôt qu’un profil unique."],
      ["Et si je ne connais pas la stack ?", "Ce n’est pas bloquant pour commencer ; le contexte technique peut être qualifié ensuite."]
    ]
  },

  "diagnostic-copilot": {
    ...diagnosticDefaults,
    slug: "diagnostic-copilot",
    title: "Vos licences Copilot ont-elles un plan d’adoption derrière elles ?",
    subtitle:
      "Identifiez les populations, les tâches et les freins avant de généraliser l’usage.",
    contextTitle: "Déployer une licence ne crée pas une nouvelle façon de travailler.",
    contextText:
      "L’adoption dépend des tâches ciblées, de l’accès aux bonnes données, de la maîtrise de l’outil et des règles d’usage.",
    outcomes: ["Usages prioritaires", "Populations ciblées", "Plan d’adoption orienté"],
    capabilities: ["Microsoft 365", "Use cases", "Prompt", "Governance", "Adoption", "Measurement"],
    faq: [
      ["Faut-il déjà avoir Copilot ?", "Non. Le diagnostic peut être utile avant le déploiement comme après un premier pilote."],
      ["Mesure-t-il le ROI ?", "Pas sans données réelles. Il sert d’abord à identifier les conditions d’un déploiement mesurable."],
      ["Peut-il déboucher sur une formation ?", "Oui, si le besoin principal est l’adoption et la montée en compétences."]
    ]
  },

  "quiz-ia-entreprise": {
    ...diagnosticDefaults,
    slug: "quiz-ia-entreprise",
    title: "7 questions pour voir si votre IA avance… ou si elle s’accumule en pilotes.",
    subtitle:
      "Un quiz court pour détecter le goulot d’étranglement : priorité, compétence, delivery, gouvernance ou adoption.",
    contextTitle: "Avoir beaucoup d’initiatives n’est pas la même chose qu’avoir une capacité d’exécution.",
    contextText:
      "L’objectif du quiz est de transformer un intérêt diffus pour l’IA en prochain problème concret à résoudre.",
    outcomes: ["Friction principale", "Type de besoin", "Action suivante"],
    capabilities: ["Strategy", "Execution", "Skills", "Governance", "Adoption"],
    faq: [
      ["Le quiz fournit-il un benchmark sectoriel ?", "Pas sans données de référence vérifiées. La V1 reste centrée sur votre situation déclarée."],
      ["Est-il gratuit ?", "Le site pourra proposer ce diagnostic comme point d’entrée sans inventer de promesse de résultat."],
      ["Les réponses sont-elles utilisées commercialement ?", "Elles ne doivent l’être que selon les informations et consentements réellement recueillis dans le formulaire."]
    ]
  }
};

export function getPage(slug) {
  return pages[slug] || null;
}

export function getAllPages() {
  return Object.values(pages);
}

export function getStaticSlugs() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
