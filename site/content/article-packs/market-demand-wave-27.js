import { buildTrainingArticle } from "./training-article-factory.js";

const serviceSpecs = [
  {
    family: "service",
    cluster: "Service client",
    title: "Former le support à créer des brouillons de réponse avec l’IA",
    audience: "équipes support, service client et centres de contact",
    objective: "préparer plus vite des réponses contextualisées sans automatiser les engagements ni masquer les sources utilisées",
    workshop: "transformer plusieurs tickets en brouillons en utilisant historique, base de connaissances et règles de ton",
    deliverable: "une grille de rédaction avec sources autorisées, éléments à confirmer, ton, validation et règles d’escalade",
    assessment: "produire un brouillon sur un nouveau ticket en distinguant faits disponibles, réponse proposée et éléments nécessitant confirmation",
    transfer: "utiliser la grille sur une catégorie de demandes fréquentes avant d’élargir à d’autres motifs",
    guardrail: "aucune promesse, remise, délai ou décision client n’est généré s’il n’existe pas dans une source ou règle autorisée",
    example: "les agents rédigent de nombreuses réponses similaires mais doivent relire l’historique et les procédures pour éviter les contradictions"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Apprendre à utiliser une base de connaissances avec un assistant IA",
    audience: "support client, helpdesk et équipes knowledge management",
    objective: "retrouver des réponses dans des sources approuvées et apprendre à vérifier la citation avant de répondre",
    workshop: "poser une série de questions à un assistant connecté à une base de connaissances comportant versions, lacunes et documents proches",
    deliverable: "une méthode de recherche avec question, source citée, date, niveau de confiance et règle d’escalade",
    assessment: "traiter de nouvelles questions et refuser de répondre lorsque les sources disponibles ne suffisent pas",
    transfer: "utiliser la méthode pour évaluer les futurs assistants documentaires du support",
    guardrail: "une réponse sans source suffisante devient une demande de clarification ou une escalade, pas une réponse plausible inventée",
    example: "la base de connaissances contient la réponse mais les agents perdent du temps à chercher le bon article ou utilisent parfois une version obsolète"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Former les équipes à repérer les réponses IA qui nécessitent une validation",
    audience: "agents support, superviseurs et responsables qualité",
    objective: "identifier rapidement les situations où une réponse assistée par IA doit être relue, corrigée ou escaladée",
    workshop: "examiner des réponses contenant données manquantes, politique commerciale, ambiguïté, client mécontent et demandes hors procédure",
    deliverable: "une matrice de validation avec niveaux de risque et critères d’escalade",
    assessment: "classer une nouvelle série de réponses selon envoi possible, validation requise ou escalade",
    transfer: "intégrer la matrice aux workflows de brouillons et aux revues qualité",
    guardrail: "la confiance apparente du texte n’est jamais utilisée comme indicateur suffisant pour décider qu’une réponse peut partir sans contrôle",
    example: "certaines réponses sont triviales tandis que d’autres engagent la relation client, mais l’outil présente toutes ses suggestions avec le même ton assuré"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Apprendre à catégoriser les tickets avec l’IA",
    audience: "support client, centres de contact et responsables opérations",
    objective: "utiliser l’IA pour proposer une catégorie cohérente à partir du texte libre tout en gardant une taxonomie contrôlée",
    workshop: "classifier un lot de tickets dans une liste fermée de motifs puis analyser les erreurs, ambiguïtés et nouvelles catégories potentielles",
    deliverable: "une taxonomie documentée avec exemples, règles exactes, cas ambigus et procédure de revue",
    assessment: "catégoriser de nouveaux tickets et signaler les cas où aucune catégorie existante n’est satisfaisante",
    transfer: "tester la classification sur un périmètre limité avant toute réaffectation automatique",
    guardrail: "le modèle propose uniquement des catégories autorisées et les cas hors taxonomie restent visibles au lieu d’être forcés dans une classe approximative",
    example: "les clients décrivent le même problème avec des mots différents et les agents choisissent parfois des catégories incohérentes"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Former le support à transformer les tickets en documentation",
    audience: "support, knowledge managers et experts produit",
    objective: "capitaliser sur les résolutions réelles sans publier automatiquement des procédures incomplètes ou spécifiques à un cas",
    workshop: "sélectionner des tickets résolus, extraire symptôme, diagnostic, résolution et limites puis produire un brouillon d’article",
    deliverable: "un modèle d’article de connaissance avec source, contexte, étapes, limites, validation et date de revue",
    assessment: "transformer un nouveau ticket résolu en brouillon tout en retirant les données client et les éléments non généralisables",
    transfer: "alimenter progressivement la base de connaissances depuis les problèmes récurrents",
    guardrail: "aucun article n’est publié sans validation d’un référent et les données spécifiques au client sont exclues du contenu réutilisable",
    example: "des solutions efficaces restent enfermées dans les tickets et sont redécouvertes plusieurs fois par des agents différents"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Apprendre à résumer un historique client avant de répondre",
    audience: "agents support, account managers et service client",
    objective: "reconstituer rapidement le contexte pertinent d’un client sans masquer les dates, décisions et points encore ouverts",
    workshop: "résumer un historique mêlant tickets, e-mails et notes CRM pour préparer une nouvelle réponse",
    deliverable: "un format de synthèse chronologique avec demandes, réponses, engagements, actions et sources",
    assessment: "résumer un nouvel historique en séparant faits, interprétations et éléments non confirmés",
    transfer: "utiliser la synthèse lors des reprises de dossier, escalades et changements d’agent",
    guardrail: "un résumé ne remplace jamais l’historique source lorsque la décision dépend d’un engagement ou d’une formulation précise",
    example: "un agent reprend un dossier ancien et doit relire de nombreux échanges avant de comprendre ce qui a déjà été demandé, répondu ou promis"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Former les équipes à détecter les signaux d’insatisfaction",
    audience: "support, expérience client et managers de centres de contact",
    objective: "repérer des signaux textuels utiles à une revue humaine sans transformer une analyse de sentiment en vérité sur l’état du client",
    workshop: "analyser des verbatims avec répétitions, escalades, délais, formulations négatives et demandes de résiliation",
    deliverable: "une grille de signaux avec exemples, niveau d’attention, source et règle d’escalade",
    assessment: "examiner de nouveaux messages et distinguer signal observable, interprétation et priorité métier",
    transfer: "utiliser la grille dans les revues qualité et files de supervision",
    guardrail: "un score ou une analyse de sentiment ne remplace pas la lecture humaine lorsqu’une décision concernant le client ou une escalade importante est envisagée",
    example: "un client peut exprimer son insatisfaction sans utiliser un mot-clé évident, tandis qu’un message négatif n’implique pas toujours une situation critique"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Apprendre à concevoir une escalade humaine dans un workflow IA",
    audience: "support, responsables opérations et chefs de projet automatisation",
    objective: "définir précisément quand un workflow assisté doit s’arrêter et transmettre le dossier à une personne",
    workshop: "concevoir des règles d’escalade selon ambiguïté, valeur, sensibilité, absence de source, client mécontent et action irréversible",
    deliverable: "une matrice d’escalade avec déclencheurs, file cible, contexte transmis et délai attendu",
    assessment: "analyser un nouveau workflow et identifier les étapes qui nécessitent une sortie vers un humain",
    transfer: "utiliser la matrice avant de déployer tout assistant ou agent de service",
    guardrail: "une escalade doit transmettre le contexte et les sources déjà collectés afin que le contrôle humain ne devienne pas une nouvelle ressaisie complète",
    example: "un assistant sait traiter les cas simples mais l’équipe n’a pas encore défini ce qu’il doit faire lorsque la demande est ambiguë ou sort du cadre"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Former le support à mesurer la qualité d’un assistant IA",
    audience: "support, responsables qualité, product owners et managers",
    objective: "évaluer un assistant sur des cas représentatifs plutôt que sur quelques démonstrations convaincantes",
    workshop: "constituer un jeu de tests puis mesurer exactitude, source, complétude, besoin de correction, escalade et temps de reprise",
    deliverable: "une grille d’évaluation avec cas de test, résultat attendu, défaut observé et décision de correction",
    assessment: "évaluer une nouvelle série de réponses et proposer les corrections de source, règle ou instruction les plus pertinentes",
    transfer: "maintenir le jeu de tests à chaque évolution majeure de la base ou de l’assistant",
    guardrail: "la satisfaction générale ou une belle démonstration ne remplace pas des tests sur les cas difficiles, rares et sensibles",
    example: "un prototype répond très bien aux questions choisies pendant la démo mais personne ne sait comment il se comporte sur les exceptions réelles du support"
  },
  {
    family: "service",
    cluster: "Service client",
    title: "Apprendre à maintenir une FAQ alimentée par les problèmes réels",
    audience: "support, knowledge management, produit et communication client",
    objective: "faire évoluer la FAQ à partir des motifs réellement observés dans les demandes tout en gardant une validation éditoriale",
    workshop: "regrouper un mois de tickets, identifier les questions récurrentes et comparer ces besoins au contenu actuellement publié",
    deliverable: "un backlog FAQ avec fréquence, exemple source, article existant, lacune, propriétaire et priorité de revue",
    assessment: "analyser un nouvel échantillon et distinguer question récurrente, cas isolé et problème nécessitant une correction produit plutôt qu’un article",
    transfer: "utiliser le backlog dans une revue mensuelle support-produit-contenu",
    guardrail: "une fréquence élevée ne déclenche pas automatiquement une publication ; la réponse doit être correcte, stable et validée par le propriétaire du contenu",
    example: "la FAQ évolue surtout lorsque quelqu’un pense à ajouter une question alors que les tickets montrent déjà les sujets que les clients ne comprennent pas"
  }
];

export const marketDemandExecutionArticlesWave27 = [];
export const marketDemandTrainingArticlesWave27 = serviceSpecs.map(buildTrainingArticle);
