export const marketDemandExecutionArticlesWave6 = [
  {
    type: "execution",
    slug: "transformer-une-reunion-en-compte-rendu-et-plan-d-action-automatiquement",
    cluster: "Réunions & gestion de projet",
    title: "Automatiser le compte rendu de réunion avec l’IA : décisions, actions et suivi sans transformer le résumé en vérité officielle",
    dek: "Teams, Google Meet et Zoom savent désormais produire des résumés, notes ou éléments d’action. La vraie valeur apparaît lorsque ces sorties alimentent un processus fiable : décisions confirmées, responsables validés, échéances vérifiées et actions envoyées vers le bon outil.",
    summary: "Un workflow de réunion efficace sépare capture, transcription ou notes, extraction structurée, validation humaine et transfert vers le système de suivi. Les plateformes de réunion actuelles proposent déjà des fonctions d’IA pour résumer les discussions, identifier des tâches et générer des notes. L’architecture Autonomia ne consiste pas à publier automatiquement le premier résumé généré : elle traite la réunion comme une source de données dont certaines informations doivent être confirmées avant de devenir des décisions, tâches ou engagements.",
    readingTime: "21–25 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["meetings", "automation", "workflow_orchestration", "project_management", "human_in_loop", "messaging_collaboration"],
    search: {
      primaryKeyword: "automatiser compte rendu réunion IA",
      secondaryQueries: [
        "compte rendu réunion automatique IA",
        "résumé réunion IA entreprise",
        "plan action réunion automatique",
        "IA prise de notes réunion",
        "automatiser actions après réunion"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["SOURCE", "Teams · Google Meet · Zoom · transcript / notes"],
      ["SORTIE", "Décisions · actions · responsables · échéances"],
      ["AUTOMATISATION", "Extraction + routage + brouillons de tâches"],
      ["GARDE-FOU", "Validation humaine avant engagement officiel"]
    ],
    sourceNote: "Microsoft, Google et Zoom documentent aujourd’hui des fonctions de synthèse de réunions, identification d’actions, récapitulatifs et accès aux contenus de réunion. Google Meet peut générer des notes et lister décisions ou tâches, Microsoft Teams/Copilot peut aider à retrouver les points discutés et suggérer des actions, et Zoom expose des résumés, transcripts et action items. Ces fonctions rendent le pattern techniquement crédible, mais l’architecture proposée ci-dessous est une méthode Autonomia indépendante d’un éditeur : elle distingue ce qui peut être préparé automatiquement de ce qui doit être confirmé avant d’être enregistré comme décision ou action officielle.",
    sources: [
      {
        label: "Google Meet — Prendre des notes pour moi",
        url: "https://support.google.com/meet/answer/14754931?hl=fr"
      },
      {
        label: "Google Meet — Demander à Gemini dans Meet",
        url: "https://support.google.com/meet/answer/16024610?hl=fr"
      },
      {
        label: "Microsoft Teams — gérer Copilot dans les réunions et événements",
        url: "https://learn.microsoft.com/fr-fr/microsoftteams/copilot-teams-transcription"
      },
      {
        label: "Zoom — utiliser l’application Zoom pour ChatGPT",
        url: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0083574"
      }
    ],
    faq: [
      ["Peut-on générer automatiquement un compte rendu sans transcription complète ?", "Cela dépend de la plateforme et de la fonction utilisée. Certaines solutions produisent des notes ou récapitulatifs à partir des données de réunion disponibles. Il faut vérifier les réglages, langues prises en charge, politiques de conservation et conditions d’utilisation de chaque environnement."],
      ["Faut-il créer automatiquement les tâches après la réunion ?", "Pas au départ. Il est plus sûr de préparer les tâches, responsables et échéances puis de demander une validation avant écriture dans l’outil projet. L’autonomie peut être augmentée plus tard pour les cas simples et très standardisés."],
      ["Comment éviter qu’une hypothèse devienne une décision ?", "Le workflow doit distinguer explicitement décision confirmée, proposition, question ouverte et action potentielle. Les éléments sensibles ou ambigus doivent être signalés pour revue humaine."],
      ["Peut-on envoyer automatiquement le compte rendu aux participants ?", "Techniquement oui selon l’outil, mais l’envoi automatique ne devrait être activé qu’après vérification du niveau de qualité et des règles de diffusion. Un brouillon validé reste souvent préférable."],
      ["Quelle est la meilleure sortie : document, e-mail ou tâches ?", "Le bon design dépend du système de référence de l’équipe. Un compte rendu lisible est utile, mais les actions doivent rejoindre l’outil où elles seront réellement suivies."]
    ],
    sections: [
      {
        id: "meeting-friction",
        kicker: "01 — LA FRICTION",
        heading: "La réunion n’est pas le problème. La perte d’information entre la discussion et l’action l’est souvent davantage.",
        paragraphs: [
          "Une réunion peut être productive sur le moment et produire très peu d’effet ensuite. Les participants se mettent d’accord, évoquent plusieurs décisions, identifient des tâches et se quittent avec une impression d’alignement. Quelques heures plus tard, chacun se souvient d’une version légèrement différente. Le compte rendu arrive tard, les responsables ne sont pas toujours nommés, les échéances se perdent et certaines décisions restent dans une phrase de discussion plutôt que dans le système de suivi.",
          "Les fonctions d’IA intégrées aux outils de réunion réduisent une partie de cette friction. Google Meet peut générer des notes et des résumés, Microsoft Teams avec Copilot peut aider à retrouver ce qui a été discuté et suggérer des tâches, et Zoom expose des résumés, transcripts et actions. Cela rend la capture beaucoup plus facile. Pourtant, capturer n’est pas encore organiser.",
          "Le risque apparaît lorsque l’on traite un résumé généré comme une source officielle. Une phrase prononcée comme hypothèse peut être reformulée en conclusion. Un responsable évoqué dans la discussion peut être présenté comme propriétaire d’une action. Une date mentionnée à titre indicatif peut devenir échéance. Une automatisation mal conçue transforme alors une commodité en amplification d’erreur.",
          "L’objectif du système n’est donc pas de remplacer le secrétaire de réunion par un modèle. Il est de construire une continuité : récupérer les éléments utiles, les structurer, signaler l’incertitude, valider ce qui engage, puis transférer les éléments confirmés dans les outils où le travail sera réellement suivi.",
          "Cette distinction change complètement l’architecture. Le compte rendu devient une étape intermédiaire d’un workflow et non la finalité. Les données principales sont les décisions, actions, responsables, dates, points ouverts et sources de contexte. Le document final n’est qu’une façon de les présenter."
        ]
      },
      {
        id: "capture",
        kicker: "02 — CAPTURE",
        heading: "Commencer par savoir quelle matière existe réellement : notes, transcript, résumé ou contenu de réunion.",
        paragraphs: [
          "La première brique dépend de l’environnement. Certaines réunions disposent d’une transcription, d’autres uniquement de notes générées ou d’un récapitulatif. Certaines fonctions nécessitent des réglages, licences ou consentements spécifiques. Le workflow doit donc être conçu autour des données réellement disponibles, pas autour d’une démonstration faite dans un autre environnement.",
          "Une bonne pratique consiste à conserver l’identifiant de la réunion, sa date, la liste des participants, la source et les liens vers les actifs autorisés. Cela permet de relier chaque action extraite à un événement précis. Si le résumé est corrigé plus tard, l’équipe peut revenir au contexte d’origine au lieu de dépendre d’un texte copié dans un e-mail.",
          "Le système doit également connaître ses limites linguistiques. Google documente par exemple la disponibilité de certaines fonctions de prise de notes dans plusieurs langues, avec des limites sur les réunions multilingues. Un workflow professionnel ne doit pas supposer que la qualité est constante dans tous les contextes. Il peut détecter la langue ou demander une validation renforcée lorsque le contexte sort du périmètre testé.",
          "La capture doit enfin respecter les règles de l’organisation. Certaines réunions traitent de sujets sensibles, de données personnelles, de ressources humaines ou de décisions confidentielles. Toutes ne doivent pas nécessairement entrer dans le même pipeline automatique. La catégorie de réunion peut déterminer si l’automatisation est autorisée, limitée à un brouillon ou désactivée.",
          "Une architecture claire commence donc par une politique d’entrée : quelles réunions sont concernées, quelles sources sont disponibles, quelles langues sont testées et quels actifs doivent être conservés. Cette politique est plus importante que le choix du modèle de résumé."
        ]
      },
      {
        id: "structure",
        kicker: "03 — STRUCTURER",
        heading: "Transformer un texte de réunion en objets vérifiables : décision, action, responsable, échéance, point ouvert.",
        paragraphs: [
          "Le résumé narratif est utile pour lire rapidement la réunion, mais il est difficile à automatiser. Un workflow a besoin de données structurées. L’étape IA peut donc recevoir la transcription ou le récapitulatif disponible et produire une sortie avec des catégories explicites : décisions proposées, décisions confirmées, actions, responsables mentionnés, dates, risques, questions ouvertes et éléments nécessitant validation.",
          "La différence entre proposé et confirmé est essentielle. Une phrase comme « on pourrait lancer le pilote lundi » n’a pas le même statut que « le pilote commencera lundi ». Le modèle peut tenter de classer les formulations, mais le système doit autoriser le statut incertain. Une bonne architecture préfère une question à valider à une décision inventée.",
          "Même logique pour les responsables. Si une personne dit « je peux regarder » sans engagement formel, l’action ne doit pas forcément lui être attribuée automatiquement. Le workflow peut extraire un responsable probable et marquer le champ comme à confirmer. La validation humaine devient alors très rapide : confirmer, corriger ou laisser non attribué.",
          "Les échéances méritent aussi un traitement explicite. Une date peut être relative — « vendredi », « avant le prochain comité » — ou conditionnelle. L’étape d’interprétation peut normaliser la date lorsque le contexte est clair, mais doit conserver la phrase source. Le validateur humain peut ainsi comprendre comment l’échéance a été déduite.",
          "Cette structure permet ensuite de produire plusieurs sorties cohérentes : un compte rendu, une liste d’actions, un e-mail de suivi et des tâches dans l’outil projet. Les informations ne sont plus extraites séparément pour chaque format ; elles viennent d’un même objet validé."
        ],
        steps: [
          { title: "1. Résumer", text: "Produire une lecture courte de la réunion pour le contexte." },
          { title: "2. Extraire", text: "Séparer décisions, actions, responsables, dates et points ouverts." },
          { title: "3. Marquer l’incertitude", text: "Conserver les éléments ambigus plutôt que les forcer." },
          { title: "4. Valider", text: "Faire confirmer les engagements par la personne responsable." },
          { title: "5. Distribuer", text: "Envoyer les éléments validés vers document, e-mail ou outil projet." }
        ]
      },
      {
        id: "workflow",
        kicker: "04 — LE WORKFLOW",
        heading: "Le meilleur automatisme n’est pas “envoyer le résumé”. C’est “préparer la suite puis demander une validation minimale”.",
        paragraphs: [
          "Un scénario simple peut se déclencher après la disponibilité du récapitulatif ou du transcript. Le système récupère les actifs autorisés, exécute l’extraction structurée puis génère un écran ou message de validation. Le responsable de réunion voit les décisions détectées, les tâches proposées et les dates. Il peut modifier directement les champs sans réécrire l’ensemble du compte rendu.",
          "Après validation, le workflow construit les sorties. Le compte rendu peut être enregistré dans un espace documentaire avec un nom standard. Les tâches peuvent être créées dans Planner, Asana, Jira, Monday ou l’outil choisi. Un e-mail de suivi peut être préparé avec le résumé et les actions, mais rester en brouillon si la réunion contient des éléments sensibles.",
          "L’automatisation peut également alimenter une mémoire projet. Les décisions confirmées peuvent être indexées avec la date, le sujet et le lien vers la réunion. Lorsqu’un participant demande plus tard « pourquoi avons-nous choisi cette option ? », l’assistant peut retrouver la décision et son contexte sans parcourir plusieurs heures de réunion.",
          "Les exceptions doivent être prévues : transcript indisponible, réunion trop courte, langue non prise en charge, aucun responsable détecté, date incohérente ou réunion marquée confidentielle. Le workflow ne doit pas échouer silencieusement. Il crée une tâche de revue ou s’arrête proprement avec une raison visible.",
          "Cette architecture est plus robuste qu’un prompt géant envoyé au modèle. Chaque étape a une fonction claire et peut être testée séparément. On peut améliorer l’extraction sans modifier le stockage, changer l’outil projet sans toucher à la validation ou adapter les règles de diffusion par type de réunion."
        ]
      },
      {
        id: "human-validation",
        kicker: "05 — VALIDATION",
        heading: "Une validation de trente secondes peut protéger des heures de confusion.",
        paragraphs: [
          "Le point humain doit être placé là où il apporte le plus de valeur. Demander à une personne de relire intégralement cinq pages de compte rendu réduit fortement le bénéfice de l’automatisation. En revanche, lui présenter cinq décisions, six actions et trois échéances dans un format structuré rend la validation rapide et ciblée.",
          "L’interface peut mettre en évidence les éléments incertains : responsable non explicite, date relative, décision formulée avec prudence, action sans propriétaire. Le validateur se concentre alors sur les risques plutôt que sur la grammaire. Une fois les champs confirmés, la génération des formats peut être entièrement automatique.",
          "Pour les réunions simples et répétitives, l’organisation peut progressivement augmenter l’autonomie. Un point hebdomadaire projet très standardisé peut autoriser la création automatique de tâches à condition que le responsable ait été explicitement nommé. Une réunion de direction ou RH peut conserver une validation complète. Le niveau d’autonomie dépend du risque, pas du prestige de la technologie.",
          "Le workflow doit aussi enregistrer les corrections. Si les responsables sont souvent mal détectés, le problème peut venir du style de réunion, du transcript ou de l’instruction d’extraction. Si les dates relatives posent problème, la règle peut être améliorée. Les corrections deviennent ainsi une source de qualité.",
          "Cette boucle humaine évite l’un des grands pièges de l’IA au travail : la transformation progressive d’un texte plausible en vérité organisationnelle. Une décision officielle doit être confirmée par le processus prévu par l’entreprise, même lorsque l’outil l’a correctement devinée."
        ]
      },
      {
        id: "mvp",
        kicker: "06 — MVP",
        heading: "Tester sur dix réunions de projet avant de brancher toute l’entreprise.",
        paragraphs: [
          "Un bon pilote choisit un type de réunion fréquent et relativement homogène : comité projet, réunion commerciale interne ou revue d’avancement. L’équipe collecte dix réunions avec le cadre approprié et compare les sorties automatiques à ce que les participants considèrent comme correct.",
          "Le premier test peut rester hors production. L’IA extrait décisions, actions et dates dans un tableau, puis une personne compare avec le compte rendu réel. On mesure la précision de chaque catégorie. Les erreurs sont classées : omission, fausse décision, mauvais responsable, date incorrecte ou action dupliquée.",
          "Le deuxième test ajoute la validation structurée. Le responsable de réunion corrige les champs et indique si l’assistance lui fait gagner du temps ou ajoute de la friction. La question n’est pas seulement la qualité du modèle ; elle concerne l’expérience complète du processus.",
          "Le troisième test peut créer des tâches dans un environnement de test. On vérifie les doublons, droits d’accès, liens vers la source, dates et propriétaires. Une tâche doit toujours pouvoir être reliée à la réunion qui l’a générée et à la validation qui l’a confirmée.",
          "Ce n’est qu’après cette étape que l’on active un usage réel, avec un périmètre contrôlé. Le pilote fournit alors des données tangibles sur la qualité et les erreurs possibles, beaucoup plus utiles qu’une démonstration réussie sur une réunion parfaite."
        ]
      },
      {
        id: "measurement",
        kicker: "07 — MESURE",
        heading: "Mesurer le taux de correction et la clôture des actions, pas seulement le temps gagné.",
        paragraphs: [
          "Le temps de rédaction économisé est intéressant mais difficile à mesurer précisément sans protocole. Des métriques plus robustes existent : proportion d’actions correctement extraites, proportion de responsables corrigés, nombre d’échéances validées, délai entre fin de réunion et diffusion du suivi, ou taux de tâches effectivement clôturées.",
          "Le taux de correction est particulièrement utile. Si 40 % des responsables doivent être modifiés, l’automatisation n’est pas prête pour la création automatique de tâches. Si les résumés sont bons mais les dates faibles, le workflow peut conserver la génération du document et demander une validation renforcée uniquement sur les échéances.",
          "L’équipe peut aussi mesurer la qualité du suivi : les décisions sont-elles plus faciles à retrouver ? les actions perdues diminuent-elles ? les réunions suivantes commencent-elles avec une meilleure visibilité sur ce qui restait ouvert ? Ces indicateurs relient l’outil à la gestion de projet réelle.",
          "Il faut enfin surveiller la dérive. Une mise à jour de plateforme, une modification de transcript ou un changement de langue peut affecter les sorties. Quelques réunions de contrôle périodiques permettent de vérifier que le niveau de qualité reste acceptable.",
          "La réussite du système ne se mesure donc pas au nombre de réunions résumées. Elle se mesure à la réduction des frictions entre discussion, décision et exécution — sans augmenter le risque de faux engagements."
        ]
      },
      {
        id: "limits",
        kicker: "08 — LIMITES",
        heading: "Un résumé parfait n’existe pas, et certaines réunions ne devraient pas entrer dans le pipeline.",
        paragraphs: [
          "La première limite est la qualité de la source. Un transcript imparfait, plusieurs personnes qui parlent en même temps, une langue mal reconnue ou un micro défaillant réduisent la qualité de l’extraction. Le système doit pouvoir signaler que la matière première est insuffisante.",
          "La deuxième limite est sémantique. Les conversations contiennent de l’ironie, des hésitations, des désaccords implicites et des décisions qui se construisent progressivement. Un modèle peut résumer les mots sans comprendre toute la dynamique de responsabilité. Les décisions importantes doivent donc rester confirmées par les humains concernés.",
          "La troisième limite concerne la confidentialité et les règles de réunion. Certaines discussions ne doivent pas être enregistrées, transcrites ou traitées de la même manière. Les politiques de l’organisation et les réglages des plateformes doivent être respectés avant d’intégrer le workflow.",
          "La quatrième limite est l’intégration. Créer automatiquement des tâches dans plusieurs systèmes peut produire des doublons et des vérités concurrentes. Le processus doit définir un outil de référence pour les actions et un autre éventuellement pour les documents.",
          "Enfin, l’automatisation ne résout pas une mauvaise culture de réunion. Si les participants ne prennent jamais de décision, ne nomment jamais de responsable ou repoussent systématiquement les échéances, l’IA ne peut pas créer la discipline à leur place. Elle peut rendre le manque de clarté plus visible — ce qui est déjà utile."
        ]
      }
    ]
  }
];

export const marketDemandTrainingArticlesWave6 = [
  {
    type: "training",
    slug: "apprendre-a-preparer-les-documents-avant-de-construire-un-rag",
    cluster: "Knowledge management",
    title: "Formation RAG en entreprise : apprendre à préparer les documents avant d’indexer une base de connaissances",
    dek: "Un RAG médiocre vient souvent moins du modèle que des documents : PDF illisibles, versions contradictoires, titres absents, droits mal définis, pages trop longues ou sources obsolètes. Former une équipe à préparer le corpus est une compétence à part entière.",
    summary: "Les documentations Azure AI Search et Elastic montrent que la qualité d’un système RAG dépend notamment de l’ingestion, du découpage des documents, de la recherche, de l’évaluation et des contrôles d’accès. Une formation utile ne commence donc pas par le chatbot. Elle apprend aux participants à inventorier les sources, éliminer les doublons, identifier la version de référence, structurer les métadonnées, réfléchir au chunking, conserver les permissions et construire un jeu de questions d’évaluation avant même de brancher un LLM.",
    readingTime: "22–26 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["rag", "knowledge_management", "vector_search", "files_documents", "evaluation", "governance"],
    search: {
      primaryKeyword: "formation RAG entreprise documents",
      secondaryQueries: [
        "préparer documents RAG",
        "formation base de connaissances IA",
        "chunking RAG documents",
        "former équipe RAG entreprise",
        "préparer corpus assistant IA"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["PUBLIC", "Knowledge managers · métiers · IT · documentalistes"],
      ["AVANT LE RAG", "Inventaire · nettoyage · métadonnées · droits"],
      ["COMPÉTENCE", "Préparer un corpus testable et maintenable"],
      ["ÉVALUATION", "Questions de référence · retrieval · groundedness"]
    ],
    sourceNote: "Microsoft documente le chunking des documents pour RAG et recherche vectorielle, le contrôle d’accès au niveau du document et des évaluateurs distincts pour retrieval, groundedness et complétude. Elastic documente également le chunking, la recherche sémantique et le pattern RAG. Ces ressources montrent que la préparation du corpus n’est pas une étape cosmétique : elle détermine ce que le système peut retrouver, citer et autoriser. Le parcours ci-dessous est une architecture pédagogique Autonomia indépendante d’un fournisseur.",
    sources: [
      {
        label: "Microsoft Learn — découper les documents pour RAG et recherche vectorielle",
        url: "https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents"
      },
      {
        label: "Microsoft Learn — évaluateurs RAG",
        url: "https://learn.microsoft.com/fr-fr/azure/foundry/concepts/evaluation-evaluators/rag-evaluators"
      },
      {
        label: "Microsoft Learn — contrôle d’accès au niveau des documents",
        url: "https://learn.microsoft.com/fr-fr/azure/search/search-document-level-access-overview"
      },
      {
        label: "Elastic — RAG avec Elasticsearch",
        url: "https://www.elastic.co/docs/solutions/search/rag"
      },
      {
        label: "Elastic — semantic_text et chunking",
        url: "https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text"
      }
    ],
    faq: [
      ["Faut-il connaître les embeddings pour suivre cette formation ?", "Il est utile de comprendre leur rôle, mais le participant n’a pas besoin de devenir data scientist. L’objectif est surtout de comprendre pourquoi la structure du document, le découpage et les métadonnées influencent la recherche."],
      ["Peut-on construire un bon RAG avec des PDF ?", "Oui, mais tous les PDF ne sont pas équivalents. Il faut vérifier l’extraction du texte, les tableaux, scans, en-têtes, pieds de page et métadonnées. Un mauvais parsing peut dégrader tout le reste du système."],
      ["Pourquoi faut-il garder les droits d’accès ?", "Un assistant interne ne doit pas permettre à un utilisateur de retrouver un document auquel il n’aurait pas accès dans le système source. Les permissions doivent être prises en compte dans l’architecture d’ingestion et de requête."],
      ["Comment savoir si le chunking est bon ?", "Il faut tester sur de vraies questions. Un chunk trop grand peut contenir trop de bruit ; trop petit, il peut perdre le contexte. Le meilleur réglage dépend du document, du moteur de recherche et du type de question."],
      ["Quelle différence entre évaluer le retrieval et la réponse finale ?", "Le retrieval vérifie si les bons passages sont retrouvés. La réponse finale vérifie notamment si le modèle répond correctement et reste ancré dans le contexte. Les deux peuvent échouer séparément."]
    ],
    sections: [
      {
        id: "before-chatbot",
        kicker: "01 — AVANT LE CHATBOT",
        heading: "La qualité d’un RAG commence dans les dossiers partagés, pas dans l’interface de chat.",
        paragraphs: [
          "Lorsqu’une entreprise imagine un assistant documentaire, l’attention se porte souvent sur la partie visible : une fenêtre où un salarié pose une question et reçoit une réponse. Pourtant, le système ne peut répondre qu’à partir de ce qu’il retrouve. Si les documents sont obsolètes, dupliqués, mal nommés ou impossibles à extraire, le meilleur modèle produira une expérience fragile.",
          "La première compétence à transmettre consiste donc à regarder le corpus comme une base de connaissance et non comme un tas de fichiers. Quels dossiers existent ? quelles sources font foi ? plusieurs versions du même document circulent-elles ? les titres permettent-ils de comprendre le contenu ? certaines pages sont-elles scannées ? les documents possèdent-ils une date, un propriétaire et un niveau de confidentialité ?",
          "Une formation RAG qui commence directement par les embeddings saute cette étape. Les participants voient une démo fonctionner sur dix documents propres puis échouent lorsqu’ils appliquent la méthode à leur environnement. Le parcours Autonomia fait l’inverse : il prend un petit corpus volontairement imparfait et demande aux participants de le préparer avant toute indexation.",
          "Cette préparation développe une compétence durable. Même si l’entreprise change plus tard de moteur vectoriel, de LLM ou de plateforme, les questions restent les mêmes : qualité des sources, structure, métadonnées, droits, fraîcheur et critères d’évaluation. La technologie évolue ; la discipline documentaire reste.",
          "Le résultat attendu n’est donc pas simplement « savoir lancer un RAG ». Le participant doit être capable de recevoir un dossier documentaire, d’identifier les risques, de proposer une structure d’ingestion et de construire un jeu de tests avant que l’assistant soit présenté aux utilisateurs."
        ]
      },
      {
        id: "inventory",
        kicker: "02 — INVENTAIRE",
        heading: "Commencer par cartographier les sources et décider lesquelles méritent d’être interrogées.",
        paragraphs: [
          "Le premier atelier consiste à inventorier les sources. On liste les dossiers, types de documents, formats, volumes, propriétaires, fréquence de mise à jour et publics autorisés. Un même sujet peut être présent dans SharePoint, Drive, Notion, PDF ou Wiki. La question n’est pas d’indexer tout ce qui existe mais d’identifier la source de référence.",
          "Les doublons doivent être traités avec soin. Deux fichiers portant presque le même nom peuvent contenir des informations contradictoires. Si les deux entrent dans le RAG, le système peut retrouver l’un ou l’autre selon la requête. La formation apprend à choisir une version canonique ou à conserver une métadonnée de statut permettant d’exclure les documents obsolètes.",
          "Les participants examinent également les documents trop généraux. Un fichier de 200 pages peut être pertinent, mais la recherche doit pouvoir retrouver la bonne section. À l’inverse, vingt fichiers d’une page sans contexte peuvent être difficiles à interpréter. L’organisation documentaire influence donc déjà la stratégie de découpage.",
          "Le corpus est ensuite classé selon l’usage : procédures, politiques, contrats, FAQ, documentation technique, comptes rendus, guides ou archives. Chaque catégorie peut avoir des règles différentes. Une politique approuvée doit probablement être prioritaire sur un ancien compte rendu qui la mentionne.",
          "Enfin, l’équipe définit ce qui reste hors périmètre. Certains documents peuvent contenir des données sensibles, des brouillons ou des informations que l’assistant n’a pas vocation à exposer. Savoir ne pas indexer est une compétence aussi importante que savoir indexer."
        ]
      },
      {
        id: "cleaning",
        kicker: "03 — NETTOYAGE",
        heading: "Un document lisible pour un humain n’est pas forcément exploitable pour un moteur de recherche.",
        paragraphs: [
          "Les PDF posent un exemple classique. Un humain voit une page bien mise en forme ; l’extraction peut mélanger colonnes, répéter les en-têtes ou perdre les tableaux. La formation fait comparer le document original avec le texte réellement extrait. Les participants découvrent rapidement que le problème vient parfois du parsing avant de venir du modèle.",
          "Les éléments répétitifs doivent être gérés : pieds de page, mentions légales, menus, tables des matières et signatures peuvent polluer les chunks. Les supprimer ou les marquer correctement améliore la densité d’information. La stratégie dépend du format et de l’outil d’ingestion.",
          "Les titres et niveaux de section jouent également un rôle. Un passage intitulé « Conditions d’éligibilité » est beaucoup plus utile s’il conserve son contexte que s’il devient un bloc de phrases isolées. Les métadonnées de section peuvent aider le moteur à filtrer, afficher une citation ou reconstruire la source.",
          "La formation aborde aussi les images et scans. Si le document ne contient pas de texte exploitable, une étape OCR ou multimodale peut être nécessaire. Mais cette conversion doit être testée : une valeur chiffrée mal reconnue peut être plus dangereuse qu’un document absent.",
          "À la fin de cette étape, chaque document doit avoir un statut : prêt, à transformer, à exclure ou à revoir. Cette grille simple permet d’éviter que l’équipe technique découvre les problèmes pendant l’indexation."
        ]
      },
      {
        id: "metadata",
        kicker: "04 — MÉTADONNÉES",
        heading: "Titre, date, propriétaire, type, statut et droits : six champs peuvent changer radicalement la qualité du système.",
        paragraphs: [
          "Les métadonnées servent à plusieurs fonctions. Elles permettent de filtrer les résultats, afficher une citation compréhensible, privilégier une source récente, respecter les droits ou simplement expliquer d’où vient la réponse. Sans métadonnées, le moteur ne voit souvent qu’un ensemble de passages.",
          "Le participant apprend à définir un schéma minimal : identifiant documentaire, titre, source, type, date de publication ou de validation, propriétaire, statut et chemin d’origine. D’autres champs peuvent être ajoutés selon le métier : produit, pays, version, client, projet ou catégorie juridique.",
          "Les métadonnées ne doivent pas devenir une base parallèle impossible à maintenir. Lorsque l’information existe déjà dans le système source, l’idéal est de la récupérer automatiquement. Une propriété SharePoint, un dossier Drive ou un champ CMS peut être plus fiable qu’une saisie manuelle répétée.",
          "Le statut de validité est particulièrement important. Un document peut être publié, brouillon, remplacé, expiré ou archivé. Le RAG devrait pouvoir exclure les versions qui ne doivent plus être utilisées. Sinon, l’assistant risque de citer une procédure que l’organisation a officiellement remplacée.",
          "Enfin, les métadonnées facilitent l’évaluation. Si une question porte sur la politique RH France 2026, on peut vérifier non seulement si le passage est pertinent, mais aussi s’il provient du bon pays, de la bonne version et du bon type de source."
        ]
      },
      {
        id: "chunking",
        kicker: "05 — CHUNKING",
        heading: "Découper suffisamment pour retrouver, mais pas au point de perdre le sens.",
        paragraphs: [
          "Microsoft et Elastic documentent le chunking comme une étape importante pour la recherche sémantique et le RAG. Les modèles d’embedding ont des limites d’entrée et un document entier représente souvent mal plusieurs sujets différents. Le découpage crée des passages plus ciblés qui peuvent être retrouvés indépendamment.",
          "Il n’existe cependant pas de taille universelle. Un contrat, une FAQ et une procédure technique n’ont pas la même structure. Un chunk trop grand mélange plusieurs concepts et peut diluer la pertinence. Un chunk trop petit peut perdre la définition, le titre ou les conditions qui donnent son sens au passage.",
          "L’atelier demande aux participants de comparer plusieurs stratégies sur le même document : découpage par taille, par paragraphes ou par sections logiques. Ils posent ensuite une série de questions et observent quels passages remontent. Cette expérimentation rend le concept beaucoup plus concret qu’une règle fixe de nombre de caractères.",
          "L’overlap peut préserver du contexte entre deux chunks, mais il crée aussi des répétitions dans l’index. Elastic documente par exemple des stratégies avec chevauchement. La formation explique pourquoi cette technique existe sans en faire une recette universelle.",
          "Le participant apprend surtout à relier le chunking au test. La bonne stratégie est celle qui retrouve les informations nécessaires avec suffisamment de contexte pour produire une réponse fidèle. Le réglage doit être évalué sur les vraies questions de l’entreprise."
        ]
      },
      {
        id: "permissions",
        kicker: "06 — DROITS D’ACCÈS",
        heading: "Un RAG interne ne doit jamais devenir un raccourci autour des permissions documentaires.",
        paragraphs: [
          "Un assistant peut techniquement retrouver une information très rapidement. C’est précisément pour cela que les droits sont critiques. Si l’index contient des documents RH, financiers et commerciaux mais que la requête ignore l’identité de l’utilisateur, le système peut exposer une information qu’il n’aurait jamais vue dans le dossier source.",
          "Microsoft documente plusieurs approches de contrôle d’accès au niveau du document dans Azure AI Search, notamment des filtres de sécurité et des mécanismes liés aux ACL ou identités selon les sources. Le détail technique dépend de la stack, mais le principe pédagogique est simple : les permissions font partie du document au moment de l’ingestion et doivent être appliquées au moment de la recherche.",
          "La formation fait donc ajouter une colonne « qui peut voir ? » dans l’inventaire. Les participants distinguent contenu public interne, contenu limité à une équipe et documents très sensibles. Ils comprennent qu’une base de connaissances n’est pas un simple export de dossiers vers un vector store.",
          "Les droits doivent également évoluer. Lorsqu’un collaborateur change d’équipe ou qu’un document passe de brouillon à validé, le système doit refléter cette modification. La synchronisation et la suppression sont donc aussi importantes que la première ingestion.",
          "Cette approche transforme la sécurité en compétence de conception. Le participant n’a pas besoin de maîtriser chaque API, mais il doit savoir qu’une architecture RAG qui ne traite pas explicitement les permissions est incomplète."
        ]
      },
      {
        id: "evaluation",
        kicker: "07 — ÉVALUATION",
        heading: "Construire les questions de test avant le chatbot permet de savoir si le retrieval fonctionne réellement.",
        paragraphs: [
          "Une erreur fréquente consiste à tester le RAG uniquement en posant quelques questions et en jugeant si la réponse paraît bonne. La formation apprend à séparer le retrieval et la génération. Le premier objectif est de vérifier si les bons documents ou passages remontent ; le second est de vérifier si le modèle utilise correctement ce contexte.",
          "Microsoft Foundry documente des évaluateurs distincts pour la récupération de documents, la pertinence du contexte, la groundedness et la complétude. Même sans utiliser exactement ces outils, la distinction est utile. Une réponse peut être mauvaise parce que le bon passage n’a jamais été retrouvé, ou parce que le modèle l’a mal interprété.",
          "Les participants construisent donc un petit jeu de questions de référence avant l’indexation. Pour chaque question, ils indiquent quel document ou passage devrait être retrouvé et ce que la réponse doit contenir. Ils ajoutent aussi des questions sans réponse afin de vérifier que le système sait reconnaître l’absence d’information.",
          "Ce jeu de test sert ensuite à comparer les changements de chunking, métadonnées ou moteur de recherche. Une modification qui améliore deux questions mais en dégrade dix devient visible. L’équipe sort du réglage intuitif pour entrer dans une démarche mesurable.",
          "Enfin, les questions de test doivent évoluer avec les usages. Les recherches réelles des utilisateurs peuvent révéler des formulations inattendues ou des documents manquants. La base d’évaluation devient une ressource vivante du système."
        ]
      },
      {
        id: "workshop",
        kicker: "08 — ATELIER",
        heading: "Le meilleur exercice : partir d’un dossier imparfait et livrer un corpus prêt à indexer.",
        paragraphs: [
          "L’atelier peut fournir vingt documents : deux doublons, une version obsolète, un PDF scanné, une procédure avec plusieurs sections, un document confidentiel, un fichier sans titre clair et une FAQ propre. Les participants travaillent en petits groupes et doivent produire un inventaire avant toute manipulation technique.",
          "Ils définissent ensuite les métadonnées, les exclusions et les transformations nécessaires. Ils choisissent une stratégie de découpage pour trois types de documents différents et justifient leur décision. L’objectif n’est pas de trouver une réponse unique mais de rendre le raisonnement explicite.",
          "Le groupe prépare enfin dix questions de test, dont deux questions sans réponse et deux questions nécessitant un filtre de droits. Ce jeu devient le contrat de qualité du futur RAG. Même si le temps de formation ne permet pas de construire tout le système, le corpus est prêt pour l’étape technique.",
          "Une évaluation pratique peut donner un nouveau document et demander au participant de décider en quinze minutes : doit-il entrer dans la base, avec quelles métadonnées, quel niveau d’accès, quel découpage et quelles questions de test. Cette situation mesure une vraie compétence transférable.",
          "Le participant repart ainsi avec une méthode : inventorier, nettoyer, structurer, sécuriser, découper et évaluer. Cette méthode reste valable quelle que soit la plateforme choisie ensuite."
        ]
      },
      {
        id: "limits",
        kicker: "09 — LIMITES",
        heading: "Préparer les documents ne résout pas tout, mais cela élimine une grande partie des erreurs évitables.",
        paragraphs: [
          "Un corpus propre ne garantit pas un bon RAG. Le moteur de recherche, les embeddings, le reranking, les instructions du modèle, les seuils et l’interface jouent aussi un rôle. La formation doit donc présenter la préparation comme une condition nécessaire mais non suffisante.",
          "Certaines informations sont aussi trop dynamiques pour un pipeline documentaire classique. Des données temps réel peuvent nécessiter une requête API ou une source structurée plutôt qu’une indexation périodique de PDF. Le participant apprend à reconnaître quand le document n’est pas la bonne représentation.",
          "Les documents contradictoires posent un autre défi. Si deux politiques sont toutes deux officiellement valides dans des contextes différents, il ne suffit pas d’en supprimer une. Il faut des métadonnées ou règles permettant de choisir selon le pays, le produit ou la population.",
          "Enfin, la maintenance est permanente. Un RAG qui fonctionne le jour du lancement peut se dégrader si les sources changent, si les nouveaux documents n’ont pas les bonnes métadonnées ou si les droits ne sont plus synchronisés. La gouvernance du corpus doit être attribuée à une équipe ou un propriétaire.",
          "La formation se termine donc par une question simple : qui sera responsable de la qualité documentaire après le projet ? Sans réponse, l’assistant risque de devenir progressivement moins fiable même si l’architecture technique reste intacte."
        ]
      }
    ]
  }
];
