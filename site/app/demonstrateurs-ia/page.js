import Link from "next/link";
import styles from "./demonstrateurs.module.css";

export const metadata = {
  title: "Démonstrateurs IA métiers : urbanisme, conservatoire, marchés publics | AUTONOMIA",
  description: "Explorez des démonstrations IA concrètes pour les collectivités : pré-instruction urbanisme, inscriptions au conservatoire et gestion des marchés publics. L'humain garde la validation.",
  alternates: { canonical: "/demonstrateurs-ia" }
};

const examples = [
  {
    id: "urbanisme",
    theme: "URBANISME · AUTORISATIONS DU DROIT DES SOLS",
    title: "Préparer l'instruction d'un dossier d'urbanisme",
    need: "Un instructeur doit réunir les pièces, repérer les points de vigilance et suivre les échéances avant de prendre sa décision.",
    flow: ["Dossier reçu", "Pré-contrôle des pièces", "Points à vérifier", "Relecture par l'instructeur"],
    autonomy: "L'outil signale et prépare. L'instructeur contrôle les règles applicables, corrige et signe.",
    status: "Démo interactive avec dossiers fictifs",
    href: "/territoires/urbanisme",
    cta: "Tester la démo urbanisme ↗"
  },
  {
    id: "conservatoire",
    theme: "CULTURE · INSCRIPTIONS ET PLANNING",
    title: "Préparer une répartition des créneaux de conservatoire",
    need: "L'équipe organise les inscriptions en combinant sites, disponibilités, préférences horaires et contraintes des familles.",
    flow: ["Demandes des familles", "Analyse des contraintes", "Créneaux proposés", "Arbitrage par l'équipe"],
    autonomy: "La simulation rend les contraintes visibles. La répartition définitive appartient au service.",
    status: "Démo interactive avec données fictives",
    href: "/territoires/conservatoire",
    cta: "Tester la démo conservatoire ↗"
  },
  {
    id: "marches",
    theme: "COMMANDE PUBLIQUE · EXÉCUTION DES MARCHÉS",
    title: "Suivre administrativement et financièrement un marché public",
    need: "Les responsables des marchés suivent les pièces contractuelles, avenants, échéances, situations et éléments de suivi financier.",
    flow: ["Données du marché", "Suivi des événements", "Alertes et préparation", "Validation par le gestionnaire"],
    autonomy: "Le technicien conserve la main sur les contrôles, les calculs métier et les décisions engageantes.",
    status: "Cas d'usage à présenter avec l'équipe",
    href: null,
    cta: "Parler de cet outil ↗"
  }
];

export default function DemonstrateursIaPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": base + "/demonstrateurs-ia#collection",
    name: "Démonstrateurs IA métier AUTONOMIA",
    url: base + "/demonstrateurs-ia",
    description: "Présentations et démonstrations de solutions IA et outils métier. Les exemples interactifs utilisent des données fictives.",
    publisher: { "@id": base + "#organization" },
    hasPart: examples.map((item)=>({
      "@type": "CreativeWork",
      name: item.title,
      description: item.need
    }))
  };
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <Link href="/solutions-ia" className={styles.crumb}>← AUTONOMIA BUILD</Link>
          <p className={styles.kicker}>DÉMONSTRATEURS & CAS D'USAGE IA</p>
          <h1>Voir ce que l'IA peut faire dans un métier.</h1>
          <p className={styles.lead}>Un dossier, une file de demandes, un planning ou un marché public : nous montrons comment l'IA peut préparer le travail, organiser l'information et proposer des actions, avec validation par les professionnels.</p>
          <div className={styles.heroActions}>
            <Link href="#demos" className={styles.primary}>Explorer les exemples ↓</Link>
            <Link href="/start" className={styles.secondary}>Décrire mon besoin ↗</Link>
          </div>
          <p className={styles.disclosure}>Les deux démonstrations interactives présentées ici utilisent des données entièrement fictives. Elles illustrent un fonctionnement envisageable et ne constituent pas des réalisations déployées chez un client.</p>
        </div>
      </section>

      <section className={styles.content} id="demos">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>LES SITUATIONS À EXPLORER</p>
            <h2>Du travail manuel à une chaîne d'assistance contrôlée.</h2>
          </div>
          <p>Chaque démonstrateur part d'un problème opérationnel et place le professionnel au cœur des vérifications et des arbitrages.</p>
        </div>
        <div className={styles.cards}>
          {examples.map((item,index)=>(
            <article className={styles.card} key={item.id}>
              <div className={styles.cardHead}>
                <span>{String(index+1).padStart(2,"0")}</span>
                <small>{item.status}</small>
              </div>
              <p className={styles.theme}>{item.theme}</p>
              <h3>{item.title}</h3>
              <p className={styles.problem}>{item.need}</p>
              <div className={styles.flow} aria-label="Étapes du processus">
                {item.flow.map((step,i)=>(
                  <span key={step}>{step}{i<item.flow.length-1&&<b aria-hidden="true"> →</b>}</span>
                ))}
              </div>
              <div className={styles.human}><strong>Contrôle humain</strong><p>{item.autonomy}</p></div>
              <Link className={styles.cardCta} href={item.href||"/start"}>{item.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.banner}>
        <div>
          <p className={styles.kicker}>AUTONOMIA BUILD</p>
          <h2>Et si le prochain démonstrateur partait de votre processus ?</h2>
          <p>Montrez-nous une tâche répétitive, vos outils et les points qui doivent rester soumis à validation. Nous explorerons une solution adaptée à votre fonctionnement.</p>
        </div>
        <a href="https://calendly.com/deborah-build-autonomia/30min" target="_blank" rel="noopener noreferrer">Parler de mon projet ↗</a>
      </section>
    </main>
  );
}
