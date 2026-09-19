import "./globals.css";
import Header from "@/components/Header";
import AttributionCapture from "@/components/AttributionCapture";

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
  return (
    <html lang="fr">
      <body>
        <AttributionCapture />
        <Header />
        {children}
      </body>
    </html>
  );
}
