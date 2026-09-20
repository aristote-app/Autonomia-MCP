import { notFound } from "next/navigation";
import EditorialArticle from "@/components/EditorialArticle";
import {
  publishedTrainingArticles,
  getPublishedTrainingArticle
} from "@/content/published-articles";

export function generateStaticParams() {
  return publishedTrainingArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getPublishedTrainingArticle(slug);
  if (!article) return {};

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

export default async function TrainingArticlePage({ params }) {
  const { slug } = await params;
  const article = getPublishedTrainingArticle(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    author: {
      "@type": "Organization",
      name: "Autonomia Academy"
    },
    publisher: {
      "@type": "Organization",
      name: "Autonomia"
    },
    mainEntityOfPage: `/formation-ia/cas-usage/${slug}`
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
