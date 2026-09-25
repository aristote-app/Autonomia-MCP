function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const trainingSourceSets = {
  direction: [
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
  ],
  manager: [
    {
      label: "NIST — AI Risk Management Framework",
      url: "https://www.nist.gov/itl/ai-risk-management-framework"
    },
    {
      label: "OECD.AI — principes de l’OCDE sur l’intelligence artificielle",
      url: "https://oecd.ai/en/ai-principles"
    },
    {
      label: "Microsoft Learn — adoption et scénarios Copilot",
      url: "https://learn.microsoft.com/en-us/copilot/"
    }
  ],
  commercial: [
    {
      label: "Microsoft Learn — Sales insights dans le récapitulatif de réunion",
      url: "https://learn.microsoft.com/fr-fr/microsoft-sales-copilot/view-meeting-summary-recap"
    },
    {
      label: "HubSpot Knowledge Base — créer et utiliser des workflows",
      url: "https://knowledge.hubspot.com/workflows/create-workflows"
    },
    {
      label: "NIST — AI Risk Management Framework",
      url: "https://www.nist.gov/itl/ai-risk-management-framework"
    }
  ],
  finance: [
    {
      label: "CNIL — Intelligence artificielle et protection des données",
      url: "https://www.cnil.fr/fr/technologies/intelligence-artificielle-ia"
    },
    {
      label: "Microsoft Learn — Vue d’ensemble du traitement de documents avec AI Builder",
      url: "https://learn.microsoft.com/fr-fr/ai-builder/form-processing-model-overview"
    },
    {
      label: "Microsoft Learn — Automatisation des documents avec AI Builder et Power Automate",
      url: "https://learn.microsoft.com/fr-fr/ai-builder/doc-automation"
    }
  ],
  rh: [
    {
      label: "Commission européenne — cadre réglementaire européen sur l’intelligence artificielle",
      url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
    },
    {
      label: "NIST — AI Risk Management Framework",
      url: "https://www.nist.gov/itl/ai-risk-management-framework"
    },
    {
      label: "Microsoft Graph — permissions reference",
      url: "https://learn.microsoft.com/en-us/graph/permissions-reference"
    }
  ]
};

const defaultTags = {
  direction: [
    "change_adoption",
    "ai_governance",
    "human_in_loop",
    "process_integration",
    "strategy"
  ],
  manager: [
    "change_adoption",
    "human_in_loop",
    "workflow_orchestration",
    "process_integration",
    "genai"
  ],
  commercial: [
    "sales_automation",
    "crm",
    "genai",
    "human_in_loop",
    "change_adoption"
  ],
  finance: [
    "finance_ops",
    "automation",
    "files_documents",
    "human_in_loop",
    "process_integration"
  ],
  rh: [
    "change_adoption",
    "human_in_loop",
    "ai_governance",
    "files_documents",
    "process_integration"
  ]
};

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function paragraph(value) {
  return clean(value);
}

const trainingFamilyContext = {
  direction: {
    subject: "projet IA",
    participantRole: "dirigeant",
    reviewPlace: "comité, revue d’investissement ou atelier métier",
    futureReviews: "prochains dossiers, comités et échanges fournisseurs",
    evidenceDocument: "business case",
    learningFrame: "cadrer, challenger et décider"
  },
  manager: {
    subject: "usage IA dans une équipe",
    participantRole: "manager",
    reviewPlace: "réunion d’équipe, revue de processus ou atelier métier",
    futureReviews: "prochains briefs, rituels d’équipe et revues de processus",
    evidenceDocument: "fiche de cadrage ou procédure d’équipe",
    learningFrame: "organiser, superviser et transférer"
  },
  commercial: {
    subject: "usage IA dans le cycle commercial",
    participantRole: "commercial",
    reviewPlace: "revue commerciale, préparation de rendez-vous ou atelier CRM",
    futureReviews: "prochains rendez-vous, opportunités et revues commerciales",
    evidenceDocument: "fiche compte, opportunité ou proposition",
    learningFrame: "préparer, personnaliser et vérifier"
  },
  finance: {
    subject: "usage IA dans une fonction finance ou administrative",
    participantRole: "professionnel des fonctions support",
    reviewPlace: "revue de gestion, contrôle de processus ou atelier administratif",
    futureReviews: "prochains reportings, contrôles et processus administratifs",
    evidenceDocument: "tableau, pièce comptable ou dossier de gestion",
    learningFrame: "extraire, contrôler et automatiser"
  },
  rh: {
    subject: "usage IA dans un processus RH",
    participantRole: "professionnel RH",
    reviewPlace: "revue RH, atelier métier ou comité de gouvernance",
    futureReviews: "prochains processus RH, ateliers et revues de pratiques",
    evidenceDocument: "procédure, grille ou dossier RH",
    learningFrame: "assister, documenter et encadrer"
  }
};

