export const PUBLIC_BUYER_PROFILES = Object.freeze([
  {
    id: "place",
    name: "PLACE - Marchés publics de l'État",
    url: "https://www.marches-publics.gouv.fr/entreprise",
    scope: "État et organismes publics associés",
    accessMode: "public_search",
    collectorStatus: "registry_only_until_stable_query_verified",
    priority: "P0"
  },
  {
    id: "marches_securises",
    name: "Marchés-Sécurisés",
    url: "https://www.marches-securises.fr/entreprise/",
    scope: "Collectivités et autres acheteurs publics",
    accessMode: "robots_guarded_public_search",
    collectorStatus: "live_validation",
    priority: "P1"
  },
  {
    id: "achatpublic",
    name: "achatpublic.com",
    url: "https://www.achatpublic.com/",
    scope: "Profils acheteurs et consultations",
    accessMode: "public_pages",
    collectorStatus: "registry_only",
    priority: "P1"
  },
  {
    id: "aws",
    name: "AWS / marches-publics.info",
    url: "https://www.marches-publics.info/",
    scope: "Profils acheteurs et consultations",
    accessMode: "public_pages",
    collectorStatus: "registry_only",
    priority: "P1"
  },
  {
    id: "maximilien",
    name: "Maximilien",
    url: "https://marches.maximilien.fr/",
    scope: "Île-de-France",
    accessMode: "public_portal",
    collectorStatus: "registry_only",
    priority: "P1"
  },
  {
    id: "e_marchespublics",
    name: "e-marchespublics",
    url: "https://www.e-marchespublics.com/",
    scope: "Profils acheteurs et consultations",
    accessMode: "public_pages",
    collectorStatus: "registry_only",
    priority: "P2"
  },
  {
    id: "klekoon",
    name: "Klekoon",
    url: "https://www.klekoon.com/",
    scope: "Profils acheteurs et consultations",
    accessMode: "public_pages",
    collectorStatus: "registry_only",
    priority: "P2"
  }
]);
