import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "support",
    "Support client",
    "Créer un assistant support qui cite les procédures internes",
    "aider les agents à répondre plus vite en retrouvant la bonne procédure sans masquer la source utilisée",
    "une réponse proposée avec extraits cités, liens vers les procédures et signalement explicite lorsqu’aucune source suffisante n’est trouvée",
    "retrouver les passages utiles dans la base documentaire et formuler un brouillon strictement à partir des sources autorisées",
    "filtrer les documents selon les droits, citer chaque réponse et imposer une validation humaine avant envoi au client",
    "connecter une base de connaissances limitée à un type de demandes fréquentes et comparer les réponses à celles des agents expérimentés",
    "les agents connaissent globalement les procédures mais passent du temps à rechercher le bon document, la bonne version et le passage qui répond précisément au client"
  ],
  [
    "knowledge",
    "Immobilier & gestion de biens",
    "Créer une base de connaissances des procédures de gestion locative",
    "rendre les procédures de gestion plus faciles à retrouver sans transformer des documents internes en réponses non sourcées",
    "une recherche conversationnelle avec réponse courte, citation, lien vers la procédure et date de la source",
    "retrouver les passages pertinents selon la question du gestionnaire et synthétiser uniquement ce qui est documenté",
    "respecter les droits, privilégier les procédures validées, afficher les versions et refuser de répondre lorsque la source est absente",
    "indexer les procédures d’un seul périmètre de gestion et tester cinquante questions réelles avant extension",
    "les gestionnaires disposent de procédures sur Drive, SharePoint ou un intranet mais continuent à demander autour d’eux où trouver la bonne règle"
  ],
  [
    "admin",
    "Immobilier & gestion de biens",
    "Résumer les échanges avec un prestataire avant une relance",
    "reconstruire rapidement le contexte d’un échange long avant d’appeler ou relancer un prestataire",
    "une synthèse datée avec demandes envoyées, réponses reçues, engagements explicites, pièces citées et points encore ouverts",
    "ordonner les messages et documents, repérer les engagements formulés et extraire les éléments qui restent sans réponse",
    "ne pas transformer une formulation vague en engagement certain et conserver les liens vers les messages d’origine",
    "résumer un fil d’e-mails prestataire sur une seule intervention et faire valider la synthèse par le gestionnaire",
    "avant une relance, le gestionnaire relit parfois plusieurs semaines d’e-mails pour savoir ce qui a été demandé, promis et réellement réalisé"
  ],
  [
    "reporting",
    "Immobilier & gestion de biens",
    "Créer une synthèse mensuelle des incidents techniques par immeuble",
    "donner une vue exploitable des incidents récurrents sans perdre le lien avec les tickets et interventions d’origine",
    "un rapport par immeuble avec volumes, catégories, incidents ouverts, récurrences observées et liens vers les dossiers sources",
    "regrouper les incidents par thème, période et bâtiment puis reformuler les tendances observables en synthèse lisible",
    "calculer les volumes hors du modèle, distinguer faits et interprétations et ne pas inventer la cause d’une récurrence",
    "produire une synthèse sur un mois et quelques immeubles à partir d’un tableau d’incidents déjà structuré",
    "les équipes disposent des incidents un par un mais manquent d’une vue synthétique pour repérer qu’un même équipement ou un même immeuble génère des demandes répétées"
  ],
  [
    "support",
    "Immobilier & gestion de biens",
    "Créer des brouillons de réponse aux demandes locatives",
    "préparer des réponses cohérentes aux demandes courantes tout en laissant le gestionnaire décider de l’envoi",
    "un brouillon contextualisé avec résumé de la demande, informations utilisées et éléments nécessitant une validation",
    "comprendre la demande du locataire, retrouver les informations autorisées et préparer une réponse dans le ton défini",
    "ne jamais promettre une intervention, un délai ou une prise en charge qui n’est pas confirmée dans le dossier",
    "préparer des brouillons sur trois catégories de demandes fréquentes sans aucun envoi automatique",
    "une grande partie du temps de gestion est consacrée à reformuler des réponses proches alors que les règles et informations existent déjà"
  ],
  [
    "support",
    "Retail & e-commerce",
    "Détecter les questions produit récurrentes dans le support",
    "transformer les demandes clients répétitives en information exploitable pour le catalogue, la FAQ et les équipes produit",
    "un classement des questions par produit et thème avec fréquence, exemples de verbatims et liens vers les tickets sources",
    "regrouper les formulations proches et identifier les questions qui reviennent malgré des mots différents",
    "calculer les fréquences sur les données sources, conserver des verbatims représentatifs et faire valider les regroupements ambigus",
    "analyser un mois de tickets sur une catégorie de produits et produire dix thèmes récurrents à vérifier",
    "les mêmes questions arrivent au support sous des formulations différentes sans qu’une équipe ne voie clairement lesquelles devraient être traitées dans la fiche produit ou la documentation"
  ],
  [
    "reporting",
    "Retail & e-commerce",
    "Transformer les données de vente en synthèse quotidienne pour le magasin",
    "donner chaque matin une lecture rapide de l’activité sans demander au responsable de parcourir plusieurs exports",
    "une note courte avec ventes, évolutions calculées, ruptures ou anomalies disponibles et questions nécessitant une investigation",
    "hiérarchiser les données déjà calculées et produire une synthèse compréhensible pour le responsable de magasin",
    "calculer les KPI avant l’étape IA, comparer à des périodes explicites et ne jamais inventer la cause d’une variation",
    "générer une synthèse quotidienne sur un seul magasin à partir d’un export standardisé",
    "les données existent déjà dans plusieurs tableaux mais le responsable doit encore les parcourir pour comprendre ce qui mérite son attention aujourd’hui"
  ],
  [
    "admin",
    "Retail & e-commerce",
    "Identifier les anomalies de catalogue avant publication",
    "repérer les fiches incomplètes ou incohérentes avant qu’elles ne soient visibles aux clients",
    "une file de contrôle avec produit, champ concerné, anomalie détectée, valeur source et correction à valider",
    "détecter les incohérences de texte, attributs manquants et écarts entre les données fournisseur et les règles du catalogue",
    "appliquer d’abord les règles déterministes puis utiliser l’IA uniquement sur les incohérences sémantiques ou textuelles",
    "contrôler une catégorie de produits avec une liste fermée de règles et une revue humaine avant toute modification",
    "un catalogue grandit par imports successifs et certaines erreurs ne deviennent visibles qu’après publication : attribut manquant, texte incohérent ou donnée fournisseur mal normalisée"
  ],
  [
    "reporting",
    "Direction & management",
    "Créer une synthèse des risques déclarés par plusieurs équipes",
    "réunir les risques exprimés dans plusieurs reportings sans effacer les nuances ni inventer une probabilité",
    "une vue consolidée avec risque, équipe source, impact déclaré, échéance, actions existantes, doublons possibles et lien vers le reporting original",
    "rapprocher les formulations qui décrivent un même risque et produire une synthèse structurée des informations explicitement déclarées",
    "ne pas calculer un score de risque implicite, conserver la formulation source et laisser la priorisation finale au management",
    "consolider les reportings de quelques équipes sur une période et faire valider les regroupements avant comité",
    "chaque direction remonte ses risques dans son propre format et le comité passe du temps à rapprocher manuellement des sujets parfois identiques"
  ],
  [
    "admin",
    "Direction & management",
    "Préparer des questions de décision à partir d’un dossier complexe",
    "aider un décideur à identifier les informations manquantes et les arbitrages à clarifier avant une réunion",
    "une liste structurée de faits établis, inconnues, contradictions, hypothèses à vérifier et questions de décision",
    "résumer plusieurs documents et distinguer ce qui est documenté de ce qui manque encore pour prendre une décision",
    "ne jamais recommander automatiquement une décision politique, stratégique ou financière et conserver la source de chaque fait présenté",
    "travailler sur un seul dossier avec quelques documents de référence et faire relire les questions par le responsable du dossier",
    "un dossier important contient plusieurs notes, tableaux et échanges mais la difficulté réelle est de savoir quelles questions restent ouvertes avant de décider"
  ],
  [
    "support",
    "IT, helpdesk & sécurité",
    "Préparer une checklist de diagnostic selon le type d’incident",
    "aider le helpdesk à appliquer une méthode de diagnostic cohérente sans laisser l’IA exécuter des actions techniques risquées",
    "une checklist proposée avec informations à demander, vérifications autorisées et conditions d’escalade",
    "reconnaître la catégorie de l’incident et sélectionner les étapes de diagnostic documentées correspondant à cette catégorie",
    "ne proposer que des étapes issues des procédures approuvées et exiger une validation avant toute action modifiant un compte ou un système",
    "couvrir cinq catégories d’incidents fréquents avec des checklists validées par l’équipe IT",
    "les techniciens expérimentés savent quelles questions poser mais cette méthode est rarement explicite pour les nouveaux arrivants ou les périodes de forte charge"
  ],
  [
    "knowledge",
    "IT, helpdesk & sécurité",
    "Créer une veille des changements de documentation IT interne",
    "signaler les évolutions importantes de procédures techniques sans demander aux équipes de relire tous les documents",
    "une liste des documents modifiés avec résumé du changement, date, propriétaire, version et lien vers la source",
    "comparer les versions ou passages modifiés et résumer uniquement les différences observables",
    "utiliser les métadonnées de version, distinguer ajout suppression et reformulation et laisser un référent qualifier l’impact opérationnel",
    "surveiller un dossier documentaire limité et envoyer une synthèse hebdomadaire des modifications",
    "les procédures techniques évoluent mais les équipes apprennent parfois trop tard qu’une consigne, un accès ou une méthode a changé"
  ],
  [
    "support",
    "IT, helpdesk & sécurité",
    "Transformer les tickets résolus en documentation technique",
    "capitaliser sur les incidents réellement résolus pour enrichir la documentation sans publier automatiquement des solutions non validées",
    "un brouillon d’article technique avec symptôme, contexte, diagnostic, résolution, limites et liens vers les tickets sources",
    "repérer les étapes de résolution dans l’historique du ticket et les reformuler en procédure réutilisable",
    "ne publier qu’après validation d’un référent, retirer les données spécifiques au client ou à l’utilisateur et conserver la source interne",
    "transformer une sélection de tickets résolus récurrents en brouillons de documentation à valider",
    "des solutions utiles restent enfermées dans l’historique du helpdesk et sont redécouvertes plusieurs fois par des techniciens différents"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave21 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave21 = [];
