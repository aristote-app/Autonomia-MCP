export const marketDemandExecutionArticles = [
  {
    type: "execution",
    slug: "construire-un-rag-no-code-sur-une-base-documentaire-d-entreprise",
    cluster: "Knowledge management & recherche interne",
    title: "Construire un RAG no-code sur une base documentaire d’entreprise : l’assistant IA qui répond à partir de vos propres sources",
    dek: "Imaginez un assistant interne capable de répondre « où est la procédure ? », « que dit notre politique ? » ou « retrouve-moi la dernière règle validée » en citant les documents réellement utilisés — sans lui donner accès à tout, sans inventer une nouvelle vérité et sans transformer l’entreprise en projet de développement de six mois.",
    summary: "Un RAG — Retrieval-Augmented Generation — ajoute une étape de recherche documentaire avant la génération d’une réponse. Le système récupère les passages pertinents dans une base autorisée, transmet ce contexte au modèle puis produit une réponse ancrée dans les sources. Une première version peut être construite en no-code/low-code avec un stockage documentaire, un moteur de recherche ou vector store, un orchestrateur et un LLM. La difficulté principale n’est pas le chatbot : ce sont la qualité des documents, les droits d’accès, le découpage, la récupération, les citations, l’évaluation et la gestion des contenus obsolètes.",
    readingTime: "20–24 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["rag", "knowledge_management", "vector_search", "llm", "api_integration", "governance", "guardrails", "observability", "human_in_loop"],
    search: {
      primaryKeyword: "RAG entreprise assistant documentaire",
      secondaryQueries: [
        "assistant IA base documentaire entreprise",
        "RAG no-code entreprise",
        "assistant IA documents internes",
        "base de connaissances IA entreprise",
        "RAG SharePoint entreprise"
      ],
      demandEvidence: ["serp_observed", "job_market_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["NIVEAU", "No-code / low-code possible pour un MVP"],
      ["ARCHITECTURE", "Documents → index/recherche → contexte → LLM → citations"],
      ["CAS D’USAGE", "Procédures · politiques · contrats · projets · support interne"],
      ["POINT CRITIQUE", "Permissions et évaluation avant élargissement"]
    ],
    sourceNote: "Le pattern RAG est documenté par Microsoft comme une architecture qui récupère des informations pertinentes dans un magasin de données avant de les transmettre au modèle. Les documentations récentes insistent sur le contrôle d’accès au moment de la récupération, la qualité des citations, l’évaluation et le risque d’injection indirecte depuis les documents. La demande est aussi visible dans des offres d’emploi françaises récentes qui citent explicitement RAG, LLM, grounding, droits d’accès et industrialisation. L’architecture proposée ici est un scénario Autonomia et doit être adaptée à la stack, aux données et aux exigences de l’organisation.",
    sources: [
      {
        label: "Microsoft Learn — RAG et IA générative dans Azure AI Search",
        url: "https://learn.microsoft.com/fr-fr/azure/search/retrieval-augmented-generation-overview"
      },
      {
        label: "Microsoft Learn — contrôle d’accès au niveau du document",
        url: "https://learn.microsoft.com/fr-fr/azure/search/search-document-level-access-overview"
      },
      {
        label: "Microsoft Learn — conception d’un RAG multilocataire sécurisé",
        url: "https://learn.microsoft.com/fr-fr/azure/architecture/ai-ml/guide/secure-multitenant-rag"
      },
      {
        label: "Microsoft Learn — génération augmentée par récupération et indexation",
        url: "https://learn.microsoft.com/fr-fr/azure/foundry/concepts/retrieval-augmented-generation"
      },
      {
        label: "Elastic — RAG avec Elasticsearch",
        url: "https://www.elastic.co/docs/solutions/search/rag"
      }
    ],
    related: [
      {
        href: "/cas-usage-ia/connecter-gmail-a-google-drive-pour-ranger-automatiquement-les-pieces-jointes",
        kicker: "AUTOMATISATION",
        label: "Automatiser Gmail + Google Drive avec l’IA"
      },
      {
        href: "/formation-ia/cas-usage/apprendre-a-automatiser-gmail-et-google-drive-avec-l-ia-sans-coder",
        kicker: "FORMATION",
        label: "Apprendre à construire un workflow IA no-code"
      }
    ],
    faq: [
      ["Quelle différence entre un chatbot classique et un RAG ?", "Un chatbot peut répondre à partir de son contexte général ou de données injectées ponctuellement. Un RAG ajoute une étape explicite de recherche dans une base documentaire afin de fournir au modèle des passages pertinents au moment de la question."],
      ["Faut-il une base vectorielle pour faire du RAG ?", "Pas toujours. La recherche peut être lexicale, sémantique, vectorielle ou hybride. Le bon choix dépend des documents, des volumes, des types de questions et de la qualité observée lors des tests."],
      ["Peut-on construire un RAG sans développeur ?", "Un MVP peut être assemblé avec des connecteurs, des outils d’orchestration et des services de recherche prêts à l’emploi. La difficulté augmente avec les droits fins, les volumes, les formats complexes, la haute disponibilité, les intégrations internes et les exigences de sécurité."],
      ["Le RAG empêche-t-il les hallucinations ?", "Non. Il réduit certains risques en fournissant des sources pertinentes, mais le modèle peut toujours mal interpréter un passage, ignorer une information ou produire une formulation incorrecte. Il faut tester et mesurer la qualité."],
      ["Comment éviter qu’un salarié voie un document auquel il n’a pas accès ?", "Le contrôle doit être appliqué au moment de la récupération, pas seulement dans l’interface. L’identité de l’utilisateur et les permissions documentaires doivent influencer les passages que le système est autorisé à récupérer."],
      ["Peut-on connecter SharePoint, Google Drive ou une GED ?", "Oui selon les connecteurs et l’architecture choisie. L’essentiel est de préserver les métadonnées utiles, les droits, les versions et la traçabilité de la source."]
    ],
    sections: [
      {
        id: "histoire",
        kicker: "01 — LE PROBLÈME",
        heading: "L’information existe déjà. Pourtant l’entreprise la cherche encore.",
        paragraphs: [
          "Dans beaucoup d’organisations, la connaissance n’est pas absente. Elle est dispersée. Une procédure est dans SharePoint, une autre dans un PDF envoyé il y a six mois, une version plus récente est dans Google Drive, un compte rendu contient la décision qui a modifié la règle, et une personne expérimentée sait laquelle de ces sources est encore valable. Lorsqu’un collaborateur pose une question, le problème n’est donc pas de « générer une réponse ». Le problème est de retrouver rapidement la bonne information, dans la bonne version, parmi des documents auxquels tout le monde n’a pas nécessairement les mêmes droits.",
          "Prenons une question très simple : « Quelle est la procédure actuelle lorsqu’un fournisseur envoie une facture sans numéro de commande ? » Un moteur de recherche classique peut renvoyer dix fichiers contenant les mots facture et commande. Un assistant purement génératif peut produire une réponse plausible mais non reliée aux règles de l’entreprise. Un système RAG cherche d’abord les passages susceptibles de répondre à la question dans le corpus autorisé, puis donne ces passages au modèle comme contexte de réponse.",
          "La promesse intéressante n’est pas « discuter avec ses PDF ». C’est de créer un point d’accès à la connaissance qui reste relié aux sources. Le collaborateur obtient une réponse courte, voit les références qui l’ont fondée et peut ouvrir le document correspondant. Si le système ne trouve pas de base suffisante, il doit pouvoir le dire au lieu de remplir le vide avec une réponse élégante.",
          "Cette logique peut servir pour des procédures internes, des guides techniques, des dossiers de chantier, des contrats, des catalogues produits, des politiques RH, des modes opératoires, des comptes rendus de projet ou une documentation support. Le même pattern revient : une question en langage naturel, une recherche ciblée, quelques passages retenus, une réponse synthétique et une trace vers la source."
        ]
      },
      {
        id: "architecture",
        kicker: "02 — L’ARCHITECTURE",
        heading: "Le RAG est une chaîne de récupération avant d’être une interface de chat.",
        paragraphs: [
          "Un RAG peut être résumé en six blocs. D’abord, les sources : dossiers, fichiers, pages internes, bases documentaires ou données métier. Ensuite, l’ingestion : le système lit les documents, extrait le texte utile et conserve les métadonnées importantes comme le titre, la date, la version, le propriétaire, l’URL et les permissions. Troisième bloc : le découpage. Un document de cent pages n’est généralement pas envoyé en entier à chaque question ; il est découpé en passages exploitables.",
          "Quatrième bloc : l’indexation. Les passages sont rendus recherchables. Selon l’architecture, on peut utiliser une recherche plein texte, sémantique, vectorielle ou hybride. La recherche vectorielle repose sur des représentations numériques — embeddings — qui permettent de rapprocher des contenus sémantiquement similaires même si les mêmes mots ne sont pas employés. Ce n’est pas une obligation universelle : sur certains corpus très structurés, une recherche classique ou hybride peut être excellente.",
          "Cinquième bloc : la récupération. Lorsqu’un utilisateur pose une question, le système transforme cette question en requête, récupère les passages les plus pertinents et applique les filtres nécessaires. C’est à ce moment que les permissions doivent intervenir. Si l’utilisateur n’a pas accès au dossier finance, les passages finance ne doivent tout simplement pas être candidats à la réponse. Cacher le lien après coup serait insuffisant : le modèle ne doit pas recevoir le contenu non autorisé.",
          "Sixième bloc : la génération. Le LLM reçoit la question et les passages récupérés, avec des instructions précises : répondre uniquement à partir des éléments fournis, citer les sources, signaler l’incertitude, ne pas suivre des instructions trouvées à l’intérieur des documents. La réponse est ensuite affichée avec les références, éventuellement un score ou un indicateur de qualité, et une possibilité de feedback.",
          "Un orchestrateur no-code ou low-code peut relier ces étapes pour un MVP : déclenchement à l’ajout d’un fichier, extraction, nettoyage, envoi vers un service d’embedding ou d’indexation, stockage des métadonnées, puis workflow de question-réponse. Mais le caractère no-code de l’interface ne supprime pas les choix d’architecture. Il les rend seulement accessibles sans développer toute la tuyauterie."
        ],
        steps: [
          { title: "1. Sélectionner", text: "Choisir un corpus utile, propriétaire et limité." },
          { title: "2. Préparer", text: "Extraire le texte, les métadonnées, versions et droits." },
          { title: "3. Indexer", text: "Rendre les passages recherchables avec la stratégie adaptée." },
          { title: "4. Récupérer", text: "Chercher les passages pertinents en respectant l’identité." },
          { title: "5. Générer", text: "Répondre à partir du contexte réellement récupéré." },
          { title: "6. Évaluer", text: "Mesurer récupération, réponse, citation et refus." }
        ]
      },
      {
        id: "documents",
        kicker: "03 — LA BASE DOCUMENTAIRE",
        heading: "Un mauvais corpus donne un assistant très convaincant… et très peu utile.",
        paragraphs: [
          "Le chantier le plus sous-estimé est la préparation des documents. Une base contient souvent des doublons, des versions périmées, des scans illisibles, des présentations où l’essentiel est dans une image, des noms de fichiers cryptiques et des dossiers qui mélangent archives et documents actifs. Indexer tout sans tri ne crée pas une base de connaissances ; cela crée une base de confusion recherchable.",
          "La première question doit être : quelles sources font autorité ? Pour une procédure, est-ce le PDF final, la page intranet, la note de service ou le dernier compte rendu ? Une entreprise peut décider qu’un document possède un statut — brouillon, validé, archivé — et n’exposer au RAG que les statuts appropriés. Elle peut également conserver la date d’effet et la date de fin pour que le système ne récupère pas une ancienne règle lorsqu’une version plus récente existe.",
          "Les métadonnées sont parfois aussi importantes que le texte. Projet, département, client, type de document, année, propriétaire, niveau de confidentialité, version, langue : ces champs permettent de filtrer la recherche avant même de comparer le contenu sémantique. Une question sur le chantier A ne devrait pas récupérer un passage presque identique du chantier B simplement parce que les mots se ressemblent.",
          "Le découpage mérite également des tests. Des segments trop courts perdent le contexte ; des segments trop longs diluent l’information et augmentent le coût. Les titres, sections, tableaux et annexes peuvent nécessiter des stratégies différentes. Il n’existe pas une taille magique valable pour tous les documents. On teste le système avec de vraies questions et on observe ce qui a été récupéré.",
          "Enfin, il faut organiser la mise à jour. Lorsqu’un document change, le système doit savoir réindexer la nouvelle version et retirer l’ancienne de la recherche active si nécessaire. La qualité d’un RAG n’est pas une photographie prise le jour du lancement ; elle dépend de la discipline documentaire qui suit."
        ]
      },
      {
        id: "retrieval",
        kicker: "04 — LA RECHERCHE",
        heading: "Une bonne réponse commence souvent par un bon passage, pas par un meilleur prompt.",
        paragraphs: [
          "Lorsque le système répond mal, le réflexe naturel est de réécrire le prompt. Pourtant, dans un RAG, la première question de diagnostic devrait être : quels passages ont été récupérés ? Si la bonne information n’est pas dans le contexte, le modèle ne peut pas la deviner de manière fiable. L’évaluation doit donc séparer la qualité de récupération de la qualité de génération.",
          "On peut construire un jeu de questions de référence à partir du travail réel : « quel formulaire utiliser ? », « qui valide ? », « quelle version du contrat s’applique ? », « quelle est la tolérance ? ». Pour chaque question, on identifie à l’avance le document et le passage attendus. Le test mesure si le système les retrouve parmi les premiers résultats. Ce travail peut sembler artisanal, mais il donne un repère beaucoup plus solide que l’impression produite par une démonstration.",
          "La recherche hybride est souvent intéressante car elle combine plusieurs signaux. Un terme très spécifique — référence produit, code projet, acronyme interne — peut être mieux capté par la recherche lexicale. Une formulation conceptuelle peut bénéficier d’une recherche sémantique ou vectorielle. Le reranking peut ensuite reclasser les passages candidats. Le choix doit être guidé par les erreurs observées, pas par la mode technique.",
          "Certaines questions nécessitent aussi une reformulation ou plusieurs recherches. « Que devons-nous faire avant de signer ce type de contrat ? » peut impliquer une politique achats, une procédure juridique et une matrice de délégation. Une architecture agentique peut décomposer la question en sous-requêtes, mais cela augmente la complexité, le coût et les points de défaillance. Pour un premier MVP, une récupération simple et bien évaluée est souvent préférable.",
          "Le système doit enfin savoir ne rien récupérer. Si aucun passage ne dépasse un seuil de pertinence acceptable ou si les résultats sont contradictoires, la réponse utile peut être : « je n’ai pas trouvé de source suffisante ». Le refus contrôlé fait partie de la qualité."
        ]
      },
      {
        id: "droits",
        kicker: "05 — DROITS & SÉCURITÉ",
        heading: "Le RAG ne doit jamais devenir un raccourci autour des permissions.",
        paragraphs: [
          "Une base documentaire d’entreprise contient rarement des informations destinées à tout le monde. RH, finance, juridique, direction, projets clients : les droits font partie de la donnée. Une architecture sérieuse doit donc relier l’identité de l’utilisateur à la récupération. Les moteurs d’entreprise proposent différentes approches : filtres de sécurité, ACL, groupes, rôles ou métadonnées de permissions. Le principe reste identique : le modèle ne reçoit que les passages autorisés.",
          "Cette règle est particulièrement importante lorsque l’index contient une copie ou une représentation du document original. Il ne suffit pas que SharePoint refuse l’ouverture du fichier si le vector store a déjà renvoyé un passage confidentiel au LLM. Les permissions doivent être propagées ou réappliquées au niveau de la recherche.",
          "Les documents eux-mêmes doivent aussi être considérés comme des entrées potentiellement non fiables. Une instruction cachée dans un document — volontairement ou non — peut tenter d’influencer le modèle lorsqu’elle est récupérée. Les architectures modernes parlent d’injection indirecte de prompt. Les protections incluent des instructions système défensives, la séparation entre données et instructions, la validation des contenus récupérés, des garde-fous et du monitoring.",
          "Les journaux sont utiles mais doivent eux-mêmes être gouvernés. Conserver la question, les documents récupérés et la réponse aide à diagnostiquer, mais peut créer un nouveau réservoir de données sensibles. Il faut choisir ce qui est journalisé, pendant combien de temps et qui peut y accéder.",
          "Enfin, la sécurité n’est pas uniquement technique. Il faut expliquer aux utilisateurs ce que l’assistant sait, ce qu’il ne sait pas, quelles sources sont incluses et comment signaler une réponse incorrecte. Un système dont le périmètre est clair crée moins de confiance aveugle."
        ],
        callout: {
          title: "Règle simple",
          text: "Si un utilisateur n’a pas le droit de lire un document dans le système source, le RAG ne doit pas pouvoir utiliser ce document pour lui répondre."
        }
      },
      {
        id: "evaluation",
        kicker: "06 — ÉVALUATION",
        heading: "Un RAG se teste avec des questions métier, pas avec trois démonstrations réussies.",
        paragraphs: [
          "Pour sortir du prototype séduisant, il faut un jeu d’évaluation. Une cinquantaine de questions peut déjà révéler beaucoup : questions simples, formulations différentes, questions multi-documents, questions sans réponse, documents contradictoires, informations périmées et tentatives de contourner les règles. Pour chaque cas, on définit ce qu’une bonne réponse doit contenir et quelles sources devraient être utilisées.",
          "On peut alors mesurer plusieurs couches. Retrieval : le bon passage a-t-il été retrouvé ? Grounding : la réponse s’appuie-t-elle réellement sur les passages ? Citation : les liens pointent-ils vers les sources utilisées ? Fidélité : la réponse ajoute-t-elle des affirmations non présentes ? Refus : sait-elle dire qu’elle ne sait pas ? Permissions : les documents interdits sont-ils absents ?",
          "Le feedback utilisateur complète ces tests. Un bouton utile n’est pas seulement « pouce en haut / pouce en bas ». On peut proposer des raisons : source incorrecte, réponse incomplète, information obsolète, document manquant, problème de droit. Les retours deviennent une file de travail pour améliorer soit les documents, soit la récupération, soit l’instruction de réponse.",
          "L’évaluation doit être rejouée après les changements importants. Nouveau modèle, nouveau découpage, changement d’index, migration de documents : une amélioration sur un type de question peut dégrader un autre. C’est la différence entre un assistant que l’on a réussi à faire fonctionner et un service que l’on sait maintenir."
        ]
      },
      {
        id: "mvp",
        kicker: "07 — MVP NO-CODE",
        heading: "Commencer avec un dossier utile et vingt vraies questions.",
        paragraphs: [
          "Un bon MVP ne branche pas immédiatement tout SharePoint ou tout Google Drive. Choisissez un corpus circonscrit : par exemple les procédures d’un service, la documentation d’un produit, les guides d’un processus ou les documents d’onboarding. Idéalement, les propriétaires des documents savent dire quelles versions sont valides.",
          "Préparez ensuite vingt à cinquante questions que les utilisateurs posent réellement. Certaines doivent être faciles, d’autres ambiguës, d’autres impossibles à répondre avec le corpus. Ces questions servent de contrat de départ. Si le système ne peut pas répondre correctement à ce petit ensemble, connecter cent mille documents ne l’améliorera pas automatiquement.",
          "Une stack no-code peut utiliser un déclencheur qui surveille un dossier, une étape d’extraction de texte, un service d’embeddings ou de recherche, un vector store ou moteur de recherche, puis un workflow de chat qui récupère les passages et appelle le modèle. Une interface simple peut suffire au début. Le produit n’a pas besoin d’être joli pour apprendre si la chaîne de récupération fonctionne.",
          "Le premier objectif peut être volontairement limité : répondre avec trois citations maximum, refuser lorsque les sources sont insuffisantes et afficher les documents utilisés. Pas d’actions autonomes, pas d’écriture dans les systèmes, pas de mémoire longue. Une fois la qualité de recherche et les droits maîtrisés, on peut élargir.",
          "Le MVP doit également prévoir la suppression. Si un document est retiré ou marqué obsolète, comment disparaît-il de l’index ? Si un utilisateur perd un droit, quand la restriction est-elle effective ? Ces questions font partie du produit dès le début."
        ]
      },
      {
        id: "vision",
        kicker: "08 — ALLER PLUS LOIN",
        heading: "Du moteur de réponses à une couche de connaissance exploitable par les agents.",
        paragraphs: [
          "Une fois la récupération fiable, le RAG peut devenir une brique d’autres workflows. Un agent support peut consulter la base avant de préparer une réponse. Un copilote commercial peut retrouver une fiche produit et une clause validée. Un workflow de réunion peut comparer une décision à la politique interne. La base de connaissances devient alors un outil accessible à d’autres systèmes, pas seulement à un chat.",
          "Cette évolution doit rester progressive. Donner à un agent la capacité de lire la base, puis de modifier un CRM ou d’envoyer un e-mail, change le niveau de risque. La qualité du RAG devient une dépendance des actions suivantes. Une information mal récupérée peut alors provoquer une mauvaise action, pas seulement une mauvaise phrase.",
          "On peut également enrichir la base par des métadonnées issues du travail : fréquence des questions, documents rarement trouvés, sujets sans réponse, contenus souvent signalés comme obsolètes. Ces signaux montrent où la documentation elle-même doit être améliorée. Le projet IA devient un révélateur de qualité documentaire.",
          "La vision la plus utile n’est donc pas un chatbot omniscient. C’est une infrastructure de connaissance où les bonnes sources sont identifiées, leurs droits sont respectés, les réponses sont testées et les humains peuvent vérifier. À partir de là, l’IA peut réellement réduire le temps passé à chercher sans transformer l’incertitude en certitude artificielle."
        ]
      }
    ]
  }
];

export const marketDemandTrainingArticles = [
  {
    type: "training",
    slug: "former-une-equipe-a-utiliser-copilot-dans-outlook-pour-gerer-les-e-mails",
    cluster: "Microsoft Copilot",
    title: "Formation Microsoft Copilot en entreprise : apprendre à traiter les e-mails Outlook comme un flux de travail, pas comme une boîte à vider",
    dek: "Copilot dans Outlook devient réellement utile quand les équipes apprennent à résumer un fil, reconstruire le contexte, préparer une réponse, extraire les décisions et transformer un message en prochaine action — tout en sachant ce que Copilot peut voir, ce qu’il faut vérifier et quand il vaut mieux ne pas l’utiliser.",
    summary: "Ce scénario de formation part d’un problème universel : la boîte de réception consomme de l’attention parce que chaque message demande de retrouver le contexte, comprendre la demande et décider de la suite. Microsoft documente des usages Copilot dans Outlook, Teams, Word et Excel, ainsi que des parcours de formation par cas d’usage. Une formation efficace ne doit pas empiler des prompts : elle apprend à choisir le bon contexte, vérifier les sources, passer d’une application à l’autre, construire des routines reproductibles et respecter les règles de l’entreprise.",
    readingTime: "19–23 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["copilot", "power_platform", "change_adoption", "prompt_engineering", "governance", "human_in_loop", "messaging_collaboration", "process_integration"],
    search: {
      primaryKeyword: "formation Microsoft Copilot entreprise",
      secondaryQueries: [
        "formation Copilot Outlook entreprise",
        "formation Microsoft 365 Copilot",
        "formation Copilot Teams Outlook Word Excel",
        "formation Copilot IA entreprise",
        "adoption Microsoft Copilot entreprise"
      ],
      demandEvidence: ["serp_observed", "job_market_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["PUBLIC", "Collaborateurs · managers · fonctions support"],
      ["OUTILS", "Outlook · Teams · Word · Excel · Copilot Chat"],
      ["ANGLE", "E-mail → contexte → décision → prochaine action"],
      ["ÉVALUATION", "Cas réel reconstitué + contrôle qualité"]
    ],
    sourceNote: "Microsoft propose actuellement plusieurs parcours d’apprentissage Microsoft 365 Copilot couvrant Outlook, Teams, Word, Excel, PowerPoint et les cas d’usage métier, ainsi qu’un centre de skilling dédié à l’adoption. Les SERP françaises montrent également une offre active de formations Copilot en entreprise. Des offres d’emploi récentes demandent des compétences Copilot Studio, Power Platform, adoption et industrialisation. Le parcours ci-dessous est un scénario pédagogique Autonomia ; il ne constitue pas une affirmation de certification Qualiopi tant que l’entité porteuse et le périmètre certifié n’ont pas été vérifiés.",
    sources: [
      {
        label: "Microsoft Learn — Rédiger, analyser et présenter avec Microsoft 365 Copilot",
        url: "https://learn.microsoft.com/fr-fr/training/paths/get-started-with-microsoft-365-copilot/"
      },
      {
        label: "Microsoft Adoption — Copilot Skilling Center",
        url: "https://adoption.microsoft.com/fr-fr/copilot/skilling-center/"
      },
      {
        label: "Microsoft Learn — cas d’usage Microsoft 365 Copilot par métier",
        url: "https://learn.microsoft.com/fr-fr/training/paths/empower-workforce-copilot-use-cases/"
      },
      {
        label: "Microsoft Learn — créer des invites efficaces pour Microsoft 365 Copilot",
        url: "https://learn.microsoft.com/fr-fr/training/paths/craft-effective-prompts-copilot-microsoft-365/"
      }
    ],
    related: [
      {
        href: "/formation-ia/cas-usage/apprendre-a-automatiser-gmail-et-google-drive-avec-l-ia-sans-coder",
        kicker: "AUTOMATISATION",
        label: "Apprendre à automatiser un workflow IA no-code"
      },
      {
        href: "/cas-usage-ia/construire-un-rag-no-code-sur-une-base-documentaire-d-entreprise",
        kicker: "KNOWLEDGE",
        label: "Construire un assistant RAG sur les documents internes"
      }
    ],
    faq: [
      ["Cette formation nécessite-t-elle une licence Microsoft 365 Copilot ?", "Pour pratiquer les fonctions Copilot intégrées aux applications, les participants doivent disposer des accès adaptés à leur environnement. Un parcours de sensibilisation peut toutefois travailler sur les concepts et démonstrations avant un déploiement complet."],
      ["Faut-il former application par application ?", "Pas uniquement. Les modules par application sont utiles, mais la valeur augmente lorsque l’on suit un processus transversal : e-mail, réunion, document, analyse et prochaine action."],
      ["Une formation au prompt suffit-elle ?", "Non. Le prompt est une compétence parmi d’autres. Les participants doivent aussi apprendre à choisir le contexte, vérifier le résultat, comprendre les limites d’accès aux données et transformer une réponse en action de travail."],
      ["Peut-on utiliser les vrais e-mails des collaborateurs ?", "Cela dépend des politiques de l’entreprise et du cadre de formation. Une alternative sûre consiste à utiliser des fils reconstitués à partir de situations réelles, sans données sensibles."],
      ["Comment mesurer l’adoption après la formation ?", "On peut suivre des routines réellement utilisées, la qualité des cas d’usage, les obstacles rencontrés, les besoins de support et la capacité des équipes à expliquer quand elles utilisent ou n’utilisent pas Copilot."],
      ["Copilot Studio fait-il partie du même niveau de formation ?", "Pas nécessairement. Microsoft 365 Copilot pour les utilisateurs métier et la construction d’agents ou de workflows dans Copilot Studio peuvent être traités comme deux niveaux différents."]
    ],
    sections: [
      {
        id: "probleme",
        kicker: "01 — LE PROBLÈME",
        heading: "La boîte mail n’est pas seulement pleine : elle force à reconstruire du contexte toute la journée.",
        paragraphs: [
          "Un e-mail ne coûte pas uniquement le temps de lecture. Il coûte le temps de se souvenir du dossier, retrouver ce qui a été promis, comprendre qui doit répondre, ouvrir une pièce jointe, vérifier un chiffre, reformuler une décision et décider de la prochaine étape. Une boîte de réception de quarante messages représente donc quarante micro-reconstructions de contexte, souvent interrompues par d’autres tâches.",
          "Une formation Copilot utile part de cette réalité. Au lieu de montrer vingt fonctions, elle suit quelques fils de travail représentatifs. Un client répond après deux semaines. Un manager reçoit un fil de quinze messages. Une réunion Teams a modifié la décision initiale. Un document Word contient la version validée. L’apprenant doit comprendre ce qui s’est passé et préparer une réponse cohérente.",
          "Copilot peut aider à résumer, rédiger, analyser et rechercher dans l’environnement Microsoft selon les fonctionnalités et droits disponibles. Mais l’utilisateur doit apprendre à formuler son besoin. « Résume-moi cet e-mail » produit souvent une synthèse correcte mais peu actionnable. « Résume les décisions, les points encore ouverts, les engagements pris par notre équipe et les échéances mentionnées » transforme la même capacité en outil de travail.",
          "Le premier objectif pédagogique est donc de faire passer l’équipe de la logique « demander du texte » à la logique « obtenir une sortie utile pour une décision ». Le participant apprend à préciser ce qu’il cherche, ce qu’il veut conserver et ce qu’il doit vérifier."
        ]
      },
      {
        id: "routine",
        kicker: "02 — LA ROUTINE OUTLOOK",
        heading: "Lire moins linéairement : contexte, décisions, risques, action.",
        paragraphs: [
          "On peut enseigner une routine en quatre questions. Premièrement : quel est le contexte ? Copilot aide à résumer le fil, mais le participant apprend à demander les événements et décisions plutôt qu’un simple résumé narratif. Deuxièmement : qu’est-ce qui demande une action de notre part ? La sortie recherchée devient une liste d’actions, avec responsables et dates lorsqu’elles sont explicitement présentes.",
          "Troisièmement : qu’est-ce qui est incertain ? Un bon utilisateur ne demande pas à l’IA de combler automatiquement les trous. Il demande d’identifier les informations manquantes, les contradictions ou les éléments qui nécessitent confirmation. Quatrièmement : quelle réponse préparer ? Le brouillon doit respecter le ton, reprendre les points précis et éviter d’inventer des engagements.",
          "La formation peut comparer plusieurs instructions sur le même fil. Une demande vague, une demande structurée, une demande qui impose de citer les passages clés, puis une demande qui prépare une réponse. Les participants observent que la qualité ne dépend pas d’une formule magique mais de la clarté de l’objectif, du contexte disponible et des critères de sortie.",
          "Cette routine permet aussi d’enseigner la vérification. Le participant revient au message original pour contrôler les dates, montants et engagements. Copilot accélère la reconstruction ; il ne remplace pas la responsabilité de la personne qui envoie la réponse.",
          "On peut ensuite transformer le résultat en action : créer une tâche, préparer un point pour une réunion, ouvrir le document cité ou rédiger une synthèse destinée à un collègue. L’intérêt de Copilot apparaît lorsqu’il aide à passer de l’information à la prochaine étape, pas uniquement lorsqu’il produit une phrase."
        ],
        steps: [
          { title: "1. Reconstituer", text: "Demander le contexte, les décisions et les acteurs." },
          { title: "2. Extraire", text: "Lister actions, échéances et questions ouvertes." },
          { title: "3. Vérifier", text: "Contrôler les faits sensibles dans les sources." },
          { title: "4. Préparer", text: "Créer un brouillon adapté au destinataire." },
          { title: "5. Enchaîner", text: "Transformer la réponse en tâche, document ou réunion." }
        ]
      },
      {
        id: "transversal",
        kicker: "03 — DE OUTLOOK AUX AUTRES APPS",
        heading: "Le vrai saut de valeur apparaît quand le travail traverse Outlook, Teams, Word et Excel.",
        paragraphs: [
          "Un cas d’usage réel ne reste pas dans Outlook. Un message renvoie à une réunion Teams. La réunion renvoie à un document Word. Le document contient un tableau dont une partie doit être analysée dans Excel. Les parcours Microsoft eux-mêmes présentent Copilot dans plusieurs applications, et une formation entreprise gagne à suivre cette logique transversale.",
          "Exemple : après un échange client, le participant demande une synthèse du fil Outlook, retrouve les actions d’une réunion Teams, ouvre la proposition Word et vérifie si les modifications discutées sont bien présentes. Il peut ensuite préparer une note de suivi. L’exercice n’est pas « apprendre quatre boutons » : c’est conduire un travail complet avec plusieurs sources.",
          "Cette approche révèle aussi les limites. Si une source n’est pas accessible, si une réunion n’a pas été transcrite ou si le document pertinent se trouve dans un espace non couvert par les droits de l’utilisateur, Copilot ne peut pas magiquement recréer l’information. Comprendre la frontière des données disponibles fait partie de la compétence.",
          "Pour Excel, l’exercice peut partir d’un tableau propre et contrôlé. Le participant apprend à demander une analyse, identifier une tendance, expliquer une formule ou préparer une visualisation, puis à vérifier les hypothèses. On évite les démonstrations où l’IA travaille sur un fichier incompréhensible simplement pour produire un effet.",
          "Pour Word, le scénario peut consister à transformer un ensemble de notes validées en première structure de document, puis à réviser. Là encore, la formation doit insister sur la différence entre accélérer la première version et déléguer la responsabilité éditoriale."
        ]
      },
      {
        id: "prompts",
        kicker: "04 — PROMPTS",
        heading: "Un bon prompt professionnel décrit surtout le travail attendu.",
        paragraphs: [
          "Microsoft enseigne notamment l’importance de l’objectif, du contexte, des sources et des attentes. Cette structure est plus robuste que des listes de « prompts secrets ». Le participant peut apprendre à formuler : voici ce que je veux obtenir, voici le contexte, voici les éléments sur lesquels t’appuyer, voici la forme attendue et les contraintes.",
          "Dans Outlook, cela peut donner : identifier les décisions et prochaines actions de ce fil, distinguer ce que notre équipe a promis de ce qui est demandé par le client, conserver les dates exactes, puis préparer un brouillon de réponse qui ne crée aucun nouvel engagement. L’instruction décrit une opération professionnelle.",
          "Le formateur peut ensuite montrer ce qui se passe si l’on retire chaque élément. Sans source claire, la réponse peut devenir plus générale. Sans format, la synthèse est difficile à réutiliser. Sans contrainte, le brouillon peut être trop affirmatif. L’apprenant comprend ainsi pourquoi le prompt fonctionne.",
          "La bibliothèque de prompts interne peut alors être organisée par tâches, pas par personnes célèbres ni par effets stylistiques : préparer une réunion, relire un fil, extraire des actions, comparer un document, synthétiser des retours, analyser un tableau. Chaque prompt est accompagné de son contexte d’usage et de ce qu’il faut vérifier.",
          "Une telle bibliothèque doit rester vivante. Si un modèle ou une fonctionnalité change, l’équipe teste et met à jour. Les utilisateurs sont encouragés à améliorer les modèles plutôt qu’à accumuler des centaines de formulations redondantes."
        ]
      },
      {
        id: "controle",
        kicker: "05 — CONTRÔLE & GOUVERNANCE",
        heading: "Former à ce que Copilot peut faire, mais aussi à ce qu’on ne doit pas lui demander.",
        paragraphs: [
          "L’adoption responsable commence par le périmètre. Quels types de données peuvent être utilisés ? Quelles informations ne doivent pas être copiées dans un outil non approuvé ? Quels documents sont considérés comme sensibles ? Quels résultats exigent une vérification avant diffusion ? Ces règles doivent être traduites en situations concrètes pendant la formation.",
          "Un exercice peut présenter trois demandes : résumer une newsletter publique, préparer une réponse à un fournisseur à partir d’un fil interne, et analyser un document contenant des informations RH sensibles. Le groupe doit déterminer ce qui est autorisé dans son environnement et quelles précautions appliquer. Le formateur ne donne pas une règle universelle ; il relie l’usage aux politiques de l’organisation.",
          "La notion de permissions est également centrale. Copilot ne doit pas être présenté comme un moteur omniscient. Les résultats dépendent de ce que l’utilisateur et le service peuvent voir. Une mauvaise hygiène documentaire ou des droits trop larges peuvent devenir visibles lorsqu’un outil de recherche conversationnelle facilite l’accès. Le déploiement Copilot est donc aussi l’occasion de revoir la gouvernance de l’information.",
          "La vérification doit devenir un réflexe différencié. Une reformulation stylistique d’un texte déjà validé ne présente pas le même risque qu’un montant, une clause juridique ou une décision RH. Les participants peuvent apprendre à classer les sorties par niveau de conséquence et à ajuster leur contrôle.",
          "Enfin, on explique la confidentialité des prompts dans le cadre réel de l’organisation et des offres Microsoft souscrites, sans généraliser des garanties qui dépendent des produits et paramètres. Le message clé : utiliser l’outil approuvé dans le périmètre approuvé."
        ],
        callout: {
          title: "Compétence cible",
          text: "Savoir quand accélérer avec Copilot, quand vérifier, quand demander une source et quand garder la tâche entièrement humaine."
        }
      },
      {
        id: "atelier",
        kicker: "06 — ATELIER",
        heading: "Faire travailler les participants sur une journée fictive qui ressemble à la leur.",
        paragraphs: [
          "Plutôt qu’une suite de fonctions, la formation peut simuler une matinée de travail. À 9 h, quinze e-mails attendent. À 9 h 30, une réunion Teams a lieu. À 10 h 30, un document doit être révisé. À 11 h 30, un tableau doit être interprété. Chaque exercice réutilise les informations des précédents.",
          "Le premier groupe reçoit un fil client long et ambigu. Il doit obtenir une synthèse structurée et préparer un brouillon. Le deuxième exercice fournit la transcription d’une réunion avec plusieurs décisions et désaccords. Le participant produit une liste d’actions en distinguant ce qui est décidé de ce qui reste ouvert.",
          "Le troisième exercice reprend ces décisions dans Word : vérifier qu’une note de cadrage reflète bien ce qui a été validé, proposer une structure de mise à jour et signaler les informations absentes. Le quatrième utilise un tableau Excel simplifié pour analyser un indicateur lié au même projet. Cette continuité crée une expérience beaucoup plus proche de la réalité.",
          "Le formateur insère volontairement une information contradictoire. Les participants doivent la repérer au lieu de laisser Copilot harmoniser silencieusement les versions. Cet exercice montre que la qualité vient aussi de la capacité à questionner le contexte.",
          "À la fin, chaque participant choisit une routine de son poste qu’il pourrait améliorer. Il décrit les sources, la sortie souhaitée, le niveau de risque et la vérification nécessaire. Le cas d’usage devient une fiche d’expérimentation."
        ]
      },
      {
        id: "evaluation",
        kicker: "07 — ÉVALUATION",
        heading: "Mesurer la capacité à conduire un travail, pas à réciter des fonctionnalités.",
        paragraphs: [
          "Une évaluation utile remet le participant face à un nouveau cas. Il reçoit un fil Outlook, un document associé et quelques contraintes. Il doit choisir ce qu’il demande à Copilot, expliquer pourquoi, vérifier deux informations sensibles et produire un résultat exploitable. Le correcteur observe la méthode.",
          "Les critères peuvent être simples : le participant identifie le contexte, distingue faits et hypothèses, formule une instruction structurée, utilise une source appropriée, vérifie les éléments critiques, respecte les règles de données et transforme le résultat en action. Cela mesure une compétence transférable.",
          "On peut également évaluer la capacité à refuser un mauvais usage. Si l’exercice propose d’envoyer directement une réponse externe contenant une information non vérifiée, l’apprenant doit savoir interrompre le flux. La prudence appropriée est une compétence, pas un manque de maîtrise.",
          "Quelques semaines plus tard, l’entreprise peut organiser une session courte de retour d’expérience. Quelles routines sont réellement utilisées ? quels prompts ont survécu ? quelles difficultés sont liées à l’outil et lesquelles viennent des processus ou des droits ? Ces données orientent l’accompagnement suivant.",
          "La réussite ne se résume pas au nombre de prompts exécutés. Une équipe peut utiliser Copilot moins souvent mais mieux : sur des tâches clairement identifiées, avec des résultats vérifiés et réutilisables."
        ]
      },
      {
        id: "adoption",
        kicker: "08 — ADOPTION",
        heading: "Transformer quelques utilisateurs curieux en pratiques partagées.",
        paragraphs: [
          "Après la formation, le risque principal est que chacun reparte avec ses propres astuces et que l’entreprise ne capitalise pas. Une approche d’adoption peut créer un petit réseau de champions par métier, une bibliothèque de cas d’usage validés et un canal où les utilisateurs partagent leurs difficultés.",
          "Chaque cas d’usage interne peut tenir sur une fiche : situation de départ, applications concernées, instruction type, sources nécessaires, vérifications, données sensibles, résultat attendu. Les fiches évitent de réduire l’adoption à une liste de prompts. Elles documentent le processus.",
          "Les managers ont un rôle particulier. Ils peuvent demander aux équipes non pas « utilisez-vous Copilot ? » mais « sur quelles tâches l’avez-vous testé et qu’avez-vous appris ? ». Cette formulation encourage l’expérimentation sans créer une obligation d’utiliser l’IA partout.",
          "Au fil du temps, certaines routines resteront individuelles, d’autres pourront devenir des workflows ou des agents plus structurés. Une demande récurrente traitée manuellement avec Copilot peut révéler un candidat pour Power Automate ou Copilot Studio. La formation utilisateur devient alors une source de découverte de projets d’automatisation.",
          "C’est le lien naturel entre Autonomia Academy et Autonomia Experts : la formation révèle les usages réellement utiles ; les besoins qui dépassent l’assistance individuelle peuvent ensuite être cadrés comme systèmes, intégrations ou agents."
        ]
      }
    ]
  }
];
