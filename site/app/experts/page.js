import Link from "next/link";
import { aiRoles } from "@/content/ai-roles";

export const metadata = {
  title: "Experts IA — Sourcing, staffing et pilotage de projets | Autonomia",
  description:
    "Autonomia source, qualifie et mobilise des experts IA partout en France : GenAI, LLM, RAG, Agents IA, Data Science, MLOps, gouvernance, produit et automatisation.",
  alternates: { canonical: "/experts" }
};

const expertStrengths = [
  ["Expertise IA appliquée", "Nous comprenons les rôles, les architectures, les stacks et les livrables attendus. Le sourcing part de la mission réelle, pas d’un intitulé générique."],
  ["Sourcing national", "Nous recherchons des profils partout en France et selon le format utile : présentiel, hybride ou remote."],
  ["Qualification ciblée", "Expériences, autonomie, environnement technique, capacité à produire et adéquation avec le contexte sont examinés avant présentation."],
  ["Pilotage possible", "Autonomia peut rester impliqué dans le cadrage, les points de décision, les livrables et la coordination avec les équipes internes."]
];

const sourcingSteps = [
  ["01", "Cadrer", "Transformer le besoin en mission claire : problème, résultat attendu, niveau d’autonomie, stack, contraintes et livrables."],
  ["02", "Sourcer & qualifier", "Activer notre vivier et plusieurs canaux spécialisés, puis retenir les profils qui correspondent réellement au contexte."],
  ["03", "Mobiliser & piloter", "Organiser la rencontre, le démarrage et, si nécessaire, le suivi du projet avec le consultant et vos équipes."]
];

export default function ExpertsPage() {
  return (
    <main className="pillarPage expertsPillar">
      <section className="pillarHero">
        <div className="pillarHeroMeta">
          <span>AUTONOMIA</span>
          <strong>EXPERTS</strong>
          <small>FRANCE · NATIONAL</small>
        </div>
        <div className="pillarHeroCopy">
          <p className="eyebrow">EXPERTS IA · SOURCING · PILOTAGE</p>
          <h1>Les compétences IA qu’il faut vraiment à votre projet.</h1>
          <p>
            Autonomia comprend le besoin, source les profils, qualifie les compétences et peut rester aux côtés
            de l’entreprise pendant l’exécution. L’objectif n’est pas d’envoyer des CV : c’est de mobiliser
            les bonnes compétences pour le résultat attendu.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="/#diagnostic-ia">Décrire mon besoin</Link>
            <a className="secondaryButton" href="#metiers">Voir les métiers IA</a>
          </div>
        </div>
      </section>

      <section className="pillarStatement pillarStatementCompact">
        <p className="sectionIndex">01 — AUTONOMIA EXPERTS</p>
        <div>
          <h2>Un vivier n’a de valeur que si l’on sait précisément ce que l’on cherche.</h2>
          <p>
            Un même intitulé peut recouvrir des niveaux et des expertises très différents. Nous relions donc
            le sourcing au contexte technique, au métier, à la maturité du projet et aux livrables attendus.
          </p>
        </div>
      </section>

      <section className="pillarStrengthGrid pillarStrengthGridFour">
        {expertStrengths.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="pillarProcess pillarProcessCompact">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">02 — DU BESOIN À LA MISSION</p>
          <div>
            <h2>Trois étapes. Pas une pile de CV.</h2>
            <p>
              Notre méthode reste simple : comprendre, sélectionner, mobiliser. Lorsque le projet le nécessite,
              Autonomia peut aussi coordonner plusieurs expertises ou préparer le transfert vers les équipes internes.
            </p>
          </div>
        </div>

        <ol>
          {sourcingSteps.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="pillarFactBar">
          <span>FRANCE ENTIÈRE</span>
          <strong>Présentiel · Hybride · Remote</strong>
          <p>La localisation est un critère de matching, pas une limite du dispositif.</p>
        </div>
      </section>

      <section className="pillarDirectory" id="metiers">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">03 — EXPERTS PAR MÉTIER</p>
          <div>
            <h2>Explorer les métiers IA.</h2>
            <p>
              Chaque fiche détaille missions, livrables, compétences, questions de cadrage, métiers voisins
              et profils consultants remontés par notre vivier.
            </p>
          </div>
        </div>

        <div className="pillarDirectoryGrid">
          {aiRoles.map((role, index) => (
            <Link href={"/metiers-ia/" + role.slug} key={role.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{role.title}</strong>
                <small>{role.frenchTitle || role.dek}</small>
              </div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="pillarFinalCta pillarFinalCtaCompact">
        <div>
          <p className="eyebrow">BESOIN D’UN EXPERT IA ?</p>
          <h2>Décrivez le problème. Nous traduirons le besoin en compétences.</h2>
        </div>
        <Link className="primaryButton" href="/#diagnostic-ia">Faire le diagnostic IA</Link>
      </section>
    </main>
  );
}
