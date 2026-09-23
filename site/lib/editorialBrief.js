import {
  executionBacklog,
  trainingBacklog,
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";
import {
  territoryBacklog,
  territoryPillars
} from "@/content/territory-editorial";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";
import { getPillarInsight } from "@/content/pillar-insights";

function findTopic(family, slug) {
  const collection =
    family === "training"
      ? trainingBacklog
      : family === "territory"
        ? territoryBacklog
        : executionBacklog;

  return collection.find((item) => item.slug === slug) || null;
}

function publishedCollection(family) {
  if (family === "training") return publishedTrainingArticles;
  if (family === "territory") return [];
  return publishedExecutionArticles;
}

function pillarCollection(family) {
  if (family === "training") return trainingPillars;
  if (family === "territory") return territoryPillars;
  return executionPillars;
}

function canonicalPath(family, slug) {
  if (family === "training") return `/formation-ia/cas-usage/${slug}`;
  if (family === "territory") return `/territoires/guides/${slug}`;
  return `/cas-usage-ia/${slug}`;
}

function territoryBrief(topic, pillar) {
  return {
    intent: "understand_evaluate_and_plan",
    page_promise:
      "Répondre à un besoin concret d'une communauté de communes, d'une communauté d'agglomération ou d'une autre collectivité avec une méthode actionnable, des responsabilités claires, des garde-fous et un chemin de déploiement progressif.",
    cluster_context: {
      summary:
        pillar?.summary ||
        "Traiter le besoin territorial comme un problème métier et de service public avant de parler d'outil.",
      decisions: [
        "Identifier le service, les agents et les usagers concernés avant de choisir une solution.",
        "Séparer l'assistance à la préparation d'une décision de la décision administrative elle-même.",
        "Documenter les données utilisées, les validations humaines et les cas d'exception.",
        "Prévoir un pilote mesurable avant une généralisation à l'échelle du territoire."
      ]
    },
    must_answer: [
      "Quel problème opérationnel la collectivité cherche-t-elle réellement à résoudre ?",
      "Quels agents, services, entreprises locales ou usagers sont concernés ?",
      "Quelles données sont nécessaires et quelles données ne doivent pas être exposées inutilement ?",
      "Quelles tâches peuvent être assistées par l'IA et quelles décisions doivent rester humaines ?",
      "Quel pilote peut être lancé avec un périmètre, des responsables et des critères de réussite explicites ?",
      "Comment organiser formation, gouvernance, sécurité, conformité et conduite du changement ?",
      "Comment mesurer l'usage, la qualité de service et la valeur créée sans inventer de ROI ?"
    ],
    required_sections: [
      "Besoin territorial",
      "Services et publics concernés",
      "Cas d'usage concrets",
      "Architecture et données",
      "Rôle de l'IA et limites",
      "Validation humaine et exceptions",
      "Gouvernance, sécurité et conformité",
      "Pilote et feuille de route",
      "Formation et adoption",
      "Mesure et indicateurs",
      "FAQ",
      "Sources et vérification"
    ],
    original_asset:
      "Créer au moins un actif réutilisable : matrice de priorisation des cas d'usage, grille de diagnostic territorial, feuille de route 90 jours, tableau de gouvernance ou checklist de pilote.",
    methodologyLink: {
      label: "Méthodologie Autonomia",
      href: "/methodologie/execution-matrix"
    },
    offerLink: {
      label: "Autonomia Territoires",
      href: "/territoires"
    }
  };
}

export function buildEditorialBrief(family, slug) {
  const topic = findTopic(family, slug);
  if (!topic) return null;

  const training = family === "training";
  const territory = family === "territory";
  const pillars = pillarCollection(family);
  const pillar = pillars.find((item) => item.cluster === topic.cluster) || null;
  const insight = territory ? null : getPillarInsight(family, topic.cluster);
  const alreadyPublished = publishedCollection(family).some((article) => article.slug === slug);

  const siblings = publishedCollection(family)
    .filter((article) => article.cluster === topic.cluster && article.slug !== slug)
    .slice(0, 4)
    .map((article) => ({
      label: article.title,
      href: canonicalPath(family, article.slug)
    }));

  const territoryConfig = territory ? territoryBrief(topic, pillar) : null;

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
    intent: territoryConfig?.intent || (training ? "learn_and_solve" : "solve_and_evaluate"),
    page_promise:
      territoryConfig?.page_promise ||
      (training
        ? "Expliquer ce que le participant doit savoir refaire seul, comment il l’apprend, comment il vérifie son travail et comment la compétence se transfère à une autre situation."
        : "Expliquer à quoi ressemble le système réel, ce que l’IA fait ou ne fait pas, quelles règles entourent l’automatisation et comment tester le scénario sans perdre le contrôle humain."),
    cluster_context:
      territoryConfig?.cluster_context || {
        summary: insight?.summary || "",
        decisions: insight?.decisions || []
      },
    must_answer:
      territoryConfig?.must_answer ||
      (training
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
          ]),
    required_sections:
      territoryConfig?.required_sections ||
      (training
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
          ]),
    original_asset:
      territoryConfig?.original_asset ||
      (training
        ? "Créer au moins un actif réutilisable : grille d’évaluation, checklist de pratique, matrice de transfert ou exercice de debugging."
        : "Créer au moins un actif réutilisable : schéma de workflow, matrice IA-vs-règles, checklist de contrôle ou tableau des exceptions."),
    evidence_requirements: [
      "Vérifier les capacités d’outils ou plateformes dans des sources appropriées et actuelles.",
      "Ne jamais inventer de volume de recherche, ROI, gain de temps, taux de réussite ou cas client.",
      "Distinguer explicitement les faits externes vérifiés du scénario / de la méthode proposée par Autonomia.",
      "Conserver au moins une preuve de demande : SERP observée, Search Console, Keyword Planner, outil SEO, langage client, marché public, besoin d'emploi ou signal adjacent documenté.",
      ...(territory
        ? [
            "Pour les sujets publics, privilégier les sources officielles et dater les règles, dispositifs, obligations ou programmes cités.",
            "Ne pas présenter un cas d'usage comme juridiquement autorisé sans source adaptée ; distinguer proposition de conception et exigence réglementaire."
          ]
        : []),
      "Préférer plusieurs domaines de source lorsqu’ils apportent des angles complémentaires."
    ],
    internal_links: [
      {
        label: topic.pillar,
        href: canonicalPath(family, pillar?.slug || topic.clusterSlug)
      },
      ...siblings,
      territoryConfig?.methodologyLink || {
        label: training ? "Matrice Autonomia de transfert" : "Matrice Autonomia d’exécution",
        href: training ? "/methodologie/learning-transfer" : "/methodologie/execution-matrix"
      },
      territoryConfig?.offerLink || {
        label: training ? "Autonomia Academy" : "Autonomia Experts",
        href: training ? "/academy" : "/experts"
      }
    ],
    quality_gate: {
      min_words: topic.minWords || (territory ? 2200 : 2000),
      min_sections: territory ? 8 : 6,
      min_faq_answers: 3,
      sources_required: true,
      unique_primary_keyword: true,
      dates_required: true,
      noindex_until_published_registry: true
    }
  };
}
