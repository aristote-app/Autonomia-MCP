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
          <Link href="/observatoire-ia">Observatoire</Link>
          <Link href="/#methode">Méthode</Link>
        </nav>

        <div className="headerActions">
          <Link className="headerScanLink" href="/#fiche-besoin">
            <span className="headerPulse" aria-hidden="true" />
            Audit IA offert
          </Link>
          <Link className="headerCta" href="/#fiche-besoin">
            <span>Préciser mon besoin</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      </header>

      <nav className="mobileDock" aria-label="Actions rapides">
        <Link href="/#fiche-besoin">Préciser mon besoin</Link>
        <Link href="/#audit-ia">Audit IA offert</Link>
      </nav>
    </>
  );
}
