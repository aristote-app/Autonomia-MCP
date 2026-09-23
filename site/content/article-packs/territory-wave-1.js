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
  ,
  {
    type: "territory",
    slug: "ia-pour-les-agents-territoriaux-12-cas-d-usage-concrets-et-controlables",
    cluster: "Agents & services publics",
    title: "IA pour les agents territoriaux : 12 cas d’usage concrets et contrôlables",
    dek: "L’IA peut aider les agents à rédiger, rechercher, synthétiser, préparer une réunion ou traiter un flux documentaire. Le sujet n’est pas de tout automatiser, mais de choisir des usages utiles, réversibles et vérifiables.",
    summary: "Ce guide propose douze cas d’usage adaptés aux collectivités et intercommunalités, avec pour chacun le niveau d’autonomie recommandé, les données à surveiller, les validations humaines à conserver et les critères simples permettant de décider si l’usage mérite d’être déployé. L’objectif est de passer d’une curiosité pour l’IA à des pratiques de travail explicites, documentées et maîtrisées.",
    readingTime: "24–28 min",
    publishedAt: "2026-09-23",
    modifiedAt: "2026-09-23",
    jobSignalTags: ["public_sector_ai", "agent_productivity", "knowledge_management", "governance", "training", "document_automation"],
    search: {
      primaryKeyword: "IA pour les agents territoriaux",
      secondaryQueries: [
        "cas d’usage IA collectivité territoriale",
        "intelligence artificielle agents territoriaux",
        "IA agents publics",
        "automatisation collectivité territoriale",
        "IA communauté de communes agents"
      ],
      demandEvidence: ["public_sector_guidance", "territory_signals", "market_intelligence"],
      observedAt: "2026-09-23"
    },
    quickFacts: [
      ["PUBLIC", "Agents · managers · directions métiers · fonctions support"],
      ["LOGIQUE", "Assister d’abord, automatiser ensuite si le processus est maîtrisé"],
      ["GARDE-FOU", "Sources, données, permissions et validation humaine explicites"],
      ["MESURE", "Temps, qualité, reprises, satisfaction et incidents observés avant/après"]
    ],
    sourceNote: "Les références publiques utilisées ici ne constituent pas une règle unique applicable à toutes les collectivités. Elles apportent des repères opérationnels. En juin 2026, la DINUM, la DITP et la DGAFP ont publié un guide d’usage de l’IA pour les agents de l’État centré sur la responsabilité de l’agent, le choix des outils selon les données, la transparence, l’utilité réelle et la formation. DesignGouv rappelle également que l’IA dans les services publics doit rester au service des usagers et des missions. La CNIL fournit les principes de protection des données qui doivent être traduits dans chaque cas d’usage. Chaque collectivité reste responsable de son cadre, de ses outils et de ses procédures.",
    sources: [
      {
        label: "DINUM — Guide d’usage de l’intelligence artificielle pour les agents publics",
        url: "https://www.numerique.gouv.fr/offre-accompagnement/guide-usage-intelligence-artificielle/"
      },
      {
        label: "IA dans l’État — Portail des chartes IA dans l’administration",
        url: "https://ia.numerique.gouv.fr/ressources/portail-des-chartes-ia-dans-ladministration/"
      },
      {
        label: "DesignGouv — Services publics et intelligence artificielle",
        url: "https://design.numerique.gouv.fr/en/articles/2026-03-10-ia/"
      },
      {
        label: "CNIL — Collectivités territoriales : principes clés de protection des données",
        url: "https://www.cnil.fr/fr/collectivites-territoriales/les-principes-cles-de-la-protection-des-donnees"
      }
    ],
    faq: [
      ["Quels agents peuvent commencer à utiliser l’IA ?", "Il n’existe pas un profil unique. Les premiers usages peuvent concerner la direction, les fonctions support ou les services métiers dès lors que la tâche est bien définie, que l’outil est autorisé et que les informations utilisées sont compatibles avec le cadre de la collectivité. Il est souvent plus utile de sélectionner quelques tâches fréquentes que de sélectionner des agents uniquement selon leur appétence technologique."],
      ["Faut-il créer un chatbot pour avoir un vrai projet IA ?", "Non. Un premier projet peut être beaucoup plus simple : synthétiser un dossier, préparer un compte rendu, retrouver une procédure ou structurer un tableau. Les assistants conversationnels visibles ne sont qu’une forme d’usage parmi d’autres. Une petite amélioration répétée chaque semaine peut produire davantage de valeur qu’un grand chatbot peu utilisé."],
      ["Peut-on utiliser l’IA pour répondre automatiquement aux administrés ?", "Une IA peut aider à rechercher une information, proposer un brouillon ou orienter une demande. L’envoi automatique doit être évalué séparément. Plus la réponse engage la collectivité, dépend du dossier d’une personne ou peut affecter ses droits, plus une validation humaine et un ancrage dans des sources fiables deviennent indispensables."],
      ["Comment savoir si un cas d’usage fonctionne ?", "Avant le test, il faut définir le point de départ : temps consacré, nombre d’étapes, erreurs ou reprises, délai, qualité attendue. Après quelques semaines, on compare. Un usage peut être abandonné s’il ajoute des vérifications sans réduire les frictions, même s’il paraît technologiquement impressionnant."],
      ["Faut-il former tous les agents avant de commencer ?", "Un socle commun est utile pour les règles, les limites, la vérification et les données. Il peut ensuite être complété par des ateliers ciblés autour des processus réellement rencontrés par chaque population. La formation et les pilotes peuvent progresser ensemble plutôt que d’attendre qu’une organisation entière soit formée avant tout test."]
    ],
    sections: [
      {
        id: "usage-avant-outil",
        kicker: "01 — PARTIR DU TRAVAIL",
        heading: "Un bon cas d’usage commence par une tâche que l’on peut décrire sans prononcer le mot IA.",
        paragraphs: [
          "Dans une collectivité, la tentation est forte de commencer par l’outil : faut-il ChatGPT, Copilot, Gemini, un assistant souverain, un moteur documentaire ou un agent ? Cette question arrive trop tôt. Avant de choisir une solution, il faut pouvoir décrire la tâche en langage de travail : recevoir des documents, rechercher une procédure, préparer une note, comparer deux versions, produire un compte rendu, extraire des éléments d’un formulaire ou organiser les suites d’une réunion. Tant que cette description n’est pas claire, l’IA reste une démonstration et non un projet.",
          "Le meilleur point de départ est souvent une tâche fréquente qui mobilise beaucoup de lecture, de reformulation, de classement ou de recherche, tout en laissant à l’agent une capacité simple de contrôle. Si une sortie imparfaite peut être repérée et corrigée avant qu’elle n’ait d’effet externe, le contexte est favorable à l’apprentissage. À l’inverse, un usage qui produirait directement une décision engageante, sans source visible ni reprise possible, demande un niveau de maîtrise bien supérieur.",
          "Le diagnostic peut être conduit service par service avec des questions très concrètes : que recopiez-vous ? que recherchez-vous chaque semaine ? quelles réunions donnent lieu à des comptes rendus longs à préparer ? quelles demandes reviennent sous des formes légèrement différentes ? quels documents doivent être lus avant de retrouver trois informations ? quelles procédures sont connues uniquement par quelques personnes ? Ces réponses forment une première carte de cas d’usage potentiels.",
          "Cette méthode évite aussi un malentendu fréquent : tout ce qui est répétitif n’a pas besoin d’IA. Une règle, un formulaire mieux conçu, un modèle de document, une intégration entre deux logiciels ou une automatisation classique peuvent suffire. L’IA devient intéressante lorsque le système doit interpréter du langage, résumer, classer un contenu variable, retrouver une information dans plusieurs sources ou produire un premier brouillon à partir d’un contexte."
        ]
      },
      {
        id: "12-cas",
        kicker: "02 — 12 CAS D’USAGE",
        heading: "Douze usages concrets, du plus simple au plus structurant.",
        paragraphs: [
          "Les douze cas ci-dessous ne forment pas une liste de fonctionnalités à déployer partout. Ils servent de bibliothèque pour reconnaître des situations de travail. Une communauté de communes pourra en sélectionner deux ou trois pour une première vague, tandis qu’une grande collectivité pourra les décliner différemment selon les directions. L’important est de conserver le lien entre le besoin, la donnée, la personne qui valide et le résultat attendu.",
          "Pour chaque cas, on peut commencer avec une version assistée où l’agent déclenche l’action et relit le résultat. Ce mode est souvent préférable lors des premières semaines. Il fournit des données d’usage et révèle les erreurs réelles. Si le cas s’avère stable, certaines étapes peuvent ensuite être intégrées à un workflow. Le passage de l’assistance à l’automatisation doit être une décision, pas une conséquence automatique du succès d’une démonstration."
        ],
        steps: [
          { title: "01 — Préparer un compte rendu de réunion", text: "Transformer une transcription ou des notes en synthèse structurée, décisions, responsables et échéances. L’agent vérifie les formulations, les engagements et les noms avant diffusion." },
          { title: "02 — Rechercher dans des procédures internes", text: "Interroger une base documentaire et obtenir une réponse accompagnée de la source utilisée. Le système doit pouvoir dire qu’il ne trouve pas la réponse au lieu d’inventer." },
          { title: "03 — Résumer un dossier long", text: "Produire un premier résumé, une chronologie ou une liste de points à examiner. Le document original reste accessible et les éléments importants sont vérifiés par l’agent." },
          { title: "04 — Préparer un brouillon de réponse", text: "À partir d’une demande et d’une base de réponses ou procédures, préparer un texte que l’agent adapte avant envoi. La décision et la responsabilité restent humaines." },
          { title: "05 — Classer des demandes entrantes", text: "Identifier le thème d’un message ou d’un formulaire pour l’orienter vers la bonne file. Prévoir une catégorie “incertain” évite de forcer le classement lorsque le contenu est ambigu." },
          { title: "06 — Extraire des informations de documents", text: "Repérer dates, références, montants ou champs définis puis les proposer dans un tableau. Les valeurs critiques sont contrôlées avant enregistrement dans le système métier." },
          { title: "07 — Comparer plusieurs versions d’un texte", text: "Faire ressortir les ajouts, suppressions et changements de sens entre deux documents. L’IA aide à lire plus vite mais ne remplace pas la validation juridique ou métier." },
          { title: "08 — Préparer une note ou une présentation", text: "Structurer un plan à partir de documents de référence, proposer des messages clés et identifier les points manquants. Les faits et chiffres sont reliés à leurs sources." },
          { title: "09 — Transformer une réunion en plan d’action", text: "Convertir décisions et discussions en tâches proposées, puis faire valider les responsables et échéances avant création dans l’outil de suivi." },
          { title: "10 — Construire une veille assistée", text: "Collecter des sources autorisées, résumer les nouveautés et classer les éléments par thème. Les textes réglementaires ou décisions importantes doivent rester consultables dans leur version d’origine." },
          { title: "11 — Aider à produire des contenus d’information", text: "Préparer une première version de newsletter, page web ou message d’information à partir de données validées. L’agent vérifie exactitude, ton, accessibilité et caractère public des informations." },
          { title: "12 — Créer un assistant métier interne", text: "Réunir procédures, modèles et réponses de référence dans un assistant qui cite ses sources. Ce projet demande davantage de gouvernance documentaire, de droits d’accès et de suivi de la fraîcheur des contenus." }
        ]
      },
      {
        id: "comptes-rendus",
        kicker: "03 — RÉUNIONS & COORDINATION",
        heading: "Les réunions sont un bon terrain d’apprentissage parce que le résultat reste facilement contrôlable.",
        paragraphs: [
          "Le compte rendu est souvent cité comme premier usage parce qu’il réunit plusieurs tâches adaptées à l’IA : transcription, synthèse, regroupement par thème, extraction de décisions et préparation d’un plan d’action. Mais il faut distinguer la capacité technique de la fiabilité organisationnelle. Une transcription peut mal reconnaître un nom, confondre deux intervenants ou transformer une discussion en décision. La sortie ne doit donc pas être envoyée automatiquement au seul motif qu’elle est bien présentée.",
          "Un workflow robuste conserve la matière source, génère une proposition puis exige une revue. On peut demander au modèle de séparer clairement trois catégories : décisions confirmées, actions proposées, points à clarifier. Cette structure réduit le risque qu’une phrase hypothétique devienne un engagement. Pour les réunions sensibles, la question de l’enregistrement, de l’information des participants, de la conservation et des outils utilisés doit être cadrée en amont.",
          "Le gain ne se mesure pas seulement au temps de rédaction. Il faut observer la qualité du suivi : les décisions sont-elles mieux retrouvées ? les tâches sont-elles créées plus vite ? les responsables reçoivent-ils une information plus claire ? les comptes rendus sont-ils moins dépendants d’une personne ? Un système qui produit un texte en cinq minutes mais oblige à trente minutes de corrections n’est pas forcément une amélioration.",
          "Ce cas d’usage permet aussi de former les agents à une notion essentielle : l’IA n’est pas une source de vérité. Elle transforme une matière fournie. Plus la matière est incomplète ou ambiguë, plus la sortie l’est aussi. Montrer les erreurs sur des réunions réelles crée souvent une compréhension plus durable des limites qu’une présentation théorique sur les hallucinations."
        ]
      },
      {
        id: "recherche-documentaire",
        kicker: "04 — DOCUMENTS & PROCÉDURES",
        heading: "La recherche interne devient puissante lorsque le système cite la procédure au lieu de répondre de mémoire.",
        paragraphs: [
          "Beaucoup d’agents perdent du temps non parce que l’information n’existe pas, mais parce qu’elle est dispersée entre un intranet, des dossiers partagés, des PDF, des modèles et des habitudes de service. Un assistant documentaire peut réduire ce coût de recherche en permettant de poser une question en langage naturel. La condition essentielle est que la réponse reste reliée à des documents identifiés, avec un lien, un titre ou un extrait permettant la vérification.",
          "Avant de connecter un modèle, il faut travailler sur le corpus : quelles procédures font référence ? qui les maintient ? quelles versions sont obsolètes ? certains documents contiennent-ils des informations réservées à un service ? Les droits existants doivent être respectés. Un assistant qui donne accès à toute la documentation à tout le monde n’est pas une amélioration de la connaissance ; c’est un nouveau problème de permissions.",
          "La fraîcheur est également critique. Une réponse parfaitement sourcée peut être fausse si la source est ancienne. Chaque document important doit idéalement avoir un propriétaire, une date de dernière révision et un mécanisme d’archivage. Le moteur de recherche peut alors privilégier les versions actives et avertir lorsque deux procédures se contredisent. L’IA révèle souvent les défauts de gouvernance documentaire qui existaient déjà.",
          "Ce type d’assistant est particulièrement intéressant pour l’onboarding, les fonctions support et les processus transverses. Il ne supprime pas le besoin d’experts internes ; il réduit le nombre de questions répétitives et permet à l’expert d’intervenir sur les cas complexes. La réussite se mesure par la capacité à retrouver plus vite une information vérifiable, pas par le nombre de réponses générées."
        ]
      },
      {
        id: "administrés",
        kicker: "05 — RELATION AUX USAGERS",
        heading: "Préparer une réponse n’est pas décider à la place de l’agent.",
        paragraphs: [
          "Les services reçoivent souvent des demandes répétitives : horaires, pièces à fournir, état d’une démarche, orientation vers un service, compréhension d’une procédure. L’IA peut aider à identifier le sujet, rechercher l’information et préparer un brouillon. Ce fonctionnement est différent d’un système qui déciderait automatiquement du droit d’une personne ou enverrait une réponse définitive sans contrôle. Les deux usages ne doivent pas être confondus.",
          "Le premier niveau consiste à améliorer le poste de travail de l’agent. La demande arrive, le système propose les informations pertinentes et une réponse, puis l’agent adapte et valide. Ce modèle permet de tester la couverture documentaire et les erreurs sans modifier immédiatement l’expérience de l’usager. Il peut aussi aider les nouveaux agents à retrouver les formulations et procédures de référence.",
          "Un deuxième niveau peut concerner l’orientation : reconnaître qu’une demande relève de l’eau, des déchets, de l’urbanisme ou du développement économique, puis la transmettre à la bonne équipe. Ici encore, une catégorie de repli est indispensable. Un système de tri doit pouvoir reconnaître qu’il ne sait pas. Le taux de demandes correctement classées et le nombre de réorientations sont des indicateurs plus utiles qu’une impression générale de fluidité.",
          "Lorsque l’IA devient visible pour l’usager, la transparence, la qualité des informations et l’accès à une personne doivent être pensés dès la conception. Un chatbot n’est pas une fin en soi. Si le site, la recherche ou les formulaires peuvent être simplifiés directement, cette solution peut être préférable. L’objectif du service public reste de résoudre le besoin, pas d’augmenter le nombre d’interactions avec une IA."
        ]
      },
      {
        id: "donnees",
        kicker: "06 — DONNÉES & PERMISSIONS",
        heading: "Chaque cas d’usage doit répondre à une question simple : quelles données quittent leur emplacement d’origine ?",
        paragraphs: [
          "Un agent peut copier un texte dans un assistant sans percevoir qu’il vient de créer un nouveau flux de données. Pour cadrer l’usage, il faut identifier l’entrée, l’outil, le fournisseur, les éventuels sous-traitants, la conservation, les accès et la sortie. Cette cartographie n’a pas besoin d’être compliquée pour les pilotes simples ; elle doit surtout être explicite. Elle permet au DPO, à la DSI et au métier d’examiner le même objet.",
          "Le principe de minimisation fournit un réflexe de conception utile. Si le modèle doit seulement reconnaître le thème d’une demande, l’identité complète de la personne est-elle nécessaire ? Si un assistant cherche une procédure, a-t-il besoin d’accéder aux dossiers des administrés ? Si une synthèse porte sur un document sensible, peut-on tester la méthode d’abord sur un document fictif ou anonymisé ? Réduire les données réduit aussi l’impact potentiel d’une mauvaise configuration.",
          "Les permissions des connecteurs méritent la même attention. Un workflow peut demander accès à une boîte mail, un Drive ou un espace documentaire entier alors qu’il ne devrait lire qu’un dossier spécifique. Il faut limiter les comptes de service, séparer les environnements de test et de production, prévoir la révocation et éviter que les automatisations dépendent du compte personnel d’un agent qui pourrait changer de poste.",
          "Enfin, les données de sortie doivent aussi être gouvernées. Un résumé, une classification ou un brouillon peut contenir des informations sensibles même si le système ne les conserve pas longtemps. Où ces sorties sont-elles stockées ? qui peut les relire ? deviennent-elles une pièce du dossier ou seulement une aide temporaire ? La réponse varie selon le processus, mais elle doit être décidée avant le passage à l’échelle."
        ]
      },
      {
        id: "controle",
        kicker: "07 — CONTRÔLE HUMAIN",
        heading: "Le bon niveau d’autonomie dépend surtout du coût d’une erreur.",
        paragraphs: [
          "Deux tâches peuvent utiliser exactement le même modèle et exiger des architectures différentes. Résumer une note pour préparer une réunion et envoyer une réponse engageante à un administré ne portent pas le même risque. Le niveau de contrôle doit donc être choisi selon l’effet possible de l’erreur, la réversibilité, la sensibilité des données et la facilité de vérification. Il ne devrait pas dépendre uniquement du taux de bonnes réponses observé pendant une démonstration.",
          "On peut distinguer quatre niveaux simples. Niveau un : l’IA suggère et l’agent utilise librement. Niveau deux : l’IA prépare une sortie structurée qui doit être validée. Niveau trois : le système exécute certaines actions déterministes après validation. Niveau quatre : une action se déclenche automatiquement avec surveillance et possibilité de reprise. Beaucoup de premiers projets territoriaux peuvent rester aux niveaux un ou deux tout en produisant une valeur réelle.",
          "Le contrôle humain doit être conçu pour être efficace. Si l’agent doit relire intégralement chaque document et refaire chaque calcul, la valeur disparaît. À l’inverse, une simple case “valider” sans accès aux sources crée une illusion de supervision. Les interfaces doivent présenter l’élément d’origine, la proposition, les points d’incertitude et, lorsque c’est possible, les preuves utilisées.",
          "La collectivité doit aussi définir qui reprend les erreurs. Un système sans propriétaire se dégrade silencieusement : une procédure change, un dossier est déplacé, un compte expire, un modèle modifie son comportement. Le propriétaire du processus doit savoir où consulter les incidents, comment suspendre l’automatisation et qui contacter. La maintenabilité fait partie du cas d’usage dès le départ."
        ]
      },
      {
        id: "mesure",
        kicker: "08 — MESURER",
        heading: "Mesurer une amélioration avant de parler de gain.",
        paragraphs: [
          "Les projets IA sont souvent accompagnés de chiffres impressionnants qui ne correspondent pas au processus local. Une collectivité n’a pas besoin d’un ROI théorique pour lancer un pilote ; elle a besoin d’un point de départ. Pendant une courte période, on mesure le temps consacré à la tâche, le nombre de dossiers, les reprises, les délais et les problèmes fréquents. Cela crée une base comparable.",
          "Après le pilote, les mêmes indicateurs sont relevés. On peut y ajouter le taux d’utilisation, le nombre de sorties refusées, les erreurs importantes et la satisfaction des agents. Pour certains usages, le bénéfice n’est pas une réduction de temps mais une meilleure traçabilité, une réponse plus homogène ou un accès plus rapide à la connaissance. Le tableau de mesure doit donc refléter l’objectif réel.",
          "Il faut également documenter les coûts cachés : paramétrage, nettoyage documentaire, accompagnement, vérification, licences, maintenance et traitement des incidents. Un projet peut rester pertinent malgré ces coûts, mais l’organisation doit les voir. Cette transparence aide à comparer plusieurs cas d’usage et à éviter que le plus spectaculaire capte automatiquement les ressources.",
          "La décision finale peut être d’arrêter. Si un pilote montre que le processus est trop rare, les données trop mauvaises ou la relecture trop lourde, l’arrêt est un résultat utile. L’organisation a appris avec un périmètre limité. Ce mécanisme de sélection est plus important qu’un objectif consistant à mettre de l’IA dans chaque service."
        ]
      },
      {
        id: "formation",
        kicker: "09 — FORMATION & ADOPTION",
        heading: "Former les agents sur leurs vrais cas d’usage crée davantage de discernement qu’une collection de prompts.",
        paragraphs: [
          "Une formation générale peut expliquer les modèles, les limites, les données et la vérification. Elle crée un socle commun. Mais l’adoption se joue ensuite dans le métier. Un agent doit apprendre à reconnaître quand une tâche se prête à l’IA, quel contexte fournir, quelles informations ne pas transmettre, comment vérifier la sortie et à quel moment abandonner l’outil. Ces compétences se construisent mieux sur des documents et situations proches du travail réel.",
          "Les ateliers peuvent donc être reliés aux pilotes. Une équipe teste la synthèse de dossiers ; la formation travaille sur les critères d’une bonne synthèse, les sources, les erreurs et les cas où le modèle échoue. Un service teste un assistant documentaire ; l’atelier apprend à formuler une recherche, vérifier la citation et signaler une procédure obsolète. La formation devient une partie de l’architecture du projet plutôt qu’un événement séparé.",
          "Les managers ont un rôle spécifique. Ils doivent pouvoir fixer des règles, discuter de la qualité, organiser le partage de méthodes et éviter deux extrêmes : interdire tous les usages par peur ou accepter toutes les expérimentations au nom de l’innovation. Une charte courte, une liste d’outils autorisés, des cas d’usage validés et un point de contact donnent souvent davantage de clarté qu’un document juridique isolé.",
          "Enfin, les référents internes peuvent capitaliser. Leur mission n’est pas d’être experts de tous les modèles. Ils peuvent recueillir les usages, documenter les bonnes pratiques, remonter les incidents, maintenir une bibliothèque de cas et orienter vers la DSI, le DPO ou le métier lorsque la question dépasse leur rôle. Cette capacité interne permet à la collectivité de progresser sans dépendre durablement d’un prestataire pour chaque décision."
        ]
      },
      {
        id: "demarrage",
        kicker: "10 — COMMENCER",
        heading: "Une première vague peut tenir en trois cas d’usage, un cadre et six semaines d’observation.",
        paragraphs: [
          "Pour une communauté de communes qui démarre, une première vague peut être volontairement réduite. Exemple : compte rendu de réunion, recherche dans des procédures internes et préparation de brouillons sur un flux non sensible. Ces trois usages couvrent déjà génération, synthèse, recherche documentaire, contrôle humain et gouvernance des données. Ils permettent de tester plusieurs mécanismes sans créer une plateforme complexe.",
          "Avant le lancement, chaque cas tient sur une fiche : tâche actuelle, utilisateurs, entrée, outil, donnée autorisée, résultat attendu, validation humaine, mesure de départ, erreurs possibles et propriétaire. Les agents pilotes reçoivent un court cadre d’usage. Une personne est responsable de collecter les retours. Les problèmes ne sont pas cachés : ils sont précisément ce que le pilote doit révéler.",
          "Au bout de quelques semaines, la revue répond à des questions factuelles : l’usage est-il fréquent ? les agents reviennent-ils spontanément à l’outil ? quelles erreurs apparaissent ? la vérification est-elle raisonnable ? quelles données manquent ? quelles procédures doivent être nettoyées ? Le projet peut alors être élargi, modifié ou arrêté. Cette discipline évite de confondre enthousiasme initial et adoption durable.",
          "L’étape suivante n’est pas nécessairement davantage d’IA. Elle peut consister à améliorer la documentation, créer une intégration, automatiser une action simple ou former une nouvelle équipe. Une collectivité gagne en maturité lorsqu’elle sait choisir le bon mécanisme pour le bon problème. L’objectif des douze cas d’usage de ce guide est précisément de développer cette capacité de choix."
        ],
        callout: {
          title: "Une règle simple",
          text: "Commencer par une tâche fréquente, réversible et vérifiable. Mesurer le travail avant et après. N’augmenter l’autonomie que lorsque l’utilité, les données et la reprise d’erreur sont comprises."
        }
      }
    ]
  },
  {
    type: "territory",
    slug: "construire-un-plan-de-formation-ia-pour-les-agents-d-une-communaute-de-communes",
    cluster: "Formation & adoption collectivités",
    title: "Construire un plan de formation IA pour les agents d'une communauté de communes",
    dek: "Un plan de formation IA territorial efficace ne se résume pas à une initiation à ChatGPT. Il doit relier règles d'usage, cas métier, vérification, management, accompagnement et mesure de l'adoption.",
    summary: "Ce guide propose une méthode opérationnelle pour une communauté de communes ou d'agglomération qui veut former ses agents à l'IA sans dissocier la pédagogie des usages réels. Il aide à segmenter les publics, construire un socle commun, organiser des ateliers métier, former les managers, créer un réseau de référents, encadrer les données et mesurer l'adoption sans inventer de gains.",
    readingTime: "20–24 min",
    publishedAt: "2026-09-23",
    modifiedAt: "2026-09-23",
    jobSignalTags: ["public_sector_ai", "training", "change_management", "ai_governance", "agents_territoriaux"],
    search: {
      primaryKeyword: "formation IA agents communauté de communes",
      secondaryQueries: [
        "formation intelligence artificielle agents territoriaux",
        "formation IA collectivité territoriale",
        "plan de formation IA collectivité",
        "acculturation IA agents publics",
        "former managers territoriaux intelligence artificielle"
      ],
      demandEvidence: ["territory_signals", "public_procurement", "cnfpt_training", "public_sector_guidance"],
      observedAt: "2026-09-23"
    },
    quickFacts: [
      ["PUBLIC", "Agents · managers · directions · référents internes"],
      ["FORMAT", "Socle commun + ateliers métier + accompagnement"],
      ["GARDE-FOU", "Outils autorisés, données maîtrisées, validation humaine"],
      ["MESURE", "Adoption réelle, qualité, erreurs, temps de reprise"]
    ],
    sourceNote: "Le besoin de formation est visible dans plusieurs signaux publics récents : le CNFPT propose en 2026 des formations dédiées aux managers territoriaux sur l'éthique, la stratégie et le pilotage de projets IA, ainsi qu'un cycle de sensibilisation aux usages concrets pour les agents et les cadres dirigeants. La DINUM, avec la DITP et la DGAFP, a publié en juin 2026 un guide d'usage de l'IA pour les agents publics de l'État qui insiste sur la responsabilité de l'agent, le choix d'outils autorisés, la transparence, l'utilité réelle et la formation continue. Ces références ne constituent pas un programme imposé aux collectivités : elles fournissent des repères utiles à adapter au contexte, aux outils, aux compétences et aux règles de chaque intercommunalité.",
    sources: [
      {
        label: "DINUM — Guide d'usage de l'IA pour les agents publics de l'État",
        url: "https://ia.numerique.gouv.fr/ressources/guide-dusage-de-lia/"
      },
      {
        label: "CNFPT / INET — IA pour les managers : entre éthique et stratégie",
        url: "https://www.cnfpt.fr/s-informer/nos-actualites/le-fil-dactu/ia-managers-entre-ethique-strategie-formation-inet-territoires/centre-val-loire"
      },
      {
        label: "CNFPT — Les Flash IA : sensibilisation des agents et cadres dirigeants",
        url: "https://www.cnfpt.fr/se-former/se-former-autrement/participer-a-nos-evenements/webinaire-flash-ia/provence-alpes-cote-dazur"
      },
      {
        label: "DINUM — Portail des chartes IA dans l'administration",
        url: "https://ia.numerique.gouv.fr/ressources/portail-des-chartes-ia-dans-ladministration/"
      }
    ],
    faq: [
      ["Faut-il former tous les agents en même temps ?", "Pas nécessairement. Un socle commun peut être proposé largement, tandis que les ateliers métier gagnent à être organisés par vagues, sur des équipes volontaires ou des services où les cas d'usage sont déjà identifiés."],
      ["Une formation IA doit-elle être centrée sur un outil comme ChatGPT ou Copilot ?", "L'outil compte, mais il ne doit pas structurer tout le programme. Les compétences durables portent aussi sur la formulation d'une tâche, la sélection des données, la vérification, la traçabilité, les limites du modèle et le choix du bon niveau d'automatisation."],
      ["Comment éviter qu'une formation reste théorique ?", "Chaque séquence doit revenir au travail réel : documents, tâches, erreurs fréquentes, règles internes et critères de qualité. Un atelier utile se termine avec des usages testables, des limites explicites et un responsable de la suite."],
      ["Quel rôle pour les managers territoriaux ?", "Ils doivent pouvoir encadrer les usages, arbitrer les risques, organiser la validation humaine, suivre l'adoption et créer un cadre dans lequel les agents savent quand utiliser l'IA, quand demander de l'aide et quand ne pas l'utiliser."],
      ["Comment mesurer le succès d'un plan de formation ?", "On peut mesurer la participation, mais aussi l'utilisation réelle après quelques semaines, la qualité des productions, les erreurs évitées ou détectées, le nombre de cas d'usage réellement appliqués, la capacité des agents à vérifier une réponse et le temps de reprise humaine."]
    ],
    sections: [
      {
        id: "objectif",
        kicker: "01 — LE BON OBJECTIF",
        heading: "Former à l'IA ne veut pas dire apprendre une collection de prompts.",
        paragraphs: [
          "Une communauté de communes peut facilement acheter une journée de sensibilisation à l'intelligence artificielle, remplir une salle et considérer le sujet traité. Le problème apparaît quelques semaines plus tard : certains agents continuent à utiliser des outils grand public sans cadre, d'autres n'osent rien tester, les managers ne savent pas quelles pratiques valider et les premiers cas d'usage restent isolés. Une formation efficace doit donc viser autre chose qu'un moment de découverte. Elle doit construire une capacité collective à choisir, utiliser, vérifier et encadrer l'IA dans le travail quotidien.",
          "Le premier objectif consiste à donner un langage commun. Un agent n'a pas besoin de devenir spécialiste des modèles pour comprendre qu'une réponse peut être plausible et fausse, qu'une donnée sensible ne doit pas être copiée dans n'importe quel service, qu'un texte généré doit être vérifié et qu'un outil autorisé n'est pas nécessairement adapté à toutes les tâches. Le guide interministériel publié en juin 2026 pour les agents de l'État insiste précisément sur la responsabilité de l'agent, la nature des données, la transparence, l'utilité et la formation continue. Une collectivité doit adapter ces principes à ses propres outils et règles.",
          "Le deuxième objectif est métier. Une agente des ressources humaines, un responsable développement économique, un instructeur, un chargé de communication ou une secrétaire de direction ne rencontrent pas les mêmes documents ni les mêmes risques. Leur formation doit partir des tâches qu'ils exécutent réellement : chercher une information, préparer une synthèse, reformuler un courrier, comparer des versions, produire un compte rendu, classer des demandes, analyser un tableau ou préparer une réunion. L'IA devient alors un mécanisme à évaluer, pas un sujet abstrait.",
          "Le troisième objectif est organisationnel. La formation doit laisser derrière elle des règles, des exemples, des référents et des méthodes de revue. Une collectivité qui apprend uniquement aux individus à utiliser un chatbot augmente les usages sans nécessairement augmenter la maîtrise. Une collectivité qui relie apprentissage, gouvernance et expérimentation crée une capacité durable à intégrer de nouveaux outils sans recommencer tout le travail à chaque évolution technologique."
        ]
      },
      {
        id: "segmenter",
        kicker: "02 — SEGMENTER LES PUBLICS",
        heading: "Agents, managers, directions et référents n'ont pas besoin de la même formation.",
        paragraphs: [
          "Un plan de formation unique pour tous semble simple à organiser mais répond mal aux responsabilités réelles. Les agents ont besoin de comprendre les usages autorisés, de savoir structurer une demande, contrôler une sortie et reconnaître une situation où l'IA n'est pas appropriée. Les managers doivent ajouter une compétence d'encadrement : définir les règles d'équipe, suivre la qualité, organiser la validation et traiter les écarts. Les directions générales ont davantage besoin d'arbitrage, de gouvernance, de portefeuille de cas d'usage et de mesure.",
          "Les référents internes constituent un quatrième public. Leur rôle peut être très concret : recueillir les cas d'usage, aider à formaliser une tâche, documenter une bonne pratique, remonter un incident, orienter vers la DSI ou le DPO et maintenir une bibliothèque de ressources. Ils n'ont pas besoin d'être des experts capables de construire tous les systèmes. Ils doivent surtout savoir poser les bonnes questions et distinguer un usage individuel simple d'un projet qui nécessite une intégration, des données internes ou une analyse de risque approfondie.",
          "Cette segmentation permet d'éviter deux erreurs fréquentes. La première est de surcharger tous les agents avec des éléments d'architecture, de réglementation ou de stratégie dont ils n'ont pas besoin pour agir. La seconde est de sous-former les managers en leur proposant exactement la même initiation que leurs équipes, alors qu'ils devront ensuite arbitrer les usages. Le CNFPT a d'ailleurs développé en 2026 des formats distincts pour les agents et pour les cadres dirigeants, ce qui illustre l'intérêt de cette différenciation.",
          "La segmentation n'empêche pas un socle partagé. Tous les publics peuvent commencer par les mêmes principes : ce que l'outil sait faire, ce qu'il ne sait pas garantir, quelles données peuvent être utilisées, comment vérifier, quand déclarer l'usage et comment obtenir de l'aide. La spécialisation vient ensuite, au plus près des situations professionnelles."
        ]
      },
      {
        id: "socle",
        kicker: "03 — LE SOCLE COMMUN",
        heading: "Le socle doit donner des réflexes avant de donner des astuces.",
        paragraphs: [
          "Un bon socle commun peut tenir en quelques modules courts, mais il doit être exigeant sur les réflexes. Le premier module explique les capacités et limites : génération, synthèse, extraction, classification, recherche assistée, raisonnement apparent, erreurs factuelles et dépendance au contexte fourni. Le but n'est pas de détailler tous les modèles, mais de comprendre pourquoi une réponse fluide n'est pas une preuve.",
          "Le deuxième module concerne les données. Les agents doivent savoir distinguer une information publique, une donnée interne, une donnée personnelle, une information sensible ou un document dont la diffusion est restreinte. La consigne ne peut pas se limiter à « ne mettez rien de confidentiel ». Il faut montrer des exemples réels et relier chaque catégorie aux outils autorisés par la collectivité. Une règle compréhensible est plus utile qu'une interdiction générale que chacun interprète différemment.",
          "Le troisième module porte sur la vérification. Il faut apprendre à demander des sources lorsque le contexte le permet, à comparer la réponse au document d'origine, à vérifier les chiffres, les dates, les noms et les références, et à distinguer un brouillon d'une production validée. La DINUM met la vérification des réponses et des sources parmi les questions pratiques auxquelles son guide apporte des repères. Cette compétence est centrale car elle conditionne la qualité de tous les usages suivants.",
          "Le quatrième module traite de la décision. L'IA peut proposer, synthétiser ou préparer ; elle ne devient pas automatiquement responsable du résultat. Une formation utile donne des exemples où l'humain doit conserver le dernier mot : décision individuelle, engagement budgétaire, information réglementaire, communication sensible, données personnelles, évaluation d'une personne ou tout processus où une erreur aurait un effet important. Le niveau de contrôle doit être proportionné au risque."
        ]
      },
      {
        id: "ateliers",
        kicker: "04 — LES ATELIERS MÉTIER",
        heading: "Chaque atelier doit résoudre une tâche réelle et produire une méthode réutilisable.",
        paragraphs: [
          "Après le socle, la formation doit quitter les exemples génériques. Un atelier métier commence par une tâche que les participants reconnaissent immédiatement. Par exemple : préparer un compte rendu à partir de notes, résumer un dossier long, transformer un échange en liste d'actions, rédiger un premier brouillon de réponse, comparer deux versions d'une procédure, extraire des éléments d'un document ou préparer un ordre du jour. Le formateur doit connaître la qualité attendue dans le métier, pas seulement la manière de parler au modèle.",
          "L'exercice peut suivre une grille constante : objectif, entrée, consigne, résultat attendu, contrôle, données autorisées, erreurs possibles et décision finale. Cette structure apprend aux agents à penser en processus. Au lieu de chercher le prompt parfait, ils apprennent à préciser la tâche et à définir comment ils sauront si le résultat est acceptable. Cette compétence reste utile même lorsque l'outil change.",
          "Les ateliers doivent inclure des échecs. Montrer uniquement des démonstrations impressionnantes crée une confiance artificielle. Il est plus formateur de comparer une bonne et une mauvaise instruction, de montrer une réponse incomplète, une citation inventée ou un résumé qui perd une nuance importante. Les participants peuvent alors discuter des contrôles nécessaires et des situations où il vaut mieux revenir à une méthode classique.",
          "Chaque atelier devrait produire un petit livrable opérationnel : une fiche d'usage, un exemple validé, une liste de données autorisées, un contrôle à effectuer et un point de contact. Cette documentation constitue progressivement une bibliothèque interne. Au bout de plusieurs vagues, la collectivité dispose d'un patrimoine de pratiques testées plutôt que d'une collection de souvenirs de formation."
        ]
      },
      {
        id: "managers",
        kicker: "05 — LES MANAGERS",
        heading: "Le manager doit apprendre à encadrer l'usage, pas à surveiller chaque prompt.",
        paragraphs: [
          "Le manager territorial se retrouve dans une position délicate. Il doit encourager l'amélioration des méthodes de travail sans laisser chaque agent définir seul ses règles. Il doit pouvoir répondre à des questions concrètes : cet outil est-il autorisé ? cette donnée peut-elle être utilisée ? faut-il une validation humaine ? comment partage-t-on un usage qui fonctionne ? que faire lorsqu'une sortie est erronée ? À défaut de réponses, les pratiques se dispersent.",
          "La formation des managers doit donc inclure une méthode de revue des cas d'usage. Pour chaque proposition : quel problème cherche-t-on à résoudre ? quelle fréquence ? quelles données ? quel impact si la sortie est fausse ? qui valide ? peut-on revenir en arrière ? comment mesure-t-on l'utilité ? Ces questions permettent de distinguer une expérimentation légère d'un véritable projet numérique. Elles empêchent aussi qu'un outil soit choisi avant le problème.",
          "Le CNFPT a publié en 2026 une formation destinée aux managers et cadres territoriaux qui traite notamment des limites et opportunités de l'IA, du cadre éthique et de gouvernance, ainsi que du pilotage d'un projet IA territorial. Ce type de programme illustre une tendance importante : l'adoption ne relève plus seulement de la culture numérique individuelle ; elle devient un sujet de management et d'organisation.",
          "Le rôle du manager est aussi de créer un espace de retour d'expérience. Les agents doivent pouvoir signaler qu'un usage ne fonctionne pas, qu'un document est trop sensible ou qu'une règle est impraticable sans craindre de bloquer l'innovation. Une bonne gouvernance apprend autant des erreurs que des succès. Le manager transforme ces retours en décisions : ajuster la règle, améliorer le processus, abandonner un cas d'usage ou l'étendre."
        ]
      },
      {
        id: "referents",
        kicker: "06 — LES RÉFÉRENTS IA",
        heading: "Un réseau de référents évite que chaque service reparte de zéro.",
        paragraphs: [
          "Lorsque plusieurs services commencent à expérimenter, les mêmes questions reviennent : comment formuler une demande, quelles données utiliser, comment vérifier, quel outil choisir, comment traiter un document volumineux, comment conserver une trace. Sans coordination, chaque équipe réinvente ses réponses. Un réseau de référents permet de capitaliser sans créer une structure lourde.",
          "Le référent peut tenir une permanence légère, participer aux ateliers, maintenir les fiches d'usage et organiser une revue régulière des expérimentations. Il ne valide pas seul les sujets juridiques, techniques ou de sécurité. Il sait au contraire quand escalader vers la DSI, le DPO, les ressources humaines, la direction générale ou le métier concerné. Sa valeur vient de cette capacité d'orientation et de mémoire collective.",
          "La formation des référents peut être plus approfondie sur la conception d'instructions, les sorties structurées, la recherche documentaire, les mécanismes d'automatisation, l'évaluation et le suivi des incidents. Mais elle doit rester reliée aux besoins de la collectivité. Former des référents à des techniques avancées qu'ils n'utiliseront pas ne crée pas de maturité ; cela crée une spécialisation sans débouché.",
          "Un réseau efficace peut aussi organiser des démonstrations internes courtes. Un service présente un cas qui fonctionne, la règle qui l'encadre, le temps gagné ou la qualité améliorée, mais aussi les limites observées. Cette diffusion par les pairs rend l'adoption plus crédible qu'une succession de communications descendantes."
        ]
      },
      {
        id: "programme",
        kicker: "07 — LE PROGRAMME",
        heading: "Un parcours en quatre vagues permet d'apprendre sans immobiliser l'organisation.",
        paragraphs: [
          "Une première vague de sensibilisation peut donner le socle commun à un large public : fondamentaux, données, vérification, responsabilité et usages autorisés. Elle peut combiner sessions courtes, ressources en ligne et exercices. L'objectif est que chacun reparte avec quelques règles simples et sache à qui poser une question.",
          "Une deuxième vague sélectionne plusieurs équipes métier. Chaque équipe arrive avec deux ou trois tâches réelles. Les ateliers transforment ces tâches en cas d'usage testables, définissent les contrôles et documentent les premiers résultats. On ne cherche pas à couvrir toute la collectivité : on cherche à créer de bons exemples.",
          "Une troisième vague concerne les managers et référents. Elle s'appuie sur les enseignements des pilotes : quelles erreurs ont été observées ? quelles données posent problème ? quels usages sont réellement adoptés ? quelles règles doivent être clarifiées ? La formation devient alors un mécanisme de gouvernance alimenté par l'expérience locale.",
          "La quatrième vague diffuse ce qui a fonctionné. Les fiches d'usage validées, exemples, checklists et règles sont intégrés dans un espace accessible. De nouvelles équipes rejoignent le dispositif en partant de cette base. Le programme peut alors évoluer avec les outils sans perdre son architecture pédagogique."
        ],
        steps: [
          { title: "Vague 1", text: "Socle commun pour comprendre, vérifier et utiliser dans le cadre autorisé." },
          { title: "Vague 2", text: "Ateliers métier sur des tâches et documents réels." },
          { title: "Vague 3", text: "Managers et référents : gouvernance, arbitrage, accompagnement." },
          { title: "Vague 4", text: "Capitalisation, diffusion et nouveaux pilotes." }
        ]
      },
      {
        id: "mesurer",
        kicker: "08 — MESURER",
        heading: "Le taux de présence ne mesure pas l'adoption.",
        paragraphs: [
          "Le premier indicateur d'une formation est souvent le nombre de participants. Il est utile administrativement mais insuffisant pour piloter l'adoption. Quelques semaines après une session, il faut regarder ce qui a réellement changé. Les agents utilisent-ils les outils autorisés ? sur quelles tâches ? avec quel niveau de vérification ? quels usages ont été abandonnés ? quelles erreurs reviennent ? quelles équipes demandent un accompagnement supplémentaire ?",
          "On peut suivre le nombre de cas d'usage documentés, la proportion de participants qui utilisent encore un usage après un mois, le nombre de corrections nécessaires, le temps de reprise humaine, la fréquence des demandes d'aide et la qualité perçue par le métier. Pour un workflow précis, on peut mesurer un avant/après sur le délai de traitement ou le nombre d'étapes. Ces données ne doivent pas être généralisées au-delà du processus observé.",
          "La formation doit aussi mesurer le discernement. Un agent formé sait-il reconnaître qu'une réponse doit être vérifiée ? sait-il identifier une donnée qu'il ne doit pas transmettre ? sait-il expliquer pourquoi il choisit un outil ? sait-il repérer un cas où l'IA n'apporte rien ? Ces compétences peuvent être évaluées avec des mises en situation plutôt qu'avec un questionnaire de satisfaction.",
          "Les résultats alimentent la vague suivante. Si les agents utilisent bien la synthèse mais échouent sur la vérification des sources, le programme renforce ce point. Si les managers hésitent sur les règles, on clarifie la gouvernance. Si un cas d'usage n'est jamais réutilisé, il faut comprendre pourquoi avant de former davantage de personnes dessus."
        ]
      },
      {
        id: "demarrer",
        kicker: "09 — DÉMARRER",
        heading: "Un plan de 90 jours suffit pour créer la première boucle d'apprentissage.",
        paragraphs: [
          "Les trente premiers jours servent à cadrer : outils autorisés, règles existantes, publics, services pilotes, irritants, documents de référence et responsables. Une courte enquête ou quelques entretiens permettent d'identifier les tâches fréquentes et les attentes. Cette phase évite de concevoir un programme à partir d'exemples génériques.",
          "Les trente jours suivants lancent le socle commun et les premiers ateliers métier. Chaque atelier produit au moins une fiche d'usage. Les managers reçoivent en parallèle une méthode simple d'arbitrage. Les référents commencent à recueillir les questions et à documenter les cas.",
          "Les trente derniers jours observent l'usage réel. On organise une revue avec les équipes pilotes, on mesure quelques indicateurs, on ajuste les règles et on décide ce qui mérite d'être diffusé. La direction générale dispose alors d'informations concrètes pour choisir la suite : étendre, approfondir, automatiser certains flux ou arrêter des expérimentations.",
          "Cette boucle de quatre-vingt-dix jours n'a rien de magique. Sa valeur vient du rythme : apprendre, tester, observer et corriger assez vite pour garder l'attention des équipes, mais avec suffisamment de temps pour voir si les pratiques survivent à l'effet de nouveauté. Le plan de formation devient ainsi une composante d'un programme d'adoption, pas un événement isolé."
        ],
        callout: {
          title: "Le principe à retenir",
          text: "Former les agents sur leurs vrais cas d'usage, former les managers à encadrer, puis mesurer ce qui est réellement réutilisé."
        }
      }
    ]
  }
];