export function buildTrainingArticle(spec) {
  const title = spec.title;
  const slug = slugify(title);
  const context = trainingFamilyContext[spec.family] || trainingFamilyContext.direction;
  const keyword = spec.primaryKeyword || title.toLowerCase();
  const sources = spec.sources || trainingSourceSets[spec.family] || trainingSourceSets.direction;
  const audience = spec.audience || "dirigeants, managers et responsables de transformation";
  const objective = spec.objective;
  const workshop = spec.workshop;
  const deliverable = spec.deliverable;
  const assessment = spec.assessment;
  const transfer = spec.transfer;
  const guardrail = spec.guardrail;
  const example = spec.example;
  const decisionFrame = spec.decisionFrame || "problème métier, données, niveau de risque, contrôle humain, coût d’intégration et indicateurs observables";
  const tools = spec.tools || "documents internes, tableaux de décision, outils d’IA autorisés et supports de travail de l’organisation";

  const sections = [
    {
      id: "enjeu",
      kicker: "01 — L’ENJEU",
      heading: spec.problemHeading || "Former à décider avec l’IA, pas à admirer l’IA.",
      paragraphs: [
        paragraph(`Le point de départ de cette formation est une situation concrète : ${example}. Pour ${audience}, le risque n’est pas seulement de « ne pas connaître les outils ». Le risque est de prendre des décisions sur l’IA avec un vocabulaire trop flou : confondre automatisation et agent, traiter une démonstration comme une preuve de valeur, croire qu’un modèle génératif peut remplacer une règle métier ou encore considérer un chiffre de ROI comme certain alors qu’il repose sur des hypothèses. La compétence visée doit donc porter sur la décision et le cadrage.`),
        paragraph(`L’objectif pédagogique est ${objective}. La formation n’essaie pas de transformer un ${context.participantRole} en ingénieur machine learning. Elle lui donne assez de structure pour appliquer l’IA à son propre travail, reconnaître ce qui manque dans ${context.subject} et demander les preuves adaptées au niveau de responsabilité. Le participant apprend à distinguer une possibilité technique, un prototype qui fonctionne sur quelques cas et un système réellement exploitable dans l’organisation.`),
        paragraph(`Le fil conducteur est simple : tout ${context.subject} doit pouvoir être ramené à ${decisionFrame}. Cette grille évite de commencer par la marque d’un outil ou par une promesse générale. Elle replace l’IA dans le système de travail : quel problème cherche-t-on à résoudre, quelles informations circulent, quelle décision reste humaine, qui porte la responsabilité, comment le système sera testé et que fera-t-on lorsque le cas sort du périmètre prévu ?`),
        paragraph(`La formation doit aussi créer un langage commun entre direction, métiers, DSI, data, juridique, achats et équipes de transformation. Lorsque chacun utilise les mêmes mots pour parler de données, de validation, d’autonomie, de mesure et de risque, la discussion devient plus rapide. Les arbitrages ne reposent plus uniquement sur le niveau d’enthousiasme ou de scepticisme d’un interlocuteur : ils peuvent être documentés.`)
      ]
    },
    {
      id: "competences",
      kicker: "02 — COMPÉTENCES CIBLES",
      heading: spec.skillsHeading || "À la fin, le participant doit être capable de challenger un projet IA avec méthode.",
      paragraphs: [
        paragraph(`La première compétence est de reformuler une demande IA en problème métier. Une phrase comme « nous voulons un agent » n’est pas encore un besoin. Le participant apprend à demander quelle tâche revient aujourd’hui à une personne, quel événement déclenche le travail, quelles sources sont utilisées, quel résultat est attendu et où se trouve la friction. Cette reformulation réduit le risque d’acheter une solution avant d’avoir défini le problème.`),
        paragraph(`La deuxième compétence est de reconnaître le niveau d’autonomie réellement demandé. Un copilote qui prépare un brouillon, un workflow qui applique des règles et un agent qui peut choisir des outils et agir ne posent pas les mêmes questions. Le participant apprend à demander quelles actions sont autorisées, lesquelles sont réversibles, lesquelles nécessitent une validation et comment une erreur est détectée puis corrigée.`),
        paragraph(`La troisième compétence est de lire un dossier de projet sans se laisser impressionner par le vocabulaire. Il faut pouvoir retrouver les hypothèses, les données disponibles, les dépendances techniques, les coûts récurrents, les permissions, les volumes, les cas d’exception et la méthode de mesure. Un projet qui ne sait pas répondre à ces questions n’est pas forcément mauvais ; il est simplement encore insuffisamment cadré pour certaines décisions.`),
        paragraph(`La quatrième compétence est d’organiser la preuve. Pour ${title.toLowerCase()}, le participant doit savoir distinguer une anecdote, une démonstration, un test sur échantillon, une mesure avant/après et une donnée d’exploitation. Cette hiérarchie aide à choisir le bon niveau de confiance pour chaque étape : exploration, pilote, déploiement limité ou généralisation.`)
      ]
    },
    {
      id: "atelier",
      kicker: "03 — ATELIER FIL ROUGE",
      heading: spec.workshopHeading || "Un cas réel vaut mieux qu’une succession de fonctionnalités.",
      paragraphs: [
        paragraph(`L’atelier central consiste à ${workshop}. Le groupe travaille sur un dossier volontairement imparfait : certaines informations sont précises, d’autres sont manquantes et quelques affirmations semblent convaincantes sans être démontrées. Le but n’est pas de trouver immédiatement « la bonne réponse ». Il est d’apprendre à identifier quelles questions doivent être posées avant de décider.`),
        paragraph(`Le premier passage se fait sans outil d’IA. Les participants annotent le dossier avec une grille : problème, utilisateurs, processus actuel, données, sorties attendues, actions possibles, risques, contrôle humain, dépendances et mesure. Cette étape est importante car elle évite d’attribuer au modèle la capacité de structurer le raisonnement à la place du décideur.`),
        paragraph(`Dans un deuxième temps, un outil d’IA autorisé peut être utilisé pour tester la qualité du cadrage : résumer le dossier, identifier les hypothèses manquantes, proposer des questions ou comparer plusieurs scénarios. Le participant observe alors une différence essentielle : l’IA peut accélérer l’analyse, mais la qualité dépend fortement du cadre qu’on lui fournit et de la vérification des faits utilisés.`),
        paragraph(`Enfin, le groupe produit ${deliverable}. Le livrable doit pouvoir être relu après la formation par une autre personne. Il ne doit pas être un simple compte rendu de séance : il doit rendre visibles les critères, les hypothèses, les points non résolus et les prochaines preuves à obtenir. C’est cette capacité de transmission qui transforme l’apprentissage en pratique d’entreprise.`)
      ]
    },
    {
      id: "methode",
      kicker: "04 — MÉTHODE DE DÉCISION",
      heading: spec.methodHeading || "Passer de « est-ce que l’IA peut le faire ? » à « dans quelles conditions ce projet mérite-t-il d’avancer ? »",
      paragraphs: [
        paragraph(`Une décision IA peut être structurée en plusieurs portes successives. Porte 1 : le problème est-il suffisamment fréquent, coûteux ou stratégique pour justifier du travail ? Porte 2 : les données nécessaires existent-elles réellement et sont-elles accessibles ? Porte 3 : le résultat peut-il être défini assez précisément pour être testé ? Porte 4 : l’action proposée est-elle suffisamment réversible ou contrôlée ? Porte 5 : peut-on mesurer ce qui change sans fabriquer un ROI théorique ?`),
        paragraph(`Cette séquence permet de faire tomber beaucoup de faux débats. Un projet peut être techniquement possible mais inutile. Il peut être utile mais bloqué par l’accès aux données. Il peut disposer de données mais demander une autonomie excessive. Il peut encore être intéressant tout en nécessitant un pilote beaucoup plus étroit que ce qui était imaginé au départ. La méthode n’a donc pas pour fonction de dire oui ou non plus vite ; elle permet de décider avec de meilleures raisons.`),
        paragraph(`Le participant apprend aussi à distinguer effort de préparation, coût d’outillage, coût d’intégration et charge de contrôle humain. Une intégration peut nécessiter peu de développement mais beaucoup de nettoyage documentaire. Une licence peut sembler faible tandis que la supervision, les validations ou les changements de processus représentent l’essentiel de l’effort. Le dossier doit rendre ces composantes visibles séparément.`),
        paragraph(`Pour ${title.toLowerCase()}, la grille utilisée en formation garde une colonne « preuve disponible » et une colonne « prochaine preuve à obtenir ». Cela évite de transformer une hypothèse en fait simplement parce qu’elle a été répétée plusieurs fois. Le rôle du participant est alors plus clair : choisir la prochaine action ou le prochain niveau d’autonomie en fonction du niveau de preuve déjà atteint et de sa responsabilité.`)
      ]
    },
    {
      id: "gouvernance",
      kicker: "05 — DONNÉES, RISQUES & GOUVERNANCE",
      heading: spec.governanceHeading || "La gouvernance devient concrète lorsqu’elle est attachée aux actions du système.",
      paragraphs: [
        paragraph(`Le garde-fou principal du parcours est le suivant : ${guardrail}. Cette règle est traduite en questions opérationnelles. Quelles données le système lit-il ? Qui peut voir la sortie ? L’outil peut-il écrire dans un CRM, envoyer un message ou modifier un document ? Quel événement nécessite une validation ? Qui peut désactiver le système ? Où retrouve-t-on l’historique d’une action ?`),
        paragraph(`Les sources de référence proposées avec ce guide — cadre européen sur l’IA, AI Risk Management Framework du NIST et principes de l’OCDE — ne remplacent pas l’analyse juridique ou réglementaire propre à l’organisation. Elles fournissent en revanche un vocabulaire utile pour parler de supervision humaine, gouvernance, responsabilité, robustesse et gestion des risques. La formation s’en sert comme points de repère plutôt que comme cours juridique exhaustif.`),
        paragraph(`Une erreur fréquente consiste à traiter la gouvernance comme un document rédigé après le prototype. Le parcours fait l’inverse : les règles apparaissent au moment où l’on dessine le système. Si une donnée ne doit pas être envoyée, on le décide avant de choisir le flux. Si une décision doit rester humaine, on place le contrôle dans l’architecture. Si une action doit être traçable, on prévoit la journalisation dès le pilote.`),
        paragraph(`Cette approche aide aussi les ${context.participantRole}s à poser des exigences réalistes dans leur périmètre. « Garantir zéro erreur » n’est pas un critère opérationnel. « Aucun envoi externe sans validation », « toute réponse documentaire doit citer sa source », « une donnée absente reste absente » ou « chaque action sensible doit être journalisée » sont des règles testables. La gouvernance devient alors observable.`)
      ]
    },
    {
      id: "evaluation",
      kicker: "06 — ÉVALUATION",
      heading: spec.assessmentHeading || "Évaluer la capacité à décider, pas la mémorisation du vocabulaire.",
      paragraphs: [
        paragraph(`L’évaluation finale consiste à ${assessment}. On donne au participant un cas différent de celui travaillé pendant l’atelier. Il doit reformuler le problème, identifier les informations manquantes, proposer un niveau d’expérimentation et écrire les critères qui lui permettraient d’accepter ou refuser l’étape suivante. Le formateur évalue la démarche et la qualité des questions plutôt qu’une réponse unique.`),
        paragraph(`Une grille d’évaluation peut porter sur quelques dimensions : distinction entre problème et solution, identification des données, niveau d’autonomie, contrôle humain, cas d’exception, méthode de mesure et capacité à documenter une hypothèse. Chaque dimension peut être observée dans le livrable. Le participant voit précisément ce qu’il maîtrise et ce qu’il doit encore renforcer.`),
        paragraph(`La formation peut également intégrer un exercice de détection des signaux faibles d’un mauvais dossier : promesse sans métrique, ROI présenté sans méthode, absence de propriétaire, dépendance à un accès non confirmé, modèle présenté comme solution complète, données supposées disponibles ou responsabilité humaine non définie. L’objectif n’est pas de rendre les participants méfiants envers tout projet, mais plus exigeants sur la qualité du cadrage.`),
        paragraph(`L’évaluation à froid peut ensuite regarder l’usage réel de la grille : combien de projets ont été reformulés, combien ont demandé un pilote plus étroit, quelles informations sont désormais exigées dans un ${context.evidenceDocument} et quelles décisions ou validations ont été documentées différemment. Ces observations sont plus intéressantes qu’un simple score de satisfaction à chaud.`)
      ]
    },
    {
      id: "transfert",
      kicker: "07 — TRANSFERT AU POSTE",
      heading: spec.transferHeading || "La formation doit modifier les réunions et les dossiers du lendemain.",
      paragraphs: [
        paragraph(`Le transfert attendu est ${transfer}. Pour y parvenir, le participant repart avec des modèles utilisables : grille de qualification d’un cas d’usage, questions de revue, matrice d’autonomie, fiche de preuve, structure de pilote et trame de décision. Ces outils sont volontairement simples pour pouvoir être repris dans une ${context.reviewPlace}.`),
        paragraph(`La semaine suivant la formation, chaque participant peut appliquer la grille à un projet réel. L’exercice produit une courte note : ce qui est déjà prouvé, ce qui reste hypothétique, ce qui manque et quelle serait la prochaine expérimentation raisonnable. Cette pratique permet de consolider la compétence en contexte plutôt que de laisser les concepts se dissoudre après la session.`),
        paragraph(`Pour l’organisation, les livrables peuvent devenir une méthode commune de revue des projets IA. Les équipes métiers gagnent un format pour exprimer leur besoin ; les équipes techniques disposent de critères plus clairs ; les achats savent quelles questions poser ; la direction peut comparer plusieurs projets selon une structure commune sans prétendre réduire toutes les décisions à un score automatique.`),
        paragraph(`Le rôle d’Autonomia Academy est précisément de construire ce passage entre connaissance et capacité d’action : ${context.learningFrame}. Les contenus peuvent être adaptés aux projets, aux outils, au secteur et aux règles internes de l’entreprise. Le parcours reste toutefois centré sur une compétence durable : savoir analyser et encadrer l’usage de l’IA même lorsque les produits et les interfaces changent.`)
      ]
    },
    {
      id: "programme",
      kicker: "08 — PARCOURS POSSIBLE",
      heading: spec.programHeading || "Un parcours court peut déjà produire une méthode réutilisable.",
      paragraphs: [
        paragraph(`Un premier bloc pose le langage commun : IA générative, automatisation, copilote, workflow, agent, RAG, donnée, règle, action et validation. Chaque notion est reliée à un exemple de travail. Le but n’est pas de multiplier les définitions mais d’éviter que l’équipe utilise le même mot pour désigner des systèmes très différents.`),
        paragraph(`Le deuxième bloc applique la grille de décision à un cas réel. Le troisième confronte les participants à un dossier incomplet et à des affirmations difficiles à vérifier. Le quatrième traite données, droits, supervision et risques. Le cinquième construit ${deliverable}. Le dernier bloc prépare le transfert : comment utiliser la méthode dans les ${context.futureReviews}.`),
        paragraph(`Les outils utilisés pendant la formation peuvent inclure ${tools}. Ils ne constituent pas l’objectif final. Une entreprise peut changer d’assistant ou de plateforme sans perdre la compétence acquise si les participants savent toujours formuler le problème, exiger une sortie vérifiable, distinguer règle et interprétation, définir le contrôle et tester sur des cas représentatifs.`),
        paragraph(`Ce design permet également de moduler la durée. Une sensibilisation exécutive peut se concentrer sur la grille et un atelier de décision. Un parcours plus long peut ajouter des démonstrations techniques, des ateliers par métier, une revue de projets réels et un accompagnement à la formalisation de la gouvernance. Le contenu reste relié à la même promesse : permettre à la direction d’avancer sans confondre vitesse et précipitation.`)
      ]
    }
  ];

  return {
    type: "training",
    slug,
    cluster: spec.cluster,
    title,
    dek: spec.dek || `${objective}. Un parcours Autonomia Academy pour ${audience}, construit autour d’un atelier réel, d’un livrable et d’une méthode de transfert au travail.`,
    summary: spec.summary || `Ce guide décrit une formation opérationnelle pour « ${title} ». Le participant apprend à analyser un cas concret, utiliser une grille de décision, challenger les hypothèses, définir les garde-fous et produire ${deliverable}. L’évaluation vérifie une capacité réutilisable au travail plutôt qu’une simple mémorisation des fonctionnalités d’un outil.`,
    readingTime: "18–24 min",
    publishedAt: "2026-09-25",
    modifiedAt: "2026-09-25",
    jobSignalTags: spec.jobSignalTags || defaultTags[spec.family] || ["change_adoption", "human_in_loop", "ai_governance"],
    search: {
      primaryKeyword: keyword,
      secondaryQueries: spec.secondaryQueries || [
        keyword,
        `${keyword} entreprise`,
        `${keyword} formation professionnelle`,
        `${keyword} ${spec.cluster.toLowerCase()}`
      ],
      demandEvidence: ["editorial_backlog", "commercial_intent"],
      observedAt: "2026-09-25"
    },
    quickFacts: [
      ["PUBLIC", audience],
      ["OBJECTIF", objective],
      ["ATELIER", workshop],
      ["LIVRABLE", deliverable]
    ],
    sourceNote: spec.sourceNote || "Les sources proposées donnent des repères officiels ou institutionnels sur la gouvernance, la gestion des risques et l’usage responsable de l’IA. Le parcours pédagogique décrit ici est une conception Autonomia Academy : durée, modalités, outils, prérequis et contexte doivent être adaptés à l’organisation avant commercialisation ou déploiement.",
    sources,
    faq: [
      ["Faut-il être technique pour suivre cette formation ?", "Non. Le parcours est conçu pour apprendre à cadrer, questionner et décider. Les notions techniques sont expliquées uniquement lorsqu’elles servent à comprendre un choix d’architecture, de donnée, de contrôle ou de mesure."],
      ["Peut-on travailler sur nos propres projets IA ?", "Oui, lorsque les données et documents peuvent être utilisés dans le cadre de la formation. Un projet réel est souvent le meilleur support pour transformer les concepts en grille de décision réutilisable."],
      ["La formation donne-t-elle une méthode de gouvernance ?", `Elle fournit des repères, des questions et des modèles de décision. Le garde-fou central est : ${guardrail}. La gouvernance finale doit ensuite être adaptée aux responsabilités, outils et règles de l’organisation.`],
      ["Comment évaluer les acquis ?", `L’évaluation proposée consiste à ${assessment}. Elle vérifie la capacité à appliquer la méthode sur un cas différent de celui utilisé pendant l’atelier.`],
      ["Quel résultat concret reste après la formation ?", `Le participant repart notamment avec ${deliverable}, ainsi qu’une grille qu’il peut réutiliser dans ses ${context.futureReviews}.`]
    ],
    sections
  };
}
