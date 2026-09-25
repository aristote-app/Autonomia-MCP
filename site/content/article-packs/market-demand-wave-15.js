import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "support",
    "Support client",
    "Trier automatiquement les demandes support selon leur urgence",
    "prioriser les tickets qui nécessitent une prise en charge rapide sans confondre ton pressant et criticité métier",
    "une priorité structurée, un motif, une catégorie et une proposition de file ou d’équipe",
    "interpréter le texte du ticket pour reconnaître incident bloquant, insatisfaction, demande standard ou question informative",
    "combiner SLA, type de client, mots-clés critiques et catégorie avec une taxonomie fermée",
    "classer seulement en trois niveaux de priorité et laisser l’assignation finale à l’agent",
    "une boîte support reçoit simultanément une panne bloquante, une question d’utilisation et plusieurs demandes standard"
  ],
  [
    "support",
    "Support client",
    "Créer des brouillons de réponse support à partir de la base de connaissances",
    "préparer plus vite des réponses cohérentes à partir de procédures validées sans inventer d’information",
    "un brouillon de réponse avec citations ou liens vers les articles internes utilisés",
    "retrouver les passages pertinents de la base et formuler une réponse adaptée au ticket",
    "n’utiliser que des sources approuvées, signaler l’absence de réponse et interdire les engagements non documentés",
    "générer des brouillons sur une seule catégorie de tickets avec validation systématique",
    "les agents recherchent manuellement la même procédure plusieurs fois par jour avant de répondre"
  ],
  [
    "support",
    "Support client",
    "Détecter les sujets récurrents dans les tickets clients",
    "identifier les thèmes qui reviennent pour orienter produit, documentation et formation support",
    "des clusters de sujets avec fréquence, verbatims représentatifs et exemples de tickets",
    "regrouper des formulations différentes qui décrivent le même problème",
    "conserver les tickets sources, distinguer thème et cause et maintenir une catégorie inconnu",
    "analyser un mois de tickets fermés avec une taxonomie initiale de dix thèmes",
    "les équipes savent intuitivement que certains problèmes reviennent mais ne disposent pas d’une mesure stable"
  ],
  [
    "support",
    "Support client",
    "Transformer les tickets résolus en articles de FAQ",
    "capitaliser les solutions répétitives sans publier automatiquement un contenu issu d’un cas particulier",
    "un brouillon d’article FAQ avec question, réponse, prérequis, limites et tickets sources",
    "extraire la solution réellement appliquée et la reformuler sous une forme générique",
    "exclure les cas sensibles, supprimer les données personnelles et faire valider toute publication",
    "proposer chaque semaine trois brouillons issus des motifs les plus fréquents",
    "des réponses utiles restent enfermées dans l’historique des tickets et doivent être réécrites à chaque nouvelle demande"
  ],
  [
    "support",
    "Support client",
    "Escalader automatiquement les demandes sensibles vers un humain",
    "faire remonter les tickets qui nécessitent une expertise ou une intervention humaine rapide",
    "un signal d’escalade avec catégorie, justification, responsable proposé et contexte utile",
    "repérer les signaux de sécurité, litige, menace de résiliation, données sensibles ou forte insatisfaction",
    "définir des règles d’escalade absolue et utiliser l’IA seulement pour les formulations variables",
    "notifier une file senior sans modifier ni clôturer automatiquement le ticket",
    "certaines demandes sensibles ressemblent au premier regard à des tickets ordinaires et risquent de rester dans une file standard"
  ],
  [
    "support",
    "Support client",
    "Résumer l’historique d’un client avant de répondre à un ticket",
    "donner à l’agent une vue rapide du contexte sans relire plusieurs mois d’échanges",
    "une chronologie courte des demandes, solutions, engagements et points encore ouverts",
    "sélectionner dans l’historique ce qui est pertinent pour la demande actuelle",
    "dater chaque fait, conserver les liens vers les tickets et ne pas fusionner des problèmes distincts",
    "résumer uniquement les dix derniers tickets et les actions non clôturées",
    "un client réouvre un sujet ancien et l’agent doit parcourir de nombreux tickets pour comprendre ce qui a déjà été promis"
  ],
  [
    "support",
    "Support client",
    "Détecter les signaux d’insatisfaction dans les messages clients",
    "repérer plus tôt les situations où le ton et le contenu indiquent un risque de dégradation de la relation",
    "un signal à revoir avec extraits, thème et niveau de confiance plutôt qu’un diagnostic émotionnel définitif",
    "repérer frustration explicite, répétition, menace de départ ou échec non résolu dans le texte",
    "ne pas inférer d’état psychologique, conserver les verbatims et combiner avec des faits de service",
    "produire une file quotidienne de tickets à relire par un responsable support",
    "des clients expriment leur insatisfaction de façons très différentes et les signaux faibles se perdent dans le volume"
  ],
  [
    "support",
    "Support client",
    "Créer un rapport hebdomadaire automatique des motifs de contact",
    "transformer l’activité support en synthèse exploitable pour les responsables sans recompter manuellement les tickets",
    "un rapport par motif, volume, évolution, tickets représentatifs et points à investiguer",
    "regrouper les tickets par thème et résumer les changements de la semaine",
    "calculer les volumes hors LLM, conserver les définitions de catégories et distinguer fait et interprétation",
    "produire un rapport sur cinq motifs principaux avec comparaison à la semaine précédente",
    "chaque semaine, le responsable exporte des tickets puis construit à la main un tableau et un commentaire"
  ],
  [
    "support",
    "Support client",
    "Identifier les articles de documentation manquants à partir des tickets",
    "repérer les questions répétées qui ne disposent pas encore d’une réponse documentaire satisfaisante",
    "une liste d’opportunités de documentation avec volume, exemples et article existant le plus proche",
    "comparer les thèmes des tickets à la couverture actuelle de la base de connaissances",
    "ne pas conclure à un manque documentaire si une procédure existe mais est difficile à trouver sans vérifier la recherche",
    "identifier cinq lacunes probables à partir d’un mois de tickets et de la base actuelle",
    "les agents répondent souvent aux mêmes questions alors que la documentation couvre certains sujets et en ignore d’autres"
  ],
  [
    "marketing",
    "Marketing & contenu",
    "Créer automatiquement des briefs SEO à partir d’un sujet métier",
    "transformer un sujet métier en brief éditorial exploitable sans fabriquer des volumes de recherche ou des intentions imaginaires",
    "un brief avec angle, intention, questions à couvrir, structure, maillage interne et sources à vérifier",
    "organiser les informations du sujet et rapprocher le contenu des pages existantes et des requêtes réellement observées",
    "séparer données Search Console ou outils SEO des suggestions du modèle et vérifier la cannibalisation avant création",
    "générer un brief pour une requête observée et le faire valider par l’équipe éditoriale",
    "un expert métier possède un sujet pertinent mais le marketing passe du temps à reconstruire à chaque fois la structure SEO et les pages liées"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave15 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave15 = [];
