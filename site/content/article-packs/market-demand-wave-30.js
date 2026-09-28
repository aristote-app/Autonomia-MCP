import { buildTrainingArticle } from "./training-article-factory.js";

const aiLiteracySources = [
  {
    label: "Commission européenne — AI talent, skills and literacy",
    url: "https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy"
  },
  {
    label: "Commission européenne — AI Literacy Questions & Answers",
    url: "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers"
  },
  {
    label: "NIST — AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  }
];

const aiRiskSources = [
  {
    label: "Commission européenne — cadre réglementaire européen sur l’intelligence artificielle",
    url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
  },
  {
    label: "NIST — AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  },
  {
    label: "OECD.AI — principes de l’OCDE sur l’intelligence artificielle",
    url: "https://oecd.ai/en/ai-principles"
  }
];

const ragSources = [
  {
    label: "Microsoft Learn — RAG and Generative AI in Azure AI Search",
    url: "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview?tabs=docs"
  },
  {
    label: "Google for Developers — Search for files and folders in Drive",
    url: "https://developers.google.com/workspace/drive/api/guides/search-files"
  },
  {
    label: "NIST — AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  }
];

const specs = [
  {
    family: "manager",
    cluster: "Agents IA",
    title: "Former une équipe à comprendre ce qu’est réellement un agent IA",
    primaryKeyword: "formation agents IA entreprise",
    secondaryQueries: [
      "formation agent IA entreprise",
      "comprendre agents IA formation",
      "formation agentic AI entreprise",
      "agent IA workflow différence"
    ],
    audience: "équipes métier, managers, chefs de projet et responsables transformation qui évaluent ou utilisent des solutions agentiques",
    objective: "distinguer un agent IA d’un chatbot, d’un copilote et d’un workflow automatisé en raisonnant par objectifs, outils, mémoire, permissions, décisions et niveau d’autonomie",
    workshop: "comparer quatre architectures répondant au même besoin — assistant, workflow, copilote avec outils et agent — puis identifier ce que chaque niveau ajoute en capacité, risque et supervision",
    deliverable: "une grille de lecture d’un agent IA avec objectif, outils autorisés, données, mémoire, décisions, actions, permissions, validation humaine, journalisation et conditions d’arrêt",
    assessment: "analyser une nouvelle solution présentée comme « agent IA » et expliquer quelles capacités sont réellement agentiques, lesquelles relèvent d’un workflow et quelles preuves manquent",
    transfer: "utiliser la grille lors des prochains cadrages, démonstrations fournisseurs et ateliers de conception agentique",
    guardrail: "le terme « agent » ne doit jamais être utilisé comme justification suffisante pour accorder plus de permissions, plus de données ou davantage d’autonomie",
    example: "plusieurs fournisseurs et équipes parlent d’agents IA alors que les systèmes présentés vont du simple chatbot à des workflows capables d’agir dans plusieurs outils"
  },
  {
    family: "manager",
    cluster: "Agents IA",
    title: "Apprendre à choisir entre workflow classique et agent IA",
    primaryKeyword: "workflow ou agent IA",
    secondaryQueries: [
      "workflow vs agent IA",
      "quand utiliser agent IA",
      "formation workflow agentique",
      "choisir automatisation ou agent IA"
    ],
    audience: "chefs de projet IA, responsables automatisation, managers et métiers qui doivent choisir une architecture",
    objective: "choisir le niveau d’autonomie adapté à un processus plutôt que partir directement vers un agent lorsque des règles déterministes suffisent",
    workshop: "cartographier plusieurs processus puis décider pour chaque étape si elle relève d’une règle, d’une interprétation LLM, d’un workflow orchestré ou d’un agent capable de choisir entre plusieurs actions",
    deliverable: "une matrice de choix workflow-agent avec variabilité du processus, nombre d’outils, réversibilité, qualité des données, coût d’erreur, besoin de planification et contrôle humain",
    assessment: "proposer une architecture pour un nouveau cas d’usage et justifier pourquoi certaines étapes doivent rester déterministes tandis que d’autres peuvent devenir agentiques",
    transfer: "réutiliser la matrice avant tout nouveau projet d’agent pour challenger le niveau d’autonomie demandé",
    guardrail: "l’architecture la plus autonome n’est pas considérée comme la plus avancée si elle augmente inutilement le coût de contrôle ou le risque d’erreur",
    example: "une équipe envisage un agent capable de lire des demandes, choisir un outil et agir alors qu’une partie importante du processus suit déjà des règles stables"
  },
  {
    family: "direction",
    cluster: "Gouvernance & AI Act",
    title: "Former les collaborateurs à l’AI literacy en entreprise",
    primaryKeyword: "formation AI literacy entreprise",
    secondaryQueries: [
      "AI literacy formation salariés",
      "formation littératie IA entreprise",
      "AI Act article 4 formation",
      "formation utilisation responsable IA salariés"
    ],
    sources: aiLiteracySources,
    audience: "collaborateurs, managers, référents IA et personnes utilisant ou supervisant des systèmes d’IA dans leur activité professionnelle",
    objective: "donner un socle de compréhension adapté aux usages réels : capacités et limites, qualité des sources, données, supervision humaine, risques, règles internes et bonnes pratiques d’utilisation",
    workshop: "analyser une série de situations de travail réelles et décider ce qui relève d’un usage acceptable, d’un besoin de vérification, d’une escalade ou d’un usage hors cadre",
    deliverable: "une fiche de bonnes pratiques AI literacy adaptée aux outils, données, responsabilités et cas d’usage de l’organisation",
    assessment: "traiter de nouveaux scénarios et identifier les limites du système, les vérifications nécessaires, les données à ne pas transmettre et la personne ou fonction à solliciter en cas de doute",
    transfer: "intégrer la fiche aux parcours d’onboarding, communications internes, communautés de pratique et formations métier",
    guardrail: "la sensibilisation ne doit pas être réduite à une liste d’interdictions : elle doit donner aux personnes des repères concrets pour utiliser l’IA avec discernement dans leur contexte de travail",
    example: "les collaborateurs utilisent déjà plusieurs outils d’IA mais disposent de niveaux de compréhension très différents sur leurs capacités, leurs limites et les règles applicables dans l’entreprise"
  },
  {
    family: "direction",
    cluster: "Gouvernance & AI Act",
    title: "Apprendre aux équipes à identifier un usage IA à risque",
    primaryKeyword: "formation risques IA entreprise",
    secondaryQueries: [
      "identifier usage IA à risque",
      "formation AI Act risques",
      "évaluer risque cas usage IA",
      "classification risque IA entreprise"
    ],
    sources: aiRiskSources,
    audience: "équipes métier, managers, responsables IA, juridique, conformité, sécurité et chefs de projet",
    objective: "repérer les caractéristiques d’un usage qui nécessitent davantage de revue : impact sur des personnes, décision sensible, données personnelles, autonomie, irréversibilité, droits, sécurité ou dépendance à des informations difficiles à vérifier",
    workshop: "classer plusieurs cas d’usage selon leur contexte, les personnes affectées, les données, l’action produite, le niveau de supervision et les conséquences possibles puis identifier les questions encore ouvertes",
    deliverable: "une grille de préqualification du risque avec contexte, données, personnes concernées, décision, niveau d’autonomie, contrôles, preuves et besoin d’escalade",
    assessment: "analyser un nouveau cas d’usage sans sur-classer ni sous-classer le risque et expliquer quelles informations supplémentaires sont nécessaires avant décision",
    transfer: "utiliser la grille comme première étape avant revue juridique, sécurité, gouvernance ou validation d’un nouvel outil IA",
    guardrail: "la grille pédagogique ne remplace pas l’analyse juridique de l’AI Act ou des autres textes applicables ; elle sert à détecter les cas qui méritent une revue plus approfondie",
    example: "les métiers proposent de nombreux usages IA mais les équipes support ne disposent pas toujours d’un filtre simple pour distinguer une aide rédactionnelle banale d’un système qui influence une décision concernant une personne"
  },
  {
    family: "manager",
    cluster: "Knowledge management",
    title: "Apprendre à préparer les documents avant de construire un RAG",
    primaryKeyword: "formation RAG entreprise documents",
    secondaryQueries: [
      "préparer documents pour RAG",
      "formation base documentaire IA",
      "RAG documentation interne formation",
      "préparer knowledge base intelligence artificielle"
    ],
    sources: ragSources,
    audience: "équipes knowledge management, métiers, DSI, chefs de projet IA et responsables documentaires",
    objective: "préparer un corpus réellement exploitable par un assistant documentaire en travaillant sources, versions, métadonnées, droits, qualité du texte et périmètre avant de parler d’embeddings ou de base vectorielle",
    workshop: "auditer un petit corpus contenant doublons, documents obsolètes, droits différents, scans, versions contradictoires et fichiers sans propriétaire puis décider ce qui peut être indexé",
    deliverable: "une checklist de préparation RAG avec source, propriétaire, version, fraîcheur, droits, qualité d’extraction, métadonnées, statut et règle d’exclusion",
    assessment: "évaluer un nouveau corpus et expliquer quels documents peuvent entrer dans le système, lesquels nécessitent une correction et lesquels doivent rester exclus",
    transfer: "appliquer la checklist à un espace documentaire réel avant tout prototype RAG ou assistant de recherche interne",
    guardrail: "un moteur RAG ne transforme pas automatiquement une base documentaire mal gouvernée en source fiable ; les défauts de version, de droit ou de contenu doivent être traités explicitement",
    example: "l’entreprise veut créer un assistant documentaire mais son Drive ou SharePoint contient plusieurs versions, des fichiers sans propriétaire et des documents dont le statut n’est pas clair"
  },
  {
    family: "manager",
    cluster: "Knowledge management",
    title: "Apprendre à exiger des citations de sources dans un assistant interne",
    primaryKeyword: "formation assistant IA citations sources",
    secondaryQueries: [
      "RAG citations sources formation",
      "assistant documentaire sourcé IA",
      "formation hallucinations RAG",
      "évaluer réponse assistant interne"
    ],
    sources: ragSources,
    audience: "métiers, knowledge managers, chefs de projet IA et utilisateurs d’assistants documentaires internes",
    objective: "évaluer une réponse interne non seulement sur sa fluidité mais sur son ancrage dans les sources, la précision des citations, leur fraîcheur et la capacité du système à dire qu’il ne sait pas",
    workshop: "comparer des réponses avec citation exacte, citation partielle, source obsolète, contradiction entre documents et absence de preuve puis construire une grille de validation",
    deliverable: "une grille d’évaluation des réponses RAG avec réponse, citation, passage source, date, autorité documentaire, contradiction, information absente et décision de validation",
    assessment: "évaluer de nouvelles réponses et refuser celles dont la formulation paraît correcte mais dont la source ne soutient pas réellement l’affirmation",
    transfer: "utiliser la grille comme jeu de tests avant chaque évolution importante de l’assistant ou du corpus documentaire",
    guardrail: "une citation visible n’est pas une preuve suffisante si le passage cité ne soutient pas l’affirmation ou si la source n’est plus la version de référence",
    example: "un assistant interne produit des réponses convaincantes et affiche parfois des liens, mais les utilisateurs ne disposent pas encore d’une méthode commune pour vérifier que les sources prouvent réellement ce qui est affirmé"
  }
].map((spec) => ({
  ...spec,
  publishedAt: "2026-09-28",
  modifiedAt: "2026-09-28",
  observedAt: "2026-09-28"
}));

export const marketDemandExecutionArticlesWave30 = [];
export const marketDemandTrainingArticlesWave30 = specs.map(buildTrainingArticle);
