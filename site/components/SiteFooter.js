"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AutonomiaMark from "@/components/AutonomiaMark";
import QuickContactForm from "@/components/QuickContactForm";

function normalizedPhone(value = "") {
  return value.replace(/[^+\d]/g, "");
}

export default function SiteFooter() {
  const pathname = usePathname();
  const hideContactBlock = pathname?.startsWith("/contact");
  const phone = (process.env.NEXT_PUBLIC_CONTACT_PHONE || "").trim();
  const email = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim();

  return (
    <footer className="globalSiteFooter" id="contact">
      {!hideContactBlock && (
        <section className="globalFooterContact">
          <div className="globalFooterContactCopy">
            <p className="eyebrow">CONTACT AUTONOMIA</p>
            <h2>Un besoin IA ? Parlons-en simplement.</h2>
            <p>
              Experts, construction de solutions IA ou formation : envoyez votre demande directement depuis la page.
              Nous conservons le contexte de votre visite pour vous répondre sur le bon sujet.
            </p>

            {(phone || email) && (
              <div className="globalFooterDirect">
                {phone && <a href={`tel:${normalizedPhone(phone)}`}>Appeler Autonomia · {phone}</a>}
                {email && <a href={`mailto:${email}`}>Écrire · {email}</a>}
              </div>
            )}
          </div>

          <div className="globalFooterForm">
            <QuickContactForm
              mode="contact"
              formId="footer-contact"
              requestedService="contact-autonomia"
              subjectLabel="Contact depuis le site Autonomia"
            />
          </div>
        </section>
      )}

      <div className="globalFooterBottom">
        <div className="brand footerBrand">
          <span className="brandMark" aria-hidden="true"><AutonomiaMark size={38} inverse /></span>
          <span>AUTONOMIA</span>
        </div>
        <p>La force d’exécution IA.</p>
        <nav aria-label="Liens de pied de page">
          <Link href="/experts">Experts</Link>
          <Link href="/solutions-ia">Build</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/territoires">Territoires</Link>
          <Link href="/cas-usage-ia">Cas d’usage</Link>
          <Link href="/observatoire-ia">Observatoire</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
          <a href="https://calendly.com/deborah-build-autonomia/30min" target="_blank" rel="noreferrer">Prendre RDV</a>
          <Link href="/methodologie/politique-editoriale">Politique éditoriale</Link>
        </nav>
      </div>
    </footer>
  );
}
