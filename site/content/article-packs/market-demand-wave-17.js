import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "finance",
    "Finance & comptabilité",
    "Classer les pièces comptables dans Google Drive automatiquement",
    "ranger les documents financiers selon une convention stable sans dépendre du nom d’origine",
    "un dossier cible, un nom normalisé, des labels et une trace de classement",
    "reconnaître le type de pièce et extraire fournisseur, date ou période lorsque nécessaire",
    "utiliser une taxonomie fermée, vérifier les identifiants et ne jamais supprimer la pièce d’origine sans procédure",
    "classer uniquement les factures fournisseurs d’un périmètre pilote après validation",
    "les pièces comptables arrivent par e-mail ou dépôt avec des noms hétérogènes puis sont déplacées manuellement"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Créer un contrôle de cohérence avant saisie comptable",
    "signaler les incohérences visibles avant saisie sans prétendre remplacer le contrôle comptable",
    "une liste de contrôles réussis, anomalies et champs à vérifier",
    "extraire les champs du document et rapprocher les valeurs attendues",
    "calculer les contrôles par règles déterministes et envoyer toute divergence importante en revue",
    "contrôler date, total, TVA, fournisseur et référence sur un type de facture",
    "une facture peut contenir des valeurs incohérentes ou mal reconnues qui sont découvertes seulement après la saisie"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Résumer les écarts entre budget et réalisé avec l’IA",
    "présenter clairement les écarts calculés sans inventer leur cause",
    "une synthèse par poste avec valeur, écart absolu, écart relatif et questions à expliquer",
    "transformer des écarts déjà calculés en commentaire lisible",
    "faire tous les calculs hors modèle et interdire toute cause non appuyée par un commentaire ou une donnée",
    "commenter les dix écarts les plus importants d’un tableau budgétaire",
    "les responsables lisent un tableau dense avant chaque revue et rédigent manuellement les mêmes phrases d’écart"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Préparer un commentaire de gestion à partir d’un tableau financier",
    "accélérer la rédaction d’un premier commentaire tout en séparant chiffres, explications documentées et hypothèses",
    "un brouillon structuré par indicateur avec faits, explications sourcées et points à confirmer",
    "organiser les valeurs et commentaires métiers existants en narration de gestion",
    "ne jamais recalculer silencieusement les chiffres et marquer explicitement les causes non documentées",
    "préparer un commentaire pour un tableau mensuel validé avant relecture par la finance",
    "un responsable financier copie chaque mois les chiffres dans un document puis reformule manuellement les mêmes structures"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Automatiser la collecte des justificatifs manquants",
    "identifier les pièces attendues et préparer les demandes de relance sans envoyer de message injustifié",
    "une liste des justificatifs manquants et des brouillons de relance par responsable",
    "résumer le contexte de la dépense et adapter le message de relance",
    "déterminer les manquants par règle, stopper après réception et plafonner les relances",
    "produire une liste quotidienne de brouillons à valider pour un périmètre de dépenses",
    "la finance consacre du temps à vérifier qui n’a pas fourni son justificatif puis à envoyer des relances répétitives"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Détecter les factures potentiellement en double avant validation",
    "repérer les doublons probables avant approbation sans bloquer automatiquement une facture légitime",
    "un score de similarité explicable, les factures rapprochées et les champs communs",
    "comparer fournisseur, numéro, date, montant et éléments de ligne lorsque les références ne suffisent pas",
    "utiliser d’abord les clés exactes puis la similarité, et exiger une revue avant rejet",
    "signaler les doublons probables sur un mois de factures sans modifier leur statut",
    "une même facture peut être reçue par plusieurs canaux ou renvoyée avec un nom différent"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Créer une synthèse mensuelle de trésorerie à partir des données disponibles",
    "produire une vue lisible de la trésorerie sans inventer de prévision lorsque les données ne la permettent pas",
    "un résumé des soldes, mouvements importants, échéances connues et points à surveiller",
    "mettre en forme les données consolidées et les commentaires existants",
    "séparer solde observé, engagements connus et hypothèses de prévision",
    "générer une note mensuelle à partir d’un fichier de trésorerie validé",
    "le dirigeant reçoit un tableur détaillé mais souhaite une lecture rapide des variations et échéances"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Transformer un export comptable en rapport lisible pour un dirigeant",
    "convertir un export technique en lecture synthétique sans masquer les limites des données",
    "un rapport avec indicateurs calculés, principaux postes, variations et définitions",
    "résumer les résultats après transformation déterministe de l’export",
    "effectuer les calculs hors IA, documenter les regroupements et conserver un lien vers les données sources",
    "transformer un export standard en rapport mensuel de cinq sections",
    "un dirigeant reçoit des exports riches mais difficiles à lire sans retraitement par la comptabilité"
  ],
  [
    "finance",
    "Finance & comptabilité",
    "Préparer une checklist de clôture mensuelle pilotée par l’IA",
    "rendre visible l’état de la clôture et les actions restantes sans laisser le modèle déterminer seul qu’une étape est terminée",
    "une checklist dynamique avec responsables, preuves, statut et anomalies",
    "résumer les pièces ou commentaires associés à chaque étape",
    "conserver les obligations dans une table explicite et n’autoriser la clôture que sur preuve définie",
    "gérer une checklist de clôture pilote sur dix étapes avec statut contrôlé",
    "la clôture mensuelle dépend d’une liste d’actions réparties entre plusieurs personnes et suivies dans différents outils"
  ],
  [
    "marketing",
    "Marketing & contenu",
    "Transformer les questions commerciales en idées de contenus",
    "capitaliser les questions réellement posées par les prospects pour nourrir une stratégie éditoriale utile",
    "une liste de sujets reliés à des questions sources, une intention probable et des pages existantes proches",
    "regrouper les formulations commerciales en thèmes éditoriaux sans inventer de demande marché",
    "conserver la provenance des questions et vérifier la demande SEO avant de transformer un thème en page",
    "analyser un mois de notes commerciales et produire dix idées de contenus à valider",
    "les commerciaux entendent chaque semaine des questions pertinentes mais celles-ci ne remontent pas systématiquement au marketing"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave17 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave17 = [];
