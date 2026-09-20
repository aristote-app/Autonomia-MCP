import {
  executionBacklog,
  trainingBacklog,
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";
import { getPillarInsight } from "@/content/pillar-insights";

function findTopic(family, slug) {
  const collection = family === "training" ? trainingBacklog : executionBacklog;
  return collection.find((item) => item.slug === slug) || null;
}

function publishedCollection(family) {
  return family === "training" ? publishedTrainingArticles : publishedExecutionArticles;
}

function pillarCollection(family) {
  return family === "training" ? trainingPillars : executionPillars;
}

function canonicalPath(family, slug) {
  return family === "training"
    ? `/formation-ia/cas-usage/${slug}`
    : `/cas-usage-ia/${slug}`;
}

export function buildEditorialBrief(family, slug) {
  const topic = findTopic(family, slug);
  if (!topic) return null;

  const training = family === "training";
  const pillars = pillarCollection(family);
  const pillar = pillars.find((item) => item.cluster === topic.cluster) || null;
  const insight = getPillarInsight(family, topic.cluster);
  const alreadyPublished = publishedCollection(family).some((article) => article.slug === slug);

  const siblings = publishedCollection(family)
    .filter((article) => article.cluster === topic.cluster && article.slug !== slug)
    .slice(0, 4)
    .map((article) => ({
      label: article.title,
      href: canonicalPath(family, article.slug)
    }));

  return {
    family,
    slug,
    status: alreadyPublished ? "published" : "backlog",
    title: topic.title,
    cluster: topic.cluster,
    pillar: {
      title: topic.pillar,
      href: canonicalPath(family, pillar?.slug || topic.clusterSlug)
    },
    canonical_candidate: canonicalPath(family, slug),
    intent: training ? "learn_and_solve" : "solve_and_evaluate",
    page_promise: training
      ? "Expliquer ce que le participant doit savoir refaire seul, comment il l’apprend, comment il vérifie son travail et comment la compétence se transfère à une autre situation."
      : "Expliquer à quoi ressemble le système réel, ce que l’IA fait ou ne fait pas, quelles règles entourent l’automatisation et comment tester le scénario sans perdre le contrôle humain.",
    cluster_context: {
      summary: insight.summary,
      decisions: insight.decisions
    },
    must_answer: training
      ? [
          "Quelle situation de travail doit réellement s’améliorer ?",
          "Quelle compétence observable doit être acquise ?",
          "Quel atelier permet de pratiquer sur un cas crédible ?",
          "Quelles erreurs faut-il apprendre à détecter ou provoquer ?",
          "Quels garde-fous et règles internes doivent être appliqués ?",
          "Comment évaluer que la personne peut refaire la méthode seule ?"
        ]
      : [
          "Quel est le processus actuel et où se situe la friction ?",
          "Quelles données sont nécessaires et lesquelles ne doivent pas être envoyées inutilement ?",
          "Où l’IA apporte-t-elle une interprétation que des règles classiques gèrent mal ?",
          "Quelles actions restent déterministes ?",
          "Où placer validation humaine, branche d’exception et reprise d’erreur ?",
          "Quel MVP permet de tester la valeur sans industrialiser trop tôt ?"
        ],
    required_sections: training
      ? [
          "Situation de travail",
          "Compétence cible",
          "Atelier pratique",
          "Méthode pas à pas",
          "Erreurs et debugging",
          "Données, sécurité et gouvernance",
          "Évaluation observable",
          "Transfert à une autre situation",
          "FAQ",
          "Sources et vérification"
        ]
      : [
          "Situation réelle",
          "Problème actuel",
          "Architecture du workflow",
          "Rôle précis de l’IA",
          "Règles déterministes",
          "Human-in-the-loop et exceptions",
          "Sécurité et permissions",
          "MVP et tests",
          "Limites et extensions",
          "FAQ et sources"
        ],
    original_asset: training
      ? "Créer au moins un actif réutilisable : grille d’évaluation, checklist de pratique, matrice de transfert ou exercice de debugging."
      : "Créer au moins un actif réutilisable : schéma de workflow, matrice IA-vs-règles, checklist de contrôle ou tableau des exceptions.",
    evidence_requirements: [
      "Vérifier les capacités d’outils ou plateformes dans des sources appropriées et actuelles.",
      "Ne jamais inventer de volume de recherche, ROI, gain de temps, taux de réussite ou cas client.",
      "Distinguer explicitement les faits externes vérifiés du scénario / de la méthode proposée par Autonomia.",
      "Conserver au moins une preuve de demande : SERP observée, Search Console, Keyword Planner, outil SEO, langage client ou signal adjacent documenté.",
      "Préférer plusieurs domaines de source lorsqu’ils apportent des angles complémentaires."
    ],
    internal_links: [
      {
        label: topic.pillar,
        href: canonicalPath(family, pillar?.slug || topic.clusterSlug)
      },
      ...siblings,
      {
        label: training ? "Matrice Autonomia de transfert" : "Matrice Autonomia d’exécution",
        href: training ? "/methodologie/learning-transfer" : "/methodologie/execution-matrix"
      },
      {
        label: training ? "Autonomia Academy" : "Autonomia Experts",
        href: training ? "/academy" : "/experts"
      }
    ],
    quality_gate: {
      min_words: topic.minWords || 2000,
      min_sections: 6,
      min_faq_answers: 3,
      sources_required: true,
      unique_primary_keyword: true,
      dates_required: true,
      noindex_until_published_registry: true
    }
  };
}
