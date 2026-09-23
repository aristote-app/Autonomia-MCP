import Link from "next/link";
import AutonomiaMark from "@/components/AutonomiaMark";

const NAV_ITEMS = [
  ["Experts", "/experts"],
  ["Academy", "/academy"],
  ["Territoires", "/territoires"],
  ["Cas d’usage", "/cas-usage-ia"],
  ["Explorer les besoins IA", "/observatoire-ia"],
  ["Méthode", "/#methode"]
];

export default function Header() {
  return (
    <>
      <header className="siteHeader">
        <Link className="brand" href="/" aria-label="Autonomia, accueil">
          <span className="brandMark" aria-hidden="true">
            <AutonomiaMark size={38} />
          </span>
          <span className="brandLockup">
            <strong>AUTONOMIA</strong>
            <small>AI EXECUTION PARTNER</small>
          </span>
        </Link>

        <nav className="desktopNav" aria-label="Navigation principale">
          {NAV_ITEMS.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>

        <div className="headerActions">
          <Link className="headerCta" href="/#solution-finder">
            <span>Trouver ma solution</span>
            <b aria-hidden="true">↗</b>
          </Link>

          <details className="mobileMenu">
            <summary aria-label="Ouvrir le menu">
              <span>Menu</span>
              <b aria-hidden="true">☰</b>
            </summary>
            <nav className="mobileMenuPanel" aria-label="Navigation mobile">
              {NAV_ITEMS.map(([label, href]) => (
                <Link href={href} key={href}>{label}<span aria-hidden="true">↗</span></Link>
              ))}
              <Link className="mobileMenuPrimary" href="/#solution-finder">
                Trouver ma solution <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </details>
        </div>
      </header>

      <nav className="mobileDock" aria-label="Actions rapides">
        <Link href="/#solution-finder">Trouver ma solution</Link>
        <Link href="/academy">Formations IA</Link>
      </nav>
    </>
  );
}
