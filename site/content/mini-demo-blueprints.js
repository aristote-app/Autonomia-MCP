const topicBlueprints = {
  "ressources-humaines": [
    { type: "candidate", metric: "3 profils comparés", gain: "Lecture préparée en quelques secondes", accent: "matching" },
    { type: "meeting", metric: "4 éléments structurés", gain: "Compte rendu d’entretien prêt à relire", accent: "entretien" },
    { type: "knowledge", metric: "3 sources RH citées", gain: "Réponse retrouvée sans solliciter un collègue", accent: "onboarding" },
    { type: "knowledge", metric: "Réponse + source", gain: "Premier niveau traité, escalade si nécessaire", accent: "questions salariés" },
    { type: "learning", metric: "Parcours personnalisé", gain: "Programme généré selon rôle et niveau", accent: "formation" },
    { type: "document", metric: "Draft + contrôles", gain: "Document préparé avant validation RH", accent: "document RH" }
  ],
  "direction-management": [
    { type: "meeting", metric: "3 décisions · 5 actions", gain: "Le plan d’action sort de la réunion", accent: "CODIR" },
    { type: "executive", metric: "5 sources consolidées", gain: "Une vue décisionnelle en 60 secondes", accent: "multi-sources" },
    { type: "decision", metric: "3 scénarios comparés", gain: "Risques et arbitrages visibles", accent: "décision" },
    { type: "workflow", metric: "7 actions suivies", gain: "Les engagements deviennent pilotables", accent: "actions" },
    { type: "content", metric: "4 formats générés", gain: "Un message, quatre audiences", accent: "communication" },
    { type: "radar", metric: "6 signaux classés", gain: "La veille devient un radar, pas une pile de liens", accent: "veille" }
  ],
  "commercial-business-development": [
    { type: "radar", metric: "Score d’opportunité", gain: "Le meilleur compte remonte en premier", accent: "lead" },
    { type: "account", metric: "Brief compte 360°", gain: "Rendez-vous préparé sans relire 5 outils", accent: "rendez-vous" },
    { type: "meeting", metric: "CRM prérempli", gain: "Résumé, next step et champs prêts à valider", accent: "CRM" },
    { type: "document", metric: "Proposition structurée", gain: "Le commercial part d’un draft contextualisé", accent: "proposition" },
    { type: "sequence", metric: "3 relances proposées", gain: "Le suivi s’adapte au contexte du deal", accent: "relance" },
    { type: "pipeline", metric: "4 risques détectés", gain: "Le manager voit ce qui bloque sans tout relire", accent: "pipeline" }
  ],
  "marketing-communication": [
    { type: "content", metric: "Angle + plan + draft", gain: "Une base éditoriale exploitable immédiatement", accent: "éditorial" },
    { type: "content", metric: "5 canaux", gain: "Un contenu devient newsletter, post, landing et script", accent: "multicanal" },
    { type: "seo", metric: "12 opportunités", gain: "Le backlog se trie par demande et couverture", accent: "SEO/GEO" },
    { type: "radar", metric: "5 concurrents", gain: "Les changements importants remontent automatiquement", accent: "veille concurrentielle" },
    { type: "campaign", metric: "6 variantes", gain: "Créatifs comparables avant mise en ligne", accent: "campagne" },
    { type: "report", metric: "3 anomalies", gain: "Le commentaire du reporting est déjà préparé", accent: "reporting" }
  ],
  "finance-comptabilite": [
    { type: "invoice", metric: "12 champs extraits", gain: "La facture devient une donnée contrôlable", accent: "facture" },
    { type: "control", metric: "8 contrôles", gain: "Les exceptions ressortent avant validation", accent: "document" },
    { type: "reconcile", metric: "4 rapprochements", gain: "Les cas simples s’associent automatiquement", accent: "rapprochement" },
    { type: "variance", metric: "3 écarts expliqués", gain: "Les causes probables sont préparées", accent: "écart" },
    { type: "report", metric: "Synthèse DAF", gain: "Les chiffres deviennent une narration à relire", accent: "reporting" },
    { type: "workflow", metric: "Clôture 7 étapes", gain: "Les blocages de clôture deviennent visibles", accent: "clôture" }
  ],
  "service-client-support": [
    { type: "tickets", metric: "Priorité + routage", gain: "La file se trie avant lecture humaine", accent: "tickets" },
    { type: "knowledge", metric: "Réponse sourcée", gain: "Le premier niveau est préparé depuis la bonne source", accent: "réponse" },
    { type: "knowledge", metric: "3 sources citées", gain: "L’agent trouve la procédure sans changer d’outil", accent: "connaissance" },
    { type: "timeline", metric: "Historique résumé", gain: "Le dossier client tient sur un écran", accent: "dossier" },
    { type: "cluster", metric: "4 motifs dominants", gain: "Les irritants récurrents deviennent visibles", accent: "motifs" },
    { type: "quality", metric: "Score qualité", gain: "Les conversations à risque remontent en priorité", accent: "qualité" }
  ],
  "industrie": [
    { type: "maintenance", metric: "3 causes probables", gain: "Le technicien part avec l’historique utile", accent: "maintenance" },
    { type: "quality", metric: "NC rapprochées", gain: "Les incidents similaires et causes ressortent", accent: "qualité" },
    { type: "knowledge", metric: "Procédure sourcée", gain: "La bonne documentation est retrouvée immédiatement", accent: "documentation" },
    { type: "report", metric: "Passage de consigne", gain: "Les anomalies de l’équipe précédente sont synthétisées", accent: "production" },
    { type: "compare", metric: "3 offres comparées", gain: "Écarts techniques et prix ressortent automatiquement", accent: "achats" },
    { type: "tickets", metric: "Incident routé", gain: "Le bon expert reçoit un dossier déjà structuré", accent: "support terrain" }
  ],
  "retail-commerce": [
    { type: "catalog", metric: "Fiche produit complète", gain: "Attributs et contenus sont préparés depuis la donnée source", accent: "catalogue" },
    { type: "stock", metric: "Risque rupture", gain: "Les références à surveiller remontent en premier", accent: "stock" },
    { type: "knowledge", metric: "Réponse magasin", gain: "Le siège n’est plus interrompu pour les questions récurrentes", accent: "support magasin" },
    { type: "stock", metric: "Commande suggérée", gain: "La proposition s’appuie sur stock, rythme et seuil", accent: "commande" },
    { type: "tickets", metric: "SAV priorisé", gain: "Les demandes simples sont préparées automatiquement", accent: "service client" },
    { type: "report", metric: "12 magasins consolidés", gain: "Les écarts réseau sont visibles immédiatement", accent: "reporting réseau" }
  ],
  "immobilier-construction": [
    { type: "meeting", metric: "CR chantier structuré", gain: "Décisions, responsables et dates sortent de la réunion", accent: "chantier" },
    { type: "site", metric: "Réserves par lot", gain: "Photos, gravité et responsable sont regroupés", accent: "réserves" },
    { type: "knowledge", metric: "Réponse + pièce source", gain: "Le bon document chantier est retrouvé sans fouiller", accent: "documents" },
    { type: "tender", metric: "Exigences extraites", gain: "Échéances et points de vigilance ressortent", accent: "appel d’offres" },
    { type: "workflow", metric: "Flux synchronisé", gain: "Une action met à jour les étapes suivantes", accent: "suivi chantier" },
    { type: "control", metric: "Dossier complet à 83 %", gain: "Les pièces manquantes sont visibles avant envoi", accent: "dossier client" }
  ],
  "taches-administratives": [
    { type: "extract", metric: "8 champs préremplis", gain: "Le copier-coller disparaît", accent: "saisie" },
    { type: "classify", metric: "Classement automatique", gain: "Le document arrive déjà au bon endroit", accent: "classement" },
    { type: "control", metric: "3 anomalies", gain: "Les dossiers incomplets ressortent avant traitement", accent: "complétude" },
    { type: "sequence", metric: "Relance prête", gain: "Les échéances deviennent automatiques", accent: "relance" },
    { type: "extract", metric: "Mail → formulaire", gain: "Le texte libre devient une donnée structurée", accent: "formulaire" },
    { type: "workflow", metric: "3 outils synchronisés", gain: "Une seule validation met à jour le reste", accent: "mise à jour" }
  ],
  "gestion-contenu-digital": [
    { type: "brief", metric: "Brief 8 blocs", gain: "La demande devient un brief exploitable", accent: "brief" },
    { type: "content", metric: "Draft guidé", gain: "La première version respecte sources et charte", accent: "draft" },
    { type: "content", metric: "5 formats", gain: "Un contenu source devient un système multicanal", accent: "déclinaison" },
    { type: "calendar", metric: "Planning 4 semaines", gain: "Les idées deviennent un calendrier pilotable", accent: "calendrier" },
    { type: "seo", metric: "Gap éditorial", gain: "Les contenus manquants remontent par potentiel", accent: "SEO/GEO" },
    { type: "brand", metric: "Contrôle marque", gain: "Ton, claims et mots interdits sont vérifiés avant publication", accent: "contrôle" }
  ],
  "emails-demandes-entrantes": [
    { type: "tickets", metric: "Tri instantané", gain: "Chaque message reçoit sujet, priorité et action", accent: "tri" },
    { type: "extract", metric: "Références extraites", gain: "Les données utiles sortent du mail automatiquement", accent: "extraction" },
    { type: "routing", metric: "Service proposé", gain: "La demande arrive au bon interlocuteur", accent: "affectation" },
    { type: "knowledge", metric: "Réponse préparée", gain: "Le brouillon s’appuie sur la bonne source", accent: "réponse" },
    { type: "sequence", metric: "Échéance créée", gain: "Les demandes sans réponse ressortent automatiquement", accent: "suivi" },
    { type: "cluster", metric: "Top 4 motifs", gain: "On voit enfin ce qui consomme la boîte mail", accent: "analyse" }
  ],
  "reporting-syntheses": [
    { type: "collect", metric: "4 sources connectées", gain: "La collecte ne dépend plus d’un copier-coller", accent: "collecte" },
    { type: "table", metric: "Données normalisées", gain: "Les formats deviennent comparables", accent: "consolidation" },
    { type: "variance", metric: "3 ruptures détectées", gain: "Les écarts importants remontent en premier", accent: "anomalies" },
    { type: "report", metric: "Commentaire prêt", gain: "Les faits marquants sont rédigés à partir des KPI", accent: "commentaire" },
    { type: "executive", metric: "Vue COMEX", gain: "Le niveau de détail s’adapte au destinataire", accent: "synthèse direction" },
    { type: "workflow", metric: "Diffusion validée", gain: "Génération, validation et envoi suivent un flux", accent: "diffusion" }
  ]
};

export function getMiniDemoBlueprints(slug, modules = []) {
  const pack = topicBlueprints[slug] || [];
  return modules.map((module, index) => ({
    type: pack[index]?.type || "workflow",
    metric: pack[index]?.metric || "Démo interactive",
    gain: pack[index]?.gain || module?.[3] || "Résultat visible",
    accent: pack[index]?.accent || module?.[0] || "cas d’usage"
  }));
}
