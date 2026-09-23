export const problemClusters = [
  "Réunion",
  "Documents & RAG",
  "Commercial",
  "Administratif",
  "Reporting",
  "Finance",
  "Marketing",
  "RH",
  "Support",
  "Construction",
  "Industrie"
];

function problem(slug, wave, cluster, title, headline, intro, demos, deliverables) {
  return {
    slug,
    wave,
    cluster,
    title,
    headline,
    intro,
    prompt: "Décrivez votre flux actuel, les outils utilisés et ce qui vous fait perdre du temps.",
    cta: "Voir un prototype sur mon flux",
    demos,
    deliverables
  };
}

export const problemSolutions = [
  problem(
    "automatiser-comptes-rendus-reunion", 1, "Réunion",
    "Automatiser les comptes rendus de réunion",
    "Vos comptes rendus commencent encore après la réunion ?",
    "Transformez notes ou transcription en décisions, actions, responsables, échéances et suivi — avec une validation humaine avant diffusion.",
    [
      ["meeting", "Transcript → décisions", "Décisions et actions détectées", "Repérer ce qui a réellement été acté."],
      ["control", "Validation des engagements", "3 points à confirmer", "Séparer décision, hypothèse et point à arbitrer."],
      ["sequence", "Plan d’action", "Responsables + échéances", "Transformer le compte rendu en suivi exploitable."],
      ["builder", "E-mail de suivi", "Message prêt à relire", "Préparer la diffusion sans recopier le compte rendu."]
    ],
    ["Capture ou import de notes/transcription", "Extraction structurée des décisions et actions", "Validation humaine", "Export vers vos outils de suivi"]
  ),
  problem(
    "assistant-documentaire-ia-rag", 1, "Documents & RAG",
    "Assistant documentaire IA / RAG",
    "La réponse existe dans vos documents. Il faut encore la retrouver.",
    "Interrogez procédures, contrats, dossiers ou documentation interne en langage naturel et obtenez une réponse reliée aux passages sources.",
    [
      ["rag", "Question documentaire", "Réponse + citations", "Chercher dans un corpus autorisé plutôt que dans le web."],
      ["control", "Contrôle des sources", "Sources vérifiables", "Voir ce qui étaye réellement la réponse."],
      ["router", "Droits d’accès", "Périmètre par profil", "Limiter les documents accessibles selon le rôle."],
      ["quality", "Boucle d’évaluation", "Réponses à relire", "Identifier les questions mal couvertes avant généralisation."]
    ],
    ["Ingestion et indexation des sources", "Recherche sémantique et RAG", "Citations et droits d’accès", "Jeu de tests et suivi qualité"]
  ),
  problem(
    "qualification-automatique-leads", 1, "Commercial",
    "Qualification automatique des leads",
    "Chaque lead entre. Tous ne méritent pas la même urgence.",
    "Enrichissez, scorez et routez les demandes entrantes selon vos critères commerciaux avant la première action du commercial.",
    [
      ["score", "Scoring d’opportunité", "Priorité calculée", "Pondérer adéquation, urgence et signal d’achat."],
      ["extract", "Enrichissement du lead", "Contexte structuré", "Rassembler les informations utiles à la qualification."],
      ["router", "Routage commercial", "Bon propriétaire proposé", "Affecter selon territoire, offre ou potentiel."],
      ["sequence", "Prochaine action", "Action + timing", "Préparer le premier contact ou la relance."]
    ],
    ["Règles de qualification", "Enrichissement des données", "Scoring explicable", "CRM et routage vers l’équipe"]
  ),
  problem(
    "trier-router-emails-ia", 1, "Administratif",
    "Trier et router automatiquement les e-mails",
    "Votre boîte mail ne devrait pas être votre moteur de workflow.",
    "Classez les messages, détectez l’urgence, extrayez les données utiles et envoyez chaque demande vers le bon processus.",
    [
      ["router", "File entrante", "Catégorie + priorité", "Comprendre le sujet avant lecture humaine."],
      ["extract", "Extraction du message", "Références structurées", "Sortir dates, numéros, montants ou identifiants."],
      ["builder", "Réponse préparée", "Brouillon sourcé", "Préparer le premier niveau sans envoyer à l’aveugle."],
      ["dashboard", "Motifs & volumes", "Vue des irritants", "Voir ce qui consomme réellement la boîte générique."]
    ],
    ["Connexion Gmail/Outlook ou boîte générique", "Classification et extraction", "Routage vers équipe ou outil", "Brouillons et suivi des exceptions"]
  ),
  problem(
    "extraction-donnees-documents", 1, "Documents & RAG",
    "Extraction de données de documents",
    "Arrêtez de transformer des PDF en cellules à la main.",
    "Transformez factures, formulaires, contrats ou dossiers en champs structurés, contrôlables et prêts à injecter dans vos outils.",
    [
      ["extract", "Document → champs", "Données structurées", "Extraire les informations attendues."],
      ["control", "Contrôle de cohérence", "Exceptions isolées", "Repérer les champs manquants ou incohérents."],
      ["router", "Classement", "Type + destination", "Orienter le document vers le bon flux."],
      ["dashboard", "Suivi de traitement", "Volumes + exceptions", "Piloter ce qui passe et ce qui bloque."]
    ],
    ["Capture des documents", "Extraction structurée", "Règles de validation", "Export API/CSV/ERP/CRM/GED"]
  ),
  problem(
    "controler-dossiers-automatiquement", 1, "Administratif",
    "Contrôler automatiquement des dossiers",
    "Un dossier incomplet ne devrait pas mobiliser une lecture complète.",
    "Pré-contrôlez présence des pièces, cohérence des champs et règles de complétude pour concentrer l’humain sur les exceptions.",
    [
      ["control", "Checklist dynamique", "Complétude visible", "Vérifier les pièces et règles attendues."],
      ["extract", "Lecture des pièces", "Champs rapprochés", "Comparer les informations entre documents."],
      ["router", "Gestion des exceptions", "Cas à arbitrer", "Faire remonter les dossiers incertains."],
      ["sequence", "Relance pièces manquantes", "Relance préparée", "Informer sans reconstruire le dossier à la main."]
    ],
    ["Référentiel de pièces et règles", "Contrôle de complétude", "Détection d’incohérences", "File d’exceptions et relances"]
  ),
  problem(
    "automatiser-reporting", 1, "Reporting",
    "Automatiser le reporting",
    "Le reporting devrait commencer par l’analyse, pas par le copier-coller.",
    "Collectez les sources, consolidez les indicateurs, détectez les écarts et préparez le commentaire avant validation.",
    [
      ["dashboard", "Collecte multi-sources", "Sources consolidées", "Réunir les données récurrentes."],
      ["control", "Contrôle avant calcul", "Anomalies isolées", "Bloquer les données incohérentes."],
      ["score", "Détection des écarts", "Variations prioritaires", "Faire remonter ce qui mérite une analyse."],
      ["builder", "Commentaire de reporting", "Synthèse prête", "Rédiger les faits observés sans inventer les causes."]
    ],
    ["Connecteurs aux sources", "Consolidation et contrôles", "Dashboard", "Narration assistée et diffusion"]
  ),
  problem(
    "controle-factures-ia", 1, "Finance",
    "Contrôle des factures par IA",
    "Lire une facture ne devrait pas être la partie la plus longue du contrôle.",
    "Extrayez les lignes, rapprochez les règles attendues et faites remonter les écarts avant validation comptable.",
    [
      ["extract", "Lecture facture", "Champs + lignes", "Structurer le document sans ressaisie."],
      ["control", "Contrôles métier", "Écarts signalés", "Comparer TVA, références, montants ou commandes."],
      ["compare", "Facture vs référence", "Différences visibles", "Mettre côte à côte facture, contrat ou bon de commande."],
      ["router", "Circuit de validation", "Exception affectée", "Envoyer le cas au bon valideur."]
    ],
    ["Extraction des factures", "Règles de contrôle", "Rapprochement avec référentiels", "Workflow de validation"]
  ),
  problem(
    "reponse-appel-offres-ia", 1, "Documents & RAG",
    "Préparer une réponse à appel d’offres avec l’IA",
    "Le DCE doit devenir une liste d’exigences avant de devenir un mémoire.",
    "Analysez les pièces, extrayez obligations et échéances, retrouvez les contenus réutilisables et préparez une première trame à valider.",
    [
      ["tender", "Lecture du DCE", "Exigences + échéances", "Sortir les points à traiter avant rédaction."],
      ["rag", "Base de réponses", "Contenus retrouvés", "Retrouver les éléments déjà validés dans vos dossiers."],
      ["compare", "Matrice de conformité", "Couverture visible", "Comparer les exigences aux preuves disponibles."],
      ["builder", "Trame de mémoire", "Plan contextualisé", "Préparer un draft sans inventer références ni capacités."]
    ],
    ["Analyse DCE", "Matrice exigences/preuves", "Bibliothèque de contenus validés", "Trame et workflow de relecture"]
  ),
  problem(
    "automatiser-saisie-crm", 1, "Commercial",
    "Automatiser la saisie CRM",
    "Le CRM doit se remplir depuis le travail commercial, pas après.",
    "Transformez notes, e-mails et rendez-vous en résumé, champs proposés, prochaines actions et mises à jour à valider.",
    [
      ["meeting", "Notes de rendez-vous", "Résumé structuré", "Extraire besoins, objections et engagements."],
      ["extract", "Champs CRM", "Données préremplies", "Proposer les valeurs attendues par le CRM."],
      ["control", "Validation commerciale", "Changements visibles", "Faire confirmer les écritures sensibles."],
      ["dashboard", "Hygiène CRM", "Fiches à compléter", "Repérer les dossiers sans activité ou incomplets."]
    ],
    ["Capture des échanges", "Mapping vers champs CRM", "Validation des mises à jour", "Actions et rappels"]
  ),
  problem(
    "relances-commerciales-ia", 2, "Commercial",
    "Automatiser les relances commerciales",
    "Relancer au bon moment sans envoyer la même séquence à tout le monde.",
    "Utilisez le stade du deal, l’historique et les signaux récents pour préparer la prochaine relance et son canal.",
    [
      ["sequence", "Séquence contextuelle", "Timing proposé", "Adapter J+3, J+8 ou la pause au contexte."],
      ["rag", "Historique du deal", "Contexte retrouvé", "Ne pas relancer sans relire les échanges utiles."],
      ["builder", "Message de relance", "Brouillon contextualisé", "Préparer un message cohérent avec le dernier échange."],
      ["dashboard", "Deals sans action", "Priorités visibles", "Voir ce qui refroidit avant qu’il ne soit oublié."]
    ],
    ["Lecture du CRM", "Règles de relance", "Génération de brouillons", "Validation/envoi et suivi"]
  ),
  problem(
    "preparation-rendez-vous-commercial-ia", 2, "Commercial",
    "Préparer automatiquement un rendez-vous commercial",
    "Arrivez au rendez-vous avec le compte déjà remis en contexte.",
    "Regroupez historique CRM, échanges et signaux utiles dans un brief court : enjeux, interlocuteurs, objections et questions à explorer.",
    [
      ["rag", "Historique compte", "Faits utiles", "Retrouver uniquement ce qui éclaire le rendez-vous."],
      ["dashboard", "Compte 360", "Vue synthétique", "Réunir activité, pipeline et derniers événements."],
      ["score", "Signaux à explorer", "Priorités de discussion", "Trier les hypothèses par pertinence."],
      ["builder", "Brief rendez-vous", "1 page préparée", "Produire les questions et points de vigilance."]
    ],
    ["Connexion CRM et sources autorisées", "Synthèse compte", "Signaux externes optionnels", "Brief avant rendez-vous"]
  ),
  problem(
    "synthese-comex-ia", 2, "Reporting",
    "Générer une synthèse COMEX",
    "Le COMEX n’a pas besoin de plus de slides. Il a besoin des écarts à décider.",
    "Consolidez indicateurs et commentaires métier en une vue courte qui distingue faits, alertes, décisions et questions ouvertes.",
    [
      ["dashboard", "Vue exécutive", "KPI essentiels", "Réduire le bruit avant le comité."],
      ["score", "Variations prioritaires", "Écarts classés", "Faire remonter les ruptures significatives."],
      ["control", "Faits vs hypothèses", "Narration contrôlée", "Éviter d’inventer une causalité."],
      ["builder", "Brief COMEX", "Décisions à préparer", "Assembler les éléments à arbitrer."]
    ],
    ["Collecte des sources", "Règles de matérialité", "Synthèse exécutive", "Validation et export"]
  ),
  problem(
    "veille-concurrentielle-ia", 2, "Marketing",
    "Automatiser la veille concurrentielle",
    "La veille utile commence quand le changement est détecté, pas quand un lien est stocké.",
    "Surveillez pages, offres et signaux choisis, détectez les changements et transformez-les en alertes exploitables.",
    [
      ["dashboard", "Sources surveillées", "Couverture visible", "Savoir ce qui est réellement observé."],
      ["score", "Score de signal", "Bruit filtré", "Classer changements par importance."],
      ["compare", "Avant / après", "Différences visibles", "Comprendre ce qui a changé."],
      ["builder", "Brief de veille", "Synthèse actionnable", "Transformer le signal en question ou action."]
    ],
    ["Liste de sources", "Détection de changements", "Scoring des signaux", "Synthèse et alertes"]
  ),
  problem(
    "assistant-service-client-ia", 2, "Support",
    "Assistant IA pour le service client",
    "Donnez à l’agent la bonne réponse avant de lui demander de la rédiger.",
    "Retrouvez la procédure, résumez l’historique et préparez une réponse sourcée avec escalade humaine sur les cas incertains.",
    [
      ["router", "Qualification ticket", "Priorité + motif", "Identifier le bon flux dès l’arrivée."],
      ["rag", "Base de connaissance", "Réponse + source", "Retrouver la règle réellement applicable."],
      ["timeline", "Historique client", "Contexte résumé", "Éviter de relire toute la conversation."],
      ["builder", "Réponse proposée", "Brouillon prêt", "Répondre plus vite tout en gardant le contrôle."]
    ],
    ["Connexion ticketing/CRM", "RAG base de connaissance", "Synthèse historique", "Brouillon et escalade"]
  ),
  problem(
    "controle-qualite-service-client-ia", 2, "Support",
    "Contrôle qualité des réponses clients",
    "Relire 2 % des échanges au hasard ne montre pas forcément les bons risques.",
    "Scorez des critères explicites et faites remonter les conversations qui méritent une relecture humaine prioritaire.",
    [
      ["quality", "Scoring qualité", "Dimensions comparées", "Mesurer conformité, résolution ou ton."],
      ["score", "Priorisation", "Cas à risque", "Faire remonter les échanges atypiques."],
      ["control", "Règles sensibles", "Exceptions visibles", "Vérifier mentions obligatoires et points interdits."],
      ["dashboard", "Tendances équipe", "Motifs récurrents", "Voir où concentrer coaching et corrections."]
    ],
    ["Grille qualité", "Analyse des conversations", "Échantillonnage par risque", "Dashboard et boucle d’amélioration"]
  ),
  problem(
    "onboarding-salarie-ia", 2, "RH",
    "Automatiser l’onboarding salarié",
    "Un nouvel arrivant ne devrait pas dépendre de la disponibilité des mêmes collègues.",
    "Orchestrez documents, tâches, parcours et questions fréquentes selon le rôle, tout en gardant managers et RH responsables des validations.",
    [
      ["sequence", "Parcours d’arrivée", "J-7 → J+30", "Orchestrer les étapes sans oublier les dépendances."],
      ["rag", "Assistant onboarding", "Réponses sourcées", "Répondre depuis les procédures autorisées."],
      ["control", "Checklist RH", "Étapes manquantes", "Voir ce qui bloque l’arrivée."],
      ["dashboard", "Suivi des cohortes", "Avancement visible", "Piloter plusieurs intégrations sans tableur."]
    ],
    ["Checklist par profil", "Assistant documentaire", "Notifications et tâches", "Suivi manager/RH"]
  ),
  problem(
    "analyser-comparer-cv-ia", 2, "RH",
    "Analyser et comparer des CV avec l’IA",
    "Comparer les preuves du CV au besoin du poste, sans déléguer la décision de recrutement.",
    "Structurez compétences, expérience et écarts par rapport à des critères explicites, puis préparez les questions à vérifier en entretien.",
    [
      ["compare", "CV vs critères", "Écarts visibles", "Comparer sur les mêmes dimensions."],
      ["score", "Pondération du poste", "Score explicable", "Voir l’effet de chaque critère sur le classement."],
      ["control", "Points à vérifier", "Alertes de preuve", "Distinguer présence d’un mot et expérience démontrée."],
      ["builder", "Questions d’entretien", "Questions ciblées", "Transformer les écarts en vérifications humaines."]
    ],
    ["Extraction structurée des CV", "Critères configurables", "Comparaison explicable", "Questions d’entretien et validation RH"]
  ),
  problem(
    "assistant-rh-interne-ia", 3, "RH",
    "Assistant RH interne",
    "Les mêmes questions RH ne devraient pas interrompre l’équipe toute la journée.",
    "Créez un assistant interne qui répond depuis vos procédures, accords et documents validés, cite ses sources et escalade les cas sensibles.",
    [
      ["rag", "Question salarié", "Réponse + source", "Répondre depuis le corpus RH autorisé."],
      ["router", "Escalade", "Bon interlocuteur", "Détecter les sujets qui nécessitent un humain."],
      ["control", "Règles sensibles", "Réponse à valider", "Appliquer des garde-fous par catégorie."],
      ["dashboard", "Questions récurrentes", "Top irritants", "Voir ce qu’il faut clarifier dans la documentation."]
    ],
    ["Corpus et droits", "RAG avec citations", "Escalade par règle", "Analytics des questions"]
  ),
  problem(
    "rapprochement-factures-paiements-ia", 2, "Finance",
    "Rapprochement facture / paiement par IA",
    "Faites remonter les exceptions plutôt que de rechercher chaque correspondance.",
    "Proposez les correspondances entre factures et transactions à partir du montant, de la date, du libellé et de l’historique.",
    [
      ["extract", "Flux factures", "Références structurées", "Normaliser les informations avant rapprochement."],
      ["compare", "Matching paiement", "Correspondances proposées", "Comparer montant, date et libellé."],
      ["control", "Confiance & exception", "Cas incertains isolés", "Ne pas forcer un rapprochement douteux."],
      ["dashboard", "État du rapprochement", "Reste à traiter", "Voir les exceptions et volumes."]
    ],
    ["Import banque/factures", "Moteur de matching", "Score de confiance", "Validation et export comptable"]
  ),
  problem(
    "generer-decliner-contenus-marketing-ia", 2, "Marketing",
    "Générer et décliner des contenus marketing avec l’IA",
    "Un contenu source peut devenir plusieurs formats sans diluer votre marque.",
    "Transformez brief, sources et charte en drafts adaptés aux canaux, puis contrôlez ton, claims et informations sensibles avant publication.",
    [
      ["builder", "Studio multicanal", "4 formats", "Décliner article, post, email ou landing."],
      ["rag", "Sources autorisées", "Contenu ancré", "Générer depuis les informations validées."],
      ["control", "Brand guard", "Claims signalés", "Vérifier ton et assertions sensibles."],
      ["dashboard", "Pipeline éditorial", "Statuts visibles", "Piloter production et validation."]
    ],
    ["Brief et sources", "Génération multicanal", "Règles de marque", "Workflow de validation/publication"]
  ),
  problem(
    "planning-editorial-automatise", 3, "Marketing",
    "Planning éditorial automatisé",
    "Passez d’une liste d’idées à un calendrier réellement pilotable.",
    "Priorisez thèmes, canaux, formats et dates selon votre capacité, vos campagnes et vos signaux SEO/GEO.",
    [
      ["sequence", "Calendrier 4 semaines", "Créneaux proposés", "Répartir la charge dans le temps."],
      ["score", "Priorisation des sujets", "Backlog classé", "Pondérer demande, valeur et effort."],
      ["builder", "Brief de production", "Brief prêt", "Transformer le sujet retenu en consigne exploitable."],
      ["dashboard", "Capacité éditoriale", "Charge visible", "Éviter un calendrier impossible à produire."]
    ],
    ["Backlog unifié", "Scoring des sujets", "Calendrier", "Briefs et suivi de production"]
  ),
  problem(
    "audit-seo-geo-ia", 2, "Marketing",
    "Audit SEO / GEO assisté par IA",
    "Mesurez ce qui bloque Google et les moteurs de réponse IA sur les mêmes pages.",
    "Croisez structure technique, contenu, données structurées et présence dans les réponses IA pour produire un backlog priorisé.",
    [
      ["seo", "Scan d’URL", "Piliers évalués", "Voir les problèmes techniques et éditoriaux."],
      ["score", "Priorisation", "Impact / effort", "Classer les corrections plutôt que produire une liste brute."],
      ["compare", "Page vs intention", "Écarts visibles", "Comparer ce que la page couvre à la demande."],
      ["dashboard", "Suivi SEO/GEO", "Backlog pilotable", "Mesurer l’avancement des corrections."]
    ],
    ["Crawl et checks techniques", "Analyse contenu/schema", "Tests de visibilité IA configurés", "Backlog priorisé"]
  ),
  problem(
    "reserves-chantier-ia", 2, "Construction",
    "Gestion et contrôle des réserves chantier",
    "Une réserve doit rester reliée à son lot, sa preuve et sa relance jusqu’à sa levée.",
    "Structurez photos, localisation, gravité, entreprise responsable et statut dans une file de suivi exploitable par la MOE.",
    [
      ["site", "Réserve terrain", "Lot + statut", "Rattacher la réserve au bon contexte."],
      ["router", "Affectation entreprise", "Responsable proposé", "Diriger vers le bon intervenant."],
      ["sequence", "Relances de levée", "Échéances visibles", "Suivre sans reconstruire une liste manuelle."],
      ["control", "Preuve avant levée", "Avant / après", "Garder la décision de levée côté humain."]
    ],
    ["Capture terrain", "Affectation lot/entreprise", "Relances et preuves", "PV et historique de levée"]
  ),
  problem(
    "pre-instruction-documentaire-ia", 3, "Administratif",
    "Assistant de pré-instruction documentaire",
    "Préparez le dossier avant que l’instructeur n’ait à le lire en entier.",
    "Identifiez pièces, champs, règles de complétude et points d’incertitude afin de présenter une file claire à l’agent ou au gestionnaire.",
    [
      ["control", "Complétude", "Pièces présentes", "Vérifier le dossier par rapport au référentiel."],
      ["extract", "Lecture documentaire", "Champs structurés", "Faire ressortir les informations utiles à l’instruction."],
      ["score", "Niveau de confiance", "Dossier à relire", "Prioriser les cas ambigus."],
      ["builder", "Projet de courrier", "Brouillon à valider", "Préparer la demande de pièce ou la réponse."]
    ],
    ["Référentiel de règles", "Extraction et complétude", "Score de confiance", "Projet de courrier avec validation"]
  ),
  problem(
    "gestion-stocks-ia", 3, "Industrie",
    "Gestion intelligente des stocks",
    "Voir la rupture avant de la constater en rayon ou en production.",
    "Croisez stock, rythme de sortie, délais et seuils pour faire remonter les références à risque et préparer une proposition de commande.",
    [
      ["stock", "Projection de stock", "Risque rupture", "Projeter la couverture à partir des hypothèses."],
      ["score", "Priorité SKU", "Références classées", "Trier les cas par impact et urgence."],
      ["compare", "Scénarios commande", "Options comparées", "Comparer quantité, délai et stock de sécurité."],
      ["dashboard", "Vue approvisionnement", "Alertes consolidées", "Piloter exceptions et surstocks."]
    ],
    ["Connexion stocks/ventes", "Règles de couverture", "Prévision et alertes", "Proposition de commande à valider"]
  ),
  problem(
    "maintenance-predictive-assistant-ia", 3, "Industrie",
    "Maintenance prédictive / assistant maintenance",
    "Commencez par détecter les dérives et expliquer le contexte avant de promettre de prédire une panne.",
    "Combinez capteurs disponibles, historiques d’incident et documentation pour signaler les anomalies, proposer les contrôles et capitaliser les interventions.",
    [
      ["maintenance", "Capteurs simulés", "Dérive détectée", "Voir comment un seuil ou modèle remonte une anomalie."],
      ["rag", "Procédure maintenance", "Source retrouvée", "Relier l’alerte à la documentation pertinente."],
      ["dashboard", "Historique équipement", "Incidents consolidés", "Mettre les événements dans leur contexte."],
      ["control", "Checklist technicien", "Contrôles proposés", "Garder le diagnostic et l’intervention côté technicien."]
    ],
    ["Audit des données disponibles", "Détection d’anomalies", "Assistant documentaire maintenance", "GMAO / workflow d’intervention"]
  )
];

export function getProblemSolution(slug) {
  return problemSolutions.find((item) => item.slug === slug) || null;
}

export function getProblemParams() {
  return problemSolutions.map(({ slug }) => ({ slug }));
}

export function getProblemFaq(item) {
  if (!item) return [];
  return [
    {
      question: "Peut-on intégrer cette solution à nos outils actuels ?",
      answer: "Oui, lorsque les outils disposent des accès nécessaires. Le cadrage commence par vos flux, vos droits et les points de validation à conserver."
    },
    {
      question: "L’IA agit-elle sans validation humaine ?",
      answer: "Pas par défaut. Les actions sensibles peuvent rester au stade de proposition, avec une validation explicite avant écriture, envoi ou décision."
    },
    {
      question: "Quelles données faut-il pour " + item.title.toLowerCase() + " ?",
      answer: "Le besoin dépend du flux. Un prototype peut commencer sur un jeu limité de documents ou d’exemples fictifs, puis être testé sur des données autorisées avant extension."
    }
  ];
}
