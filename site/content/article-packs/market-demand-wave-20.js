import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "crm",
    "Commercial & CRM",
    "Qualifier automatiquement les leads entrants avec l’IA",
    "réduire le délai entre l’arrivée d’une demande et sa qualification sans laisser un modèle décider seul de la valeur commerciale",
    "une fiche lead structurée avec besoin, urgence, secteur, informations manquantes, prochaine action proposée et statut de revue",
    "extraire le besoin formulé, reconnaître les informations utiles et produire une qualification structurée à partir du message et du contexte disponible",
    "conserver les règles commerciales dans le CRM, distinguer faits et interprétations et envoyer en revue tout lead incomplet ou ambigu",
    "traiter un seul formulaire entrant et enrichir la fiche CRM sans modifier automatiquement le scoring commercial",
    "des demandes arrivent depuis le site, les landing pages et les formulaires mais restent plusieurs heures dans une boîte mail avant qu’une personne les lise et les reformule dans le CRM"
  ],
  [
    "admin",
    "Achats & fournisseurs",
    "Comparer des offres fournisseurs avec une grille de critères",
    "accélérer la comparaison documentaire tout en conservant une décision achats explicite et vérifiable",
    "un tableau comparatif sourcé par critère avec valeurs extraites, éléments absents, écarts et points nécessitant une revue humaine",
    "repérer dans chaque offre les informations correspondant aux critères définis et normaliser les formulations pour faciliter la comparaison",
    "utiliser une grille décidée avant l’analyse, citer les documents sources et interdire au modèle de choisir le fournisseur",
    "comparer trois offres sur dix critères objectifs et faire valider chaque valeur critique par l’acheteur",
    "une consultation reçoit plusieurs PDF et tableurs dont les structures diffèrent, obligeant l’acheteur à recopier les mêmes informations avant de pouvoir réellement comparer"
  ],
  [
    "admin",
    "Achats & fournisseurs",
    "Détecter les écarts entre un devis et un cahier des charges",
    "faire remonter rapidement les exigences absentes, modifiées ou ambiguës avant une validation fournisseur",
    "une matrice exigence par exigence avec preuve source, réponse fournisseur, statut conforme à vérifier ou absent et commentaire de revue",
    "rapprocher les exigences du cahier des charges avec les passages pertinents du devis et signaler les absences ou formulations différentes",
    "ne jamais transformer une similarité sémantique en conformité certaine et laisser la qualification finale à l’acheteur ou au métier",
    "tester le rapprochement sur un cahier des charges limité et un devis fournisseur avant de traiter des consultations complètes",
    "les équipes découvrent tardivement qu’un devis ne couvre pas exactement une exigence parce que la réponse est formulée ailleurs ou sous un vocabulaire différent"
  ],
  [
    "finance",
    "Logistique & supply chain",
    "Comparer automatiquement commande, livraison et facture",
    "détecter les écarts documentaires entre ce qui a été commandé, livré et facturé avant traitement définitif",
    "une liste d’écarts par ligne avec références, quantités, montants, dates, pièces sources et statut de contrôle",
    "extraire et rapprocher les références produits, quantités, prix et identifiants présents dans les trois documents",
    "utiliser les références exactes quand elles existent, définir des tolérances explicites et envoyer les rapprochements incertains en validation",
    "rapprocher un type de commande, un format de bon de livraison et un format de facture sur un périmètre fournisseur limité",
    "la comptabilité et la logistique contrôlent manuellement plusieurs documents pour comprendre pourquoi un montant ou une quantité ne correspond pas"
  ],
  [
    "admin",
    "Immobilier & gestion de biens",
    "Créer une fiche intervention à partir d’un message locataire",
    "transformer une demande libre reçue par e-mail ou formulaire en intervention structurée sans perdre le message d’origine",
    "une fiche avec logement, problème décrit, catégorie proposée, niveau d’urgence à confirmer, pièces jointes et prochaine action",
    "extraire les éléments factuels du message, reconnaître la nature probable du problème et préparer une catégorie exploitable par l’équipe de gestion",
    "ne pas inventer l’urgence, conserver le texte source et demander une validation humaine pour les situations sensibles ou insuffisamment documentées",
    "traiter les demandes d’un immeuble ou d’un portefeuille limité et créer uniquement des fiches à valider",
    "les gestionnaires reçoivent des messages locataires très différents et doivent relire, reformuler puis recopier chaque demande dans un tableau ou un outil d’intervention"
  ],
  [
    "admin",
    "Immobilier & gestion de biens",
    "Extraire les anomalies d’un état des lieux vers un tableau de suivi",
    "transformer les constats dispersés d’un état des lieux en éléments de suivi structurés et reliés au document source",
    "un tableau par pièce avec anomalie, élément concerné, formulation source, photo associée si disponible et statut de revue",
    "repérer les formulations décrivant une dégradation ou une anomalie et les rattacher à la pièce ou à l’équipement concerné",
    "ne pas déduire automatiquement une responsabilité, un coût ou une retenue et conserver la validation humaine sur toute conséquence contractuelle",
    "extraire les anomalies d’un seul modèle d’état des lieux et comparer le résultat à une saisie manuelle de référence",
    "un état des lieux peut contenir plusieurs pages de remarques et photos que l’équipe doit ensuite transformer manuellement en liste d’actions ou de points à suivre"
  ],
  [
    "support",
    "IT, helpdesk & sécurité",
    "Trier automatiquement les tickets IT selon leur nature",
    "orienter plus vite les demandes vers la bonne file sans transformer la classification en décision technique définitive",
    "une catégorie proposée, une priorité à confirmer, les informations manquantes et la file de destination suggérée",
    "interpréter le texte du ticket et reconnaître le type d’incident, de demande ou d’accès à partir d’une taxonomie contrôlée",
    "utiliser une liste fermée de catégories, appliquer des règles exactes pour les cas connus et envoyer les tickets ambigus en revue",
    "classifier les tickets d’une seule équipe IT sur une taxonomie de dix catégories avant toute réaffectation automatique",
    "le helpdesk perd du temps à lire des tickets qui utilisent le vocabulaire des utilisateurs plutôt que les catégories techniques attendues par l’outil"
  ],
  [
    "reporting",
    "Data & reporting",
    "Créer un rapport narratif à partir d’un Google Sheet",
    "transformer des indicateurs structurés en synthèse lisible sans laisser l’IA inventer les causes des variations",
    "un rapport avec faits calculés, variations, seuils dépassés, commentaires métiers disponibles et questions à investiguer",
    "reformuler les données validées en texte clair et hiérarchiser les variations selon des règles définies",
    "calculer les chiffres hors du modèle, identifier explicitement les hypothèses et interdire toute causalité non présente dans les données",
    "générer chaque semaine une synthèse à partir d’un onglet normalisé contenant une dizaine de KPI",
    "un manager reçoit un tableau à jour mais doit encore parcourir chaque ligne pour transformer les chiffres en quelques messages compréhensibles par son équipe"
  ],
  [
    "admin",
    "Achats & fournisseurs",
    "Créer une synthèse de consultation fournisseurs",
    "rassembler les points essentiels d’une consultation sans remplacer la comparaison détaillée ni la décision achats",
    "une note structurée avec périmètre, participants, critères, écarts significatifs, éléments manquants et liens vers les pièces sources",
    "résumer les documents reçus, regrouper les informations par thème et mettre en évidence les points qui nécessitent une décision",
    "séparer les faits extraits des appréciations, citer les pièces et ne pas produire de classement automatique des fournisseurs",
    "générer une synthèse sur une consultation réelle limitée à quelques fournisseurs et faire valider chaque section par l’acheteur",
    "après réception des offres, une personne doit reconstruire manuellement le contexte de la consultation pour préparer une réunion ou une décision collective"
  ],
  [
    "reporting",
    "Direction & management",
    "Créer un briefing quotidien de dirigeant à partir des informations internes",
    "réunir les informations vraiment utiles à la décision sans transformer le briefing en flux incontrôlé de données ou de résumés",
    "une note courte avec événements nouveaux, indicateurs clés, décisions en attente, risques déclarés et liens vers les sources",
    "résumer les nouvelles informations provenant de sources autorisées et les regrouper selon les priorités définies par la direction",
    "limiter les sources, distinguer fait alerte et interprétation, conserver les liens et laisser toute décision au dirigeant",
    "construire un briefing sur trois sources internes stables avant d’ajouter messagerie, CRM ou reporting supplémentaire",
    "la direction reçoit beaucoup d’informations utiles mais les découvre dans des e-mails, tableaux et comptes rendus différents au lieu de disposer d’un point de lecture commun"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave20 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave20 = [];
