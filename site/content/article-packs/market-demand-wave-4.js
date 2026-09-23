export const marketDemandExecutionArticlesWave4 = [
  {
    type: "execution",
    slug: "extraire-automatiquement-les-donnees-cles-des-factures-recues-par-e-mail",
    cluster: "Finance & comptabilité",
    title: "Automatiser les factures reçues par e-mail : extraction IA, contrôles et workflow de validation",
    dek: "Une facture peut être reçue, classée, lue, structurée et préparée pour validation sans ressaisie intégrale. Le vrai enjeu n’est pourtant pas l’OCR : c’est de concevoir les contrôles, les exceptions, le rapprochement et la preuve avant toute écriture ou paiement.",
    summary: "Des services actuels comme Azure Document Intelligence, AI Builder et Google Document AI disposent de modèles capables d’extraire des champs de factures sous forme structurée. Cela permet de construire un workflow où l’e-mail déclenche le traitement, la pièce jointe est archivée, les données sont extraites, des contrôles déterministes vérifient les montants et les doublons, puis une personne valide les cas nécessaires avant transmission vers l’ERP ou l’outil comptable. Le scénario Autonomia sépare volontairement extraction, contrôle, décision et écriture afin de ne jamais confondre reconnaissance documentaire et validation comptable.",
    readingTime: "22–26 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["automation", "document_processing", "finance", "api_integration", "power_platform", "human_in_the_loop"],
    search: {
      primaryKeyword: "automatiser traitement factures IA",
      secondaryQueries: [
        "extraction facture IA",
        "automatiser facture fournisseur IA",
        "OCR facture intelligence artificielle",
        "automatisation comptabilité fournisseur IA",
        "extraire données facture automatiquement"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["ENTRÉE", "E-mail · portail fournisseur · dossier documentaire"],
      ["EXTRACTION", "Fournisseur · numéro · dates · montants · taxes · lignes"],
      ["CONTRÔLES", "Doublon · cohérence arithmétique · commande · fournisseur"],
      ["DÉCISION", "Validation humaine avant écriture ou paiement selon le risque"]
    ],
    sourceNote: "Microsoft Document Intelligence v4.0 documente un modèle prédéfini de facture capable d’extraire des champs clés et des lignes, et Microsoft AI Builder documente son utilisation dans Power Automate. Google Cloud documente également un Invoice Parser prédéfini. Microsoft publie par ailleurs une architecture de référence pour automatiser le traitement des factures fournisseurs avec Power Automate et AI Builder. Le workflow décrit ci-dessous est un scénario Autonomia : il doit être adapté au système comptable, aux règles de validation, aux obligations fiscales et à la qualité des documents de l’organisation.",
    sources: [
      {
        label: "Microsoft Learn — Document Intelligence v4.0, modèle facture",
        url: "https://learn.microsoft.com/fr-fr/azure/ai-services/document-intelligence/prebuilt/invoice?view=doc-intel-4.0.0"
      },
      {
        label: "Microsoft Learn — traitement des factures dans Power Automate avec AI Builder",
        url: "https://learn.microsoft.com/fr-fr/ai-builder/flow-invoice-processing"
      },
      {
        label: "Microsoft Learn — architecture de référence factures fournisseurs",
        url: "https://learn.microsoft.com/fr-fr/power-platform/architecture/reference-architectures/vendor-invoice-integration"
      },
      {
        label: "Google Cloud — Document AI Invoice Parser",
        url: "https://docs.cloud.google.com/document-ai/docs/processors-list"
      }
    ],
    related: [
      {
        href: "/cas-usage-ia/finance-comptabilite",
        kicker: "PILIER",
        label: "Automatiser la finance avec l’IA"
      },
      {
        href: "/methodologie/execution-matrix",
        kicker: "MÉTHODE",
        label: "Matrice Autonomia d’exécution IA"
      },
      {
        href: "/expert-ia",
        kicker: "EXPERTS",
        label: "Cadrer l’expertise nécessaire pour ce workflow"
      }
    ],
    faq: [
      ["L’IA peut-elle lire une facture PDF ou une photo ?", "Oui, plusieurs services de document intelligence prennent en charge les PDF et différents formats d’image. La qualité d’extraction dépend néanmoins de la qualité du document, du modèle utilisé et des champs attendus."],
      ["Peut-on envoyer directement les données extraites dans la comptabilité ?", "Techniquement c’est possible dans certaines architectures, mais extraction et validation ne doivent pas être confondues. Il est prudent de prévoir des contrôles de cohérence, de doublon, de fournisseur, de commande et des seuils de validation avant une écriture engageante."],
      ["Faut-il un LLM génératif pour extraire une facture ?", "Non. Des modèles documentaires spécialisés savent déjà extraire des champs structurés. Un LLM peut compléter certains cas ambigus ou produire une explication, mais il n’est pas nécessaire à chaque étape."],
      ["Comment traiter les factures mal reconnues ?", "Le workflow doit prévoir une branche d’exception : document illisible, fournisseur inconnu, champ obligatoire manquant, montant incohérent ou confiance insuffisante. Le document est alors routé vers une file de revue humaine."],
      ["Peut-on détecter les doublons ?", "Oui, avec des règles déterministes combinant par exemple fournisseur, numéro de facture, date, montant et éventuellement empreinte du fichier. La règle doit être définie avec l’équipe finance car les avoirs, duplicatas et formats fournisseurs peuvent créer des exceptions."],
      ["Comment intégrer la facture à un ERP ?", "Selon l’ERP, le workflow peut utiliser un connecteur, une API, un fichier d’import ou une table intermédiaire. L’intégration doit respecter les contrôles, comptes de service, droits d’écriture et procédures de reprise propres au système."],
      ["La réforme de la facturation électronique rend-elle ce workflow inutile ?", "Non nécessairement. Les entreprises continuent à gérer plusieurs canaux, formats, pièces annexes et exceptions. En revanche, l’architecture doit évoluer avec les flux structurés disponibles et ne pas conserver une couche OCR lorsqu’une donnée structurée fiable existe déjà."],
      ["Quel premier MVP ?", "Commencer par une boîte dédiée et un seul type de facture, extraire cinq à dix champs, ne rien écrire automatiquement dans l’ERP et mesurer les erreurs sur un échantillon réel avant d’élargir."]
    ],
    sections: [
      {
        id: "situation",
        kicker: "01 — LE PROCESSUS",
        heading: "Une facture arrive par e-mail. Le travail manuel commence bien avant la saisie comptable.",
        paragraphs: [
          "Prenons un processus courant. Une facture fournisseur arrive dans une boîte générique. Quelqu’un ouvre le message, télécharge le PDF, vérifie le fournisseur, cherche le dossier correspondant, renomme le document, lit le numéro de facture, la date, le montant hors taxes, la TVA et le total. Puis il compare éventuellement la facture au bon de commande, saisit les informations dans un outil, transmet au valideur et archive la pièce. Aucune de ces étapes n’est spectaculaire. Ensemble, elles créent pourtant une chaîne de ressaisies, de recherches et de contrôles qui se répète des centaines de fois.",
          "Automatiser ce flux ne signifie pas demander à un modèle de décider qu’une facture doit être payée. La première opportunité est beaucoup plus simple : transformer un document entrant en données structurées et en dossier prêt à être vérifié. Les modèles documentaires actuels savent extraire des champs courants de facture et, pour certains, les lignes de détail. Cette extraction devient alors une brique du workflow.",
          "Le système doit néanmoins conserver une frontière claire. Lire « 4 280,00 € » dans un PDF n’est pas la même chose que confirmer que 4 280 euros sont dus. La première opération relève de l’extraction. La seconde dépend de règles métier : commande associée, réception effectuée, fournisseur reconnu, délégation de signature, période comptable, statut fiscal, absence de doublon. Une architecture saine automatise la préparation sans masquer la décision.",
          "Cette distinction est importante pour l’expérience utilisateur. Si le workflow se contente de recopier automatiquement une erreur vers l’ERP, il accélère l’erreur au lieu d’améliorer le processus. Autonomia structure donc le scénario en quatre couches : document, extraction, contrôles, validation. L’écriture finale n’arrive qu’après ces couches."
        ]
      },
      {
        id: "capture",
        kicker: "02 — CAPTURE & ARCHIVAGE",
        heading: "Commencer par sécuriser le document original et son contexte.",
        paragraphs: [
          "Le déclencheur peut être un nouvel e-mail adressé à factures@entreprise.fr, un dépôt sur un portail fournisseur ou l’arrivée d’un fichier dans un dossier surveillé. La boîte e-mail est souvent un bon MVP parce qu’elle correspond au fonctionnement existant. Le workflow récupère le message, la pièce jointe et quelques métadonnées : expéditeur, date de réception, objet, identifiant du message et nom du fichier.",
          "Avant toute extraction, le système doit conserver l’original. Le PDF reçu est archivé dans un emplacement contrôlé avec un identifiant stable. Cela permet de revenir à la preuve source si les données structurées sont corrigées plus tard. Le fichier peut également recevoir une empreinte afin d’aider à détecter un envoi identique répété.",
          "Le filtrage intervient dès cette étape. Un e-mail peut contenir plusieurs pièces jointes ou un document qui n’est pas une facture. Le workflow peut appliquer des règles simples sur le type de fichier et, si nécessaire, une classification documentaire. L’objectif n’est pas d’envoyer aveuglément chaque pièce à un modèle coûteux. Plus le périmètre est explicite, plus le système est facile à diagnostiquer.",
          "La gestion des erreurs de capture fait également partie du processus. Pièce jointe protégée, fichier corrompu, format non supporté ou document trop volumineux : ces cas doivent produire un statut visible et non disparaître dans une exécution échouée. Une file « document à vérifier » est souvent plus utile qu’une tentative de correction automatique."
        ]
      },
      {
        id: "extraction",
        kicker: "03 — EXTRACTION",
        heading: "OCR, modèle spécialisé ou LLM : choisir la brique la plus déterministe possible.",
        paragraphs: [
          "Une facture est un document semi-structuré. Les mêmes concepts existent presque toujours — fournisseur, numéro, date, montants — mais leur position change. C’est précisément le cas d’usage des modèles documentaires spécialisés. Microsoft et Google documentent des modèles prédéfinis capables d’extraire des champs de facture. Les sorties sont structurées et peuvent ensuite être utilisées par un workflow.",
          "Le modèle n’a pas besoin de comprendre tout le processus comptable. Sa mission est étroite : transformer le document en champs. Le workflow peut demander une liste de valeurs obligatoires : fournisseur, numéro de facture, date de facture, échéance, devise, montant HT, taxe, montant total, références de commande et lignes lorsque cela est nécessaire. Tous les champs ne sont pas utiles à toutes les entreprises ; le schéma doit correspondre au système cible.",
          "Un LLM génératif peut intervenir en complément dans les cas où un commentaire ou une référence métier est difficile à interpréter. Mais il est inutile d’utiliser un modèle conversationnel pour refaire ce qu’un parseur de facture spécialisé sait déjà produire. La matrice Autonomia recommande de garder les briques les plus déterministes possibles et de réserver l’IA générative aux parties réellement ambiguës.",
          "La sortie d’extraction doit rester liée au document source. Chaque champ peut conserver la valeur détectée et, lorsque la plateforme le fournit, les informations de localisation ou de confiance. Le système n’a pas besoin de transformer cette confiance en vérité. Il l’utilise comme un signal pour décider si une revue est nécessaire.",
          "Les formats réels doivent être testés. Un exemple de démonstration parfaitement scanné ne dit rien sur une facture photographiée, un PDF avec plusieurs pages, un fournisseur étranger ou une mise en page atypique. Le jeu de test doit représenter les documents réellement reçus."
        ]
      },
      {
        id: "controls",
        kicker: "04 — CONTRÔLES",
        heading: "Après l’extraction, revenir aux règles comptables et métier.",
        paragraphs: [
          "La valeur du workflow apparaît lorsque les données extraites déclenchent des contrôles simples et explicables. Premier exemple : vérifier que le fournisseur existe dans la base. Deuxième : rechercher le numéro de facture pour détecter un doublon. Troisième : contrôler la cohérence des montants. Quatrième : retrouver le bon de commande ou le contrat lorsque le processus l’exige.",
          "Ces contrôles ne doivent pas être délégués au langage naturel si une règle classique suffit. Une égalité arithmétique, une recherche d’identifiant ou un seuil de délégation sont des règles déterministes. Elles sont plus faciles à tester, à expliquer et à auditer qu’une instruction demandant à un modèle de « vérifier si tout semble cohérent ».",
          "Le rapprochement peut avoir plusieurs niveaux. Une facture associée à une commande peut être comparée au montant attendu, au fournisseur et aux lignes reçues. Une facture sans commande peut suivre un circuit différent. Les tolérances doivent être définies avec la finance : différence d’arrondi acceptable, facture partielle, frais supplémentaires, avoir ou devise différente.",
          "Il faut également distinguer anomalie et fraude. Un doublon probable ou un changement d’IBAN peut constituer un signal nécessitant une vérification, mais un workflow ne devrait pas accuser automatiquement un fournisseur. Le rôle du système est de signaler un écart documenté et de diriger la pièce vers la bonne personne.",
          "Chaque contrôle produit un état : validé, à revoir, bloqué ou non applicable. Cette structure rend le dossier beaucoup plus lisible pour le valideur et évite de lui présenter une longue explication générée lorsqu’une simple liste de contrôles suffit."
        ]
      },
      {
        id: "human",
        kicker: "05 — VALIDATION HUMAINE",
        heading: "Faire gagner du temps au valideur sans lui demander de cliquer aveuglément.",
        paragraphs: [
          "Une validation utile présente les informations nécessaires à la décision : fournisseur, numéro, date, montant, commande associée, contrôles passés, anomalies et lien vers la facture originale. Le valideur voit immédiatement ce qui a été automatisé et ce qui demande son jugement. Il peut approuver, corriger ou rejeter.",
          "Le workflow peut adapter le circuit selon le montant, le centre de coût ou la nature de la dépense. Une petite facture récurrente peut suivre une règle différente d’un investissement important. Ces circuits doivent correspondre aux délégations existantes plutôt qu’être inventés par le projet IA.",
          "La correction humaine doit être enregistrée. Si le modèle lit 8 800 alors que le document indique 3 800, la valeur finale et la valeur initiale sont toutes deux intéressantes. À l’échelle, les corrections permettent d’identifier les fournisseurs ou formats qui posent problème et de décider si le modèle, la qualité des documents ou les règles doivent évoluer.",
          "Il faut éviter l’automatisation de façade où chaque facture est « prétraitée » mais exige autant de vérifications qu’avant. Le MVP doit mesurer ce que le système permet réellement de ne plus faire : ressaisie de champs fiables, recherche du fournisseur, classement, détection de doublon ou préparation du dossier de validation. Les gains doivent être mesurés sur le processus réel, pas déduits du nombre d’étapes automatisées."
        ]
      },
      {
        id: "integration",
        kicker: "06 — ERP & COMPTABILITÉ",
        heading: "L’intégration cible doit être conçue avant de choisir le niveau d’autonomie.",
        paragraphs: [
          "Une fois la facture validée, les données doivent rejoindre le système de référence. Selon l’environnement, cela peut passer par une API ERP, un connecteur Power Platform, une interface comptable, un fichier structuré ou une table de staging. La méthode d’intégration influence fortement le projet. Une API avec droits fins ne se gère pas comme un export manuel.",
          "Il est souvent préférable de créer une zone intermédiaire. Le workflow écrit un dossier validé dans une table de staging avec le lien vers la pièce. Un processus séparé effectue ensuite l’import comptable. Cette séparation permet de rejouer une étape, de comparer les statuts et d’éviter qu’une panne documentaire bloque le système comptable principal.",
          "Les comptes de service et secrets doivent être gérés comme des composants de production. Le workflow ne doit pas utiliser le mot de passe personnel d’un salarié. Les droits doivent être limités aux opérations nécessaires et les environnements de test séparés lorsque l’outil le permet.",
          "La traçabilité relie enfin les deux mondes. À partir d’une écriture, on doit pouvoir retrouver la facture d’origine et l’exécution du workflow. À partir de la facture, on doit pouvoir connaître son statut et l’identifiant du système cible. Cette réconciliation devient essentielle dès que le volume augmente."
        ]
      },
      {
        id: "mvp",
        kicker: "07 — MVP",
        heading: "Un MVP crédible : une boîte, vingt fournisseurs, zéro paiement automatique.",
        paragraphs: [
          "Le premier périmètre peut se limiter à une boîte e-mail et à vingt fournisseurs réguliers. On collecte un échantillon historique suffisamment varié, on définit les champs réellement nécessaires et on construit le workflow jusqu’à la préparation du dossier de validation. Aucune écriture automatique dans l’ERP n’est nécessaire pour démontrer la valeur.",
          "Le test porte sur plusieurs dimensions : le bon document est-il reconnu, les champs sont-ils correctement extraits, les contrôles trouvent-ils les vrais doublons, les factures ambiguës sont-elles routées vers l’humain et le dossier permet-il au valideur de décider plus rapidement ? Ces questions sont plus utiles qu’un simple score OCR.",
          "Pendant quelques semaines, le système peut fonctionner en mode parallèle. L’équipe compare le résultat préparé automatiquement à son traitement habituel. Chaque correction est enregistrée. Le taux d’autonomie n’est augmenté que sur les types de factures suffisamment stables.",
          "La décision de passer à l’écriture automatique vient ensuite. Elle doit prendre en compte le taux d’erreur par champ, les conséquences d’une mauvaise valeur, la capacité à annuler une écriture, la qualité du journal et la gouvernance de l’équipe. Une architecture qui garde une validation humaine peut déjà supprimer une grande partie du travail répétitif.",
          "Le MVP doit aussi documenter les coûts : nombre de pages traitées, appels aux modèles, coût d’exécution de l’orchestrateur et maintenance. Un workflow rentable à cent factures peut changer de profil à cent mille. La conception doit pouvoir évoluer."
        ]
      },
      {
        id: "failure",
        kicker: "08 — CAS D’ÉCHEC",
        heading: "Les factures faciles ne sont pas le vrai test.",
        paragraphs: [
          "Le jeu de test doit inclure facture sans numéro clair, plusieurs taux de TVA, document dupliqué, avoir, PDF comprenant plusieurs factures, scan de mauvaise qualité, fournisseur inconnu, changement de devise, facture associée à plusieurs commandes et montant ne correspondant pas au bon de commande. Ces cas forcent l’architecture à révéler ses hypothèses.",
          "Un autre cas d’échec concerne les documents qui ressemblent à une facture sans en être une. Devis, relevé, bon de livraison ou attestation peuvent arriver sur la même boîte. Une classification préalable peut être nécessaire. La mauvaise réponse n’est pas de forcer l’extraction de champs vides puis continuer.",
          "La disponibilité des services doit être testée. Si l’API d’extraction est temporairement indisponible, la facture doit rester dans une file récupérable et non être considérée comme traitée. Les retries doivent éviter de créer plusieurs écritures. L’idempotence est une propriété technique importante du workflow.",
          "Enfin, la sécurité ne doit pas être sacrifiée à la fluidité. Les factures contiennent des informations fournisseurs et parfois des données bancaires. Le périmètre envoyé aux services IA, les régions d’hébergement, les contrats fournisseurs et les droits d’accès doivent être examinés selon la politique de l’organisation.",
          "L’automatisation réussie n’est pas celle qui traite tous les documents sans humain. C’est celle qui traite correctement le périmètre prévu, reconnaît les exceptions, fournit une preuve et permet une reprise claire lorsqu’un composant échoue."
        ]
      },
      {
        id: "extensions",
        kicker: "09 — EXTENSIONS",
        heading: "Une fois l’extraction fiable, le workflow peut devenir un véritable système finance.",
        paragraphs: [
          "Le même socle peut ensuite alimenter le suivi des échéances, la détection de pièces manquantes, la réconciliation commande-réception-facture ou la préparation de reporting. Chaque extension doit néanmoins rester séparée dans l’architecture afin que l’équipe sache quelle règle produit quel résultat.",
          "Un assistant conversationnel interne peut permettre de retrouver une facture ou d’expliquer son statut. Il ne doit pas devenir le système de référence. Il interroge les données structurées et renvoie vers la pièce originale. Cette approche combine accessibilité et traçabilité.",
          "Les signaux d’anomalie peuvent également être enrichis avec l’historique : montant inhabituel pour un fournisseur, nouvelle coordonnée bancaire, facture reçue à une fréquence inattendue. Ces signaux servent à prioriser la revue, pas à prononcer automatiquement un jugement.",
          "À mesure que les flux de facturation deviennent plus structurés, le rôle du workflow évolue. Lorsqu’une donnée fiable existe déjà dans un format structuré, il est inutile de la reconvertir en image puis de la relire avec OCR. L’architecture doit privilégier la source la plus structurée disponible.",
          "La logique générale reste la même : capturer, extraire, vérifier, décider, intégrer et tracer. C’est cette architecture qui est transférable à d’autres documents administratifs, bien plus que le choix d’un modèle précis."
        ]
      }
    ]
  }
];

export const marketDemandTrainingArticlesWave4 = [
  {
    type: "training",
    slug: "creer-une-sensibilisation-ai-act-adaptee-aux-cas-d-usage-de-l-entreprise",
    cluster: "Gouvernance & AI Act",
    title: "AI Act et maîtrise de l’IA : construire une sensibilisation adaptée aux usages réels de l’entreprise",
    dek: "L’article 4 de l’AI Act ne demande pas à toutes les entreprises de faire suivre le même cours à tous les salariés. Il impose aux fournisseurs et déployeurs de prendre des mesures pour soutenir la maîtrise de l’IA en tenant compte des connaissances, de l’expérience, de la formation et du contexte d’usage. Une bonne démarche commence donc par les populations et les systèmes réellement utilisés.",
    summary: "Depuis le 2 février 2025, les dispositions de l’AI Act relatives à la maîtrise de l’IA sont applicables. Après la modification adoptée dans le cadre du Digital Omnibus en juillet 2026, l’obligation reste de prendre des mesures pour soutenir le développement de la maîtrise de l’IA des personnes qui utilisent ou opèrent des systèmes d’IA pour l’organisation ; aucun niveau individuel unique n’est imposé. La Commission précise qu’une formation peut faire partie de la réponse, mais que l’approche doit être adaptée aux connaissances des publics et au contexte des systèmes utilisés. Le parcours Autonomia décrit ici une méthode de segmentation et d’apprentissage pratique ; il ne constitue pas un avis juridique ni une garantie de conformité.",
    readingTime: "22–27 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["governance", "ai_act", "ai_literacy", "change_adoption", "risk", "human_in_the_loop"],
    search: {
      primaryKeyword: "formation AI Act entreprise",
      secondaryQueries: [
        "maîtrise IA article 4 entreprise",
        "AI literacy formation entreprise",
        "sensibilisation AI Act salariés",
        "formation gouvernance IA entreprise",
        "obligation maîtrise IA article 4"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["ARTICLE", "Article 4 — maîtrise / AI literacy"],
      ["APPLICATION", "Mesures applicables depuis le 2 février 2025"],
      ["PRINCIPE", "Adapter les mesures aux publics, connaissances et contextes d’usage"],
      ["ATTENTION", "Une formation seule n’est pas une garantie automatique de conformité"]
    ],
    sourceNote: "Le texte consolidé de l’AI Act et les ressources de la Commission européenne indiquent que les fournisseurs et déployeurs doivent prendre des mesures pour soutenir le développement de la maîtrise de l’IA des personnes utilisant ou opérant des systèmes d’IA pour leur compte. La Commission précise que l’approche doit tenir compte des connaissances techniques, de l’expérience, de l’éducation, de la formation et du contexte d’utilisation. Son FAQ indique qu’une formation n’est pas nécessairement la seule initiative possible et son répertoire de pratiques ne confère pas à lui seul une présomption de conformité. Le guide Autonomia est pédagogique et ne remplace pas l’analyse juridique propre à l’organisation.",
    sources: [
      {
        label: "EUR-Lex — règlement (UE) 2024/1689, article 4 consolidé",
        url: "https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng"
      },
      {
        label: "Commission européenne — AI talent, skills and literacy",
        url: "https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy"
      },
      {
        label: "Commission européenne — AI Literacy, Questions & Answers",
        url: "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers"
      },
      {
        label: "Commission européenne — repository of AI literacy practices",
        url: "https://digital-strategy.ec.europa.eu/en/policies/repository-ai-literacy-practices"
      }
    ],
    related: [
      {
        href: "/formation-ia/cas-usage/gouvernance-ai-act",
        kicker: "PILIER",
        label: "Formation gouvernance IA et AI Act"
      },
      {
        href: "/formation-ai-act",
        kicker: "ACADEMY",
        label: "Cadrer une formation AI Act en entreprise"
      },
      {
        href: "/methodologie/learning-transfer",
        kicker: "MÉTHODE",
        label: "Matrice Autonomia de transfert de compétences"
      }
    ],
    faq: [
      ["L’AI Act impose-t-il obligatoirement une formation identique à tous les salariés ?", "Non. La Commission indique que les mesures de maîtrise de l’IA doivent être adaptées aux connaissances, à l’expérience, à la formation des personnes et au contexte d’usage. Une formation peut être pertinente, mais l’approche ne se réduit pas nécessairement à un cours unique."],
      ["L’article 4 est-il déjà applicable en septembre 2026 ?", "Oui. Les dispositions relatives à la maîtrise de l’IA sont entrées en application le 2 février 2025. Les textes et FAQ officiels doivent toutefois être consultés pour tenir compte des modifications réglementaires et du contexte de l’organisation."],
      ["Existe-t-il un niveau officiel unique de maîtrise de l’IA à atteindre ?", "Après la modification de juillet 2026, la Commission indique qu’aucun niveau individuel spécifique ou unique n’est imposé. Les mesures doivent soutenir le développement de la maîtrise de l’IA en tenant compte du contexte."],
      ["Une attestation de formation suffit-elle à prouver la conformité ?", "Une attestation peut documenter une mesure prise, mais le répertoire de pratiques de la Commission précise que reproduire un exemple ne confère pas automatiquement une présomption de conformité. L’organisation doit examiner ses usages, ses publics et ses obligations."],
      ["Qui faut-il former en priorité ?", "Les personnes qui utilisent ou opèrent des systèmes d’IA pour l’organisation doivent être considérées en fonction de leurs tâches et du contexte. Les besoins d’un dirigeant, d’un manager, d’un utilisateur de Copilot et d’une équipe qui déploie un système à impact élevé ne sont pas identiques."],
      ["Faut-il enseigner toute la réglementation ?", "Pas nécessairement à tous. La formation peut combiner un socle commun — capacités, limites, risques, règles internes — avec des modules adaptés aux rôles et aux systèmes utilisés. Les équipes juridiques ou gouvernance auront besoin d’un niveau différent des utilisateurs métier."],
      ["Comment documenter la démarche ?", "Une organisation peut conserver la cartographie des populations et usages, les objectifs, contenus, présences, évaluations, règles internes et actions complémentaires. Le niveau de documentation approprié dépend du contexte et doit être défini avec les fonctions compétentes."],
      ["Ce guide constitue-t-il un conseil juridique ?", "Non. Il propose une architecture pédagogique à partir des textes et ressources officielles disponibles. Les obligations applicables à une organisation doivent être analysées avec ses fonctions juridiques, conformité ou conseils compétents."]
    ],
    sections: [
      {
        id: "what-changed",
        kicker: "01 — LE CADRE EN 2026",
        heading: "Maîtrise de l’IA : une obligation de mesures adaptées, pas un examen universel.",
        paragraphs: [
          "L’article 4 de l’AI Act porte sur la maîtrise de l’IA, appelée AI literacy dans la version anglaise. Le texte vise les fournisseurs et les déployeurs de systèmes d’IA et leur demande de prendre des mesures pour soutenir le développement de cette maîtrise chez leur personnel et les autres personnes qui opèrent ou utilisent des systèmes d’IA pour leur compte. Le contexte d’utilisation et les caractéristiques des personnes concernées font partie des éléments à prendre en considération.",
          "Cette disposition s’applique depuis le 2 février 2025. En juillet 2026, le Digital Omnibus a modifié l’article 4. Les ressources de la Commission publiées depuis cette modification insistent sur le fait que l’obligation demeure, mais qu’aucun niveau individuel unique n’est imposé. Cette nuance est importante : une entreprise ne doit pas chercher un score magique ou un certificat universel qui résoudrait le sujet à lui seul.",
          "La FAQ de la Commission précise également qu’une formation peut constituer une mesure appropriée, mais que d’autres initiatives de maîtrise de l’IA sont possibles. La réponse dépend notamment des connaissances, de l’expérience, de l’éducation et de la formation des personnes ainsi que du contexte et de la finalité des systèmes d’IA utilisés. Une politique interne, une documentation, des ateliers, des communautés de pratique ou des procédures de supervision peuvent compléter la formation.",
          "Pour Autonomia Academy, cette logique conduit à une règle pédagogique simple : ne pas commencer par un catalogue. Commencer par les usages. Qui utilise quoi ? Pour quelle tâche ? Avec quelles données ? Quelles décisions peuvent être influencées ? Quels risques ou personnes sont concernés ? La montée en compétences devient alors une architecture liée au travail réel.",
          "Ce guide ne vise pas à conclure qu’un programme particulier suffit juridiquement. Il traduit les principes officiels en démarche pédagogique afin d’aider une entreprise à structurer son travail avec les fonctions juridiques, conformité, RH, IT et métiers."
        ]
      },
      {
        id: "mapping",
        kicker: "02 — CARTOGRAPHIER LES PUBLICS",
        heading: "Un manager, un utilisateur de ChatGPT et une équipe qui construit un agent n’ont pas le même besoin.",
        paragraphs: [
          "La première étape consiste à cartographier les populations. Un socle commun peut être utile, mais les risques, responsabilités et décisions ne sont pas les mêmes selon les rôles. Un collaborateur qui utilise un assistant pour reformuler des e-mails doit comprendre les données qu’il peut fournir, les limites des réponses et les règles internes. Une équipe qui branche un agent à des outils métiers doit en plus raisonner sur permissions, supervision, journalisation et reprise d’erreur.",
          "Les dirigeants et managers ont un autre besoin. Ils doivent savoir distinguer démonstration, expérimentation et système réellement déployé. Ils doivent comprendre les limites suffisamment pour ne pas interpréter une sortie avec un niveau de confiance injustifié, et connaître les circuits internes lorsque le sujet dépasse leur responsabilité.",
          "Les fonctions support — RH, finance, juridique, achats — travaillent souvent avec des données plus sensibles ou des décisions qui affectent des personnes. Leur parcours doit relier la maîtrise de l’IA aux pratiques concrètes de la fonction. Les équipes techniques ont besoin d’un niveau plus profond sur les modèles, l’évaluation, les garde-fous et la documentation.",
          "La cartographie peut prendre la forme d’un tableau : population, système utilisé, tâches, données manipulées, actions possibles, personnes potentiellement affectées, niveau d’autonomie et contrôles existants. Ce tableau est plus utile qu’une liste de métiers isolée parce qu’un même intitulé peut recouvrir des usages très différents.",
          "L’organisation peut ensuite décider où un socle commun suffit et où un module spécialisé est nécessaire. Cette segmentation évite à la fois la formation trop générale — personne ne sait quoi en faire — et la surformation technique de personnes qui n’en ont pas besoin."
        ]
      },
      {
        id: "common-core",
        kicker: "03 — SOCLE COMMUN",
        heading: "Comprendre ce que fait l’IA, ce qu’elle ne garantit pas et comment l’utiliser dans le cadre de l’entreprise.",
        paragraphs: [
          "Un socle commun utile peut commencer par les capacités. Un système d’IA peut classer, extraire, générer, recommander ou agir dans un workflow selon sa conception. Il ne transforme pas automatiquement une information produite en vérité. Les participants doivent savoir qu’une réponse plausible peut contenir une erreur, qu’un système documentaire peut retrouver la mauvaise source et qu’un agent peut appeler un outil inadapté si l’architecture ne le borne pas.",
          "Le deuxième sujet est la donnée. Quelles informations peuvent être saisies dans les outils autorisés ? Quels documents internes sont concernés ? Quelles données personnelles ou confidentielles nécessitent des précautions particulières ? Les réponses exactes dépendent de la politique et des contrats de l’entreprise ; la formation doit donc intégrer les règles internes réelles plutôt que donner une consigne générique.",
          "Le troisième sujet est la vérification. Les participants apprennent à distinguer une tâche où l’IA prépare du contenu d’une tâche où elle influence une décision. Ils savent revenir aux sources, demander une citation, recouper une information et conserver le jugement humain lorsque la conséquence le justifie.",
          "Le quatrième sujet est l’escalade. Une bonne maîtrise de l’IA inclut la capacité à reconnaître que l’on ne sait pas. Qui contacter lorsqu’un outil semble produire un comportement anormal ? Comment signaler une erreur ou un incident ? Qui décide qu’un nouvel usage peut être déployé ? Ces circuits doivent devenir aussi concrets que les techniques de prompting.",
          "Enfin, le socle doit expliquer le vocabulaire réglementaire utile sans transformer chaque salarié en juriste. Fournisseur, déployeur, système, usage, risque, supervision : les termes sont introduits au niveau nécessaire à la compréhension des responsabilités et des politiques internes."
        ]
      },
      {
        id: "role-paths",
        kicker: "04 — PARCOURS PAR RÔLE",
        heading: "Faire varier le contenu selon les tâches et les conséquences de l’usage.",
        paragraphs: [
          "Pour les utilisateurs métier, la formation peut se concentrer sur les tâches : rédaction, synthèse, recherche, préparation, analyse ou automatisation légère. Chaque exercice inclut une étape de vérification et une discussion sur les données. L’objectif est de créer des routines sûres, pas seulement de connaître des fonctionnalités.",
          "Pour les managers, le parcours ajoute le pilotage : comment décider qu’un usage mérite d’être diffusé, comment vérifier que l’équipe garde la maîtrise du travail, comment mesurer l’adoption et comment traiter un incident. Le manager doit également savoir que la fréquence d’utilisation n’est pas la même chose que la valeur.",
          "Pour les équipes techniques et produit, les notions de validation, qualité des données, évaluation, monitoring, droits, human-in-the-loop et documentation deviennent plus importantes. Elles apprennent à décrire un système de façon suffisamment précise pour que les risques soient discutables.",
          "Pour la gouvernance, juridique, conformité ou risques, l’approche peut partir des systèmes réellement utilisés et des obligations qui leur sont applicables. Les exercices portent sur la cartographie, la documentation, les responsabilités et les preuves disponibles. Le guide pédagogique ne remplace pas leur analyse juridique ; il facilite un langage commun avec les métiers.",
          "Cette logique de parcours évite le faux choix entre « formation générale » et « formation technique ». Une organisation peut construire un tronc commun court puis plusieurs approfondissements, avec des critères de passage liés aux responsabilités."
        ]
      },
      {
        id: "use-cases",
        kicker: "05 — CAS D’USAGE",
        heading: "Enseigner les règles au moment précis où elles deviennent nécessaires.",
        paragraphs: [
          "La gouvernance est beaucoup plus mémorable lorsqu’elle apparaît dans un exercice. Prenons un collaborateur qui veut résumer un contrat avec un assistant. Au moment d’importer le document, la question de la confidentialité devient concrète. Au moment de produire le résumé, la nécessité de vérifier les clauses importantes apparaît. Au moment de transmettre le résultat, on peut discuter de la différence entre synthèse préparatoire et validation juridique.",
          "Même logique avec un manager qui construit un agent de relance. Lorsqu’il connecte le CRM, la formation introduit permissions et minimisation. Lorsqu’il autorise l’envoi d’un e-mail, elle introduit le niveau d’autonomie et les validations. Lorsqu’il mesure le résultat, elle sépare métrique d’usage et impact métier.",
          "Cette pédagogie réduit la distance entre réglementation et pratique. Au lieu de présenter une longue liste de risques, chaque équipe apprend à identifier les moments où une règle doit être appliquée. La maîtrise de l’IA devient une compétence de décision.",
          "L’entreprise peut utiliser ses propres cas d’usage, à condition de les préparer pour la formation. Les documents sensibles peuvent être remplacés par des versions anonymisées ou synthétiques. L’objectif n’est pas d’exposer des données réelles, mais de reproduire les décisions qu’un salarié devra prendre.",
          "Chaque cas peut se terminer par une micro-checklist : donnée autorisée ? source vérifiée ? décision affectant une personne ? action réversible ? validation nécessaire ? propriétaire identifié ? Cette répétition transforme progressivement la règle en réflexe."
        ]
      },
      {
        id: "evidence",
        kicker: "06 — ÉVALUER & DOCUMENTER",
        heading: "Mesurer une capacité observable plutôt qu’une présence à une session.",
        paragraphs: [
          "Une feuille de présence montre qu’une personne a participé. Elle ne démontre pas qu’elle sait reconnaître une limite, vérifier une source ou appliquer une règle interne. L’évaluation peut donc porter sur des situations. Le participant reçoit un cas et doit décider quelles données utiliser, quel niveau de confiance accorder à la sortie et quand demander une validation.",
          "Le questionnaire de fin de session peut compléter cette mise en situation mais ne devrait pas être le seul signal. Les équipes peuvent également produire une checklist d’usage, un exemple corrigé ou un mini plan d’action. Pour les populations avancées, l’évaluation peut inclure l’analyse d’un workflow ou d’un agent.",
          "L’organisation peut documenter la démarche à plusieurs niveaux : populations identifiées, systèmes utilisés, objectifs du parcours, contenus, modalités, personnes présentes, évaluations, règles internes communiquées et actions complémentaires. Cette documentation aide à suivre le programme dans le temps et à décider des mises à jour.",
          "Il faut cependant éviter de transformer la documentation pédagogique en une affirmation juridique automatique. La Commission précise que les exemples de pratiques visent à soutenir l’apprentissage et l’échange ; les reprendre ne donne pas à lui seul une présomption de conformité. L’entreprise doit conserver sa propre analyse.",
          "La mesure à froid est particulièrement utile. Quelques semaines plus tard, quels usages ont été adoptés ? Quelles règles restent mal comprises ? Quels incidents ou questions remontent ? La réponse permet d’ajuster le parcours et d’éviter qu’une sensibilisation unique vieillisse pendant que les outils changent."
        ]
      },
      {
        id: "program",
        kicker: "07 — PROGRAMME",
        heading: "Construire une trajectoire de maîtrise de l’IA, pas une journée isolée.",
        paragraphs: [
          "Un programme peut démarrer par une cartographie des usages et des publics. Le premier livrable n’est pas un support de formation mais une matrice : qui utilise quels systèmes, pour quelles tâches, avec quel niveau de risque et quelles règles existantes. Cette étape détermine le parcours.",
          "Vient ensuite le socle commun. Il peut être court si les populations disposent déjà d’une culture numérique solide. Les équipes qui utilisent régulièrement l’IA peuvent consacrer davantage de temps aux cas complexes et au contrôle. Les personnes débutantes ont besoin de pratiquer les bases avant de discuter d’agents ou d’évaluation avancée.",
          "Les modules par rôle sont ensuite déclenchés selon les responsabilités. Managers, RH, juridique, finance, marketing, commercial, IT ou équipes IA n’ont pas besoin des mêmes exemples. La pédagogie conserve un vocabulaire commun mais adapte les tâches.",
          "Le programme doit enfin prévoir une continuité : documentation interne, réseau d’ambassadeurs, office hours, communauté de pratique, FAQ ou canal de remontée des questions. La maîtrise de l’IA évolue avec les outils ; elle ne se termine pas au dernier slide d’une journée.",
          "Les mises à jour sont planifiées selon les changements de systèmes, de politiques et de règles applicables. La date de la dernière revue du parcours devient une information utile. Une formation sur des outils ou textes obsolètes peut créer plus de confusion que de sécurité."
        ]
      },
      {
        id: "mvp",
        kicker: "08 — PREMIER DÉPLOIEMENT",
        heading: "Commencer par deux populations et trois cas d’usage réellement utilisés.",
        paragraphs: [
          "Une entreprise n’a pas besoin de cartographier toutes ses pratiques mondiales avant de commencer. Elle peut choisir deux populations où l’usage est déjà réel : par exemple managers et fonctions support. Pour chacune, elle identifie trois tâches fréquentes et les outils autorisés.",
          "Le parcours pilote comprend un socle commun puis des ateliers sur ces tâches. Chaque exercice intègre la règle de donnée, la vérification, l’escalade et la responsabilité appropriées. Les participants sont évalués sur leur capacité à expliquer leurs choix, pas uniquement sur la qualité du texte produit.",
          "Après la session, l’équipe collecte les questions, erreurs et usages non prévus. Ces retours enrichissent la politique interne et la prochaine vague de formation. Le dispositif devient progressivement plus précis au lieu d’essayer d’être complet dès le premier jour.",
          "Les fonctions juridique, conformité et IT peuvent relire le programme pour vérifier qu’il correspond aux systèmes et politiques réellement déployés. Les RH ou L&D organisent ensuite la preuve pédagogique et la diffusion.",
          "Cette première boucle permet de démontrer une démarche structurée sans prétendre que la formation règle seule toutes les obligations. L’organisation construit une capacité : comprendre, utiliser, vérifier, signaler et mettre à jour."
        ]
      },
      {
        id: "limits",
        kicker: "09 — LIMITES & VIGILANCE",
        heading: "Éviter trois raccourcis : certificat magique, contenu générique et confusion entre formation et conseil juridique.",
        paragraphs: [
          "Premier raccourci : croire qu’un certificat standard prouve à lui seul la maîtrise de l’IA de toute l’organisation. L’article 4 demande une approche qui tient compte des personnes et du contexte. Une attestation peut faire partie de la documentation, mais la démarche doit rester liée aux usages.",
          "Deuxième raccourci : diffuser exactement le même contenu à tout le monde. Un module général peut créer un langage commun, mais la compréhension utile se joue souvent dans les tâches. Une personne qui crée un agent autonome n’a pas besoin du même niveau qu’une personne qui utilise un assistant de rédaction.",
          "Troisième raccourci : présenter une formation comme une consultation juridique. Un formateur peut expliquer les concepts, faire pratiquer les règles internes et présenter les ressources officielles. L’analyse des obligations précises, de la classification d’un système ou de la conformité d’un dispositif appartient aux fonctions compétentes.",
          "Il faut également suivre les changements réglementaires. Les ressources de la Commission évoluent et le Digital Omnibus a déjà modifié l’article 4 en 2026. Un programme sérieux indique sa date de mise à jour et utilise les textes consolidés ou FAQ officielles lorsqu’il traite d’un point juridique.",
          "Enfin, la maîtrise de l’IA ne doit pas devenir un frein abstrait à l’expérimentation. Son objectif est l’inverse : permettre aux personnes de comprendre les capacités, risques et garde-fous pour utiliser les systèmes de façon plus informée. Une bonne formation augmente la capacité à agir tout en rendant les limites visibles."
        ]
      }
    ]
  }
];
