export const marketDemandExecutionArticlesWave3 = [
  {
    type: "execution",
    slug: "creer-un-assistant-support-qui-cite-les-procedures-internes",
    cluster: "Support client",
    title: "Assistant support IA avec sources : construire un support qui répond à partir des procédures et sait escalader",
    dek: "Un bon assistant support ne doit pas seulement produire une réponse plausible. Il doit chercher dans les bonnes sources, montrer d’où vient l’information, reconnaître quand la base ne suffit pas et transmettre proprement la conversation à un humain.",
    summary: "Les plateformes actuelles de support IA documentent un même pattern : connecter des sources de connaissances, générer une réponse ancrée dans ces contenus, préserver les droits et la fraîcheur des sources, puis prévoir une escalade lorsque la réponse est incertaine, sensible ou explicitement refusée par l’utilisateur. L’architecture Autonomia proposée ici sépare donc cinq couches : ingestion des connaissances, recherche, génération sourcée, règles de confiance et handoff humain. Ce n’est pas un chatbot générique ; c’est un système de support relié aux procédures réelles de l’entreprise.",
    readingTime: "20–24 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["customer_support", "knowledge_management", "rag", "agents", "human_in_the_loop", "files_documents"],
    search: {
      primaryKeyword: "assistant support IA base de connaissances",
      secondaryQueries: [
        "automatiser support client IA",
        "assistant support intelligence artificielle entreprise",
        "chatbot support base de connaissances",
        "agent IA service client",
        "assistant support qui cite ses sources"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["ARCHITECTURE", "Question → recherche → réponse sourcée → règles → escalade"],
      ["SOURCES", "Help center · procédures internes · documents · sites autorisés"],
      ["CONTRÔLE", "Pas de réponse libre si aucune source suffisante n’est trouvée"],
      ["HUMAIN", "Handoff prévu pour demandes sensibles, ambiguës ou non résolues"]
    ],
    sourceNote: "Microsoft Copilot Studio documente des agents ancrés dans des sources de connaissances, avec authentification et possibilité de bloquer les réponses non ancrées. Microsoft documente aussi le transfert vers des hubs de service client. Intercom documente de son côté la gestion de sources de connaissances pour ses agents IA et des règles d’escalade vers des équipes humaines. Le scénario ci-dessous est une architecture Autonomia générique : il ne suppose ni un éditeur unique ni un taux de résolution donné.",
    sources: [
      {
        label: "Microsoft Learn — sources de connaissances dans Copilot Studio",
        url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio"
      },
      {
        label: "Microsoft Learn — agents d’engagement client et handoff",
        url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/customer-copilot-overview"
      },
      {
        label: "Intercom Help — knowledge sources for AI agents",
        url: "https://www.intercom.com/help/en/articles/9440354-knowledge-sources-to-power-ai-agents-and-self-serve-support"
      },
      {
        label: "Intercom Help — escalation guidance and rules",
        url: "https://www.intercom.com/help/en/articles/12396892-manage-fin-ai-agent-s-escalation-guidance-and-rules"
      }
    ],
    related: [
      {
        href: "/cas-usage-ia/knowledge-management-recherche-interne",
        kicker: "PILIER",
        label: "Créer une mémoire d’entreprise avec l’IA"
      },
      {
        href: "/formation-ia/cas-usage/knowledge-management",
        kicker: "ACADEMY",
        label: "Former les équipes au knowledge management IA"
      }
    ],
    faq: [
      ["Faut-il un RAG pour créer un assistant support ?", "Pas toujours. Certaines plateformes gèrent directement les sources de connaissances et la recherche. Un RAG personnalisé devient pertinent lorsque l’entreprise doit contrôler finement ingestion, retrieval, sécurité, ranking, citations ou intégrations."],
      ["L’assistant doit-il répondre à toutes les questions ?", "Non. Une architecture robuste prévoit explicitement les cas où le système demande une précision, refuse de répondre à partir d’informations insuffisantes ou transmet à un humain."],
      ["Comment éviter une réponse inventée ?", "On limite les sources, on favorise des réponses ancrées, on teste les cas sans réponse, on exige des citations lorsque l’outil le permet et on définit des règles d’escalade plutôt que d’encourager le modèle à toujours produire quelque chose."],
      ["Peut-on utiliser des procédures internes non publiques ?", "Oui selon l’outil et les droits configurés. Il faut vérifier l’authentification, les permissions de la source, la politique de données et la manière dont l’agent respecte les droits de l’utilisateur."],
      ["Que faut-il transmettre au conseiller humain ?", "Au minimum la question, le contexte déjà collecté, les sources consultées, la réponse proposée ou l’échec constaté et la raison de l’escalade. L’objectif est d’éviter que le client recommence toute son explication."],
      ["Comment mesurer la qualité ?", "Il faut regarder séparément la récupération de la bonne source, la fidélité de la réponse, la capacité à dire qu’une information manque, la qualité du handoff et les corrections humaines. Un taux global unique masque souvent les causes d’échec."]
    ],
    sections: [
      {
        id: "situation",
        kicker: "01 — LE PROBLÈME",
        heading: "Le client pose une question simple. Le vrai système derrière la réponse ne l’est pas.",
        paragraphs: [
          "Un client écrit au support : « Je peux modifier mon abonnement en cours de mois ? » Pour un conseiller expérimenté, la réponse semble facile. Il connaît la règle, sait où se trouve la procédure, vérifie éventuellement le type de contrat puis répond. Mais à l’échelle d’une équipe, la difficulté apparaît très vite : la règle change, plusieurs offres coexistent, certaines exceptions dépendent du pays ou du canal, et la documentation se trouve dans plusieurs outils. Le problème n’est donc pas seulement de générer du texte. C’est de retrouver la bonne règle au bon moment.",
          "Un assistant support IA crédible doit partir de cette réalité. Avant de penser au ton de la réponse, il faut décider quelles sources font autorité, qui a le droit de les consulter, comment elles sont mises à jour et ce que le système fait lorsque deux documents se contredisent. Une réponse très fluide fondée sur une procédure périmée est plus dangereuse qu’un message qui dit clairement « je dois vérifier ce point ».",
          "L’architecture devient encore plus importante lorsqu’un assistant est exposé directement au client. Un employé peut détecter qu’une réponse semble douteuse et ouvrir la procédure. Un client, lui, ne sait pas toujours que l’agent a extrapolé. Le système doit donc être conçu pour réduire l’espace d’improvisation et rendre les exceptions visibles. Le but n’est pas de faire parler l’IA le plus souvent possible. Le but est de résoudre les demandes que le système sait réellement traiter.",
          "Les plateformes modernes convergent vers cette logique. Elles permettent de connecter des sources de connaissances, de rechercher du contenu pertinent et d’organiser un transfert humain lorsque la demande n’est pas résolue. Autonomia considère cette combinaison comme le socle : connaissance fiable, récupération, réponse ancrée, règles de contrôle, escalade."
        ]
      },
      {
        id: "architecture",
        kicker: "02 — L’ARCHITECTURE",
        heading: "Question → sources → retrieval → réponse → contrôle → action.",
        paragraphs: [
          "La première couche est l’entrée. La question peut arriver dans un widget web, une messagerie, WhatsApp, un portail ou un outil interne. Avant même d’appeler un modèle, le système peut récupérer quelques éléments déterministes : langue, identité si elle est connue, produit concerné, abonnement, canal, catégorie précédente ou données déjà fournies. Ces informations permettent de limiter la recherche et d’éviter une réponse générique.",
          "La deuxième couche est la recherche. L’agent ne doit pas parcourir indistinctement tous les documents de l’entreprise. Il interroge un ensemble de sources autorisées : articles du centre d’aide, procédures, documents internes, SharePoint, base documentaire ou moteur de recherche existant. Certains produits gèrent cette étape nativement ; une architecture plus personnalisée peut utiliser un moteur de recherche ou un RAG. Dans les deux cas, l’objectif est le même : retrouver des passages réellement pertinents avant de demander au modèle de répondre.",
          "La troisième couche est la génération. Le modèle reçoit la question et le contenu retrouvé. L’instruction doit lui demander de répondre uniquement à partir des éléments disponibles, de conserver les niveaux de certitude et de ne pas transformer une hypothèse en règle. Lorsque les outils le permettent, la réponse doit garder des citations ou des références vers les sources. Pour un support interne, cela permet au conseiller de vérifier rapidement. Pour un support client, on peut afficher des liens vers les articles publics pertinents.",
          "La quatrième couche est le contrôle. Le système évalue des conditions déterministes : aucune source trouvée, sources contradictoires, demande liée à un remboursement important, menace juridique, données sensibles, client très insatisfait, demande explicite de parler à une personne. Ces signaux ne doivent pas être noyés dans un prompt. Ils deviennent des branches de workflow.",
          "La cinquième couche est l’action. Si la réponse est suffisamment ancrée et que le sujet est dans le périmètre, le système répond. Sinon, il demande une précision ou crée un handoff. L’escalade ne doit pas être un échec silencieux. Elle produit un paquet de contexte exploitable par le conseiller humain."
        ],
        steps: [
          { title: "1. Identifier", text: "Récupérer canal, utilisateur, langue et contexte déterministe disponible." },
          { title: "2. Rechercher", text: "Interroger uniquement les sources autorisées et pertinentes." },
          { title: "3. Répondre", text: "Générer à partir des passages retrouvés, avec références lorsque possible." },
          { title: "4. Contrôler", text: "Appliquer règles de périmètre, sensibilité, contradiction et confiance opérationnelle." },
          { title: "5. Escalader", text: "Transmettre la conversation et le contexte si la demande sort du périmètre." },
          { title: "6. Apprendre", text: "Analyser corrections, échecs de recherche et trous de documentation." }
        ]
      },
      {
        id: "knowledge",
        kicker: "03 — LA CONNAISSANCE",
        heading: "La qualité de l’assistant commence bien avant le modèle.",
        paragraphs: [
          "Une base de connaissances destinée à un agent doit être pensée comme un produit. Les documents doivent avoir un propriétaire, un périmètre, une date de mise à jour et une règle de publication. Si une procédure sur les remboursements existe dans trois versions, l’agent n’a pas de moyen fiable de savoir laquelle représente la règle actuelle. Le problème est documentaire avant d’être algorithmique.",
          "Il faut donc commencer par inventorier les sources. Quelles informations sont publiques ? Quelles procédures sont internes ? Quels documents changent fréquemment ? Quelles sources contiennent des données personnelles ou contractuelles ? Quels articles sont considérés comme la référence par l’équipe support ? Une taxonomie légère peut suffire : produit, pays, audience, statut, date, propriétaire.",
          "La fraîcheur doit être traitée explicitement. Certains systèmes synchronisent automatiquement les sources externes ; d’autres ingèrent les documents à intervalles réguliers. La fréquence technique n’est qu’une partie du problème. Un document synchronisé immédiatement reste faux si personne n’a corrigé la règle. La gouvernance éditoriale du support doit donc être reliée à la boucle IA.",
          "Les droits constituent l’autre dimension critique. Une procédure visible par les conseillers n’est pas forcément destinée aux clients. Une note interne peut contenir des informations que l’agent ne doit jamais exposer. Lorsque la plateforme respecte les permissions de source, il faut vérifier la configuration réelle. Dans une architecture personnalisée, les filtres d’autorisation doivent s’appliquer avant la génération, pas seulement dans le texte du prompt.",
          "Enfin, toutes les informations ne méritent pas d’être injectées. Une meilleure base n’est pas nécessairement une base plus grosse. Des contenus redondants, obsolètes ou trop vagues peuvent dégrader la récupération. Le chantier knowledge management fait donc partie intégrante du projet support IA."
        ]
      },
      {
        id: "citations",
        kicker: "04 — SOURCES & CITATIONS",
        heading: "Une bonne réponse permet de retrouver pourquoi elle a été donnée.",
        paragraphs: [
          "Les citations jouent deux rôles. Pour l’utilisateur, elles offrent un chemin vers la documentation complète. Pour l’équipe, elles rendent l’erreur diagnostiquable. Si l’agent a répondu incorrectement, on peut regarder quelle source a été récupérée. Sans ce lien, l’équipe ne sait pas si le problème vient de la base documentaire, de la recherche ou de la génération.",
          "Il ne faut pas confondre citation et vérité automatique. Un modèle peut citer un passage qui ne répond qu’en partie à la question. La qualité de retrieval doit donc être évaluée séparément. Pour une série de questions de test, l’équipe peut définir quels articles ou procédures devraient apparaître. Si la bonne source n’est jamais retrouvée, retravailler le prompt ne résoudra pas le problème.",
          "Les cas sans réponse sont particulièrement importants. Le test ne doit pas seulement vérifier que l’assistant sait répondre aux FAQ évidentes. Il doit aussi inclure des questions dont la documentation ne contient pas la réponse. Le comportement attendu peut être : expliquer que l’information n’est pas disponible, poser une question de clarification ou escalader. Produire une réponse séduisante à partir de rien est un échec.",
          "Pour les sources publiques, le lien peut être affiché au client. Pour les sources internes, le système peut conserver une référence uniquement pour le conseiller ou le journal d’exécution. La conception doit tenir compte de la confidentialité autant que de l’expérience utilisateur."
        ]
      },
      {
        id: "handoff",
        kicker: "05 — HUMAN HANDOFF",
        heading: "Le meilleur agent support sait exactement quand ne plus être seul.",
        paragraphs: [
          "Le handoff humain ne doit pas être une sortie de secours ajoutée après coup. Il fait partie du scénario dès le début. On définit les conditions qui obligent le transfert : demande explicite du client, contenu sensible, absence de source fiable, répétition d’échecs, forte insatisfaction, exception contractuelle, action financière ou cas qui nécessite un pouvoir de décision humain.",
          "Le transfert doit également préserver le contexte. Rien n’est plus frustrant pour un client que de passer dix minutes avec un agent puis de devoir répéter la même histoire. Le système peut transmettre le résumé de la demande, les informations collectées, les sources consultées, les actions déjà tentées et la raison du handoff. Le conseiller reprend alors avec une vision beaucoup plus complète.",
          "Il faut éviter de laisser le modèle décider seul de la sensibilité. Certaines conditions sont déterministes : mot-clé lié à une résiliation, montant supérieur à un seuil, client identifié comme compte stratégique, catégorie sécurité, ticket déjà rouvert plusieurs fois. D’autres peuvent utiliser une classification IA, mais la règle finale de routage reste contrôlable.",
          "Le retour du conseiller devient une source d’amélioration. Si une catégorie de tickets est constamment transférée parce que la base ne contient pas la bonne procédure, le vrai chantier est documentaire. Si l’agent retrouve le bon article mais produit une synthèse trompeuse, le problème se situe ailleurs. Cette distinction évite d’entraîner l’équipe dans une boucle de réglage aveugle."
        ]
      },
      {
        id: "evaluation",
        kicker: "06 — ÉVALUATION",
        heading: "Tester retrieval, fidélité et escalade séparément.",
        paragraphs: [
          "Une note globale de satisfaction ne suffit pas à piloter un assistant support. Il faut découper la qualité. Première question : la bonne source a-t-elle été retrouvée ? Deuxième : la réponse reflète-t-elle fidèlement cette source ? Troisième : le système a-t-il conservé les limites et exceptions ? Quatrième : a-t-il choisi le bon comportement lorsque la documentation ne suffisait pas ?",
          "Un jeu de test utile mélange cas faciles, formulations inhabituelles, fautes, plusieurs langues si nécessaire, demandes ambiguës, questions hors périmètre et cas volontairement non documentés. Les équipes support connaissent généralement très bien les formulations qui piègent les FAQ classiques. Ces exemples valent plus qu’un benchmark abstrait.",
          "Pour chaque test, on peut enregistrer la source attendue, la réponse minimale acceptable, les erreurs interdites et la décision de handoff attendue. Le système est ensuite évalué sur ces dimensions. Les modèles et outils peuvent changer ; le jeu de test devient la mémoire stable du comportement recherché.",
          "L’évaluation doit continuer après lancement. Les conversations réelles révèlent de nouveaux termes, produits et exceptions. Mais on ne doit pas transformer chaque conversation en vérité. Les corrections sont agrégées puis utilisées pour améliorer la documentation, les règles ou les instructions.",
          "La métrique la plus utile dépend du contexte. Une entreprise peut vouloir réduire les demandes répétitives tout en améliorant le temps de reprise humaine. Une autre cherche surtout à rendre la documentation accessible aux conseillers. L’architecture doit suivre ce résultat métier plutôt qu’un taux générique fourni par un éditeur."
        ]
      },
      {
        id: "mvp",
        kicker: "07 — MVP",
        heading: "Commencer avec cinquante questions et une seule famille de procédures.",
        paragraphs: [
          "Le MVP peut être beaucoup plus petit que le projet imaginé. Choisir une famille de demandes fréquentes et bien documentées : suivi de commande, configuration d’un produit, règles de facturation simples ou procédures internes de niveau 1. Rassembler les sources officielles et écrire cinquante questions représentatives.",
          "La première version peut rester interne. Un conseiller pose la question dans l’assistant, regarde la réponse et les sources, puis indique si le résultat est utile. Cette étape permet de corriger la connaissance et la recherche sans exposer les erreurs aux clients. Lorsque la qualité est suffisante, on ouvre progressivement un périmètre public.",
          "Le handoff est activé dès le premier test public. L’objectif n’est pas d’empêcher l’escalade mais de la rendre propre. Les tickets transférés fournissent ensuite des données précieuses : source manquante, formulation inconnue, cas hors périmètre, règle métier non documentée.",
          "La mise en production doit inclure un propriétaire. Qui surveille les contenus ? Qui peut couper l’agent ? Qui examine les conversations signalées ? Qui valide une nouvelle source ? Sans ces rôles, un prototype peut fonctionner quelques semaines puis se dégrader silencieusement.",
          "Une fois le premier domaine stabilisé, l’entreprise peut étendre la couverture par cluster documentaire, pas par volume de pages. La qualité de la base et la clarté des règles doivent progresser avec le périmètre."
        ]
      },
      {
        id: "vision",
        kicker: "08 — ALLER PLUS LOIN",
        heading: "Le support IA devient une boucle de connaissance, pas seulement un canal de réponse.",
        paragraphs: [
          "Lorsque les conversations, sources et escalades sont tracées, l’équipe peut détecter les trous de documentation. Quelles questions reviennent mais n’ont pas de source claire ? Quels articles sont souvent consultés puis suivis d’une escalade ? Quels produits génèrent des formulations ambiguës ? Ces signaux peuvent alimenter le backlog de contenu support.",
          "L’assistant peut également préparer le travail du conseiller avant même le handoff : résumé du client, historique utile, procédure probable, informations manquantes et prochaines vérifications. Il ne remplace pas l’expertise du support ; il réduit le temps passé à reconstituer le contexte.",
          "Avec davantage de maturité, le système peut déclencher des actions : créer un ticket, demander une pièce, vérifier un statut ou lancer un workflow. Chaque nouvel outil augmente cependant le risque. La Matrice Autonomia d’exécution reste applicable : processus, interprétation, action, contrôle. Une réponse générée n’a pas le même impact qu’un remboursement ou une modification de compte.",
          "Le point final n’est donc pas un agent autonome qui fait tout. C’est une architecture où les connaissances sont mieux maintenues, les demandes simples trouvent une réponse sourcée, les situations complexes arrivent au bon humain avec le bon contexte et chaque erreur produit une information exploitable pour améliorer le système."
        ]
      }
    ]
  }
];

export const marketDemandTrainingArticlesWave3 = [
  {
    type: "training",
    slug: "apprendre-a-concevoir-un-agent-avec-validation-humaine",
    cluster: "Agents IA",
    title: "Formation agent IA avec validation humaine : apprendre à concevoir des agents qui agissent sans perdre le contrôle",
    dek: "Former aux agents IA ne consiste pas à montrer un chatbot qui appelle trois outils. La vraie compétence est de définir mission, permissions, points de validation, cas d’échec, journalisation et procédure de reprise avant d’augmenter l’autonomie.",
    summary: "Les offres de formation visibles en France et les documentations techniques actuelles convergent vers un même besoin : distinguer workflow et agent, connecter des outils avec des permissions limitées, tester des cas d’échec et conserver une supervision humaine sur les actions importantes. Microsoft recommande explicitement une supervision humaine pour les actions critiques de ses agents autonomes et documente des étapes de revue humaine ; n8n expose également des opérations pouvant servir de contrôle humain avant certains tool calls. Le parcours Autonomia proposé ici transforme ces principes en atelier pratique.",
    readingTime: "21–25 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["agents", "workflow_orchestration", "human_in_the_loop", "governance", "n8n", "change_adoption"],
    search: {
      primaryKeyword: "formation agent IA validation humaine",
      secondaryQueries: [
        "formation agents IA entreprise",
        "formation agent IA no code",
        "formation agentique entreprise",
        "formation human in the loop IA",
        "apprendre à superviser un agent IA"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["OBJECTIF", "Concevoir un agent borné, testable et supervisable"],
      ["ATELIER", "Mission → outils → permissions → validation → tests"],
      ["NIVEAU", "Intermédiaire · pratique de base de l’IA générative recommandée"],
      ["ÉVALUATION", "L’apprenant doit justifier où l’agent agit seul et où il s’arrête"]
    ],
    sourceNote: "Microsoft recommande de garder un humain dans la boucle pour les actions critiques des agents autonomes et documente des actions permettant de suspendre un workflow pour obtenir une revue ou une information humaine. Les fonctionnalités d’approbation avancée peuvent être en preview selon le produit et ne doivent pas être traitées comme une garantie de disponibilité en production. n8n documente également des opérations pouvant servir de revue humaine avant certains appels d’outils d’un agent. Le parcours ci-dessous est une architecture pédagogique Autonomia, indépendante d’une plateforme unique.",
    sources: [
      {
        label: "Microsoft Learn — design autonomous agent capabilities",
        url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/autonomous-agents"
      },
      {
        label: "Microsoft Learn — human review for automation with a prompt",
        url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/azure-openai-human-review"
      },
      {
        label: "Microsoft Learn — FAQ for AI approvals",
        url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-ai-approvals"
      },
      {
        label: "n8n Docs — Gmail message operations and human-in-the-loop review",
        url: "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/message-operations/"
      }
    ],
    related: [
      {
        href: "/formation-ia/cas-usage/agents-ia",
        kicker: "PILIER",
        label: "Formation Agents IA"
      },
      {
        href: "/methodologie/learning-transfer",
        kicker: "MÉTHODE",
        label: "Matrice Autonomia de transfert de compétences"
      },
      {
        href: "/consultant-agent-ia",
        kicker: "EXPERTS",
        label: "Besoin d’un expert pour construire l’agent ?"
      }
    ],
    faq: [
      ["Faut-il savoir coder pour suivre une formation agents IA ?", "Pas nécessairement pour comprendre et prototyper un agent simple avec des outils no-code ou low-code. En revanche, les participants doivent savoir décrire un processus, raisonner sur des permissions et comprendre que la mise en production peut nécessiter des compétences techniques supplémentaires."],
      ["Pourquoi enseigner la validation humaine si l’objectif est l’autonomie ?", "Parce que l’autonomie utile n’est pas maximale par défaut. Un agent peut agir seul sur des étapes réversibles et routinières tout en demandant une validation sur une action engageante, sensible ou incertaine."],
      ["Quelle différence entre workflow et agent ?", "Un workflow suit généralement une séquence déterminée et des règles connues. Un agent peut choisir parmi plusieurs outils ou étapes selon le contexte. La formation doit apprendre à ne pas choisir un agent lorsqu’un workflow simple suffit."],
      ["Quelles actions faut-il systématiquement valider ?", "Il n’existe pas de liste universelle. Les actions financières, juridiques, RH, sécurité, communication externe ou modifications irréversibles méritent souvent davantage de contrôle. Le niveau dépend du risque et du contexte."],
      ["Comment évaluer un agent pendant la formation ?", "Avec un jeu de tests qui inclut cas normaux, données manquantes, instructions ambiguës, outils indisponibles, demandes hors périmètre et actions nécessitant une validation. L’évaluation porte autant sur les refus et escalades que sur les réussites."],
      ["Peut-on repartir avec un agent en production ?", "Le parcours peut produire un prototype et une architecture de contrôle, mais une mise en production réelle nécessite de valider sécurité, données, comptes de service, observabilité, coûts, procédures de reprise et responsabilités de l’organisation."]
    ],
    sections: [
      {
        id: "enjeu",
        kicker: "01 — L’ENJEU",
        heading: "Un agent qui sait agir est aussi un système qui peut se tromper en agissant.",
        paragraphs: [
          "Les assistants conversationnels ont habitué les équipes à une erreur relativement contenue : une mauvaise réponse apparaît dans une fenêtre de chat. Un agent change la nature du risque. Dès qu’il peut créer une tâche, envoyer un message, modifier une donnée, appeler une API ou déclencher une action dans un outil métier, l’erreur ne reste plus uniquement textuelle. Elle devient opérationnelle.",
          "C’est précisément pour cette raison qu’une formation agents IA ne doit pas commencer par le spectacle de l’autonomie. Elle doit commencer par la mission et les limites. Que doit accomplir l’agent ? Quelles informations peut-il lire ? Quels outils peut-il appeler ? Quelles actions sont réversibles ? Quelles décisions doivent être confirmées ? Qui peut arrêter le système ?",
          "Microsoft recommande explicitement une supervision humaine pour les actions critiques de ses agents autonomes. Les outils no-code eux-mêmes commencent à exposer des mécanismes de revue humaine pour certains appels d’outils. Cette évolution technique correspond à une compétence organisationnelle : savoir dessiner les points où l’humain reste nécessaire.",
          "Le participant doit donc repartir avec autre chose qu’un prototype amusant. Il doit savoir justifier une architecture d’autonomie. Si l’agent n’a besoin que de lire et résumer, les permissions sont faibles. S’il doit envoyer un e-mail, créer une commande ou modifier un dossier client, la formation doit immédiatement introduire validation, journalisation et procédure de reprise."
        ]
      },
      {
        id: "distinction",
        kicker: "02 — AGENT OU WORKFLOW",
        heading: "La première compétence est de savoir quand ne pas utiliser un agent.",
        paragraphs: [
          "Prenons un processus simple : lorsqu’un formulaire est envoyé, créer une ligne dans un tableur puis envoyer un accusé de réception. Le chemin est connu, les données sont structurées, la décision ne varie pas. Un workflow classique est probablement plus simple, moins coûteux et plus prévisible qu’un agent. Ajouter un LLM ne crée pas automatiquement de valeur.",
          "Un agent devient intéressant lorsque le système doit interpréter une situation puis choisir parmi plusieurs outils ou chemins. Par exemple : analyser une demande client, rechercher une information, décider si une réponse suffit, créer une tâche si une intervention est nécessaire ou demander une précision. Même dans ce cas, une partie du flux peut rester déterministe.",
          "L’atelier pédagogique peut donc donner aux participants dix exemples et leur demander de choisir : règle classique, workflow avec étape IA, ou agent. Ils doivent défendre leur choix. Cette discussion évite un biais fréquent : utiliser la technologie la plus nouvelle plutôt que l’architecture la plus adaptée.",
          "Le critère n’est pas « combien d’étapes ? ». Un workflow peut être long. La question est plutôt : le système doit-il décider dynamiquement de la prochaine action à partir d’un contexte non parfaitement structuré ? Si oui, une architecture agentique peut être pertinente. Sinon, l’orchestration classique reste souvent préférable."
        ]
      },
      {
        id: "mission",
        kicker: "03 — MISSION & PÉRIMÈTRE",
        heading: "Écrire la fiche de poste de l’agent avant ses instructions.",
        paragraphs: [
          "Une bonne mission d’agent ressemble davantage à une fiche de responsabilité qu’à un prompt créatif. Elle précise l’objectif, les entrées, les outils disponibles, les actions autorisées, les actions interdites, le résultat attendu et les situations qui imposent une escalade. Les participants doivent apprendre à écrire cette fiche avant d’ouvrir l’outil de construction.",
          "Exemple : « Préparer les demandes de remboursement de niveau 1 ». L’agent peut lire le ticket, rechercher la politique applicable et proposer une catégorie. Il peut créer un brouillon de réponse. Il ne peut pas effectuer le remboursement ni modifier le statut financier sans validation. Cette séparation rend immédiatement visibles les permissions.",
          "Le niveau d’autonomie peut être gradué. Lecture seule. Préparation de brouillons. Création d’objets réversibles. Actions après approbation. Actions automatiques dans un périmètre étroit. La formation doit montrer que ces niveaux peuvent évoluer avec la confiance, les tests et l’observabilité. Il n’est pas nécessaire de choisir entre « aucun agent » et « agent totalement autonome ».",
          "Le participant formalise également les critères de sortie. À quel moment la mission est-elle terminée ? Quelles données doivent être enregistrées ? Quelle preuve doit rester disponible ? Que doit faire l’agent s’il ne dispose pas d’une information ? Cette dernière question est centrale : demander une clarification ou s’arrêter est souvent un comportement correct."
        ]
      },
      {
        id: "permissions",
        kicker: "04 — OUTILS & PERMISSIONS",
        heading: "Chaque outil ajouté est un nouveau pouvoir — donc un nouveau risque à comprendre.",
        paragraphs: [
          "Un agent sans outil ne peut que produire du texte. Dès qu’on lui connecte Gmail, CRM, Drive, calendrier ou API, il acquiert une capacité d’action. Les participants doivent apprendre à raisonner selon le principe du moindre privilège : donner uniquement les droits nécessaires à la mission. Lire un dossier ne justifie pas forcément le droit de le supprimer. Préparer un message ne justifie pas son envoi automatique.",
          "L’exercice peut utiliser une matrice simple : outil, opération, données lues, données écrites, réversibilité, validation requise. Cette matrice transforme une architecture abstraite en discussion concrète. Elle révèle aussi les dépendances : compte de service, token, propriétaire des credentials, environnement de test et journal des actions.",
          "Les permissions ne sont pas uniquement techniques. Il existe également un périmètre métier. Un agent peut techniquement modifier un CRM mais l’entreprise peut décider qu’il ne touche jamais au montant d’une opportunité. La règle doit être exprimée dans l’architecture et, si possible, dans les droits ou contrôles du système, pas seulement dans une phrase du prompt.",
          "La formation doit enfin aborder la compromission et les entrées malveillantes. Un contenu externe peut tenter d’influencer le comportement de l’agent. Plus l’agent dispose d’outils puissants, plus les entrées doivent être validées et les actions sensibles bornées. Le participant n’a pas besoin de devenir spécialiste cybersécurité pour comprendre ce principe."
        ]
      },
      {
        id: "human-loop",
        kicker: "05 — VALIDATION HUMAINE",
        heading: "Le human-in-the-loop n’est pas un bouton. C’est une décision d’architecture.",
        paragraphs: [
          "Une validation humaine utile intervient avant une action dont la conséquence dépasse le niveau de confiance accepté. Elle peut prendre plusieurs formes : approbation explicite, demande d’information, choix entre deux options, confirmation d’un brouillon ou revue après détection d’une exception. Le mécanisme technique varie selon les plateformes mais le raisonnement reste stable.",
          "L’atelier peut demander aux participants de classer les actions par impact. Créer un brouillon : faible. Ajouter un tag interne : souvent faible. Envoyer une communication client : plus élevé. Supprimer une donnée : élevé. Effectuer un paiement ou prendre une décision RH : très élevé. On définit ensuite où le workflow doit s’arrêter.",
          "Une approbation ne doit pas devenir un clic aveugle. Le réviseur doit recevoir le contexte nécessaire : demande initiale, source consultée, action proposée, justification et éventuellement différence entre état actuel et état futur. Sinon le système déplace simplement la charge mentale vers un bouton « approuver ».",
          "Les participants apprennent aussi à concevoir le temps d’attente. Que se passe-t-il si personne ne répond ? Le workflow expire-t-il ? Relance-t-il ? Change-t-il de responsable ? Annule-t-il l’action ? Un vrai processus human-in-the-loop comprend ces branches, pas seulement le cas nominal.",
          "Enfin, le système doit enregistrer la décision humaine. Cette trace sert à l’audit mais aussi à l’amélioration. Si presque toutes les propositions sont refusées pour la même raison, l’agent ou ses règles doivent être corrigés."
        ]
      },
      {
        id: "atelier",
        kicker: "06 — ATELIER NO-CODE",
        heading: "Construire un agent qui prépare une action mais demande l’autorisation avant de l’exécuter.",
        paragraphs: [
          "Le cas pratique peut partir d’une boîte support. Une demande arrive. L’agent classe le sujet, recherche une procédure et choisit entre plusieurs outils : préparer une réponse, créer une tâche ou demander une information. L’action d’envoi du message est placée derrière une validation humaine. Ce scénario est suffisamment riche pour montrer l’agentique sans donner des droits excessifs.",
          "Dans un outil comme n8n, certaines opérations peuvent être utilisées dans des étapes de revue humaine avant des appels d’outils. Dans l’écosystème Microsoft, des mécanismes de revue ou d’approbation permettent également d’insérer des étapes humaines selon le produit et sa disponibilité. La formation ne doit toutefois pas dépendre d’un bouton spécifique : le participant doit comprendre le pattern afin de pouvoir le reproduire dans une autre stack.",
          "L’exercice commence par une version totalement déterministe. Puis une étape IA est ajoutée pour classer la demande. Ensuite seulement l’agent reçoit plusieurs outils. À chaque ajout, le groupe décrit ce qui peut mal se passer. Cette progression rend visible la différence entre complexité utile et complexité gratuite.",
          "Le participant doit produire un schéma final : déclencheur, contexte, outils, conditions, validation, action et journal. Le prototype est moins important que la capacité à expliquer ces choix. Deux participants peuvent utiliser des plateformes différentes tout en démontrant la même compétence."
        ]
      },
      {
        id: "tests",
        kicker: "07 — TESTS & ÉCHECS",
        heading: "Un agent ne se teste pas uniquement avec les questions auxquelles on espère qu’il réponde bien.",
        paragraphs: [
          "Le jeu de test doit inclure les cas normaux mais aussi les cas hostiles. Information manquante. Outil indisponible. API lente. Action refusée par l’utilisateur. Document contradictoire. Demande hors périmètre. Tentative d’obtenir une action interdite. Instruction contenue dans un document qui essaie de détourner l’agent. Chaque cas force l’équipe à regarder le comportement de reprise.",
          "Les participants définissent le résultat attendu avant de lancer le test. Par exemple : l’agent doit demander une précision, ne doit appeler aucun outil d’écriture et doit créer une trace. On évite ainsi d’évaluer uniquement selon une impression générale. Un résultat peut être linguistiquement élégant tout en étant opérationnellement incorrect.",
          "La formation peut introduire une matrice : réussite de la tâche, respect des permissions, fidélité aux sources, choix du bon outil, capacité à s’arrêter, qualité du handoff et traçabilité. L’agent est évalué sur plusieurs dimensions.",
          "Les échecs servent ensuite à améliorer le système. Certains nécessitent une meilleure instruction. D’autres une règle déterministe. D’autres encore une permission plus stricte ou un nouveau point de validation. Le participant apprend à corriger l’architecture, pas uniquement à ajouter des phrases au prompt.",
          "Cette approche prépare réellement au déploiement. Un agent fiable n’est pas celui qui n’échoue jamais. C’est celui dont les modes d’échec principaux ont été anticipés, détectés et rendus récupérables."
        ]
      },
      {
        id: "evaluation",
        kicker: "08 — ÉVALUATION & TRANSFERT",
        heading: "La compétence finale : savoir augmenter l’autonomie uniquement quand les preuves le justifient.",
        paragraphs: [
          "À la fin de la formation, le participant reçoit un nouveau processus qu’il n’a pas vu pendant l’atelier. Il doit décider s’il faut un agent, choisir les outils, proposer un niveau d’autonomie, identifier les actions sensibles et placer les validations. Cette épreuve mesure le transfert de méthode plutôt que la mémorisation d’une interface.",
          "Le livrable peut contenir une fiche de mission, une matrice de permissions, un schéma du workflow, un jeu de tests, une procédure d’escalade et une définition du propriétaire opérationnel. Ces documents sont utiles au-delà de la formation : ils deviennent le début d’un dossier de conception.",
          "La montée en autonomie doit ensuite être progressive. Un prototype peut fonctionner en lecture seule, puis produire des brouillons, puis créer certaines actions après validation. Une action peut devenir automatique uniquement après des tests et une observation suffisants dans le contexte réel. Cette trajectoire rend la gouvernance compatible avec l’expérimentation.",
          "Les managers ont également un rôle. Ils doivent savoir qui surveille les erreurs, comment les incidents sont remontés et à quel moment un agent doit être désactivé ou réduit. La supervision n’est pas uniquement technique ; elle appartient au fonctionnement de l’équipe.",
          "Le cadeau pédagogique durable est cette règle : chaque pouvoir accordé à un agent doit avoir une raison, un contrôle et une manière de récupérer d’une erreur. Une personne qui sait appliquer cette règle peut changer d’outil sans perdre la compétence acquise."
        ]
      }
    ]
  }
];
