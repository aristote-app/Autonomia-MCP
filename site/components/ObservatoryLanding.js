import ObservatoryLeadForm from "@/components/ObservatoryLeadForm";

export default function ObservatoryLanding({ topic }) {
  return (
    <main className="obsLanding">
      <section className="obsLandingHero">
        <div className="obsLandingCopy">
          <p className="eyebrow">{topic.group.toUpperCase()} · AUTONOMIA</p>
          <h1>{topic.headline}</h1>
          <p>{topic.intro}</p>
          <div className="obsPromiseRow">
            <span>6 transformations concrètes</span>
            <span>Contrôle humain explicite</span>
            <span>Cas d’usage cadrables rapidement</span>
          </div>
        </div>
        <aside className="obsLeadSticky">
          <ObservatoryLeadForm topic={topic} compact />
        </aside>
      </section>

      <section className="obsTransformations">
        <p className="sectionIndex">01 — CE QUE L’ON PEUT TRANSFORMER</p>
        <div className="obsTransformationGrid">
          {topic.modules.map(([title, today, transform, result], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <div>
                <p><b>Aujourd’hui</b>{today}</p>
                <p><b>Avec Autonomia</b>{transform}</p>
                <p><b>Résultat visé</b>{result}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="obsLandingBridge">
        <div>
          <p className="sectionIndex">02 — DE A À B</p>
          <h2>On ne remplace pas l’équipe. On enlève ce qui l’use.</h2>
        </div>
        <div className="obsAB">
          <article>
            <span>A</span>
            <strong>Avant</strong>
            <p>Informations dispersées, doubles saisies, contrôles manuels, relances et tâches qui s’accumulent.</p>
          </article>
          <article>
            <span>B</span>
            <strong>Après</strong>
            <p>Préparation automatisée, exceptions visibles, validation humaine et temps rendu aux tâches à valeur.</p>
          </article>
        </div>
      </section>

      <section className="obsLandingCta">
        <div>
          <p className="eyebrow">VOTRE CAS EST DIFFÉRENT ?</p>
          <h2>Décrivez-le en langage naturel.</h2>
          <p>Nous pouvons traduire votre irritant en cas d’usage, workflow ou mini-applicatif testable.</p>
        </div>
        <ObservatoryLeadForm topic={topic} />
      </section>
    </main>
  );
}
