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

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const pageUrl = `${base}/${slug}`;
  const organizationId = `${base}/#organization`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Autonomia",
        url: base
      },
      page.mode === "diagnostic"
        ? {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: page.title,
            description: page.subtitle,
            about: {
              "@type": "Thing",
              name: "Exécution de projets d’intelligence artificielle en entreprise"
            }
          }
        : {
            "@type": "Service",
            "@id": `${pageUrl}#service`,
            url: pageUrl,
            name: page.title,
            description: page.subtitle,
            category: page.universe,
            provider: {
              "@id": organizationId
            }
          },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: (page.faq || []).map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <IntentPage page={page} />
    </>
  );
}

export const dynamicParams = false;
