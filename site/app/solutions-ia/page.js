import Link from "next/link";
import ProblemLink from "@/components/ProblemLink";
import { problemClusters, problemSolutions } from "@/content/problem-solutions";
import styles from "./offres-build.module.css";

export const metadata = {
  title: "Agence IA sur mesure : automatisation, agents et applications métier | AUTONOMIA BUILD",
  description: "AUTONOMIA BUILD conçoit des automatisations, agents IA et applications métier sur mesure. De la définition du besoin au déploiement, avec validation humaine et accompagnement des équipes.",
  alternates: { canonical: "/solutions-ia" }
};

const offers = [
  {
    number: "01 / AUTOMATISER",
    title: "Automatiser une tâche ou un processus",
    description: "E-mails, saisies, relances, comptes rendus, documents, données CRM : nous relions vos outils et simplifions les étapes répétitives.",
    deliverable: "Un workflow connecté, testé et documenté, avec des règles de supervision."
  },
  {
    number: "02 / CRÉER UN AGENT",
    title: "Développer un agent IA métier",
    description: "Un agent qui recherche, analyse et prépare des actions à partir de vos données et logiciels, dans le périmètre d'autonomie défini ensemble.",
    deliverable: "Un agent adapté au métier, ses accès, ses tests et ses points de validation humaine."
  },
  {
    number: "03 / CONSTRUIRE",
    title: "Créer une application métier sur mesure",
    description: "Un outil interne, une interface de suivi ou un portail rassemblant vos utilisateurs, vos données et les fonctions IA réellement nécessaires.",
    deliverable: "Une application utilisable, accompagnée de sa documentation et des modalités de prise en main."
  },
  {
    number: "04 / ACCOMPAGNER",
    title: "Déployer, former et faire évoluer",
    description: "Nous accompagnons les équipes dans la prise en main, la supervision, la maintenance et les évolutions de leur solution IA.",
    deliverable: "Un dispositif d'accompagnement défini selon les besoins, les responsabilités et les niveaux de service convenus."
  }
];

const steps = [
  { title: "Comprendre le travail réel", detail: "Nous observons les tâches, les outils déjà utilisés, les données disponibles et les points de friction." },
  { title: "Définir la bonne solution", detail: "Automatisation classique, agent IA ou application : le choix dépend du processus, du risque et de la valeur attendue." },
  { title: "Construire et tester", detail: "Nous développons par étapes, vérifions les cas limites et organisons les validations avec les utilisateurs." },
  { title: "Déployer avec vos équipes", detail: "Prise en main, documentation, supervision et améliorations font partie du cadrage du projet." }
];

const faqs = [
  ["Faut-il déjà connaître la solution technique ?", "Non. Décrivez le travail à simplifier, les outils concernés et les personnes qui l'effectuent. Nous examinons ensuite les options adaptées."],
  ["Combien coûte un outil IA sur mesure ?", "Le coût dépend du processus, du nombre de connexions, des données, des exigences de sécurité et du niveau d'accompagnement. Nous construisons une estimation après avoir qualifié le périmètre."],
  ["Les équipes gardent-elles la main ?", "Oui. Le niveau d'autonomie est défini par tâche. Les actions sensibles peuvent faire l'objet d'une revue, d'un contrôle ou d'une validation par le professionnel responsable."],
  ["Peut-on conserver nos logiciels actuels ?", "C'est une option examinée en priorité. Nous étudions les possibilités de connexion à votre environnement avant de proposer une nouvelle application."],
  ["Proposez-vous aussi des experts et des formations ?", "Oui. AUTONOMIA EXPERTS mobilise les compétences IA adaptées et AUTONOMIA ACADEMY accompagne les collaborateurs dans leurs usages professionnels."]
];

