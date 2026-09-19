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
          <Link href="/#methode">Méthode</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>

        <Link className="headerCta" href="/#contact">
          Parler d’un besoin
        </Link>
      </header>

      <nav className="mobileDock" aria-label="Actions rapides">
        <Link href="/expert-ia">Trouver un expert</Link>
        <Link href="/formation-ia-entreprise">Former mes équipes</Link>
      </nav>
    </>
  );
}
