import { notFound } from "next/navigation";
import EditorialArticle from "@/components/EditorialArticle";
import EditorialPillar from "@/components/EditorialPillar";
import {
  publishedTrainingArticles,
  getPublishedTrainingArticle
} from "@/content/published-articles";
import {
  trainingPillars,
  getTrainingPillar
} from "@/content/editorial-backlog";

export function generateStaticParams() {
  return [
    ...publishedTrainingArticles.map((article) => ({ slug: article.slug })),
    ...trainingPillars.map((pillar) => ({ slug: pillar.slug }))
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getPublishedTrainingArticle(slug);
  if (article) {
    return {
      title: article.title,
      description: article.dek,
      alternates: { canonical: `/formation-ia/cas-usage/${slug}` },
      openGraph: {
        title: article.title,
        description: article.dek,
        type: "article",
        url: `/formation-ia/cas-usage/${slug}`
      }
    };
  }

  const pillar = getTrainingPillar(slug);
  if (!pillar) return {};

  const description = `10 scénarios de formation pour ${pillar.title.toLowerCase()} : compétences, ateliers, progression, garde-fous et transfert au travail réel.`;

  return {
    title: pillar.title,
    description,
    alternates: { canonical: `/formation-ia/cas-usage/${slug}` },
    openGraph: {
      title: pillar.title,
      description,
      type: "website",
      url: `/formation-ia/cas-usage/${slug}`
    }
  };
}

export default async function TrainingArticlePage({ params }) {
  const { slug } = await params;
  const article = getPublishedTrainingArticle(slug);

  if (article) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
    const pageUrl = `${base}/formation-ia/cas-usage/${slug}`;
    const pillar = getTrainingPillar(
      trainingPillars.find((item) => item.cluster === article.cluster)?.slug
    );
    const pillarUrl = pillar ? `${base}/formation-ia/cas-usage/${pillar.slug}` : `${base}/formation-ia/cas-usage`;

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: article.title,
          description: article.dek,
          datePublished: article.publishedAt,
          dateModified: article.modifiedAt || article.publishedAt,
          image: [`${pageUrl}/opengraph-image`],
          author: {
            "@type": "Organization",
            name: "Autonomia",
            url: `${base}/a-propos`
          },
          publisher: {
            "@type": "Organization",
            "@id": `${base}#organization`,
            name: "Autonomia",
            url: base
          },
          mainEntityOfPage: pageUrl,
          about: {
            "@type": "Thing",
            name: article.cluster
          },
          keywords: [
            article.search?.primaryKeyword,
            ...(article.search?.secondaryQueries || [])
          ].filter(Boolean)
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
            { "@type": "ListItem", position: 2, name: "Cas d’usage formation IA", item: `${base}/formation-ia/cas-usage` },
            { "@type": "ListItem", position: 3, name: article.cluster, item: pillarUrl },
            { "@type": "ListItem", position: 4, name: article.title, item: pageUrl }
          ]
        }
      ]
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <EditorialArticle article={article} />
      </>
    );
  }

  const pillar = getTrainingPillar(slug);
  if (!pillar) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const pageUrl = `${base}/formation-ia/cas-usage/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: pillar.title,
        description: `10 scénarios de formation autour de ${pillar.cluster}.`
      },
      {
        "@type": "ItemList",
        itemListElement: pillar.topics.map((topic, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: topic.title
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Cas d’usage formation IA", item: `${base}/formation-ia/cas-usage` },
          { "@type": "ListItem", position: 2, name: pillar.title, item: pageUrl }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <EditorialPillar pillar={pillar} family="training" publishedArticles={publishedTrainingArticles} />
    </>
  );
}

export const dynamicParams = false;
export const revalidate = 21600;
