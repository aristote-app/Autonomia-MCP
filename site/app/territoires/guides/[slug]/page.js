import { notFound } from "next/navigation";
import EditorialArticle from "@/components/EditorialArticle";
import EditorialPillar from "@/components/EditorialPillar";
import { territoryPillars, getTerritoryPillar } from "@/content/territory-editorial";
import { publishedTerritoryArticles, getPublishedTerritoryArticle } from "@/content/published-articles";

export function generateStaticParams() {
  return [
    ...publishedTerritoryArticles.map((article) => ({ slug: article.slug })),
    ...territoryPillars.map((pillar) => ({ slug: pillar.slug }))
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getPublishedTerritoryArticle(slug);
  if (article) {
    return {
      title: article.title,
      description: article.dek,
      alternates: { canonical: `/territoires/guides/${slug}` },
      openGraph: {
        title: article.title,
        description: article.dek,
        type: "article",
        url: `/territoires/guides/${slug}`,
        publishedTime: article.publishedAt,
        modifiedTime: article.modifiedAt || article.publishedAt,
        authors: ["Autonomia"],
        tags: [article.cluster, article.search?.primaryKeyword].filter(Boolean)
      }
    };
  }

  const pillar = getTerritoryPillar(slug);
  if (!pillar) return {};
  return {
    title: pillar.title,
    description: pillar.summary,
    alternates: { canonical: `/territoires/guides/${slug}` }
  };
}

export default async function TerritoryGuidePage({ params }) {
  const { slug } = await params;
  const article = getPublishedTerritoryArticle(slug);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const pageUrl = `${base}/territoires/guides/${slug}`;

  if (article) {
    const pillar = territoryPillars.find((item) => item.cluster === article.cluster);
    const pillarUrl = pillar ? `${base}/territoires/guides/${pillar.slug}` : `${base}/territoires/guides`;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: article.title,
          description: article.dek,
          datePublished: article.publishedAt,
          dateModified: article.modifiedAt || article.publishedAt,
          author: { "@type": "Organization", name: "Autonomia", url: `${base}/a-propos` },
          publisher: { "@type": "Organization", "@id": `${base}#organization`, name: "Autonomia", url: base },
          mainEntityOfPage: pageUrl,
          about: { "@type": "Thing", name: article.cluster },
          keywords: [article.search?.primaryKeyword, ...(article.search?.secondaryQueries || [])].filter(Boolean),
          inLanguage: "fr-FR",
          citation: (article.sources || []).map((source) => source.url)
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
            { "@type": "ListItem", position: 2, name: "Territoires", item: `${base}/territoires` },
            { "@type": "ListItem", position: 3, name: "Guides", item: `${base}/territoires/guides` },
            { "@type": "ListItem", position: 4, name: article.cluster, item: pillarUrl },
            { "@type": "ListItem", position: 5, name: article.title, item: pageUrl }
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

  const pillar = getTerritoryPillar(slug);
  if (!pillar) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: pillar.title,
        description: pillar.summary
      },
      {
        "@type": "ItemList",
        itemListElement: pillar.topics.map((topic, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: topic.title
        }))
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <EditorialPillar pillar={pillar} family="territory" publishedArticles={publishedTerritoryArticles} />
    </>
  );
}

export const dynamicParams = false;
export const revalidate = 21600;
