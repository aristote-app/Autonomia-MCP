import Link from "next/link";
import { academyTrainings } from "@/content/academy-trainings";

export const metadata = {
  title: "Formations IA en entreprise — Autonomia Academy",
  description:
    "Autonomia Academy conçoit et déploie des formations IA partout en France. 10 ans d’expérience formation, sourcing de formateurs et accompagnement des demandes OPCO.",
  alternates: { canonical: "/academy" }
};

const academyStrengths = [
  ["10 ans de formation", "Notre savoir-faire ne commence pas avec l’IA : ingénierie pédagogique, organisation, déploiement et suivi font partie de notre métier depuis une décennie."],
  ["Formateurs sourcés", "Nous recherchons des intervenants qui combinent maîtrise du sujet, expérience professionnelle et capacité à transmettre."],
  ["France entière", "Sessions en présentiel partout en France ou à distance, selon la localisation et l’organisation des équipes."],
  ["OPCO", "Nous pouvons aider à identifier les possibilités de prise en charge et à préparer programme, devis et éléments nécessaires au dossier."]
];

const academyMethod = [
  ["01", "Calibrer", "Public, niveau, usages, outils, objectifs et contraintes déterminent la durée et la profondeur du parcours."],
  ["02", "Former par la pratique", "Les ateliers sont reliés aux situations de travail et produisent des méthodes, prompts, workflows ou livrables réutilisables."],
  ["03", "Rendre autonome", "Du niveau initiation au niveau expert, l’objectif est que les participants sachent refaire seuls ce qui a été appris."]
];

export default function AcademyPage() {
  return (
    <main className="pillarPage academyPillar">
      <section className="pillarHero pillarHeroAcademy">
        <div className="pillarHeroMeta">
          <span>AUTONOMIA</span>
          <strong>ACADEMY</strong>
          <small>FRANCE · NATIONAL</small>
        </div>
        <div className="pillarHeroCopy">
          <p className="eyebrow">FORMATION IA · ENTREPRISE · INTRA · INTER</p>
          <h1>Former les équipes à l’IA avec un vrai savoir-faire de formation.</h1>
          <p>
            Autonomia Academy s’appuie sur 10 ans d’expérience en formation professionnelle pour construire
            les bons parcours, sourcer les formateurs, déployer les sessions partout en France et accompagner
            les entreprises sur les possibilités de financement OPCO.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#formations">Voir les formations IA</a>
            <Link className="secondaryButton" href="/#diagnostic-ia">Construire un parcours sur mesure</Link>
          </div>
        </div>
      </section>

      <section className="pillarStatement pillarStatementCompact">
        <p className="sectionIndex">01 — AUTONOMIA ACADEMY</p>
        <div>
          <h2>Une formation utile commence par le public, pas par l’outil.</h2>
          <p>
            Une direction générale, une équipe RH, un service commercial et des profils techniques n’ont ni
            les mêmes usages ni le même niveau de départ. Nous calibrons le parcours avant de choisir le contenu.
          </p>
        </div>
      </section>

      <section className="pillarStrengthGrid pillarStrengthGridFour academyStrengthGrid">
        {academyStrengths.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="pillarProcess pillarProcessCompact">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">02 — NOTRE APPROCHE</p>
          <div>
            <h2>Calibrer. Pratiquer. Rendre autonome.</h2>
            <p>
              Les parcours peuvent aller de l’initiation à l’expertise, en intra ou en inter. En intra,
              les cas, outils et exercices peuvent être adaptés au contexte de l’entreprise.
            </p>
          </div>
        </div>

        <ol>
          {academyMethod.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="pillarFactBar academyFactBar">
          <span>FINANCEMENT</span>
          <strong>Prise en charge OPCO : jusqu’à 100 % selon éligibilité</strong>
          <p>
            Nous pouvons préparer les éléments du dossier. Toute prise en charge reste soumise aux critères,
            budgets disponibles et à l’accord préalable du financeur.
          </p>
        </div>
      </section>

      <section className="pillarDirectory academyDirectory" id="formations">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">03 — NOS FORMATIONS IA</p>
          <div>
            <h2>Explorer les programmes Autonomia Academy.</h2>
            <p>
              Chaque fiche présente objectifs, public, prérequis, programme détaillé, niveaux, durée,
              tarifs et fiche PDF téléchargeable.
            </p>
          </div>
        </div>

        <div className="pillarDirectoryGrid academyProgramGrid">
          {academyTrainings.map((training, index) => (
            <Link href={"/formation-ia/" + training.slug} key={training.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{training.homeTitle}</strong>
                <small>
                  Initiation {training.introDays} j · Opérationnel {training.standardDays} j · Expert {training.expertDays} j
                </small>
              </div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="pillarFinalCta pillarFinalCtaCompact academyFinalCta">
        <div>
          <p className="eyebrow">BESOIN D’UN PARCOURS SPÉCIFIQUE ?</p>
          <h2>Partons de vos équipes, de leurs usages et de leur niveau.</h2>
        </div>
        <Link className="primaryButton" href="/#diagnostic-ia">Construire mon besoin formation</Link>
      </section>
    </main>
  );
}
