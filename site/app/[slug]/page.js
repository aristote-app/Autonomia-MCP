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

  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: page.title,
        description: page.subtitle,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr"}/${page.slug}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Autonomia",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr"
        }
      },
      {
        "@type": "Service",
        name: page.title,
        description: page.subtitle,
        serviceType:
          page.mode === "experts"
            ? "Expertise et staffing IA"
            : page.mode === "academy"
              ? "Formation IA en entreprise"
              : "Diagnostic d’exécution IA",
        provider: {
          "@type": "Organization",
          name: "Autonomia",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IntentPage page={page} />
    </>
  );
}

export const dynamicParams = false;
