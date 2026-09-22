import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="siteHeader">
        <Link className="brand" href="/" aria-label="Autonomia, accueil">
          <span className="brandMark" aria-hidden="true">
            <span>A</span>
          </span>
          <span className="brandLockup">
            <strong>AUTONOMIA</strong>
            <small>AI EXECUTION PARTNER</small>
          </span>
        </Link>

        <nav className="desktopNav" aria-label="Navigation principale">
          <Link href="/experts">Experts</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/cas-usage-ia">Cas d’usage</Link>
          <Link href="/observatoire-ia">Observatoire</Link>
          <Link href="/#methode">Méthode</Link>
        </nav>

        <div className="headerActions">
          <Link className="headerScanLink" href="/#scan">
            <span className="headerPulse" aria-hidden="true" />
            Scan IA
          </Link>
          <Link className="headerCta" href="/#scan">
            <span>Lancer le Scan</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      </header>

      <nav className="mobileDock" aria-label="Actions rapides">
        <Link href="/#scan">Lancer le Scan</Link>
        <Link href="/#contact">Parler à Autonomia</Link>
      </nav>
    </>
  );
}
