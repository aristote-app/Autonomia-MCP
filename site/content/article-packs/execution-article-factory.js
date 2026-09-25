function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const executionSourceSets = {
  email: [
    { label: "Google for Developers — Search and filter Gmail messages", url: "https://developers.google.com/workspace/gmail/api/guides/filtering" },
    { label: "Google for Developers — Manage Gmail labels", url: "https://developers.google.com/workspace/gmail/api/guides/labels" },
    { label: "Google for Developers — Create and send Gmail drafts", url: "https://developers.google.com/workspace/gmail/api/guides/drafts" }
  ],
  drive: [
    { label: "Google for Developers — Search for files and folders in Drive", url: "https://developers.google.com/workspace/drive/api/guides/search-files" },
    { label: "Google for Developers — Drive Labels overview", url: "https://developers.google.com/workspace/drive/api/guides/about-labels" },
    { label: "Google Drive Help — Gemini summaries and information in Drive", url: "https://support.google.com/drive/answer/16686465?hl=fr" }
  ],
  crm: [
    { label: "HubSpot Knowledge Base — Create workflows", url: "https://knowledge.hubspot.com/workflows/create-workflows" },
    { label: "Microsoft Learn — Sales insights in Teams meeting recap", url: "https://learn.microsoft.com/fr-fr/microsoft-sales-copilot/view-meeting-summary-recap" }
  ],
  meetings: [
    { label: "Google Meet Help — Take notes for me", url: "https://support.google.com/meet/answer/14754931?hl=fr" },
    { label: "Microsoft Graph — Create Planner tasks", url: "https://learn.microsoft.com/en-us/graph/api/planner-post-tasks" },
    { label: "Microsoft Learn — Power Automate approvals", url: "https://learn.microsoft.com/en-us/power-automate/get-started-approvals" }
  ],
  admin: [
    { label: "Microsoft Learn — Power Automate approvals", url: "https://learn.microsoft.com/en-us/power-automate/get-started-approvals" },
    { label: "Google for Developers — Read and write Google Sheets values", url: "https://developers.google.com/workspace/sheets/api/guides/values" },
    { label: "Google for Developers — Search for files and folders in Drive", url: "https://developers.google.com/workspace/drive/api/guides/search-files" }
  ],
  reporting: [
    { label: "Google for Developers — Read and write Google Sheets values", url: "https://developers.google.com/workspace/sheets/api/guides/values" },
    { label: "Google Sheets API — Batch update values", url: "https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate?hl=fr" },
    { label: "Microsoft Learn — Power BI dataset refresh API", url: "https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset" }
  ],
  support: [
    { label: "Zendesk Developer — Tickets API", url: "https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/" },
    { label: "Google for Developers — Manage Gmail threads", url: "https://developers.google.com/workspace/gmail/api/guides/threads" },
    { label: "Google for Developers — Search for files and folders in Drive", url: "https://developers.google.com/workspace/drive/api/guides/search-files" }
  ],
  rh: [
    { label: "Microsoft Graph — Permissions reference", url: "https://learn.microsoft.com/en-us/graph/permissions-reference" },
    { label: "Microsoft Graph — Manage groups", url: "https://learn.microsoft.com/en-us/graph/api/resources/groups-overview" },
    { label: "Google for Developers — Search for files and folders in Drive", url: "https://developers.google.com/workspace/drive/api/guides/search-files" }
  ],
  finance: [
    { label: "Microsoft Learn — Document Intelligence invoice model", url: "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/invoice?view=doc-intel-4.0.0" },
    { label: "Google for Developers — Read and write Google Sheets values", url: "https://developers.google.com/workspace/sheets/api/guides/values" },
    { label: "Microsoft Learn — Power Automate approvals", url: "https://learn.microsoft.com/en-us/power-automate/get-started-approvals" }
  ],
  btp: [
    { label: "Microsoft Graph — Create Planner tasks", url: "https://learn.microsoft.com/en-us/graph/api/planner-post-tasks" },
    { label: "Google for Developers — Search for files and folders in Drive", url: "https://developers.google.com/workspace/drive/api/guides/search-files" },
    { label: "Google for Developers — Manage Gmail threads", url: "https://developers.google.com/workspace/gmail/api/guides/threads" }
  ],
  knowledge: [
    { label: "Microsoft Learn — RAG and Generative AI in Azure AI Search", url: "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview?tabs=docs" },
    { label: "Google for Developers — Search for files and folders in Drive", url: "https://developers.google.com/workspace/drive/api/guides/search-files" },
    { label: "Google Drive API — Search query terms and operators", url: "https://developers.google.com/workspace/drive/api/guides/ref-search-terms" }
  ]
};

