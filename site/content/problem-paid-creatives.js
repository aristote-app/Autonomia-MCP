// Curated Responsive Search Ad assets for Priority 1 problem landing pages.
// Character limits follow current Google Ads responsive search ad fields:
// headline <= 30 chars, description <= 90 chars, path <= 15 chars.

const creative = (headlines, descriptions, path1, path2) => ({
  headlines,
  descriptions,
  path1,
  path2
});

export const problemPaidCreatives = {
  "automatiser-comptes-rendus-reunion": creative(
    [
      "Automatisez vos comptes rendus",
      "Réunion → décisions → actions",
      "Compte rendu IA à valider",
      "Suivez les actions de réunion",
      "Testez le flux Autonomia",
      "IA pour vos comptes rendus"
    ],
    [
      "Transformez notes ou transcription en décisions, actions et échéances à valider.",
      "Testez la micro-app puis adaptez le workflow à vos outils et règles internes."
    ],
    "reunion",
    "compte-rendu"
  ),
  "assistant-documentaire-ia-rag": creative(
    [
      "Assistant documentaire IA",
      "RAG interne avec sources",
      "Réponses citées et contrôlées",
      "Interrogez vos documents",
      "Testez le flux documentaire",
      "RAG pour vos équipes métier"
    ],
    [
      "Interrogez vos documents internes et obtenez une réponse reliée aux passages sources.",
      "Testez la démo puis cadrez corpus, droits d’accès, citations et validation métier."
    ],
    "documents",
    "assistant-ia"
  ),
  "qualification-automatique-leads": creative(
    [
      "Qualification de leads par IA",
      "Scorez et routez vos leads",
      "Priorisez les bons prospects",
      "Scoring commercial explicable",
      "Testez le scoring Autonomia",
      "IA pour qualifier vos leads"
    ],
    [
      "Enrichissez, scorez et routez vos leads selon vos critères avant la première action.",
      "Testez la démo puis reliez le scoring à votre CRM, vos règles et votre équipe."
    ],
    "leads",
    "scoring-ia"
  ),
  "trier-router-emails-ia": creative(
    [
      "Automatisez le tri des e-mails",
      "Classez, priorisez, routez",
      "Boîte partagée → workflow",
      "IA pour vos e-mails entrants",
      "Testez le routage Autonomia",
      "E-mails vers le bon processus"
    ],
    [
      "Classez les e-mails, détectez l’urgence et routez chaque demande vers le bon flux.",
      "Testez la micro-app puis connectez Gmail, Outlook, CRM ou ticketing selon vos règles."
    ],
    "emails",
    "routage-ia"
  ),
  "extraction-donnees-documents": creative(
    [
      "Extraction de données par IA",
      "PDF → données structurées",
      "Contrôlez avant intégration",
      "IA pour extraire vos documents",
      "Testez l’extraction Autonomia",
      "Documents vers vos outils"
    ],
    [
      "Transformez PDF, formulaires ou contrats en champs structurés et contrôlables.",
      "Testez la démo puis exportez les données vers ERP, CRM, GED, CSV ou API."
    ],
    "documents",
    "extraction-ia"
  ),
  "controler-dossiers-automatiquement": creative(
    [
      "Contrôlez vos dossiers par IA",
      "Détectez les pièces manquantes",
      "Pré-contrôle documentaire IA",
      "Isolez les dossiers à vérifier",
      "Testez les règles de contrôle",
      "Dossiers complets, cas à voir"
    ],
    [
      "Pré-contrôlez pièces et cohérences pour concentrer l’humain sur les exceptions.",
      "Testez la démo puis branchez vos règles, votre GED et vos circuits de validation."
    ],
    "dossiers",
    "controle-ia"
  ),
  "automatiser-reporting": creative(
    [
      "Automatisez votre reporting",
      "KPI consolidés par IA",
      "Repérez les écarts utiles",
      "Préparez le commentaire KPI",
      "Testez le reporting Autonomia",
      "Automatisez vos reportings"
    ],
    [
      "Collectez, contrôlez et consolidez vos KPI avant de préparer un commentaire factuel.",
      "Testez la démo puis connectez ERP, CRM, tableurs et BI à votre workflow."
    ],
    "reporting",
    "kpi-ia"
  ),
  "controle-factures-ia": creative(
    [
      "Contrôlez vos factures par IA",
      "Facture → contrôles métier",
      "Repérez les écarts à valider",
      "IA pour factures fournisseurs",
      "Testez le workflow facture",
      "Rapprochez avant validation"
    ],
    [
      "Extrayez les lignes et comparez factures, commandes ou référentiels avant validation.",
      "Testez la démo puis adaptez les règles à votre ERP et à vos circuits comptables."
    ],
    "factures",
    "controle-ia"
  ),
  "reponse-appel-offres-ia": creative(
    [
      "Répondez aux appels d’offres",
      "Analyse DCE assistée par IA",
      "Exigences, preuves, trame",
      "Préparez votre mémoire AO",
      "Testez le copilote AO",
      "IA pour analyser votre DCE"
    ],
    [
      "Transformez le DCE en exigences, preuves, échéances et trame à relire avant dépôt.",
      "Testez la démo puis reliez vos contenus validés, références et documents de preuve."
    ],
    "appels-offres",
    "analyse-dce"
  ),
  "automatiser-saisie-crm": creative(
    [
      "Automatisez la saisie CRM",
      "Notes → champs CRM proposés",
      "CRM à jour après rendez-vous",
      "Préparez les next steps CRM",
      "Testez le workflow CRM",
      "IA pour votre hygiène CRM"
    ],
    [
      "Transformez notes, e-mails et rendez-vous en champs CRM et prochaines actions proposés.",
      "Testez la démo puis reliez le workflow à HubSpot, Salesforce ou Pipedrive."
    ],
    "crm",
    "saisie-ia"
  )
};

export function getProblemPaidCreative(slug) {
  return problemPaidCreatives[slug] || null;
}
