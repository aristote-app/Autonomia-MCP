import { buildExecutionArticle } from "./execution-article-factory.js";

function createSpec([family, cluster, title, goal, output, aiRole, rules, mvp, example]) {
  return { family, cluster, title, goal, output, aiRole, rules, mvp, example };
}

const specs = [
  [
    "btp",
    "BTP & chantier",
    "Transformer des notes de réunion de chantier en compte rendu structuré",
    "passer de notes brutes à un compte rendu homogène sans inventer de décision ou d’engagement",
    "un compte rendu par lot avec faits, décisions, actions, responsables, dates explicites et points à confirmer",
    "reclasser les notes sous une structure chantier et distinguer observation, décision et action",
    "conserver les formulations sources sensibles, ne pas attribuer de responsable absent et signaler toute date ambiguë",
    "structurer les notes d’une réunion pilote puis faire relire chaque lot avant diffusion",
    "le conducteur de travaux prend des notes rapides pendant la réunion puis passe du temps à reconstruire un compte rendu propre"
  ],
  [
    "btp",
    "BTP & chantier",
    "Extraire les réserves d’un compte rendu et créer un tableau de suivi",
    "transformer les réserves textuelles en lignes suivables sans perdre le contexte du compte rendu",
    "un tableau avec réserve, lot, localisation, entreprise, date, statut et source",
    "extraire les formulations de réserve et les éléments associés",
    "ne pas inventer de lot ou de date, dédupliquer par source et conserver le lien vers le passage d’origine",
    "extraire les réserves de trois comptes rendus et les placer dans une file de validation",
    "les réserves sont présentes dans les comptes rendus mais doivent ensuite être ressaisies manuellement dans un tableau"
  ],
  [
    "btp",
    "BTP & chantier",
    "Classer automatiquement les photos de chantier avec leurs commentaires",
    "rendre les photos retrouvables par zone, date et sujet sans se fier uniquement au nom du fichier",
    "des métadonnées, un dossier ou label proposé et un commentaire normalisé",
    "interpréter le commentaire fourni et, si autorisé, certains éléments visuels sans conclure sur une conformité",
    "privilégier date, auteur et zone déclarée et ne pas qualifier un défaut technique uniquement depuis l’image",
    "classer les photos accompagnées d’un commentaire dans un dossier pilote",
    "des centaines de photos sont prises sur chantier puis deviennent difficiles à retrouver quelques semaines plus tard"
  ],
  [
    "btp",
    "BTP & chantier",
    "Créer un résumé hebdomadaire d’avancement à partir des comptes rendus",
    "donner une vue stable de l’avancement et des sujets ouverts sans refaire manuellement la synthèse chaque semaine",
    "une note par lot avec avancées, actions ouvertes, blocages déclarés et échéances explicites",
    "comparer les derniers comptes rendus et résumer les changements",
    "ne pas déduire un pourcentage d’avancement absent et distinguer fait observé de commentaire",
    "résumer les deux derniers comptes rendus d’un chantier et faire valider la note",
    "chaque semaine, la maîtrise d’œuvre relit plusieurs comptes rendus pour préparer une vision synthétique"
  ],
  [
    "btp",
    "BTP & chantier",
    "Détecter les actions en retard dans les comptes rendus de chantier",
    "faire ressortir les actions dont l’échéance explicite est dépassée et dont la clôture n’est pas confirmée",
    "une liste d’actions en retard avec lot, responsable, échéance, ancienneté et source",
    "rapprocher les formulations d’une même action entre plusieurs comptes rendus",
    "utiliser les dates comme règle, ne pas considérer une action comme ouverte si un compte rendu ultérieur la clôture",
    "suivre les actions datées sur les quatre derniers comptes rendus",
    "des actions restent répétées de semaine en semaine mais leur retard n’est visible qu’en relisant l’historique"
  ],
  [
    "btp",
    "BTP & chantier",
    "Comparer un compte rendu de chantier à celui de la semaine précédente",
    "mettre en évidence ce qui a changé, ce qui persiste et ce qui a disparu entre deux réunions",
    "une comparaison structurée des nouveaux sujets, actions closes, actions persistantes et modifications",
    "aligner des formulations proches même lorsque le texte n’est pas identique",
    "conserver les extraits sources et ne pas conclure qu’un sujet est résolu uniquement parce qu’il n’est plus mentionné",
    "comparer deux CR consécutifs et générer un tableau de différences à valider",
    "les équipes relisent deux documents côte à côte pour comprendre ce qui a réellement évolué depuis la réunion précédente"
  ],
  [
    "btp",
    "BTP & chantier",
    "Créer des brouillons de relance aux entreprises à partir des réserves ouvertes",
    "préparer des relances précises sur les réserves encore ouvertes sans envoyer automatiquement un message inexact",
    "un brouillon par entreprise avec réserves, localisation, date et rappel de l’action attendue",
    "regrouper les réserves par entreprise et reformuler le contexte de manière concise",
    "n’inclure que les réserves confirmées ouvertes et ne jamais inventer de délai contractuel",
    "générer des brouillons hebdomadaires pour une entreprise pilote avec validation avant envoi",
    "le conducteur de travaux recompose régulièrement des e-mails de relance à partir d’un tableau de réserves"
  ],
  [
    "btp",
    "BTP & chantier",
    "Centraliser les documents chantier reçus par e-mail dans Google Drive",
    "éviter que plans, visas, fiches et pièces administratives restent dispersés dans les boîtes mail",
    "un fichier classé avec métadonnées, dossier cible et lien vers l’e-mail source",
    "reconnaître le type de document et le projet lorsque le nom de fichier ne suffit pas",
    "utiliser une arborescence validée, conserver l’e-mail source et ne pas écraser une version existante sans règle",
    "centraliser seulement les pièces jointes d’un chantier et de trois catégories documentaires",
    "les entreprises transmettent de nombreux documents par e-mail et chacun les range manuellement dans le Drive chantier"
  ],
  [
    "btp",
    "BTP & chantier",
    "Créer une mémoire de chantier interrogeable en langage naturel",
    "retrouver rapidement décisions, réserves, actions et documents historiques avec citations",
    "une réponse sourcée avec date, lot, document et lien vers les passages pertinents",
    "rechercher dans les comptes rendus et documents indexés puis synthétiser les extraits utiles",
    "respecter les droits, conserver les dates et refuser toute réponse qui ne dispose pas d’une source suffisante",
    "indexer les comptes rendus validés d’un seul chantier et répondre avec citations",
    "plusieurs mois après le démarrage, retrouver une décision ou une réserve précise nécessite de parcourir de nombreux PDF"
  ],
  [
    "btp",
    "BTP & chantier",
    "Préparer une réunion de chantier à partir des actions non clôturées",
    "construire un ordre du jour opérationnel centré sur les actions ouvertes et les arbitrages nécessaires",
    "une liste par lot avec action, responsable, ancienneté, dernière mention et question à traiter",
    "regrouper les actions proches et résumer leur historique récent",
    "exclure les actions clôturées, conserver les échéances explicites et signaler les responsables incertains",
    "préparer automatiquement le brouillon d’ordre du jour à partir du dernier tableau d’actions",
    "avant chaque réunion, le pilote relit le compte rendu précédent pour reconstruire la liste des sujets encore ouverts"
  ]
].map(createSpec);

export const marketDemandExecutionArticlesWave18 = specs.map(buildExecutionArticle);
export const marketDemandTrainingArticlesWave18 = [];
