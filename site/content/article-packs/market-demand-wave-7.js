export const marketDemandExecutionArticlesWave7 = [
  {
    type: "execution",
    slug: "creer-un-rapport-narratif-a-partir-d-un-google-sheet",
    cluster: "Data & reporting",
    title: "Automatiser un reporting IA à partir de Google Sheets : chiffres calculés, commentaire généré, contrôle humain",
    dek: "Un bon reporting IA ne demande pas au modèle d’inventer ce qui s’est passé. Il sépare les calculs déterministes, les anomalies réellement observées, le commentaire génératif et la validation humaine avant diffusion.",
    summary: "Google Sheets sait aujourd’hui intégrer des fonctions IA, générer des analyses et produire des graphiques avec Gemini, tandis qu’Apps Script permet d’exécuter des traitements sur déclencheur ou selon une fréquence définie. Le vrai travail d’architecture consiste donc à décider quelles métriques sont calculées par des formules ou du code, quelles observations peuvent être confiées à un modèle, comment éviter les causalités inventées, comment citer la période et la source, puis comment produire un rapport lisible qui reste auditable.",
    readingTime: "20–24 min",
    publishedAt: "2026-09-22",
    modifiedAt: "2026-09-22",
    jobSignalTags: ["data", "analytics", "automation", "reporting", "google_workspace", "workflow_orchestration"],
    search: {
      primaryKeyword: "automatiser reporting IA",
      secondaryQueries: [
        "reporting automatique IA",
        "Google Sheets IA reporting",
        "rapport automatique Google Sheets",
        "générer commentaire KPI IA",
        "automatiser rapport hebdomadaire IA"
      ],
      demandEvidence: ["serp_observed", "official_product_docs"],
      observedAt: "2026-09-22"
    },
    quickFacts: [
      ["POINT DE DÉPART", "Google Sheets ou autre source structurée"],
      ["RÔLE DE L’IA", "Synthèse · explication prudente · mise en forme"],
      ["CALCULS", "Formules / SQL / code avant génération"],
      ["GARDE-FOU", "Ne jamais transformer une corrélation en cause certaine"]
    ],
    sourceNote: "Google documente actuellement l’analyse de données, la génération d’insights, la création de graphiques et des fonctions IA directement dans Sheets. Apps Script documente les déclencheurs installables et planifiés. Microsoft documente également la génération de résumés Power BI ancrés dans les données du rapport. Le scénario Autonomia ci-dessous combine ces capacités dans une architecture générique de reporting. Le workflow réel doit être adapté aux sources, aux droits, aux règles de calcul et aux contrôles internes de l’entreprise.",
    sources: [
      {
        label: "Google Docs Editors Help — Collaborer avec Gemini dans Google Sheets",
        url: "https://support.google.com/docs/answer/14356410?hl=fr"
      },
      {
        label: "Google Docs Editors Help — Utiliser la fonction AI dans Google Sheets",
        url: "https://support.google.com/docs/answer/15877199?hl=fr"
      },
      {
        label: "Google for Developers — Installable triggers dans Apps Script",
        url: "https://developers.google.com/apps-script/guides/triggers/installable"
      },
      {
        label: "Microsoft Learn — Summarize a report with Copilot in Power BI",
        url: "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-pane-summarize-content"
      }
    ],
    faq: [
      ["L’IA peut-elle calculer directement tous les KPI ?", "Elle peut aider à manipuler ou interpréter des données, mais les KPI critiques doivent idéalement être calculés par des formules, requêtes ou règles déterministes. Le modèle peut ensuite commenter les résultats fournis."],
      ["Peut-on envoyer automatiquement le rapport chaque semaine ?", "Oui. Un workflow peut être déclenché par un planificateur, Apps Script, un outil d’automatisation ou une plateforme de données. Il faut toutefois prévoir les cas où les données ne sont pas à jour ou sont incomplètes."],
      ["Comment empêcher l’IA d’inventer la cause d’une variation ?", "Il faut séparer explicitement fait et hypothèse. Le prompt peut interdire d’affirmer une cause non présente dans les données et demander une formulation du type « hypothèses à investiguer » lorsque l’explication n’est pas vérifiable."],
      ["Faut-il utiliser Gemini si les données sont dans Google Sheets ?", "Pas obligatoirement. Gemini est intégré à l’écosystème Google, mais un workflow peut aussi récupérer les données via API puis appeler un autre modèle. Le choix dépend des droits, de l’architecture, du coût et de la gouvernance."],
      ["Peut-on utiliser ce système pour un COMEX ?", "Oui, à condition de définir un niveau de contrôle plus fort : sources identifiées, métriques certifiées, validation humaine, distinction entre données constatées et commentaires génératifs."],
      ["Que faire si les données changent après la génération du rapport ?", "Le rapport doit porter une période, une date de génération et idéalement un identifiant de version ou de snapshot. Sans cela, il devient difficile de comparer la narration à l’état réel des données au moment où elle a été produite."]
    ],
    sections: [
      {
        id: "probleme",
        kicker: "01 — LE PROBLÈME",
        heading: "Le reporting n’est pas difficile parce qu’il faut écrire. Il est difficile parce qu’il faut savoir ce qui est vrai.",
        paragraphs: [
          "Dans beaucoup d’équipes, le reporting hebdomadaire commence par un tableau. Les chiffres sont déjà là : volume de ventes, demandes entrantes, tickets, factures, marge, avancement, absentéisme, délai moyen ou taux de conversion. Pourtant, une personne doit encore ouvrir le fichier, vérifier que les données sont à jour, repérer les variations, recopier quelques valeurs dans un document, écrire trois paragraphes, préparer un graphique et envoyer le résultat. Le travail rédactionnel n’est qu’une partie du processus. Le vrai coût vient de la reconstitution du contexte.",
          "L’idée d’ajouter de l’IA semble évidente : demander au modèle de lire le tableau puis d’écrire le rapport. C’est précisément là que les problèmes commencent. Un modèle sait très bien produire un texte convaincant. Il sait beaucoup moins garantir qu’un chiffre a été calculé selon la bonne définition métier, qu’une période est comparable à la précédente ou qu’une variation est causée par l’événement qu’il imagine. Un commentaire plausible peut être plus dangereux qu’un commentaire absent.",
          "La bonne architecture inverse donc le réflexe. On ne demande pas à l’IA de produire le reporting complet à partir d’un fichier brut. On prépare d’abord une couche de données fiables : métriques calculées, périodes définies, comparaisons explicites, valeurs manquantes signalées et éventuels seuils d’alerte. Ensuite seulement, le modèle reçoit une représentation structurée de ce qui peut être raconté.",
          "Cette séparation crée un système beaucoup plus robuste. La donnée calcule. Le modèle formule. L’humain valide les points où l’interprétation engage une décision. Le rapport devient plus rapide à produire sans transformer l’IA en source de vérité."
        ]
      },
      {
        id: "architecture",
        kicker: "02 — L’ARCHITECTURE",
        heading: "Source → métriques certifiées → observations → narration → validation → diffusion.",
        paragraphs: [
          "La première brique est la source. Il peut s’agir d’un Google Sheet alimenté manuellement, d’un export CRM, d’un tableau financier ou d’un jeu de données synchronisé. Le système doit savoir quelle feuille, quelle plage et quelle période constituent la référence. Si plusieurs sources existent, il faut décider laquelle fait foi avant d’ajouter la couche IA.",
          "La deuxième brique est le calcul. Les totaux, moyennes, ratios, variations et seuils sont calculés par des formules, du SQL ou du code. Par exemple : chiffre d’affaires de la semaine, évolution par rapport aux quatre semaines précédentes, taux de conversion, nombre de dossiers incomplets et valeur des opportunités arrivant à échéance. Ces calculs sont déterministes et testables.",
          "La troisième brique est l’observation. On transforme les métriques en faits structurés : « le volume a augmenté de 12 % », « trois valeurs sont absentes », « la région A représente 42 % du total », « le taux de conversion baisse depuis deux périodes ». Cette couche peut être produite par du code ou assistée par un modèle, mais elle doit rester vérifiable dans les données.",
          "La quatrième brique est la narration. Le modèle reçoit les faits, la période, le public visé, le format souhaité et des règles strictes : ne jamais inventer de cause, ne pas extrapoler au-delà de la période, distinguer constat et hypothèse, citer les chiffres utilisés, signaler les données insuffisantes. Il peut alors produire une synthèse exécutive beaucoup plus utile qu’un simple copier-coller de KPI.",
          "La cinquième brique est la validation. Pour un rapport opérationnel interne, une relecture rapide peut suffire. Pour un COMEX, un reporting financier ou un document client, la validation doit porter sur les chiffres et sur la formulation. Enfin, la diffusion peut être automatisée : document, e-mail, Slack, Teams, portail interne ou archive Drive."
        ],
        steps: [
          { title: "1. Figer le périmètre", text: "Définir source, période, propriétaire et indicateurs." },
          { title: "2. Calculer", text: "Produire les métriques avec une logique déterministe." },
          { title: "3. Détecter", text: "Identifier variations, seuils, valeurs manquantes et anomalies." },
          { title: "4. Formuler", text: "Générer une narration ancrée uniquement dans les faits fournis." },
          { title: "5. Valider", text: "Contrôler les chiffres et les formulations engageantes." },
          { title: "6. Diffuser", text: "Publier selon une fréquence et conserver la version générée." }
        ]
      },
      {
        id: "google-sheets",
        kicker: "03 — GOOGLE SHEETS",
        heading: "Gemini dans Sheets réduit déjà une partie du travail, mais le workflow professionnel va plus loin.",
        paragraphs: [
          "Google documente aujourd’hui plusieurs capacités directement dans Sheets : créer des tableaux, générer des formules, produire des analyses, identifier des tendances, créer des graphiques et résumer certaines informations. La fonction AI permet également de générer, résumer ou classer du texte à partir des données de la feuille. Cela rend possible un premier niveau d’assistance sans construire une application séparée.",
          "Pour une équipe, ce niveau intégré peut suffire lorsque le reporting reste interactif. L’utilisateur ouvre la feuille, demande une analyse, vérifie les étapes et exporte éventuellement le résultat vers un document. Ce scénario est intéressant pour l’exploration mais il ne résout pas tout le problème d’industrialisation : fréquence, snapshots, contrôles, diffusion, historiques et règles d’exception.",
          "Un workflow récurrent peut donc s’appuyer sur Apps Script ou une plateforme d’automatisation. Les déclencheurs installables d’Apps Script permettent d’exécuter des fonctions à partir d’événements ou selon une fréquence. Cela peut lancer la préparation des données, vérifier la présence des valeurs attendues puis déclencher la génération du rapport.",
          "Le principe important n’est pas de choisir entre fonctions natives et automatisation externe. Il est de conserver une architecture compréhensible. Une petite équipe peut commencer avec une feuille bien structurée et une génération manuelle contrôlée. Une organisation plus avancée peut ensuite automatiser le même processus sans changer la logique de gouvernance."
        ]
      },
      {
        id: "prompt",
        kicker: "04 — LE CONTRAT DE GÉNÉRATION",
        heading: "Le prompt doit fonctionner comme un contrat : ce que le modèle peut dire, et surtout ce qu’il ne peut pas inventer.",
        paragraphs: [
          "Un mauvais prompt demande : « analyse ce tableau et explique les résultats ». Le modèle doit alors décider seul ce qui est important, comment comparer les périodes et pourquoi les chiffres ont changé. Un meilleur contrat fournit déjà la structure : période, KPI, comparaison, seuils, faits observés, notes métier validées et format du rapport.",
          "On peut demander quatre blocs. D’abord les faits : reprendre uniquement les chiffres fournis. Ensuite les variations : décrire ce qui monte, baisse ou reste stable. Puis les points d’attention : signaler les seuils dépassés et les données manquantes. Enfin les hypothèses : seulement si l’entreprise fournit des éléments de contexte, et toujours en les étiquetant comme hypothèses.",
          "La formulation doit également être contrainte. Par exemple : ne jamais écrire « la baisse est due à » sauf si un champ source apporte cette information ; préférer « la baisse coïncide avec » ou « une hypothèse à vérifier est ». Cette nuance paraît rédactionnelle, mais elle constitue un garde-fou important contre les causalités inventées.",
          "Le modèle peut aussi produire une sortie structurée avant le texte final : résumé, anomalies, questions à poser, données manquantes et niveau de confiance opérationnel. Ce n’est pas une probabilité scientifique ; c’est un signal de workflow qui aide à décider si le rapport peut être envoyé en revue standard ou s’il nécessite un contrôle approfondi."
        ]
      },
      {
        id: "qualite",
        kicker: "05 — QUALITÉ",
        heading: "Un système de reporting IA se teste sur des erreurs, pas uniquement sur de beaux rapports.",
        paragraphs: [
          "Le jeu de test doit inclure des cas faciles et des cas dégradés. Une semaine normale, une période avec données manquantes, un KPI à zéro, une variation extrême, une colonne renommée, une période incomplète, un chiffre incohérent et une situation où aucun commentaire utile ne peut être produit. Le système doit savoir s’arrêter.",
          "On compare ensuite la sortie à des critères observables. Les chiffres repris sont-ils exacts ? Les périodes sont-elles correctement nommées ? Le modèle distingue-t-il fait et hypothèse ? Signale-t-il les données absentes ? A-t-il inventé une explication ? Une bonne évaluation n’est pas « le texte est agréable ». C’est « le texte respecte le contrat de données ».",
          "La validation humaine peut être organisée sous forme de checklist. Vérifier les trois métriques principales. Vérifier les dates. Vérifier les affirmations causales. Vérifier les alertes. Vérifier les décisions proposées. Cette discipline permet de réduire progressivement le temps de relecture sans supprimer le contrôle.",
          "Lorsque les corrections se répètent, elles doivent devenir une amélioration du système. Si un manager réécrit toujours la même phrase, le template doit évoluer. Si un KPI est régulièrement mal interprété, sa définition doit être rendue explicite. Si les données arrivent trop tard, le problème n’est pas l’IA mais le pipeline amont."
        ]
      },
      {
        id: "gouvernance",
        kicker: "06 — GOUVERNANCE",
        heading: "La version du rapport doit pouvoir être reliée à la version des données.",
        paragraphs: [
          "Un reporting automatique devient vite inutile si personne ne sait à quel état des données il correspond. Chaque génération devrait donc conserver au minimum une date, une période couverte, un identifiant du fichier ou du dataset et, lorsque c’est possible, un snapshot des métriques utilisées.",
          "Les permissions sont également importantes. Le fait qu’un modèle puisse résumer un tableau ne signifie pas que tous les destinataires doivent voir tous les détails. Le workflow peut produire plusieurs niveaux : synthèse de direction, version opérationnelle et annexes. Les contrôles d’accès de la source doivent être reproduits ou respectés dans la destination.",
          "Les données sensibles ne doivent pas être envoyées au modèle par défaut. Si une synthèse peut être produite à partir de valeurs agrégées, il n’est pas nécessaire de transmettre les lignes individuelles. Cette minimisation réduit le risque et rend aussi le prompt plus stable.",
          "Enfin, le propriétaire du reporting doit être clair. Qui valide les définitions de KPI ? Qui décide qu’un nouveau champ entre dans le rapport ? Qui contrôle une anomalie de source ? L’automatisation ne supprime pas ces responsabilités ; elle les rend plus visibles."
        ]
      },
      {
        id: "mvp",
        kicker: "07 — MVP",
        heading: "Commencer avec cinq KPI et un rapport d’une page.",
        paragraphs: [
          "Le MVP le plus utile est volontairement petit. Choisir un seul reporting existant, cinq indicateurs déjà utilisés par l’équipe et une fréquence claire. On reproduit d’abord exactement les calculs actuels. Aucun nouveau KPI n’est inventé.",
          "Ensuite, on génère une synthèse d’une page avec trois rubriques : ce qui a changé, ce qui mérite une attention et les questions ouvertes. Le rapport est relu par la personne qui produisait auparavant le reporting. Pendant plusieurs cycles, les corrections sont enregistrées.",
          "Après cette phase, on peut automatiser la génération et conserver une validation avant diffusion. Puis, si la qualité reste stable, automatiser l’envoi à certains destinataires. Les décisions plus sensibles peuvent rester dans une version à valider manuellement.",
          "Cette progression permet de mesurer une valeur concrète : temps de préparation, nombre de corrections, qualité perçue, régularité de production et capacité des lecteurs à comprendre plus vite les chiffres. Il n’est pas nécessaire d’inventer un ROI avant d’avoir ces données."
        ]
      },
      {
        id: "suite",
        kicker: "08 — ALLER PLUS LOIN",
        heading: "Du rapport automatique au système de décision assistée.",
        paragraphs: [
          "Une fois le reporting fiable, le même socle peut servir à d’autres usages. Un responsable peut poser des questions au dataset, demander un zoom sur une région ou comparer plusieurs périodes. Une couche conversationnelle devient alors pertinente, à condition de conserver les mêmes règles de traçabilité.",
          "Le système peut aussi produire plusieurs formats : synthèse de direction, version détaillée, message Teams, note de réunion ou briefing avant comité. La donnée source reste identique mais la narration change selon le public.",
          "On peut enfin ajouter des signaux externes ou des commentaires humains validés pour enrichir l’interprétation. Par exemple une campagne lancée, un changement tarifaire ou une rupture de stock. Ces éléments doivent être fournis comme contexte, pas devinés à partir des chiffres.",
          "Le niveau le plus mature n’est donc pas « une IA qui explique les KPI ». C’est un pipeline où les calculs sont certifiés, les observations sont traçables, les hypothèses sont clairement nommées, les versions sont conservées et l’humain intervient exactement là où une interprétation ou une décision mérite son jugement."
        ]
      }
    ]
  }
];

