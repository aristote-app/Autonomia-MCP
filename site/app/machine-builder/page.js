import Link from "next/link";
import styles from "./MachineBuilderHub.module.css";

export const metadata = {
  title: "AUTONOMIA Machine Builder — Des machines IA concrètes à construire",
  description:
    "Choisissez un usage concret, configurez votre environnement et repartez avec un kit à utiliser dans Claude ou ChatGPT pour construire votre machine étape par étape.",
  alternates: { canonical: "/machine-builder" }
};

const MACHINES = [
  {
    id: "01",
    title: "Automatiser le SAV e-commerce avec l’IA",
    description: "E-mail entrant → compréhension → commande → brouillon → validation → suivi.",
    href: "/machine-builder/automatiser-sav-ecommerce",
    status: "available",
    meta: "Gmail / Outlook · Shopify / WooCommerce / PrestaShop"
  },
  {
    id: "02",
    title: "Réunion → compte rendu → plan d’action",
    description: "Transformer une réunion en décisions, tâches, responsables et suivi.",
    status: "coming"
  },
  {
    id: "03",
    title: "Boîte mail → détection des prospects",
    description: "Repérer les opportunités commerciales dans les e-mails entrants et les qualifier.",
    status: "coming"
  },
  {
    id: "04",
    title: "Documents → analyse de contrats",
    description: "Extraire les clauses, risques, différences et points à valider.",
    status: "coming"
  },
  {
    id: "05",
    title: "Drive → assistant documentaire",
    description: "Interroger ses documents avec des réponses sourcées et contrôlées.",
    status: "coming"
  }
];

export default function MachineBuilderHubPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>AUTONOMIA MACHINE BUILDER</p>
        <h1>Construisez votre machine IA à partir de votre environnement réel.</h1>
        <p>
          Choisissez un usage. Répondez à quelques questions sur vos outils et vos accès.
          AUTONOMIA génère un kit que vous pouvez uploader dans Claude ou ChatGPT pour être guidé
          étape par étape jusqu’au test final.
        </p>
      </section>

      <section className={styles.catalog}>
        <div className={styles.catalogHead}>
          <span>LES MACHINES</span>
          <h2>Un besoin précis. Une machine précise.</h2>
          <p>
            Chaque Machine Builder part d’un résultat métier concret. Les nouvelles machines passent
            de « À venir » à « Disponible » au fur et à mesure de leur publication.
          </p>
        </div>

        <div className={styles.grid}>
          {MACHINES.map((machine) =>
            machine.status === "available" ? (
              <Link className={styles.cardActive} href={machine.href} key={machine.id}>
                <div className={styles.cardTop}>
                  <b>#{machine.id}</b>
                  <span>Disponible</span>
                </div>
                <h3>{machine.title}</h3>
                <p>{machine.description}</p>
                <small>{machine.meta}</small>
                <strong>Construire cette machine →</strong>
              </Link>
            ) : (
              <article className={styles.cardComing} key={machine.id} aria-disabled="true">
                <div className={styles.cardTop}>
                  <b>#{machine.id}</b>
                  <span>À venir</span>
                </div>
                <h3>{machine.title}</h3>
                <p>{machine.description}</p>
              </article>
            )
          )}
        </div>
      </section>

      <section className={styles.newsletter}>
        <div>
          <span>AUTONOMIA — L’IA, CONCRÈTEMENT.</span>
          <h2>Une nouvelle machine, un nouveau cas d’usage concret.</h2>
          <p>
            Suivez les prochaines publications sur LinkedIn. Dès que la newsletter AUTONOMIA sera
            ouverte, ce lien pointera directement vers l’abonnement.
          </p>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_LINKEDIN_NEWSLETTER_URL || "https://www.linkedin.com/in/deborahdiangoldcher/"}
          target="_blank"
          rel="noreferrer"
        >
          Suivre les prochaines machines sur LinkedIn ↗
        </a>
      </section>
    </main>
  );
}
