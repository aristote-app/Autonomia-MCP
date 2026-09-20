import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="siteHeader">
        <Link className="brand" href="/" aria-label="Autonomia, accueil">
          <span className="brandMark" aria-hidden="true">A</span>
          <span>AUTONOMIA</span>
        </Link>

        <nav className="desktopNav" aria-label="Navigation principale">
          <Link href="/experts">Experts</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/#scan">Scan</Link>
          <Link href="/cas-usage-ia">Cas d’usage</Link>
          <Link href="/observatoire-ia">Observatoire</Link>
          <Link href="/#methode">Méthode</Link>
        </nav>

        <Link className="headerCta" href="/#scan">
          Lancer le Scan
        </Link>
      </header>

      <nav className="mobileDock" aria-label="Actions rapides">
        <Link href="/#scan">Lancer le Scan</Link>
        <Link href="/#contact">Parler à Autonomia</Link>
      </nav>
    </>
  );
}
