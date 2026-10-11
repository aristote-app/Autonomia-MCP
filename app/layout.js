import "./globals.css";
import Link from "next/link";
import AutonomiaLogo from "../lib/ui/AutonomiaLogo.js";

export const metadata = {
  title: { default: "AUTONOMIA · Cockpit", template: "%s · AUTONOMIA" },
  applicationName: "AUTONOMIA Cockpit",
  description: "AI market intelligence, public tenders, training and freelance missions.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export const viewport = { themeColor: "#07111f" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header className="cockpitBrandHeader">
          <div className="cockpitBrandInner">
            <Link className="cockpitBrand" href="/" aria-label="AUTONOMIA, accueil du cockpit">
              <AutonomiaLogo width={260} />
            </Link>
            <div className="cockpitBrandActions">
              <span className="cockpitLabel"><span aria-hidden="true" />COCKPIT</span>
              <a href="https://build-autonomia.com" className="cockpitPublicLink">Voir le site ↗</a>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
