export const buildGuides = {
  "cout-automatisation-ia": {
    eyebrow: "BUDGET · AUTOMATISATION IA",
    title: "Combien coûte l'automatisation d'un processus en entreprise ?",
    intro: "Le coût dépend surtout du parcours à automatiser : nombre d'étapes, outils à connecter, exceptions à traiter et contrôles que vous souhaitez conserver. L'objectif n'est pas de multiplier les agents, mais de concevoir une solution utile, maintenable et maîtrisée.",
    metaTitle: "Prix automatisation IA entreprise : comprendre le devis | AUTONOMIA",
    metaDescription: "Budget d'automatisation IA : méthode de chiffrage, facteurs de coût, exemple de processus, dépenses récurrentes et questions à poser à votre prestataire.",
    updated: "2026-10-16",
    summary: "Un devis sérieux commence par la description d'un flux de travail, pas par le choix d'une technologie. Le coût initial et les dépenses récurrentes doivent être distingués.",
    highlights: [
      {label:"À cadrer",value:"Processus, exceptions et logiciels"},
      {label:"À prévoir",value:"Conception + tests + exploitation"},
      {label:"À sécuriser",value:"Validation humaine des actions sensibles"}
    ],
    scenario: {
      eyebrow: "EXEMPLE · SERVICES B2B",
      title: "De l'e-mail entrant au dossier prêt à valider",
      context: "Une équipe reçoit des demandes clients par e-mail. Elle les classe, extrait les références utiles et prépare des réponses à partir du CRM et de documents internes.",
      before: ["Boîte mail consultée manuellement", "Référence recherchée dans le CRM", "Document vérifié à la main", "Réponse rédigée puis envoyée"],
      after: ["Détection et classement de la demande", "Recherche des données autorisées", "Brouillon de réponse traçable", "Vérification et envoi par l'équipe"],
      caveat: "Schéma illustratif, non issu d'un déploiement client. La possibilité de connecter le CRM dépend des accès et API existants."
    },
    sections: [
      {title:"Ce qui fait varier le prix",lead:"Deux automatisations qui semblent similaires peuvent demander des travaux très différents.",items:[
        ["La maturité du processus","Un flux documenté et stable se transforme plus facilement qu'un fonctionnement reposant sur des exceptions non décrites."],
        ["Le nombre d'outils","Un formulaire relié à un tableau est plus simple qu'une chaîne CRM, ERP, GED, e-mail et identité d'entreprise."],
        ["La qualité des données","Formats hétérogènes, doublons, pièces jointes, PDF scannés et droits d'accès augmentent l'effort de traitement et de recette."],
        ["Les actions autorisées","Préparer un brouillon, modifier une fiche client et déclencher un paiement n'impliquent ni le même risque ni les mêmes contrôles."],
        ["La maintenance","Les API et règles métier évoluent. Il faut clarifier supervision, correction d'erreurs, support, licences et coûts des modèles."]
      ]},
      {title:"Comment calculer un budget utilisable",lead:"Découpez le projet en lots vérifiables au lieu d'acheter un « agent IA » opaque.",items:[
        ["1. Décrire l'existant","Volume de dossiers, déclencheur, exceptions fréquentes, temps consacré, données nécessaires et responsable de la décision."],
        ["2. Vérifier les intégrations","Documenter les API, authentifications, environnements de test, propriétaires des outils et restrictions contractuelles."],
        ["3. Définir le premier périmètre","Sélectionner une tâche répétée, mesurable et suffisamment sécurisée pour être testée sans exposer une production sensible."],
        ["4. Ajouter les tests","Cas nominaux, dossiers incomplets, accès refusés, réponses ambiguës, doublons et indisponibilité d'un service."],
        ["5. Ventiler les dépenses","Conception, développement, hébergement, licences, consommation IA, maintenance, formation et accompagnement."]
      ]},
      {title:"Quel indicateur regarder avant d'investir ?",lead:"Le retour sur investissement doit s'appuyer sur des mesures observées, pas sur une promesse de temps gagné.",items:[
        ["Temps réellement passé","Mesurer le temps de traitement avant et après, sur des dossiers comparables et pendant une durée représentative."],
        ["Qualité et reprise","Compter les corrections, cas rejetés, erreurs et interventions humaines nécessaires. Plus rapide ne veut pas toujours dire mieux."],
        ["Coût complet","Additionner les dépenses de construction et d'exploitation, y compris les contrôles et la gouvernance."],
        ["Adoption","Vérifier que les équipes utilisent la solution et savent reprendre la main en cas d'incident."]
      ]}
    ],
    deliverables:["Cartographie du processus et de ses exceptions","Architecture cible et matrice des accès","Automatisation documentée et testée","Journal des erreurs, alertes et procédure de reprise","Formation des utilisateurs et modalités de support"],
    faq:[
      ["Peut-on automatiser sans IA générative ?","Oui. Une automatisation classique par règles et API est souvent plus robuste lorsqu'il n'y a pas de texte libre ou de jugement à produire."],
      ["Faut-il acheter un abonnement logiciel avant le cadrage ?","Pas nécessairement. La disponibilité des connecteurs et les coûts des licences se vérifient avant de retenir la solution."],
      ["L'IA peut-elle répondre automatiquement à tous les clients ?","Cela dépend des risques et du périmètre. Nous recommandons de commencer par des réponses préparées, traçables et validées pour les cas sensibles."]
    ],
    related:["agent-ia-ou-automatisation","application-metier-ia","suivi-marches-publics-ia"]
  },
  "agent-ia-ou-automatisation": {
    eyebrow:"ARCHITECTURE · BIEN CHOISIR",
    title:"Agent IA, automatisation classique ou application métier : que choisir ?",
    intro:"Un agent IA n'est pas systématiquement la meilleure réponse. Pour un processus stable, un workflow déterministe est parfois plus fiable. Pour gérer des droits, des dossiers et un suivi, une application métier peut être le véritable socle.",
    metaTitle:"Agent IA ou automatisation : comment choisir ? | AUTONOMIA",
    metaDescription:"Différences entre agent IA, workflow et application métier : critères de choix, exemples, risques, supervision humaine et méthodes de cadrage.",
    updated:"2026-10-16",
    summary:"Choisissez d'abord selon la nature des informations, la variabilité des décisions et la traçabilité attendue ; ajoutez l'IA seulement là où elle apporte une valeur distincte.",
    highlights:[
      {label:"Workflow",value:"Règles stables et répétables"},
      {label:"Agent IA",value:"Texte, recherche et propositions"},
      {label:"Application",value:"Dossiers, rôles et pilotage"}
    ],
    scenario:{
      eyebrow:"EXEMPLE · SERVICE ADMINISTRATIF",
      title:"Traiter une facture fournisseur",
      context:"Un document arrive par e-mail, les informations doivent être contrôlées et la facture doit être dirigée vers le bon valideur.",
      before:["Facture ouverte et renommée","Montant et fournisseur vérifiés","Bon de commande recherché","Validation sollicitée manuellement"],
      after:["Workflow : réception, classement et routage","IA : lecture des champs variables, si nécessaire","Application : suivi des statuts et permissions","Responsable : validation avant paiement"],
      caveat:"Architecture indicative à valider avec les données, la politique de sécurité et l'outil comptable existant."
    },
    sections:[
      {title:"Trois réponses à trois types de problèmes",lead:"La meilleure architecture peut combiner plusieurs briques, mais chacune doit avoir une raison d'être.",items:[
        ["Automatisation classique","Déclencheurs, règles métier, conditions, synchronisation entre logiciels et notifications ; très adaptée aux tâches prédictibles."],
        ["Agent IA","Analyse d'instructions, recherche documentaire et préparation de contenus ou actions dans un périmètre borné ; adapté à une partie du travail non structuré."],
        ["Application métier","Gestion des utilisateurs, droits, historique, écrans, dossiers, workflows et reporting ; adaptée à un processus qui doit être suivi et piloté."],
        ["Approche hybride","Un workflow orchestre, une IA propose, l'application présente et l'humain valide : cette combinaison est souvent plus contrôlable."]
      ]},
      {title:"Les six questions pour faire le bon choix",lead:"Répondez en langage métier, sans supposer la solution technique.",items:[
        ["Les règles sont-elles explicites ?","Quand toutes les conditions sont connues et vérifiables, une automatisation sans agent peut suffire."],
        ["Les entrées sont-elles variables ?","Des e-mails libres, comptes rendus ou contrats peuvent nécessiter extraction et interprétation, avec contrôle d'exactitude."],
        ["Y a-t-il un système de référence ?","L'ERP, le CRM ou le logiciel métier doit rester la source officielle pour les informations critiques."],
        ["Quel est le niveau de risque ?","Les paiements, droits individuels et actes administratifs réclament des validations formalisées."],
        ["Qui doit comprendre la décision ?","L'historique, les sources consultées et le motif d'une proposition doivent rester accessibles aux responsables."],
        ["Qui maintiendra la solution ?","Documentation, surveillance, gestion des versions et repli manuel comptent autant que la démonstration initiale."]
      ]},
      {title:"Une méthode de déploiement sans effet vitrine",lead:"Tester la partie la plus incertaine en premier, puis élargir le périmètre lorsque les résultats sont observables.",items:[
        ["Démonstration","Des exemples fictifs ou anonymisés permettent d'expliquer le flux sans se présenter comme une référence client."],
        ["Pilote","Données et utilisateurs réels mais périmètre limité, objectifs chiffrables et dispositif de reprise."],
        ["Mise en service","Permissions, vérification des cas limites, traçabilité, déploiement et formation."],
        ["Évolution","Surveillance de la qualité, des coûts, des incidents et des besoins métier pour décider des étapes suivantes."]
      ]}
    ],
    deliverables:["Matrice de choix workflow / IA / application","Liste des opérations autorisées et interdites","Preuves de contrôle des accès et points de validation","Critères de recette et de qualité","Documentation des échanges logiciels"],
    faq:[
      ["Un agent IA remplace-t-il une application ?","Non. Une application gère durablement les droits, dossiers, statuts et interactions ; un agent peut y être intégré pour certaines tâches."],
      ["Peut-on combiner n8n, API et modèles IA ?","Oui, si cela convient au contexte technique et aux exigences de sécurité. Le choix d'outillage doit suivre l'analyse du besoin."],
      ["À quel moment laisser l'IA agir seule ?","Lorsque le périmètre est autorisé, mesuré, réversible et suffisamment faible en risque. Les décisions sensibles restent validées par un responsable."]
    ],
    related:["cout-automatisation-ia","application-metier-ia","suivi-marches-publics-ia"]
  },
  "application-metier-ia": {
    eyebrow:"CONSTRUIRE · APPLICATION MÉTIER",
    title:"Créer une application métier sur mesure avec de l'IA : les étapes utiles",
    intro:"Quand l'équipe alterne entre tableurs, e-mails, pièces jointes et logiciels isolés, une application métier peut devenir l'interface commune. L'IA y prépare certaines opérations : classement, recherche, synthèse ou brouillon, sans brouiller les responsabilités.",
    metaTitle:"Application métier IA sur mesure : étapes et livrables | AUTONOMIA",
    metaDescription:"Comment cadrer et développer une application métier sur mesure intégrant l'IA : besoins utilisateurs, droits, architecture, intégrations, recette et accompagnement.",
    updated:"2026-10-16",
    summary:"Une bonne application doit être utilisable sans l'IA pour ses fonctions essentielles ; les fonctions d'IA viennent améliorer des étapes précisément identifiées.",
    highlights:[
      {label:"Point de départ",value:"Parcours utilisateur concret"},
      {label:"Socle",value:"Données, statuts et permissions"},
      {label:"IA",value:"Fonctions justifiées et contrôlées"}
    ],
    scenario:{
      eyebrow:"EXEMPLE · GESTION DE DOSSIERS",
      title:"Un dossier suivi de sa création à sa validation",
      context:"Une organisation doit réunir des pièces, instruire des demandes, solliciter un responsable et conserver la trace de chaque correction.",
      before:["Informations réparties dans plusieurs outils","Documents éparpillés","Statut demandé par e-mail","Corrections sans historique commun"],
      after:["Dossier centralisé avec droits et statuts","Lecture assistée des documents pertinents","Alertes et tâches proposées","Validation et journal d'audit par rôle"],
      caveat:"Exemple de conception, pas de résultat client. Les traitements de données et les intégrations sont étudiés au cas par cas."
    },
    sections:[
      {title:"Les sept décisions structurantes",lead:"Un développement commence par le fonctionnement des équipes, et non par une bibliothèque de composants.",items:[
        ["Utilisateurs","Qui crée, consulte, corrige, valide et administre ? Quelles actions sont déléguées et lesquelles sont réservées ?"],
        ["Modèle de données","Définir dossiers, documents, statuts, dates, relations et historique ; distinguer stockage et sources de vérité."],
        ["Sécurité","Choisir authentification, permissions, chiffrement, sauvegardes, journalisation et règles de conservation adaptées aux données."],
        ["Connexions","Repérer les API disponibles, contraintes des logiciels existants et échanges qui ne peuvent pas être automatisés."],
        ["Interface","Faire valider les écrans sur les vrais parcours utilisateurs, notamment les cas d'exception et les actions réversibles."],
        ["Fonctions IA","Limiter l'IA aux tâches où elle apporte un gain vérifiable : classification, extraction, résumé, rapprochement ou aide à la rédaction."],
        ["Exploitation","Définir qui traite les incidents, ajuste les règles, forme les nouveaux utilisateurs et maintient les intégrations."]
      ]},
      {title:"De l'atelier au logiciel exploitable",lead:"Des validations fréquentes permettent de réduire les ambiguïtés avant la mise en service.",items:[
        ["Cadrage","Décrire utilisateurs, étapes, documents, risques, contraintes techniques et définition de réussite."],
        ["Prototype","Rendre visible un parcours représentatif et recueillir les corrections des utilisateurs."],
        ["Développement","Construire les fonctions essentielles, les droits et la connexion aux sources autorisées."],
        ["Recette","Tester avec des cas nominaux, incomplets et contradictoires. Vérifier le repli en cas de panne d'une API ou du modèle."],
        ["Déploiement","Préparer les accès, la documentation, les sauvegardes, les responsables et la reprise."],
        ["Amélioration continue","Mesurer adoption, temps de traitement, erreurs et coûts récurrents."]
      ]},
      {title:"Comment éviter un outil qui ne sera pas utilisé",lead:"L'adoption se conçoit avant l'écriture de la première ligne de code.",items:[
        ["Commencer petit","Choisir un service ou un flux assez fréquent pour permettre une mesure, sans demander à tout le monde de changer en même temps."],
        ["Conserver la main","Un bouton de correction ou de rejet et un historique explicite sont plus utiles qu'une autonomie opaque."],
        ["Prévoir l'accompagnement","Guide d'utilisation, formation, support et responsabilités opérationnelles évitent l'abandon après le lancement."]
      ]}
    ],
    deliverables:["Cartographie des parcours et maquettes validées","Schéma des données, rôles et permissions","Backlog et périmètre de livraison clair","Application testée et documentée","Plan de déploiement, reprise et accompagnement"],
    faq:[
      ["Doit-on remplacer les logiciels existants ?","Pas nécessairement. Une nouvelle interface peut orchestrer plusieurs logiciels existants, sous réserve des droits et intégrations autorisées."],
      ["Peut-on construire l'application sans agent IA ?","Oui. Le socle métier doit être robuste indépendamment des composants génératifs. L'IA peut être ajoutée ensuite."],
      ["Qu'est-ce qui influence le devis ?","La complexité des rôles, des processus, des données, des intégrations, des exigences de sécurité et des modes d'exploitation."]
    ],
    related:["agent-ia-ou-automatisation","cout-automatisation-ia","suivi-marches-publics-ia"]
  },
  "suivi-marches-publics-ia": {
    eyebrow:"COLLECTIVITÉS · EXÉCUTION DES MARCHÉS",
    title:"Suivi administratif et financier des marchés publics : un outil qui assiste le gestionnaire",
    intro:"L'exécution d'un marché implique des dates, des pièces contractuelles, des engagements, des situations et parfois des avenants. Le besoin est d'avoir une vue exploitable et des alertes, tout en laissant les calculs engageants, arbitrages et validations aux professionnels compétents.",
    metaTitle:"Outil de suivi administratif et financier des marchés publics | AUTONOMIA",
    metaDescription:"Cas d'usage : centraliser le suivi administratif et financier d'un marché public, préparer les contrôles et conserver la décision humaine. Présentation fonctionnelle et cadrage.",
    updated:"2026-10-16",
    summary:"Une piste de solution consiste à relier les événements contractuels et financiers dans une interface compréhensible. Les automatismes préparent le contrôle, ils ne remplacent ni le service marché ni le technicien.",
    highlights:[
      {label:"Administratif",value:"Pièces, étapes et échéances"},
      {label:"Financier",value:"Engagements et situations à contrôler"},
      {label:"Gouvernance",value:"Vérification et visa du technicien"}
    ],
    scenario:{
      eyebrow:"EXEMPLE FICTIF · SERVICE ACHAT / TECHNIQUE",
      title:"Suivre une situation de travaux",
      context:"Un service reçoit une demande de paiement ou une situation, doit vérifier les documents, rapprocher les informations du marché et solliciter les bons responsables.",
      before:["Pièces éparses entre GED et messagerie","Échéances et validations suivies sur tableur","Écarts contrôlés séparément","Historique reconstitué lors du reporting"],
      after:["Dossier marché regroupant pièces et jalons","Signalement des éléments à rapprocher","Brouillon de synthèse et alerte à contrôler","Visa du gestionnaire ou technicien autorisé"],
      caveat:"Scénario entièrement illustratif ; la disponibilité des fonctions dépend du périmètre confirmé en atelier. Aucun produit déployé ni résultat client n'est revendiqué."
    },
    sections:[
      {title:"Ce qu'un gestionnaire doit garder sous les yeux",lead:"Le suivi administratif et financier se pense comme un processus contrôlable, pas une simple liste d'alertes.",items:[
        ["Cadre contractuel","Références, lots, titulaires, pièces applicables, actes et versions ; toute information critique doit être vérifiable dans sa source."],
        ["Échéances","Jalons, délais, étapes de validation, renouvellements et événements nécessitant une attention du service."],
        ["Éléments financiers","Montants initiaux, évolutions, engagements, situations et écarts potentiels à rapprocher avec les pièces justificatives."],
        ["Modifications","Avenants et événements de marché avec historique et références documentaires pour comprendre le contexte d'un calcul."],
        ["Traçabilité","Qui a préparé, vérifié, demandé une correction, validé ou rejeté ? L'historique doit rester lisible."]
      ]},
      {title:"Ce que l'automatisation peut préparer",lead:"Nous privilégions une assistance qui facilite la lecture et laisse les règles applicables aux professionnels.",items:[
        ["Contrôle de complétude","Proposer les pièces attendues et signaler un document absent, selon un référentiel construit avec l'équipe."],
        ["Rapprochement documentaire","Mettre en regard documents, références et données structurées lorsque les sources et droits le permettent."],
        ["Alertes","Signaler une échéance, une différence à expliquer ou une vérification restée en attente."],
        ["Préparation des décisions","Présenter un résumé, les sources, les limites et les points à confirmer avant toute décision."],
        ["Validation et correction","Le technicien et le gestionnaire vérifient la règle, peuvent modifier la proposition et enregistrent leur visa."]
      ]},
      {title:"Comment cadrer une mise en œuvre réaliste",lead:"Le périmètre dépend de votre organisation, du logiciel métier et des règles contractuelles à appliquer.",items:[
        ["Identifier les rôles","Acheteur, service technique, gestionnaire financier, ordonnateur et autres intervenants n'ont pas les mêmes droits ni validations."],
        ["Cartographier les pièces","Choisir les sources de vérité et les modalités d'accès au référentiel documentaire."],
        ["Documenter les calculs","Ne jamais inférer un montant engageant d'un texte imprécis ; la formule et les règles de validation sont explicites et testées."],
        ["Prototyper sur un marché type","Utiliser un jeu de données fictif ou anonymisé pour représenter les cas normaux et les anomalies."],
        ["Préparer l'adoption","Contrôles de sécurité, documentation, procédures de correction, reprise et formation des équipes."]
      ]}
    ],
    deliverables:["Cartographie du processus administratif et financier","Liste des données, pièces et sources contractuelles","Modèle des rôles, alertes et visas humains","Prototype de suivi sur données fictives","Plan d'intégration, tests et accompagnement"],
    faq:[
      ["L'outil remplace-t-il le logiciel financier ?","Le cas d'usage vise l'assistance au suivi. Une intégration au système financier dépend des autorisations, API et responsabilités de l'organisation."],
      ["L'IA peut-elle calculer et valider seule les paiements ?","Les calculs engageants doivent reposer sur des règles vérifiées et la décision reste aux agents habilités. Une proposition IA n'est pas une validation."],
      ["La présentation correspond-elle à un marché déjà déployé ?","Non. Cette page décrit une approche et un scénario de démonstration ; elle ne revendique ni déploiement ni gain constaté chez un client."]
    ],
    related:["agent-ia-ou-automatisation","application-metier-ia","cout-automatisation-ia"]
  }
};

export const buildGuideLinks = [
  ["cout-automatisation-ia","Prix d'une automatisation IA"],
  ["agent-ia-ou-automatisation","Agent IA ou workflow ?"],
  ["application-metier-ia","Application métier IA sur mesure"],
  ["suivi-marches-publics-ia","Suivi des marchés publics"]
];
