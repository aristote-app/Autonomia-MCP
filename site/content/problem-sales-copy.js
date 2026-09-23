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
  }
};

export function getProblemSalesCopy(slug) {
  return problemSalesCopy[slug] || null;
}
