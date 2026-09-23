const EXECUTION = {
  "E-mails & boîte de réception": {
    summary: "Le sujet n’est pas de faire répondre une IA à tous les e-mails. Il est de distinguer ce qui relève du tri, de l’extraction, du routage, de la préparation d’une réponse et de la décision humaine.",
    decisions: ["Quels messages entrent réellement dans le périmètre ?", "Quelles actions peuvent être automatiques sans risque ?", "Comment traiter les messages ambigus ou sensibles ?"]
  },
  "Google Drive & documents": {
    summary: "L’enjeu est de transformer un stockage de fichiers en système documentaire exploitable : classer, extraire, retrouver, comparer et citer sans perdre les droits d’accès ni la traçabilité.",
    decisions: ["Quelle source documentaire fait foi ?", "Quelles métadonnées faut-il produire ou conserver ?", "Comment éviter d’exposer des documents obsolètes ou non autorisés ?"]
  },
  "Commercial & CRM": {
    summary: "L’IA peut réduire le travail de préparation et de mise à jour autour de la vente, mais le système doit rester ancré dans les données CRM et les actions réellement attendues des commerciaux.",
    decisions: ["Quelle information doit revenir dans le CRM ?", "Quelles actions méritent une validation commerciale ?", "Comment distinguer personnalisation utile et automatisation artificielle ?"]
  },
  "Marketing & contenu": {
    summary: "Le levier utile n’est pas de produire davantage de texte générique. Il est de relier signaux commerciaux, preuves, expertise interne et formats éditoriaux pour produire des contenus réellement distinctifs.",
    decisions: ["Quelle source interne rend le contenu spécifique ?", "Quel format sert réellement l’intention de recherche ?", "Comment vérifier les affirmations avant publication ?"]
  },
  "Support client": {
    summary: "Le support combine classification, recherche documentaire, rédaction et escalade. L’architecture doit surtout savoir quand répondre, quand citer une procédure et quand transmettre à un humain.",
    decisions: ["Quelles demandes peuvent être traitées à partir de la base de connaissances ?", "Quels signaux imposent une escalade ?", "Comment mesurer la qualité d’une réponse proposée ?"]
  },
  "RH & recrutement": {
    summary: "Les usages RH utiles assistent la préparation, la synthèse, la documentation et l’accès aux procédures sans déléguer automatiquement des décisions sensibles à un modèle.",
    decisions: ["Quelle décision doit rester explicitement humaine ?", "Quelles données personnelles sont nécessaires au workflow ?", "Comment documenter les critères et les corrections ?"]
  },
  "Finance & comptabilité": {
    summary: "Le potentiel se situe surtout dans l’extraction, le contrôle de cohérence, la collecte et la synthèse. Les écritures ou validations engageantes doivent être séparées des tâches préparatoires.",
    decisions: ["Quelles données peuvent être extraites automatiquement ?", "Quels contrôles doivent bloquer le workflow ?", "Quelle preuve conserver avant validation ?"]
  },
  "Administration & opérations": {
    summary: "L’administratif contient de nombreuses micro-tâches de transport d’information. Le bon système réduit les ressaisies tout en gardant visibles les pièces, statuts, exceptions et responsabilités.",
    decisions: ["Quelle information est saisie plusieurs fois aujourd’hui ?", "Quels dossiers doivent être considérés incomplets ?", "Où placer les validations et relances ?"]
  },
  "Réunions & gestion de projet": {
    summary: "Le gain ne vient pas seulement du compte rendu automatique mais de la continuité entre décisions, responsables, échéances, tâches et mémoire du projet.",
    decisions: ["Quelles décisions doivent devenir des actions suivies ?", "Quelle source fait foi en cas de contradiction ?", "Comment distinguer résumé et engagement réel ?"]
  },
  "Achats & fournisseurs": {
    summary: "L’IA peut accélérer comparaison, extraction et préparation de consultation, mais la grille de décision, les seuils et la validation fournisseur doivent rester explicites.",
    decisions: ["Quels critères sont réellement comparables ?", "Quelles pièces doivent être vérifiées avant décision ?", "Comment conserver les écarts et justifications ?"]
  },
  "Juridique & conformité": {
    summary: "L’IA peut aider à retrouver, comparer, extraire et préparer une revue documentaire. Elle ne remplace pas la validation juridique et doit toujours permettre de revenir au texte source.",
    decisions: ["Quel document de référence doit être cité ?", "Quels écarts méritent une revue humaine ?", "Comment éviter qu’une synthèse soit prise pour une validation juridique ?"]
  },
  "BTP & chantier": {
    summary: "Le suivi de chantier produit beaucoup de comptes rendus, photos, réserves et actions. L’intérêt est de relier ces traces à un suivi exploitable sans déformer les responsabilités contractuelles.",
    decisions: ["Quelles réserves ou actions doivent être extraites ?", "Comment rattacher photos, dates et entreprises au bon sujet ?", "Quelle validation humaine reste nécessaire avant diffusion ?"]
  },
  "Immobilier & gestion de biens": {
    summary: "Les demandes locatives, états des lieux, interventions et échanges prestataires peuvent être structurés pour réduire le temps de recherche et améliorer la continuité de traitement.",
    decisions: ["Comment identifier correctement le bien et le dossier ?", "Quelles anomalies déclenchent une intervention ?", "Quelles données doivent rester limitées à certains rôles ?"]
  },
  "Retail & e-commerce": {
    summary: "Le retail combine catalogue, avis, support, prix et données de vente. Le système doit séparer génération de contenu, analyse des signaux et décisions commerciales.",
    decisions: ["Quelle donnée produit fait foi ?", "Comment détecter une information inventée ou incohérente ?", "Quelles décisions de prix ou de commande restent humaines ?"]
  },
  "Logistique & supply chain": {
    summary: "Les workflows logistiques gagnent surtout à mieux extraire les incidents, consolider les documents et faire remonter les exceptions qui nécessitent une décision.",
    decisions: ["Quel événement constitue réellement un incident ?", "Quelles sources permettent de rapprocher commande, livraison et facture ?", "Quand faut-il alerter un opérateur ?"]
  },
  "Direction & management": {
    summary: "Un copilote de direction utile n’invente pas des explications. Il rassemble les sources, explicite les écarts, prépare les questions et permet de revenir aux données d’origine.",
    decisions: ["Quelles sources sont suffisamment fiables pour une synthèse ?", "Comment distinguer fait, interprétation et hypothèse ?", "Quelles décisions ne doivent jamais être automatisées ?"]
  },
  "Data & reporting": {
    summary: "L’IA peut rendre les données plus lisibles, mais elle ne doit pas inventer les causes d’une variation. Le système doit distinguer calcul, commentaire et hypothèse.",
    decisions: ["Quels indicateurs sont calculés de façon déterministe ?", "Quelles explications sont autorisées uniquement comme hypothèses ?", "Comment signaler les données manquantes ou incohérentes ?"]
  },
  "IT, helpdesk & sécurité": {
    summary: "Le helpdesk se prête au tri, à la recherche documentaire et à la préparation de diagnostic. Les droits d’accès, actions sensibles et procédures d’escalade doivent rester strictement contrôlés.",
    decisions: ["Quelles actions nécessitent une identité ou un rôle précis ?", "Quelles procédures peuvent être citées automatiquement ?", "Comment gérer une suggestion technique incertaine ?"]
  },
  "Conseil & services professionnels": {
    summary: "Le potentiel se situe dans la préparation, la synthèse et la réutilisation des connaissances de mission, à condition de distinguer méthodes internes, données client et livrables validés.",
    decisions: ["Quelles sources peuvent être réutilisées entre missions ?", "Comment protéger les informations propres à chaque client ?", "Où la relecture experte reste-t-elle indispensable ?"]
  },
  "Knowledge management & recherche interne": {
    summary: "Une mémoire d’entreprise utile exige autant de gouvernance documentaire que de technologie : sources, fraîcheur, droits, citations et gestion des contradictions.",
    decisions: ["Quels documents entrent dans la base de connaissance ?", "Comment gérer les droits au niveau des sources ?", "Comment détecter l’obsolescence et les contradictions ?"]
  }
};