const defaultTags = {
  email: ["automation", "messaging_collaboration", "workflow_orchestration", "process_integration"],
  drive: ["automation", "files_documents", "knowledge_management", "process_integration"],
  crm: ["automation", "sales_automation", "workflow_orchestration", "process_integration"],
  meetings: ["automation", "messaging_collaboration", "workflow_orchestration", "human_in_loop"],
  admin: ["automation", "files_documents", "workflow_orchestration", "human_in_loop"],
  reporting: ["automation", "data", "analytics", "process_integration"],
  support: ["automation", "customer_support", "knowledge_management", "human_in_loop"],
  rh: ["automation", "change_adoption", "files_documents", "human_in_loop"],
  finance: ["automation", "files_documents", "data", "human_in_loop"],
  btp: ["automation", "workflow_orchestration", "files_documents", "human_in_loop"],
  knowledge: ["rag", "knowledge_management", "files_documents", "process_integration"]
};

const familyCopy = {
  email: {
    noun: "message",
    system: "messagerie",
    verb: "traiter",
    control: "brouillon, libellé ou tâche avant toute action engageante",
    data: "expéditeur, destinataires, objet, corps du message, fil, libellés, pièces jointes et horodatage",
    tooling: "Gmail API, règles Gmail, n8n, Make, Power Automate ou une couche d’orchestration équivalente"
  },
  drive: {
    noun: "document",
    system: "espace documentaire",
    verb: "classer et exploiter",
    control: "file de validation lorsque le classement, la synthèse ou la comparaison reste ambigu",
    data: "nom, type MIME, dossier parent, date de modification, propriétaire, contenu extractible, labels et droits d’accès",
    tooling: "Google Drive API, Drive Labels, Gemini dans Drive, n8n, Make ou un service d’extraction documentaire"
  },
  crm: {
    noun: "opportunité",
    system: "CRM",
    verb: "qualifier et suivre",
    control: "validation commerciale avant les changements qui influencent pipeline, montant, phase ou engagement client",
    data: "compte, contact, opportunité, historique d’activités, notes, e-mails, tâches, statut et prochaines étapes",
    tooling: "HubSpot, Salesforce, Dynamics ou un CRM exposant workflows, webhooks et API"
  },
  meetings: {
    noun: "réunion",
    system: "outil de collaboration et de gestion de projet",
    verb: "transformer en décisions et actions",
    control: "confirmation humaine pour les engagements, propriétaires et échéances sensibles",
    data: "transcription, notes, participants, décisions, actions, échéances, documents de contexte et identifiants de projet",
    tooling: "Google Meet, Microsoft Teams, Planner, Asana, Monday, Jira, n8n, Make ou Power Automate"
  },
  admin: {
    noun: "dossier",
    system: "processus administratif",
    verb: "structurer et contrôler",
    control: "validation humaine avant transmission, envoi externe ou modification d’une donnée de référence",
    data: "identifiant dossier, pièces, champs extraits, statut, échéances, demandeur, responsable, preuves et historique des relances",
    tooling: "Google Workspace, Microsoft 365, DMS, CRM métier, tableur, n8n, Make ou Power Automate"
  },
  reporting: {
    noun: "indicateur",
    system: "chaîne de reporting",
    verb: "consolider et expliquer",
    control: "séparation stricte entre faits calculés et hypothèses interprétatives",
    data: "valeurs, périodes, dimensions, sources, formules, seuils, historique et commentaires métiers",
    tooling: "Google Sheets, Excel, Power BI, Looker Studio, API de données et orchestrateur"
  },
  support: {
    noun: "ticket",
    system: "outil de support client",
    verb: "qualifier et assister",
    control: "validation humaine avant réponse sensible, clôture ou escalade engageante",
    data: "ticket, demandeur, canal, historique, statut, priorité, produit, pièces jointes, commentaires et base de connaissances",
    tooling: "Zendesk, HubSpot Service Hub, Freshdesk, Gmail, base de connaissances et orchestrateur"
  },
  rh: {
    noun: "dossier RH",
    system: "processus RH",
    verb: "préparer et assister",
    control: "validation humaine systématique pour les décisions concernant recrutement, évaluation, rémunération ou droits des personnes",
    data: "fiche de poste, CV, compétences déclarées, procédures, documents d’onboarding, réponses salariés et historique autorisé",
    tooling: "Microsoft 365, Google Workspace, ATS, SIRH, Drive, SharePoint et orchestrateur"
  },
  finance: {
    noun: "pièce financière",
    system: "processus finance et comptabilité",
    verb: "extraire, contrôler et synthétiser",
    control: "validation humaine avant comptabilisation, paiement, clôture ou diffusion d’un commentaire financier",
    data: "factures, montants, fournisseurs, dates, comptes, lignes, pièces justificatives, exports, budgets et données de trésorerie",
    tooling: "Document Intelligence, Google Sheets, Excel, ERP, logiciel comptable, Power Automate, n8n ou Make"
  },
  btp: {
    noun: "élément chantier",
    system: "suivi de chantier",
    verb: "structurer et suivre",
    control: "validation par le conducteur de travaux, la maîtrise d’œuvre ou le responsable désigné avant toute action engageante",
    data: "comptes rendus, réserves, photos, plans, entreprises, échéances, actions, documents et e-mails chantier",
    tooling: "Microsoft Planner, Teams, Google Drive, Gmail, outils chantier, n8n, Make ou Power Automate"
  },
  knowledge: {
    noun: "connaissance",
    system: "base documentaire d’entreprise",
    verb: "retrouver et sourcer",
    control: "réponses limitées aux sources accessibles avec citation et refus explicite lorsqu’aucune preuve suffisante n’est trouvée",
    data: "documents, métadonnées, droits, versions, texte indexé, extraits, labels, dates et propriétaires",
    tooling: "Google Drive, SharePoint, moteur de recherche hybride, base vectorielle, RAG et couche de contrôle des permissions"
  }
};

