import { notFound } from "next/navigation";
import EditorialArticle from "@/components/EditorialArticle";
import {
  publishedExecutionArticles,
  getPublishedExecutionArticle
} from "@/content/published-articles";

export function generateStaticParams() {
  return publishedExecutionArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getPublishedExecutionArticle(slug);
  if (!article) return {};

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

export default async function ExecutionArticlePage({ params }) {
  const { slug } = await params;
  const article = getPublishedExecutionArticle(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    author: {
      "@type": "Organization",
      name: "Autonomia"
    },
    publisher: {
      "@type": "Organization",
      name: "Autonomia"
    },
    mainEntityOfPage: `/cas-usage-ia/${slug}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <EditorialArticle article={article} />
    </>
  );
}

export const dynamicParams = false;
