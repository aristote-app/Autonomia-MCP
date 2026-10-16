import Link from "next/link";
import { buildGuides, buildGuideLinks } from "@/content/buildGuides";
import styles from "./buildGuide.module.css";

export default function BuildGuide({ slug }) {
  const guide = buildGuides[slug];
  if (!guide) return null;
  const base = "https://build-autonomia.com";
  const canonical = base + "/" + slug;
  const schema = [
    {"@context":"https://schema.org","@type":"Article",headline:guide.title,description:guide.metaDescription,datePublished:guide.updated,dateModified:guide.updated,mainEntityOfPage:canonical,author:{"@type":"Organization",name:"AUTONOMIA",url:base},publisher:{"@type":"Organization",name:"AUTONOMIA",url:base}},
    {"@context":"https://schema.org","@type":"FAQPage",mainEntity:guide.faq.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
  ];

  return <main className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className={styles.hero}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Navigation"><Link href="/">Accueil</Link><span> / </span><Link href="/solutions-ia">AUTONOMIA BUILD</Link><span> / Guide</span></nav>
        <p className={styles.kicker}>{guide.eyebrow}</p>
        <h1>{guide.title}</h1>
        <p className={styles.intro}>{guide.intro}</p>
        <div className={styles.actions}>
          <Link href="/start" className={styles.primary}>Décrire mon besoin IA ↗</Link>
          <a href="https://calendly.com/deborah-build-autonomia/30min" target="_blank" rel="noopener noreferrer" className={styles.outline}>Prendre RDV ↗</a>
        </div>
        <p className={styles.updated}>Contenu actualisé le 16 octobre 2026 · Guide méthodologique AUTONOMIA</p>
      </div>
    </section>
    <div className={styles.shell}>
      <section className={styles.highlights} aria-label="Points essentiels">{guide.highlights.map(item=><article key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>)}</section>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={styles.summary}>
            <p className={styles.kicker}>EN BREF</p>
            <h2>Le point de départ</h2>
            <p>{guide.summary}</p>
          </section>
          {guide.sections.map((section,index)=><section className={styles.section} key={section.title} id={"section-"+index}>
            <div className={styles.sectionHeading}><small>{String(index+1).padStart(2,"0")}</small><div><h2>{section.title}</h2><p>{section.lead}</p></div></div>
            <div className={styles.items}>{section.items.map(([label,detail])=><article key={label}><h3>{label}</h3><p>{detail}</p></article>)}</div>
          </section>)}
          <section className={styles.scenario}>
            <p className={styles.kicker}>{guide.scenario.eyebrow}</p>
            <h2>{guide.scenario.title}</h2>
            <p>{guide.scenario.context}</p>
            <div className={styles.comparison}><article><h3>Aujourd'hui</h3><ol>{guide.scenario.before.map(t=><li key={t}>{t}</li>)}</ol></article><article><h3>Flux envisageable</h3><ol>{guide.scenario.after.map(t=><li key={t}>{t}</li>)}</ol></article></div>
            <p className={styles.disclaimer}>{guide.scenario.caveat}</p>
          </section>
          <section className={styles.section}>
            <div className={styles.sectionHeading}><small>✓</small><div><h2>Livrables à demander à votre prestataire</h2><p>Avant de signer, clarifiez ce qui sera réellement remis, testé, exploité et maintenu.</p></div></div>
            <ul className={styles.deliverables}>{guide.deliverables.map(t=><li key={t}>{t}</li>)}</ul>
          </section>
          <section className={styles.faq} aria-label="Questions fréquentes"><p className={styles.kicker}>FAQ</p><h2>Questions fréquentes</h2>{guide.faq.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <span className={styles.kicker}>UN PROJET CONCRET ?</span>
            <h2>Partez de votre processus.</h2>
            <p>Présentez le travail à simplifier, vos logiciels et les validations importantes. Nous étudierons la solution adaptée.</p>
            <Link href="/start" className={styles.primary}>Laisser mes coordonnées ↗</Link>
            <a href="https://calendly.com/deborah-build-autonomia/30min" target="_blank" rel="noopener noreferrer" className={styles.sideLink}>Ou réserver un RDV ↗</a>
          </div>
          <div className={styles.related}><h3>À lire également</h3>{buildGuideLinks.filter(([key])=>key!==slug).map(([key,label])=><Link href={"/"+key} key={key}>{label} ↗</Link>)}<Link href="/demonstrateurs-ia">Voir les démonstrateurs ↗</Link><Link href="/solutions-ia">Nos offres BUILD ↗</Link></div>
        </aside>
      </div>
      <section className={styles.bottomBanner}><div><p className={styles.kicker}>AUTONOMIA BUILD</p><h2>Une machine utile commence par un problème clair.</h2><p>Automatisation, agent IA ou application sur mesure : le choix se fait avec vos équipes, sur des cas réels et vérifiables.</p></div><Link href="/start">Présenter mon besoin ↗</Link></section>
    </div>
  </main>;
}
