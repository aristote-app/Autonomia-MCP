import Link from "next/link";
import { aiGlossaryTerms } from "@/content/ai-glossary";

export const metadata = {
  title: "Glossaire IA en entreprise — RAG, agents, LLMOps, grounding",
  description:
    "Définitions opérationnelles des principaux concepts IA utilisés en entreprise : RAG, agents IA, human-in-the-loop, chunking, embeddings, LLMOps, guardrails et gouvernance.",
  alternates: { canonical: "/glossaire-ia" }
};

export default function AIGlossaryPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/glossaire-ia`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${url}#glossary`,
    name: "Glossaire IA Autonomia",
    description:
      "Définitions opérationnelles des concepts utilisés dans les projets, automatisations et formations IA en entreprise.",
    url,
    creator: { "@id": `${base}#organization` },
    hasDefinedTerm: aiGlossaryTerms.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      termCode: item.slug,
      description: item.definition,
      url: `${url}#${item.slug}`,
      inDefinedTermSet: { "@id": `${url}#glossary` }
    }))
  };

  return (
    <main className="methodologyPage glossaryPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA / GLOSSAIRE IA</p>
        <h1>Les mots de l’IA, définis pour pouvoir décider.</h1>
        <p>
          Des définitions opérationnelles, reliées aux projets réels : ce que le terme signifie,
          ce qu’il ne faut pas lui faire dire et où approfondir dans la bibliothèque Autonomia.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">POURQUOI CE GLOSSAIRE</p>
        <div>
          <h2>Un vocabulaire précis évite de choisir une architecture sur un mot à la mode.</h2>
          <p>
            “Agent”, “RAG”, “grounding”, “copilot” ou “guardrail” désignent des concepts différents
            qui ont des conséquences sur les données, les outils, les contrôles et les compétences nécessaires.
            Cette page sert de référence commune aux guides Experts et Academy.
          </p>
        </div>
      </section>

      <section className="glossaryGrid">
        {aiGlossaryTerms.map((item) => (
          <article key={item.slug} id={item.slug}>
            <div className="glossaryTermHeader">
              <span>{String(aiGlossaryTerms.indexOf(item) + 1).padStart(2, "0")}</span>
              <h2>{item.term}</h2>
            </div>
            <p>{item.definition}</p>
            <div className="glossaryLinks">
              {item.related.map((href) => (
                <Link key={href} href={href}>Approfondir →</Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="pillarBridge">
        <p className="sectionIndex">ALLER PLUS LOIN</p>
        <div>
          <h2>Passer des définitions aux systèmes et aux compétences.</h2>
          <div className="closingActions">
            <Link className="primaryButton" href="/cas-usage-ia">Cas d’usage Experts</Link>
            <Link className="secondaryButton" href="/formation-ia/cas-usage">Cas d’usage Formation</Link>
            <Link className="secondaryButton" href="/scan-ia">Autonomia Scan</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
