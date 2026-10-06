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
    <main className="contactPageV2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="contactHeroV2">
        <p className="eyebrow">AUTONOMIA / CONTACT</p>
        <h1>Parlons de votre projet IA.</h1>
        <p>
          Un besoin d’expert, une solution à construire ou des équipes à former ?
          Décrivez le sujet en quelques lignes. Nous vous recontactons pour cadrer la suite.
        </p>
      </section>

      <section className="contactMainV2">
        <div className="contactInfoV2">
          <div className="contactPersonV2">
            <span className="contactPersonMonogramV2">DDG</span>
            <div>
              <small>VOTRE CONTACT</small>
              <h2>Déborah Dian Goldcher</h2>
              <a href="mailto:deborah@build-autonomia.com">deborah@build-autonomia.com</a>
              <a href="tel:+33609746240">06 09 74 62 40</a>
            </div>
          </div>

          <div className="contactReasonsV2">
            <article>
              <span>01</span>
              <div>
                <strong>Trouver un expert IA</strong>
                <p>Décrivez la mission, le niveau d’autonomie attendu et votre calendrier.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Construire une solution IA</strong>
                <p>Partez d’un processus, d’une tâche ou d’un irritant métier à transformer.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Former vos équipes</strong>
                <p>Indiquez les publics, les usages visés et le niveau de maturité actuel.</p>
              </div>
            </article>
          </div>

          <p className="contactPromiseV2">
            Une demande simple suffit pour commencer. Nous structurons ensuite le besoin avec vous.
          </p>
        </div>

        <div className="contactFormV2">
          <QuickContactForm
            mode="contact"
            formId="contact-page"
            requestedService="contact-autonomia"
            subjectLabel="Parler de mon projet avec Autonomia"
          />
        </div>
      </section>
    </main>
  );
}
