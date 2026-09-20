import Link from "next/link";
import LiveJobSignals from "@/components/LiveJobSignals";
import { getEditorialGraph } from "@/lib/editorialGraph";
import { getRelatedGlossaryTermsForText } from "@/content/ai-glossary";

export default function EditorialArticle({ article }) {
  const isTraining = article.type === "training";
  const graph = getEditorialGraph(article);
  const glossaryTerms = getRelatedGlossaryTermsForText(
    [
      article.title,
      article.dek,
      article.summary,
      article.cluster,
      ...(article.sections || []).map((section) => section.heading)
    ].join(" ")
  );
  const manualRelated = article.related || [];
  const automaticRelated = [
    ...(graph.pillar ? [graph.pillar] : []),
    ...graph.related,
    ...(graph.mirror ? [graph.mirror] : []),
    ...graph.adjacentPillars
  ];
  const related = [...manualRelated, ...automaticRelated]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index)
    .slice(0, 6);

  return (
    <main className="editorialArticle">
      <nav className="articleBreadcrumb" aria-label="Fil d’Ariane">
        <Link href="/">Autonomia</Link>
        <span>→</span>
        <Link href={isTraining ? "/formation-ia/cas-usage" : "/cas-usage-ia"}>
          {isTraining ? "Formation IA" : "Cas d’usage IA"}
        </Link>
        {graph.pillar && (
          <>
            <span>→</span>
            <Link href={graph.pillar.href}>{graph.pillar.label}</Link>
          </>
        )}
      </nav>

      <header className={isTraining ? "articleHero training" : "articleHero execution"}>
        <div className="articleHeroMeta">
          <span>{isTraining ? "SCÉNARIO DE FORMATION" : "SCÉNARIO IA"}</span>
          <span>{article.readingTime}</span>
          <span>Publié le {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(article.publishedAt))}</span>
          {article.modifiedAt && article.modifiedAt !== article.publishedAt && (
            <span>Mis à jour le {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(article.modifiedAt))}</span>
          )}
        </div>
        <p className="eyebrow">{article.cluster}</p>
        <h1>{article.title}</h1>
        <p className="articleDek">{article.dek}</p>
        <div className="articleTrustLine">
          <span>Publié sous la responsabilité éditoriale d’Autonomia.</span>
          <Link href="/methodologie/politique-editoriale">Méthode de vérification →</Link>
        </div>
        <div className="articleEditorialMeta">
          <span>Publié par <Link href="/a-propos">Autonomia</Link></span>
          {article.publishedAt && <span>Publié le {new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>}
          {article.modifiedAt && <span>Mis à jour le {new Date(article.modifiedAt).toLocaleDateString("fr-FR")}</span>}
          <Link href="/methodologie/politique-editoriale">Méthode éditoriale</Link>
        </div>
        <div className="articleQuickFacts">
          {article.quickFacts.map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </header>

      <section className="articleLayout">
        <aside className="articleToc">
          <span>Dans cette page</span>
          <nav>
            {article.sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}>
                {String(index + 1).padStart(2, "0")} — {section.heading}
              </a>
            ))}
          </nav>
        </aside>

        <article className="articleBody">
          <div className="articleSummary">
            <strong>En bref</strong>
            <p>{article.summary}</p>
          </div>

          {glossaryTerms.length > 0 && (
            <nav className="articleEntities" aria-label="Concepts IA liés à ce guide">
              <span>CONCEPTS LIÉS</span>
              <div>
                {glossaryTerms.map((item) => (
                  <Link key={item.slug} href={`/glossaire-ia#${item.slug}`}>
                    {item.term}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {article.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <p className="sectionIndex">{section.kicker}</p>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.steps && (
                <ol className="articleSteps">
                  {section.steps.map((step) => (
                    <li key={step.title}>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </li>
                  ))}
                </ol>
              )}
              {section.callout && (
                <div className="articleCallout">
                  <strong>{section.callout.title}</strong>
                  <p>{section.callout.text}</p>
                </div>
              )}
            </section>
          ))}

          <LiveJobSignals tags={article.jobSignalTags || []} />

          <section className="articleFaq">
            <p className="sectionIndex">FAQ</p>
            <h2>Questions fréquentes</h2>
            {article.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>

          <section className="articleSources">
            <p className="sectionIndex">SOURCES & VÉRIFICATION</p>
            <h2>Ce qui a été vérifié</h2>
            <p>{article.sourceNote}</p>
            <ul>
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section className="articleRelated">
              <p className="sectionIndex">GRAPHE SÉMANTIQUE</p>
              <h2>Continuer par le pilier, un scénario proche ou son pendant Experts / Academy.</h2>
              <div className="articleRelatedGrid">
                {related.map((item) => (
                  <Link key={item.href} href={item.href} className="articleRelatedCard">
                    <small>{item.kicker}</small>
                    <strong>{item.label}</strong>
                    <span>Explorer →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="articleCta">
            <p className="eyebrow">AUTONOMIA</p>
            <h2>{isTraining ? "Vous voulez transformer ce scénario en formation pour vos équipes ?" : "Vous voulez transformer ce scénario en système réel ?"}</h2>
            <p>{isTraining ? "Autonomia Academy part des usages, des outils et du niveau de vos équipes." : "Autonomia Experts peut vous aider à traduire le besoin en compétences et en architecture d’exécution."}</p>
            <Link className="primaryButton" href={isTraining ? "/formation-ia-entreprise" : "/expert-ia"}>
              {isTraining ? "Construire le parcours" : "Cadrer le besoin"}
            </Link>
          </section>
        </article>
      </section>
    </main>
  );
}
