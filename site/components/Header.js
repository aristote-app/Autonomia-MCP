"use client";

import Link from "next/link";
import AutonomiaMark from "@/components/AutonomiaMark";

const NAV_ITEMS = [
  ["Experts", "/experts"],
  ["Build", "/solutions-ia"],
  ["Academy", "/academy"],
  ["Territoires", "/territoires"],
  ["Cas d’usage", "/cas-usage-ia"],
  ["Observatoire", "/observatoire-ia"]
];

export default function Header() {
  return (
    <>
      <header className="siteHeader">
        <Link className="brand" href="/" aria-label="Autonomia, accueil">
          <span className="brandMark" aria-hidden="true">
            <AutonomiaMark size={38} inverse />
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
          <Link className="headerCta" href="/start">
            <span>Commencer</span>
            <b aria-hidden="true">↗</b>
          </Link>

          <details className="mobileMenu">
            <summary aria-label="Ouvrir le menu">
              <span>Menu</span>
              <b aria-hidden="true">☰</b>
            </summary>
            <nav className="mobileMenuPanel" aria-label="Navigation mobile">
              {NAV_ITEMS.map(([label, href]) => (
                <Link href={href} key={href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{label}<span aria-hidden="true">↗</span></Link>
              ))}
              <Link className="mobileMenuPrimary" href="/start" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
                Commencer <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </details>
        </div>
      </header>

      <nav className="mobileDock mobileDockV12" aria-label="Trois piliers Autonomia">
        <Link href="/experts">Experts</Link>
        <Link href="/solutions-ia">Build</Link>
        <Link href="/academy">Academy</Link>
      </nav>
    </>
  );
}
