import { buildTrainingArticle } from "./training-article-factory.js";

const rhSpecs = [
  {
    family: "rh",
    cluster: "RH",
    title: "Former les RH à utiliser l’IA pour préparer des entretiens",
    audience: "équipes RH, recruteurs et managers impliqués dans les entretiens",
    objective: "utiliser l’IA pour préparer le cadre et les questions d’un entretien sans automatiser l’évaluation d’une personne",
    workshop: "partir d’une fiche de poste et d’un contexte d’entretien pour construire une trame structurée, des questions et des points à vérifier",
    deliverable: "une trame d’entretien avec objectifs, questions, critères explicites et éléments interdits à inférer",
    assessment: "préparer un nouvel entretien en distinguant informations disponibles, questions utiles et décisions qui doivent rester humaines",
    transfer: "réutiliser la trame pour harmoniser la préparation tout en gardant la conduite et l’évaluation entre les mains des personnes compétentes",
    guardrail: "l’IA ne produit ni verdict de recrutement, ni jugement de personnalité, ni décision individuelle à partir d’un CV ou d’un entretien",
    example: "les recruteurs et managers préparent leurs entretiens de façon hétérogène et oublient parfois des questions importantes liées au poste"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Apprendre à créer des grilles d’entretien structurées avec l’IA",
    audience: "RH, recruteurs et responsables de recrutement",
    objective: "construire des grilles cohérentes à partir des exigences réelles d’un poste sans créer de critères implicites ou discriminatoires",
    workshop: "transformer une fiche de poste en compétences observables, questions associées et éléments de preuve attendus",
    deliverable: "une grille d’entretien structurée avec critères observables, questions communes et espace de justification",
    assessment: "auditer une nouvelle grille et repérer les critères vagues, non liés au poste ou difficiles à justifier",
    transfer: "maintenir une bibliothèque de grilles par famille de postes avec revue RH régulière",
    guardrail: "aucun critère sensible ou non nécessaire n’est ajouté par inférence et la décision finale ne repose pas sur une note produite automatiquement",
    example: "deux recruteurs peuvent évaluer le même poste avec des questions et critères très différents, ce qui rend la comparaison difficile à expliquer"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Former les RH à produire des communications internes avec l’IA",
    audience: "RH, communication interne et managers",
    objective: "accélérer les premiers brouillons tout en préservant exactitude, ton, confidentialité et responsabilité éditoriale",
    workshop: "décliner une information RH validée en e-mail, FAQ courte et message manager selon plusieurs publics internes",
    deliverable: "un workflow éditorial avec source officielle, consigne de ton, contrôles et validation avant diffusion",
    assessment: "réviser une communication générée contenant ambiguïtés, promesses implicites et formulations trop génériques",
    transfer: "utiliser le workflow pour les communications récurrentes en conservant une source unique de vérité",
    guardrail: "l’IA ne crée aucune règle, date, droit ou engagement RH absent du document de référence",
    example: "une même information RH doit souvent être adaptée à plusieurs publics et canaux, ce qui prend du temps et crée parfois des formulations légèrement différentes"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Apprendre à créer un parcours d’onboarding assisté par IA",
    audience: "RH, managers et responsables onboarding",
    objective: "organiser l’accès aux informations utiles d’un nouvel arrivant selon son rôle sans exposer de documents non autorisés",
    workshop: "construire un parcours à partir de procédures, contacts, outils et questions fréquentes d’un poste",
    deliverable: "une carte d’onboarding avec séquence, sources, questions-réponses, points humains et éléments à personnaliser",
    assessment: "concevoir le parcours d’un autre poste en vérifiant droits d’accès, fraîcheur des sources et moments de contact humain",
    transfer: "réutiliser la structure par métier tout en gardant les responsables de contenu identifiés",
    guardrail: "l’assistant d’onboarding répond uniquement à partir des sources accessibles au nouvel arrivant et renvoie vers un humain pour les situations individuelles",
    example: "les nouveaux salariés reçoivent beaucoup de documents et de liens mais ne savent pas toujours quoi lire d’abord ni où trouver la version de référence"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Former les RH aux risques de biais dans les usages IA",
    audience: "RH, recruteurs, managers et responsables de transformation",
    objective: "repérer les situations où un usage IA peut amplifier des critères non pertinents ou rendre une décision individuelle difficile à expliquer",
    workshop: "analyser plusieurs usages RH et identifier données, variables, décisions, populations concernées et contrôles nécessaires",
    deliverable: "une grille de risque par usage avec points de vigilance, questions à poser et niveau de supervision humaine",
    assessment: "auditer un nouveau scénario RH et expliquer pourquoi certaines automatisations doivent rester limitées à l’assistance",
    transfer: "utiliser la grille avant tout nouveau projet IA concernant candidats, salariés, compétences ou performance",
    guardrail: "aucune décision concernant l’accès à l’emploi, l’évaluation, la rémunération ou les droits d’une personne n’est déléguée à une sortie IA non contrôlée",
    example: "une équipe souhaite utiliser l’IA pour gagner du temps sur des volumes importants mais ne distingue pas toujours assistance documentaire, recommandation et décision individuelle"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Apprendre à synthétiser les entretiens annuels avec contrôle humain",
    audience: "RH et managers utilisant des comptes rendus d’entretiens annuels",
    objective: "structurer les informations exprimées pendant l’entretien sans transformer une synthèse en évaluation automatique du salarié",
    workshop: "résumer des notes d’entretien en faits, objectifs déclarés, besoins exprimés et actions à confirmer",
    deliverable: "un modèle de synthèse avec provenance, champs à vérifier et validation du manager ou de la personne habilitée",
    assessment: "traiter un nouveau compte rendu et repérer toute interprétation qui dépasse ce qui a réellement été exprimé",
    transfer: "utiliser le modèle pour harmoniser la forme tout en conservant la responsabilité de validation humaine",
    guardrail: "le système ne déduit ni potentiel, ni engagement, ni performance future à partir du style ou du contenu d’un entretien",
    example: "les comptes rendus sont longs et hétérogènes, ce qui rend difficile la consolidation des besoins ou actions sans relire chaque document"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Former les RH à construire une FAQ interne assistée par IA",
    audience: "RH, communication interne et équipes support collaborateurs",
    objective: "répondre aux questions fréquentes en s’appuyant sur les procédures et documents validés plutôt que sur une mémoire informelle",
    workshop: "transformer un corpus RH limité et des questions récurrentes en réponses sourcées avec règles d’escalade",
    deliverable: "une FAQ assistée avec sources, propriétaire, date de revue et catégories de questions renvoyées vers un humain",
    assessment: "tester des questions ambiguës et vérifier que l’assistant refuse ou escalade lorsqu’aucune source ne suffit",
    transfer: "maintenir la FAQ à partir des questions réelles et des mises à jour documentaires",
    guardrail: "une réponse sur un cas individuel ou un droit non documenté est renvoyée vers la fonction RH compétente",
    example: "les mêmes questions sur congés, procédures ou outils reviennent régulièrement alors que les réponses existent dans plusieurs documents internes"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Apprendre à cartographier les compétences avec l’IA sans automatiser les décisions",
    audience: "RH, responsables formation et managers",
    objective: "structurer des compétences déclarées et des besoins métiers sans transformer une extraction documentaire en notation automatique des personnes",
    workshop: "construire une taxonomie à partir de fiches de poste, compétences déclarées et besoins d’activité puis tester le rapprochement",
    deliverable: "une carte de compétences avec sources, niveau déclaré ou observé, incertitudes et besoins de validation",
    assessment: "analyser un nouveau jeu de données et distinguer compétence explicitement documentée et compétence simplement supposée",
    transfer: "utiliser la cartographie pour préparer les discussions de développement sans automatiser les décisions RH",
    guardrail: "l’IA ne déduit pas une compétence, un potentiel ou une insuffisance à partir d’indices non conçus pour cette évaluation",
    example: "l’entreprise possède des fiches de poste, CV internes et données de formation mais manque d’une vue commune des compétences réellement déclarées"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Former les RH à identifier les besoins de formation IA",
    audience: "RH, responsables formation et managers",
    objective: "partir des tâches et des usages réels pour construire un plan de montée en compétences adapté aux populations",
    workshop: "cartographier plusieurs métiers selon tâches, usages IA existants, risques, niveau d’autonomie et compétences nécessaires",
    deliverable: "une matrice population par compétences avec priorités de formation, exercices et indicateurs de transfert",
    assessment: "concevoir le parcours d’une nouvelle population en justifiant les compétences retenues à partir du travail réel",
    transfer: "utiliser la matrice lors des plans de développement des compétences et revues d’adoption IA",
    guardrail: "la formation n’est pas décidée uniquement selon le nombre de fonctionnalités d’un outil mais selon les tâches, responsabilités et risques des populations",
    example: "l’entreprise veut former tout le monde à l’IA mais ne sait pas distinguer le socle commun des compétences spécifiques aux commerciaux, managers, RH ou fonctions support"
  },
  {
    family: "rh",
    cluster: "RH",
    title: "Apprendre à encadrer les usages IA des recruteurs",
    audience: "équipes recrutement, RH et managers recruteurs",
    objective: "définir ce que l’IA peut assister dans le recrutement et les points qui nécessitent une supervision renforcée",
    workshop: "passer en revue sourcing, préparation d’entretien, rédaction, synthèse, communication et décision pour définir les niveaux d’usage autorisés",
    deliverable: "une matrice d’usages recrutement avec données, outils, validation, interdictions et exemples concrets",
    assessment: "qualifier de nouveaux usages et expliquer pourquoi certains relèvent de l’assistance tandis que d’autres touchent directement à une décision individuelle",
    transfer: "utiliser la matrice comme référentiel opérationnel de l’équipe recrutement",
    guardrail: "les outils IA n’effectuent pas seuls de sélection, rejet ou classement déterminant l’accès d’une personne à un emploi",
    example: "les recruteurs utilisent déjà l’IA pour rédiger, résumer ou rechercher mais les limites sont parfois implicites et différentes selon les personnes"
  }
];

export const marketDemandExecutionArticlesWave25 = [];
export const marketDemandTrainingArticlesWave25 = rhSpecs.map(buildTrainingArticle);