export default function SolutionsIaPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": base + "/solutions-ia#service",
    name: "AUTONOMIA BUILD — solutions IA sur mesure",
    serviceType: "Développement de solutions IA et automatisations métier",
    url: base + "/solutions-ia",
    provider: { "@id": base + "#organization" },
    description: "Conception et développement d'automatisations métier, d'agents IA et d'applications sur mesure avec accompagnement des équipes."
  };

  return (
    <main className={`problemHub ${styles.offersPage}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="problemHubHero">
        <div className={styles.offersLead}>
          <p className="eyebrow">AUTONOMIA BUILD · SOLUTIONS IA SUR MESURE</p>
          <h1>Des outils IA conçus pour vos métiers. Utilisés par vos équipes.</h1>
          <p>Automatisations, agents IA, applications internes : nous partons d'un problème concret, construisons une solution adaptée à vos outils et accompagnons sa mise en usage.</p>
          <div className={styles.heroActions}>
            <Link className={styles.heroPrimary} href="/start">Décrire mon projet IA →</Link>
            <Link className={styles.heroSecondary} href="#offres-build">Découvrir nos prestations ↓</Link>
          </div>
          <p className={styles.heroNote}>Un premier échange pour définir le besoin · Proposition adaptée au périmètre · Validation humaine lorsque nécessaire</p>
        </div>
      </section>

      <section className={styles.offersSection} id="offres-build">
        <span className={styles.sectionKicker}>CE QUE NOUS RÉALISONS</span>
        <h2 className={styles.sectionTitle}>Quatre façons de passer du besoin à l'outil.</h2>
        <p className={styles.sectionIntro}>Vous avez une tâche chronophage, un processus fragmenté ou un projet déjà défini ? Nous adaptons le format de réalisation à votre situation, sans imposer une technologie par principe.</p>
        <div className={styles.offerGrid}>
          {offers.map((offer) => (
            <article className={styles.offerCard} key={offer.number}>
              <span className={styles.offerNumber}>{offer.number}</span>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className={styles.offerDeliverable}>
                <strong>Ce que vous obtenez</strong>
                <span>{offer.deliverable}</span>
              </div>
              <Link href="/start" className={styles.offerLink}>Parler de ce besoin ↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.methodSection} aria-labelledby="methode-build">
        <div className={styles.methodInner}>
          <span className={styles.sectionKicker}>NOTRE MÉTHODE</span>
          <h2 className={styles.sectionTitle} id="methode-build">La technologie au service du travail réel.</h2>
          <p className={styles.sectionIntro}>Le professionnel maîtrise les décisions importantes. L'IA assiste la recherche, l'analyse, la préparation et l'exécution des tâches autorisées.</p>
          <div className={styles.methodGrid}>
            {steps.map((step, index) => (
              <article className={styles.methodStep} key={step.title}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
          <div className={styles.methodFooter}>
            <Link href="/start">Étudier mon projet →</Link>
            <Link href="/demonstrateurs-ia">Explorer nos démonstrateurs métier ↗</Link>
            <span>Besoin d'une compétence spécifique ? <Link href="/experts">AUTONOMIA EXPERTS ↗</Link></span>
          </div>
        </div>
      </section>

      <div className={styles.proofBand} aria-label="Notre approche">
        <span>✓ Connexion aux outils existants</span>
        <span>✓ Contrôle humain selon les actions</span>
        <span>✓ Tests et documentation</span>
        <span>✓ Formation et accompagnement possibles</span>
      </div>

      <section className={styles.problemIntro} id="solutions-par-probleme">
        <div className={styles.problemHeading}>
          <div>
            <span className={styles.sectionKicker}>EXEMPLES DE BESOINS MÉTIER</span>
            <h2 className={styles.sectionTitle}>Quel travail voulez-vous simplifier ?</h2>
          </div>
          <div><Link href="/cout-agent-ia">Combien coûte un agent IA ? ↗</Link><span aria-hidden="true"> · </span><Link href="/cas-usage-ia">Explorer les cas d'usage ↗</Link></div>
        </div>
        <p className={styles.sectionIntro}>Retrouvez nos scénarios et mini-applications à tester. Ce sont des démonstrations de possibilités, pas des références de déploiement chez un client.</p>
      </section>

      <section className="problemHubGroups">
        {problemClusters.map((cluster) => {
          const items = problemSolutions.filter((item) => item.cluster === cluster);
          if (!items.length) return null;
          return (
            <div className="problemHubGroup" key={cluster}>
              <div><span>{cluster}</span><strong>{items.length} problème{items.length > 1 ? "s" : ""}</strong></div>
              <div>
                {items.map((item) => (
                  <ProblemLink href={"/solutions-ia/" + item.slug} problemSlug={item.slug} problemCluster={item.cluster} surface="problem_hub" key={item.slug}>
                    <small>MICRO-APP À TESTER</small>
                    <strong>{item.title}</strong>
                    <span>{item.intro}</span>
                    <b>Tester →</b>
                  </ProblemLink>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className={styles.faqSection}>
        <span className={styles.sectionKicker}>QUESTIONS FRÉQUENTES</span>
        <h2 className={styles.sectionTitle}>Un projet adapté à votre organisation.</h2>
        <div className={styles.faqList}>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.endCta}>
        <div>
          <h2>Vous savez quelle tâche vous voulez simplifier ?</h2>
          <p>Décrivez votre besoin, ou échangeons directement sur votre projet de solution IA.</p>
        </div>
        <a href="https://calendly.com/deborah-build-autonomia/30min" target="_blank" rel="noopener noreferrer">Prendre rendez-vous ↗</a>
      </section>
    </main>
  );
}
