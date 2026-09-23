function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const executionClusters = [
  {
    cluster: "E-mails & boîte de réception",
    pillar: "Automatiser les e-mails avec l’IA",
    topics: [
      "Automatiser Gmail avec l’IA et classer les messages par priorité",
      "Connecter Gmail à Google Drive pour ranger automatiquement les pièces jointes",
      "Créer des brouillons de réponse IA à partir des e-mails entrants",
      "Détecter automatiquement les e-mails urgents et prévenir la bonne personne",
      "Transformer les e-mails clients en tâches dans un outil de gestion de projet",
      "Extraire automatiquement les informations clés d’un e-mail et les envoyer dans un CRM",
      "Résumer chaque matin les e-mails importants reçus la veille",
      "Identifier les demandes commerciales dans Gmail et créer une fiche prospect",
      "Automatiser les relances d’e-mails sans perdre le contrôle humain",
      "Créer un assistant IA qui recherche dans Gmail avant de préparer une réponse"
    ]
  },
  {
    cluster: "Google Drive & documents",
    pillar: "Automatiser Google Drive avec l’IA",
    topics: [
      "Créer un assistant IA connecté à Google Drive pour retrouver une information",
      "Classer automatiquement les nouveaux fichiers Google Drive avec l’IA",
      "Renommer automatiquement les documents selon leur contenu",
      "Résumer automatiquement les PDF déposés dans Google Drive",
      "Extraire les données de documents Google Drive vers Google Sheets",
      "Créer une base de connaissances IA à partir des dossiers Google Drive",
      "Détecter les doublons et documents obsolètes dans Google Drive",
      "Générer une fiche de synthèse à chaque nouveau document déposé",
      "Comparer automatiquement deux versions d’un contrat stocké dans Drive",
      "Créer une veille documentaire à partir d’un dossier partagé Google Drive"
    ]
  },
  {
    cluster: "Commercial & CRM",
    pillar: "Automatiser le commercial avec l’IA",
    topics: [
      "Préparer automatiquement un rendez-vous commercial avec l’IA",
      "Résumer un appel commercial et mettre à jour le CRM automatiquement",
      "Créer une proposition commerciale à partir des notes d’un rendez-vous",
      "Identifier les prochaines actions commerciales à partir du CRM",
      "Qualifier automatiquement les leads entrants avec l’IA",
      "Enrichir une fiche prospect avant un appel commercial",
      "Créer des relances commerciales personnalisées à partir de l’historique client",
      "Analyser les motifs de perte des opportunités commerciales",
      "Détecter les comptes clients à réactiver grâce à l’IA",
      "Créer un copilote commercial qui combine CRM, e-mails et documents"
    ]
  },
  {
    cluster: "Marketing & contenu",
    pillar: "Automatiser le marketing avec l’IA",
    topics: [
      "Transformer un webinar en articles, posts et e-mails automatiquement",
      "Créer un calendrier éditorial IA à partir des priorités commerciales",
      "Recycler un contenu long en plusieurs formats avec l’IA",
      "Analyser les avis clients pour identifier les angles marketing",
      "Créer automatiquement des briefs SEO à partir d’un sujet métier",
      "Transformer les questions commerciales en idées de contenus",
      "Créer des variantes de landing pages adaptées à plusieurs intentions",
      "Résumer la veille concurrentielle et détecter les changements importants",
      "Préparer des campagnes e-mail à partir des segments CRM",
      "Construire une bibliothèque de preuves marketing à partir des documents internes"
    ]
  },
  {
    cluster: "Support client",
    pillar: "Automatiser le support client avec l’IA",
    topics: [
      "Trier automatiquement les demandes support selon leur urgence",
      "Créer des brouillons de réponse support à partir de la base de connaissances",
      "Détecter les sujets récurrents dans les tickets clients",
      "Transformer les tickets résolus en articles de FAQ",
      "Créer un assistant support qui cite les procédures internes",
      "Escalader automatiquement les demandes sensibles vers un humain",
      "Résumer l’historique d’un client avant de répondre à un ticket",
      "Détecter les signaux d’insatisfaction dans les messages clients",
      "Créer un rapport hebdomadaire automatique des motifs de contact",
      "Identifier les articles de documentation manquants à partir des tickets"
    ]
  },
  {
    cluster: "RH & recrutement",
    pillar: "Automatiser les RH avec l’IA",
    topics: [
      "Transformer une fiche de poste en grille d’entretien structurée",
      "Résumer des candidatures sans automatiser la décision de recrutement",
      "Préparer un entretien à partir du CV et de la fiche de poste",
      "Créer un parcours d’onboarding personnalisé à partir du poste",
      "Créer un assistant RH connecté aux procédures internes",
      "Transformer les questions récurrentes des salariés en FAQ interne",
      "Préparer des comptes rendus d’entretien à partir de notes",
      "Cartographier les compétences d’une équipe à partir de données déclaratives",
      "Identifier les besoins de formation à partir des entretiens annuels",
      "Créer des brouillons de communications RH adaptés à plusieurs publics"
    ]
  },
  {
    cluster: "Finance & comptabilité",
    pillar: "Automatiser la finance avec l’IA",
    topics: [
      "Extraire automatiquement les données clés des factures reçues par e-mail",
      "Classer les pièces comptables dans Google Drive automatiquement",
      "Créer un contrôle de cohérence avant saisie comptable",
      "Résumer les écarts entre budget et réalisé avec l’IA",
      "Préparer un commentaire de gestion à partir d’un tableau financier",
      "Automatiser la collecte des justificatifs manquants",
      "Détecter les factures potentiellement en double avant validation",
      "Créer une synthèse mensuelle de trésorerie à partir des données disponibles",
      "Transformer un export comptable en rapport lisible pour un dirigeant",
      "Préparer une checklist de clôture mensuelle pilotée par l’IA"
    ]
  },
  {
    cluster: "Administration & opérations",
    pillar: "Automatiser l’administratif avec l’IA",
    topics: [
      "Transformer les e-mails entrants en dossiers administratifs structurés",
      "Créer automatiquement une fiche dossier à partir de plusieurs documents",
      "Générer des courriers à partir de modèles et de données internes",
      "Créer des checklists dynamiques selon le type de dossier",
      "Relancer automatiquement les pièces manquantes avec validation humaine",
      "Centraliser les demandes reçues par e-mail dans un tableau de suivi",
      "Extraire des données de formulaires PDF vers un outil métier",
      "Créer une synthèse automatique d’un dossier avant traitement",
      "Détecter les dossiers incomplets avant leur transmission",
      "Créer un assistant administratif connecté aux modèles de l’entreprise"
    ]
  },
  {
    cluster: "Réunions & gestion de projet",
    pillar: "Automatiser les réunions avec l’IA",
    topics: [
      "Transformer une réunion en compte rendu et plan d’action automatiquement",
      "Créer les tâches d’un projet à partir d’un compte rendu de réunion",
      "Suivre automatiquement les décisions prises en réunion",
      "Préparer l’ordre du jour à partir des actions encore ouvertes",
      "Créer un briefing de réunion à partir des e-mails et documents du projet",
      "Détecter les blocages d’un projet dans les comptes rendus",
      "Résumer l’avancement de plusieurs projets pour un comité de direction",
      "Créer une mémoire de projet interrogeable avec l’IA",
      "Comparer les décisions annoncées et les actions réellement clôturées",
      "Générer automatiquement une synthèse hebdomadaire de projet"
    ]
  },
  {
    cluster: "Achats & fournisseurs",
    pillar: "Automatiser les achats avec l’IA",
    topics: [
      "Comparer des offres fournisseurs avec une grille de critères",
      "Extraire les informations clés de devis fournisseurs",
      "Créer une synthèse de consultation fournisseurs",
      "Détecter les écarts entre un devis et un cahier des charges",
      "Préparer les questions à poser à un fournisseur avant sélection",
      "Classer automatiquement les documents fournisseurs",
      "Créer une fiche fournisseur à partir des e-mails et documents reçus",
      "Résumer les changements de prix entre plusieurs propositions",
      "Suivre automatiquement les pièces administratives fournisseurs",
      "Créer un assistant achats connecté aux contrats et procédures internes"
    ]
  },
  {
    cluster: "Juridique & conformité",
    pillar: "Automatiser le travail documentaire juridique avec l’IA",
    topics: [
      "Comparer deux versions d’un contrat avec l’IA",
      "Extraire automatiquement les clauses clés d’un contrat",
      "Créer une fiche de synthèse contractuelle sans remplacer la validation juridique",
      "Repérer les champs manquants dans un modèle de contrat",
      "Créer une bibliothèque de clauses interrogeable avec l’IA",
      "Transformer une politique interne en FAQ pour les collaborateurs",
      "Suivre les dates et obligations extraites de documents contractuels",
      "Préparer une revue de contrat en comparant au modèle interne",
      "Créer un assistant de conformité qui cite les procédures de l’entreprise",
      "Résumer les changements d’une politique interne entre deux versions"
    ]
  },
  {
    cluster: "BTP & chantier",
    pillar: "Automatiser le suivi de chantier avec l’IA",
    topics: [
      "Transformer des notes de réunion de chantier en compte rendu structuré",
      "Extraire les réserves d’un compte rendu et créer un tableau de suivi",
      "Classer automatiquement les photos de chantier avec leurs commentaires",
      "Créer un résumé hebdomadaire d’avancement à partir des comptes rendus",
      "Détecter les actions en retard dans les comptes rendus de chantier",
      "Comparer un compte rendu de chantier à celui de la semaine précédente",
      "Créer des brouillons de relance aux entreprises à partir des réserves ouvertes",
      "Centraliser les documents chantier reçus par e-mail dans Google Drive",
      "Créer une mémoire de chantier interrogeable en langage naturel",
      "Préparer une réunion de chantier à partir des actions non clôturées"
    ]
  },
  {
    cluster: "Immobilier & gestion de biens",
    pillar: "Automatiser la gestion immobilière avec l’IA",
    topics: [
      "Trier automatiquement les demandes de locataires reçues par e-mail",
      "Créer une fiche intervention à partir d’un message locataire",
      "Résumer l’historique d’un logement avant une intervention",
      "Classer les états des lieux et pièces associées dans Drive",
      "Extraire les anomalies d’un état des lieux vers un tableau de suivi",
      "Créer des brouillons de réponse aux demandes locatives",
      "Suivre automatiquement les pièces manquantes d’un dossier immobilier",
      "Créer une base de connaissances des procédures de gestion locative",
      "Résumer les échanges avec un prestataire avant une relance",
      "Créer une synthèse mensuelle des incidents techniques par immeuble"
    ]
  },
  {
    cluster: "Retail & e-commerce",
    pillar: "Automatiser le retail avec l’IA",
    topics: [
      "Analyser automatiquement les avis clients d’un e-commerce",
      "Créer des fiches produit à partir des données fournisseurs",
      "Détecter les questions produit récurrentes dans le support",
      "Préparer des réponses personnalisées aux demandes avant achat",
      "Créer une veille automatique des prix concurrents à partir de sources autorisées",
      "Résumer les retours produits pour identifier les causes principales",
      "Générer des descriptions cohérentes à partir d’un catalogue structuré",
      "Créer un assistant interne pour retrouver les informations produit",
      "Transformer les données de vente en synthèse quotidienne pour le magasin",
      "Identifier les anomalies de catalogue avant publication"
    ]
  },
  {
    cluster: "Logistique & supply chain",
    pillar: "Automatiser la logistique avec l’IA",
    topics: [
      "Trier les e-mails transporteurs et extraire les incidents logistiques",
      "Créer automatiquement une fiche incident à partir d’un e-mail",
      "Résumer les retards de livraison pour une équipe opérationnelle",
      "Extraire les données de bons de livraison vers un tableau de suivi",
      "Créer un assistant connecté aux procédures logistiques internes",
      "Préparer un briefing quotidien à partir des incidents ouverts",
      "Analyser les causes récurrentes de retard à partir des historiques",
      "Comparer automatiquement commande, livraison et facture",
      "Centraliser les documents transport reçus par e-mail dans Drive",
      "Créer une synthèse fournisseur à partir des incidents et délais observés"
    ]
  },
  {
    cluster: "Direction & management",
    pillar: "Créer un copilote de direction avec l’IA",
    topics: [
      "Créer un briefing quotidien de dirigeant à partir des informations internes",
      "Résumer plusieurs rapports pour préparer un comité de direction",
      "Transformer des données d’activité en note de synthèse managériale",
      "Préparer des questions de décision à partir d’un dossier complexe",
      "Créer une mémoire des décisions prises par le comité de direction",
      "Comparer plusieurs scénarios stratégiques avec une grille explicite",
      "Créer un assistant qui retrouve les décisions et documents de référence",
      "Préparer une revue mensuelle d’activité à partir de plusieurs sources",
      "Identifier les sujets récurrents dans les comptes rendus de management",
      "Créer une synthèse des risques déclarés par plusieurs équipes"
    ]
  },
  {
    cluster: "Data & reporting",
    pillar: "Automatiser le reporting avec l’IA",
    topics: [
      "Créer un rapport narratif à partir d’un Google Sheet",
      "Expliquer automatiquement les variations inhabituelles d’un tableau de bord",
      "Transformer plusieurs exports CSV en synthèse lisible",
      "Créer un commentaire automatique de KPI sans inventer les causes",
      "Préparer une revue de performance à partir de données structurées",
      "Détecter les valeurs manquantes ou incohérentes avant reporting",
      "Générer une synthèse hebdomadaire à partir de plusieurs tableaux",
      "Créer une interface conversationnelle pour interroger un fichier de données",
      "Transformer des réponses de questionnaire en thèmes et verbatims",
      "Créer un rapport de direction à partir d’indicateurs et commentaires métiers"
    ]
  },
  {
    cluster: "IT, helpdesk & sécurité",
    pillar: "Automatiser le support IT avec l’IA",
    topics: [
      "Trier automatiquement les tickets IT selon leur nature",
      "Créer des brouillons de réponse à partir de la documentation interne",
      "Transformer les tickets résolus en documentation technique",
      "Créer un assistant helpdesk qui cite les procédures internes",
      "Résumer un incident IT avant escalade",
      "Détecter les problèmes récurrents dans l’historique des tickets",
      "Préparer une checklist de diagnostic selon le type d’incident",
      "Créer un briefing d’incident à partir de plusieurs messages techniques",
      "Classer automatiquement les demandes d’accès pour validation humaine",
      "Créer une veille des changements de documentation IT interne"
    ]
  },
  {
    cluster: "Conseil & services professionnels",
    pillar: "Automatiser la production de missions avec l’IA",
    topics: [
      "Transformer un entretien client en brief de mission",
      "Créer une première structure de livrable à partir d’un cadrage",
      "Comparer les notes de plusieurs entretiens pour détecter les thèmes communs",
      "Créer une base de connaissances à partir des livrables passés",
      "Préparer un atelier client à partir de documents internes",
      "Transformer des verbatims en enseignements structurés",
      "Créer une synthèse exécutive à partir d’un rapport long",
      "Préparer une proposition de mission à partir d’un besoin qualifié",
      "Créer un assistant qui retrouve les méthodes et modèles internes",
      "Automatiser le suivi des actions après un atelier client"
    ]
  },
  {
    cluster: "Knowledge management & recherche interne",
    pillar: "Créer une mémoire d’entreprise avec l’IA",
    topics: [
      "Créer un moteur de recherche IA sur les documents internes",
      "Créer un assistant qui cite ses sources dans la documentation d’entreprise",
      "Connecter l’IA aux procédures, contrats et comptes rendus internes",
      "Créer une base de connaissances à partir de Google Drive et Notion",
      "Retrouver automatiquement les décisions passées dans les comptes rendus",
      "Créer une FAQ interne dynamique à partir des documents existants",
      "Détecter les documents contradictoires dans une base de connaissances",
      "Identifier les informations obsolètes avant de les exposer à un assistant IA",
      "Créer un onboarding assisté par IA à partir de la documentation interne",
      "Construire un RAG no-code sur une base documentaire d’entreprise"
    ]
  }
];

