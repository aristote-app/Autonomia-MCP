export const problemSalesCopy = {
  "automatiser-comptes-rendus-reunion": {
    trigger: "Vous avez des notes ou une transcription, mais le travail commence encore après la réunion.",
    inputs: ["Notes ou transcription", "Participants et rôles", "Modèle de compte rendu", "Règles de diffusion"],
    outputs: ["Décisions séparées des discussions", "Actions + responsables + dates", "Compte rendu à relire", "Relances et suivi"],
    systems: ["Teams / Meet / Zoom", "Outlook / Gmail", "Drive / SharePoint / Notion", "Jira / Asana / Monday"],
    human: "Un participant ou responsable valide le compte rendu et les engagements avant diffusion."
  },
  "assistant-documentaire-ia-rag": {
    trigger: "L’information existe déjà, mais elle est répartie entre procédures, contrats, dossiers et documents internes.",
    inputs: ["PDF et procédures", "Contrats et guides", "Dossiers métiers", "Règles de droits d’accès"],
    outputs: ["Réponse en langage naturel", "Passages sources cités", "Niveau de confiance / couverture", "Escalade si la source manque"],
    systems: ["Drive / SharePoint", "Confluence / Notion", "GED interne", "Portail ou application métier"],
    human: "Les réponses sensibles restent vérifiables par leurs sources et peuvent exiger une validation métier."
  },
  "qualification-automatique-leads": {
    trigger: "Tous les leads arrivent dans la même file alors que leur adéquation et leur urgence sont très différentes.",
    inputs: ["Formulaire entrant", "Données CRM", "Critères ICP / offre", "Signaux disponibles"],
    outputs: ["Fiche enrichie", "Score explicable", "Priorité / routage", "Prochaine action proposée"],
    systems: ["HubSpot / Salesforce / Pipedrive", "Formulaires site", "E-mail", "Outils d’enrichissement autorisés"],
    human: "Le scoring prépare la priorité ; l’équipe commerciale garde la décision de contact et de qualification."
  },
  "trier-router-emails-ia": {
    trigger: "Une boîte partagée mélange demandes urgentes, pièces jointes, questions simples et dossiers à transférer.",
    inputs: ["E-mails entrants", "Pièces jointes", "Règles de priorité", "Référentiel de routage"],
    outputs: ["Catégorie et urgence", "Données extraites", "Service destinataire", "Brouillon ou tâche proposée"],
    systems: ["Gmail / Outlook", "CRM", "Ticketing", "GED / outil métier"],
    human: "Les cas ambigus ou sensibles restent dans une file de contrôle avant envoi ou affectation définitive."
  },
  "extraction-donnees-documents": {
    trigger: "Des informations structurées sont encore ressaisies à partir de PDF, formulaires ou documents reçus.",
    inputs: ["PDF et formulaires", "Documents bureautiques", "Schéma de champs attendu", "Règles de validation"],
    outputs: ["Champs structurés", "Confiance par donnée", "Anomalies / champs manquants", "Export exploitable"],
    systems: ["GED", "ERP / CRM", "Tableurs", "API / base de données"],
    human: "Les champs à faible confiance ou incohérents sont soumis à validation avant injection."
  },
  "controler-dossiers-automatiquement": {
    trigger: "L’équipe ouvre chaque dossier entièrement pour découvrir ensuite qu’une pièce ou une information manque.",
    inputs: ["Dossier et pièces", "Checklist attendue", "Règles de cohérence", "Référentiel métier"],
    outputs: ["Taux de complétude", "Pièces manquantes", "Incohérences détectées", "Relance préparée"],
    systems: ["GED / Drive", "Portail de dépôt", "CRM / outil métier", "E-mail"],
    human: "Le moteur pré-contrôle ; l’acceptation, le rejet ou l’instruction restent du ressort de la personne habilitée."
  },
  "automatiser-reporting": {
    trigger: "Chaque période recommence par la collecte des mêmes fichiers, les mêmes rapprochements et le même commentaire.",
    inputs: ["ERP / CRM", "Tableurs", "Exports BI", "Règles de calcul"],
    outputs: ["Données consolidées", "Anomalies et ruptures", "KPI préparés", "Commentaire factuel à relire"],
    systems: ["Excel / Sheets", "ERP / CRM", "Power BI / Looker", "E-mail / Teams"],
    human: "Les chiffres restent traçables et les explications non démontrées sont présentées comme hypothèses à investiguer."
  },
  "controle-factures-ia": {
    trigger: "La lecture de la facture et les premiers contrôles consomment du temps avant même la validation comptable.",
    inputs: ["Facture", "Bon de commande", "Contrat / référentiel", "Règles comptables internes"],
    outputs: ["Champs et lignes extraits", "Écarts signalés", "Rapprochements proposés", "Circuit de validation"],
    systems: ["ERP comptable", "GED", "E-mail fournisseur", "Workflow d’approbation"],
    human: "Le système prépare le contrôle ; la validation comptable et le paiement restent soumis aux droits existants."
  },
  "reponse-appel-offres-ia": {
    trigger: "Le temps part dans la lecture du DCE, la recherche de preuves et la reconstruction d’une trame à chaque consultation.",
    inputs: ["RC / CCTP / CCAP", "Bibliothèque de réponses", "Références autorisées", "Documents de preuve"],
    outputs: ["Exigences et échéances", "Matrice exigences / preuves", "Contenus réutilisables retrouvés", "Trame de mémoire"],
    systems: ["Drive / SharePoint", "GED", "Bibliothèque interne", "Outil de suivi AO"],
    human: "Aucune référence, certification ou capacité absente n’est inventée ; la réponse finale reste relue et validée."
  },
  "automatiser-saisie-crm": {
    trigger: "Les informations du rendez-vous existent dans les notes et les e-mails, mais le CRM est complété plus tard ou partiellement.",
    inputs: ["Notes de rendez-vous", "E-mails", "Champs CRM attendus", "Historique du compte"],
    outputs: ["Résumé de l’échange", "Champs proposés", "Next steps", "Rappels / tâches"],
    systems: ["HubSpot / Salesforce / Pipedrive", "Outlook / Gmail", "Agenda", "Visio / prise de notes"],
    human: "Le commercial voit les changements proposés et valide les écritures avant mise à jour des champs sensibles."
  },
  "relances-commerciales-ia": {
    trigger: "Les opportunités se refroidissent parce que la prochaine relance dépend encore d’un rappel manuel ou d’une séquence trop générique.",
    inputs: ["Stade du deal", "Derniers échanges", "Historique CRM", "Règles de relance"],
    outputs: ["Relance proposée", "Canal recommandé", "Timing contextualisé", "Cas à mettre en pause"],
    systems: ["HubSpot / Salesforce / Pipedrive", "Outlook / Gmail", "Agenda", "Outils de séquence"],
    human: "L’équipe commerciale garde le contrôle du message, du canal et de l’envoi."
  },
  "preparation-rendez-vous-commercial-ia": {
    trigger: "Avant un rendez-vous, les informations utiles sont dispersées entre CRM, e-mails, notes et signaux récents.",
    inputs: ["Historique CRM", "E-mails", "Notes de rendez-vous", "Sources externes autorisées"],
    outputs: ["Brief compte", "Enjeux et signaux", "Questions à poser", "Points de vigilance"],
    systems: ["CRM", "Messagerie", "Agenda", "Sources de veille autorisées"],
    human: "Le brief prépare l’échange ; le commercial décide des hypothèses et questions réellement pertinentes."
  },
  "synthese-comex-ia": {
    trigger: "Les comités reçoivent trop d’informations et passent du temps à retrouver les écarts réellement décisionnels.",
    inputs: ["KPI", "Commentaires métiers", "Plans d’action", "Seuils de matérialité"],
    outputs: ["Synthèse exécutive", "Écarts majeurs", "Décisions attendues", "Questions ouvertes"],
    systems: ["Power BI / Looker", "Excel / Sheets", "ERP / CRM", "PowerPoint / Docs"],
    human: "Les faits et hypothèses restent distingués ; les arbitrages appartiennent au comité."
  },
  "veille-concurrentielle-ia": {
    trigger: "La veille accumule des liens alors que la valeur vient des changements détectés et des signaux réellement importants.",
    inputs: ["Sites concurrents", "Pages offres", "Sources presse", "Critères de signal"],
    outputs: ["Changements détectés", "Score d’importance", "Comparatif avant/après", "Brief d’impact"],
    systems: ["Sites web", "Flux RSS", "Newsletters", "CRM / outil de veille"],
    human: "Le système signale et synthétise ; l’interprétation stratégique reste validée par l’équipe."
  },
  "assistant-service-client-ia": {
    trigger: "L’agent doit relire l’historique et rechercher la procédure avant même de pouvoir préparer une réponse.",
    inputs: ["Ticket entrant", "Historique client", "Base de connaissance", "Règles d’escalade"],
    outputs: ["Motif et priorité", "Réponse sourcée", "Résumé de contexte", "Escalade proposée"],
    systems: ["Zendesk / Freshdesk / Intercom", "CRM", "Base de connaissance", "E-mail / chat"],
    human: "Les cas sensibles, ambigus ou à fort impact restent soumis à l’agent avant réponse."
  },
  "controle-qualite-service-client-ia": {
    trigger: "Un échantillonnage aléatoire laisse passer des conversations à risque et mobilise du temps sur des cas sans enjeu.",
    inputs: ["Conversations", "Grille qualité", "Règles obligatoires", "Critères de risque"],
    outputs: ["Scores par dimension", "Cas prioritaires", "Motifs récurrents", "Points de coaching"],
    systems: ["Ticketing", "Téléphonie", "CRM", "Outil qualité"],
    human: "Le score sert à prioriser la relecture, pas à sanctionner automatiquement un collaborateur."
  },
  "onboarding-salarie-ia": {
    trigger: "Chaque arrivée recrée la même coordination entre RH, manager, IT, documents et questions récurrentes.",
    inputs: ["Profil du salarié", "Checklist d’arrivée", "Documents RH", "Règles par rôle"],
    outputs: ["Parcours J-7 à J+30", "Tâches assignées", "Réponses sourcées", "Alertes de blocage"],
    systems: ["SIRH", "Teams / Slack", "Drive / SharePoint", "Ticketing IT"],
    human: "RH et manager valident les étapes sensibles et gardent la responsabilité de l’intégration."
  },
  "analyser-comparer-cv-ia": {
    trigger: "La comparaison devient incohérente quand chaque CV est lu différemment ou quand les mots-clés remplacent les preuves d’expérience.",
    inputs: ["CV", "Fiche de poste", "Critères obligatoires", "Pondérations explicites"],
    outputs: ["Compétences structurées", "Écarts au besoin", "Éléments de preuve", "Questions d’entretien"],
    systems: ["ATS", "SIRH", "Dossier candidat", "Fiche de poste"],
    human: "L’outil structure et compare ; il ne prend pas la décision de recrutement."
  },
  "assistant-rh-interne-ia": {
    trigger: "Les mêmes questions sur congés, procédures ou avantages interrompent l’équipe RH tout au long de la journée.",
    inputs: ["Accords", "Procédures RH", "FAQ internes", "Droits d’accès"],
    outputs: ["Réponse sourcée", "Document de référence", "Escalade RH", "Questions récurrentes"],
    systems: ["SharePoint / Drive", "SIRH", "Teams / Slack", "Portail collaborateur"],
    human: "Les situations individuelles ou sensibles sont redirigées vers la personne RH compétente."
  },
  "rapprochement-factures-paiements-ia": {
    trigger: "Le temps se perd à rechercher manuellement quelle transaction correspond à quelle facture et pourquoi certaines restent ouvertes.",
    inputs: ["Factures", "Transactions bancaires", "Dates et montants", "Références comptables"],
    outputs: ["Correspondances proposées", "Score de confiance", "Exceptions", "Reste à rapprocher"],
    systems: ["ERP comptable", "Banque / exports", "GED", "Outil de trésorerie"],
    human: "Les rapprochements incertains restent en attente de validation comptable."
  },
  "generer-decliner-contenus-marketing-ia": {
    trigger: "Une campagne est validée une fois, puis chaque canal exige encore une nouvelle adaptation manuelle.",
    inputs: ["Brief campagne", "Sources validées", "Charte éditoriale", "Formats attendus"],
    outputs: ["Déclinaisons multicanales", "Variantes de messages", "Claims signalés", "Workflow de validation"],
    systems: ["CMS", "HubSpot / Brevo", "LinkedIn", "Outils social media"],
    human: "L’équipe marketing valide le ton, les claims, les visuels et la publication."
  },
  "planning-editorial-automatise": {
    trigger: "Le backlog éditorial grossit sans lien clair entre demande, priorité, capacité et calendrier.",
    inputs: ["Backlog sujets", "Calendrier campagne", "Capacité équipe", "Signaux SEO/GEO"],
    outputs: ["Priorités", "Calendrier proposé", "Briefs", "Charge visible"],
    systems: ["Notion / Airtable", "CMS", "Search Console", "Outil social media"],
    human: "Le planning est une proposition opérationnelle qui reste arbitrée par l’équipe."
  },
  "audit-seo-geo-ia": {
    trigger: "Les audits séparent encore technique, contenu, schema et visibilité dans les moteurs de réponse alors qu’ils doivent être priorisés ensemble.",
    inputs: ["URLs", "Données Search Console", "Contenus", "Schema et signaux GEO"],
    outputs: ["Diagnostic par page", "Écarts à l’intention", "Backlog impact/effort", "Suivi des corrections"],
    systems: ["Search Console", "CMS", "Crawler", "Analytics"],
    human: "Les recommandations sont priorisées et validées avant modification du site."
  },
  "reserves-chantier-ia": {
    trigger: "Les réserves vivent entre photos, comptes rendus, e-mails et tableaux jusqu’à ce qu’une relance ou une preuve se perde.",
    inputs: ["Photo", "Lot / localisation", "Entreprise", "Échéance"],
    outputs: ["Réserve structurée", "Affectation", "Relance", "Historique de preuve"],
    systems: ["GED / Drive", "E-mail", "Outil chantier", "Tableau de suivi"],
    human: "La levée de réserve et l’acceptation de la preuve restent décidées par la personne habilitée."
  },
  "pre-instruction-documentaire-ia": {
    trigger: "L’instructeur passe encore du temps à identifier les pièces et à reconstruire la complétude avant de commencer l’analyse métier.",
    inputs: ["Dossier", "Référentiel de pièces", "Règles de complétude", "Courriers types"],
    outputs: ["Pièces reconnues", "Champs utiles", "Niveau de complétude", "Projet de courrier"],
    systems: ["Portail usager", "GED", "Outil métier", "Messagerie"],
    human: "L’outil prépare le dossier ; l’instruction et la décision restent entièrement humaines."
  },
  "gestion-stocks-ia": {
    trigger: "Les ruptures et surstocks apparaissent trop tard quand les seuils ne tiennent pas compte du rythme réel de sortie et des délais.",
    inputs: ["Stocks", "Ventes / consommations", "Délais fournisseurs", "Seuils métier"],
    outputs: ["Couverture projetée", "Risque de rupture", "Priorité SKU", "Commande proposée"],
    systems: ["ERP", "WMS", "POS", "Outil achats"],
    human: "L’acheteur ou responsable approvisionnement valide toute commande et toute modification de seuil."
  },
  "maintenance-predictive-assistant-ia": {
    trigger: "Les signaux faibles restent noyés dans les capteurs et historiques alors que le technicien a surtout besoin d’un contexte exploitable.",
    inputs: ["Capteurs", "Historique incidents", "Ordres de travail", "Documentation technique"],
    outputs: ["Dérives détectées", "Contexte équipement", "Procédures retrouvées", "Contrôles proposés"],
    systems: ["GMAO", "IoT / SCADA", "GED technique", "Historique maintenance"],
    human: "Le diagnostic et l’intervention restent au technicien ; le système prépare la priorité et les éléments utiles."
  }
};

export function getProblemSalesCopy(slug) {
  return problemSalesCopy[slug] || null;
}
