export const aiGlossaryTerms = [
  {
    term: "Agent IA",
    slug: "agent-ia",
    definition: "Système logiciel utilisant un modèle d’IA pour choisir ou enchaîner des actions à partir d’un objectif, d’un contexte et d’outils autorisés. Un agent utile doit avoir des permissions, des limites, des critères d’arrêt et des mécanismes de contrôle explicites.",
    related: ["/consultant-agent-ia", "/formation-agents-ia"]
  },
  {
    term: "Agentic AI",
    slug: "agentic-ai",
    definition: "Approche dans laquelle un système d’IA ne se limite pas à produire du contenu : il peut planifier, appeler des outils, observer des résultats et poursuivre une tâche dans les limites définies par l’architecture.",
    related: ["/consultant-agent-ia", "/formation-agents-ia"]
  },
  {
    term: "RAG",
    slug: "rag",
    definition: "Retrieval-Augmented Generation : architecture qui recherche d’abord des informations pertinentes dans une base de données ou de documents, puis fournit ce contexte à un modèle génératif afin d’ancrer la réponse dans des sources récupérées.",
    related: ["/consultant-rag", "/cas-usage-ia/construire-un-rag-no-code-sur-une-base-documentaire-d-entreprise"]
  },
  {
    term: "Retrieval",
    slug: "retrieval",
    definition: "Étape de recherche qui sélectionne les documents ou passages les plus pertinents pour une requête. Dans un RAG, la qualité du retrieval peut être évaluée séparément de la qualité de la réponse finale.",
    related: ["/consultant-rag", "/formation-ia/cas-usage/apprendre-a-preparer-les-documents-avant-de-construire-un-rag"]
  },
  {
    term: "Chunking",
    slug: "chunking",
    definition: "Découpage d’un document en passages plus petits destinés à être indexés ou recherchés. La taille, le chevauchement et la conservation du contexte influencent la pertinence du retrieval.",
    related: ["/formation-ia/cas-usage/apprendre-a-preparer-les-documents-avant-de-construire-un-rag"]
  },
  {
    term: "Embedding",
    slug: "embedding",
    definition: "Représentation numérique d’un contenu — texte, image ou autre donnée selon le modèle — dans un espace vectoriel où des contenus sémantiquement proches peuvent être comparés mathématiquement.",
    related: ["/consultant-rag"]
  },
  {
    term: "Recherche vectorielle",
    slug: "recherche-vectorielle",
    definition: "Technique de recherche qui compare des vecteurs, souvent des embeddings, pour retrouver des contenus proches en sens plutôt qu’uniquement des correspondances exactes de mots-clés.",
    related: ["/consultant-rag"]
  },
  {
    term: "Recherche hybride",
    slug: "recherche-hybride",
    definition: "Approche qui combine plusieurs méthodes de recherche, par exemple recherche lexicale et vectorielle, afin de bénéficier à la fois de la précision des mots-clés et de la similarité sémantique.",
    related: ["/consultant-rag"]
  },
  {
    term: "Reranking",
    slug: "reranking",
    definition: "Étape qui réordonne un premier ensemble de résultats de recherche avec un modèle ou une méthode supplémentaire afin de placer les passages les plus pertinents en tête avant génération.",
    related: ["/consultant-rag"]
  },
  {
    term: "Grounding",
    slug: "grounding",
    definition: "Fait d’ancrer une réponse d’IA dans un contexte ou des sources identifiables afin de réduire les réponses non soutenues et de faciliter la vérification.",
    related: ["/cas-usage-ia/construire-un-rag-no-code-sur-une-base-documentaire-d-entreprise"]
  },
  {
    term: "Human-in-the-loop",
    slug: "human-in-the-loop",
    definition: "Conception où une personne intervient à un ou plusieurs points du système pour valider, corriger, autoriser ou reprendre une action avant qu’elle n’ait une conséquence plus importante.",
    related: ["/formation-agents-ia", "/formation-ia/cas-usage/apprendre-a-concevoir-un-agent-avec-validation-humaine"]
  },
  {
    term: "Guardrail",
    slug: "guardrail",
    definition: "Contrôle technique ou organisationnel destiné à limiter le comportement d’un système d’IA : règles de contenu, permissions, validation, filtrage, schéma de sortie, seuils ou blocage d’actions sensibles.",
    related: ["/consultant-genai", "/consultant-agent-ia"]
  },
  {
    term: "Évaluation LLM",
    slug: "evaluation-llm",
    definition: "Mesure structurée de la qualité d’un système utilisant un modèle de langage, à partir de jeux de tests, critères explicites, évaluateurs humains ou automatisés et métriques adaptées au cas d’usage.",
    related: ["/consultant-genai", "/consultant-rag"]
  },
  {
    term: "LLMOps",
    slug: "llmops",
    definition: "Pratiques d’industrialisation et d’exploitation des applications fondées sur des modèles de langage : versions, évaluation, monitoring, coûts, prompts, modèles, données, incidents et déploiement.",
    related: ["/consultant-genai", "/expert-ia"]
  },
  {
    term: "MLOps",
    slug: "mlops",
    definition: "Ensemble de pratiques reliant développement, déploiement et exploitation de modèles de machine learning : données, entraînement, versions, tests, monitoring et maintenance en production.",
    related: ["/expert-ia", "/freelance-ia"]
  },
  {
    term: "Tool calling",
    slug: "tool-calling",
    definition: "Capacité d’un modèle ou agent à sélectionner et invoquer une fonction ou un outil défini par l’application, en fournissant des paramètres structurés plutôt qu’en exécutant librement une action.",
    related: ["/consultant-agent-ia"]
  },
  {
    term: "Orchestration",
    slug: "orchestration",
    definition: "Organisation de plusieurs étapes, modèles, règles, outils ou agents dans un même processus afin de contrôler leur ordre, leurs entrées, leurs sorties, leurs erreurs et leurs dépendances.",
    related: ["/consultant-agent-ia", "/freelance-ia"]
  },
  {
    term: "Workflow déterministe",
    slug: "workflow-deterministe",
    definition: "Automatisation dont le chemin et les règles sont explicitement définis à l’avance. Elle est souvent préférable à un agent lorsque le processus peut être décrit par des conditions et actions prévisibles.",
    related: ["/formation-ia/cas-usage/former-une-equipe-a-creer-son-premier-workflow-n8n-ou-make"]
  },
  {
    term: "Prompt system",
    slug: "prompt-system",
    definition: "Ensemble d’instructions de haut niveau utilisées par une application pour cadrer le rôle, les règles, le format attendu et les limites d’un modèle, indépendamment du message ponctuel de l’utilisateur.",
    related: ["/consultant-genai", "/formation-prompt-engineering"]
  },
  {
    term: "Sortie structurée",
    slug: "sortie-structuree",
    definition: "Réponse d’un modèle contrainte à un schéma exploitable par un logiciel — par exemple des champs JSON validables — plutôt qu’à un texte libre destiné uniquement à la lecture humaine.",
    related: ["/cas-usage-ia/qualifier-automatiquement-les-leads-entrants-avec-l-ia"]
  },
  {
    term: "Observabilité IA",
    slug: "observabilite-ia",
    definition: "Capacité à comprendre ce qu’un système d’IA a reçu, produit et déclenché : traces, erreurs, modèles ou versions utilisés, latence, coûts, évaluations et corrections humaines.",
    related: ["/consultant-genai", "/consultant-rag"]
  },
  {
    term: "AI literacy",
    slug: "ai-literacy",
    definition: "Maîtrise suffisante de l’IA pour comprendre ses capacités, limites, risques et règles d’usage dans un contexte donné, avec un niveau adapté aux tâches et responsabilités des personnes concernées.",
    related: ["/formation-ai-act", "/formation-ia/cas-usage/creer-une-sensibilisation-ai-act-adaptee-aux-cas-d-usage-de-l-entreprise"]
  },
  {
    term: "AI governance",
    slug: "ai-governance",
    definition: "Organisation des responsabilités, règles, processus de validation, documentation, supervision, risques et décisions qui encadrent la conception et l’usage des systèmes d’IA dans une organisation.",
    related: ["/expert-ia", "/formation-ai-act"]
  },
  {
    term: "Copilot",
    slug: "copilot",
    definition: "Terme générique désignant un assistant intégré à un environnement de travail pour aider une personne à rechercher, rédiger, analyser, préparer ou agir, tout en laissant à l’utilisateur la responsabilité du résultat.",
    related: ["/formation-copilot", "/diagnostic-copilot"]
  }
];

export function getGlossaryTerm(slug) {
  return aiGlossaryTerms.find((item) => item.slug === slug) || null;
}


function normalizeGlossaryText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getRelatedGlossaryTermsForText(value, limit = 6) {
  const text = normalizeGlossaryText(value);
  return aiGlossaryTerms
    .map((item) => ({
      ...item,
      matched: normalizeGlossaryText(item.term)
    }))
    .filter((item) => text.includes(item.matched))
    .slice(0, limit);
}
