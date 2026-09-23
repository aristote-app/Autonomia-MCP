export const observatoryGroups = [
  { id: "metiers", label: "Métiers" },
  { id: "secteurs", label: "Secteurs d’activité" },
  { id: "taches", label: "Tâches transverses" }
];

export const observatoryTopics = [
  {
    slug: "ressources-humaines",
    group: "metiers",
    title: "Ressources humaines",
    short: "Recrutement, onboarding, formation, questions salariés et documents RH.",
    headline: "Réduire l’administratif RH sans perdre le contrôle humain.",
    intro: "L’IA peut préparer, rechercher, synthétiser et structurer. Les décisions qui engagent une personne restent du ressort des équipes RH.",
    prompt: "Ex. recrutement, onboarding, réponses salariés, formation, synthèse d’entretiens…",
    modules: [
      ["Candidatures", "Relire manuellement CV, mails et notes.", "Extraire les informations utiles et préparer une synthèse comparable.", "Moins de temps de lecture ; décision finale humaine."],
      ["Entretiens", "Préparer questions et comptes rendus à chaque recrutement.", "Générer une trame contextualisée puis structurer les notes.", "Entretiens mieux préparés et plus faciles à exploiter."],
      ["Onboarding", "Dépendre des collègues disponibles pour chaque question.", "Créer un assistant interne sur procédures, outils et documents validés.", "Plus d’autonomie dès les premières semaines."],
      ["Questions salariés", "Répondre encore et encore aux mêmes demandes.", "Rechercher la bonne règle et préparer une réponse sourcée.", "Moins d’interruptions ; escalade humaine quand nécessaire."],
      ["Formation interne", "Construire manuellement supports, quiz et parcours.", "Transformer un besoin en parcours et exercices par population.", "Déploiement plus rapide et plus homogène."],
      ["Documents RH", "Repartir d’un modèle et tout réécrire.", "Préparer un draft à partir de données et modèles validés.", "Moins de rédaction répétitive ; validation obligatoire."]
    ]
  },
  {
    slug: "direction-management",
    group: "metiers",
    title: "Direction & management",
    short: "Réunions, décisions, synthèses, plans d’action, reporting et veille.",
    headline: "Passer moins de temps à consolider, plus de temps à décider.",
    intro: "Pour une direction, la valeur n’est pas d’ajouter un chatbot. Elle est de réduire le temps de collecte, de synthèse et de suivi autour des décisions.",
    prompt: "Ex. réunions, reporting, notes de décision, plan d’action, veille…",
    modules: [
      ["Réunions", "Reprendre à la main décisions, actions et responsables.", "Produire compte rendu, décisions et plan d’action depuis notes ou transcription.", "Moins d’après-réunion ; validation du compte rendu par l’équipe."],
      ["Synthèse multi-sources", "Relire mails, fichiers, CRM et présentations séparément.", "Consolider les points qui nécessitent une décision.", "Une vue plus rapide avant arbitrage."],
      ["Notes de décision", "Structurer options et risques manuellement.", "Préparer scénarios, avantages, limites et questions à trancher.", "Décisions mieux préparées ; arbitrage humain."],
      ["Suivi d’actions", "Perdre les engagements entre réunions et outils.", "Centraliser actions, relances et changements de statut.", "Moins d’actions oubliées."],
      ["Communication", "Réécrire un même message pour chaque public.", "Décliner une information en plusieurs formats et niveaux de détail.", "Communication plus rapide et cohérente."],
      ["Veille", "Lire trop de sources avant de trouver le signal utile.", "Filtrer, résumer et classer les signaux par enjeu.", "Veille plus courte et exploitable."]
    ]
  },
  {
    slug: "commercial-business-development",
    group: "metiers",
    title: "Commercial & business development",
    short: "Qualification, rendez-vous, CRM, propositions, relances et pipeline.",
    headline: "Réduire le temps autour de la vente, pas la relation commerciale.",
    intro: "L’IA peut préparer et qualifier. La relation, la négociation et la décision commerciale restent humaines.",
    prompt: "Ex. qualification leads, rendez-vous, relances, CRM, propositions…",
    modules: [
      ["Qualification", "Chercher manuellement les informations avant de prioriser.", "Enrichir un lead et préparer une fiche de contexte.", "Moins de recherche avant contact."],
      ["Préparation de rendez-vous", "Relire historique, site, CRM et notes.", "Produire une synthèse du compte et des sujets à explorer.", "Rendez-vous mieux préparés."],
      ["CRM", "Remplir tard ou partiellement après les échanges.", "Transformer les notes en résumé, prochaines actions et champs proposés.", "CRM plus fiable ; validation avant écriture."],
      ["Propositions", "Reprendre les mêmes blocs et les adapter à la main.", "Assembler une première version depuis des contenus validés.", "Propositions produites plus vite."],
      ["Relances", "Laisser refroidir des opportunités faute de suivi.", "Suggérer contexte, moment et brouillon de relance.", "Moins d’opportunités oubliées."],
      ["Pipeline", "Commenter manuellement les opportunités dans le CRM.", "Synthétiser risques, blocages et comptes sans activité.", "Pilotage commercial plus rapide."]
    ]
  },
  {
    slug: "marketing-communication",
    group: "metiers",
    title: "Marketing & communication",
    short: "Contenus, SEO, campagnes, déclinaisons, veille et reporting.",
    headline: "Produire plus vite sans transformer la marque en contenu générique.",
    intro: "L’IA devient utile lorsqu’elle accélère recherche, production, déclinaison et analyse tout en restant cadrée par la stratégie et la marque.",
    prompt: "Ex. contenus, SEO/GEO, social, campagnes, reporting, veille concurrentielle…",
    modules: [
      ["Production éditoriale", "Passer du temps sur recherche, structure et première version.", "Préparer angles, plan, draft et variantes depuis une charte.", "Plus de capacité de production ; validation éditoriale humaine."],
      ["Déclinaison", "Réécrire un contenu pour chaque canal.", "Transformer un contenu source en email, post, landing ou script.", "Un même travail mieux réutilisé."],
      ["SEO & GEO", "Croiser données, contenus existants et intuition.", "Regrouper requêtes, trous éditoriaux et signaux de demande.", "Backlog éditorial plus actionnable."],
      ["Veille", "Lire trop de sources concurrentes.", "Résumer changements d’offres, messages et signaux marché.", "Veille plus régulière et exploitable."],
      ["Campagnes", "Préparer trop lentement les variantes créatives.", "Générer et classer des variantes à partir d’un brief.", "Davantage de tests sans perdre la maîtrise."],
      ["Reporting", "Consolider et commenter les chiffres à la main.", "Préparer synthèse, anomalies et questions à investiguer.", "Moins de temps de reporting."]
    ]
  },
  {
    slug: "finance-comptabilite",
    group: "metiers",
    title: "Finance & comptabilité",
    short: "Extraction, contrôle documentaire, rapprochements, écarts et reporting.",
    headline: "Automatiser la préparation et les contrôles répétitifs, pas la responsabilité financière.",
    intro: "L’IA peut accélérer extraction, rapprochement, explication et préparation. Les validations comptables et financières restent contrôlées.",
    prompt: "Ex. factures, rapprochements, reporting, contrôle de dossiers, écarts…",
    modules: [
      ["Factures", "Relire et ressaisir les informations.", "Extraire fournisseur, montant, date, référence et lignes clés.", "Moins de saisie ; validation des anomalies."],
      ["Contrôle documentaire", "Vérifier pièce par pièce.", "Repérer pièces manquantes, incohérences et champs non conformes.", "Contrôle plus rapide et systématique."],
      ["Rapprochements", "Rechercher manuellement les correspondances.", "Proposer des correspondances et isoler les exceptions.", "Les cas simples sont traités plus vite."],
      ["Analyse d’écarts", "Commenter manuellement les écarts budgétaires.", "Préparer causes possibles et questions à investiguer.", "Analyse plus vite exploitable."],
      ["Reporting", "Assembler plusieurs fichiers et commentaires.", "Consolider indicateurs et préparer une première narration.", "Production de reporting allégée."],
      ["Clôture", "Suivre des checklists dispersées.", "Orchestrer étapes, pièces, rappels et exceptions.", "Clôture mieux suivie."]
    ]
  },
  {
    slug: "service-client-support",
    group: "metiers",
    title: "Service client & support",
    short: "Qualification, réponses, base de connaissance, synthèse et qualité.",
    headline: "Répondre plus vite sans enfermer le client face à un robot.",
    intro: "L’IA peut traiter le premier niveau, rechercher l’information et préparer une réponse. L’escalade humaine doit rester simple et immédiate.",
    prompt: "Ex. tickets, FAQ, base de connaissance, routage, motifs de contact…",
    modules: [
      ["Qualification", "Trier manuellement les demandes entrantes.", "Classer, détecter l’urgence et proposer le bon routage.", "Traitement initial plus rapide."],
      ["Premier niveau", "Réécrire les mêmes réponses.", "Préparer une réponse depuis des sources validées.", "Un humain reprend les cas incertains."],
      ["Recherche interne", "Chercher dans plusieurs outils.", "Créer une recherche conversationnelle sur les procédures.", "Information retrouvée plus vite."],
      ["Synthèse dossier", "Relire un historique client long.", "Résumer échanges, incidents et actions déjà menées.", "Reprise de dossier accélérée."],
      ["Motifs de contact", "Analyser ponctuellement les irritants.", "Regrouper les demandes et détecter les motifs récurrents.", "Boucle qualité plus régulière."],
      ["Contrôle qualité", "Relire seulement un petit échantillon.", "Pré-sélectionner les conversations à risque.", "Contrôle mieux ciblé."]
    ]
  },

  {
    slug: "collectivites-intercommunalites",
    group: "secteurs",
    title: "Collectivités & intercommunalités",
    short: "Agents, ADS, équipements, courrier, déchets, Academy et entreprises du territoire.",
    headline: "Moins de tâches répétitives. Plus de temps pour le service public.",
    intro: "Pour une communauté de communes ou d’agglomération, l’enjeu est de choisir quelques usages visibles, contrôlables et utiles aux agents, puis d’accompagner les entreprises du territoire.",
    prompt: "Ex. ADS, PV, conservatoire, courrier, déchets, agents, TPE/PME…",
    href: "/territoires",
    modules: [
      ["Conseils communautaires", "Passer 1 à 2 jours sur PV et compte rendu.", "Transcrire, structurer et préparer un projet de PV relu par l’agent.", "L’agent valide ; moins de travail après séance."],
      ["Pré-instruction ADS", "Contrôler pièces et règles dossier par dossier.", "Pré-contrôler pièces, règles PLUi, servitudes et délais.", "L’instructeur décide et signe."],
      ["Équipements culturels", "Gérer appels, inscriptions et plannings au fil de l’eau.", "Optimiser créneaux sous contraintes et proposer une réservation famille.", "Équipe plus disponible ; planning explicable."],
      ["Courrier entrant", "Enregistrer, classer et affecter chaque courrier.", "Lire, classer, accuser réception et router vers le bon service.", "Suppression d’une tâche quotidienne répétitive."],
      ["Déchets & demandes usagers", "Qualifier manuellement incidents, badges et réclamations.", "Trier, classer et préparer la réponse ou l’action.", "Standard désengorgé."],
      ["Entreprises du territoire", "Les TPE-PME avancent seules et de façon inégale.", "Diagnostic, ateliers et accompagnement de cas d’usage concrets.", "Un programme territorial visible et utile."]
    ]
  },
  {
    slug: "industrie",
    group: "secteurs",
    title: "Industrie",
    short: "Qualité, maintenance, documentation, production, achats et support terrain.",
    headline: "Mettre l’IA là où elle réduit les arrêts, les recherches et les contrôles répétitifs.",
    intro: "L’industrie combine données, procédures, documentation et contraintes terrain. Les meilleurs cas d’usage sont ceux qui s’intègrent au processus existant.",
    prompt: "Ex. maintenance, qualité, documentation, production, achats…",
    modules: [
      ["Maintenance", "Chercher dans historiques et documentations.", "Synthétiser incidents et proposer les procédures pertinentes.", "Diagnostic plus rapide ; technicien décide."],
      ["Qualité", "Relire rapports et non-conformités.", "Classer causes, rapprocher incidents similaires et préparer une synthèse.", "Analyse qualité plus rapide."],
      ["Documentation", "Trouver la bonne procédure dans des PDF dispersés.", "Créer une recherche sourcée sur documentation validée.", "Moins de temps de recherche."],
      ["Production", "Consolider manuellement événements et écarts.", "Résumer anomalies et faits marquants par équipe ou ligne.", "Passage de consigne plus clair."],
      ["Achats", "Comparer manuellement offres et spécifications.", "Structurer comparatifs et signaler écarts.", "Préparation plus rapide ; décision acheteur."],
      ["Support terrain", "Remonter des problèmes par mail ou téléphone.", "Structurer la demande et orienter vers la bonne expertise.", "Moins d’allers-retours."]
    ]
  },
  {
    slug: "retail-commerce",
    group: "secteurs",
    title: "Retail & commerce",
    short: "Magasins, stocks, contenu produit, service client, commandes et opérations.",
    headline: "Réduire les tâches de coordination qui prennent du temps en magasin et au siège.",
    intro: "Le retail a beaucoup de petits processus répétitifs à fort volume. L’IA et l’automatisation peuvent les rendre plus visibles et plus fluides.",
    prompt: "Ex. stocks, contenus produit, commandes, support magasin, service client…",
    modules: [
      ["Contenu produit", "Créer et corriger les fiches une par une.", "Préparer descriptions, attributs et variantes depuis les données produit.", "Catalogue mis à jour plus vite."],
      ["Stocks", "Analyser les ruptures et surstocks manuellement.", "Regrouper signaux et proposer les références à investiguer.", "Pilotage plus réactif."],
      ["Support magasin", "Les magasins sollicitent le siège pour les mêmes questions.", "Assistant interne sur procédures et opérations.", "Moins d’interruptions au siège."],
      ["Commandes", "Propositions de commande préparées à la main.", "Préparer des suggestions à partir des règles et données disponibles.", "Décision finale conservée par l’équipe."],
      ["Service client", "Trier et traiter les demandes répétitives.", "Qualifier et préparer les réponses de premier niveau.", "Délais de réponse réduits."],
      ["Reporting réseau", "Consolider plusieurs fichiers magasin.", "Préparer synthèse, anomalies et écarts notables.", "Reporting réseau allégé."]
    ]
  },
  {
    slug: "immobilier-construction",
    group: "secteurs",
    title: "Immobilier & construction",
    short: "Comptes rendus, documents, réserves, suivi chantier, appels d’offres et dossiers.",
    headline: "Faire circuler l’information chantier sans multiplier les ressaisies.",
    intro: "Entre mails, plans, photos, CR, réserves et dossiers, l’information se disperse. L’enjeu est de mieux la structurer et la retrouver.",
    prompt: "Ex. CR chantier, réserves, dossiers, appels d’offres, suivi documentaire…",
    modules: [
      ["Comptes rendus", "Rédiger et redistribuer les points après réunion.", "Préparer CR, décisions, responsables et échéances.", "Moins de temps après réunion."],
      ["Réserves", "Suivre photos, localisation et statut dans plusieurs supports.", "Structurer et rapprocher les réserves par lot et responsable.", "Suivi plus clair."],
      ["Documents", "Chercher dans dossiers, plans et pièces écrites.", "Recherche assistée sur documents autorisés.", "Information retrouvée plus vite."],
      ["Appels d’offres", "Lire et structurer les pièces manuellement.", "Extraire exigences, échéances et points de vigilance.", "Préparation plus rapide."],
      ["Suivi chantier", "Recopier les mêmes informations entre outils.", "Automatiser transferts et mises à jour.", "Moins de double saisie."],
      ["Dossiers clients", "Vérifier complétude à la main.", "Contrôler présence, cohérence et pièces manquantes.", "Contrôle plus systématique."]
    ]
  },

  {
    slug: "taches-administratives",
    group: "taches",
    title: "Tâches administratives",
    short: "Saisie, classement, formulaires, dossiers, relances et mises à jour.",
    headline: "Enlever ce qui use sans retirer ce qui nécessite du jugement.",
    intro: "Les tâches administratives sont souvent composées de lecture, copie, contrôle, classement et relance. C’est précisément là que l’automatisation peut rendre du temps.",
    prompt: "Ex. saisie, formulaires, dossiers, relances, classement, contrôles…",
    modules: [
      ["Saisie", "Recopier des données entre documents et outils.", "Extraire puis préremplir les champs attendus.", "Moins de double saisie."],
      ["Classement", "Nommer et ranger les documents à la main.", "Classer selon des règles et métadonnées.", "Dossiers plus homogènes."],
      ["Complétude", "Vérifier chaque dossier manuellement.", "Repérer pièces manquantes ou incohérentes.", "Contrôle accéléré."],
      ["Relances", "Tenir une liste manuelle des personnes à relancer.", "Détecter les dossiers en attente et préparer la relance.", "Moins d’oublis."],
      ["Formulaires", "Transformer un mail ou PDF en données structurées.", "Extraire les informations et les présenter pour validation.", "Traitement plus rapide."],
      ["Mises à jour", "Modifier plusieurs outils après la même action.", "Synchroniser les informations lorsque c’est autorisé.", "Moins de ressaisie."]
    ]
  },
  {
    slug: "gestion-contenu-digital",
    group: "taches",
    title: "Marketing digital & gestion de contenu",
    short: "Créer, adapter, publier, réutiliser et contrôler les contenus.",
    headline: "Transformer une production ponctuelle en système éditorial réutilisable.",
    intro: "Le gain ne vient pas seulement de générer du texte. Il vient de structurer la chaîne de production, les sources, les validations et les déclinaisons.",
    prompt: "Ex. articles, réseaux sociaux, newsletter, SEO, fiches produit, calendrier…",
    modules: [
      ["Brief", "Repartir de zéro à chaque contenu.", "Transformer objectif, cible et sources en brief exploitable.", "Moins de temps de cadrage."],
      ["Draft", "Écrire chaque première version manuellement.", "Préparer une version à partir de sources et règles de marque.", "Production accélérée."],
      ["Déclinaisons", "Réécrire pour chaque canal.", "Créer plusieurs formats depuis un contenu source.", "Réutilisation renforcée."],
      ["Calendrier", "Piloter les idées dans des listes dispersées.", "Structurer backlog, dates, statut et responsable.", "Production plus régulière."],
      ["SEO/GEO", "Identifier les opportunités à la main.", "Rapprocher demandes, contenus existants et trous éditoriaux.", "Priorités plus claires."],
      ["Contrôle", "Relire ton, claims et cohérence au dernier moment.", "Pré-contrôler règles de marque et éléments sensibles.", "Moins d’erreurs avant publication."]
    ]
  },
  {
    slug: "emails-demandes-entrantes",
    group: "taches",
    title: "E-mails & demandes entrantes",
    short: "Trier, comprendre, affecter, répondre et suivre.",
    headline: "Arrêter d’utiliser la boîte mail comme moteur de workflow.",
    intro: "Quand une équipe reçoit beaucoup de demandes, le temps se perd surtout dans le tri, la recherche de contexte, l’affectation et la relance.",
    prompt: "Ex. boîte générique, support, demandes internes, formulaires, SAV…",
    modules: [
      ["Tri", "Lire chaque message avant de savoir quoi en faire.", "Classifier par sujet, urgence et type d’action.", "Traitement initial accéléré."],
      ["Extraction", "Chercher les informations utiles dans le corps du message.", "Extraire références, dates, montants ou identifiants.", "Moins de lecture répétitive."],
      ["Affectation", "Transférer manuellement vers le bon interlocuteur.", "Router selon règles et contexte.", "Moins d’erreurs d’aiguillage."],
      ["Réponse", "Réécrire des réponses proches.", "Préparer un brouillon à partir de sources validées.", "Réponse plus rapide."],
      ["Suivi", "Oublier une demande restée sans réponse.", "Créer échéance, relance et statut.", "Moins de demandes perdues."],
      ["Analyse", "Ne pas savoir quels sujets consomment le plus de temps.", "Regrouper motifs et volumes.", "Meilleure priorisation des améliorations."]
    ]
  },
  {
    slug: "reporting-syntheses",
    group: "taches",
    title: "Reporting & synthèses",
    short: "Collecte, consolidation, commentaire, anomalies et diffusion.",
    headline: "Passer du reporting fabriqué à la main au reporting préparé automatiquement.",
    intro: "Beaucoup d’équipes perdent du temps non pas à décider, mais à assembler les informations nécessaires à la décision.",
    prompt: "Ex. tableaux mensuels, synthèses, KPI, commentaires, comités…",
    modules: [
      ["Collecte", "Récupérer les mêmes fichiers chaque période.", "Automatiser la collecte depuis les sources disponibles.", "Moins de préparation."],
      ["Consolidation", "Assembler plusieurs formats à la main.", "Normaliser et rapprocher les données.", "Tableaux plus fiables."],
      ["Anomalies", "Repérer visuellement les écarts.", "Signaler évolutions inhabituelles et ruptures.", "Analyse plus ciblée."],
      ["Commentaires", "Réécrire la narration du mois.", "Préparer les faits marquants depuis les KPI.", "Moins de rédaction."],
      ["Synthèse direction", "Adapter le niveau de détail pour chaque comité.", "Produire différentes vues depuis la même base.", "Meilleure réutilisation."],
      ["Diffusion", "Envoyer manuellement fichiers et rappels.", "Orchestrer génération, validation et distribution.", "Cycle de reporting raccourci."]
    ]
  }
];

export function getObservatoryTopic(slug) {
  return observatoryTopics.find((topic) => topic.slug === slug) || null;
}

export function getObservatoryParams() {
  return observatoryTopics.map(({ slug }) => ({ slug }));
}
