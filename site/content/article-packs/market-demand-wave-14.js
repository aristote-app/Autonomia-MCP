import { buildExecutionArticle } from "./execution-article-factory.js";

const specs = [
  {
    "family": "reporting",
    "cluster": "Data & reporting",
    "title": "Expliquer automatiquement les variations inhabituelles d’un tableau de bord",
    "goal": "faire ressortir les écarts qui méritent une investigation sans laisser l’IA inventer leur cause",
    "trigger": "l’actualisation d’un tableau de bord ou une revue planifiée",
    "inputs": "KPI, période courante, historique, dimensions, seuils d’alerte et commentaires métiers disponibles",
    "output": "une liste de variations remarquables avec chiffres, contexte et hypothèses clairement séparées",
    "aiRole": "formuler une explication lisible des écarts calculés et rapprocher les commentaires existants",
    "rules": "détecter les anomalies par calcul déterministe, ne jamais présenter une corrélation comme une cause et citer les valeurs utilisées",
    "human": "le métier valide toute interprétation causale avant diffusion",
    "exceptions": "rupture de série, changement de définition du KPI, données partielles, saisonnalité et erreur de chargement",
    "mvp": "détecter trois types d’écarts sur un tableau de bord et générer uniquement un commentaire factuel",
    "advanced": "ajouter des dimensions d’analyse, les commentaires des responsables et une comparaison automatique avec les périodes analogues",
    "measure": "écarts utiles détectés, faux signaux, commentaires corrigés, temps d’analyse et anomalies liées à la qualité des données",
    "example": "un tableau affiche une baisse de 18 % mais la direction doit encore parcourir plusieurs onglets pour comprendre où l’écart se concentre"
  },
  {
    "family": "reporting",
    "cluster": "Data & reporting",
    "title": "Transformer plusieurs exports CSV en synthèse lisible",
    "goal": "consolider des fichiers issus de plusieurs outils et produire une lecture commune sans copier-coller manuel",
    "trigger": "le dépôt périodique de nouveaux exports dans un dossier ou une exécution planifiée",
    "inputs": "CSV, schémas de colonnes, période, règles de jointure, identifiants et dictionnaire des indicateurs",
    "output": "un jeu de données consolidé, des contrôles de qualité et une synthèse narrative",
    "aiRole": "aider à documenter les écarts de schéma et résumer les résultats après consolidation déterministe",
    "rules": "faire les jointures et calculs hors LLM, contrôler les types, tracer la provenance et refuser les colonnes non reconnues",
    "human": "validation du mapping lors de tout changement de format ou de source",
    "exceptions": "colonnes renommées, encodage, séparateurs différents, doublons, périodes chevauchantes et identifiants manquants",
    "mvp": "consolider deux exports stables dans une table unique avec rapport d’erreurs",
    "advanced": "automatiser la collecte via API et alimenter un tableau de bord ou une revue périodique",
    "measure": "lignes rejetées, doublons, temps de consolidation, changements de schéma et corrections du mapping",
    "example": "chaque semaine, un analyste télécharge plusieurs CSV, les fusionne dans Excel puis rédige manuellement une synthèse"
  },
  {
    "family": "reporting",
    "cluster": "Data & reporting",
    "title": "Créer un commentaire automatique de KPI sans inventer les causes",
    "goal": "produire un commentaire factuel et utile autour des indicateurs sans transformer l’IA en analyste causal",
    "trigger": "la disponibilité des KPI d’une période",
    "inputs": "valeurs actuelles, période précédente, objectif, seuils, dimensions et commentaires métiers",
    "output": "un commentaire structuré sur niveau, variation, écart à l’objectif et points nécessitant une explication humaine",
    "aiRole": "transformer les chiffres calculés en texte clair et hiérarchisé",
    "rules": "calculer toutes les variations hors modèle, interdire les causes non sourcées et distinguer faits, hypothèses et questions",
    "human": "validation des explications de causalité et des messages destinés à la direction",
    "exceptions": "KPI redéfini, objectif absent, valeur nulle, effet de base, données partielles et période non comparable",
    "mvp": "commenter cinq KPI avec uniquement les faits calculés et une section « à expliquer »",
    "advanced": "ajouter les commentaires des responsables, une comparaison multi-périodes et une bibliothèque de définitions",
    "measure": "erreurs numériques, commentaires réécrits, causes inventées détectées, temps de rédaction et taux d’utilisation",
    "example": "chaque mois, un responsable recopie les chiffres du tableau et rédige des phrases similaires pour expliquer les évolutions"
  },
  {
    "family": "reporting",
    "cluster": "Data & reporting",
    "title": "Préparer une revue de performance à partir de données structurées",
    "goal": "assembler automatiquement les données nécessaires à une revue tout en gardant l’analyse et les décisions sous responsabilité humaine",
    "trigger": "la clôture d’une période ou la préparation d’un rituel de performance",
    "inputs": "KPI, objectifs, écarts, segments, historique, actions précédentes et commentaires validés",
    "output": "un support de revue avec faits saillants, écarts, actions précédentes et questions à traiter",
    "aiRole": "synthétiser les éléments dans une narration cohérente et préparer les questions de discussion",
    "rules": "utiliser uniquement les indicateurs calculés, conserver les définitions et ne pas attribuer une performance à une cause non documentée",
    "human": "le manager valide la lecture, ajoute le contexte et décide des actions",
    "exceptions": "données manquantes, objectif révisé, périmètre modifié, indicateurs contradictoires et comparaison non pertinente",
    "mvp": "préparer une revue d’une équipe avec dix KPI et les actions du mois précédent",
    "advanced": "ajouter les commentaires métiers, décisions de la revue et suivi automatique des actions jusqu’au cycle suivant",
    "measure": "temps de préparation, corrections, données manquantes, questions réellement discutées et actions suivies",
    "example": "une revue mensuelle mobilise plusieurs heures de préparation parce que les chiffres, commentaires et actions passées sont dispersés"
  }
];

export const marketDemandExecutionArticlesWave14 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave14 = [];
