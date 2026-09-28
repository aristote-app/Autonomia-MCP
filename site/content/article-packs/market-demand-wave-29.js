import { buildTrainingArticle } from "./training-article-factory.js";

const specs = [
  {
    family: "manager",
    cluster: "Prompt engineering",
    title: "Apprendre à écrire un prompt avec objectif, contexte et contraintes",
    primaryKeyword: "formation prompt engineering entreprise",
    secondaryQueries: [
      "apprendre à écrire un bon prompt entreprise",
      "formation prompts IA professionnels",
      "prompt objectif contexte contraintes",
      "formation prompt engineering salariés"
    ],
    audience: "équipes métier, managers et collaborateurs qui utilisent une IA générative dans leur travail",
    objective: "transformer une demande vague en instruction claire, vérifiable et réutilisable sans faire croire qu’un « prompt magique » remplace la connaissance du métier",
    workshop: "partir de cinq demandes métier mal formulées puis reconstruire chaque prompt avec objectif, contexte, contraintes, données autorisées et critères de qualité",
    deliverable: "une fiche de conception de prompt réutilisable avec objectif, contexte, entrées, contraintes, format attendu, critères de vérification et cas où demander une clarification",
    assessment: "rédiger un prompt sur une nouvelle tâche métier puis expliquer quelles informations doivent être vérifiées avant d’utiliser la réponse",
    transfer: "transformer trois prompts réellement utilisés dans l’équipe en modèles documentés et comparables",
    guardrail: "un prompt ne doit jamais demander au modèle d’inventer une donnée manquante ou de masquer l’incertitude derrière une formulation assurée",
    example: "les collaborateurs utilisent déjà une IA générative mais obtiennent des résultats très variables parce que chacun formule ses demandes différemment et sans critères de sortie"
  },
  {
    family: "manager",
    cluster: "Prompt engineering",
    title: "Apprendre à demander une sortie structurée à une IA",
    primaryKeyword: "formation sortie structurée IA",
    secondaryQueries: [
      "prompt JSON sortie structurée IA",
      "formation IA extraction données structurées",
      "demander tableau à une IA",
      "prompt structure réponse entreprise"
    ],
    audience: "équipes métier, chefs de projet automatisation et utilisateurs avancés d’IA générative",
    objective: "passer d’une réponse libre difficile à réutiliser à une sortie structurée qui peut être contrôlée puis transmise à une étape de travail ou d’automatisation",
    workshop: "transformer des demandes de résumé, classification et extraction en sorties structurées avec champs obligatoires, valeurs autorisées et signalement explicite des informations absentes",
    deliverable: "un modèle de schéma de sortie avec types de champs, valeurs autorisées, règles d’absence, niveau de confiance et procédure de contrôle",
    assessment: "concevoir une sortie structurée pour un nouveau cas métier et détecter les champs qui ne doivent jamais être déduits automatiquement",
    transfer: "réutiliser le schéma sur un workflow ou une tâche réelle avant d’ajouter davantage d’automatisation",
    guardrail: "une valeur absente dans la source doit rester absente ou être marquée « à vérifier » plutôt que complétée par une hypothèse du modèle",
    example: "une équipe demande déjà à l’IA de résumer ou classifier des contenus mais doit ensuite relire et recopier manuellement la réponse parce qu’elle n’a pas de structure stable"
  },
  {
    family: "manager",
    cluster: "Adoption & conduite du changement",
    title: "Former des ambassadeurs IA internes",
    primaryKeyword: "formation ambassadeurs IA entreprise",
    secondaryQueries: [
      "programme ambassadeurs IA",
      "référents IA internes formation",
      "former champions IA entreprise",
      "réseau ambassadeurs intelligence artificielle"
    ],
    audience: "référents métier, managers, champions internes et responsables transformation chargés d’aider les équipes à adopter l’IA",
    objective: "créer un réseau interne capable d’identifier des cas d’usage, partager des méthodes, faire remonter les risques et accompagner les collègues sans devenir un support technique informel illimité",
    workshop: "construire le rôle d’un ambassadeur autour de situations concrètes : question utilisateur, cas d’usage, incident, partage de prompt, demande d’outil et besoin d’escalade",
    deliverable: "une charte d’ambassadeur IA avec périmètre, responsabilités, canaux, règles d’escalade, rituels, ressources communes et indicateurs d’activité",
    assessment: "traiter plusieurs situations simulées et décider lesquelles relèvent de l’accompagnement local, d’un partage de méthode ou d’une escalade vers IT, sécurité, juridique ou gouvernance",
    transfer: "lancer un premier rituel mensuel d’ambassadeurs avec collecte des cas d’usage, difficultés, incidents et méthodes réutilisables",
    guardrail: "l’ambassadeur n’autorise pas seul de nouveaux outils, ne valide pas les usages sensibles et ne remplace pas les fonctions sécurité, juridique, IT ou gouvernance",
    example: "l’entreprise a quelques utilisateurs très avancés mais leur expertise reste informelle, dépend des personnes et ne se diffuse pas de manière structurée"
  },
  {
    family: "direction",
    cluster: "Adoption & conduite du changement",
    title: "Apprendre à mesurer l’adoption sans confondre usage et valeur",
    primaryKeyword: "mesurer adoption IA entreprise",
    secondaryQueries: [
      "indicateurs adoption IA",
      "KPI adoption intelligence artificielle",
      "mesurer usage ChatGPT entreprise",
      "mesurer valeur IA collaborateurs"
    ],
    audience: "directions transformation, RH, managers, responsables IA et équipes chargées du déploiement",
    objective: "construire des indicateurs qui distinguent accès, fréquence d’usage, qualité d’usage, transfert au poste et valeur métier observée",
    workshop: "analyser un tableau de bord d’adoption volontairement trompeur puis reconstruire les indicateurs à partir de comportements, cas d’usage et résultats réellement observables",
    deliverable: "une matrice de mesure séparant accès, activation, usage, autonomie, qualité, valeur métier, risque et signaux d’abandon",
    assessment: "évaluer un nouveau programme d’adoption et expliquer quelles conclusions peuvent ou ne peuvent pas être tirées des données disponibles",
    transfer: "appliquer la matrice à un déploiement IA réel et supprimer les indicateurs qui ne permettent aucune décision opérationnelle",
    guardrail: "un taux de connexion ou un nombre de prompts ne doit jamais être présenté comme preuve suffisante de valeur ou de transformation du travail",
    example: "une organisation suit le nombre de comptes activés et de messages envoyés mais ne sait pas si les usages sont utiles, sûrs ou réellement intégrés aux processus"
  },
  {
    family: "finance",
    cluster: "Analyse de données",
    title: "Apprendre à analyser un fichier Excel avec une IA",
    primaryKeyword: "formation analyser Excel avec IA",
    secondaryQueries: [
      "formation IA Excel entreprise",
      "analyser fichier Excel ChatGPT entreprise",
      "IA analyse tableur formation",
      "formation données Excel intelligence artificielle"
    ],
    audience: "équipes finance, opérations, managers et collaborateurs qui travaillent régulièrement avec des tableaux Excel ou exports structurés",
    objective: "utiliser l’IA pour explorer, résumer et questionner un tableau sans confondre calcul exact, transformation de données et interprétation",
    workshop: "travailler sur un fichier contenant valeurs manquantes, catégories incohérentes, variations importantes et plusieurs dimensions puis distinguer ce qui doit être calculé de ce qui peut être interprété",
    deliverable: "une checklist d’analyse assistée avec préparation du fichier, contrôles, questions, calculs à reproduire, interprétations autorisées et éléments à vérifier",
    assessment: "analyser un nouveau fichier et produire une synthèse qui sépare résultats calculés, anomalies détectées, hypothèses et questions complémentaires",
    transfer: "appliquer la méthode à un tableau métier réel et documenter les calculs ou transformations qui doivent rester reproductibles hors du modèle",
    guardrail: "l’IA ne doit pas être utilisée comme calculatrice opaque lorsque le résultat peut être obtenu et vérifié par une formule ou une requête déterministe",
    example: "les équipes disposent de nombreux tableaux mais passent du temps à explorer manuellement les mêmes indicateurs et risquent de prendre une explication plausible pour une cause démontrée"
  },
  {
    family: "finance",
    cluster: "Analyse de données",
    title: "Apprendre à commenter une variation sans inventer sa cause",
    primaryKeyword: "formation analyse KPI IA",
    secondaryQueries: [
      "commenter KPI avec IA",
      "IA expliquer variation indicateur",
      "formation reporting IA entreprise",
      "éviter hallucination analyse données"
    ],
    audience: "contrôleurs de gestion, managers, analystes métier et responsables de reporting",
    objective: "produire des commentaires de performance utiles tout en séparant le constat chiffré, les corrélations disponibles et les causes qui restent à confirmer",
    workshop: "analyser plusieurs variations de KPI avec données partielles puis rédiger trois niveaux de commentaire : fait observé, hypothèses possibles et preuves nécessaires",
    deliverable: "une trame de commentaire KPI avec valeur, période, comparaison, seuil, éléments explicatifs disponibles, hypothèses et questions de validation",
    assessment: "commenter un nouvel écart en refusant d’attribuer une cause lorsque les données fournies ne permettent pas de la démontrer",
    transfer: "utiliser la trame dans un reporting mensuel puis faire relire les commentaires par le propriétaire métier de l’indicateur",
    guardrail: "aucune formulation causale ne doit être retenue uniquement parce qu’elle est plausible ; elle doit être reliée à une donnée ou explicitement présentée comme hypothèse",
    example: "un tableau de bord montre une baisse ou une hausse nette et l’IA peut facilement produire une explication convaincante même lorsque les données nécessaires à cette conclusion ne sont pas présentes"
  }
].map((spec) => ({
  ...spec,
  publishedAt: "2026-09-28",
  modifiedAt: "2026-09-28",
  observedAt: "2026-09-28"
}));

export const marketDemandExecutionArticlesWave29 = [];
export const marketDemandTrainingArticlesWave29 = specs.map(buildTrainingArticle);
