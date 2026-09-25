import { territoryArticlesWave1 } from "./article-packs/territory-wave-1.js";
import { marketDemandExecutionArticles, marketDemandTrainingArticles } from "./article-packs/market-demand-wave-1.js";
import { marketDemandExecutionArticlesWave2, marketDemandTrainingArticlesWave2 } from "./article-packs/market-demand-wave-2.js";
import { marketDemandExecutionArticlesWave3, marketDemandTrainingArticlesWave3 } from "./article-packs/market-demand-wave-3.js";
import { marketDemandExecutionArticlesWave4, marketDemandTrainingArticlesWave4 } from "./article-packs/market-demand-wave-4.js";
import { marketDemandExecutionArticlesWave5, marketDemandTrainingArticlesWave5 } from "./article-packs/market-demand-wave-5.js";
import { marketDemandExecutionArticlesWave6, marketDemandTrainingArticlesWave6 } from "./article-packs/market-demand-wave-6.js";
import { marketDemandExecutionArticlesWave7, marketDemandTrainingArticlesWave7 } from "./article-packs/market-demand-wave-7.js";
import { marketDemandExecutionArticlesWave8, marketDemandTrainingArticlesWave8 } from "./article-packs/market-demand-wave-8.js";
import { marketDemandExecutionArticlesWave9, marketDemandTrainingArticlesWave9 } from "./article-packs/market-demand-wave-9.js";
import { marketDemandExecutionArticlesWave10, marketDemandTrainingArticlesWave10 } from "./article-packs/market-demand-wave-10.js";
import { marketDemandExecutionArticlesWave11, marketDemandTrainingArticlesWave11 } from "./article-packs/market-demand-wave-11.js";
import { marketDemandExecutionArticlesWave12, marketDemandTrainingArticlesWave12 } from "./article-packs/market-demand-wave-12.js";
import { marketDemandExecutionArticlesWave13, marketDemandTrainingArticlesWave13 } from "./article-packs/market-demand-wave-13.js";
import { marketDemandExecutionArticlesWave14, marketDemandTrainingArticlesWave14 } from "./article-packs/market-demand-wave-14.js";