export const marketDemandTrainingArticlesWave7 = [
  {
    type: "training",
    slug: "former-les-metiers-a-passer-d-un-prompt-ponctuel-a-un-workflow",
    cluster: "ChatGPT",
    title: "Formation ChatGPT entreprise : passer du prompt ponctuel à un workflow de travail réutilisable",
    dek: "Le vrai niveau professionnel ne consiste pas à connaître vingt prompts. Il consiste à savoir transformer une tâche récurrente en méthode : contexte, sources, étapes, contrôles, livrable et règles de réutilisation.",
    summary: "ChatGPT permet aujourd’hui d’organiser des chats, fichiers et instructions dans des Projects, d’utiliser des apps connectées selon les droits du workspace et, selon les offres et fonctionnalités disponibles, de travailler avec des outils capables d’exécuter des tâches plus complètes. Une formation utile doit donc dépasser la recette de prompt : cartographier une tâche, préparer le contexte, découper le workflow, définir les contrôles, préserver les données, réutiliser les sources, puis apprendre à décider quand un simple chat suffit et quand il faut un projet, une app, un agent ou une automatisation.",
    readingTime: "20–24 min",
    publishedAt: "2026-09-22",
    modifiedAt: "2026-09-22",
    jobSignalTags: ["chatgpt", "generative_ai", "workflow_orchestration", "change_adoption", "knowledge_management", "automation"],
    search: {
      primaryKeyword: "formation ChatGPT entreprise workflow",
      secondaryQueries: [
        "formation ChatGPT entreprise",
        "workflow ChatGPT entreprise",
        "ChatGPT processus métier",
        "formation ChatGPT avancée entreprise",
        "passer du prompt au workflow IA"
      ],
      demandEvidence: ["serp_observed", "official_product_docs"],
      observedAt: "2026-09-22"
    },
    quickFacts: [
      ["PUBLIC", "Équipes métier déjà utilisatrices ou débutantes"],
      ["OBJECTIF", "Transformer une tâche réelle en méthode réutilisable"],
      ["FORMAT", "Ateliers sur documents et processus de l’entreprise"],
      ["ÉVALUATION", "Reproduire le workflow sur un nouveau cas"]
    ],
    sourceNote: "OpenAI documente actuellement les Projects comme espaces regroupant chats, fichiers et instructions, avec possibilité d’utiliser des apps connectées selon les paramètres du workspace. OpenAI documente également des offres Business / Enterprise avec contrôles d’administration et des capacités de travail ou d’agents selon les plans et disponibilités. Les engagements de confidentialité précisent que les données Business et Enterprise ne sont pas utilisées par défaut pour entraîner les modèles. Le parcours Autonomia ci-dessous décrit une méthode pédagogique générique : les fonctionnalités disponibles doivent être vérifiées dans le workspace réel de l’entreprise au moment de la formation.",
    sources: [
      {
        label: "OpenAI Help Center — Projets dans ChatGPT",
        url: "https://help.openai.com/fr-fr/articles/10169521-projects-in-chatgpt"
      },
      {
        label: "OpenAI — Sécurité, confidentialité et conformité des données des entreprises",
        url: "https://openai.com/fr-FR/business-data/"
      },
      {
        label: "OpenAI — ChatGPT Work pour toutes les équipes",
        url: "https://openai.com/fr-FR/chatgpt-work/"
      },
      {
        label: "OpenAI — Plugins et intégrations sécurisées pour les workflows d’entreprise",
        url: "https://openai.com/business/plugins/"
      }
    ],
    faq: [
      ["Quelle différence entre un bon prompt et un workflow ?", "Un prompt est une instruction ponctuelle. Un workflow décrit une tâche de bout en bout : entrées, contexte, étapes, validations, sortie, réutilisation et gestion des exceptions."],
      ["Faut-il savoir coder pour construire un workflow ChatGPT ?", "Non pour de nombreux workflows métier. La formation peut commencer avec Projects, fichiers, instructions et méthodes conversationnelles. Le code ou l’automatisation externe devient utile lorsque l’on veut relier plusieurs systèmes ou déclencher des actions."],
      ["Doit-on utiliser de vrais documents de l’entreprise pendant la formation ?", "C’est souvent le meilleur moyen de créer du transfert, mais uniquement avec des documents autorisés et adaptés aux règles de confidentialité. Des jeux de données ou documents anonymisés peuvent être utilisés."],
      ["Les données Business ou Enterprise servent-elles à entraîner les modèles ?", "OpenAI indique que, par défaut, les données des offres Business et Enterprise ne sont pas utilisées pour entraîner ou améliorer ses modèles. Les paramètres et politiques internes de l’organisation doivent néanmoins être respectés."],
      ["Comment évaluer la formation ?", "Le participant doit être capable de reprendre une nouvelle tâche, la cartographier, choisir le bon niveau d’outil, construire les étapes, définir les contrôles et produire un livrable conforme aux critères."],
      ["Faut-il créer un agent pour chaque processus ?", "Non. Beaucoup de tâches restent plus simples avec un prompt structuré, un Project ou une séquence de prompts. L’agent devient pertinent lorsqu’il faut enchaîner des actions ou outils avec un niveau d’autonomie explicite."]
    ],
    sections: [
      {
        id: "limite-prompt",
        kicker: "01 — LA LIMITE DU PROMPT",
        heading: "Le prompt spectaculaire du lundi devient souvent le copier-coller oublié du vendredi.",
        paragraphs: [
          "Une première formation ChatGPT commence souvent par la structure d’un bon prompt : objectif, contexte, contraintes, format. C’est utile, mais insuffisant. Une personne peut produire une excellente réponse pendant l’atelier puis ne plus réussir à reproduire le résultat une semaine plus tard. Elle ne retrouve plus le contexte, oublie les documents utilisés, change la consigne ou ne sait pas quelles parties vérifier.",
          "Le problème n’est pas le niveau d’intelligence du modèle. C’est l’absence de méthode. Une tâche professionnelle contient presque toujours plusieurs étapes. Préparer une proposition commerciale suppose de comprendre le besoin, retrouver des informations, choisir un plan, écrire une version, contrôler les engagements et adapter le ton. Un unique prompt masque cette chaîne.",
          "Former au workflow consiste donc à rendre la chaîne visible. Quelles sont les entrées ? quelles sources faut-il fournir ? quelles décisions appartiennent à l’utilisateur ? quelles étapes peuvent être confiées à ChatGPT ? quel livrable final attend-on ? quelles erreurs obligent à recommencer ? Cette cartographie transforme un usage artisanal en pratique professionnelle.",
          "Le participant découvre surtout qu’il n’est pas nécessaire d’automatiser immédiatement. Un workflow peut d’abord être une procédure humaine assistée par ChatGPT. Une fois stable, certaines étapes pourront être réutilisées dans un Project, un assistant, une app connectée ou une automatisation."
        ]
      },
      {
        id: "cartographie",
        kicker: "02 — CARTOGRAPHIER",
        heading: "Avant d’ouvrir ChatGPT, décrire la tâche telle qu’elle existe réellement.",
        paragraphs: [
          "L’exercice commence sans IA. Le participant choisit une tâche récurrente : préparer un rendez-vous, analyser un dossier, rédiger une note, répondre à un appel d’offres, créer un reporting ou résumer une réunion. Il décrit le déclencheur, les documents d’entrée, les personnes impliquées, les décisions, les actions et la sortie attendue.",
          "Cette cartographie permet de distinguer trois catégories. Les étapes déterministes, comme appliquer un modèle ou vérifier une date. Les étapes d’interprétation, comme résumer un texte ou classer une demande. Et les étapes de jugement, où une personne assume une décision, un engagement ou une validation.",
          "Le participant apprend ensuite à positionner ChatGPT uniquement là où il apporte quelque chose. Le modèle est très utile pour transformer du texte libre, comparer, synthétiser, proposer une structure ou reformuler. Il ne doit pas devenir le propriétaire implicite de la procédure.",
          "Cette discipline évite une erreur fréquente : demander « fais tout » puis corriger vingt détails. Un workflow bien découpé permet de contrôler chaque sortie intermédiaire. Il devient plus facile de comprendre pourquoi le résultat final est bon ou mauvais."
        ]
      },
      {
        id: "contexte",
        kicker: "03 — LE CONTEXTE",
        heading: "Un workflow réutilisable dépend moins d’un prompt génial que d’un contexte bien organisé.",
        paragraphs: [
          "OpenAI documente les Projects comme des espaces regroupant conversations, fichiers et instructions liés à un même travail. Pour une équipe, cette logique est importante : au lieu de réinjecter les mêmes informations à chaque conversation, on organise un environnement de référence.",
          "La formation peut montrer comment séparer les éléments stables et variables. Les instructions de ton, de structure ou de vérification sont relativement stables. Le brief client, le fichier de données ou le document à analyser changent à chaque occurrence. Les exemples validés peuvent devenir des références.",
          "Le participant doit aussi apprendre la discipline documentaire. Ajouter vingt fichiers « au cas où » dégrade souvent la lisibilité du système. Il faut savoir quelle source fait foi, comment nommer les documents, comment repérer une version obsolète et comment limiter le contexte aux informations réellement nécessaires.",
          "Lorsque des apps ou sources connectées sont disponibles dans le workspace, la même logique s’applique. L’accès à un outil ne signifie pas qu’il faut interroger toute l’organisation. On définit le périmètre, les droits et la question. Cette compétence devient essentielle lorsque le workflow dépasse le simple chat."
        ]
      },
      {
        id: "sequence",
        kicker: "04 — LA SÉQUENCE",
        heading: "Un workflow peut être une suite de quatre à six interactions courtes et contrôlables.",
        paragraphs: [
          "Prenons une note de cadrage. Étape un : extraire les faits et zones d’incertitude du brief. Étape deux : proposer une structure adaptée au destinataire. Étape trois : rédiger la première version en respectant les sources. Étape quatre : contrôler chaque affirmation et lister celles qui doivent être vérifiées. Étape cinq : reformuler pour le style. Étape six : produire le livrable final.",
          "Chaque étape a un contrat de sortie. Une extraction peut être demandée sous forme de tableau. Une structure doit contenir des titres et objectifs. Le contrôle qualité doit produire une liste d’alertes. Le participant n’évalue plus uniquement la fluidité du texte ; il vérifie que chaque transformation respecte le rôle attendu.",
          "Cette séquence a aussi un avantage pédagogique : elle montre à quel moment une erreur apparaît. Si la structure finale est mauvaise, on peut revenir à l’étape deux. Si un fait est inventé, on renforce l’étape de contrôle. Le workflow devient améliorable.",
          "Quand la méthode est stable, elle peut être documentée comme un playbook. Les membres de l’équipe partagent les mêmes étapes et les mêmes critères de qualité tout en gardant la possibilité d’adapter le contenu à leur contexte."
        ],
        steps: [
          { title: "1. Entrée", text: "Définir document, données ou brief réellement nécessaires." },
          { title: "2. Compréhension", text: "Extraire les faits, contraintes et zones d’incertitude." },
          { title: "3. Production", text: "Générer une structure ou première version selon le besoin." },
          { title: "4. Contrôle", text: "Vérifier faits, sources, format et risques." },
          { title: "5. Adaptation", text: "Ajuster ton, niveau de détail et destinataire." },
          { title: "6. Livraison", text: "Produire le format final et conserver la méthode réutilisable." }
        ]
      },
      {
        id: "outils",
        kicker: "05 — CHOISIR LE BON NIVEAU",
        heading: "Prompt, Project, app, Work, agent : la maturité n’est pas de choisir l’outil le plus complexe.",
        paragraphs: [
          "Le participant doit savoir choisir le niveau le plus simple compatible avec le besoin. Un prompt suffit pour une tâche ponctuelle et sans contexte récurrent. Un Project devient utile lorsque le travail se prolonge, utilise des fichiers et bénéficie d’instructions partagées. Une app connectée devient pertinente lorsqu’il faut rechercher ou agir dans un système autorisé.",
          "Des capacités plus avancées peuvent prendre en charge des séquences de travail ou des tâches plus longues selon le plan et les paramètres du workspace. La formation ne doit pas transformer ces fonctionnalités en promesse universelle : leur disponibilité évolue et dépend des droits de l’organisation.",
          "Le critère n’est donc pas « combien d’autonomie pouvons-nous donner ? ». Il est « quel niveau d’autonomie est nécessaire pour cette tâche ? ». Une personne qui prépare une analyse sensible peut préférer une méthode interactive. Une tâche répétitive à faible risque peut justifier davantage d’automatisation.",
          "Cette grille protège aussi contre l’effet de mode. Si une simple instruction réutilisable dans un Project résout le problème, créer un agent n’ajoute pas forcément de valeur. La complexité doit être payée par une amélioration réelle du workflow."
        ]
      },
      {
        id: "donnees",
        kicker: "06 — DONNÉES & RÈGLES",
        heading: "Professionnaliser l’usage signifie aussi savoir ce qu’on a le droit d’envoyer et de connecter.",
        paragraphs: [
          "OpenAI indique que les données des offres Business et Enterprise ne sont pas utilisées par défaut pour entraîner ou améliorer les modèles. Cette information ne remplace pas la politique de l’entreprise. Une organisation peut interdire certaines catégories de données, imposer un workspace spécifique ou limiter les applications connectées.",
          "La formation doit donc intégrer les règles directement dans les exercices. Avant d’ajouter un document : est-il autorisé ? contient-il des données personnelles ou confidentielles ? faut-il l’anonymiser ? Avant d’utiliser une app : quels droits lui sont accordés ? qui peut voir le résultat ?",
          "Le participant apprend également à minimiser les informations. Pour reformuler un e-mail, il n’est pas nécessaire de fournir tout l’historique du client. Pour construire une synthèse, seules certaines pages d’un dossier peuvent être pertinentes. Réduire le contexte améliore souvent la clarté autant que la sécurité.",
          "Enfin, chaque workflow devrait comporter une règle de sortie. Que faut-il vérifier avant d’utiliser le résultat ? Une citation ? un chiffre ? un nom ? un engagement ? La gouvernance devient une étape pratique plutôt qu’un module séparé et abstrait."
        ]
      },
      {
        id: "evaluation",
        kicker: "07 — ÉVALUER",
        heading: "L’évaluation finale doit demander un transfert vers une tâche que le participant n’a jamais vue.",
        paragraphs: [
          "Une formation échoue si le participant sait reproduire exactement l’exercice mais ne sait pas reconnaître le même principe ailleurs. L’évaluation doit donc changer le contexte. Après avoir construit un workflow de synthèse de réunion, on peut demander de créer un workflow de préparation d’entretien ou d’analyse de réclamation.",
          "Le participant doit décrire le déclencheur, les entrées, les étapes, les validations et la sortie. Il choisit ensuite le bon niveau d’outil : simple chat, Project ou approche plus automatisée. Il justifie pourquoi certaines décisions restent humaines.",
          "Le formateur peut utiliser une grille observable : qualité de la cartographie, pertinence du contexte, séparation des étapes, contrôles, gestion des données, capacité à identifier une exception et qualité du livrable.",
          "Cette évaluation produit un résultat utile pour l’entreprise. Elle permet de distinguer les utilisateurs capables de construire des méthodes réutilisables de ceux qui ont seulement mémorisé quelques formulations."
        ]
      },
      {
        id: "adoption",
        kicker: "08 — ADOPTION",
        heading: "La meilleure sortie de formation est une petite bibliothèque de workflows réellement utilisés.",
        paragraphs: [
          "À la fin d’un parcours, chaque équipe peut repartir avec trois à cinq workflows documentés : objectif, déclencheur, sources, étapes, contrôles, exemple de sortie et propriétaire. Cette bibliothèque est plus durable qu’un PDF contenant cinquante prompts.",
          "Les workflows peuvent évoluer. Un changement de modèle, de fonctionnalité ou de procédure interne ne nécessite pas de refaire toute la formation. On met à jour la fiche, on teste à nouveau et on diffuse la nouvelle version.",
          "Les managers peuvent ensuite observer l’adoption par usage. Quels workflows sont réellement repris ? lesquels sont abandonnés ? où les utilisateurs corrigent-ils le plus ? quelles tâches nécessitent encore une aide ? Ces signaux sont plus utiles qu’un simple nombre de connexions à ChatGPT.",
          "Le changement profond se produit lorsque les collaborateurs cessent de demander « quel prompt dois-je utiliser ? » et commencent à demander « quelle méthode voulons-nous rendre reproductible ? ». À ce moment-là, ChatGPT n’est plus une collection d’astuces. Il devient une composante du système de travail.",
          "Cette évolution change aussi le rôle de la formation continue. Au lieu d’organiser régulièrement une nouvelle session pour présenter des fonctionnalités, l’entreprise peut entretenir un portefeuille de workflows : revue trimestrielle, responsables identifiés, exemples de sorties, erreurs connues et décisions de mise à jour. Les nouveautés produit sont alors évaluées à partir d’un besoin existant. On ne forme plus les équipes à chaque bouton ajouté ; on améliore les méthodes lorsque la nouvelle capacité permet réellement de simplifier une étape, renforcer un contrôle ou rendre le résultat plus fiable."
        ]
      }
    ]
  }
];
