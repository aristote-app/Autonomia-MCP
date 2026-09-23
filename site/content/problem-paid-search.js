// Internal paid-search planning registry for precise problem landing pages.
// Scores are prioritization heuristics (1-5), not Google Ads search-volume estimates.

const entry = (cluster, primaryKeyword, secondaryKeywords, negativeKeywords, adAngle, scores) => ({
  cluster,
  primaryKeyword,
  secondaryKeywords,
  negativeKeywords,
  adAngle,
  scores,
  priorityScore: Object.values(scores).reduce((sum, value) => sum + value, 0)
});

export const problemPaidSearch = {
  "automatiser-comptes-rendus-reunion": entry(
    "Réunion",
    "automatiser compte rendu réunion ia",
    ["compte rendu réunion automatique ia","ia transcription réunion actions","résumé réunion ia décisions actions"],
    ["gratuit","modèle word","exemple","emploi","cours"],
    "Passer du verbatim aux décisions, responsables et échéances à valider.",
    { pain:5, demo:5, economicValue:4, paidIntent:5, deliverability:5 }
  ),
  "assistant-documentaire-ia-rag": entry(
    "Documents & RAG",
    "assistant documentaire ia entreprise",
    ["rag entreprise","chatbot documents internes","assistant ia base documentaire","recherche documentaire ia"],
    ["gratuit","tutoriel","github","cours","définition"],
    "Retrouver une réponse dans les documents internes avec citations et droits d’accès.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "qualification-automatique-leads": entry(
    "Commercial",
    "qualification leads ia",
    ["lead scoring ia","automatiser qualification prospects","agent ia qualification leads","scoring prospects crm"],
    ["emploi","formation","définition","gratuit"],
    "Prioriser, enrichir et router chaque lead avant la première action commerciale.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "trier-router-emails-ia": entry(
    "Administratif",
    "automatiser tri emails ia",
    ["router emails automatiquement","classification email ia","traitement automatique mails entreprise","ia boite mail partagée"],
    ["gmail filtre gratuit","astuce outlook","formation","emploi"],
    "Transformer la boîte générique en file de traitement qualifiée et routée.",
    { pain:5, demo:5, economicValue:4, paidIntent:5, deliverability:5 }
  ),
  "extraction-donnees-documents": entry(
    "Documents & RAG",
    "extraction données documents ia",
    ["extraire données pdf ia","intelligent document processing ia","ocr ia facture document","automatiser saisie pdf"],
    ["gratuit","convertisseur pdf","tutoriel","emploi"],
    "Passer de PDF, formulaires et contrats à des champs structurés et contrôlables.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "controler-dossiers-automatiquement": entry(
    "Administratif",
    "contrôle dossier automatique ia",
    ["vérifier complétude dossier ia","contrôle pièces justificatives ia","automatiser contrôle documentaire","ia dossier incomplet"],
    ["gratuit","modèle","emploi","cours"],
    "Pré-contrôler pièces et cohérences pour concentrer l’humain sur les exceptions.",
    { pain:5, demo:5, economicValue:5, paidIntent:4, deliverability:5 }
  ),
  "automatiser-reporting": entry(
    "Reporting",
    "automatiser reporting ia",
    ["reporting automatique ia","génération rapport automatique","ia tableau de bord reporting","automatiser commentaire kpi"],
    ["template","gratuit","excel formule","cours"],
    "Collecter, contrôler, consolider et commenter les KPI avant validation.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "controle-factures-ia": entry(
    "Finance",
    "contrôle facture ia",
    ["automatiser contrôle factures","ia traitement factures fournisseurs","vérification facture automatique","rapprochement facture commande ia"],
    ["modèle facture","gratuit","faire une facture","formation"],
    "Extraire et comparer les factures aux règles, commandes ou référentiels.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "reponse-appel-offres-ia": entry(
    "Documents & RAG",
    "ia réponse appel offres",
    ["automatiser réponse appel offres","ia analyse dce","assistant mémoire technique ia","analyse appel offres intelligence artificielle"],
    ["modèle gratuit","emploi","formation seule","marché public résultat"],
    "Transformer le DCE en exigences, preuves et trame de réponse contrôlable.",
    { pain:5, demo:5, economicValue:5, paidIntent:4, deliverability:5 }
  ),
  "automatiser-saisie-crm": entry(
    "Commercial",
    "automatiser saisie crm ia",
    ["mise à jour crm automatique ia","remplir crm automatiquement","notes réunion vers crm","ia crm saisie commerciale"],
    ["crm gratuit","tutoriel","emploi","formation"],
    "Faire remonter notes et échanges vers des champs CRM proposés puis validés.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "relances-commerciales-ia": entry(
    "Commercial",
    "automatiser relances commerciales ia",
    ["relance prospect automatique ia","séquence commerciale ia","automatisation follow up commercial","ia relance crm"],
    ["modèle email","gratuit","emploi","formation"],
    "Choisir timing, canal et message de relance à partir du contexte du deal.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "preparation-rendez-vous-commercial-ia": entry(
    "Commercial",
    "préparer rendez vous commercial ia",
    ["brief commercial automatique","ia préparation rendez vous client","résumé compte crm avant rendez vous","sales meeting prep ai"],
    ["conseils entretien","emploi","formation","gratuit"],
    "Assembler automatiquement le contexte compte, les signaux et les questions à poser.",
    { pain:4, demo:5, economicValue:5, paidIntent:4, deliverability:5 }
  ),
  "synthese-comex-ia": entry(
    "Reporting",
    "synthèse comex ia",
    ["automatiser synthèse comex","ia synthèse comité direction","executive summary ia entreprise","commentaire kpi comex"],
    ["modèle ppt","gratuit","emploi","formation"],
    "Faire remonter écarts, faits, arbitrages et questions ouvertes dans une vue exécutive.",
    { pain:4, demo:5, economicValue:5, paidIntent:3, deliverability:5 }
  ),
  "veille-concurrentielle-ia": entry(
    "Marketing",
    "veille concurrentielle ia",
    ["automatiser veille concurrentielle","agent ia veille concurrence","surveillance concurrents ia","détection changements concurrents"],
    ["gratuit","outil gratuit","cours","emploi"],
    "Détecter les changements importants plutôt qu’accumuler des liens.",
    { pain:4, demo:5, economicValue:4, paidIntent:4, deliverability:5 }
  ),
  "assistant-service-client-ia": entry(
    "Support",
    "assistant ia service client",
    ["ia support client entreprise","copilote service client","assistant ia base connaissance support","ia ticketing réponse client"],
    ["chatbot gratuit","emploi","formation","particulier"],
    "Donner à l’agent le contexte, la procédure et un brouillon sourcé avant réponse.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:5 }
  ),
  "controle-qualite-service-client-ia": entry(
    "Support",
    "contrôle qualité service client ia",
    ["quality monitoring ia support","analyse qualité conversations clients ia","score qualité tickets ia","ia contrôle réponses clients"],
    ["emploi","formation","grille excel","gratuit"],
    "Prioriser la relecture des conversations à risque selon une grille explicite.",
    { pain:4, demo:5, economicValue:4, paidIntent:3, deliverability:5 }
  ),
  "onboarding-salarie-ia": entry(
    "RH",
    "automatiser onboarding salarié ia",
    ["onboarding rh automatisé","assistant ia onboarding collaborateur","workflow onboarding salarié","ia intégration nouveaux salariés"],
    ["modèle checklist","emploi","formation","gratuit"],
    "Orchestrer documents, tâches et questions de J-7 à J+30.",
    { pain:4, demo:5, economicValue:4, paidIntent:4, deliverability:5 }
  ),
  "analyser-comparer-cv-ia": entry(
    "RH",
    "analyse cv ia entreprise",
    ["comparer cv ia recrutement","ia matching cv fiche poste","outil ia présélection cv","score cv recrutement ia"],
    ["faire cv","cv gratuit","emploi","candidat","lettre motivation"],
    "Comparer des preuves du CV à des critères explicites sans déléguer la décision.",
    { pain:4, demo:5, economicValue:4, paidIntent:5, deliverability:4 }
  ),
  "assistant-rh-interne-ia": entry(
    "RH",
    "assistant rh ia interne",
    ["chatbot rh interne","assistant ia ressources humaines entreprise","rag rh procédures","ia faq salariés"],
    ["emploi rh","formation","gratuit","candidat"],
    "Répondre depuis accords et procédures validés avec source et escalade.",
    { pain:4, demo:5, economicValue:4, paidIntent:4, deliverability:5 }
  ),
  "rapprochement-factures-paiements-ia": entry(
    "Finance",
    "rapprochement facture paiement ia",
    ["rapprochement bancaire ia","automatiser rapprochement factures paiements","matching paiement facture automatique","ia comptabilité rapprochement"],
    ["gratuit","cours comptabilité","emploi","modèle excel"],
    "Proposer les correspondances et isoler les exceptions pour validation comptable.",
    { pain:5, demo:5, economicValue:5, paidIntent:4, deliverability:5 }
  ),
  "generer-decliner-contenus-marketing-ia": entry(
    "Marketing",
    "génération contenu marketing ia entreprise",
    ["décliner contenu ia","automatiser contenu marketing ia","ia contenu multicanal","agent ia marketing contenu"],
    ["gratuit","prompt gratuit","cours","emploi"],
    "Transformer un brief validé en déclinaisons multicanales avec brand guard.",
    { pain:4, demo:5, economicValue:4, paidIntent:5, deliverability:5 }
  ),
  "planning-editorial-automatise": entry(
    "Marketing",
    "planning éditorial ia",
    ["calendrier éditorial automatique ia","automatiser planning contenu","ia calendrier contenu marketing","priorisation contenu ia"],
    ["template gratuit","notion template","emploi","formation"],
    "Relier backlog, capacité, campagnes et demande à un calendrier produisible.",
    { pain:3, demo:5, economicValue:3, paidIntent:3, deliverability:5 }
  ),
  "audit-seo-geo-ia": entry(
    "Marketing",
    "audit seo geo ia",
    ["audit geo référencement ia","seo ia audit entreprise","optimisation moteurs génératifs geo","audit visibilité chatgpt"],
    ["audit gratuit","outil gratuit","emploi","formation"],
    "Prioriser technique, contenu, schema et visibilité dans les moteurs de réponse.",
    { pain:4, demo:5, economicValue:4, paidIntent:5, deliverability:5 }
  ),
  "reserves-chantier-ia": entry(
    "Construction",
    "gestion réserves chantier ia",
    ["automatiser suivi réserves chantier","ia réserves chantier photo","application réserves chantier ia","suivi levée réserves automatique"],
    ["modèle excel","gratuit","emploi conducteur travaux","formation"],
    "Relier chaque réserve à son lot, sa preuve, son responsable et ses relances.",
    { pain:5, demo:5, economicValue:5, paidIntent:4, deliverability:5 }
  ),
  "pre-instruction-documentaire-ia": entry(
    "Administratif",
    "pré instruction dossier ia",
    ["assistant instruction documentaire ia","contrôle complétude dossier ia","ia pré instruction administrative","analyse dossier automatique ia"],
    ["concours","emploi","formation","gratuit"],
    "Présenter à l’instructeur un dossier préparé, sourcé et signalant ses incertitudes.",
    { pain:5, demo:5, economicValue:5, paidIntent:4, deliverability:5 }
  ),
  "gestion-stocks-ia": entry(
    "Industrie",
    "gestion stock ia",
    ["prévision rupture stock ia","optimisation stock intelligence artificielle","ia approvisionnement stock","prévision demande ia stock"],
    ["excel gratuit","emploi","formation","définition"],
    "Projeter couverture et rupture puis préparer une proposition de commande à valider.",
    { pain:5, demo:5, economicValue:5, paidIntent:5, deliverability:4 }
  ),
  "maintenance-predictive-assistant-ia": entry(
    "Industrie",
    "maintenance prédictive ia",
    ["assistant maintenance ia","ia maintenance industrielle","détection anomalie machine ia","copilote maintenance gmao"],
    ["cours","emploi","stage","définition","pdf"],
    "Détecter les dérives, retrouver les procédures et préparer les contrôles technicien.",
    { pain:5, demo:5, economicValue:5, paidIntent:4, deliverability:4 }
  )
};

export function getProblemPaidSearch(slug) {
  return problemPaidSearch[slug] || null;
}

export function getProblemPaidSearchPriority() {
  return Object.entries(problemPaidSearch)
    .map(([slug, config]) => ({ slug, ...config }))
    .sort((a,b) => b.priorityScore - a.priorityScore || a.slug.localeCompare(b.slug));
}