const TRAINING = {
  "Direction": {
    summary: "Le dirigeant n’a pas besoin de devenir technicien. Il doit savoir prioriser les usages, challenger un projet, arbitrer les risques et poser les conditions d’un déploiement mesurable.",
    decisions: ["Quels cas d’usage méritent réellement un investissement ?", "Quelles questions poser avant de financer un projet ?", "Comment distinguer expérimentation, adoption et valeur ?"]
  },
  "Managers": {
    summary: "Le manager doit apprendre à organiser l’usage de l’IA dans le travail quotidien : règles, délégation, contrôle qualité, partage des méthodes et accompagnement de l’équipe.",
    decisions: ["Quelles tâches peuvent être assistées sans diluer la responsabilité ?", "Comment vérifier la qualité du travail produit avec l’IA ?", "Comment diffuser les bonnes pratiques sans imposer un outil unique ?"]
  },
  "Commercial": {
    summary: "La formation commerciale doit relier l’IA à des moments concrets : préparation, recherche, compte rendu, proposition, relance et mise à jour du CRM.",
    decisions: ["Quelles informations client peuvent être utilisées ?", "Quels messages doivent rester personnalisés par le commercial ?", "Comment réinjecter le résultat dans le CRM ?"]
  },
  "Marketing": {
    summary: "Le marketing doit apprendre à utiliser l’IA pour analyser, structurer et décliner sans produire une masse de contenus interchangeables.",
    decisions: ["Quelle preuve interne nourrit le contenu ?", "Comment maintenir une voix et une position distinctes ?", "Comment vérifier faits, sources et droits avant publication ?"]
  },
  "RH": {
    summary: "La montée en compétences RH doit combiner productivité et prudence : rédaction, synthèse, préparation, procédures internes et compréhension des limites sur les décisions sensibles.",
    decisions: ["Quelles données personnelles sont adaptées à l’exercice ?", "Quelles décisions ne doivent pas être déléguées ?", "Comment intégrer les règles internes dans les usages ?"]
  },
  "Finance & administratif": {
    summary: "Les équipes doivent apprendre à automatiser le traitement préparatoire sans confondre extraction, contrôle et validation financière.",
    decisions: ["Quels documents peuvent être traités automatiquement ?", "Quels contrôles sont obligatoires avant validation ?", "Comment documenter les erreurs et corrections ?"]
  },
  "Juridique & conformité": {
    summary: "La formation doit apprendre à utiliser l’IA comme outil de recherche, comparaison et préparation tout en maintenant le lien avec les sources et la validation professionnelle.",
    decisions: ["Comment demander une réponse sourcée ?", "Comment détecter une interprétation trop affirmative ?", "Quels usages nécessitent un professionnel compétent ?"]
  },
  "Projet & opérations": {
    summary: "Les équipes projet peuvent apprendre à transformer réunions, décisions et documents en actions suivies, sans laisser l’IA inventer des engagements ou des responsables.",
    decisions: ["Comment structurer une décision en action ?", "Comment garder une source de vérité ?", "Quels automatismes améliorent vraiment le suivi ?"]
  },
  "Service client": {
    summary: "La compétence utile consiste à préparer et vérifier des réponses cohérentes avec la documentation, tout en sachant reconnaître les demandes qui nécessitent une escalade.",
    decisions: ["Quand utiliser une base de connaissances ?", "Comment vérifier une réponse avant envoi ?", "Quels signaux imposent une reprise humaine ?"]
  },
  "Achats": {
    summary: "Les acheteurs peuvent apprendre à comparer et synthétiser plus vite, sans laisser l’IA définir seule les critères ni prendre la décision fournisseur.",
    decisions: ["Comment construire une grille de comparaison explicite ?", "Quelles pièces doivent être vérifiées ?", "Comment documenter les écarts entre offres ?"]
  },
  "Microsoft Copilot": {
    summary: "Copilot devient utile lorsque les collaborateurs savent reconnaître les tâches où l’assistance apporte quelque chose, donner du contexte et contrôler les sorties dans leur environnement Microsoft.",
    decisions: ["Quels usages sont prioritaires par population ?", "Quelles données et permissions sont disponibles ?", "Comment mesurer l’adoption au-delà du nombre de connexions ?"]
  },
  "ChatGPT": {
    summary: "La compétence ne se résume pas au prompt. Il faut savoir cadrer, contextualiser, vérifier, itérer et respecter les règles de l’entreprise.",
    decisions: ["Quelles données peut-on fournir ?", "Comment vérifier une réponse ?", "Comment transformer un bon échange ponctuel en méthode réutilisable ?"]
  },
  "Prompt engineering": {
    summary: "Le prompt engineering professionnel consiste à structurer un problème, des contraintes, des exemples et des critères de qualité plutôt qu’à collectionner des formulations magiques.",
    decisions: ["Quel contexte est réellement nécessaire ?", "Quels critères rendent la sortie vérifiable ?", "Comment tester une méthode sur plusieurs cas ?"]
  },
  "Agents IA": {
    summary: "Former aux agents, c’est apprendre à raisonner en outils, permissions, boucles, validations et erreurs avant de chercher l’autonomie maximale.",
    decisions: ["Quand un workflow déterministe suffit-il ?", "Quelles actions l’agent a-t-il le droit d’exécuter ?", "Où faut-il imposer une validation humaine ?"]
  },
  "Automatisation no-code": {
    summary: "La compétence clé est de cartographier un processus puis de construire un workflow maintenable, testable et documenté, avec ou sans étape d’IA.",
    decisions: ["Quel déclencheur et quelles données utiliser ?", "Où ajouter l’IA plutôt qu’une règle classique ?", "Comment tester et reprendre une erreur ?"]
  },
  "Gouvernance & AI Act": {
    summary: "La gouvernance devient mémorable lorsqu’elle est reliée aux situations de travail : données, rôles, supervision, documentation, validation et incidents.",
    decisions: ["Qui décide qu’un usage est acceptable ?", "Quels contrôles doivent être documentés ?", "Comment les équipes savent-elles quand escalader ?"]
  },
  "Analyse de données": {
    summary: "Les participants doivent apprendre à distinguer calcul, exploration, explication et hypothèse afin d’utiliser l’IA sans transformer une corrélation en conclusion.",
    decisions: ["Quelles données sont fiables ?", "Quel calcul doit rester déterministe ?", "Comment signaler l’incertitude d’une interprétation ?"]
  },
  "Création de contenu": {
    summary: "L’objectif n’est pas d’écrire plus vite à tout prix mais de produire un contenu spécifique, vérifié, utile et cohérent avec la marque et les sources disponibles.",
    decisions: ["Quelle matière première rend le contenu original ?", "Comment vérifier les faits et citations ?", "Quels formats servent réellement le public ?"]
  },
  "Knowledge management": {
    summary: "Les équipes doivent comprendre que la qualité d’un assistant documentaire dépend des sources, de leur structure, de leur fraîcheur, des droits et de la capacité à citer.",
    decisions: ["Quels documents sont de référence ?", "Comment préparer les sources avant recherche sémantique ?", "Comment évaluer si une réponse est bien ancrée ?"]
  },
  "Adoption & conduite du changement": {
    summary: "L’adoption durable se construit par des usages visibles, des relais internes, des méthodes partagées et des règles claires plutôt que par une simple campagne de sensibilisation.",
    decisions: ["Quels premiers usages peuvent créer de la confiance ?", "Qui aide les équipes après la formation ?", "Comment distinguer fréquence d’usage et valeur réelle ?"]
  }
};

export function getPillarInsight(family, cluster) {
  const source = family === "training" ? TRAINING : EXECUTION;
  return source[cluster] || {
    summary: "Ce pilier aide à relier un besoin concret à une méthode, des compétences et des garde-fous explicites.",
    decisions: ["Quel résultat est attendu ?", "Quelles données et règles encadrent l’usage ?", "Comment vérifier le résultat avant de généraliser ?"]
  };
}
