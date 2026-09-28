import { buildExecutionArticle } from "./execution-article-factory.js";

const specs = [
  {
    family: "legal",
    cluster: "Juridique & conformité",
    title: "Comparer deux versions d’un contrat avec l’IA",
    primaryKeyword: "comparer deux contrats avec IA",
    secondaryQueries: [
      "comparaison contrat IA",
      "comparer deux versions contrat automatiquement",
      "IA comparaison clauses contrat",
      "automatiser revue modifications contrat"
    ],
    goal: "repérer rapidement les changements entre deux versions d’un contrat sans confondre détection de différences et analyse juridique",
    trigger: "le dépôt d’une nouvelle version d’un contrat ou une demande de revue comparative",
    inputs: "version précédente, nouvelle version, métadonnées du contrat, clauses de référence, annexes et éventuels commentaires de négociation",
    output: "une matrice des différences avec clause concernée, ancienne formulation, nouvelle formulation, type de changement et lien vers les passages sources",
    aiRole: "rapprocher les clauses équivalentes malgré les changements de rédaction et résumer la nature de la modification",
    rules: "calculer les différences de structure de manière déterministe lorsque possible, conserver les deux formulations exactes et ne jamais conclure qu’un changement est acceptable juridiquement",
    human: "validation par un juriste ou responsable de contrat avant toute conclusion, acceptation ou communication externe",
    exceptions: "annexe ajoutée, clause déplacée, numérotation modifiée, OCR incomplet, version non comparable, commentaires non intégrés et documents de périmètres différents",
    mvp: "comparer deux contrats d’un même modèle et produire une matrice de changements sans recommandation juridique",
    advanced: "ajouter ensuite une bibliothèque de clauses de référence, une catégorisation des changements et un workflow de revue par niveau de risque défini par l’organisation",
    measure: "changements correctement détectés, clauses appariées, faux écarts, différences manquées, temps de revue et corrections du juriste",
    example: "un juriste reçoit plusieurs versions successives d’un contrat et passe du temps à retrouver ce qui a réellement changé avant même de commencer son analyse"
  },
  {
    family: "legal",
    cluster: "Juridique & conformité",
    title: "Extraire automatiquement les clauses clés d’un contrat",
    primaryKeyword: "extraire clauses contrat IA",
    secondaryQueries: [
      "extraction clauses contrat intelligence artificielle",
      "extraire obligations contrat automatiquement",
      "analyse contrat IA clauses",
      "automatiser fiche synthèse contrat"
    ],
    goal: "transformer un contrat long en une fiche de lecture structurée sans remplacer l’interprétation juridique",
    trigger: "l’arrivée d’un nouveau contrat dans un dossier de revue ou de gestion contractuelle",
    inputs: "contrat, annexes, type de document, liste de clauses attendues, parties, dates et métadonnées disponibles",
    output: "une fiche structurée avec clauses repérées, parties, dates, obligations explicites, échéances, extraits sources et champs à vérifier",
    aiRole: "repérer les passages correspondant aux catégories de clauses attendues et extraire les informations formulées en texte libre",
    rules: "conserver les extraits sources, laisser vide ce qui n’est pas trouvé, distinguer clause absente et clause non reconnue et ne pas produire d’avis juridique",
    human: "validation par la fonction juridique avant que les données extraites deviennent une référence contractuelle",
    exceptions: "contrat scanné, annexes séparées, définitions croisées, clause répartie sur plusieurs articles, référence externe, version non signée et document bilingue",
    mvp: "extraire cinq familles de clauses sur un type de contrat récurrent avec citation systématique du passage source",
    advanced: "connecter ensuite la fiche contractuelle aux alertes d’échéance, à la recherche documentaire et au référentiel de clauses internes",
    measure: "clauses correctement repérées, extraits exacts, champs manquants signalés, corrections juridiques et temps de première lecture",
    example: "une équipe juridique doit ouvrir chaque contrat pour retrouver les mêmes informations de base avant d’entamer la revue de fond"
  },
  {
    family: "logistics",
    cluster: "Logistique & supply chain",
    title: "Trier les e-mails transporteurs et extraire les incidents logistiques",
    primaryKeyword: "automatiser e-mails transporteurs IA",
    secondaryQueries: [
      "IA incidents logistiques email",
      "classifier emails transporteurs automatiquement",
      "automatiser suivi retard livraison email",
      "workflow logistique transport IA"
    ],
    goal: "faire remonter rapidement les messages transport qui nécessitent une action sans transformer chaque e-mail en tâche manuelle",
    trigger: "la réception d’un e-mail provenant d’un transporteur ou d’une adresse de suivi logistique autorisée",
    inputs: "expéditeur, objet, corps du message, fil, références de commande ou d’expédition, dates, pièces jointes et statut déjà connu",
    output: "une classification du message avec référence, type d’incident, date ou délai mentionné, niveau d’attention proposé et lien vers le fil source",
    aiRole: "interpréter les formulations variables utilisées par les transporteurs pour décrire retards, refus, dommages, absence de livraison ou besoin d’information",
    rules: "extraire les références exactes par règle lorsque possible, limiter les catégories à une taxonomie connue et ne jamais modifier le statut final d’une livraison sur la seule base d’une interprétation générative",
    human: "validation par l’équipe logistique avant réclamation, changement de priorité important ou communication engageante au client",
    exceptions: "plusieurs expéditions dans un même e-mail, référence absente, notification automatique redondante, pièce jointe illisible, message en langue inattendue et incident déjà traité",
    mvp: "classifier les e-mails de deux transporteurs dans cinq catégories et produire une file d’incidents à valider",
    advanced: "relier ensuite les références aux commandes, créer des alertes SLA et rapprocher l’incident des données de livraison ou du TMS",
    measure: "messages correctement classés, incidents réellement actionnables, doublons, références reconnues, corrections et délai de qualification",
    example: "une équipe logistique reçoit de nombreuses notifications transport et doit ouvrir chaque message pour déterminer s’il s’agit d’une information standard ou d’un incident à traiter"
  },
  {
    family: "logistics",
    cluster: "Logistique & supply chain",
    title: "Créer automatiquement une fiche incident à partir d’un e-mail",
    primaryKeyword: "fiche incident logistique automatique",
    secondaryQueries: [
      "automatiser fiche incident transport",
      "IA suivi incident livraison",
      "email vers fiche incident logistique",
      "automatisation incident supply chain"
    ],
    goal: "créer une trace structurée et exploitable dès qu’un incident logistique est identifié dans un message",
    trigger: "un e-mail classé comme incident ou validé comme nécessitant un suivi",
    inputs: "message source, référence d’expédition, fournisseur ou transporteur, type d’incident, dates, commande liée, pièces jointes et responsable opérationnel",
    output: "une fiche incident avec identifiant, source, catégorie, référence, description factuelle, statut initial, propriétaire et éléments manquants",
    aiRole: "résumer le problème en langage opérationnel et extraire les informations utiles lorsqu’elles ne sont pas structurées",
    rules: "générer l’identifiant et les statuts par règles, conserver le lien vers l’e-mail d’origine et empêcher la création d’un doublon pour le même événement",
    human: "validation du propriétaire et de la qualification avant déclenchement d’une réclamation fournisseur ou d’une communication externe",
    exceptions: "incident déjà ouvert, référence ambiguë, plusieurs incidents dans le même fil, événement sans impact réel, message transféré et données contradictoires",
    mvp: "créer une fiche préremplie dans un tableau de suivi et laisser l’équipe confirmer catégorie et responsable",
    advanced: "synchroniser ensuite la fiche avec le TMS ou l’ERP, suivre les actions et construire une analyse des causes récurrentes",
    measure: "incidents capturés, doublons évités, champs corrigés, temps de création, incidents sans responsable et délai de clôture",
    example: "les incidents sont aujourd’hui conservés dans les boîtes mail puis recopiés dans un tableau seulement lorsqu’une personne pense à le faire"
  },
  {
    family: "consulting",
    cluster: "Conseil & services professionnels",
    title: "Transformer un entretien client en brief de mission",
    primaryKeyword: "transformer entretien client en brief IA",
    secondaryQueries: [
      "IA brief mission conseil",
      "résumer entretien client brief",
      "automatiser compte rendu découverte client",
      "entretien client vers cadrage mission"
    ],
    goal: "transformer rapidement un entretien de découverte en cadrage exploitable sans effacer les incertitudes ni les formulations du client",
    trigger: "la fin d’un entretien client ou le dépôt de notes et transcription dans le dossier de mission",
    inputs: "notes, transcription autorisée, participants, contexte commercial, documents transmis, questions posées et éléments explicitement validés pendant l’échange",
    output: "un brief structuré avec problème, objectifs, périmètre, parties prenantes, contraintes, livrables évoqués, questions ouvertes, décisions et citations utiles",
    aiRole: "regrouper les informations dispersées, distinguer les thèmes et reformuler les éléments explicites dans une structure de cadrage",
    rules: "séparer faits, attentes, hypothèses et questions ouvertes, conserver les formulations sources pour les points sensibles et ne jamais transformer une suggestion en engagement client",
    human: "validation par le consultant ou responsable de mission avant diffusion interne ou envoi au client",
    exceptions: "plusieurs sujets mélangés, entretien incomplet, participant non décisionnaire, objectifs contradictoires, budget non confirmé, transcription partielle et éléments confidentiels",
    mvp: "transformer cinq entretiens réels en briefs structurés puis comparer le résultat au cadrage produit manuellement",
    advanced: "relier ensuite le brief au CRM, aux propositions commerciales, au plan de mission et à la base de connaissances des missions passées",
    measure: "éléments correctement repris, questions ouvertes conservées, hypothèses supprimées, temps de cadrage, corrections du consultant et réutilisation du brief",
    example: "après un entretien client, le consultant doit relire ses notes et reconstruire manuellement le contexte avant de préparer une proposition ou une réunion de cadrage"
  },
  {
    family: "consulting",
    cluster: "Conseil & services professionnels",
    title: "Créer une première structure de livrable à partir d’un cadrage",
    primaryKeyword: "générer structure livrable IA",
    secondaryQueries: [
      "IA structure rapport conseil",
      "créer plan livrable automatiquement",
      "cadrage vers structure rapport IA",
      "automatiser préparation livrable conseil"
    ],
    goal: "proposer une architecture initiale de livrable cohérente avec le cadrage sans générer artificiellement les conclusions de la mission",
    trigger: "la validation d’un brief de mission ou d’une étape de cadrage suffisamment précise",
    inputs: "brief validé, objectifs, livrables attendus, audience, contraintes, méthodes prévues, données disponibles, jalons et standards internes",
    output: "une structure de livrable avec sections, objectif de chaque partie, questions à résoudre, preuves attendues et éléments restant à produire",
    aiRole: "organiser le cadrage en une séquence logique de sections et faire apparaître les zones qui nécessitent encore des analyses ou des preuves",
    rules: "ne jamais préremplir une conclusion non démontrée, distinguer structure et contenu final, conserver les exigences explicites du client et signaler les sections sans matière disponible",
    human: "validation par le chef de mission avant que la structure devienne le plan de production de l’équipe",
    exceptions: "plusieurs livrables, objectifs encore instables, audience multiple, méthode non choisie, données indisponibles, format client imposé et périmètre en négociation",
    mvp: "produire trois variantes de structure à partir d’un cadrage validé puis faire choisir et corriger la meilleure par l’équipe",
    advanced: "connecter ensuite la structure aux sources, modèles internes, résultats d’ateliers et gestion des tâches de production",
    measure: "sections conservées, sections supprimées, ordre modifié, temps de préparation, lacunes détectées et taux de réutilisation des structures",
    example: "une équipe de conseil repart d’une page blanche pour structurer chaque livrable alors que le cadrage contient déjà une grande partie des questions auxquelles le document devra répondre"
  }
].map((spec) => ({
  ...spec,
  publishedAt: "2026-09-28",
  modifiedAt: "2026-09-28",
  observedAt: "2026-09-28"
}));

export const marketDemandExecutionArticlesWave28 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave28 = [];
