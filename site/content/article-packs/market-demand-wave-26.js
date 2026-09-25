import { buildTrainingArticle } from "./training-article-factory.js";

const financeSpecs = [
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Former une équipe administrative à traiter des e-mails avec l’IA",
    audience: "équipes administratives, back-office et fonctions support",
    objective: "utiliser l’IA pour trier, résumer et préparer les réponses sans automatiser les décisions ni les envois sensibles",
    workshop: "traiter une boîte de démonstration avec demandes, pièces jointes, messages incomplets et cas nécessitant une escalade humaine",
    deliverable: "une grille de traitement des e-mails avec catégories, données à extraire, règles de réponse, validation et exceptions",
    assessment: "traiter une nouvelle série de messages en choisissant ce qui peut être préparé, routé ou doit rester entièrement manuel",
    transfer: "réutiliser la grille sur une boîte fonctionnelle pilote avant toute automatisation plus large",
    guardrail: "aucune réponse engageante, donnée sensible ou décision administrative n’est envoyée automatiquement sans règle explicite et validation adaptée",
    example: "une équipe lit chaque jour de nombreux e-mails pour comprendre la demande, télécharger une pièce, la classer puis préparer une réponse"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Apprendre à extraire les données d’un document avec l’IA",
    audience: "équipes administratives, finance, comptabilité et opérations",
    objective: "transformer des PDF ou scans en données structurées tout en contrôlant champs absents, OCR et valeurs critiques",
    workshop: "extraire dates, références, montants et identifiants à partir de documents de formats différents puis comparer aux valeurs attendues",
    deliverable: "un schéma d’extraction avec champs, formats, validation, niveau de confiance et lien vers le document source",
    assessment: "traiter un nouveau lot de documents et laisser vide toute information non présente ou ambiguë",
    transfer: "réutiliser la méthode dans des workflows de saisie assistée ou de contrôle documentaire",
    guardrail: "une valeur non trouvée n’est jamais inventée et les montants, dates ou identifiants critiques restent vérifiables dans la pièce source",
    example: "les mêmes informations sont ressaisies depuis des devis, attestations ou factures alors qu’elles apparaissent à des emplacements différents selon le document"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Former la finance à commenter un tableau sans inventer les causes",
    audience: "équipes finance, contrôle de gestion et managers",
    objective: "utiliser l’IA pour transformer des indicateurs en commentaire lisible sans attribuer de causalité non démontrée",
    workshop: "partir d’un tableau de KPI calculés et distinguer faits, variations, seuils, informations contextuelles disponibles et questions à investiguer",
    deliverable: "un modèle de commentaire de gestion séparant observation, contexte sourcé, hypothèse et action de vérification",
    assessment: "commenter un nouveau tableau en refusant d’expliquer une variation lorsqu’aucune donnée ne permet d’en établir la cause",
    transfer: "utiliser le modèle dans les reportings périodiques et revues de performance",
    guardrail: "l’IA reformule les chiffres calculés mais ne crée jamais une cause pour rendre le commentaire plus convaincant",
    example: "un tableau montre une variation importante et le commentaire attendu pousse facilement à inventer une explication simplement parce qu’elle paraît plausible"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Apprendre à créer des synthèses de gestion avec l’IA",
    audience: "finance, contrôle de gestion, direction administrative et managers",
    objective: "condenser plusieurs sources de gestion en une note utile tout en gardant les chiffres, périodes et périmètres vérifiables",
    workshop: "assembler un tableau, une note opérationnelle et des commentaires métiers pour produire une synthèse structurée",
    deliverable: "une trame de synthèse avec faits clés, écarts, points à confirmer, décisions attendues et liens vers les sources",
    assessment: "produire une nouvelle synthèse sans mélanger périodes, périmètres ou chiffres issus de sources différentes",
    transfer: "réutiliser la trame pour les revues mensuelles en gardant les calculs hors du modèle",
    guardrail: "les calculs et agrégations structurantes restent réalisés dans les outils de données ; l’IA intervient sur l’explication et la mise en forme contrôlée",
    example: "plusieurs tableaux et commentaires existent déjà mais une personne doit encore reconstruire manuellement les messages essentiels avant chaque revue"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Former les fonctions support à automatiser les tâches répétitives",
    audience: "équipes administratives, finance, opérations et fonctions support",
    objective: "identifier les tâches qui gagnent à être automatisées et celles qui nécessitent encore jugement, contrôle ou échange humain",
    workshop: "cartographier les tâches d’une semaine puis sélectionner un processus pilote selon fréquence, règles, données, exceptions et risque",
    deliverable: "un backlog d’automatisation avec déclencheur, étapes, outils, validations, exceptions et propriétaire",
    assessment: "analyser un nouveau processus et justifier pourquoi certaines étapes restent manuelles",
    transfer: "réutiliser la grille lors des revues d’organisation et projets no-code",
    guardrail: "une tâche n’est pas automatisée uniquement parce qu’elle est répétitive ; l’impact d’une erreur, les exceptions et les droits d’accès doivent être compris",
    example: "les fonctions support accumulent des copier-coller, téléchargements, renommages, relances et mises à jour qui semblent simples mais n’ont jamais été cartographiés"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Apprendre à contrôler un résultat produit par une IA",
    audience: "fonctions support, managers et utilisateurs professionnels d’IA générative",
    objective: "construire une méthode de vérification adaptée aux documents, chiffres, synthèses et décisions préparés avec l’IA",
    workshop: "auditer plusieurs sorties contenant omissions, erreurs factuelles, données mal recopiées et formulations correctes mais insuffisamment sourcées",
    deliverable: "une checklist de contrôle par type de résultat avec critères, source à vérifier et règle d’escalade",
    assessment: "valider ou rejeter un nouveau livrable en documentant précisément les corrections nécessaires",
    transfer: "intégrer la checklist dans les procédures de production assistée par IA",
    guardrail: "la fluidité du texte ou la confiance apparente du modèle n’est jamais utilisée comme preuve d’exactitude",
    example: "les collaborateurs gagnent du temps en générant des synthèses mais ne savent pas toujours quels éléments contrôler en priorité avant de les réutiliser"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Former l’administratif à construire des modèles de courriers IA",
    audience: "équipes administratives, relation usager ou client et back-office",
    objective: "préparer des courriers cohérents à partir de modèles validés sans inventer dates, droits, montants ou décisions",
    workshop: "transformer plusieurs modèles existants en structure réutilisable avec variables, sources et zones obligatoirement validées",
    deliverable: "une bibliothèque de modèles assistés avec champs d’entrée, règles de ton, éléments interdits et validation",
    assessment: "produire un courrier sur un nouveau dossier en identifiant toutes les informations qui doivent provenir du dossier source",
    transfer: "utiliser les modèles sur des catégories récurrentes avant d’élargir à des cas plus sensibles",
    guardrail: "aucune information administrative engageante n’est complétée par supposition lorsque la donnée manque au dossier",
    example: "une équipe réécrit régulièrement des courriers proches mais doit rester très précise sur les références, dates, montants et décisions propres à chaque dossier"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Apprendre à automatiser la collecte de pièces avec du no-code",
    audience: "administration, finance, comptabilité, achats et gestion de dossiers",
    objective: "orchestrer demandes, relances et réception de pièces sans perdre la traçabilité ni harceler les interlocuteurs",
    workshop: "construire un workflow qui identifie les pièces manquantes, prépare une relance, enregistre la réponse et met à jour le statut du dossier",
    deliverable: "un workflow no-code documenté avec liste de pièces, règles de relance, arrêt, doublon et validation",
    assessment: "traiter un dossier comportant pièce reçue hors canal, doublon et justificatif non conforme",
    transfer: "piloter le workflow sur une seule typologie de dossier avant extension",
    guardrail: "les relances s’arrêtent dès qu’une pièce est validée et toute non-conformité nécessitant une interprétation revient à un humain",
    example: "une personne suit manuellement dans un tableau les documents reçus, relance les mêmes interlocuteurs puis cherche les pièces dans plusieurs canaux"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Former la finance à créer des rapports lisibles pour les métiers",
    audience: "finance, contrôle de gestion et équipes de reporting",
    objective: "adapter la restitution financière aux questions des métiers sans simplifier au point de déformer les données",
    workshop: "transformer un reporting dense en synthèse destinée à un responsable opérationnel avec indicateurs, écarts et questions",
    deliverable: "un format de rapport métier avec définitions, période, comparatif, commentaire et lien vers le détail",
    assessment: "réécrire un nouveau reporting en conservant les chiffres, limites et définitions nécessaires à leur compréhension",
    transfer: "utiliser la structure dans les revues finance-métiers et ajuster selon les questions réellement posées",
    guardrail: "une reformulation plus accessible ne modifie ni le périmètre, ni la période, ni la définition d’un indicateur",
    example: "les métiers reçoivent des tableaux exacts mais peinent à comprendre rapidement ce qui a changé, ce qui est significatif et quelles questions poser"
  },
  {
    family: "finance",
    cluster: "Finance & administratif",
    title: "Apprendre à utiliser l’IA avec des données sensibles sans les exposer",
    audience: "finance, administratif, managers et utilisateurs manipulant des données internes",
    objective: "réduire les données transmises aux outils d’IA et choisir des usages compatibles avec les règles de l’organisation",
    workshop: "examiner plusieurs prompts et workflows pour identifier données personnelles, financières, contractuelles ou confidentielles inutiles à la tâche",
    deliverable: "une grille de minimisation avec finalité, donnée nécessaire, outil autorisé, anonymisation possible et validation",
    assessment: "reformuler un nouveau cas d’usage pour obtenir le même résultat avec moins de données exposées",
    transfer: "utiliser la grille avant la création de nouveaux prompts, assistants ou workflows",
    guardrail: "une donnée sensible n’est jamais envoyée à un outil simplement parce qu’elle est disponible ; sa nécessité, sa finalité et l’environnement autorisé doivent être établis",
    example: "un collaborateur copie un document complet dans un assistant alors que seules quelques lignes ou valeurs seraient nécessaires pour réaliser la tâche"
  }
];

export const marketDemandExecutionArticlesWave26 = [];
export const marketDemandTrainingArticlesWave26 = financeSpecs.map(buildTrainingArticle);
