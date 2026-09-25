import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "rh",
    "RH & recrutement",
    "Transformer une fiche de poste en grille d’entretien structurée",
    "préparer une grille cohérente à partir des compétences et responsabilités du poste sans automatiser la sélection",
    "des critères d’entretien, questions, éléments à approfondir et échelle d’observation",
    "transformer les attendus du poste en thèmes de questionnement explicites",
    "éviter les critères sensibles, conserver des critères liés au poste et faire valider la grille par les RH",
    "produire une grille pour une fiche de poste validée puis la relire en équipe",
    "les recruteurs réécrivent des questions à chaque recrutement et la couverture des compétences varie selon l’intervieweur"
  ],
  [
    "rh",
    "RH & recrutement",
    "Résumer des candidatures sans automatiser la décision de recrutement",
    "aider le recruteur à lire plus vite les informations déclarées sans classer automatiquement les personnes",
    "une synthèse factuelle du parcours, compétences déclarées, expériences et points à clarifier",
    "extraire et résumer uniquement les informations présentes dans le CV et les documents autorisés",
    "interdire score, classement ou recommandation d’embauche et masquer les données non nécessaires à l’analyse du poste",
    "résumer les candidatures pour un poste pilote avec un format identique et sans classement",
    "un recruteur doit lire de nombreux CV hétérogènes mais veut garder entièrement la décision et l’évaluation"
  ],
  [
    "rh",
    "RH & recrutement",
    "Préparer un entretien à partir du CV et de la fiche de poste",
    "faire ressortir les points du CV à explorer par rapport aux exigences explicites du poste",
    "une trame d’entretien avec questions de clarification et éléments du CV qui les motivent",
    "rapprocher expériences déclarées et exigences du poste sans déduire la capacité réelle du candidat",
    "citer les éléments sources, exclure les données personnelles non pertinentes et ne jamais formuler de verdict",
    "préparer cinq questions liées au poste pour chaque candidature retenue manuellement",
    "le recruteur relit séparément la fiche de poste et le CV puis note à la main les questions à poser"
  ],
  [
    "rh",
    "RH & recrutement",
    "Créer un parcours d’onboarding personnalisé à partir du poste",
    "adapter l’ordre des contenus et étapes d’intégration au rôle sans créer d’inégalités sur la base de données sensibles",
    "un parcours avec personnes à rencontrer, outils, procédures, objectifs de découverte et jalons",
    "sélectionner les modules utiles selon les responsabilités et l’environnement de travail",
    "fonder la personnalisation sur le poste et les besoins déclarés, pas sur des caractéristiques personnelles",
    "générer un parcours pour trois familles de postes à partir d’une bibliothèque d’onboarding validée",
    "tous les nouveaux arrivants reçoivent le même parcours alors que leurs outils, interlocuteurs et procédures diffèrent fortement"
  ],
  [
    "rh",
    "RH & recrutement",
    "Créer un assistant RH connecté aux procédures internes",
    "répondre aux questions courantes en citant les politiques internes sans se substituer aux RH sur les cas individuels",
    "une réponse sourcée, les procédures concernées et un renvoi humain lorsque la question dépasse le périmètre",
    "retrouver les passages pertinents dans les documents RH accessibles",
    "respecter les droits, citer les sources et refuser toute interprétation individuelle de droit ou de situation personnelle",
    "indexer une dizaine de procédures fréquentes et répondre uniquement à partir de ces sources",
    "les salariés posent souvent les mêmes questions sur congés, outils ou processus et les RH recherchent manuellement les documents"
  ],
  [
    "rh",
    "RH & recrutement",
    "Transformer les questions récurrentes des salariés en FAQ interne",
    "capitaliser les demandes fréquentes sans exposer les situations personnelles à toute l’entreprise",
    "des propositions de questions-réponses génériques avec source de politique interne",
    "regrouper les demandes par thème et retirer le contexte individuel",
    "anonymiser, vérifier la base documentaire et faire valider chaque réponse avant publication",
    "analyser un historique de questions et proposer dix entrées FAQ à valider",
    "les RH répondent régulièrement aux mêmes questions mais la FAQ n’est pas mise à jour de façon systématique"
  ],
  [
    "rh",
    "RH & recrutement",
    "Préparer des comptes rendus d’entretien à partir de notes",
    "structurer des notes après entretien sans ajouter d’évaluation non exprimée",
    "un compte rendu factuel selon la grille d’entretien avec points abordés et éléments restant à vérifier",
    "reclasser les notes sous les rubriques prévues et reformuler de manière neutre",
    "ne pas inventer de réponse, ne pas score automatiquement le candidat et conserver les citations factuelles si utiles",
    "structurer les notes d’un entretien pilote selon une grille RH validée",
    "les recruteurs disposent de notes fragmentaires et passent du temps après chaque entretien à les remettre en forme"
  ],
  [
    "rh",
    "RH & recrutement",
    "Cartographier les compétences d’une équipe à partir de données déclaratives",
    "rendre lisibles les compétences déclarées pour identifier des zones à approfondir sans évaluer automatiquement la performance",
    "une matrice de compétences déclarées avec niveaux auto-déclarés, preuves facultatives et zones non renseignées",
    "normaliser des formulations différentes autour d’un référentiel de compétences",
    "conserver la provenance déclarative, permettre la correction et ne pas transformer la carte en score de valeur individuelle",
    "cartographier un référentiel limité sur une équipe volontaire",
    "les compétences sont décrites dans des CV internes, formulaires ou entretiens avec des vocabulaires différents"
  ],
  [
    "rh",
    "RH & recrutement",
    "Identifier les besoins de formation à partir des entretiens annuels",
    "agréger les besoins exprimés sans automatiser une décision individuelle de formation",
    "des thèmes de besoins, populations concernées, verbatims anonymisés et fréquence",
    "regrouper les demandes et compétences à développer exprimées dans les comptes rendus",
    "séparer demande du salarié, besoin du manager et conclusion RH et ne pas inférer un déficit non déclaré",
    "analyser un échantillon d’entretiens et produire une carte de besoins à valider par les RH",
    "les besoins de formation sont présents dans les entretiens annuels mais restent difficiles à consolider à l’échelle de l’entreprise"
  ],
  [
    "rh",
    "RH & recrutement",
    "Créer des brouillons de communications RH adaptés à plusieurs publics",
    "décliner une information validée pour différents publics sans modifier son sens ni ses obligations",
    "plusieurs brouillons cohérents avec le même socle factuel et les consignes de ton",
    "adapter vocabulaire, longueur et exemples au public cible",
    "verrouiller les faits, dates, obligations et liens officiels et imposer une validation avant diffusion",
    "décliner une communication interne en trois versions à partir d’un message source validé",
    "une même information RH doit être reformulée pour managers, salariés et nouveaux arrivants tout en restant parfaitement cohérente"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave16 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave16 = [];
