import { buildTrainingArticle } from "./training-article-factory.js";

const commercialSpecs = [
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Former les commerciaux à préparer un rendez-vous avec l’IA",
    audience: "équipes commerciales B2B, account managers et responsables grands comptes",
    objective: "préparer un rendez-vous à partir de sources vérifiables sans transformer une recherche IA en faits non contrôlés",
    workshop: "construire un briefing avant rendez-vous à partir d’une fiche CRM, d’e-mails autorisés, du site du compte et de notes internes",
    deliverable: "un modèle de briefing avec contexte, hypothèses, questions, informations manquantes et sources",
    assessment: "préparer un nouveau compte et distinguer clairement faits, hypothèses et questions à poser",
    transfer: "utiliser le modèle avant les rendez-vous à enjeu et l’adapter par segment commercial",
    guardrail: "aucune information non sourcée sur le prospect n’est présentée comme un fait établi",
    example: "un commercial ouvre plusieurs onglets avant chaque rendez-vous et mélange parfois informations CRM anciennes, recherches web et souvenirs d’échanges précédents"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Apprendre à rédiger des relances commerciales personnalisées avec l’IA",
    audience: "commerciaux, business developers et account managers",
    objective: "produire des relances utiles à partir du contexte réel plutôt que des messages génériques générés en série",
    workshop: "transformer plusieurs historiques de rendez-vous et CRM en brouillons de relance adaptés à la prochaine action attendue",
    deliverable: "une bibliothèque de structures de relance avec données nécessaires, ton, CTA et critères de validation",
    assessment: "rédiger une relance sur un nouveau cas en montrant quelles informations du contexte ont réellement été utilisées",
    transfer: "intégrer les modèles dans les routines CRM tout en conservant la validation avant envoi",
    guardrail: "l’IA ne crée ni faux souvenir, ni promesse, ni échéance qui n’existent pas dans l’historique du compte",
    example: "les équipes disposent d’un CRM riche mais envoient encore des relances proches les unes des autres faute de temps pour relire le contexte"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Former une équipe commerciale à résumer et exploiter ses appels",
    audience: "équipes de vente utilisant visioconférence, téléphonie ou comptes rendus CRM",
    objective: "transformer un appel en données commerciales utiles sans confondre ce qui a été dit, interprété et décidé",
    workshop: "analyser une transcription et extraire besoins, objections, engagements, prochaines actions et informations manquantes",
    deliverable: "un schéma de compte rendu commercial structuré avec champs CRM et règles de validation",
    assessment: "traiter un nouvel appel et repérer les affirmations qui ne doivent pas être transformées en champs certains",
    transfer: "utiliser la structure après les appels et mesurer les corrections avant automatisation plus poussée",
    guardrail: "une intention supposée du prospect reste une interprétation et n’est jamais transformée automatiquement en engagement ou probabilité de vente",
    example: "les commerciaux prennent des notes différentes après les appels, ce qui rend les informations CRM difficiles à comparer et à réutiliser"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Apprendre à créer une proposition commerciale avec l’IA sans la rendre générique",
    audience: "équipes commerciales B2B, avant-vente et responsables de comptes",
    objective: "utiliser l’IA pour structurer une proposition à partir du besoin qualifié tout en conservant la précision de l’offre et des preuves",
    workshop: "construire une première proposition à partir d’un brief client, d’un catalogue d’offres et de contraintes commerciales vérifiées",
    deliverable: "un canevas proposition avec sections variables, preuves autorisées, éléments à confirmer et revue finale",
    assessment: "produire une proposition sur un nouveau dossier sans inventer de référence, résultat, délai ou engagement",
    transfer: "utiliser le canevas comme base de production puis enrichir avec les contenus validés de l’entreprise",
    guardrail: "aucune référence client, performance, prix, délai ou capacité n’est généré s’il n’existe pas dans une source commerciale autorisée",
    example: "l’IA permet de rédiger vite mais les propositions deviennent interchangeables lorsqu’elles ne sont pas ancrées dans le besoin réel et les preuves disponibles"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Former les commerciaux à utiliser le CRM avec un copilote IA",
    audience: "commerciaux, responsables de comptes et managers commerciaux",
    objective: "utiliser un copilote pour lire, préparer et proposer des mises à jour CRM sans dégrader la qualité des données",
    workshop: "résumer un compte, identifier les champs manquants, préparer une prochaine action et proposer une mise à jour à valider",
    deliverable: "une matrice des usages CRM assistés avec droits, champs autorisés, validations et cas d’exception",
    assessment: "analyser une fiche CRM imparfaite et décider ce que le copilote peut lire, proposer ou modifier",
    transfer: "déployer les usages progressivement par type de champ et niveau de risque",
    guardrail: "les champs qui influencent forecast, montant, étape ou engagement commercial restent soumis aux règles de validation définies par l’organisation",
    example: "le CRM contient beaucoup d’informations mais les commerciaux perdent du temps à les relire, les résumer puis mettre à jour manuellement plusieurs champs"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Apprendre à rechercher un compte prospect avec l’IA",
    audience: "business developers, SDR, account executives et responsables de comptes",
    objective: "structurer une recherche de compte à partir de sources explicites et distinguer faits récents, hypothèses et angles de conversation",
    workshop: "construire une fiche de recherche sur un compte cible avec sources, signaux, questions et informations encore inconnues",
    deliverable: "un modèle de fiche compte avec provenance de chaque donnée et date d’observation",
    assessment: "produire une recherche sur un nouveau compte en refusant les informations non vérifiables",
    transfer: "réutiliser la fiche avant prospection ou rendez-vous sans créer un dossier de surveillance disproportionné",
    guardrail: "l’IA ne déduit pas une intention d’achat à partir d’un signal isolé et chaque fait externe conserve sa source et sa date",
    example: "les commerciaux utilisent les moteurs de recherche et l’IA pour préparer leurs comptes mais recopient parfois des informations sans savoir si elles sont récentes ou réellement confirmées"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Former les commerciaux à détecter les informations manquantes avant une offre",
    audience: "équipes commerciales, avant-vente et responsables de proposition",
    objective: "utiliser l’IA comme contrôleur de complétude avant rédaction d’une offre plutôt que comme machine à remplir les blancs",
    workshop: "analyser plusieurs briefs commerciaux et faire apparaître objectifs, périmètre, acteurs, contraintes, critères de succès et inconnues",
    deliverable: "une checklist de qualification avant offre et une liste de questions de clarification",
    assessment: "auditer un nouveau brief et refuser de compléter automatiquement les éléments absents",
    transfer: "intégrer la checklist dans le passage opportunité vers proposition",
    guardrail: "une information absente devient une question à poser, jamais une hypothèse silencieusement transformée en fait",
    example: "une proposition est parfois rédigée alors que le périmètre, le calendrier ou les critères de décision n’ont pas été suffisamment clarifiés"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Apprendre à créer des séquences de suivi assistées par IA",
    audience: "business developers, SDR et équipes commerciales B2B",
    objective: "concevoir des séquences de suivi contextualisées sans automatiser aveuglément les envois ni multiplier les messages inutiles",
    workshop: "dessiner une séquence selon statut du compte, dernier échange, prochaine action et règles d’arrêt",
    deliverable: "une séquence documentée avec déclencheurs, contenu, délais, conditions de sortie et validation humaine",
    assessment: "concevoir une nouvelle séquence et identifier les situations où elle doit s’arrêter ou repasser à un humain",
    transfer: "tester les séquences sur un périmètre limité avant toute automatisation multicanale",
    guardrail: "un prospect qui répond, refuse ou change de contexte sort immédiatement de la logique automatisée selon les règles définies",
    example: "les commerciaux veulent automatiser leurs relances mais une séquence rigide risque d’envoyer le mauvais message après une réponse ou un changement de situation"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Former les commerciaux à utiliser l’IA pour préparer une négociation",
    audience: "account executives, responsables grands comptes et managers commerciaux",
    objective: "préparer scénarios, questions et arguments à partir des faits du dossier sans transformer l’IA en décideur de concession",
    workshop: "construire une carte de négociation à partir des objectifs, contraintes, historique, points non résolus et marges autorisées",
    deliverable: "une fiche de préparation avec faits, hypothèses, questions, options et limites non négociables",
    assessment: "préparer un nouveau scénario en distinguant clairement ce qui est connu du client et ce qui reste hypothétique",
    transfer: "utiliser la fiche avant les négociations importantes et enrichir le retour d’expérience après chaque échange",
    guardrail: "l’IA ne décide jamais seule d’un prix, d’une concession ou d’un engagement contractuel",
    example: "les informations utiles à une négociation existent dans le CRM, les e-mails et les notes, mais ne sont pas toujours réunies avant le rendez-vous"
  },
  {
    family: "commercial",
    cluster: "Commercial",
    title: "Apprendre à analyser les motifs de perte avec l’IA",
    audience: "directions commerciales, managers et équipes revenue operations",
    objective: "regrouper les motifs de perte à partir des données disponibles sans inventer une causalité ni surinterpréter les commentaires CRM",
    workshop: "analyser un échantillon d’opportunités perdues, normaliser les motifs et comparer verbatims, statuts et informations manquantes",
    deliverable: "une taxonomie de motifs avec exemples sources, niveau de confiance et questions à investiguer",
    assessment: "classifier de nouvelles opportunités perdues et signaler les cas où les données ne permettent pas de conclure",
    transfer: "utiliser la taxonomie dans les revues commerciales et améliorer progressivement la qualité des champs CRM",
    guardrail: "une corrélation ou un commentaire isolé n’est pas présenté comme la cause certaine d’une perte",
    example: "le CRM contient plusieurs motifs de perte et des notes libres, mais la direction ne sait pas lesquels sont fiables ni quelles tendances méritent réellement une action"
  }
];

export const marketDemandExecutionArticlesWave24 = [];
export const marketDemandTrainingArticlesWave24 = commercialSpecs.map(buildTrainingArticle);
