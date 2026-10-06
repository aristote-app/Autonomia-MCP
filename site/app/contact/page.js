import QuickContactForm from "@/components/QuickContactForm";

export const metadata = {
  title: "Contact — Parler de votre projet IA",
  description:
    "Présentez votre besoin à Autonomia : expert IA, automatisation, agent IA, projet de transformation ou formation.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Autonomia",
    url: `${base}/contact`,
    about: {
      "@type": "Organization",
      name: "Autonomia",
      url: base
    }
  };

  return (
    <main className="methodologyPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA / CONTACT</p>
        <h1>Parlons de votre projet IA.</h1>
        <p>
          Vous cherchez un expert, souhaitez automatiser un processus, construire une solution IA
          ou former vos équipes ? Décrivez simplement votre besoin. Nous revenons vers vous pour
          qualifier le projet et identifier la prochaine étape utile.
        </p>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">VOTRE BESOIN</p>
          <h2>Quelques informations suffisent pour commencer.</h2>
          <p>
            Le formulaire reprend le même parcours de contact que celui du pied de page Autonomia.
            Votre demande conserve le contexte utile pour être traitée dans le cockpit Inbound.
          </p>
          <div className="contactDirect">
            <strong>Déborah Dian Goldcher</strong>
            <a href="mailto:deborah@build-autonomia.com">deborah@build-autonomia.com</a>
            <a href="tel:+33609746240">06 09 74 62 40</a>
          </div>
        </div>

        <div className="globalFooterForm">
          <QuickContactForm
            mode="contact"
            formId="contact-page"
            requestedService="contact-autonomia"
            subjectLabel="Contact depuis la page Contact Autonomia"
          />
        </div>
      </section>
    </main>
  );
}
