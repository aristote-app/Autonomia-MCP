import Link from "next/link";
import AutonomiaMark from "@/components/AutonomiaMark";

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
          <Link href="/experts">Experts</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/territoires">Territoires</Link>
          <Link href="/cas-usage-ia">Cas d’usage</Link>
          <Link href="/observatoire-ia">Explorer les besoins IA</Link>
          <Link href="/#methode">Méthode</Link>
        </nav>

        <div className="headerActions">
          <Link className="headerCta" href="/#diagnostic-ia">
            <span>Faire le diagnostic IA</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      </header>

      <nav className="mobileDock" aria-label="Actions rapides">
        <Link href="/#diagnostic-ia">Diagnostic IA</Link>
        <Link href="/experts">Experts</Link>
      </nav>
    </>
  );
}
