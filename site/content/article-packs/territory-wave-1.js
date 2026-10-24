export const territoryArticlesWave1 = [
  {
    type: "territory",
    slug: "comment-construire-feuille-route-ia-communaute-de-communes",
    cluster: "Stratégie IA territoriale",
    title: "Comment construire une feuille de route IA pour une communauté de communes : méthode, cas d’usage et gouvernance",
    dek: "Une feuille de route IA intercommunale utile ne commence ni par l’achat d’un outil ni par une liste de promesses. Elle part des missions, des irritants des agents, des données réellement disponibles, des risques et des priorités du territoire.",
    summary: "Ce guide propose une méthode opérationnelle pour une communauté de communes ou d’agglomération : cadrer les objectifs, interroger les services, cartographier les tâches, sélectionner des cas d’usage, vérifier les données et les responsabilités, lancer quelques pilotes mesurables, former les agents et organiser le passage à l’échelle. L’IA reste un outil d’assistance : les décisions publiques, les validations sensibles et la responsabilité des agents ne sont pas déléguées au modèle.",
    readingTime: "22–26 min",
    publishedAt: "2026-09-23",
    modifiedAt: "2026-09-23",
    jobSignalTags: ["public_sector_ai", "ai_governance", "process_automation", "change_management", "training", "data_governance"],
    search: {
      primaryKeyword: "feuille de route IA communauté de communes",
      secondaryQueries: [
        "intelligence artificielle communauté de communes",
        "IA intercommunalité",
        "stratégie IA collectivité territoriale",
        "cas d’usage IA collectivité",
        "plan IA agents territoriaux"
      ],
      demandEvidence: ["market_intelligence", "territory_signals", "public_sector_guidance"],
      observedAt: "2026-09-23"
    },
    quickFacts: [
      ["PUBLIC", "Communautés de communes · communautés d’agglomération · EPCI"],
      ["POINT DE DÉPART", "Missions et irritants réels, avant les outils"],
      ["MÉTHODE", "Diagnostic → priorisation → pilotes → mesure → passage à l’échelle"],
      ["GARDE-FOU", "Validation humaine, données maîtrisées, responsabilités explicites"]
    ],
    sourceNote: "Les références ci-dessous établissent plusieurs principes utiles : la DINUM a publié en juin 2026 un cadre d’usage de l’IA pour les agents de l’État qui insiste sur la responsabilité de l’agent, l’usage d’outils autorisés, la transparence et la formation continue ; la CNIL rappelle les principes de finalité, minimisation, durée de conservation, sécurité et droits des personnes pour les collectivités ; France Num documente l’accompagnement des TPE-PME vers l’IA et l’existence de dispositifs portés notamment par l’État et les collectivités. La méthode Autonomia proposée ici est une construction opérationnelle : elle doit être adaptée aux compétences, règles, systèmes d’information, contrats et décisions de chaque EPCI.",
    sources: [
      {
        label: "DINUM — Guide d’usage de l’intelligence artificielle pour les agents publics",
        url: "https://www.numerique.gouv.fr/offre-accompagnement/guide-usage-intelligence-artificielle/"
      },
      {
        label: "CNIL — Collectivités territoriales : principes clés de protection des données",
        url: "https://www.cnil.fr/fr/collectivites-territoriales/les-principes-cles-de-la-protection-des-donnees"
      },
      {
        label: "CNIL — Comment déployer une IA générative ? premières précisions",
        url: "https://www.cnil.fr/fr/comment-deployer-une-ia-generative-la-cnil-apporte-de-premieres-precisions"
      },
      {
        label: "France Num — Aides et accompagnements pour aider les TPE-PME à exploiter l’IA",
        url: "https://www.francenum.gouv.fr/aides-financieres/guides-et-conseils-financiers/quelles-sont-les-aides-financieres-pour-aider-les"
      }
    ],
    faq: [
      ["Faut-il commencer par choisir ChatGPT, Copilot, Gemini ou un autre outil ?", "Non. Le premier travail consiste à identifier les missions, les tâches répétitives, les flux documentaires, les données disponibles et les contraintes de chaque service. Le choix d’un outil intervient ensuite, lorsqu’un besoin est suffisamment défini pour comparer les solutions sur des critères concrets."],
      ["Une communauté de communes doit-elle avoir une DSI importante pour lancer une démarche IA ?", "Pas nécessairement pour mener un diagnostic, former les équipes et tester des usages à faible risque. En revanche, dès qu’un système accède à des données internes, s’intègre au système d’information ou produit des actions automatisées, les compétences techniques, sécurité, protection des données et achats doivent être mobilisées au niveau adapté."],
      ["Combien de cas d’usage faut-il lancer en même temps ?", "Une feuille de route peut recenser de nombreuses opportunités, mais une première vague gagne à rester limitée. Quelques pilotes bien documentés donnent davantage d’informations qu’une multitude d’expérimentations impossibles à suivre. La quantité pertinente dépend des ressources, des risques et de la capacité d’accompagnement."],
      ["Comment éviter que les agents utilisent chacun leurs propres outils IA ?", "Il faut rendre les règles et les alternatives compréhensibles : quels outils sont autorisés, quelles données peuvent être utilisées, pour quelles tâches, avec quelles validations et vers qui se tourner en cas de doute. Une interdiction non accompagnée d’une solution de travail peut simplement déplacer les usages hors du cadre visible."],
      ["Peut-on mesurer un retour sur investissement public ?", "Oui, mais il faut définir ce que l’on mesure avant le pilote : délai de traitement, nombre d’étapes, taux de reprise, satisfaction des agents, qualité documentaire, délai de réponse ou capacité dégagée pour des tâches à plus forte valeur. Les gains ne doivent pas être inventés ; ils doivent être observés sur le processus concerné."]
    ],
    sections: [
      {
        id: "partir-missions",
        kicker: "01 — LE POINT DE DÉPART",
        heading: "Ne commencez pas par l’IA. Commencez par le travail réel.",
        paragraphs: [
          "Une communauté de communes peut facilement se retrouver face à deux discours opposés. D’un côté, l’IA serait un bouleversement qui impose d’agir immédiatement. De l’autre, elle serait trop risquée, trop complexe ou trop immature pour l’action publique locale. Une feuille de route sérieuse évite ces deux raccourcis. Elle commence par regarder ce que les agents font réellement : recevoir des demandes, préparer des réunions, rédiger des notes, contrôler des dossiers, rechercher une procédure, compiler des informations, répondre aux entreprises du territoire, suivre des décisions, produire des tableaux, mettre à jour des documents et coordonner plusieurs acteurs.",
          "Le premier livrable n’est donc pas un catalogue d’outils. C’est une cartographie des missions et des frictions. Pour chaque direction, on cherche les tâches qui consomment du temps sans exiger en permanence un jugement expert : ressaisies, classement, recherche documentaire, synthèse, préparation de brouillons, comparaison de versions, extraction d’informations, comptes rendus, mise en forme ou rappels. On repère également les tâches où l’erreur serait grave : décisions individuelles, données très sensibles, attribution de droits, évaluations de personnes, engagement financier ou production réglementaire. Ces deux cartes — opportunités et risques — doivent être construites ensemble.",
          "Le diagnostic doit être concret. Demander aux agents « où pourrait-on mettre de l’IA ? » produit souvent des réponses vagues. Il vaut mieux partir d’une semaine de travail : quelles demandes reviennent ? quels documents sont ouverts dix fois ? quelles informations sont recherchées dans plusieurs dossiers ? quelles étapes nécessitent un copier-coller ? à quel endroit un dossier attend-il parce que l’information n’est pas au bon format ? où les agents recréent-ils une synthèse qui existe déjà ailleurs ? Chaque irritant devient une hypothèse de cas d’usage, pas encore une décision de projet.",
          "Cette approche a aussi une vertu de conduite du changement. Les agents ne sont pas invités à admirer une technologie extérieure à leur métier. Ils décrivent leur propre travail et participent à la définition de ce qui mérite d’être simplifié. Le projet peut alors distinguer trois catégories : ce qui relève d’une amélioration de processus sans IA, ce qui peut être automatisé avec des règles classiques, et ce pour quoi un modèle d’IA apporte réellement une capacité d’interprétation ou de génération."
        ]
      },
      {
        id: "gouvernance",
        kicker: "02 — LA GOUVERNANCE",
        heading: "DGS, DSI, DPO et métiers : chacun doit savoir quelle décision lui appartient.",
        paragraphs: [
          "Une démarche IA territoriale devient fragile lorsqu’elle repose sur une seule personne enthousiaste. Elle devient tout aussi lourde lorsqu’un comité trop large doit valider chaque test. La bonne gouvernance cherche un équilibre : une direction politique et administrative claire, un petit noyau opérationnel capable d’arbitrer rapidement, et des experts sollicités au bon moment. Selon l’organisation de l’EPCI, le noyau peut associer direction générale, numérique ou système d’information, protection des données, transformation, ressources humaines et représentants des services pilotes.",
          "Le rôle de la direction générale est de fixer les objectifs et les limites : pourquoi le territoire engage-t-il cette démarche ? réduction de tâches répétitives, amélioration de l’accès à l’information, qualité de service, accompagnement économique, montée en compétences ? La DSI ou la fonction numérique examine l’architecture, les identités, les accès, les intégrations, les journaux et la réversibilité. Le DPO intervient lorsque des données personnelles sont concernées et aide à qualifier le traitement, les données nécessaires et les garanties. Les métiers restent propriétaires du processus : eux seuls peuvent dire si une sortie est utile, si une erreur est acceptable et où une validation humaine doit rester obligatoire.",
          "Un registre de décisions simple peut éviter beaucoup de confusion. Pour chaque cas d’usage : objectif, service pilote, données utilisées, outil, niveau d’autonomie, actions possibles, validation humaine, propriétaire, critères de réussite, risques identifiés, date de revue. Ce document n’a pas besoin d’être volumineux. Sa valeur vient du fait qu’il oblige à expliciter les choix et qu’il permet de comprendre six mois plus tard pourquoi un pilote a été lancé ou arrêté.",
          "La gouvernance doit aussi couvrir les usages individuels. Les agents utilisent déjà ou utiliseront des assistants généralistes pour rédiger, résumer ou chercher des idées. Le cadre doit expliquer les usages autorisés, les informations à ne pas transmettre, la manière de vérifier une réponse et le niveau de transparence attendu. Le guide interministériel publié en 2026 pour les agents de l’État fournit des principes transposables comme points de réflexion, même si une collectivité doit définir son propre cadre selon ses responsabilités et ses outils."
        ]
      },
      {
        id: "prioriser",
        kicker: "03 — PRIORISER",
        heading: "Un bon premier cas d’usage est utile, mesurable et récupérable en cas d’erreur.",
        paragraphs: [
          "Le meilleur premier projet n’est pas nécessairement celui qui promet le gain théorique le plus spectaculaire. Pour apprendre, il faut privilégier un processus suffisamment fréquent pour produire des observations, suffisamment simple pour être compris, et suffisamment réversible pour qu’une erreur ne crée pas une situation difficile à corriger. Préparer un compte rendu, rechercher dans des procédures internes ou créer un brouillon de réponse sont souvent plus appropriés pour une première vague qu’un système qui prendrait directement une décision sur un administré.",
          "On peut noter chaque opportunité selon plusieurs dimensions : fréquence de la tâche, temps mobilisé, irritant pour les agents, qualité actuelle, disponibilité des données, facilité d’intégration, sensibilité des informations, impact potentiel d’une erreur, nécessité d’un jugement humain, capacité à mesurer avant/après et possibilité de revenir en arrière. La note finale n’est pas une vérité mathématique. Elle sert à rendre l’arbitrage visible et à comparer des projets qui, autrement, seraient défendus surtout par intuition.",
          "La feuille de route doit conserver des cas d’usage de niveaux différents. Des usages individuels encadrés peuvent apporter rapidement de la valeur : reformuler un texte, préparer un plan, résumer un document non sensible. Des workflows d’équipe demandent davantage de conception : compte rendu vers tâches, classement documentaire, extraction de données vers un tableau, assistant qui cite une base interne. Enfin, certains systèmes transverses nécessitent une véritable architecture, des intégrations et une gouvernance renforcée. Mélanger ces niveaux sous le mot « IA » conduit à appliquer la même procédure à des risques et des investissements très différents.",
          "Pour les intercommunalités, il faut ajouter une dimension territoriale à la priorisation. Un cas d’usage peut viser le fonctionnement interne des services, mais aussi le développement économique : diagnostics IA pour les entreprises locales, ateliers par secteur, accompagnement des TPE-PME, ou mise en relation avec des dispositifs existants. Ces deux axes — transformation de l’administration et accompagnement du tissu économique — peuvent partager une gouvernance, des ressources pédagogiques et une capacité d’observation, sans être confondus."
        ]
      },
      {
        id: "pilotes",
        kicker: "04 — LES PILOTES",
        heading: "Tester une hypothèse de travail, pas organiser une démonstration.",
        paragraphs: [
          "Un pilote utile commence avec une phrase testable : « si nous assistons la préparation des comptes rendus de telle réunion, nous réduirons le temps de rédaction tout en conservant le niveau de précision attendu ». On mesure alors le temps actuel, la qualité attendue et les étapes du processus. Le prototype est construit pour cette situation précise. Il ne cherche pas à devenir dès la première semaine la plateforme IA de toute la collectivité.",
          "La mesure avant/après est indispensable. Sans point de départ, le projet sera évalué sur des impressions. Les indicateurs peuvent être simples : durée moyenne de préparation, nombre de corrections, taux de documents retrouvés sans aide, délais de réponse, nombre de reprises, satisfaction des agents pilotes, part des sorties acceptées sans modification substantielle. Selon le cas, certains indicateurs qualitatifs sont plus pertinents qu’un calcul financier. Il faut surtout garder la même définition pendant le test.",
          "Chaque pilote doit aussi avoir un scénario d’échec. Que se passe-t-il si le modèle ne comprend pas le document ? si une source manque ? si la réponse semble plausible mais fausse ? si l’intégration est indisponible ? si un agent quitte le service ? Le système doit pouvoir refuser, demander une validation, conserver le document original, tracer la sortie ou revenir au processus manuel. L’objectif n’est pas de supprimer l’humain mais de déplacer son intervention vers les cas où elle est utile.",
          "Au terme du pilote, quatre décisions sont possibles : arrêter, modifier, prolonger ou industrialiser. Arrêter un cas d’usage n’est pas un échec si le test a montré que le gain est faible, les données inadéquates ou le risque disproportionné. Une feuille de route crédible contient aussi des projets écartés et les raisons documentées. Elle montre que l’organisation apprend au lieu de chercher à justifier a posteriori chaque expérimentation."
        ]
      },
      {
        id: "donnees",
        kicker: "05 — DONNÉES & PROTECTION",
        heading: "Une IA utile n’autorise pas à envoyer tout le système d’information dans un modèle.",
        paragraphs: [
          "Les collectivités manipulent des données relatives aux administrés, aux agents, aux partenaires et aux entreprises. Le principe de minimisation rappelé par la CNIL donne une règle de conception très pratique : n’utiliser que les données nécessaires à l’objectif. Si un modèle doit classer une demande selon son thème, a-t-il besoin du dossier complet, de l’identité de la personne ou seulement d’un extrait ? Si un assistant doit répondre sur une procédure interne, peut-on l’alimenter avec la documentation de référence plutôt qu’avec des dossiers individuels ?",
          "La feuille de route doit donc associer chaque cas d’usage à sa cartographie de données : sources, catégories d’information, localisation, durée de conservation, droits d’accès, sous-traitants éventuels et sorties produites. Cette cartographie aide ensuite la DSI, le DPO et les métiers à déterminer les exigences adaptées. Elle rend également visible un problème fréquent : le projet IA révèle parfois que les documents sont déjà dispersés, obsolètes ou accessibles trop largement avant même l’arrivée de l’IA.",
          "La sécurité ne se réduit pas au choix d’un fournisseur. Il faut examiner les comptes de service, les permissions accordées aux connecteurs, la gestion des secrets, les journaux, la séparation entre environnement de test et production, la révocation des accès et la reprise en cas d’incident. Un outil peut être correctement contracté mais mal configuré. À l’inverse, un prototype très limité avec des données fictives peut permettre d’apprendre sans exposer le système réel.",
          "Enfin, une collectivité doit distinguer l’usage d’un assistant généraliste par un agent, l’intégration d’un modèle à un workflow interne et la conception d’un système d’IA qui influence une décision ou un service public. Ces situations n’ont ni le même niveau de risque ni les mêmes exigences. La feuille de route doit les séparer au lieu de produire une unique règle « IA autorisée/interdite »."
        ]
      },
      {
        id: "competences",
        kicker: "06 — COMPÉTENCES",
        heading: "Former les agents au moment où les usages deviennent réels.",
        paragraphs: [
          "Une acculturation générale peut créer un vocabulaire commun, mais elle ne suffit pas à transformer les pratiques. Les agents ont besoin de situations proches de leur travail : préparer une note, rechercher une procédure, comparer deux documents, structurer un compte rendu, transformer des informations en tableau ou produire un brouillon. La formation devient plus efficace lorsqu’elle accompagne les pilotes et que les participants peuvent discuter de leurs propres exemples.",
          "Le socle commun doit couvrir au moins cinq compétences : comprendre ce qu’un modèle peut et ne peut pas faire ; formuler une tâche et fournir le contexte utile ; vérifier les faits, sources et calculs ; protéger les données et utiliser les outils autorisés ; savoir quand interrompre l’usage de l’IA et solliciter une personne compétente. Pour les personnes qui construisent des workflows, on ajoute la compréhension des données structurées, des règles, des permissions, des tests et de l’observabilité.",
          "Un réseau léger de référents IA peut accélérer l’apprentissage, à condition de ne pas transformer quelques agents volontaires en support gratuit permanent. Leur rôle peut être de remonter les cas d’usage, partager des méthodes validées, documenter les erreurs fréquentes et orienter les questions vers les bons interlocuteurs. Les référents doivent eux-mêmes disposer d’un temps, d’une formation et d’une procédure d’escalade.",
          "La formation continue est également importante parce que les outils, les règles internes et les capacités évoluent rapidement. Une fiche pratique datée, une bibliothèque de cas d’usage approuvés et une courte revue trimestrielle peuvent être plus utiles qu’un manuel de cent pages rarement mis à jour. L’objectif est de créer une capacité collective d’apprentissage et non une dépendance à un expert extérieur."
        ]
      },
      {
        id: "territoire",
        kicker: "07 — DÉVELOPPEMENT ÉCONOMIQUE",
        heading: "La même feuille de route peut ouvrir un deuxième chantier : aider les entreprises locales à adopter l’IA.",
        paragraphs: [
          "Pour une communauté de communes ou d’agglomération, l’IA ne concerne pas seulement les services internes. Le service développement économique peut rencontrer des TPE-PME qui se posent les mêmes questions : par où commencer, quels usages sont réellement utiles, quelles données peut-on utiliser, faut-il former ou automatiser, comment éviter un abonnement supplémentaire qui ne sera pas utilisé ? France Num rappelle que le coût, le manque d’expertise interne et la compatibilité avec les outils existants font partie des freins identifiés à l’adoption de l’IA dans les entreprises.",
          "Un programme territorial peut commencer par la détection des besoins plutôt que par une conférence générique. Questionnaire court, entretiens avec un échantillon d’entreprises, analyse des filières locales, remontées des chambres consulaires et partenaires : l’objectif est de repérer des tâches concrètes. Les besoins d’un artisan, d’un cabinet de services, d’un commerce et d’une PME industrielle ne seront pas identiques, même si les mêmes briques technologiques apparaissent derrière.",
          "La progression peut combiner une session collective pour les principes communs, des ateliers sectoriels, un diagnostic individuel et quelques prototypes accompagnés. Les résultats doivent être suivis : entreprises participantes, cas d’usage effectivement testés, projets abandonnés, besoins de compétence, obstacles techniques ou juridiques. Cette observation devient ensuite une donnée utile pour la politique de développement économique du territoire.",
          "Il est également utile de cartographier les dispositifs déjà disponibles afin de ne pas recréer une offre publique qui ferait doublon. France Num recense des ressources, activateurs et aides autour de la transformation numérique et de l’IA. La valeur d’un programme intercommunal peut se situer dans l’orientation, la proximité, la mutualisation et le suivi : aider l’entreprise à transformer une curiosité en problème bien défini, puis l’orienter vers le bon niveau d’accompagnement."
        ]
      },
      {
        id: "roadmap",
        kicker: "08 — LA FEUILLE DE ROUTE",
        heading: "À la fin, le document doit permettre de décider quoi faire lundi matin.",
        paragraphs: [
          "Une feuille de route opérationnelle peut tenir sur quelques vues reliées. La première présente les objectifs et principes : assistance plutôt que décision automatique, données minimisées, validation humaine aux points sensibles, traçabilité et mesure. La deuxième montre le portefeuille de cas d’usage classé par service, valeur, difficulté, risque et maturité. La troisième détaille la première vague de pilotes avec responsables, calendrier, critères de réussite et dépendances. La quatrième décrit les actions transverses : règles d’usage, outils autorisés, formation, gouvernance, sécurité et documentation.",
          "Le calendrier ne doit pas donner une illusion de précision. Certaines dépendances sont inconnues avant les tests. Il est plus robuste de raisonner en vagues : diagnostic et cadrage ; pilotes à faible risque ; revue ; intégrations plus profondes ; extension aux autres services. À chaque passage, les critères d’entrée sont explicites. Un projet ne passe pas en production parce qu’il a produit une belle démonstration, mais parce que son utilité, ses données, son propriétaire, ses contrôles et sa maintenance sont suffisamment compris.",
          "Le cockpit de suivi doit rester simple. Pour chaque cas d’usage : état, responsable, preuve du besoin, indicateur de départ, résultat du test, incidents, décision suivante. On peut ajouter une vue des compétences et des formations, ainsi qu’un registre des outils autorisés. Les directions disposent alors d’une vision commune sans exiger que chaque agent devienne spécialiste de l’IA.",
          "Enfin, la feuille de route doit être revue. Les modèles changent, les coûts évoluent, de nouveaux produits apparaissent et des usages internes émergent. Un rendez-vous trimestriel ou semestriel peut suffire pour fermer les expérimentations inutiles, enrichir les cas d’usage efficaces et mettre à jour les règles. La stratégie n’est pas un document figé : c’est un mécanisme de décision qui permet à l’intercommunalité d’apprendre plus vite tout en gardant la maîtrise de ses missions."
        ],
        steps: [
          { title: "1. Diagnostiquer", text: "Cartographier missions, irritants, données, risques et usages déjà existants." },
          { title: "2. Prioriser", text: "Comparer les cas d’usage selon valeur, faisabilité, risque, réversibilité et mesure." },
          { title: "3. Cadrer", text: "Nommer propriétaire, données, outil, validation, critères de réussite et scénario d’échec." },
          { title: "4. Piloter", text: "Tester sur un périmètre limité avec mesure avant/après." },
          { title: "5. Former", text: "Faire monter les agents en compétence sur les usages qu’ils rencontrent réellement." },
          { title: "6. Décider", text: "Arrêter, adapter, prolonger ou industrialiser en fonction des preuves." },
          { title: "7. Capitaliser", text: "Documenter les règles, erreurs, méthodes, composants réutilisables et résultats." }
        ],
        callout: {
          title: "Le résultat recherché",
          text: "Une communauté de communes qui sait sélectionner, tester et gouverner ses usages IA — pas une collectivité dépendante d’un catalogue d’outils ou d’un fournisseur unique."
        }
      }
    ]
  }
];