const baseExecutionArticles = [
  {
    type: "execution",
    slug: "connecter-gmail-a-google-drive-pour-ranger-automatiquement-les-pieces-jointes",
    cluster: "E-mails & boîte de réception",
    title: "Automatiser Gmail + Google Drive avec l’IA : du mail reçu au dossier classé, résumé et prêt à traiter",
    dek: "Imaginez une boîte mail qui ne se contente plus de recevoir : elle comprend le message, identifie le dossier concerné, range les pièces jointes, crée une synthèse et prépare la prochaine action — avec validation humaine là où elle est utile.",
    summary: "Un workflow Gmail + Google Drive + IA peut être construit sans développement lourd : un nouvel e-mail déclenche le scénario, les pièces jointes sont enregistrées, un modèle d’IA extrait les informations utiles, une règle décide du dossier cible, puis une action est créée ou un brouillon de réponse est préparé. Le point important n’est pas l’effet « magique » : c’est la conception des règles, des permissions, des cas d’erreur et des validations humaines.",
    readingTime: "18–22 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["automation", "workflow_orchestration", "n8n", "power_platform", "api_integration", "messaging_collaboration", "files_documents", "process_integration"],
    search: {
      primaryKeyword: "automatiser Gmail Google Drive IA",
      secondaryQueries: [
        "automatiser Gmail avec IA",
        "automatiser Google Drive avec IA",
        "classer pièces jointes Gmail Google Drive",
        "workflow Gmail Google Drive",
        "automatisation Google Workspace IA"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["NIVEAU", "No-code / low-code"],
      ["OUTILS POSSIBLES", "Gmail · Drive · n8n / Make / Zapier · LLM"],
      ["VALEUR", "Classement · synthèse · action · traçabilité"],
      ["CONTRÔLE", "Validation humaine recommandée avant actions sensibles"]
    ],
    sourceNote: "La faisabilité de base Gmail → Google Drive sans code est vérifiable aujourd’hui : des plateformes d’automatisation exposent des déclencheurs Gmail et des actions Google Drive, notamment pour enregistrer des pièces jointes, créer des fichiers et enchaîner des étapes d’IA. L’architecture détaillée ci-dessous est un scénario Autonomia : elle doit être adaptée aux droits, aux données, aux règles internes et à l’outil choisi.",
    sources: [
      {
        label: "Google Workspace Studio — automatiser des flux Workspace avec l’IA",
        url: "https://support.google.com/workspace-studio/answer/16666382?hl=fr"
      },
      {
        label: "Google for Developers — automatiser et enrichir Gmail",
        url: "https://developers.google.com/workspace/gmail?hl=fr"
      },
      {
        label: "Zapier — intégration Gmail + Google Drive et exemples de workflows",
        url: "https://zapier.com/apps/gmail/integrations/google-drive"
      }
    ],
    faq: [
      ["Peut-on vraiment connecter Gmail et Google Drive sans coder ?", "Oui, des plateformes d’automatisation proposent des connecteurs prêts à l’emploi. Le niveau low-code apparaît surtout lorsque le workflow doit appeler une API spécifique, traiter des cas complexes ou appliquer des règles avancées."],
      ["Est-ce que l’IA doit lire tous les e-mails ?", "Non. Le scénario peut être limité à un libellé, une boîte partagée, une adresse dédiée, un expéditeur, un type de pièce jointe ou une règle de filtrage. Limiter le périmètre est souvent préférable."],
      ["Faut-il laisser l’IA envoyer des réponses automatiquement ?", "Pas nécessairement. Pour beaucoup de processus, le meilleur niveau d’automatisation consiste à préparer un brouillon, proposer une classification ou créer une tâche, puis laisser une personne valider."],
      ["Peut-on utiliser ce système pour des documents sensibles ?", "Techniquement certains outils permettent de traiter des documents variés, mais la décision dépend des politiques internes, des contrats des fournisseurs, de la configuration des comptes, du type de données et des exigences de sécurité ou de conformité."],
      ["Quel outil choisir entre Make, n8n et Zapier ?", "Il n’existe pas un choix universel. Il faut regarder les connecteurs nécessaires, le contrôle des données, la maintenabilité, la capacité de l’équipe, les volumes, le coût d’exécution et les exigences d’hébergement."]
    ],
    sections: [
      {
        id: "histoire",
        kicker: "01 — L’HISTOIRE",
        heading: "8 h 12. Un e-mail arrive. Personne ne le classe.",
        paragraphs: [
          "Prenons une situation très banale. Une entreprise reçoit chaque jour des dizaines de messages contenant des devis, des factures, des contrats, des comptes rendus, des demandes clients ou des pièces administratives. Chaque e-mail est simple à comprendre pour un humain pris isolément. Le problème apparaît à l’échelle : il faut ouvrir le message, comprendre ce qu’il concerne, télécharger la pièce jointe, retrouver le bon dossier Google Drive, renommer le fichier, éventuellement créer une ligne de suivi, prévenir quelqu’un et penser à répondre. Ce ne sont pas des tâches intellectuellement difficiles. Ce sont des micro-frictions qui se répètent.",
          "Dans un scénario automatisé, l’e-mail peut devenir le point de départ d’une chaîne de traitement. Le message arrive dans Gmail. Une règle détermine s’il entre dans le périmètre : par exemple un libellé précis, une adresse de réception dédiée ou la présence d’une pièce jointe. Le workflow récupère le sujet, l’expéditeur, le texte utile et les fichiers. Une étape d’IA peut ensuite extraire une catégorie, un nom de société, une date, un numéro de dossier ou une action attendue. À partir de ces éléments, le système choisit le dossier Drive, renomme le document selon une convention, l’enregistre et prépare la suite.",
          "Ce qui fait rêver n’est pas de voir un fichier se déplacer tout seul. C’est la disparition progressive du travail de raccordement. L’information n’attend plus qu’une personne se souvienne où la ranger. Le mail, le document, le dossier, la tâche et la réponse commencent à former un seul flux. L’employé ne passe plus son temps à faire circuler l’information entre des outils : il intervient quand une décision, une exception ou une validation humaine est réellement nécessaire.",
          "Ce scénario est réaliste précisément parce qu’il n’exige pas de créer un logiciel complet. Gmail et Google Drive disposent déjà d’écosystèmes d’intégration, et les plateformes no-code savent déclencher des actions lorsqu’un nouvel e-mail ou une nouvelle pièce jointe apparaît. L’IA intervient au milieu du workflow pour interpréter ce qui n’est pas parfaitement structuré. L’automatisation, elle, reste déterministe autour de cette étape : si la catégorie est X, ranger dans Y ; si le niveau de confiance est trop faible, envoyer dans une file « à vérifier »."
        ]
      },
      {
        id: "architecture",
        kicker: "02 — L’ARCHITECTURE",
        heading: "Le workflow n’est pas un chatbot. C’est une chaîne de décisions.",
        paragraphs: [
          "On peut représenter le système comme une suite de briques. La première est le déclencheur. Le workflow ne doit pas nécessairement surveiller toute la messagerie. Une bonne architecture commence par réduire le champ : boîte partagée dédiée aux factures, libellé « à traiter », messages provenant d’un portail client, ou e-mails contenant certaines pièces jointes. Plus le déclencheur est précis, plus le système est facile à comprendre, à tester et à maintenir.",
          "La deuxième brique est la collecte. Le workflow récupère uniquement les éléments nécessaires : adresse de l’expéditeur, objet, texte, date, identifiants du fil de discussion, noms des pièces jointes et fichiers eux-mêmes. Il ne faut pas envoyer automatiquement tout le contenu à un modèle d’IA « au cas où ». Le principe utile est l’inverse : minimiser les données traitées et conserver une trace de ce qui a réellement servi à la décision.",
          "La troisième brique est l’interprétation. C’est ici que l’IA générative peut apporter quelque chose que des règles classiques feraient mal. Un e-mail peut dire « Bonjour, vous trouverez le document demandé concernant le site de Neuilly » sans contenir un champ propre intitulé DOSSIER=NEUILLY. Un modèle peut être invité à retourner une sortie structurée : type_document, client, projet, date_document, action_requise, niveau_confiance. Le workflow ne demande pas au modèle d’écrire une belle réponse : il lui demande de produire des données utilisables par la suite.",
          "La quatrième brique est la logique de routage. C’est souvent ici que se trouve le vrai savoir métier. Si le document est une facture fournisseur, il part dans une arborescence. Si c’est un contrat, une autre. Si aucun projet n’est reconnu ou si le score de confiance est insuffisant, le document n’est pas classé de force : il est mis dans un dossier d’exception et une personne reçoit une demande de validation. Cette branche « je ne sais pas » est une fonction, pas un échec.",
          "La cinquième brique est l’action. Créer le dossier s’il n’existe pas, enregistrer la pièce jointe, appliquer une convention de nommage, compléter une ligne dans Google Sheets, créer une carte dans un outil de projet, mettre un libellé dans Gmail, ou préparer un brouillon de réponse. Il faut séparer les actions réversibles — ajouter une étiquette, créer un brouillon — des actions plus sensibles comme envoyer un message, supprimer un fichier ou modifier une donnée de référence.",
          "Enfin vient l’observabilité. Un workflow professionnel doit pouvoir répondre à des questions simples : quel e-mail a déclenché cette action ? quel document a été créé ? qu’a retourné le modèle ? quelle règle a été appliquée ? une personne a-t-elle corrigé la classification ? Sans cette mémoire, l’automatisation fonctionne tant qu’elle fonctionne, puis devient très difficile à diagnostiquer."
        ],
        steps: [
          { title: "1. Déclencher", text: "Nouvel e-mail, nouveau libellé, pièce jointe ou règle explicite." },
          { title: "2. Extraire", text: "Récupérer les seules données utiles du message et de ses pièces." },
          { title: "3. Comprendre", text: "Transformer le texte libre en informations structurées avec un modèle." },
          { title: "4. Décider", text: "Appliquer les règles métier, y compris une branche d’exception." },
          { title: "5. Agir", text: "Ranger, renommer, créer une tâche, ajouter un libellé ou préparer un brouillon." },
          { title: "6. Tracer", text: "Conserver les identifiants, décisions, erreurs et corrections." }
        ]
      },
      {
        id: "exemple",
        kicker: "03 — EXEMPLE CONCRET",
        heading: "Un dossier fournisseur peut presque se constituer tout seul.",
        paragraphs: [
          "Imaginons une adresse fournisseurs@entreprise.fr. Lorsqu’un message arrive avec une pièce jointe PDF, le workflow vérifie d’abord quelques règles simples : présence du fichier, type autorisé, taille acceptable, expéditeur non bloqué. Le texte du mail et, si nécessaire, le contenu extrait du document sont envoyés à une étape d’interprétation. La sortie attendue est volontairement rigide : nom_fournisseur, type_document, date, référence, projet_probable, action_attendue et confiance.",
          "Si le fournisseur est connu et que le projet correspond à une liste autorisée, le workflow cherche le dossier Drive du projet. Il peut ensuite rechercher ou créer un sous-dossier « Fournisseurs / Nom du fournisseur / 2026 ». Le fichier reçoit un nom prévisible, par exemple « 2026-09-20_FournisseurX_Devis_REF123.pdf ». Le mail reçoit le libellé « classé automatiquement ». Une ligne peut être ajoutée dans un tableau de suivi avec le lien vers le document et l’identifiant Gmail d’origine.",
          "Si le message demande explicitement une validation — « Pouvez-vous confirmer avant vendredi ? » — le système peut créer une tâche. Mais il ne faut pas laisser le modèle décider librement de la personne responsable. Le routage peut dépendre d’une table de correspondance maintenue par l’entreprise : projet A → responsable A ; achats → équipe achats ; montant supérieur à un seuil → validation direction. L’IA reconnaît le contexte ; la règle métier décide.",
          "Lorsque la confiance est faible, l’automatisation peut envoyer une carte de validation contenant le nom du fichier, le projet proposé et deux boutons : confirmer ou corriger. La correction devient elle-même une donnée intéressante. Si les mêmes erreurs reviennent, il faut améliorer la taxonomie, le prompt, les documents de référence ou les règles de routage au lieu de demander au modèle d’être « plus intelligent ».",
          "Une fois le document classé, une dernière étape peut préparer un brouillon Gmail : « Bonjour, document bien reçu. Il a été transmis pour traitement. » Le brouillon est visible par l’équipe mais n’est pas envoyé. Pour des messages très standardisés et non sensibles, une entreprise pourrait choisir davantage d’autonomie. Le niveau acceptable dépend du contexte, du risque et de la capacité à récupérer d’une erreur."
        ],
        callout: {
          title: "Le principe Autonomia",
          text: "Automatiser le transport de l’information autant que possible ; garder l’humain au point où son jugement apporte réellement de la valeur."
        }
      },
      {
        id: "no-code",
        kicker: "04 — NO-CODE / LOW-CODE",
        heading: "À quoi ressemble la construction dans n8n, Make ou Zapier ?",
        paragraphs: [
          "Les interfaces diffèrent, mais la logique reste proche. Un premier module écoute Gmail. Un deuxième récupère la pièce jointe. Une étape conditionnelle filtre les messages qui ne doivent pas continuer. Une étape IA transforme le texte en champs structurés. Puis des branches dirigent le flux vers Google Drive, Google Sheets, un CRM ou un outil de tâches. Les identifiants de chaque étape sont conservés pour pouvoir remonter le chemin.",
          "Dans un outil très visuel, on peut construire une première version sans écrire de code. Le low-code devient utile lorsque l’on veut normaliser un nom de fichier, appeler un service via HTTP, manipuler un tableau complexe ou appliquer une logique que les modules standards gèrent mal. Ce n’est pas un problème : l’objectif n’est pas « zéro ligne de code à tout prix ». L’objectif est que le système reste compréhensible et maintenable par l’organisation.",
          "Le choix de la plateforme dépend notamment de l’environnement existant. Une équipe qui utilise déjà de nombreuses automatisations dans un écosystème peut privilégier la continuité. Une équipe plus technique peut vouloir un contrôle plus fin. Une grande entreprise regardera aussi l’administration, les droits, la journalisation, la localisation des données, les politiques de sécurité, le cycle de mise à jour et la capacité à séparer développement, test et production.",
          "Pour l’étape IA, il est préférable de demander une sortie structurée plutôt qu’un texte libre. Par exemple, le modèle doit renvoyer un objet avec des valeurs autorisées. Cette contrainte réduit l’ambiguïté et permet au workflow de valider la réponse avant d’agir. Si le champ type_document doit appartenir à FACTURE, DEVIS, CONTRAT ou AUTRE, le scénario doit rejeter ou requalifier toute autre valeur.",
          "Il est également possible d’éviter un appel IA dans les cas faciles. Un e-mail provenant de facturation@fournisseur.fr avec l’objet normalisé « FACTURE 2026-09 » peut être traité par des règles classiques. Le modèle n’intervient que lorsque le contenu est ambigu. Cette approche hybride réduit les coûts, la latence et le nombre d’erreurs possibles."
        ]
      },
      {
        id: "ia",
        kicker: "05 — LE RÔLE DE L’IA",
        heading: "L’IA est utile quand les règles seules ne suffisent plus.",
        paragraphs: [
          "Une automatisation traditionnelle excelle quand les données sont propres : si le champ A vaut X, alors exécuter Y. Les e-mails professionnels ne sont pas propres. Les humains écrivent librement, changent l’ordre des informations, nomment les pièces jointes de manière imprévisible et mélangent parfois plusieurs demandes. C’est précisément dans cette zone grise qu’un modèle de langage peut servir d’interprète entre le langage humain et le workflow.",
          "Cela ne signifie pas qu’il faut lui confier toute la décision. On peut lui demander de reconnaître un type de document, proposer un projet probable, résumer une demande ou extraire des entités. Puis le système applique des règles connues. Cette séparation rend l’architecture plus robuste : l’IA interprète ; l’automatisation contrôle ; l’humain arbitre les exceptions.",
          "Une autre possibilité consiste à fournir au modèle un contexte limité provenant d’une base interne. Par exemple, la liste des projets actifs, des fournisseurs ou des conventions de nommage. Cette information peut être injectée directement si elle est courte, ou récupérée depuis une base structurée. Pour un très grand référentiel documentaire, on peut envisager une recherche sémantique ou un RAG, mais ce serait souvent excessif pour une première version.",
          "L’équipe doit aussi décider ce qu’elle veut faire quand le modèle ne sait pas. Une bonne sortie structurée peut inclure un champ confiance ou raison_incertitude, mais il ne faut pas considérer un score généré par le modèle comme une probabilité scientifique. Le signal sert au routage interne ; sa fiabilité doit être évaluée sur des exemples réels."
        ]
      },
      {
        id: "securite",
        kicker: "06 — SÉCURITÉ & CONTRÔLE",
        heading: "Le vrai projet commence avec les permissions.",
        paragraphs: [
          "Connecter une messagerie et un Drive donne au workflow accès à des informations importantes. La question « est-ce possible ? » doit donc être immédiatement suivie de « à quoi exactement le système a-t-il accès ? ». Il est préférable d’utiliser un compte ou une boîte dédiée lorsque c’est cohérent, de limiter les dossiers accessibles et de donner uniquement les permissions nécessaires aux actions prévues.",
          "Les données envoyées à un modèle doivent elles aussi être minimisées. Si le workflow doit seulement reconnaître « devis » ou « facture », il n’a peut-être pas besoin du document complet. Si le texte contient des informations personnelles, confidentielles ou contractuelles, l’entreprise doit vérifier ses propres règles, les conditions de service de ses fournisseurs et les paramètres disponibles. Le workflow ne doit jamais être conçu comme si le choix d’un modèle effaçait les obligations de gouvernance.",
          "Les actions irréversibles méritent un traitement particulier. Envoyer un e-mail externe, modifier un document officiel, supprimer un fichier ou engager une commande ne sont pas équivalents au fait de créer un brouillon. On peut définir des niveaux d’autonomie : niveau 1, l’IA suggère ; niveau 2, le workflow prépare ; niveau 3, le système exécute des actions à faible risque ; niveau 4, certaines actions sont autonomes mais sous règles strictes et auditables.",
          "Enfin, il faut prévoir la panne. Que se passe-t-il si l’API Gmail ne répond pas, si Drive refuse le fichier, si le modèle renvoie une sortie invalide ou si le dossier cible a été renommé ? Le système doit capturer l’erreur, conserver l’élément d’origine et permettre une reprise. Une automatisation professionnelle ne cache pas ses échecs ; elle les rend visibles."
        ]
      },
      {
        id: "mvp",
        kicker: "07 — MVP",
        heading: "Commencer avec 30 e-mails représentatifs, pas avec toute l’entreprise.",
        paragraphs: [
          "Le meilleur premier pas est de constituer un petit jeu d’exemples réels mais manipulables dans un environnement de test : une trentaine d’e-mails couvrant les cas fréquents, les cas ambigus et quelques erreurs volontaires. On définit ensuite les catégories attendues et la décision correcte pour chaque message. Cette base permet de comparer le workflow à une référence au lieu de juger son comportement à l’intuition.",
          "La première version peut se limiter à une seule promesse : classer les pièces jointes dans le bon dossier et signaler les cas incertains. Pas de réponse automatique, pas de CRM, pas de reporting. Une fois cette boucle fiable, on ajoute le renommage, puis la création de tâche, puis le brouillon de réponse. Chaque capacité est testée avant d’élargir le système.",
          "Il est utile de mesurer des choses très concrètes : proportion de messages classés correctement dans le jeu de test, nombre de cas envoyés en validation, types d’erreurs, temps humain nécessaire pour corriger, erreurs techniques et coût d’exécution. On ne transforme pas ces mesures en promesse universelle de gain de temps. Elles servent à décider si le système mérite d’être étendu.",
          "Après quelques semaines d’usage, l’historique de corrections devient plus précieux que le prompt initial. Il révèle les catégories mal définies, les exceptions fréquentes, les fournisseurs atypiques et les règles que l’organisation n’avait jamais formalisées. Le projet d’IA devient alors aussi un projet de clarification opérationnelle."
        ]
      },
      {
        id: "extensions",
        kicker: "08 — ALLER PLUS LOIN",
        heading: "Une fois la messagerie connectée, l’entreprise commence à imaginer autrement ses flux.",
        paragraphs: [
          "Le même principe peut être appliqué à une boîte support, à des candidatures, à des demandes d’achat, à des documents de chantier ou à des dossiers clients. Le pattern reste le même : un événement arrive, les informations sont normalisées, l’IA interprète ce qui est ambigu, les règles métier orientent le flux, puis une action est préparée ou exécutée.",
          "On peut aussi inverser le sens. Un nouveau fichier ajouté dans Drive peut déclencher un e-mail, une tâche de validation ou une synthèse. Un contrat déposé peut générer une fiche de lecture. Un compte rendu peut produire la liste des actions. Une nouvelle version d’un document peut être comparée à la précédente et signaler uniquement les changements importants.",
          "À un stade plus avancé, un assistant peut recevoir une question en langage naturel — « retrouve-moi le dernier devis envoyé par le fournisseur X pour le chantier Y et prépare une synthèse » — puis utiliser Gmail et Drive comme outils. Cette architecture agentique est plus puissante mais demande davantage de garde-fous : contrôle des permissions, restrictions des outils, validation des actions et traçabilité. Elle ne doit pas être la première étape simplement parce qu’elle paraît plus spectaculaire.",
          "La vision intéressante est celle d’une entreprise où l’information circule moins par copier-coller. Les personnes restent responsables des décisions ; les systèmes réduisent le coût de coordination. Gmail n’est plus seulement une boîte d’entrée et Drive n’est plus seulement un espace de stockage : ensemble, ils deviennent des composants d’un processus capable de comprendre assez de contexte pour préparer le travail suivant."
        ]
      }
    ]
  }
];

const baseTrainingArticles = [
  {
    type: "training",
    slug: "apprendre-a-automatiser-gmail-et-google-drive-avec-l-ia-sans-coder",
    cluster: "Automatisation no-code",
    title: "Formation IA no-code : apprendre à automatiser Gmail et Google Drive sans devenir développeur",
    dek: "Le meilleur moyen de comprendre l’automatisation IA n’est pas de regarder une démonstration. C’est de construire un workflow réel : recevoir un e-mail, comprendre ce qu’il contient, ranger le document au bon endroit et garder la main sur les exceptions.",
    summary: "Ce scénario de formation transforme un cas d’usage concret — automatiser le traitement d’e-mails et de documents — en parcours pédagogique. Les participants apprennent les notions de déclencheur, action, condition, données structurées, étape IA, validation humaine, gestion d’erreur et permissions. L’objectif n’est pas de « former à un outil » mais de rendre l’équipe capable de comprendre, construire, tester et maintenir un premier workflow utile.",
    readingTime: "17–21 min",
    publishedAt: "2026-09-20",
    modifiedAt: "2026-09-20",
    jobSignalTags: ["automation", "workflow_orchestration", "n8n", "power_platform", "api_integration", "human_in_loop", "change_adoption"],
    search: {
      primaryKeyword: "formation automatisation IA no-code",
      secondaryQueries: [
        "formation n8n entreprise",
        "formation Make IA",
        "formation no-code IA entreprise",
        "formation automatisation workflow IA",
        "formation agents IA no-code"
      ],
      demandEvidence: ["serp_observed"],
      observedAt: "2026-09-20"
    },
    quickFacts: [
      ["PUBLIC", "Métiers · opérations · fonctions support · chefs de projet"],
      ["NIVEAU", "Débutant à intermédiaire"],
      ["ATELIER", "Gmail → IA → Google Drive → validation"],
      ["COMPÉTENCE CIBLE", "Concevoir et tester un workflow IA no-code"]
    ],
    sourceNote: "La demande de formations n8n / Make / automatisation IA no-code est observable dans l’offre actuelle de formation professionnelle, et les plateformes d’automatisation proposent des connecteurs Gmail / Google Drive. Le scénario pédagogique ci-dessous est une proposition Autonomia, pas la description d’un programme Qualiopi déjà publié. Les mentions de certification et l’entité porteuse devront être vérifiées avant commercialisation.",
    sources: [
      {
        label: "France Num — IA et no-code appliqués aux processus métiers",
        url: "https://www.francenum.gouv.fr/activateurs/summit-flow"
      },
      {
        label: "Zapier — automatisations Gmail + Google Drive",
        url: "https://zapier.com/apps/gmail/integrations/google-drive"
      }
    ],
    faq: [
      ["Faut-il savoir coder pour suivre ce type de formation ?", "Non pour les fondamentaux. Le parcours peut rester entièrement visuel au départ. Des notions low-code deviennent utiles quand le participant veut appeler une API, transformer des structures complexes ou sortir des capacités standards du connecteur."],
      ["La formation doit-elle porter sur n8n, Make ou Zapier ?", "Elle peut utiliser un outil principal, mais la compétence transférable est plus importante : comprendre déclencheur, données, conditions, actions, erreurs, permissions et validation humaine."],
      ["Peut-on travailler sur les vrais outils de l’entreprise ?", "Oui lorsque les accès, la confidentialité et l’environnement de formation le permettent. Une bonne pratique consiste à commencer dans un espace de test avec des données préparées."],
      ["Quel livrable les participants devraient-ils conserver ?", "Le workflow construit, son schéma, une fiche des droits nécessaires, les cas de test, la procédure de reprise en cas d’erreur et une liste d’améliorations possibles."],
      ["Peut-on aller jusqu’aux agents IA ?", "Oui dans un niveau suivant. Il est préférable de maîtriser d’abord un workflow déterministe enrichi d’une étape IA avant de donner davantage d’autonomie à un agent."]
    ],
    sections: [
      {
        id: "promesse",
        kicker: "01 — LA PROMESSE PÉDAGOGIQUE",
        heading: "À la fin, le participant doit voir un processus différemment.",
        paragraphs: [
          "Une mauvaise formation à l’automatisation commence par l’interface d’un outil : voici les menus, voici les modules, voici comment relier deux blocs. Une bonne formation commence par une situation de travail : chaque jour, un collaborateur reçoit des pièces jointes, les télécharge, cherche le bon dossier, renomme les fichiers, met à jour un tableau et envoie une confirmation. Le participant reconnaît immédiatement le problème parce qu’il existe déjà dans son quotidien.",
          "Le but du parcours n’est donc pas d’apprendre à « faire un Zap » ou à « créer un scénario Make » comme une fin en soi. La compétence recherchée est de savoir regarder une tâche répétitive et la décomposer : quel événement démarre le processus ? quelles informations entrent ? quelles décisions doivent être prises ? lesquelles peuvent être déterministes ? à quel endroit l’IA est-elle utile ? quelle action est sans risque ? où doit-on garder une validation humaine ?",
          "Le cas Gmail + Google Drive est pédagogiquement puissant parce qu’il combine des objets que presque tout le monde comprend : un e-mail, une pièce jointe, un dossier, un nom de fichier, une réponse. On peut y introduire progressivement l’IA sans transformer l’atelier en cours de programmation. Le participant voit la donnée circuler et comprend que l’automatisation n’est pas une fonction mystérieuse : c’est une série d’étapes explicites.",
          "La formation doit également casser un réflexe fréquent : vouloir utiliser l’IA partout. Si une règle classique suffit à reconnaître un expéditeur ou un mot-clé, elle est souvent préférable. Le modèle de langage devient utile lorsqu’il faut interpréter du texte libre, extraire des informations qui ne sont pas toujours au même endroit ou résumer un contenu. Cette distinction entre logique déterministe et interprétation probabiliste est un cadeau beaucoup plus durable que la maîtrise d’une interface précise."
        ]
      },
      {
        id: "scenario",
        kicker: "02 — L’ATELIER FIL ROUGE",
        heading: "Construire un workflow qui traite un e-mail de bout en bout.",
        paragraphs: [
          "L’atelier peut commencer avec une boîte de démonstration contenant une dizaine de messages préparés. Certains ont une facture, d’autres un devis, certains n’ont aucune pièce jointe, un message est ambigu et un autre contient un fichier au mauvais format. Le formateur ne cherche pas à montrer un parcours parfait. Les exceptions font partie du matériel pédagogique, car un workflow réel doit apprendre à les traiter.",
          "Première étape : le déclencheur. Les participants configurent le scénario pour ne réagir qu’à un périmètre contrôlé, par exemple un libellé Gmail « atelier-automatisation ». Ils comprennent ainsi qu’un bon système commence par limiter ce qu’il écoute. On explique la différence entre polling, webhook lorsque disponible, déclenchement manuel et déclenchement planifié sans entrer inutilement dans des détails d’architecture.",
          "Deuxième étape : récupérer les données. Le participant inspecte ce que le connecteur fournit réellement : objet, expéditeur, corps du message, identifiants, pièces jointes. Cette inspection est fondamentale. Beaucoup d’erreurs d’automatisation viennent de personnes qui assemblent des blocs sans comprendre la forme des données qui circulent entre eux.",
          "Troisième étape : ajouter une logique simple. Si le message n’a pas de pièce jointe, il est envoyé dans une branche différente. Si le fichier n’est pas un PDF, le workflow peut l’étiqueter pour vérification. Cette partie enseigne que l’automatisation n’est pas un tuyau linéaire : elle contient des conditions et des chemins.",
          "Quatrième étape : introduire l’IA. On demande à un modèle de produire une classification parmi un nombre limité de catégories et d’extraire quelques champs. Les participants apprennent à fournir une instruction claire, mais surtout à demander une sortie structurée. Ils observent qu’un texte élégant est inutile au workflow ; une structure stable est beaucoup plus précieuse.",
          "Cinquième étape : enregistrer le fichier dans Google Drive avec un chemin et un nom cohérents. Le groupe voit la pièce jointe apparaître dans le dossier cible. À ce moment, l’automatisation devient tangible. Le système a relié un e-mail non structuré à une arborescence documentaire organisée.",
          "Sixième étape : gérer l’ambiguïté. Un message est volontairement difficile. L’IA hésite ou propose une catégorie non satisfaisante. Au lieu d’essayer de cacher l’erreur, on construit une branche « validation humaine ». Le participant comprend qu’une automatisation mature n’est pas celle qui prétend ne jamais se tromper, mais celle qui sait quoi faire quand elle ne sait pas."
        ]
      },
      {
        id: "competences",
        kicker: "03 — COMPÉTENCES",
        heading: "Ce que le participant apprend réellement derrière l’outil.",
        paragraphs: [
          "La première compétence est la cartographie d’un processus. Le participant doit être capable de prendre une tâche et d’écrire la séquence actuelle avant même d’ouvrir l’outil : réception, lecture, qualification, stockage, mise à jour, réponse. Cette étape paraît simple, mais elle évite d’automatiser un processus mal compris.",
          "La deuxième compétence est la modélisation de données. Sans devenir développeur, il faut comprendre qu’un e-mail est un objet contenant plusieurs champs, qu’une pièce jointe a un nom et un type, qu’une sortie IA peut être structurée en paires clé-valeur, et qu’un module suivant attend parfois un format précis. Ce vocabulaire suffit à débloquer énormément de situations.",
          "La troisième compétence est le choix entre règle et IA. Une condition « si l’expéditeur appartient à cette liste » est une règle. Reconnaître si le contenu correspond à une demande de devis est une tâche plus souple. Le participant apprend à ne pas demander à un LLM de faire ce qu’une condition exacte ferait mieux.",
          "La quatrième compétence est le contrôle. On apprend à créer des branches d’exception, à journaliser les erreurs, à limiter les permissions et à distinguer un brouillon d’un envoi automatique. Les participants découvrent qu’augmenter l’autonomie d’un système n’est pas toujours une amélioration.",
          "La cinquième compétence est le test. Un workflow ne se valide pas sur un exemple qui fonctionne. On prépare un petit jeu de cas : normal, sans pièce jointe, expéditeur inconnu, document ambigu, doublon, erreur d’authentification simulée. Le participant documente le résultat attendu et compare le comportement réel.",
          "La sixième compétence est la maintenance. Qui est responsable si le dossier Drive change de nom ? que faire si un compte est désactivé ? où voir les exécutions en erreur ? comment modifier une catégorie ? La formation doit rendre le système moins dépendant du formateur, pas davantage."
        ]
      },
      {
        id: "programme",
        kicker: "04 — DÉROULÉ",
        heading: "Un parcours possible en six blocs, tous reliés au même cas d’usage.",
        paragraphs: [
          "Un programme efficace peut être organisé autour d’une progression très concrète. Le premier bloc pose les concepts : trigger, action, condition, donnée, connecteur, authentification. Le deuxième construit une automatisation sans IA. Le troisième introduit l’extraction ou la classification par modèle. Le quatrième ajoute le contrôle humain. Le cinquième provoque volontairement des erreurs. Le sixième demande aux participants de transposer la méthode à leur propre processus.",
          "Cette continuité est importante. Lorsque chaque module utilise un exemple différent, les participants ont l’impression d’assister à une succession de démonstrations. Lorsque le même workflow se transforme sous leurs yeux, ils voient comment un système gagne progressivement en capacité et en robustesse.",
          "La partie IA peut commencer très simplement : classer le message et retourner trois champs. Le formateur montre ensuite ce qui se passe lorsque l’instruction est vague, puis lorsqu’on impose des valeurs autorisées et une structure. La discussion porte moins sur les « secrets du prompt » que sur la qualité du contrat entre l’étape IA et le reste du workflow.",
          "La séquence sur les erreurs doit être obligatoire. On déconnecte volontairement un accès, on déplace un dossier, on envoie un fichier inattendu. Le groupe doit retrouver l’erreur dans l’historique, comprendre quelle étape a échoué et décider de la reprise. Cette expérience donne une vision plus professionnelle de l’automatisation que dix scénarios qui fonctionnent uniquement en démonstration.",
          "Le dernier bloc est celui du transfert. Chaque participant choisit une tâche de son métier et remplit une fiche : déclencheur, entrées, règles, étape IA éventuelle, actions, validation, données sensibles, erreurs possibles, propriétaire du workflow. Même si le scénario n’est pas construit pendant la session, la personne repart avec une méthode de conception."
        ],
        steps: [
          { title: "Bloc 1 — Lire un processus", text: "Identifier événements, données, décisions et actions." },
          { title: "Bloc 2 — Automatiser sans IA", text: "Construire un flux simple et comprendre les connecteurs." },
          { title: "Bloc 3 — Ajouter l’IA", text: "Classifier ou extraire en sortie structurée." },
          { title: "Bloc 4 — Garder la main", text: "Créer validations, limites et permissions." },
          { title: "Bloc 5 — Faire échouer le système", text: "Tester, diagnostiquer, reprendre." },
          { title: "Bloc 6 — Transposer", text: "Concevoir le premier workflow du participant." }
        ]
      },
      {
        id: "pedagogie",
        kicker: "05 — PÉDAGOGIE",
        heading: "Faire construire plutôt que faire admirer.",
        paragraphs: [
          "Les outils d’IA produisent facilement un effet spectaculaire. Une démo où un agent lit un e-mail, consulte un Drive et répond en quelques secondes peut impressionner une salle sans lui transmettre aucune compétence. Le participant repart avec l’idée que « l’IA peut tout faire », mais il est incapable de reproduire le système, d’en voir les risques ou de savoir par où commencer.",
          "La pédagogie doit donc volontairement ralentir la magie. Le formateur montre les données entre les étapes. Il demande au groupe de prédire ce qui va se passer. Il laisse une erreur visible et demande comment la récupérer. Il compare une action automatique à un brouillon soumis à validation. L’objectif est que le système devienne explicable.",
          "Un bon exercice consiste à donner trois versions d’un même workflow : l’une entièrement déterministe, l’une avec une étape IA, l’une avec trop d’autonomie. Les participants doivent choisir la meilleure architecture et justifier leur décision. Ils découvrent que l’architecture la plus « intelligente » n’est pas nécessairement la meilleure.",
          "Le formateur peut aussi introduire un journal de décisions. Pourquoi utilisons-nous l’IA ici ? pourquoi gardons-nous une validation humaine là ? quelles données sont envoyées ? quel compte détient l’autorisation ? Ce document sert ensuite à la maintenance et à la gouvernance. Il transforme une expérimentation en objet professionnel."
        ]
      },
      {
        id: "securite",
        kicker: "06 — DONNÉES & GOUVERNANCE",
        heading: "Apprendre à automatiser, c’est aussi apprendre à limiter.",
        paragraphs: [
          "Une formation no-code qui apprend uniquement à connecter des services est incomplète. Les participants doivent comprendre ce qu’ils autorisent. Lorsqu’un connecteur demande accès à Gmail ou Google Drive, il faut expliquer la notion de permissions et l’intérêt de restreindre le périmètre. Dans un environnement entreprise, les règles d’administration peuvent également limiter les applications autorisées.",
          "L’étape IA pose une deuxième question : quelles données quittent l’outil source et sont transmises au modèle ? Le participant doit apprendre à ne pas envoyer plus que nécessaire. On peut parfois classifier à partir de l’objet et de quelques lignes plutôt que du document complet. Dans d’autres cas, le contenu entier est nécessaire ; ce choix doit être conscient.",
          "La gouvernance ne doit pas être enseignée comme un chapitre juridique déconnecté de la pratique. Elle peut être intégrée au workflow. Une donnée sensible apparaît : que fait-on ? une action engageante est proposée : qui valide ? une erreur survient : où est-elle enregistrée ? un compte quitte l’entreprise : qui devient propriétaire de l’automatisation ?",
          "Ce lien entre gouvernance et construction rend les règles beaucoup plus mémorables. Le participant comprend que sécurité, conformité et robustesse ne sont pas des obstacles à l’automatisation : ce sont des caractéristiques du système."
        ]
      },
      {
        id: "evaluation",
        kicker: "07 — ÉVALUATION",
        heading: "Évaluer une capacité, pas une satisfaction.",
        paragraphs: [
          "À la fin de la session, la question importante n’est pas seulement « avez-vous apprécié la formation ? ». Le participant doit être capable de décrire un processus, choisir un déclencheur, expliquer où l’IA apporte quelque chose, construire une condition, prévoir une validation et diagnostiquer une erreur simple. Ces éléments peuvent être observés.",
          "Une évaluation pratique peut consister à donner un nouveau cas : des formulaires arrivent par e-mail et doivent être classés dans Drive selon leur type. Le participant conçoit le workflow sans reprendre exactement l’exercice précédent. Il explique ses choix et identifie au moins deux cas d’exception. Le formateur évalue la démarche plus que la rapidité.",
          "On peut également demander un mini dossier de livraison : schéma du workflow, captures ou export si l’outil le permet, liste des permissions, cas de test, points nécessitant validation humaine et procédure de reprise. Ce livrable a une double utilité : il prouve la compétence acquise et crée une habitude de documentation.",
          "Pour une entreprise, l’évaluation à froid peut regarder si les participants ont réellement réutilisé la méthode, quels workflows ont été construits, lesquels ont été abandonnés et pourquoi. Cela permet d’améliorer le programme sans transformer des estimations de temps gagné en chiffres certains."
        ]
      },
      {
        id: "suite",
        kicker: "08 — APRÈS LA FORMATION",
        heading: "Le vrai résultat : une équipe qui sait choisir quoi automatiser.",
        paragraphs: [
          "Après avoir construit un premier workflow Gmail + Drive, les participants commencent généralement à reconnaître le même pattern ailleurs : formulaire → tableur → notification ; CRM → préparation de rendez-vous ; compte rendu → tâches ; document → extraction → validation. La compétence n’est plus liée à l’exemple initial.",
          "C’est là que la formation peut s’inscrire dans une trajectoire plus large. Une équipe peut commencer par des automatisations déterministes, ajouter ensuite des étapes d’IA pour interpréter du texte, puis apprendre les bases des agents lorsque le besoin justifie davantage d’autonomie. Chaque niveau repose sur le précédent.",
          "Une organisation peut également créer une petite bibliothèque interne de workflows approuvés. Chaque fiche explique le besoin, le propriétaire, les outils, les données, les permissions, le niveau d’autonomie et la procédure de reprise. Les nouveaux projets ne repartent plus de zéro et les bonnes pratiques deviennent visibles.",
          "Le scénario Gmail + Drive n’est alors qu’un premier exercice. Ce que les participants ont réellement appris, c’est une nouvelle façon de regarder leur travail : distinguer ce qui mérite leur jugement de ce qui relève surtout du transport, du tri, de la reformulation ou de la coordination de l’information. C’est cette capacité qui rend l’IA opérationnelle."
        ]
      }
    ]
  }
];

export const publishedExecutionArticles = [
  ...baseExecutionArticles,
  ...marketDemandExecutionArticles,
  ...marketDemandExecutionArticlesWave2,
  ...marketDemandExecutionArticlesWave3,
  ...marketDemandExecutionArticlesWave4,
  ...marketDemandExecutionArticlesWave5,
  ...marketDemandExecutionArticlesWave6,
  ...marketDemandExecutionArticlesWave7,
  ...marketDemandExecutionArticlesWave8,
  ...marketDemandExecutionArticlesWave9,
  ...marketDemandExecutionArticlesWave10,
  ...marketDemandExecutionArticlesWave11,
  ...marketDemandExecutionArticlesWave12,
  ...marketDemandExecutionArticlesWave13,
  ...marketDemandExecutionArticlesWave14
];

export const publishedTrainingArticles = [
  ...baseTrainingArticles,
  ...marketDemandTrainingArticles,
  ...marketDemandTrainingArticlesWave2,
  ...marketDemandTrainingArticlesWave3,
  ...marketDemandTrainingArticlesWave4,
  ...marketDemandTrainingArticlesWave5,
  ...marketDemandTrainingArticlesWave6,
  ...marketDemandTrainingArticlesWave7,
  ...marketDemandTrainingArticlesWave8,
  ...marketDemandTrainingArticlesWave9,
  ...marketDemandTrainingArticlesWave10,
  ...marketDemandTrainingArticlesWave11,
  ...marketDemandTrainingArticlesWave12,
  ...marketDemandTrainingArticlesWave13,
  ...marketDemandTrainingArticlesWave14
];

export function getPublishedExecutionArticle(slug) {
  return publishedExecutionArticles.find((article) => article.slug === slug) || null;
}

export function getPublishedTrainingArticle(slug) {
  return publishedTrainingArticles.find((article) => article.slug === slug) || null;
}

export const publishedTerritoryArticles = [...territoryArticlesWave1];

export function getPublishedTerritoryArticle(slug) {
  return publishedTerritoryArticles.find((article) => article.slug === slug) || null;
}
