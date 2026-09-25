import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Créer un moteur de recherche IA sur les documents internes",
    "permettre une recherche conversationnelle sur les documents autorisés sans masquer les fichiers sources",
    "des résultats classés et une synthèse citée vers les passages pertinents",
    "comprendre la requête, combiner recherche lexicale et sémantique et reformuler les extraits retrouvés",
    "respecter les droits documentaires, conserver les métadonnées et refuser de répondre sans source",
    "indexer un corpus métier limité et afficher résultats et citations avant toute génération longue",
    "les utilisateurs connaissent l’existence des documents mais ne retrouvent pas les bons fichiers avec une simple recherche par nom"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Créer un assistant qui cite ses sources dans la documentation d’entreprise",
    "répondre aux questions internes avec preuves explicites plutôt qu’avec une réponse plausible non vérifiable",
    "une réponse courte avec citations, liens, date de source et signalement des informations absentes",
    "sélectionner les extraits pertinents et construire la réponse uniquement à partir d’eux",
    "exiger au moins une source, filtrer par droits et ne pas fusionner silencieusement des sources contradictoires",
    "répondre à une cinquantaine de questions test sur un corpus validé avec citations visibles",
    "un chatbot interne répond vite mais les utilisateurs ne savent pas d’où vient l’information ni si elle est encore à jour"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Connecter l’IA aux procédures, contrats et comptes rendus internes",
    "réunir plusieurs familles documentaires dans une recherche contrôlée sans mélanger leurs niveaux d’autorité",
    "une réponse sourcée distinguant procédure, contrat, décision de réunion et document informatif",
    "retrouver des passages dans plusieurs collections et les présenter selon leur type",
    "définir une hiérarchie de sources, respecter les droits et signaler toute contradiction",
    "connecter trois collections limitées avec filtres de type et date",
    "les réponses à une question opérationnelle peuvent dépendre à la fois d’une procédure, d’un contrat et d’une décision prise en réunion"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Créer une base de connaissances à partir de Google Drive et Notion",
    "fédérer des contenus répartis entre deux outils sans perdre métadonnées, version et provenance",
    "un index commun avec source, URL, date de modification, type et droits",
    "normaliser les contenus et permettre une recherche unifiée",
    "conserver l’identifiant source, réindexer les modifications et ne pas dupliquer les pages déjà référencées",
    "indexer un espace Drive et une base Notion limités à un même métier",
    "les équipes stockent certaines procédures dans Drive et d’autres dans Notion, ce qui crée deux recherches séparées"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Retrouver automatiquement les décisions passées dans les comptes rendus",
    "reconstruire l’historique des décisions sans relire manuellement des dizaines de comptes rendus",
    "une chronologie de décisions avec date, participants, formulation source et documents liés",
    "détecter les formulations de décision et rapprocher les sujets similaires dans le temps",
    "ne pas confondre proposition et décision et conserver la source exacte de chaque entrée",
    "extraire les décisions de six mois de comptes rendus d’un comité pilote",
    "l’organisation sait qu’une décision a été prise mais ne retrouve plus dans quel compte rendu ni dans quels termes"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Créer une FAQ interne dynamique à partir des documents existants",
    "répondre aux questions fréquentes en s’appuyant directement sur les documents de référence",
    "des réponses sourcées organisées en FAQ et mises à jour lorsque la source change",
    "regrouper les questions proches et retrouver les passages qui y répondent",
    "ne publier que les réponses validées et marquer automatiquement celles dont la source a été modifiée",
    "créer vingt réponses sur un corpus stable puis mettre en place une alerte de changement source",
    "les salariés posent des questions répétitives alors que la réponse existe dans des documents longs difficiles à parcourir"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Détecter les documents contradictoires dans une base de connaissances",
    "faire remonter les zones où deux sources de référence donnent des informations incompatibles",
    "une liste de contradictions potentielles avec passages, dates, propriétaires et statut de revue",
    "rapprocher des passages portant sur le même sujet et signaler les assertions incompatibles",
    "ne pas décider quelle source fait foi automatiquement et prioriser les métadonnées de version et d’autorité",
    "analyser un corpus limité de procédures sur les mêmes thèmes et produire une file de revue",
    "plusieurs versions ou procédures ont évolué séparément et peuvent donner aux salariés des consignes différentes"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Identifier les informations obsolètes avant de les exposer à un assistant IA",
    "réduire le risque qu’un assistant cite des documents anciens comme s’ils étaient encore valides",
    "un inventaire des contenus à revoir avec âge, dernière modification, propriétaire et signaux d’obsolescence",
    "repérer les références datées, versions anciennes et contenus peu maintenus",
    "utiliser des critères explicites d’ancienneté et de statut et ne pas supprimer automatiquement un document",
    "auditer les documents les plus consultés avant leur indexation RAG",
    "une base documentaire contient des procédures anciennes dont certaines ne sont plus applicables mais restent accessibles"
  ],
  [
    "knowledge",
    "Knowledge management & recherche interne",
    "Créer un onboarding assisté par IA à partir de la documentation interne",
    "aider un nouvel arrivant à trouver rapidement les procédures et ressources utiles à son rôle",
    "un parcours de questions-réponses sourcées, liens essentiels et modules de découverte par thème",
    "retrouver les contenus pertinents selon le poste et répondre aux questions du nouvel arrivant",
    "personnaliser selon le rôle, respecter les droits et rediriger les questions individuelles vers les personnes compétentes",
    "construire un assistant d’onboarding sur un corpus de procédures et ressources validées",
    "un nouvel arrivant reçoit de nombreux liens et documents mais ne sait pas dans quel ordre les lire ni où poser ses questions"
  ],
  [
    "marketing",
    "Marketing & contenu",
    "Créer des variantes de landing pages adaptées à plusieurs intentions",
    "décliner une offre selon des intentions réellement distinctes sans produire des pages quasi dupliquées",
    "des structures de pages différenciées par problème, audience, preuve attendue et appel à l’action",
    "adapter angle, ordre des blocs et vocabulaire à l’intention choisie",
    "conserver les faits et preuves identiques, éviter les fausses différences et vérifier la cannibalisation SEO",
    "produire deux variantes réellement distinctes pour deux intentions validées avant publication",
    "une même offre répond à plusieurs problèmes mais les landing pages actuelles utilisent exactement le même argumentaire pour tous les visiteurs"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave19 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave19 = [];