function paragraph(text) {
  return text.replace(/\s+/g, " ").trim();
}

export function buildExecutionArticle(spec) {
  const family = familyCopy[spec.family];
  const title = spec.title;
  const slug = slugify(title);
  const keyword = spec.primaryKeyword || title.toLowerCase();
  const sources = executionSourceSets[spec.family];
  const dek = spec.dek || `${spec.goal}. Le scénario part de ${spec.trigger} pour produire ${spec.output}, avec ${spec.human}.`;
  const summary = spec.summary || `Ce guide détaille une architecture concrète pour « ${title} » : données d’entrée, rôle de l’IA, règles métier, contrôles humains, exceptions, MVP et critères de mesure. Le cas est conçu autour de ${spec.inputs} et vise ${spec.goal}, sans confondre interprétation générative et décision métier.`;

  const sections = [
    {
      id: "situation",
      kicker: "01 — LE PROBLÈME RÉEL",
      heading: spec.problemHeading || `Pourquoi « ${title.toLowerCase()} » devient vite un sujet d’organisation, pas seulement d’outil.`,
      paragraphs: [
        paragraph(`Le point de départ est concret : ${spec.example}. Aujourd’hui, cette situation oblige généralement une personne à ouvrir plusieurs écrans, relire des informations déjà présentes, décider ce qui compte puis recopier le résultat ailleurs. Pris une fois, le geste paraît mineur. Répété plusieurs dizaines de fois par semaine, il crée une charge invisible, des écarts de qualité et des oublis. Le cas d’usage « ${title} » consiste donc moins à ajouter de l’IA qu’à rendre ce chemin de travail explicite et reproductible.`),
        paragraph(`Le déclencheur à observer est ${spec.trigger}. À partir de là, il faut distinguer trois choses : ce que le système sait avec certitude, ce qu’il peut interpréter avec une IA et ce qui doit rester une décision humaine. Cette séparation évite un piège fréquent : demander à un modèle de langage de décider librement alors qu’une règle métier simple suffirait. Dans ce scénario, la valeur vient de l’enchaînement des étapes, pas d’un prompt spectaculaire isolé.`),
        paragraph(`L’objectif opérationnel est ${spec.goal}. Cela suppose de produire ${spec.output}. La qualité du résultat dépend d’abord de la qualité des entrées et de la définition du résultat attendu. Une sortie utile doit être exploitable par l’étape suivante : une liste d’actions, des champs structurés, un statut, une synthèse courte ou un brouillon. Le format est donc défini avant le modèle, et non improvisé après avoir vu ce que l’IA génère.`),
        paragraph(`Dans ${family.system}, les utilisateurs ont déjà leurs habitudes, leurs conventions et leurs exceptions. Le projet ne doit pas les effacer. Il doit comprendre où se trouvent les informations de référence, qui a le droit de les modifier et à quel moment une personne doit reprendre la main. C’est cette cartographie qui permet de transformer une idée de cas d’usage en système réellement utilisable par une équipe, plutôt qu’en démonstration qui fonctionne uniquement sur un exemple propre.`),
        paragraph(`Le premier atelier de cadrage peut donc tenir sur une page : déclencheur, données disponibles, sortie attendue, règles certaines, interprétations possibles, actions autorisées et cas d’exception. On ajoute ensuite les volumes, les délais attendus et les personnes concernées. Ce document sert de contrat fonctionnel. Il permet à un métier, un formateur et un intégrateur de parler du même objet sans confondre « automatiser » avec « supprimer toute intervention humaine ».`)
      ]
    },
    {
      id: "architecture",
      kicker: "02 — L’ARCHITECTURE",
      heading: spec.architectureHeading || "Déclencheur → collecte → interprétation → règles → action → trace.",
      paragraphs: [
        paragraph(`La première brique est le déclencheur : ${spec.trigger}. Il doit être assez précis pour éviter de lancer le workflow sur des éléments hors périmètre. Un bon déclencheur peut être un nouveau message portant un libellé, un fichier déposé dans un dossier donné, une modification CRM, une fin de réunion ou une nouvelle ligne de données. Plus il est déterministe, plus la suite est facile à tester et à expliquer.`),
        paragraph(`La deuxième brique est la collecte. Pour ce cas, on travaille surtout avec ${spec.inputs}. On récupère uniquement les informations nécessaires à la décision. Dans la famille ${spec.family}, les données techniques typiques incluent ${family.data}. Le principe est de minimiser : une étape qui peut fonctionner avec cinq champs ne devrait pas aspirer tout un compte, tout un Drive ou tout un CRM « au cas où ».`),
        paragraph(`La troisième brique est l’interprétation. L’IA intervient pour ${spec.aiRole}. On lui demande une sortie structurée, avec des valeurs attendues et une possibilité explicite de répondre « information absente » ou « à vérifier ». Cette discipline évite qu’une formulation plausible soit transformée en donnée certaine. Lorsque la tâche peut être réalisée par une règle exacte, la règle garde la priorité ; le modèle intervient là où le texte ou le contexte sont réellement variables.`),
        paragraph(`La quatrième brique est la logique métier. Elle applique ${spec.rules}. Ces règles peuvent être stockées dans une table, un paramétrage CRM, un fichier de configuration ou directement dans le workflow si elles restent simples. L’important est qu’elles soient lisibles et modifiables sans réécrire tout le système. Une entreprise doit pouvoir expliquer pourquoi un élément a été routé vers telle personne, classé sous telle catégorie ou marqué comme nécessitant une validation.`),
        paragraph(`Enfin viennent l’action et la trace. L’action produit ${spec.output}. La trace conserve l’identifiant de la source, la date, la version du workflow, les valeurs importantes utilisées et la décision finale. Les briques techniques possibles sont ${spec.tooling || family.tooling}. Le choix exact dépend de l’environnement existant ; le pattern reste le même : connecter des systèmes, limiter les droits et rendre chaque action explicable.`)
      ]
    },
    {
      id: "donnees",
      kicker: "03 — LES DONNÉES",
      heading: spec.dataHeading || "Définir ce qui est une donnée, ce qui est une interprétation et ce qui est une décision.",
      paragraphs: [
        paragraph(`Le risque principal n’est pas toujours une mauvaise génération. Il peut venir d’une mauvaise donnée de départ. Dans ce scénario, les entrées critiques sont ${spec.inputs}. Il faut préciser leur source, leur fraîcheur et leur statut : donnée de référence, texte libre, document transmis par un tiers, commentaire utilisateur ou résultat déjà calculé. Deux champs portant le même nom peuvent avoir des niveaux de fiabilité très différents.`),
        paragraph(`La sortie doit séparer les faits des inférences. Par exemple, une date explicitement présente dans la source peut être stockée comme fait, tandis qu’une priorité estimée à partir du ton ou du contexte reste une interprétation. Pour « ${title} », l’IA ne doit pas transformer une absence d’information en valeur par défaut silencieuse. Un champ vide ou « à vérifier » est souvent plus utile qu’une réponse fluide mais inventée.`),
        paragraph(`Le schéma de sortie peut comporter quelques champs stables : catégorie, résumé, identifiant métier, responsable proposé, échéance explicite, niveau de confiance et raison de l’exception. La liste exacte dépend de ${spec.output}. L’objectif n’est pas de produire le maximum de données, mais le minimum nécessaire pour que l’étape suivante puisse agir. Cette contrainte améliore à la fois la lisibilité, les tests et la maintenabilité.`),
        paragraph(`Les droits d’accès doivent suivre le même principe. Si le workflow n’a besoin que de lire un sous-ensemble et de créer un brouillon, il n’a pas besoin d’un droit global d’administration. Les plateformes citées dans les sources documentent des APIs, des objets et des permissions qui permettent de construire des intégrations ciblées. Le paramétrage final doit néanmoins être revu selon la politique de sécurité et les comptes réellement utilisés dans l’organisation.`),
        paragraph(`Avant le déploiement, on constitue un petit jeu de données de test représentatif : cas normal, cas incomplet, doublon, contenu ambigu, valeur inattendue et élément qui ne doit pas être traité. Pour chacun, l’équipe écrit le résultat attendu. Cette table devient la base de recette. Elle est plus utile qu’une démonstration manuelle parce qu’elle permet de rejouer les mêmes situations après chaque évolution du workflow ou du prompt.`)
      ]
    },
    {
      id: "regles-ia",
      kicker: "04 — RÈGLES & IA",
      heading: spec.logicHeading || "L’IA interprète ; les règles métier gardent la structure.",
      paragraphs: [
        paragraph(`Le rôle du modèle est volontairement limité : ${spec.aiRole}. Il n’est pas chargé de piloter tout le processus. Autour de lui, des règles déterministes contrôlent les formats, les valeurs autorisées, les seuils et les destinations. Cette architecture hybride est souvent plus fiable qu’un agent auquel on donnerait immédiatement tous les outils et toute la liberté de décider.`),
        paragraph(`Une bonne instruction décrit le contexte, la tâche, les champs attendus et les critères d’absence. Elle peut demander une justification courte ou un extrait source pour les points sensibles. Pour ${title.toLowerCase()}, le prompt doit surtout empêcher les glissements : ne pas inventer de date, ne pas attribuer une action sans preuve, ne pas confondre une suggestion avec une décision et ne pas transformer une formulation incertaine en engagement.`),
        paragraph(`Les règles métier prennent ensuite le relais : ${spec.rules}. On peut prévoir des seuils simples. Si toutes les données obligatoires sont présentes et que le cas appartient à une catégorie connue, le workflow poursuit. Si un champ critique manque, il crée une exception. Si l’action est engageante, il demande une validation. Cette progression graduelle permet d’obtenir de la valeur sans chercher l’autonomie maximale dès la première version.`),
        paragraph(`Le modèle peut également être remplacé par une règle lorsque les cas deviennent suffisamment structurés. Si une catégorie est déterminée par une adresse d’expéditeur, un code ou un statut CRM, une condition exacte coûte moins cher et se teste plus facilement. À l’inverse, si la même intention est formulée de dizaines de manières, l’IA peut réduire la complexité des règles. Le design consiste à choisir le bon outil pour chaque décision.`),
        paragraph(`Pour les usages avancés, on peut ajouter une mémoire ou un accès documentaire, mais uniquement si le cas le justifie. ${spec.advanced}. Cette extension doit garder les mêmes principes : périmètre de données connu, sources identifiables, outils limités et validation pour les actions les plus sensibles. Un agent devient utile lorsque plusieurs décisions et outils doivent être orchestrés, pas simplement parce que le mot « agent » est à la mode.`)
      ]
    },
    {
      id: "humain",
      kicker: "05 — CONTRÔLE HUMAIN",
      heading: spec.humanHeading || "Choisir précisément l’endroit où l’humain doit reprendre la main.",
      paragraphs: [
        paragraph(`Le contrôle prévu ici est ${spec.human}. Cette étape ne doit pas être un vague « quelqu’un vérifie ». Il faut préciser qui vérifie, ce qu’il voit, quelles actions il peut prendre et ce qui se passe après sa décision. Une validation efficace fournit le contexte utile : source, proposition du système, champs concernés et raison pour laquelle le cas a été envoyé en revue.`),
        paragraph(`Toutes les actions n’ont pas le même niveau de risque. Lire, classer ou préparer un brouillon est généralement plus réversible qu’envoyer un message externe, modifier une donnée contractuelle ou déplacer une opportunité de phase. On peut donc définir plusieurs niveaux d’autonomie. Les actions faibles restent automatiques ; les actions engageantes passent par ${family.control}. Cette hiérarchie évite de bloquer tout le workflow au nom du risque.`),
        paragraph(`La correction humaine doit devenir une donnée d’amélioration. Si l’utilisateur modifie systématiquement la même catégorie, le même responsable ou la même formulation, le système signale un défaut de règle ou de consigne. On peut suivre le taux de validation sans modification, les champs les plus corrigés et les motifs de rejet. Ces mesures indiquent où investir du temps au lieu de réécrire tout le workflow après une erreur isolée.`),
        paragraph(`Il faut aussi prévoir le droit de ne rien automatiser. Certains cas sont rares, fortement contextuels ou trop engageants pour justifier une exécution automatique. Le workflow peut alors se limiter à rassembler les informations et préparer une synthèse. La personne garde la décision finale mais ne perd plus de temps à chercher la matière. Cette forme d’assistance est souvent un excellent premier niveau d’adoption.`),
        paragraph(`Le design du contrôle humain influence directement l’usage. Une validation qui demande dix clics ou oblige à rouvrir trois outils sera contournée. Une carte claire avec source, proposition et choix explicites peut au contraire s’intégrer au travail. Le test utilisateur doit donc mesurer non seulement la qualité de l’IA, mais aussi le temps et l’effort nécessaires pour confirmer ou corriger le résultat.`)
      ]
    },
    {
      id: "exceptions",
      kicker: "06 — ERREURS & SÉCURITÉ",
      heading: spec.exceptionHeading || "Un workflow professionnel doit savoir reconnaître ce qu’il ne sait pas traiter.",
      paragraphs: [
        paragraph(`Les exceptions prévues dès le départ sont ${spec.exceptions}. Elles doivent être transformées en branches normales du système. Une erreur d’authentification, un fichier illisible, un champ obligatoire absent ou une donnée contradictoire ne doivent pas disparaître dans un log technique. Chaque type d’échec reçoit une réponse : réessai, file d’attente, alerte, demande de correction ou arrêt contrôlé.`),
        paragraph(`Les doublons méritent une attention spécifique. Un événement peut être reçu deux fois, un utilisateur peut renvoyer un document ou une API peut relancer une requête. Le workflow doit disposer d’un identifiant métier ou technique permettant de reconnaître ce qui a déjà été traité. Sans cette logique d’idempotence, une automatisation peut créer plusieurs tâches, plusieurs lignes ou plusieurs relances à partir d’un seul événement.`),
        paragraph(`La sécurité commence par les permissions et la minimisation. Le compte technique doit avoir uniquement les droits nécessaires, et les données envoyées au modèle doivent être limitées à ce qui sert réellement à la tâche. Les secrets, clés et tokens ne doivent pas être placés dans le texte du workflow. Les environnements professionnels doivent aussi prévoir la rotation des accès et le transfert de propriété lorsqu’un collaborateur quitte l’organisation.`),
        paragraph(`L’observabilité complète le dispositif. Pour chaque exécution, on veut pouvoir retrouver la source, l’état, l’action finale et l’erreur éventuelle. Les logs doivent être assez précis pour diagnostiquer, sans recopier inutilement des données sensibles. Une vue simple des exécutions en échec, du volume traité et du nombre de validations manuelles suffit souvent pour une première version exploitable.`),
        paragraph(`Enfin, le workflow doit être réversible. Pour ${title.toLowerCase()}, on identifie les actions qui peuvent être annulées facilement et celles qui nécessitent une procédure. Cette réflexion conduit souvent à privilégier la création d’un brouillon, d’une proposition ou d’un statut intermédiaire avant l’action définitive. La robustesse vient moins de la promesse « zéro erreur » que de la capacité à détecter et corriger rapidement.`)
      ]
    },
    {
      id: "mvp",
      kicker: "07 — MVP",
      heading: spec.mvpHeading || "Commencer petit, sur un périmètre que l’équipe peut vraiment tester.",
      paragraphs: [
        paragraph(`Le MVP proposé est ${spec.mvp}. Il doit pouvoir fonctionner sur un volume limité et avec un propriétaire clairement identifié. On évite de connecter tout le système d’information dès la première semaine. Le but est de tester le besoin, la qualité des données et la charge de validation humaine avant d’investir dans davantage d’intégrations ou d’autonomie.`),
        paragraph(`La première recette utilise une dizaine à une cinquantaine de cas réels anonymisés ou autorisés. L’équipe compare la sortie du workflow à ce qu’elle aurait fait manuellement. Les écarts sont classés : donnée absente, mauvaise interprétation, règle métier incorrecte, problème d’accès, sortie peu utile. Cette taxonomie permet de corriger la bonne couche au lieu de modifier le prompt à chaque fois.`),
        paragraph(`Le déploiement peut ensuite avancer par paliers. D’abord lecture et suggestion. Puis création d’un brouillon ou d’une tâche. Ensuite écriture automatique des champs à faible risque. Enfin, si la qualité et les contrôles le justifient, certaines actions supplémentaires peuvent devenir automatiques. Chaque palier dispose de critères de passage et d’un moyen de revenir au niveau précédent.`),
        paragraph(`La documentation du MVP tient en quelques éléments : schéma du flux, liste des comptes et permissions, dictionnaire des champs, règles de routage, jeu de tests, procédure d’erreur et responsable métier. Ce minimum réduit énormément la dépendance à la personne qui a construit le scénario. Il facilite aussi la formation de nouveaux utilisateurs et les évolutions futures.`),
        paragraph(`Une fois le MVP stabilisé, ${spec.advanced}. L’extension ne doit cependant pas masquer la première question : le cas initial est-il réellement utilisé et apporte-t-il une amélioration observable ? Une automatisation supplémentaire n’est pertinente que si le workflow existant est compris, maintenu et intégré au quotidien.`)
      ]
    },
    {
      id: "mesure",
      kicker: "08 — MESURER & ÉTENDRE",
      heading: spec.measureHeading || "Mesurer l’usage réel avant de mesurer un ROI théorique.",
      paragraphs: [
        paragraph(`Les indicateurs utiles sont ${spec.measure}. Ils doivent être observables sans inventer une économie de temps. On peut mesurer le nombre de cas traités, le délai entre déclencheur et résultat, la part nécessitant une correction, les erreurs techniques et le taux d’utilisation. Si l’on veut estimer un gain de temps, il faut comparer sur un échantillon réel avant et après, avec une méthode explicite.`),
        paragraph(`La qualité ne se réduit pas à un pourcentage global. Pour ce cas, on peut suivre séparément la précision des champs critiques, la pertinence des actions proposées et le nombre de faux déclenchements. Une erreur sur un champ sans conséquence n’a pas le même poids qu’une mauvaise échéance ou qu’un envoi non souhaité. Les métriques doivent refléter le risque métier.`),
        paragraph(`L’adoption est tout aussi importante. Si les utilisateurs corrigent tout manuellement ou contournent le workflow, le système n’a pas atteint son objectif même si les tests techniques sont bons. Les retours doivent donc porter sur la clarté, la confiance, le temps de validation et la capacité à comprendre pourquoi une action a été proposée. Ces observations alimentent la prochaine version.`),
        paragraph(`Le cas « ${title} » peut ensuite devenir un pattern réutilisable. Une fois le déclencheur, la structure de données, les contrôles et la journalisation maîtrisés, l’équipe peut transposer la méthode à des processus proches. Elle ne repart pas de zéro : elle réutilise un modèle de conception et adapte les règles métier, les champs et les permissions.`),
        paragraph(`La trajectoire avancée consiste à relier plusieurs scénarios sans créer une automatisation opaque. ${spec.advanced}. À ce stade, l’enjeu est autant organisationnel que technique : ownership, catalogue des workflows, gouvernance des accès, documentation et montée en compétences. C’est ce passage d’un prototype isolé à une pratique d’entreprise qui transforme réellement l’IA en capacité opérationnelle.`)
      ]
    }
  ];

  return {
    type: "execution",
    slug,
    cluster: spec.cluster,
    title,
    dek,
    summary,
    readingTime: "18–24 min",
    publishedAt: "2026-09-25",
    modifiedAt: "2026-09-25",
    jobSignalTags: spec.jobSignalTags || defaultTags[spec.family],
    search: {
      primaryKeyword: keyword,
      secondaryQueries: spec.secondaryQueries || [
        keyword,
        `${keyword} entreprise`,
        `${keyword} automatisation`,
        `${keyword} workflow IA`
      ],
      demandEvidence: ["editorial_backlog", "commercial_intent"],
      observedAt: "2026-09-25"
    },
    quickFacts: [
      ["DÉCLENCHEUR", spec.trigger],
      ["ENTRÉES", spec.inputs],
      ["SORTIE", spec.output],
      ["GARDE-FOU", spec.human]
    ],
    sourceNote: `Les sources ci-dessous vérifient les briques techniques actuelles disponibles autour de ${family.tooling}. L’architecture décrite par Autonomia est un scénario de conception : les connecteurs, licences, permissions, politiques de données et règles métier doivent être vérifiés dans l’environnement réel avant mise en production.`,
    sources,
    faq: [
      ["Peut-on construire ce scénario sans développer une application complète ?", `Souvent oui pour un premier périmètre. Les outils cités exposent des connecteurs, APIs ou fonctions d’automatisation. Le low-code devient utile lorsque ${spec.exceptions} exigent une logique plus fine.`],
      ["Faut-il laisser l’IA agir automatiquement ?", `Non. Le niveau recommandé ici prévoit ${spec.human}. L’autonomie peut augmenter ensuite uniquement sur les actions réversibles et suffisamment testées.`],
      ["Quelles données faut-il préparer ?", `Le minimum utile est : ${spec.inputs}. Il faut également identifier la source de référence, les droits d’accès et les champs qui ne doivent jamais être déduits.`],
      ["Comment tester avant de déployer ?", `Construire un jeu de cas normaux et d’exceptions, notamment ${spec.exceptions}, puis comparer les sorties à un résultat attendu défini par le métier.`],
      ["Quel premier résultat viser ?", `Le MVP peut être : ${spec.mvp}. Cela permet d’observer la qualité et l’usage avant d’ajouter d’autres intégrations.`]
    ],
    sections
  };
}
