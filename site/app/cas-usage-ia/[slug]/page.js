import { notFound } from "next/navigation";
import EditorialArticle from "@/components/EditorialArticle";
import EditorialPillar from "@/components/EditorialPillar";
import {
  publishedExecutionArticles,
  getPublishedExecutionArticle
} from "@/content/published-articles";
import {
  executionPillars,
  getExecutionPillar
} from "@/content/editorial-backlog";

export function generateStaticParams() {
  return [
    ...publishedExecutionArticles.map((article) => ({ slug: article.slug })),
    ...executionPillars.map((pillar) => ({ slug: pillar.slug }))
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getPublishedExecutionArticle(slug);
  if (article) {
    return {
      title: article.title,
      description: article.dek,
      alternates: { canonical: `/cas-usage-ia/${slug}` },
      openGraph: {
        title: article.title,
        description: article.dek,
        type: "article",
        url: `/cas-usage-ia/${slug}`
      }
    };
  }

  const pillar = getExecutionPillar(slug);
  if (!pillar) return {};

  const description = `10 scénarios concrets pour ${pillar.title.toLowerCase()} : workflows, contrôles humains, données, outils et compétences à mobiliser.`;

  return {
    title: pillar.title,
    description,
    alternates: { canonical: `/cas-usage-ia/${slug}` },
    openGraph: {
      title: pillar.title,
      description,
      type: "website",
      url: `/cas-usage-ia/${slug}`
    }
  };
}

export default async function ExecutionArticlePage({ params }) {
  const { slug } = await params;
  const article = getPublishedExecutionArticle(slug);

  if (article) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.dek,
      author: { "@type": "Organization", name: "Autonomia" },
      publisher: { "@type": "Organization", name: "Autonomia" },
      mainEntityOfPage: `/cas-usage-ia/${slug}`
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <EditorialArticle article={article} />
      </>
    );
  }

  const pillar = getExecutionPillar(slug);
  if (!pillar) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const pageUrl = `${base}/cas-usage-ia/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: pillar.title,
        description: `10 scénarios concrets autour de ${pillar.cluster}.`
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
          { "@type": "ListItem", position: 1, name: "Cas d’usage IA", item: `${base}/cas-usage-ia` },
          { "@type": "ListItem", position: 2, name: pillar.title, item: pageUrl }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <EditorialPillar pillar={pillar} family="execution" publishedArticles={publishedExecutionArticles} />
    </>
  );
}

export const dynamicParams = false;
export const revalidate = 21600;
