import { notFound } from "next/navigation";
import IntentPage from "@/components/IntentPage";
import { getPage, getStaticSlugs } from "@/lib/pages";

export function generateStaticParams() {
  return getStaticSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.subtitle,
    alternates: {
      canonical: `/${slug}`
    },
    openGraph: {
      title: page.title,
      description: page.subtitle,
      url: `/${slug}`
    },
    robots: page.mode === "diagnostic"
      ? { index: false, follow: true }
      : { index: true, follow: true }
  };
}

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (page.faq || []).map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IntentPage page={page} />
    </>
  );
}

export const dynamicParams = false;