const trainingClusters = [
  {
    cluster: "Direction",
    pillar: "Formation IA pour dirigeants",
    topics: [
      "Former un dirigeant à identifier les cas d’usage IA réellement prioritaires",
      "Apprendre à un comité de direction à décider où investir dans l’IA",
      "Former la direction à distinguer automatisation, copilote et agent IA",
      "Apprendre à cadrer une feuille de route IA sans être technique",
      "Former les dirigeants aux risques de données liés aux IA génératives",
      "Apprendre à challenger un projet IA avant de le financer",
      "Former un dirigeant à lire un business case IA avec esprit critique",
      "Apprendre à construire une gouvernance IA adaptée à l’entreprise",
      "Former un CODIR à piloter l’adoption de l’IA",
      "Apprendre à mesurer un projet IA sans inventer de ROI"
    ]
  },
  {
    cluster: "Managers",
    pillar: "Formation IA pour managers",
    topics: [
      "Former les managers à utiliser l’IA sans perdre le contrôle du travail",
      "Apprendre à un manager à créer des briefs de meilleure qualité avec l’IA",
      "Former les managers à revoir et valider un travail produit avec l’IA",
      "Apprendre à préparer des réunions et comptes rendus avec l’IA",
      "Former les managers à identifier les tâches automatisables de leur équipe",
      "Apprendre à construire des règles d’usage IA dans une équipe",
      "Former les managers à détecter les mauvaises automatisations",
      "Apprendre à transformer un processus d’équipe en workflow IA",
      "Former les managers à accompagner les collaborateurs réticents à l’IA",
      "Apprendre à mesurer l’adoption de l’IA dans une équipe"
    ]
  },
  {
    cluster: "Commercial",
    pillar: "Formation IA pour commerciaux",
    topics: [
      "Former les commerciaux à préparer un rendez-vous avec l’IA",
      "Apprendre à rédiger des relances commerciales personnalisées avec l’IA",
      "Former une équipe commerciale à résumer et exploiter ses appels",
      "Apprendre à créer une proposition commerciale avec l’IA sans la rendre générique",
      "Former les commerciaux à utiliser le CRM avec un copilote IA",
      "Apprendre à rechercher un compte prospect avec l’IA",
      "Former les commerciaux à détecter les informations manquantes avant une offre",
      "Apprendre à créer des séquences de suivi assistées par IA",
      "Former les commerciaux à utiliser l’IA pour préparer une négociation",
      "Apprendre à analyser les motifs de perte avec l’IA"
    ]
  },
  {
    cluster: "Marketing",
    pillar: "Formation IA pour marketing",
    topics: [
      "Former le marketing à transformer un contenu long en plusieurs formats",
      "Apprendre à créer des briefs SEO avec l’IA",
      "Former les équipes marketing à produire sans uniformiser la marque",
      "Apprendre à analyser les verbatims clients avec l’IA",
      "Former le marketing à construire un calendrier éditorial assisté par IA",
      "Apprendre à créer des landing pages avec l’IA et une vraie intention",
      "Former les équipes à utiliser l’IA pour la veille concurrentielle",
      "Apprendre à décliner une campagne sans créer du contenu dupliqué",
      "Former le marketing à vérifier les faits générés par l’IA",
      "Apprendre à connecter contenus, CRM et automatisation no-code"
    ]
  },
  {
    cluster: "RH",
    pillar: "Formation IA pour RH",
    topics: [
      "Former les RH à utiliser l’IA pour préparer des entretiens",
      "Apprendre à créer des grilles d’entretien structurées avec l’IA",
      "Former les RH à produire des communications internes avec l’IA",
      "Apprendre à créer un parcours d’onboarding assisté par IA",
      "Former les RH aux risques de biais dans les usages IA",
      "Apprendre à synthétiser les entretiens annuels avec contrôle humain",
      "Former les RH à construire une FAQ interne assistée par IA",
      "Apprendre à cartographier les compétences avec l’IA sans automatiser les décisions",
      "Former les RH à identifier les besoins de formation IA",
      "Apprendre à encadrer les usages IA des recruteurs"
    ]
  },
  {
    cluster: "Finance & administratif",
    pillar: "Formation IA pour fonctions support",
    topics: [
      "Former une équipe administrative à traiter des e-mails avec l’IA",
      "Apprendre à extraire les données d’un document avec l’IA",
      "Former la finance à commenter un tableau sans inventer les causes",
      "Apprendre à créer des synthèses de gestion avec l’IA",
      "Former les fonctions support à automatiser les tâches répétitives",
      "Apprendre à contrôler un résultat produit par une IA",
      "Former l’administratif à construire des modèles de courriers IA",
      "Apprendre à automatiser la collecte de pièces avec du no-code",
      "Former la finance à créer des rapports lisibles pour les métiers",
      "Apprendre à utiliser l’IA avec des données sensibles sans les exposer"
    ]
  },
  {
    cluster: "Juridique & conformité",
    pillar: "Formation IA pour juridique et conformité",
    topics: [
      "Former les juristes à comparer des contrats avec l’IA",
      "Apprendre à extraire les clauses clés d’un contrat avec l’IA",
      "Former le juridique à créer une base de connaissances assistée par IA",
      "Apprendre à vérifier une synthèse juridique générée par IA",
      "Former les équipes conformité aux usages acceptables de l’IA",
      "Apprendre à construire une politique interne d’usage des IA génératives",
      "Former le juridique à distinguer assistance documentaire et conseil automatisé",
      "Apprendre à intégrer une validation humaine dans un workflow IA",
      "Former les équipes à documenter les décisions liées aux systèmes IA",
      "Apprendre à sensibiliser les métiers aux risques d’une IA générative"
    ]
  },
  {
    cluster: "Projet & opérations",
    pillar: "Formation IA pour chefs de projet",
    topics: [
      "Former les chefs de projet à préparer un plan d’action avec l’IA",
      "Apprendre à transformer une réunion en tâches structurées",
      "Former les PM à créer une mémoire de projet avec l’IA",
      "Apprendre à résumer plusieurs sources avant une décision projet",
      "Former les équipes projet à détecter les actions en retard",
      "Apprendre à créer un reporting projet assisté par IA",
      "Former un PM à rédiger un brief technique avec l’aide de l’IA",
      "Apprendre à préparer un comité projet avec un copilote IA",
      "Former les opérations à automatiser les handoffs entre équipes",
      "Apprendre à cartographier un processus avant de l’automatiser"
    ]
  },
  {
    cluster: "Service client",
    pillar: "Formation IA pour support client",
    topics: [
      "Former le support à créer des brouillons de réponse avec l’IA",
      "Apprendre à utiliser une base de connaissances avec un assistant IA",
      "Former les équipes à repérer les réponses IA qui nécessitent une validation",
      "Apprendre à catégoriser les tickets avec l’IA",
      "Former le support à transformer les tickets en documentation",
      "Apprendre à résumer un historique client avant de répondre",
      "Former les équipes à détecter les signaux d’insatisfaction",
      "Apprendre à concevoir une escalade humaine dans un workflow IA",
      "Former le support à mesurer la qualité d’un assistant IA",
      "Apprendre à maintenir une FAQ alimentée par les problèmes réels"
    ]
  },
  {
    cluster: "Achats",
    pillar: "Formation IA pour achats",
    topics: [
      "Former les achats à comparer plusieurs offres avec l’IA",
      "Apprendre à extraire les données de devis fournisseurs",
      "Former les acheteurs à préparer une négociation avec l’IA",
      "Apprendre à créer une grille de comparaison explicite",
      "Former les achats à résumer les contrats et pièces fournisseurs",
      "Apprendre à préparer les questions à poser avant sélection",
      "Former les achats à créer une veille fournisseur assistée par IA",
      "Apprendre à construire une base documentaire fournisseurs",
      "Former les acheteurs à vérifier les synthèses générées par IA",
      "Apprendre à automatiser le suivi des pièces administratives"
    ]
  },
  {
    cluster: "Microsoft Copilot",
    pillar: "Formation Microsoft Copilot",
    topics: [
      "Former une équipe à utiliser Copilot dans Outlook pour gérer les e-mails",
      "Apprendre à utiliser Copilot dans Word sur des documents professionnels",
      "Former les équipes à utiliser Copilot dans PowerPoint sans produire des présentations génériques",
      "Apprendre à utiliser Copilot dans Excel pour analyser un tableau",
      "Former les managers à utiliser Copilot dans Teams",
      "Apprendre à préparer une réunion avec Microsoft Copilot",
      "Former les fonctions support à intégrer Copilot dans leurs routines",
      "Apprendre à écrire de meilleurs prompts dans Microsoft 365 Copilot",
      "Former les équipes aux limites et règles d’usage de Copilot",
      "Construire un plan d’adoption Copilot par métier"
    ]
  },
  {
    cluster: "ChatGPT",
    pillar: "Formation ChatGPT entreprise",
    topics: [
      "Former une équipe à utiliser ChatGPT comme copilote de travail",
      "Apprendre à rechercher et synthétiser avec ChatGPT sans perdre les sources",
      "Former les équipes à rédiger avec ChatGPT sans uniformiser leur style",
      "Apprendre à analyser des documents avec ChatGPT",
      "Former les managers à créer des méthodes réutilisables dans ChatGPT",
      "Apprendre à construire un GPT ou assistant interne selon les fonctions disponibles",
      "Former les équipes à vérifier les réponses produites par ChatGPT",
      "Apprendre à protéger les données lors de l’usage de ChatGPT",
      "Former les métiers à passer d’un prompt ponctuel à un workflow",
      "Apprendre à créer une bibliothèque de prompts d’entreprise maintenable"
    ]
  },
  {
    cluster: "Prompt engineering",
    pillar: "Formation prompt engineering",
    topics: [
      "Apprendre à écrire un prompt avec objectif, contexte et contraintes",
      "Former les équipes aux prompts réutilisables plutôt qu’aux recettes magiques",
      "Apprendre à utiliser des exemples pour améliorer une réponse IA",
      "Former les équipes à définir des critères de qualité dans un prompt",
      "Apprendre à demander une sortie structurée à une IA",
      "Former les métiers à décomposer une tâche complexe en plusieurs prompts",
      "Apprendre à itérer sur un prompt de façon reproductible",
      "Former les équipes à construire des templates de prompts métier",
      "Apprendre à évaluer un résultat plutôt qu’à faire confiance au ton de l’IA",
      "Former les équipes à documenter leurs meilleurs prompts"
    ]
  },
  {
    cluster: "Agents IA",
    pillar: "Formation agents IA",
    topics: [
      "Former une équipe à comprendre ce qu’est réellement un agent IA",
      "Apprendre à choisir entre workflow classique et agent IA",
      "Former les équipes au concept d’outils et permissions d’un agent",
      "Apprendre à concevoir un agent avec validation humaine",
      "Former les métiers aux risques d’un agent qui peut agir",
      "Apprendre à tester les cas d’échec d’un agent IA",
      "Former les équipes à définir le niveau d’autonomie acceptable",
      "Apprendre à cartographier un processus avant de créer un agent",
      "Former les managers à superviser des workflows agentiques",
      "Apprendre à mesurer la qualité et la fiabilité d’un agent IA"
    ]
  },
  {
    cluster: "Automatisation no-code",
    pillar: "Formation automatisation IA no-code",
    topics: [
      "Apprendre à automatiser Gmail et Google Drive avec l’IA sans coder",
      "Former une équipe à créer son premier workflow n8n ou Make",
      "Apprendre à connecter formulaire, e-mail et IA dans un workflow",
      "Former les métiers à distinguer trigger, action et condition",
      "Apprendre à ajouter une étape LLM dans une automatisation no-code",
      "Former les équipes à créer un workflow avec validation humaine",
      "Apprendre à gérer les erreurs dans une automatisation IA",
      "Former les équipes à documenter leurs workflows no-code",
      "Apprendre à sécuriser les connexions et permissions d’une automatisation",
      "Former les métiers à mesurer si une automatisation vaut la peine"
    ]
  },
  {
    cluster: "Gouvernance & AI Act",
    pillar: "Formation gouvernance IA et AI Act",
    topics: [
      "Former les collaborateurs à l’AI literacy en entreprise",
      "Apprendre aux équipes à identifier un usage IA à risque",
      "Former les managers aux règles internes d’utilisation de l’IA",
      "Apprendre à documenter les outils IA utilisés par les équipes",
      "Former les métiers aux principes de supervision humaine",
      "Apprendre à traiter les données personnelles dans un contexte IA",
      "Former les équipes achats à questionner un fournisseur IA",
      "Apprendre à construire une procédure d’approbation d’un nouvel outil IA",
      "Former les responsables métier aux responsabilités liées aux usages IA",
      "Créer une sensibilisation AI Act adaptée aux cas d’usage de l’entreprise"
    ]
  },
  {
    cluster: "Analyse de données",
    pillar: "Formation IA pour analyser des données",
    topics: [
      "Apprendre à analyser un fichier Excel avec une IA",
      "Former les équipes à poser de bonnes questions à leurs données",
      "Apprendre à produire une synthèse de KPI avec l’IA",
      "Former les métiers à détecter les erreurs d’interprétation",
      "Apprendre à nettoyer un petit jeu de données avec assistance IA",
      "Former les équipes à créer des graphiques à partir d’un besoin métier",
      "Apprendre à commenter une variation sans inventer sa cause",
      "Former les managers à utiliser l’IA pour lire un tableau de bord",
      "Apprendre à transformer un questionnaire en thèmes et insights",
      "Former les équipes à documenter leurs analyses assistées par IA"
    ]
  },
  {
    cluster: "Création de contenu",
    pillar: "Formation création de contenu avec l’IA",
    topics: [
      "Former une équipe à créer du contenu sans perdre la voix de marque",
      "Apprendre à transformer un contenu source en plusieurs formats",
      "Former les équipes à créer des briefs éditoriaux avec l’IA",
      "Apprendre à produire une première version puis la réviser humainement",
      "Former les équipes à vérifier les faits dans un contenu IA",
      "Apprendre à construire une chaîne de production éditoriale assistée",
      "Former le marketing à créer des variantes sans contenu dupliqué",
      "Apprendre à utiliser l’IA pour préparer des scripts vidéo",
      "Former les équipes à créer des FAQ à partir des questions clients",
      "Apprendre à intégrer SEO et utilité dans un contenu généré avec l’IA"
    ]
  },
  {
    cluster: "Knowledge management",
    pillar: "Formation IA et connaissance interne",
    topics: [
      "Former une équipe à créer une base de connaissances exploitable par l’IA",
      "Apprendre à préparer les documents avant de construire un RAG",
      "Former les métiers à poser des questions à une documentation interne",
      "Apprendre à exiger des citations de sources dans un assistant interne",
      "Former les équipes à repérer les documents obsolètes",
      "Apprendre à structurer une FAQ interne avec l’IA",
      "Former les documentalistes à préparer une base pour la recherche sémantique",
      "Apprendre à construire une mémoire de projet interrogeable",
      "Former les équipes à gouverner les droits d’accès d’un assistant documentaire",
      "Apprendre à évaluer si une réponse est bien ancrée dans les sources"
    ]
  },
  {
    cluster: "Adoption & conduite du changement",
    pillar: "Formation adoption IA",
    topics: [
      "Former des ambassadeurs IA internes",
      "Apprendre à animer une communauté de pratique IA",
      "Former les managers à accompagner l’adoption sans imposer l’outil",
      "Apprendre à choisir les premiers cas d’usage à déployer",
      "Former les équipes à partager leurs méthodes IA réutilisables",
      "Apprendre à mesurer l’adoption sans confondre usage et valeur",
      "Former les équipes à remonter les risques et incidents IA",
      "Apprendre à organiser des ateliers de découverte de cas d’usage",
      "Former des référents métier à challenger les automatisations",
      "Construire un programme de montée en compétences IA sur plusieurs mois"
    ]
  }
];

