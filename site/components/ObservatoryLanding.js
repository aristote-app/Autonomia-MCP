import MiniModuleLab from "@/components/MiniModuleLab";
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
            <span>6 mini-outils à tester</span>
            <span>Données fictives</span>
            <span>Validation humaine conservée</span>
          </div>
          <a className="primaryButton" href="#mini-modules">Tester les mini-modules</a>
        </div>

        <aside className="obsLeadSticky" id="diagnostic">
          <ObservatoryLeadForm topic={topic} compact />
        </aside>
      </section>

      <MiniModuleLab topic={topic} />

      <section className="obsBuildBlock">
        <p className="sectionIndex">02 — CE QU’AUTONOMIA PEUT CONSTRUIRE</p>
        <div className="obsBuildGrid">
          <article>
            <span>01</span>
            <strong>Un workflow</strong>
            <p>Pour faire circuler une demande, une validation, un contrôle ou une relance entre vos outils.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Un assistant métier</strong>
            <p>Pour rechercher, préparer, synthétiser ou répondre à partir de vos sources et règles validées.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Un mini-applicatif</strong>
            <p>Pour donner à l’équipe une interface dédiée plutôt qu’une suite de prompts ou de copier-coller.</p>
          </article>
        </div>

        <div className="obsBuildCta">
          <div>
            <h2>Votre cas ne ressemble pas exactement aux démos ?</h2>
            <p>Décrivez le travail réel. Le diagnostic sert à traduire votre irritant en premier prototype testable.</p>
          </div>
          <a className="primaryButton" href="#diagnostic">Décrire mon besoin</a>
        </div>
      </section>
    </main>
  );
}
