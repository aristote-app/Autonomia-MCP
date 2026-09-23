import Link from "next/link";
import { academyTrainings } from "@/content/academy-trainings";

export const metadata = {
  title: "Formations IA en entreprise — Autonomia Academy",
  description:
    "Autonomia Academy conçoit et déploie des formations IA partout en France. 10 ans d’expérience formation, sourcing de formateurs, programmes de l’initiation à l’expert et accompagnement des demandes OPCO.",
  alternates: { canonical: "/academy" },
  openGraph: {
    title: "Autonomia Academy — Formations IA partout en France",
    description:
      "Formations IA, ChatGPT, Copilot, agents, automatisation, RAG, gouvernance et métiers. Intra, inter et accompagnement OPCO.",
    url: "/academy"
  }
};

const academyStrengths = [
  ["10 ans de formation", "Nous construisons, organisons et déployons des actions de formation professionnelle depuis une décennie. L’IA s’appuie sur ce savoir-faire pédagogique et opérationnel."],
  ["Sourcing de formateurs", "Nous savons rechercher et sélectionner des intervenants capables de maîtriser le sujet technique tout en le rendant compréhensible à un public professionnel."],
  ["Dimension nationale", "Les formations peuvent être organisées partout en France, en présentiel ou à distance, selon les contraintes des équipes et des entreprises."],
  ["Du débutant à l’expert", "Les programmes existent en initiation, opérationnel et expert afin d’éviter de proposer le même contenu à des publics de maturité différente."],
  ["Formation métier", "Les cas, exercices et livrables peuvent être reliés aux processus réels : RH, commercial, management, marketing, finance, support, IT, data ou direction."],
  ["Financement OPCO", "Nous savons accompagner les entreprises dans l’identification des possibilités de prise en charge et la préparation des éléments nécessaires à une demande OPCO."]
];

const academyMethod = [
  ["01", "Comprendre le public", "Métier, niveau actuel, outils disponibles, objectifs, environnement de travail et contraintes."],
  ["02", "Calibrer le parcours", "Durée, niveau, cas pratiques, outils, modalités et livrables adaptés au contexte réel."],
  ["03", "Sourcer le bon formateur", "Nous cherchons la bonne combinaison entre expertise technique, expérience professionnelle et pédagogie."],
  ["04", "Former par la pratique", "Les participants travaillent sur des cas d’usage concrets, des exercices et des méthodes réutilisables."],
  ["05", "Faciliter le financement", "Lorsque le dossier est éligible, nous accompagnons la demande de prise en charge auprès de l’OPCO concerné."]
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
          <h1>Former les équipes à l’IA avec l’expérience d’un spécialiste de la formation.</h1>
          <p>
            Autonomia Academy s’appuie sur 10 ans d’expérience dans la formation professionnelle pour construire
            des parcours IA utiles, sourcer les bons formateurs, déployer les sessions partout en France
            et accompagner les entreprises sur les possibilités de financement OPCO.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#formations">Voir les formations IA</a>
            <Link className="secondaryButton" href="/#diagnostic-ia">Construire un parcours sur mesure</Link>
          </div>
        </div>
      </section>

      <section className="pillarStatement">
        <p className="sectionIndex">01 — NOTRE MÉTIER AVANT L’IA</p>
        <div>
          <h2>Nous ne découvrons pas la formation avec l’arrivée de ChatGPT.</h2>
          <p>
            Concevoir un bon programme ne consiste pas à empiler des fonctionnalités d’outil.
            Il faut comprendre le public, le niveau initial, les situations de travail, les objectifs pédagogiques,
            le rythme d’apprentissage et ce que les participants doivent être capables de refaire seuls après la session.
          </p>
        </div>
      </section>

      <section className="pillarStrengthGrid academyStrengthGrid">
        {academyStrengths.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="pillarProcess">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">02 — COMMENT NOUS CONSTRUISONS UNE FORMATION</p>
          <div>
            <h2>Un programme part du travail réel, pas seulement du logiciel.</h2>
            <p>
              Une même formation “ChatGPT” ne doit pas ressembler pour une direction générale, une équipe RH,
              un service commercial ou des utilisateurs déjà avancés.
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
      </section>

      <section className="pillarFunding">
        <div>
          <p className="sectionIndex">03 — FINANCEMENT OPCO</p>
          <h2>Nous savons aussi travailler la question du budget formation.</h2>
        </div>
        <div>
          <p>
            Selon votre branche, votre entreprise, les budgets disponibles et les critères du financeur,
            une demande de prise en charge OPCO peut être étudiée et peut aller jusqu’à 100 % du coût de formation.
          </p>
          <p>
            Autonomia peut vous aider à identifier l’OPCO concerné, préparer le programme, le devis et les éléments
            nécessaires au dossier. La prise en charge reste soumise à l’éligibilité et à l’accord préalable du financeur.
          </p>
        </div>
      </section>

      <section className="pillarNational">
        <p className="sectionIndex">04 — FRANCE ENTIÈRE</p>
        <div>
          <h2>Une organisation nationale pour former les équipes où elles travaillent.</h2>
          <p>
            Nous pouvons organiser des formations en présentiel dans les différentes régions ou déployer des parcours
            à distance lorsque les équipes sont réparties. Le sourcing formateur tient compte du sujet, du niveau,
            de la pédagogie attendue et de la localisation lorsque la session est présentielle.
          </p>
        </div>
      </section>

      <section className="pillarDark academyDark">
        <div>
          <p className="sectionIndex">05 — PLUS QU’UNE SESSION</p>
          <h2>Former, puis rendre la pratique réutilisable.</h2>
        </div>
        <div className="pillarDarkPoints">
          <p><strong>Cas réels.</strong> Les exercices peuvent être construits autour des situations de travail des participants.</p>
          <p><strong>Livrables.</strong> Bibliothèques de prompts, workflows, checklists, assistants, grilles de contrôle ou plans d’adoption selon le parcours.</p>
          <p><strong>Par niveaux.</strong> Initiation, opérationnel et expert pour éviter de ralentir les plus avancés ou de perdre les débutants.</p>
          <p><strong>Sur mesure.</strong> En intra, le programme peut être adapté aux outils, politiques internes et priorités de l’entreprise.</p>
          <p><strong>Experts + Academy.</strong> Une mission consultant peut être complétée par un parcours de transfert de compétences aux équipes internes.</p>
        </div>
      </section>

      <section className="pillarDirectory academyDirectory" id="formations">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">06 — NOS FORMATIONS IA</p>
          <div>
            <h2>Explorer les programmes Autonomia Academy.</h2>
            <p>
              Chaque fiche présente objectifs, public, prérequis, programme détaillé, cas pratiques, niveaux,
              durée, tarifs et fiche PDF téléchargeable.
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

      <section className="pillarFinalCta academyFinalCta">
        <div>
          <p className="eyebrow">BESOIN D’UN PARCOURS SPÉCIFIQUE ?</p>
          <h2>Partez de votre public, de vos usages et de votre niveau de maturité.</h2>
          <p>
            Nous pouvons adapter la durée, le niveau, les outils, les ateliers et les cas pratiques à votre organisation.
          </p>
        </div>
        <Link className="primaryButton" href="/#diagnostic-ia">Construire mon besoin formation</Link>
      </section>
    </main>
  );
}
