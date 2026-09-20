import "./globals.css";
import Header from "@/components/Header";
import AttributionCapture from "@/components/AttributionCapture";
import ConsentAnalytics from "@/components/ConsentAnalytics";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr"),
  title: {
    default: "Autonomia — La force d’exécution IA",
    template: "%s | Autonomia"
  },
  description:
    "Autonomia apporte aux entreprises les experts IA et les compétences nécessaires pour construire, déployer et adopter l’intelligence artificielle.",
  applicationName: "Autonomia",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Autonomia",
    title: "Autonomia — La force d’exécution IA",
    description:
      "Les experts pour construire. Les compétences pour déployer."
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonomia — La force d’exécution IA",
    description:
      "Les experts pour construire. Les compétences pour déployer."
  }
};

export default function RootLayout({ children }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}#organization`,
        name: "Autonomia",
        url: base,
        description:
          "AI Execution Partner : expertise IA externe, formation IA en entreprise, diagnostic d’exécution et contenus pratiques autour du déploiement de l’IA."
      },
      {
        "@type": "WebSite",
        "@id": `${base}#website`,
        name: "Autonomia",
        url: base,
        publisher: { "@id": `${base}#organization` },
        inLanguage: "fr-FR"
      }
    ]
  };

  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AttributionCapture />
        <ConsentAnalytics />
        <Header />
        {children}
      </body>
    </html>
  );
}