function flatten(clusters, type) {
  return clusters.flatMap((group) =>
    group.topics.map((title) => ({
      type,
      cluster: group.cluster,
      clusterSlug: slugify(group.cluster),
      pillar: group.pillar,
      title,
      slug: slugify(title),
      status: "backlog",
      minWords: 2000
    }))
  );
}

function buildPillars(clusters, type) {
  return clusters.map((group) => ({
    type,
    cluster: group.cluster,
    slug: slugify(group.cluster),
    title: group.pillar,
    topics: group.topics.map((title) => ({
      title,
      slug: slugify(title)
    }))
  }));
}

export const executionBacklog = flatten(executionClusters, "execution-use-case");
export const trainingBacklog = flatten(trainingClusters, "training-use-case");

export const executionPillars = buildPillars(executionClusters, "execution-pillar");
export const trainingPillars = buildPillars(trainingClusters, "training-pillar");

export function getExecutionPillar(slug) {
  return executionPillars.find((pillar) => pillar.slug === slug) || null;
}

export function getTrainingPillar(slug) {
  return trainingPillars.find((pillar) => pillar.slug === slug) || null;
}

export const editorialInventory = [...executionBacklog, ...trainingBacklog];

export const editorialCounts = {
  execution: executionBacklog.length,
  training: trainingBacklog.length,
  total: editorialInventory.length
};
