"use client";

import Link from "next/link";
import AutonomiaLogo from "@/components/AutonomiaLogo";

const NAV_ITEMS = [
  ["Experts", "/experts"],
  ["Build", "/solutions-ia"],
  ["Machines", "/machine-builder"],
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
          <AutonomiaLogo width={190} inverse />
        </Link>

        <nav className="desktopNav" aria-label="Navigation principale">
          {NAV_ITEMS.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>

        <div className="headerActions">
          <a
            className="headerMeetingLink"
            href="https://calendly.com/deborah-build-autonomia/30min"
            target="_blank"
            rel="noreferrer"
          >
            <span className="headerMeetingIcon" aria-hidden="true">▦</span>
            <span>Prendre RDV</span>
            <b aria-hidden="true">↗</b>
          </a>

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
              <a
                className="mobileMenuMeeting"
                href="https://calendly.com/deborah-build-autonomia/30min"
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
              >
                Prendre RDV <span aria-hidden="true">↗</span>
              </a>
              <Link className="mobileMenuPrimary" href="/start" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
                Commencer <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </details>
        </div>
        <style>{`
.siteHeader { overflow:visible; }
.siteHeader > .headerLinkedInTab { position:absolute; z-index:3; right:28px; top:calc(100% - 2px); display:inline-flex; align-items:center; gap:8px; padding:8px 14px 9px; border-radius:0 0 12px 12px; background:#0a66c2; color:#fff; font-size:11px; line-height:1.2; font-weight:700; text-decoration:none; box-shadow:0 6px 14px rgba(10,102,194,.18); }
.siteHeader > .headerLinkedInTab:hover { background:#084f98; }
.siteHeader > .headerLinkedInTab:focus-visible { outline:3px solid #62ded1; outline-offset:3px; }
.headerLinkedInTab svg { width:17px; height:17px; flex-shrink:0; }
@media(max-width:759px) { .siteHeader > .headerLinkedInTab { right:18px; font-size:10px; padding:7px 11px 8px; } }
        `}</style>
        <a className="headerLinkedInTab" href="https://www.linkedin.com/newsletters/7514281561907953664/" target="_blank" rel="noopener noreferrer" aria-label="Suivre notre actualité sur LinkedIn — AUTONOMIA Les Machines IA">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          <span>Suivre notre actualité</span><span aria-hidden="true">↗</span>
        </a>
      </header>

      <nav className="mobileDock mobileDockV12" aria-label="Trois piliers Autonomia">
        <Link href="/experts">Experts</Link>
        <Link href="/solutions-ia">Build</Link>
        <Link href="/academy">Academy</Link>
      </nav>
    </>
  );
}
