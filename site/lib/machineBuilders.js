export const MACHINE_BUILDERS = [
  {
    id: "01",
    slug: "automatiser-sav-ecommerce",
    title: "Automatiser le SAV e-commerce avec l’IA",
    shortTitle: "SAV e-commerce → réponse assistée",
    description: "E-mail entrant → compréhension → commande → brouillon → validation → suivi.",
    meta: "Gmail / Outlook · Shopify / WooCommerce / PrestaShop",
    status: "available"
  },
  {
    id: "02",
    slug: "reunion-compte-rendu-plan-action",
    title: "Réunion → compte rendu → plan d’action",
    shortTitle: "Réunion → compte rendu → plan d’action",
    description: "Transformer une réunion en décisions, tâches, responsables et suivi.",
    status: "coming"
  },
  {
    id: "03",
    slug: "boite-mail-detection-prospects",
    title: "Boîte mail → détection des prospects",
    shortTitle: "Boîte mail → détection des prospects",
    description: "Repérer les opportunités commerciales dans les e-mails entrants et les qualifier.",
    status: "coming"
  },
  {
    id: "04",
    slug: "analyse-contrats-ia",
    title: "Documents → analyse de contrats",
    shortTitle: "Documents → analyse de contrats",
    description: "Extraire les clauses, risques, différences et points à valider.",
    status: "coming"
  },
  {
    id: "05",
    slug: "drive-assistant-documentaire",
    title: "Drive → assistant documentaire",
    shortTitle: "Drive → assistant documentaire",
    description: "Interroger ses documents avec des réponses sourcées et contrôlées.",
    status: "coming"
  }
];

export function machineBuilderHref(machine) {
  return "/machine-builder/" + machine.slug;
}

export function getMachineBuilder(slug) {
  return MACHINE_BUILDERS.find((machine) => machine.slug === slug) || null;
}
